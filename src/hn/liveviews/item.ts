import { createLiveView, html, LiveViewTemplate, SingleProcessPubSub } from "liveviewjs";
import { getItem } from "src/hn-api";
import { Comment } from "../components/comment";
import { Nav } from "../components/nav";
import { HNItem } from "../types";

type Context = {
  item: HNItem;
};

// helper to allow this liveview to listen for item updates
const pubSub = new SingleProcessPubSub();

/**
 * Renders a single item (story, job, comment, etc) and subscribes to
 * updates to the item.
 */
export const itemLV = createLiveView<Context>({
  mount: async (socket, _, params) => {
    const item = await getItem(+params.id, true);
    socket.pageTitle(item.title);
    socket.assign({ item });
    // subscribe to update for this item
    socket.subscribe("item-" + item.id);
    // tell the api to send updates for this item
    pubSub.broadcast("item-update", item.id);
  },
  handleInfo: async (info, socket) => {
    // refect the item when we get updates from the api
    const item = await getItem(+socket.context.item.id, true);
    socket.assign({ item });
  },
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
  const { url, title, score, by, kids, children, domain, time_ago } = new HNItem(item);
  const kids_count = kids?.length || 0;
  return html`
    <div class="item-view">
      <div class="item-view-header">
        ${url !== undefined
          ? html`<a href="${url}" target="_blank">
              <h1>${title}</h1>
            </a>`
          : html`<h1>${title}</h1>`}
        ${domain && html` <span class="host">${domain}</span> `}
        <p class="meta">
          ${score} points | by <a href="/users/${by}">${by}</a>
          ${time_ago} ago
        </p>
      </div>
      <div class="item-view-comments">
        <p class="item-view-comments-header">${kids_count > 0 ? kids_count + " comments" : "No comments yet."}</p>
        <ul class="comment-children">
          ${!!children ? children.map((c: HNItem) => Comment(c)) : html``}
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
