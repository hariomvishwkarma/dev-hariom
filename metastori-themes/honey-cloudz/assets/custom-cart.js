/**
 * Custom Cart — main orchestrator.
 */
class CustomCart {
  constructor() {
    this.root = null;
    this.progress = null;
    this.crossSell = null;
    this.protection = null;
    this.modal = null;
    this._renderFrame = null;
    this._sectionEventsBound = false;
  }

  bindSectionEvents() {
    if (this._sectionEventsBound) return;
    this._sectionEventsBound = true;

    document.addEventListener("custom-cart:updated", (event) => {
      this.onSectionRendered({
        fromPatch: true,
        forceCrossSell: Boolean(event?.detail?.forceCrossSell),
      });
    });
  }

  initModules() {
    this.bindSectionEvents();
    window.CustomCartUtils?.patchNativeCart();
    window.CustomCartItems?.init();

    this.progress = window.CustomCartProgress?.init();
    this.crossSell = window.CustomCartCrossSell?.init();
    window.CustomCartRedo?.init();
    this.modal = window.CustomCartModal?.init();
    window.CustomCartVariants?.bindAll(this.root || document);
  }

  onSectionRendered(options = {}) {
    if (this._renderFrame) cancelAnimationFrame(this._renderFrame);

    this._renderFrame = requestAnimationFrame(() => {
      this._renderFrame = null;
      this.applySectionUpdate(options);
    });
  }

  applySectionUpdate(options = {}) {
    this.root = document.querySelector("[data-custom-cart]");
    if (!this.root) return;

    window.CustomCartUtils?.dedupeCartDrawerChrome?.(this.root);

    window.CustomCartVariants?.bindAll(this.root);

    this.progress = window.CustomCartProgress?.init();
    if (this.progress) {
      const progressEl = document.querySelector("[data-custom-progress]");
      if (progressEl) {
        this.progress.updateFromElement(progressEl);
      }
    }

    window.CustomCartRedo?.init();
    window.CustomCartModal?.init();

    const crossSell = window.CustomCartCrossSell?.init();
    const isEmptyCart = this.root.classList.contains("is-empty");

    if (isEmptyCart) {
      crossSell?.loadEmptyIfNeeded();
    } else if (this.configEnabled(crossSell)) {
      crossSell.reloadIfNeeded({ force: Boolean(options.forceCrossSell || options.initial) });
    }
  }

  configEnabled(crossSell) {
    if (!crossSell) return false;
    return crossSell.isEnabled() !== false;
  }

  async refreshFromSections(sections) {
    await window.CustomCartUtils.refreshDrawerAfterChange(sections);
    window.CustomCartUtils?.dedupeCartDrawerChrome?.(
      document.querySelector("[data-custom-cart]"),
    );
    window.CustomCartRedo?.init();
    window.CustomCartModal?.closeAll?.();
    window.CustomCartModal?.init();
  }

  static init() {
    if (!window.CustomCartUtils?.isEnabled()) return null;

    if (!window.customCartInstance) {
      window.customCartInstance = new CustomCart();
    }

    const instance = window.customCartInstance;
    instance.root = document.querySelector("[data-custom-cart]");

    if (!instance.root) return null;

    instance.initModules();
    return instance;
  }
}

window.CustomCart = CustomCart;

document.addEventListener("DOMContentLoaded", () => {
  window.CustomCartUtils?.patchNativeCart();
  if (window.customCartDrawerEnabled) {
    window.CustomCartRedo?.init();
    window.CustomCartModal?.init();
    window.CustomCartItems?.init();
  }
});

document.addEventListener("cartdrawer:opened", () => {
  if (!window.CustomCartUtils?.isEnabled()) return;
  const cart = CustomCart.init();
  cart?.onSectionRendered({ initial: true });
  syncChatWidgetForCartDrawer();
});

const CHAT_WIDGET_SELECTORS = [
  "#gorgias-chat-container",
  "#gorgias-web-messenger-container",
  "#chat-button",
  'iframe#chat-button',
];

function syncChatWidgetForCartDrawer() {
  if (!window.CustomCartUtils?.isEnabled()) return;

  const hide =
    document.body.classList.contains("mini-cart--open") ||
    document.body.classList.contains("mini-cart--opening") ||
    document.body.classList.contains("mini-cart--closing");

  CHAT_WIDGET_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.toggleAttribute("data-custom-cart-hidden", hide);
    });
  });
}

if (window.customCartDrawerEnabled) {
  const cartDrawerBodyObserver = new MutationObserver(syncChatWidgetForCartDrawer);
  cartDrawerBodyObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  document.addEventListener("DOMContentLoaded", syncChatWidgetForCartDrawer);
}
