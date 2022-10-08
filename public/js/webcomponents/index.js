var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i6 = decorators.length - 1, decorator; i6 >= 0; i6--)
    if (decorator = decorators[i6])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// node_modules/@lit/reactive-element/css-tag.js
var t = window;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var n = /* @__PURE__ */ new WeakMap();
var o = class {
  constructor(t5, e8, n6) {
    if (this._$cssResult$ = true, n6 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e8;
  }
  get styleSheet() {
    let t5 = this.o;
    const s5 = this.t;
    if (e && void 0 === t5) {
      const e8 = void 0 !== s5 && 1 === s5.length;
      e8 && (t5 = n.get(s5)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e8 && n.set(s5, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new o("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var S = (s5, n6) => {
  e ? s5.adoptedStyleSheets = n6.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet) : n6.forEach((e8) => {
    const n7 = document.createElement("style"), o6 = t.litNonce;
    void 0 !== o6 && n7.setAttribute("nonce", o6), n7.textContent = e8.cssText, s5.appendChild(n7);
  });
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e8 = "";
  for (const s5 of t6.cssRules)
    e8 += s5.cssText;
  return r(e8);
})(t5) : t5;

// node_modules/@lit/reactive-element/reactive-element.js
var s2;
var e2 = window;
var r2 = e2.trustedTypes;
var h = r2 ? r2.emptyScript : "";
var o2 = e2.reactiveElementPolyfillSupport;
var n2 = { toAttribute(t5, i6) {
  switch (i6) {
    case Boolean:
      t5 = t5 ? h : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, i6) {
  let s5 = t5;
  switch (i6) {
    case Boolean:
      s5 = null !== t5;
      break;
    case Number:
      s5 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        s5 = JSON.parse(t5);
      } catch (t6) {
        s5 = null;
      }
  }
  return s5;
} };
var a = (t5, i6) => i6 !== t5 && (i6 == i6 || t5 == t5);
var l = { attribute: true, type: String, converter: n2, reflect: false, hasChanged: a };
var d = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this.u();
  }
  static addInitializer(t5) {
    var i6;
    null !== (i6 = this.h) && void 0 !== i6 || (this.h = []), this.h.push(t5);
  }
  static get observedAttributes() {
    this.finalize();
    const t5 = [];
    return this.elementProperties.forEach((i6, s5) => {
      const e8 = this._$Ep(s5, i6);
      void 0 !== e8 && (this._$Ev.set(e8, s5), t5.push(e8));
    }), t5;
  }
  static createProperty(t5, i6 = l) {
    if (i6.state && (i6.attribute = false), this.finalize(), this.elementProperties.set(t5, i6), !i6.noAccessor && !this.prototype.hasOwnProperty(t5)) {
      const s5 = "symbol" == typeof t5 ? Symbol() : "__" + t5, e8 = this.getPropertyDescriptor(t5, s5, i6);
      void 0 !== e8 && Object.defineProperty(this.prototype, t5, e8);
    }
  }
  static getPropertyDescriptor(t5, i6, s5) {
    return { get() {
      return this[i6];
    }, set(e8) {
      const r4 = this[t5];
      this[i6] = e8, this.requestUpdate(t5, r4, s5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) || l;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t5 = Object.getPrototypeOf(this);
    if (t5.finalize(), this.elementProperties = new Map(t5.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t6 = this.properties, i6 = [...Object.getOwnPropertyNames(t6), ...Object.getOwnPropertySymbols(t6)];
      for (const s5 of i6)
        this.createProperty(s5, t6[s5]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i6) {
    const s5 = [];
    if (Array.isArray(i6)) {
      const e8 = new Set(i6.flat(1 / 0).reverse());
      for (const i7 of e8)
        s5.unshift(c(i7));
    } else
      void 0 !== i6 && s5.push(c(i6));
    return s5;
  }
  static _$Ep(t5, i6) {
    const s5 = i6.attribute;
    return false === s5 ? void 0 : "string" == typeof s5 ? s5 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  u() {
    var t5;
    this._$E_ = new Promise((t6) => this.enableUpdating = t6), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t5 = this.constructor.h) || void 0 === t5 || t5.forEach((t6) => t6(this));
  }
  addController(t5) {
    var i6, s5;
    (null !== (i6 = this._$ES) && void 0 !== i6 ? i6 : this._$ES = []).push(t5), void 0 !== this.renderRoot && this.isConnected && (null === (s5 = t5.hostConnected) || void 0 === s5 || s5.call(t5));
  }
  removeController(t5) {
    var i6;
    null === (i6 = this._$ES) || void 0 === i6 || i6.splice(this._$ES.indexOf(t5) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t5, i6) => {
      this.hasOwnProperty(i6) && (this._$Ei.set(i6, this[i6]), delete this[i6]);
    });
  }
  createRenderRoot() {
    var t5;
    const s5 = null !== (t5 = this.shadowRoot) && void 0 !== t5 ? t5 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(s5, this.constructor.elementStyles), s5;
  }
  connectedCallback() {
    var t5;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
      var i6;
      return null === (i6 = t6.hostConnected) || void 0 === i6 ? void 0 : i6.call(t6);
    });
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    var t5;
    null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
      var i6;
      return null === (i6 = t6.hostDisconnected) || void 0 === i6 ? void 0 : i6.call(t6);
    });
  }
  attributeChangedCallback(t5, i6, s5) {
    this._$AK(t5, s5);
  }
  _$EO(t5, i6, s5 = l) {
    var e8;
    const r4 = this.constructor._$Ep(t5, s5);
    if (void 0 !== r4 && true === s5.reflect) {
      const h3 = (void 0 !== (null === (e8 = s5.converter) || void 0 === e8 ? void 0 : e8.toAttribute) ? s5.converter : n2).toAttribute(i6, s5.type);
      this._$El = t5, null == h3 ? this.removeAttribute(r4) : this.setAttribute(r4, h3), this._$El = null;
    }
  }
  _$AK(t5, i6) {
    var s5;
    const e8 = this.constructor, r4 = e8._$Ev.get(t5);
    if (void 0 !== r4 && this._$El !== r4) {
      const t6 = e8.getPropertyOptions(r4), h3 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== (null === (s5 = t6.converter) || void 0 === s5 ? void 0 : s5.fromAttribute) ? t6.converter : n2;
      this._$El = r4, this[r4] = h3.fromAttribute(i6, t6.type), this._$El = null;
    }
  }
  requestUpdate(t5, i6, s5) {
    let e8 = true;
    void 0 !== t5 && (((s5 = s5 || this.constructor.getPropertyOptions(t5)).hasChanged || a)(this[t5], i6) ? (this._$AL.has(t5) || this._$AL.set(t5, i6), true === s5.reflect && this._$El !== t5 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t5, s5))) : e8 = false), !this.isUpdatePending && e8 && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t5;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t6, i7) => this[i7] = t6), this._$Ei = void 0);
    let i6 = false;
    const s5 = this._$AL;
    try {
      i6 = this.shouldUpdate(s5), i6 ? (this.willUpdate(s5), null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
        var i7;
        return null === (i7 = t6.hostUpdate) || void 0 === i7 ? void 0 : i7.call(t6);
      }), this.update(s5)) : this._$Ek();
    } catch (t6) {
      throw i6 = false, this._$Ek(), t6;
    }
    i6 && this._$AE(s5);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    var i6;
    null === (i6 = this._$ES) || void 0 === i6 || i6.forEach((t6) => {
      var i7;
      return null === (i7 = t6.hostUpdated) || void 0 === i7 ? void 0 : i7.call(t6);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    void 0 !== this._$EC && (this._$EC.forEach((t6, i6) => this._$EO(i6, this[i6], t6)), this._$EC = void 0), this._$Ek();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
d.finalized = true, d.elementProperties = /* @__PURE__ */ new Map(), d.elementStyles = [], d.shadowRootOptions = { mode: "open" }, null == o2 || o2({ ReactiveElement: d }), (null !== (s2 = e2.reactiveElementVersions) && void 0 !== s2 ? s2 : e2.reactiveElementVersions = []).push("1.4.1");

// node_modules/lit-html/lit-html.js
var t2;
var i2 = window;
var s3 = i2.trustedTypes;
var e3 = s3 ? s3.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var o3 = `lit$${(Math.random() + "").slice(9)}$`;
var n3 = "?" + o3;
var l2 = `<${n3}>`;
var h2 = document;
var r3 = (t5 = "") => h2.createComment(t5);
var d2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var u = Array.isArray;
var c2 = (t5) => u(t5) || "function" == typeof (null == t5 ? void 0 : t5[Symbol.iterator]);
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var a2 = /-->/g;
var f = />/g;
var _ = RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var m = /'/g;
var p = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var g = (t5) => (i6, ...s5) => ({ _$litType$: t5, strings: i6, values: s5 });
var y = g(1);
var w = g(2);
var x = Symbol.for("lit-noChange");
var b = Symbol.for("lit-nothing");
var T = /* @__PURE__ */ new WeakMap();
var A = (t5, i6, s5) => {
  var e8, o6;
  const n6 = null !== (e8 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== e8 ? e8 : i6;
  let l5 = n6._$litPart$;
  if (void 0 === l5) {
    const t6 = null !== (o6 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== o6 ? o6 : null;
    n6._$litPart$ = l5 = new S2(i6.insertBefore(r3(), t6), t6, void 0, null != s5 ? s5 : {});
  }
  return l5._$AI(t5), l5;
};
var E = h2.createTreeWalker(h2, 129, null, false);
var C = (t5, i6) => {
  const s5 = t5.length - 1, n6 = [];
  let h3, r4 = 2 === i6 ? "<svg>" : "", d3 = v;
  for (let i7 = 0; i7 < s5; i7++) {
    const s6 = t5[i7];
    let e8, u3, c3 = -1, g2 = 0;
    for (; g2 < s6.length && (d3.lastIndex = g2, u3 = d3.exec(s6), null !== u3); )
      g2 = d3.lastIndex, d3 === v ? "!--" === u3[1] ? d3 = a2 : void 0 !== u3[1] ? d3 = f : void 0 !== u3[2] ? ($.test(u3[2]) && (h3 = RegExp("</" + u3[2], "g")), d3 = _) : void 0 !== u3[3] && (d3 = _) : d3 === _ ? ">" === u3[0] ? (d3 = null != h3 ? h3 : v, c3 = -1) : void 0 === u3[1] ? c3 = -2 : (c3 = d3.lastIndex - u3[2].length, e8 = u3[1], d3 = void 0 === u3[3] ? _ : '"' === u3[3] ? p : m) : d3 === p || d3 === m ? d3 = _ : d3 === a2 || d3 === f ? d3 = v : (d3 = _, h3 = void 0);
    const y2 = d3 === _ && t5[i7 + 1].startsWith("/>") ? " " : "";
    r4 += d3 === v ? s6 + l2 : c3 >= 0 ? (n6.push(e8), s6.slice(0, c3) + "$lit$" + s6.slice(c3) + o3 + y2) : s6 + o3 + (-2 === c3 ? (n6.push(void 0), i7) : y2);
  }
  const u2 = r4 + (t5[s5] || "<?>") + (2 === i6 ? "</svg>" : "");
  if (!Array.isArray(t5) || !t5.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [void 0 !== e3 ? e3.createHTML(u2) : u2, n6];
};
var P = class {
  constructor({ strings: t5, _$litType$: i6 }, e8) {
    let l5;
    this.parts = [];
    let h3 = 0, d3 = 0;
    const u2 = t5.length - 1, c3 = this.parts, [v2, a3] = C(t5, i6);
    if (this.el = P.createElement(v2, e8), E.currentNode = this.el.content, 2 === i6) {
      const t6 = this.el.content, i7 = t6.firstChild;
      i7.remove(), t6.append(...i7.childNodes);
    }
    for (; null !== (l5 = E.nextNode()) && c3.length < u2; ) {
      if (1 === l5.nodeType) {
        if (l5.hasAttributes()) {
          const t6 = [];
          for (const i7 of l5.getAttributeNames())
            if (i7.endsWith("$lit$") || i7.startsWith(o3)) {
              const s5 = a3[d3++];
              if (t6.push(i7), void 0 !== s5) {
                const t7 = l5.getAttribute(s5.toLowerCase() + "$lit$").split(o3), i8 = /([.?@])?(.*)/.exec(s5);
                c3.push({ type: 1, index: h3, name: i8[2], strings: t7, ctor: "." === i8[1] ? R : "?" === i8[1] ? H : "@" === i8[1] ? I : M });
              } else
                c3.push({ type: 6, index: h3 });
            }
          for (const i7 of t6)
            l5.removeAttribute(i7);
        }
        if ($.test(l5.tagName)) {
          const t6 = l5.textContent.split(o3), i7 = t6.length - 1;
          if (i7 > 0) {
            l5.textContent = s3 ? s3.emptyScript : "";
            for (let s5 = 0; s5 < i7; s5++)
              l5.append(t6[s5], r3()), E.nextNode(), c3.push({ type: 2, index: ++h3 });
            l5.append(t6[i7], r3());
          }
        }
      } else if (8 === l5.nodeType)
        if (l5.data === n3)
          c3.push({ type: 2, index: h3 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = l5.data.indexOf(o3, t6 + 1)); )
            c3.push({ type: 7, index: h3 }), t6 += o3.length - 1;
        }
      h3++;
    }
  }
  static createElement(t5, i6) {
    const s5 = h2.createElement("template");
    return s5.innerHTML = t5, s5;
  }
};
function V(t5, i6, s5 = t5, e8) {
  var o6, n6, l5, h3;
  if (i6 === x)
    return i6;
  let r4 = void 0 !== e8 ? null === (o6 = s5._$Cl) || void 0 === o6 ? void 0 : o6[e8] : s5._$Cu;
  const u2 = d2(i6) ? void 0 : i6._$litDirective$;
  return (null == r4 ? void 0 : r4.constructor) !== u2 && (null === (n6 = null == r4 ? void 0 : r4._$AO) || void 0 === n6 || n6.call(r4, false), void 0 === u2 ? r4 = void 0 : (r4 = new u2(t5), r4._$AT(t5, s5, e8)), void 0 !== e8 ? (null !== (l5 = (h3 = s5)._$Cl) && void 0 !== l5 ? l5 : h3._$Cl = [])[e8] = r4 : s5._$Cu = r4), void 0 !== r4 && (i6 = V(t5, r4._$AS(t5, i6.values), r4, e8)), i6;
}
var N = class {
  constructor(t5, i6) {
    this.v = [], this._$AN = void 0, this._$AD = t5, this._$AM = i6;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  p(t5) {
    var i6;
    const { el: { content: s5 }, parts: e8 } = this._$AD, o6 = (null !== (i6 = null == t5 ? void 0 : t5.creationScope) && void 0 !== i6 ? i6 : h2).importNode(s5, true);
    E.currentNode = o6;
    let n6 = E.nextNode(), l5 = 0, r4 = 0, d3 = e8[0];
    for (; void 0 !== d3; ) {
      if (l5 === d3.index) {
        let i7;
        2 === d3.type ? i7 = new S2(n6, n6.nextSibling, this, t5) : 1 === d3.type ? i7 = new d3.ctor(n6, d3.name, d3.strings, this, t5) : 6 === d3.type && (i7 = new L(n6, this, t5)), this.v.push(i7), d3 = e8[++r4];
      }
      l5 !== (null == d3 ? void 0 : d3.index) && (n6 = E.nextNode(), l5++);
    }
    return o6;
  }
  m(t5) {
    let i6 = 0;
    for (const s5 of this.v)
      void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t5, s5, i6), i6 += s5.strings.length - 2) : s5._$AI(t5[i6])), i6++;
  }
};
var S2 = class {
  constructor(t5, i6, s5, e8) {
    var o6;
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t5, this._$AB = i6, this._$AM = s5, this.options = e8, this._$C_ = null === (o6 = null == e8 ? void 0 : e8.isConnected) || void 0 === o6 || o6;
  }
  get _$AU() {
    var t5, i6;
    return null !== (i6 = null === (t5 = this._$AM) || void 0 === t5 ? void 0 : t5._$AU) && void 0 !== i6 ? i6 : this._$C_;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i6 = this._$AM;
    return void 0 !== i6 && 11 === t5.nodeType && (t5 = i6.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i6 = this) {
    t5 = V(this, t5, i6), d2(t5) ? t5 === b || null == t5 || "" === t5 ? (this._$AH !== b && this._$AR(), this._$AH = b) : t5 !== this._$AH && t5 !== x && this.$(t5) : void 0 !== t5._$litType$ ? this.T(t5) : void 0 !== t5.nodeType ? this.k(t5) : c2(t5) ? this.O(t5) : this.$(t5);
  }
  S(t5, i6 = this._$AB) {
    return this._$AA.parentNode.insertBefore(t5, i6);
  }
  k(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.S(t5));
  }
  $(t5) {
    this._$AH !== b && d2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.k(h2.createTextNode(t5)), this._$AH = t5;
  }
  T(t5) {
    var i6;
    const { values: s5, _$litType$: e8 } = t5, o6 = "number" == typeof e8 ? this._$AC(t5) : (void 0 === e8.el && (e8.el = P.createElement(e8.h, this.options)), e8);
    if ((null === (i6 = this._$AH) || void 0 === i6 ? void 0 : i6._$AD) === o6)
      this._$AH.m(s5);
    else {
      const t6 = new N(o6, this), i7 = t6.p(this.options);
      t6.m(s5), this.k(i7), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i6 = T.get(t5.strings);
    return void 0 === i6 && T.set(t5.strings, i6 = new P(t5)), i6;
  }
  O(t5) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i6 = this._$AH;
    let s5, e8 = 0;
    for (const o6 of t5)
      e8 === i6.length ? i6.push(s5 = new S2(this.S(r3()), this.S(r3()), this, this.options)) : s5 = i6[e8], s5._$AI(o6), e8++;
    e8 < i6.length && (this._$AR(s5 && s5._$AB.nextSibling, e8), i6.length = e8);
  }
  _$AR(t5 = this._$AA.nextSibling, i6) {
    var s5;
    for (null === (s5 = this._$AP) || void 0 === s5 || s5.call(this, false, true, i6); t5 && t5 !== this._$AB; ) {
      const i7 = t5.nextSibling;
      t5.remove(), t5 = i7;
    }
  }
  setConnected(t5) {
    var i6;
    void 0 === this._$AM && (this._$C_ = t5, null === (i6 = this._$AP) || void 0 === i6 || i6.call(this, t5));
  }
};
var M = class {
  constructor(t5, i6, s5, e8, o6) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t5, this.name = i6, this._$AM = e8, this.options = o6, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = b;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5, i6 = this, s5, e8) {
    const o6 = this.strings;
    let n6 = false;
    if (void 0 === o6)
      t5 = V(this, t5, i6, 0), n6 = !d2(t5) || t5 !== this._$AH && t5 !== x, n6 && (this._$AH = t5);
    else {
      const e9 = t5;
      let l5, h3;
      for (t5 = o6[0], l5 = 0; l5 < o6.length - 1; l5++)
        h3 = V(this, e9[s5 + l5], i6, l5), h3 === x && (h3 = this._$AH[l5]), n6 || (n6 = !d2(h3) || h3 !== this._$AH[l5]), h3 === b ? t5 = b : t5 !== b && (t5 += (null != h3 ? h3 : "") + o6[l5 + 1]), this._$AH[l5] = h3;
    }
    n6 && !e8 && this.P(t5);
  }
  P(t5) {
    t5 === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t5 ? t5 : "");
  }
};
var R = class extends M {
  constructor() {
    super(...arguments), this.type = 3;
  }
  P(t5) {
    this.element[this.name] = t5 === b ? void 0 : t5;
  }
};
var k = s3 ? s3.emptyScript : "";
var H = class extends M {
  constructor() {
    super(...arguments), this.type = 4;
  }
  P(t5) {
    t5 && t5 !== b ? this.element.setAttribute(this.name, k) : this.element.removeAttribute(this.name);
  }
};
var I = class extends M {
  constructor(t5, i6, s5, e8, o6) {
    super(t5, i6, s5, e8, o6), this.type = 5;
  }
  _$AI(t5, i6 = this) {
    var s5;
    if ((t5 = null !== (s5 = V(this, t5, i6, 0)) && void 0 !== s5 ? s5 : b) === x)
      return;
    const e8 = this._$AH, o6 = t5 === b && e8 !== b || t5.capture !== e8.capture || t5.once !== e8.once || t5.passive !== e8.passive, n6 = t5 !== b && (e8 === b || o6);
    o6 && this.element.removeEventListener(this.name, this, e8), n6 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    var i6, s5;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s5 = null === (i6 = this.options) || void 0 === i6 ? void 0 : i6.host) && void 0 !== s5 ? s5 : this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var L = class {
  constructor(t5, i6, s5) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i6, this.options = s5;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    V(this, t5);
  }
};
var Z = i2.litHtmlPolyfillSupport;
null == Z || Z(P, S2), (null !== (t2 = i2.litHtmlVersions) && void 0 !== t2 ? t2 : i2.litHtmlVersions = []).push("2.3.1");

