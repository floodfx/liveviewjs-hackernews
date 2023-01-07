import { createLiveView, html, live_patch, safe } from "liveviewjs";
import { getItem, getItems, listenForItemUpdates, maxPage, StoryTypes } from "src/hn-api";
import { ItemSummary } from "../components/item_summary";
import { Nav } from "../components/nav";
import { HNItem } from "../types";

/**
 * Shape of the context for the index liveview.
 */
type IndexContext = {
  items: HNItem[];
  page: number;
  storyType: StoryTypes;
};

/**
 * Index LiveView that shows a list of items and handles navigation
 * and pagination.
 */
export const indexLV = createLiveView<IndexContext>({
  // mount is called when the liveview is first created
  // both for http and websocket requests
  mount: async (socket, session, params) => {
    const storyType = (params.type as StoryTypes) ?? "top";
    socket.assign({ items: [], page: 0, storyType });
  },
  // handleParams is called when the liveview is mounted
  // and any time the url changes
  handleParams: async (url, socket) => {
    // extract first part of path for item type
    let storyType = url.pathname.split("/")[1] as StoryTypes;
    if (storyType.length === 0) {
      storyType = socket.context.storyType;
    }
    // load the items for the page
    let page = +(url.searchParams.get("page") || 1);
    const items = await getItems(storyType, page);
    // subscribe to item updates
    items.forEach((item) => {
      socket.subscribe("item-" + item.id);
      listenForItemUpdates(item.id);
    });
    socket.assign({ items, page, storyType });
  },
  // handleInfo is called when the liveview receives an update
  // from the item subscriptions
  handleInfo: async (info, socket) => {
    const { id } = info;
    const item = await getItem(id, false);
    const items = socket.context.items.map((i) => (i.id === id ? item : i));
    socket.assign({ items });
  },
  // render is called after handleParams
  render: async (context) => {
    const { items, page, storyType } = context;
    const max = maxPage(storyType);
    return html`
      ${Nav(true)}
      <div class="news-view">
        <div class="news-list-nav">
          ${navHelper(page > 1, "&lt; prev", storyType, page - 1)}
          <span>page ${page}</span>
          ${navHelper(page < max, "more &gt;", storyType, page + 1)}
        </div>
        <main class="news-list">
          ${items.length > 0 &&
          html`
            <ul id="the-items">
              ${items.map(ItemSummary)}
            </ul>
          `}
        </main>
      </div>
    `;
  },
});

function navHelper(enabled: boolean, label: string, itemType: string, nextPage: number) {
  if (!enabled) {
    return html`<span class="page-link disabled" aria-disabled="true">${safe(label)}</span>`;
  }
  return live_patch(safe(label), {
    to: {
      path: "/" + itemType,
      params: { page: "" + nextPage },
    },
  });
}
