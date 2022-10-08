import { createLiveView, html, live_patch, safe } from "liveviewjs";
import { getItems, maxPage } from "src/hn-api";
import { ItemSummary } from "../components/item_summary";
import { Nav } from "../components/nav";
import { HNItem } from "../types";

type IndexContext = {
  items: HNItem[];
  page: number;
  itemType: string;
};

/**
 * Index LiveView that shows a list of items and handles navigation
 * and pagination.
 */
export const indexLV = createLiveView<IndexContext>({
  mount: async (socket, session, params) => {
    const itemType = (params.type as string) ?? "top";
    socket.assign({ items: [], page: 0, itemType });
  },
  handleParams: async (url, socket) => {
    // extract first part of path for item type
    let itemType = url.pathname.split("/")[1];
    if (itemType.length === 0) {
      itemType = socket.context.itemType;
    }
    let page = +(url.searchParams.get("page") || 1);
    const items = await getItems(itemType, page);
    socket.assign({ items, page, itemType });
  },
  render: async (context) => {
    const { items, page, itemType } = context;
    const max = maxPage(itemType);
    return html`
      ${Nav(true)}
      <div class="news-view">
        <div class="news-list-nav">
          ${navHelper(page > 1, "&lt; prev", itemType, page - 1)}
          <span>page ${page}</span>
          ${navHelper(page < max, "more &gt;", itemType, page + 1)}
        </div>
        <main class="news-list">
          ${items.length > 0 &&
          html`
            <ul>
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