// node_modules/lit-element/lit-element.js
var l3;
var o4;
var s4 = class extends d {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t5, e8;
    const i6 = super.createRenderRoot();
    return null !== (t5 = (e8 = this.renderOptions).renderBefore) && void 0 !== t5 || (e8.renderBefore = i6.firstChild), i6;
  }
  update(t5) {
    const i6 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = A(i6, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t5;
    super.connectedCallback(), null === (t5 = this._$Do) || void 0 === t5 || t5.setConnected(true);
  }
  disconnectedCallback() {
    var t5;
    super.disconnectedCallback(), null === (t5 = this._$Do) || void 0 === t5 || t5.setConnected(false);
  }
  render() {
    return x;
  }
};
s4.finalized = true, s4._$litElement$ = true, null === (l3 = globalThis.litElementHydrateSupport) || void 0 === l3 || l3.call(globalThis, { LitElement: s4 });
var n4 = globalThis.litElementPolyfillSupport;
null == n4 || n4({ LitElement: s4 });
(null !== (o4 = globalThis.litElementVersions) && void 0 !== o4 ? o4 : globalThis.litElementVersions = []).push("3.2.2");

// node_modules/@lit/reactive-element/decorators/custom-element.js
var e4 = (e8) => (n6) => "function" == typeof n6 ? ((e9, n7) => (customElements.define(e9, n7), n7))(e8, n6) : ((e9, n7) => {
  const { kind: t5, elements: s5 } = n7;
  return { kind: t5, elements: s5, finisher(n8) {
    customElements.define(e9, n8);
  } };
})(e8, n6);

