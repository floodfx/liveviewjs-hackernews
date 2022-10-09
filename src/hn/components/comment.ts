import { html, JS, LiveViewTemplate, safe } from "liveviewjs";
import { HNItem } from "../types";

/**
 * Renders a comment and its children (recursively).  Uses JS Commands
 * to toggle the visibility of the comment and it's children.
 */
export function Comment(item: HNItem): LiveViewTemplate {
  const { by, kids, text, children, time_ago } = new HNItem(item);
  const kids_count = kids?.length || 0;
  const comment_id = "comment_" + item.id;
  const id = "toggle_" + item.id;
  const c_id = "children_" + item.id;
  return html`
    <li class="comment">
      <div>
        <a class="by" href="/users/${by}">${by}</a> ${time_ago}
        <span class="toggle open" id=${id}>
          <span phx-click="${new JS().remove_class("open", { to: "#" + id }).hide({ to: "#" + comment_id })}">
            [-]
          </span>
          <span phx-click="${new JS().add_class("open", { to: "#" + id }).show({ to: "#" + comment_id })}">
            [+] comments collapsed
          </span>
        </span>
        <div id="${comment_id}">
          <div class="text">${safe(text)}</div>
          ${kids_count > 0
            ? html`
                <ul class="comment-children" id=${c_id}>
                  ${renderComments(children!)}
                </ul>
              `
            : html``}
        </div>
      </div>
    </li>
  `;
}

function renderComments(comments: HNItem[]): LiveViewTemplate[] {
  if (!comments || comments.length === 0) {
    return [];
  }
  return comments.map((c) => Comment(c));
}
