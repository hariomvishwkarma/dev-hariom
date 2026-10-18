/**
 * Custom Cart — checkout protection add/remove + checkout flows.
 */
class CustomCartProtection {
  constructor() {
    this.bindEvents();
    this.refresh();
  }

  refresh() {
    this.config = window.CustomCartUtils?.getConfig()?.protection || {};
    this.row = document.querySelector('[data-custom-protection]');
  }

  bindEvents() {
    if (document.body.__customProtectionCheckoutBound) return;
    document.body.__customProtectionCheckoutBound = true;

    document.addEventListener(
      'click',
      (e) => {
        if (!e.target.closest('[data-custom-cart]')) return;

        const checkoutBtn = e.target.closest('[data-custom-checkout-btn]');
        if (checkoutBtn) {
          e.preventDefault();
          e.stopPropagation();
          CustomCartProtection.getInstance().checkoutWithProtection(checkoutBtn);
          return;
        }

        const withoutBtn = e.target.closest('[data-custom-checkout-without]');
        if (withoutBtn) {
          e.preventDefault();
          e.stopPropagation();
          CustomCartProtection.getInstance().checkoutWithoutProtection(withoutBtn);
        }
      },
      false
    );
  }

  setButtonLoading(btn, loading) {
    if (!btn) return;

    if (loading) {
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
      btn.disabled = true;
      return;
    }

    btn.classList.remove('is-loading');
    btn.removeAttribute('aria-busy');
    btn.disabled = false;
  }

  getCheckoutUrl() {
    return window.routes?.checkout_url || '/checkout';
  }

  getVariantId() {
    const id = this.config.variantId || this.row?.dataset.variantId;
    if (!id || id === 'null') return null;
    return parseInt(id, 10);
  }

  async fetchCart() {
    return window.CustomCartUtils.fetchCart();
  }

  async findProtectionLine() {
    const variantId = this.getVariantId();
    if (!variantId) return 0;

    const cart = await this.fetchCart();
    const index = cart.items.findIndex((item) => item.variant_id === variantId);
    return index >= 0 ? index + 1 : 0;
  }

  async isProtectionInCart() {
    return (await this.findProtectionLine()) > 0;
  }

  goToCheckout() {
    if (typeof SAWCheckout === 'function' && window.saw_discount === true) {
      fetch(window.routes?.cart_js_url || '/cart.js')
        .then((response) => response.json())
        .then((cart) => {
          window.saw_cart = cart;
          SAWCheckout();
        })
        .catch(() => {
          window.location.assign(this.getCheckoutUrl());
        });
      return;
    }

    window.location.assign(this.getCheckoutUrl());
  }

  async checkoutWithProtection(btn) {
    if (btn?.classList.contains('is-loading')) return;

    this.refresh();
    this.setButtonLoading(btn, true);

    try {
      const variantId = this.getVariantId();
      if (this.config.enabled && variantId && !(await this.isProtectionInCart())) {
        await this.addProtection(variantId, { refresh: false });
        const added = await this.isProtectionInCart();
        if (!added) {
          throw new Error('Protection product could not be added to cart');
        }
      }
      this.goToCheckout();
    } catch (err) {
      console.error('CustomCartProtection checkout:', err);
      this.setButtonLoading(btn, false);
    }
  }

  async checkoutWithoutProtection(btn) {
    if (btn?.classList.contains('is-loading')) return;

    this.refresh();
    this.setButtonLoading(btn, true);

    try {
      const line = await this.findProtectionLine();
      if (line > 0) {
        await this.removeProtection(line, { refresh: false });
      }
      this.goToCheckout();
    } catch (err) {
      console.error('CustomCartProtection checkout without:', err);
      this.setButtonLoading(btn, false);
    }
  }

  async addProtection(variantId, { refresh = false } = {}) {
    const body = {
      items: [{ id: variantId, quantity: 1 }],
    };

    if (refresh) {
      body.sections = window.CustomCartUtils.getSectionsToRender().map((s) => s.section);
      body.sections_url = window.location.pathname;
    }

    const response = await fetch(window.routes.cart_add_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const state = await response.json();
    if (state.status) {
      throw new Error(state.description || state.message || 'Could not add protection');
    }

    if (refresh && state.sections) {
      window.CustomCart?.refreshFromSections(state.sections);
    }

    return state;
  }

  async removeProtection(line, { refresh = false } = {}) {
    const body = {
      line,
      quantity: 0,
    };

    if (refresh) {
      body.sections = window.CustomCartUtils.getSectionsToRender().map((s) => s.section);
      body.sections_url = window.location.pathname;
    }

    const response = await fetch(window.routes.cart_change_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const state = JSON.parse(await response.text());

    if (refresh && state.sections) {
      window.CustomCart?.refreshFromSections(state.sections);
    }

    return state;
  }

  static getInstance() {
    if (!window.__customCartProtectionInstance) {
      window.__customCartProtectionInstance = new CustomCartProtection();
    }
    return window.__customCartProtectionInstance;
  }

  static init() {
    const instance = CustomCartProtection.getInstance();
    instance.refresh();
    return instance;
  }
}

window.CustomCartProtection = CustomCartProtection;

document.addEventListener('DOMContentLoaded', () => {
  if (window.customCartDrawerEnabled || window.CustomCartUtils?.isEnabled()) {
    CustomCartProtection.init();
  }
});

document.addEventListener('cartdrawer:opened', () => {
  CustomCartProtection.init();
});
