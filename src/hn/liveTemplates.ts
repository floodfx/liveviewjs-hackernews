import { html, LiveTitleOptions, LiveViewHtmlPageTemplate, LiveViewTemplate, live_title_tag, safe } from "liveviewjs";

/**
 * Template for the "root" of all LiveViews automatically called by LiveViewJS when
 * a LiveView is mounted. This template is responsible for rendering the HTML surrounding
 * the LiveView's content.
 *
 * @param liveTitleOptions the LiveTitleOptions for dynamic titles (i.e. setTitle)
 * @param csrfToken the CSRF token value that should be embedded into a <meta/> tag named "csrf-token". LiveViewJS uses this to validate socket requests
 * @param liveViewContent the content rendered by the LiveView
 * @returns a LiveViewTemplate that can be rendered by the LiveViewJS server
 */
export const htmlPageTemplate: LiveViewHtmlPageTemplate = (
  liveTitleOptions: LiveTitleOptions,
  csrfToken: string,
  liveViewContent: LiveViewTemplate
): LiveViewTemplate => {
  const title = liveTitleOptions?.title ?? "";
  const prefix = liveTitleOptions?.prefix ?? "";
  const suffix = liveTitleOptions?.suffix ?? "";
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="csrf-token" content="${csrfToken}" />
        ${live_title_tag(title, { prefix, suffix })}
        <script defer type="text/javascript" src="/js/index.js"></script>
        <link rel="stylesheet" href="/css/global.css" />
      </head>
      <body>
        ${safe(liveViewContent)}
      </body>
    </html>
  `;
};
