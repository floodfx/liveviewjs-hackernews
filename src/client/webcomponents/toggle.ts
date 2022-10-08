import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

/**
 * Web component that toggles its content to be visible or hidden. Used
 * in the comments section of the HN app.
 */
@customElement("lv-toggle")
export class Toggle extends LitElement {
  @state()
  private _open = true;

  render() {
    const style = { display: this._open ? "block" : "none" };
    return html`
      <span @click="${this._toggle}">${this._open ? "[-]" : "[+] collapsed"}</span>
      <slot style="${styleMap(style)}"></slot>
    `;
  }

  private _toggle(event: Event) {
    this._open = !this._open;
    event.stopPropagation();
  }
}