// node_modules/@lit/reactive-element/decorators/property.js
var i3 = (i6, e8) => "method" === e8.kind && e8.descriptor && !("value" in e8.descriptor) ? { ...e8, finisher(n6) {
  n6.createProperty(e8.key, i6);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e8.key, initializer() {
  "function" == typeof e8.initializer && (this[e8.key] = e8.initializer.call(this));
}, finisher(n6) {
  n6.createProperty(e8.key, i6);
} };
function e5(e8) {
  return (n6, t5) => void 0 !== t5 ? ((i6, e9, n7) => {
    e9.constructor.createProperty(n7, i6);
  })(e8, n6, t5) : i3(e8, n6);
}

// node_modules/@lit/reactive-element/decorators/state.js
function t3(t5) {
  return e5({ ...t5, state: true });
}

// node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
var n5;
var e6 = null != (null === (n5 = window.HTMLSlotElement) || void 0 === n5 ? void 0 : n5.prototype.assignedElements) ? (o6, n6) => o6.assignedElements(n6) : (o6, n6) => o6.assignedNodes(n6).filter((o7) => o7.nodeType === Node.ELEMENT_NODE);

// node_modules/lit-html/directive.js
var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e7 = (t5) => (...e8) => ({ _$litDirective$: t5, values: e8 });
var i4 = class {
  constructor(t5) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e8, i6) {
    this._$Ct = t5, this._$AM = e8, this._$Ci = i6;
  }
  _$AS(t5, e8) {
    return this.update(t5, e8);
  }
  update(t5, e8) {
    return this.render(...e8);
  }
};

