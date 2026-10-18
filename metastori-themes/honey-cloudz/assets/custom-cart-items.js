/**
 * Custom Cart — line item UX: per-button qty loader, remove fix, cart-items loading patch.
 */
class CustomCartItems {
  static init() {
    if (document.documentElement.__customCartItemsBound) return;
    document.documentElement.__customCartItemsBound = true;

    CustomCartItems.patchQuantityInput();
    CustomCartItems.patchCartItemsLoading();
    CustomCartItems.bindQuantityLoaders();
    CustomCartItems.bindRemoveButtons();
  }

  static patchQuantityInput() {
    customElements.whenDefined('quantity-input').then(() => {
      const proto = customElements.get('quantity-input')?.prototype;
      if (!proto || proto.__customCartQtyPatched) return;
      proto.__customCartQtyPatched = true;

      const originalOnButtonClick = proto.onButtonClick;
      proto.onButtonClick = function (event) {
        const cartRoot = this.closest('[data-custom-cart]');
        if (!cartRoot) {
          originalOnButtonClick.call(this, event);
          return;
        }

        event.preventDefault();
        const button = event.currentTarget;
        const previousValue = this.input.value;

        button.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
        if (previousValue === this.input.value) return;

        // Skip the theme's 300ms cart-items debounce — update immediately.
        const cartItems = this.closest('cart-items');
        const line = this.input.dataset.index;
        if (cartItems && line && typeof cartItems.updateQuantity === 'function') {
          cartItems.updateQuantity(line, this.input.value, button.getAttribute('name'));
          return;
        }

        this.input.dispatchEvent(this.changeEvent);
      };
    });
  }

  static bindQuantityLoaders() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.custom-cart__qty-btn');
      if (!btn || !btn.closest('[data-custom-cart]')) return;

      const wrap = btn.closest('.custom-cart__qty');
      wrap?.querySelectorAll('.custom-cart__qty-btn').forEach((b) => b.classList.remove('is-loading'));
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
    });

    const clearLoaders = () => {
      document.querySelectorAll('.custom-cart__qty-btn.is-loading').forEach((btn) => {
        btn.classList.remove('is-loading');
        btn.removeAttribute('aria-busy');
      });
      document.querySelectorAll('.custom-cart__item.is-loading').forEach((item) => {
        item.classList.remove('is-loading');
      });
    };

    document.addEventListener('cart:updated', clearLoaders);
    document.addEventListener('custom-cart:updated', clearLoaders);
  }

  static bindRemoveButtons() {
    document.addEventListener('click', (e) => {
      const removeEl = e.target.closest('cart-remove-button[data-custom-remove]');
      if (!removeEl) return;
      removeEl.closest('.custom-cart__item')?.classList.add('is-loading');
    });
  }

  static patchCartItemsLoading() {
    customElements.whenDefined('cart-items').then(() => {
      const proto = customElements.get('cart-items')?.prototype;
      if (!proto || proto.__customCartItemsPatched) return;
      proto.__customCartItemsPatched = true;

      proto.enableLoading = function (line) {
        const item = this.querySelector(`.custom-cart__item[data-line="${line}"]`);
        if (item) return;

        const loadingOverlay = this.querySelectorAll('.loading-overlay')[line - 1];
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        document.activeElement?.blur();
        const status = document.getElementById('shopping-cart-line-item-status');
        if (status) status.setAttribute('aria-hidden', false);
      };

      proto.disableLoading = function () {
        this.querySelectorAll('.custom-cart__item.is-loading').forEach((el) => {
          el.classList.remove('is-loading');
        });
        this.querySelectorAll('.loading-overlay').forEach((el) => {
          el.classList.add('hidden');
        });

        const cartItems = document.getElementById('custom-cart-line-items');
        if (cartItems) cartItems.classList.remove('cart__items--disabled');
      };
    });
  }
}

window.CustomCartItems = CustomCartItems;

document.addEventListener('DOMContentLoaded', () => {
  if (window.customCartDrawerEnabled || window.CustomCartUtils?.isEnabled()) {
    CustomCartItems.init();
  }
});

document.addEventListener('cartdrawer:opened', () => {
  CustomCartItems.init();
});
