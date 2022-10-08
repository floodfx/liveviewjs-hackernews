import { html, LiveViewTemplate, live_patch } from "liveviewjs";

/**
 * Renders the navigation bar.  If the LiveView is an "index" page, then
 * the nav bar links are rendered as live links.  Otherwise, they are
 * rendered as regular links which loads the LiveView for that page.
 */
export function Nav(isIndex: boolean) {
  return html`
    <header class="header">
      <nav class="inner">
        <a href="/">
          <strong>HN</strong>
        </a>
        ${patchOrRedirect(isIndex, html`<strong>New</strong>`, "/new")}
        ${patchOrRedirect(isIndex, html`<strong>Show</strong>`, "/show")}
        ${patchOrRedirect(isIndex, html`<strong>Ask</strong>`, "/ask")}
        ${patchOrRedirect(isIndex, html`<strong>Jobs</strong>`, "/job")}
        <a class="github" href="http://github.com/floodfx/liveviewjs" target="_blank" rel="noreferrer">
          Built with LiveViewJS
        </a>
      </nav>
    </header>
  `;
}

function patchOrRedirect(isIndex: boolean, content: LiveViewTemplate, path: string) {
  if (isIndex) {
    return html`<a href="${path}">${content}</a>`;
  }
  return live_patch(content, { to: { path } });
}