// node_modules/lit-html/directives/style-map.js
var i5 = e7(class extends i4 {
  constructor(t5) {
    var e8;
    if (super(t5), t5.type !== t4.ATTRIBUTE || "style" !== t5.name || (null === (e8 = t5.strings) || void 0 === e8 ? void 0 : e8.length) > 2)
      throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t5) {
    return Object.keys(t5).reduce((e8, r4) => {
      const s5 = t5[r4];
      return null == s5 ? e8 : e8 + `${r4 = r4.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s5};`;
    }, "");
  }
  update(e8, [r4]) {
    const { style: s5 } = e8.element;
    if (void 0 === this.vt) {
      this.vt = /* @__PURE__ */ new Set();
      for (const t5 in r4)
        this.vt.add(t5);
      return this.render(r4);
    }
    this.vt.forEach((t5) => {
      null == r4[t5] && (this.vt.delete(t5), t5.includes("-") ? s5.removeProperty(t5) : s5[t5] = "");
    });
    for (const t5 in r4) {
      const e9 = r4[t5];
      null != e9 && (this.vt.add(t5), t5.includes("-") ? s5.setProperty(t5, e9) : s5[t5] = e9);
    }
    return x;
  }
});

// src/client/webcomponents/toggle.ts
var Toggle = class extends s4 {
  constructor() {
    super(...arguments);
    this._open = true;
  }
  render() {
    const style = { display: this._open ? "block" : "none" };
    return y`
      <span @click="${this._toggle}">${this._open ? "[-]" : "[+] collapsed"}</span>
      <slot style="${i5(style)}"></slot>
    `;
  }
  _toggle(event) {
    this._open = !this._open;
    event.stopPropagation();
  }
};
__decorateClass([
  t3()
], Toggle.prototype, "_open", 2);
Toggle = __decorateClass([
  e4("lv-toggle")
], Toggle);
export {
  Toggle
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
//# sourceMappingURL=index.js.map
