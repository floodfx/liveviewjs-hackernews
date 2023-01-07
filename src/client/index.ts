import { Socket } from "phoenix";
import "phoenix_html";
import { LiveSocket, ViewHook } from "phoenix_live_view";
import topbar from "topbar";

/*
 * LiveView Client code responsible for connecting to the LiveView server
 */

function highlight(element) {
  element.style.background = "yellow";
  var timer = setInterval(function () {
    element.style.background = "transparent";
    clearInterval(timer);
  }, 2000);
}

let Hooks = {
  HighlightChange: {
    beforeUpdate() {
      this.val = this.el.innerText;
    },
    updated() {
      if (this.val !== this.el.innerText) {
        highlight(this.el);
      }
    },
  } as ViewHook,
};

const url = "/live";
let csrfToken = document.querySelector("meta[name='csrf-token']")?.getAttribute("content");
let liveSocket = new LiveSocket(url, Socket, {
  params: { _csrf_token: csrfToken },
  hooks: Hooks,
});

// Show progress bar on live navigation and form submits
// if it takes more than 120ms
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });

let topBarScheduled: number | undefined = undefined;
window.addEventListener("phx:page-loading-start", () => {
  if (!topBarScheduled) {
    // @ts-ignore
    topBarScheduled = setTimeout(() => topbar.show(), 120);
  }
});
window.addEventListener("phx:page-loading-stop", () => {
  clearTimeout(topBarScheduled);
  topBarScheduled = undefined;
  topbar.hide();
});

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// liveSocket.enableDebug();
// liveSocket.enableLatencySim(1000)
(window as any).liveSocket = liveSocket;
