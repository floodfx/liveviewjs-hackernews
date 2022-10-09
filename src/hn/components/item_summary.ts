import { html } from "liveviewjs";
import { HNItem } from "../types";

/**
 * Renders a summary for an HN item.  Used in the index page for all
 * item types: top, new, best, show, ask, job.
 */
export function ItemSummary(item: HNItem) {
  const { id, url, score, title, type, by, kids, domain, time_ago } = new HNItem(item);
  const kids_count = kids?.length || 0;
  return html`
    <li class="news-item">
      ${type === "job" ? html`` : html`<span class="score">${score}</span>`}
      <span class="title">
        ${url && !url.startsWith("item?id=")
          ? html`      
            <a href="${url}" target="_blank" rel="noreferrer">
              ${title}
            </a>
            <span class="host">${domain}</span>
          </>
        `
          : html`<a href="/item/${id}">${title}</a>`}
      </span>
      <br />
      <span class="meta">
        ${type !== "job"
          ? html` by <a href="/users/${by}">${by}</a> ${time_ago} |
              <a href="/stories/${id}"> ${kids_count ? `${kids_count} comments` : "discuss"} </a>`
          : html`<a href="/stories/${id}">${time_ago}</a>`}
      </span>
      ${type === "job" ? html`<span class="label">${type}</span>` : html``}
    </li>
  `;
}
