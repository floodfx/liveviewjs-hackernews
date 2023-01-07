import { createLiveView, html, LiveViewTemplate } from "liveviewjs";
import { getItem, listenForItemUpdates } from "src/hn-api";
import { Comment } from "../components/comment";
import { Nav } from "../components/nav";
import { HNItem } from "../types";

type Context = {
  item: HNItem;
};

/**
 * Renders a single item (story, job, comment, etc) and subscribes to
 * updates to the item.
 */
export const itemLV = createLiveView<Context>({
  // mount is called for both the http and websocket requests
  // but only once per request type
  mount: async (socket, _, params) => {
    const item = await getItem(+params.id, true);
    socket.pageTitle(item.title);
    socket.assign({ item });
    // subscribe to update for this item
    socket.subscribe("item-" + item.id);
    // tell the api to send updates for this item
    listenForItemUpdates(item.id);
  },
  // handleInfo is called when the liveview receives an update
  // from the item subscription
  handleInfo: async (info, socket) => {
    // we don't actually look at the info message since we
    // already have the item id in the context
    const item = await getItem(+socket.context.item.id, true);
    socket.assign({ item });
  },
  // render is called initially after mount then subsequently
  // after handleInfo
  render: (context) => {
    const { item } = context;
    switch (item.type) {
      case "story":
        return withNav(Item(item));
      case "comment":
        return withNav(Comment(item));
      case "job":
        return withNav(Job(item));
      default:
        return withNav(html`<p>TODO: ${item.type}</p>`);
    }
  },
});

function withNav(t: LiveViewTemplate) {
  return html`${Nav(false)}${t}`;
}

function Item(item: HNItem) {
  const { url, title, score, by, visibleChildren, domain, time_ago, commentCount } = new HNItem(item);
  return html`
    <div class="item-view">
      <div class="item-view-header">
        ${url !== undefined
          ? html`<a href="${url}" target="_blank">
              <h1>${title}</h1>
            </a>`
          : html`<h1>${title}</h1>`}
        ${domain && html`<span class="host">${domain}</span>`}
        <p class="meta">
          <span id="meta_score" phx-hook="HighlightChange">${score}</span> points | by
          <a href="/users/${by}">${by}</a>
          ${time_ago}
        </p>
      </div>
      <div class="item-view-comments">
        <p id="comment_count" class="item-view-comments-header" phx-hook="HighlightChange">
          ${commentCount > 0 ? commentCount + " comments" : "No comments yet."}
        </p>
        <ul class="comment-children">
          ${visibleChildren ? visibleChildren.map((c: HNItem) => Comment(c)) : html``}
        </ul>
      </div>
    </div>
  `;
}

function Job(item: HNItem) {
  const { url, title, domain, time_ago } = new HNItem(item);
  return html` <div class="item-view">
    <div class="item-view-header">
      <a href="${url}" target="_blank">
        <h1>${title}</h1>
      </a>
      ${domain && html` <span class="host">${domain}</span> `}
    </div>
    <p class="meta">${time_ago}</p>
  </div>`;
}
