/**
 * Custom Cart — inline "remove this item?" confirmation.
 *
 * The confirmation row is rendered inside each line item (see
 * snippets/custom-cart-item.liquid) rather than as a floating dialog: anything
 * outside the drawer counts as an outside click, which closes the drawer
 * mid-confirm and loses the pending item.
 *
 * Dawn's <cart-remove-button> binds its click handler in its own constructor, so
 * the only way to get in front of it is a capture-phase listener on document —
 * stopPropagation() there means the event never reaches the element itself.
 * "Yes" then calls cart-items.updateQuantity(line, 0) directly, which is exactly
 * what the native handler does, with no click replay to go wrong.
 */
class CustomCartRemoveConfirm {
  constructor() {
    this.bindEvents();
  }

  static getInstance() {
    if (!window.__customCartRemoveConfirmInstance) {
      window.__customCartRemoveConfirmInstance = new CustomCartRemoveConfirm();
    }
    return window.__customCartRemoveConfirmInstance;
  }

  static confirmFor(item) {
    return item ? item.querySelector('[data-custom-cart-confirm]') : null;
  }

  bindEvents() {
    if (document.documentElement.__customRemoveConfirmBound) return;
    document.documentElement.__customRemoveConfirmBound = true;

    document.addEventListener(
      'click',
      (e) => {
        const button = e.target.closest('cart-remove-button[data-custom-remove]');
        if (!button) return;

        // Replayed click from the fallback path — let it through untouched.
        if (button.dataset.confirmed === 'true') {
          delete button.dataset.confirmed;
          return;
        }

        const item = button.closest('.custom-cart__item');
        // Setting off (no confirmation row rendered) — keep default behaviour.
        if (!CustomCartRemoveConfirm.confirmFor(item)) return;

        e.preventDefault();
        e.stopPropagation();
        this.open(item);
      },
      true
    );

    document.addEventListener('click', (e) => {
      const row = e.target.closest('[data-custom-cart-confirm]');
      if (!row) return;

      const item = row.closest('.custom-cart__item');

      if (e.target.closest('[data-custom-cart-confirm-yes]')) {
        e.preventDefault();
        this.accept(item);
        return;
      }

      if (e.target.closest('[data-custom-cart-confirm-no]')) {
        e.preventDefault();
        this.close(item, { restoreFocus: true });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;

      const open = document.querySelector('.custom-cart__item.is-confirming');
      if (!open) return;

      e.preventDefault();
      this.close(open, { restoreFocus: true });
    });
  }

  closeAll() {
    document.querySelectorAll('.custom-cart__item.is-confirming').forEach((item) => {
      this.close(item);
    });
  }

  open(item) {
    const row = CustomCartRemoveConfirm.confirmFor(item);
    if (!row) return;

    this.closeAll();

    item.classList.add('is-confirming');
    row.hidden = false;
    row.removeAttribute('hidden');

    const no = row.querySelector('[data-custom-cart-confirm-no]');
    if (no) requestAnimationFrame(() => no.focus());
  }

  close(item, options) {
    if (!item) return;

    const row = CustomCartRemoveConfirm.confirmFor(item);
    if (row) {
      row.hidden = true;
      row.setAttribute('hidden', '');
    }
    item.classList.remove('is-confirming');

    if (!options || !options.restoreFocus) return;

    const button = item.querySelector('cart-remove-button[data-custom-remove]');
    if (button && typeof button.focus === 'function') button.focus();
  }

  accept(item) {
    if (!item) return;

    const button = item.querySelector('cart-remove-button[data-custom-remove]');
    if (!button) return;

    this.close(item);
    item.classList.add('is-loading');

    const cartItems = item.closest('cart-items');
    if (cartItems && typeof cartItems.updateQuantity === 'function') {
      cartItems.updateQuantity(button.dataset.index, 0);
      return;
    }

    // cart-items not upgraded yet — fall back to the button's own handler.
    button.dataset.confirmed = 'true';
    button.click();
  }

  static init() {
    return CustomCartRemoveConfirm.getInstance();
  }
}

window.CustomCartRemoveConfirm = CustomCartRemoveConfirm;

document.addEventListener('DOMContentLoaded', () => {
  if (window.customCartDrawerEnabled || (window.CustomCartUtils && window.CustomCartUtils.isEnabled())) {
    CustomCartRemoveConfirm.init();
  }
});

document.addEventListener('cartdrawer:opened', () => {
  CustomCartRemoveConfirm.init();
});
