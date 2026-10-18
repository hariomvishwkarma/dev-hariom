(() => {
  if (window.didLoadAccordion) return;
  window.didLoadAccordion = true;
  const template = document.createElement("template");
  template.innerHTML = `
  <style>
::slotted(.icon) {
    position: absolute;
    right: 18px;
    width: 15px;
    height: 15px;
    top: calc((100% - 15px) / 2);
    transform: rotateZ(0deg); 
    transition: 0.5s ease;
}

    :host {
      display: block;
      overflow: hidden;
    }

    :host(.loaded) {
      transition: height var(--accordion-transition-duration, 0.7s);
    }

    :host(.hc--opened) {
      height: auto;
    }

    :host(svg) {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.5;
    min-height: 48px;
    min-width: 48px;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 18px;
    padding-right: 18px;
    position: relative;
}


[hc-accordion-content] {
    padding-left: 18px;
    padding-right: 18px;
}


hc-accordion hc-accordion  {
    padding-left: 18px;
}



.hc--opened > [hc-accordion-header] svg {
    transform: rotateZ(180deg);   
}
  </style>
  <slot [hc-accordion-header] name="header"></slot>
  <slot [hc-accordion-content] name="content"></slot>
`;

  class Accordion extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      this.headerSlot = this.shadowRoot.querySelector('slot[name="header"]');
      this.contentSlot = this.shadowRoot.querySelector('slot[name="content"]');

      this.headerSlot.addEventListener("slotchange", () => {
        const assignedElements = this.headerSlot.assignedElements();
        if (assignedElements.length > 0) {
          const headerElement = assignedElements[0];
          headerElement.setAttribute("hc-accordion-header", "");

          // Add the arrow icon to the header
          if (this.hasAttribute("no-arrow")) return;
          let arrow = document.createElement("div");
          arrow.innerHTML = `<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-chevron-down" viewBox="0 0 9 9"><path d="M8.542 2.558a.625.625 0 0 1 0 .884l-3.6 3.6a.626.626 0 0 1-.884 0l-3.6-3.6a.625.625 0 1 1 .884-.884L4.5 5.716l3.158-3.158a.625.625 0 0 1 .884 0z" fill="currentColor"/></svg>`;
          arrow = arrow.firstElementChild;
          headerElement.appendChild(arrow);
        }
      });

      this.headerSlot.addEventListener("click", () => this.toggle());

      this.opened = this.hasAttribute("opened");
      this.maxTransitionTime = parseFloat(this.dataset.maxTransisionTime) || 2;
      this.speed = parseFloat(this.dataset.speed) || 0.7;

      window.addEventListener("resize", () => this.updateHeight());

      this.classList.add("loaded");
    }

    toggle() {
      this.opened = !this.opened;
    }

    updateHeight() {
      if (this.opened) {
        this.style.height = "auto";
      } else {
        this.style.height =
          this.headerSlot.assignedElements()[0].offsetHeight + "px";
      }
    }

    set opened(val) {
      const duration = Math.min(
        (this.contentSlot.assignedElements()[0].offsetHeight / 100) *
          this.speed,
        this.maxTransitionTime,
      );
      this.style.setProperty("--accordion-transition-duration", duration + "s");

      this._opened = val;
      if (val) {
        this.style.height =
          this.headerSlot.assignedElements()[0].offsetHeight +
          this.contentSlot.assignedElements()[0].offsetHeight +
          "px";
        setTimeout(() => this._opened && this.updateHeight(), duration * 1000);
      } else {
        this.style.height =
          this.headerSlot.assignedElements()[0].offsetHeight +
          this.contentSlot.assignedElements()[0].offsetHeight +
          "px";
        setTimeout(() => !this._opened && this.updateHeight(), 0);
      }
      this.classList.toggle("hc--opened", val);
      this.dispatchEvent(new CustomEvent(val ? "hc:open" : "hc:close"));
    }

    get opened() {
      return this._opened;
    }
  }

  customElements.define("hc-accordion", Accordion);
})();
