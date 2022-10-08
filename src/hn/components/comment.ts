import { when } from "lit/directives/when.js";
import { html, LiveViewTemplate, safe } from "liveviewjs";
import { HNItem } from "../types";

/**
 * Renders a comment and its children (recursively).  Uses
 * the lv-toggle web component to collapse/expand comments.
 */
export function Comment(item: HNItem): LiveViewTemplate {
  const { by, kids, text, children, time_ago } = new HNItem(item);
  const kids_count = kids?.length || 0;
  return html`
    <li class="comment">
      <div>
        <a class="by" href="/users/${by}">${by}</a> ${time_ago}
        <lv-toggle>
          <div class="text">${safe(text)}</div>
          ${when(
            kids_count > 0,
            () => html`
              <ul class="comment-children">
                ${renderComments(children!)}
              </ul>
            `,
            () => html``
          )}
        </lv-toggle>
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
