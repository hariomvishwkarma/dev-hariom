/**
 * Custom Cart — accessible info modal with focus trap.
 * Modal is portaled to <body> while open, then moved back into the cart on close.
 */
class CustomCartModal {
  constructor() {
    this.focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.previousFocus = null;
    this.activeModal = null;
    this.bindEvents();
    this.cacheElements();
  }

  static getCartRoot() {
    return document.querySelector('[data-custom-cart]');
  }

  static findModal() {
    const openModal = document.querySelector('[data-custom-cart-modal]:not([hidden])');
    if (openModal) return openModal;

    const inCart = CustomCartModal.getCartRoot()?.querySelector('[data-custom-cart-modal]');
    if (inCart) return inCart;

    return document.querySelector('[data-custom-cart-modal]');
  }

  static reparentToCart(modal) {
    const cart = CustomCartModal.getCartRoot();
    if (!modal || !cart) return;

    if (modal.parentElement !== cart) {
      cart.appendChild(modal);
    }

    modal.classList.remove('custom-cart__modal--portaled');
  }

  static cleanupStaleModals() {
    const inCart = CustomCartModal.getCartRoot()?.querySelector('[data-custom-cart-modal]');
    if (!inCart) return;

    document.querySelectorAll('body > [data-custom-cart-modal]').forEach((bodyModal) => {
      if (bodyModal !== inCart) {
        bodyModal.remove();
      }
    });
  }

  cacheElements() {
    this.modal =
      this.activeModal && document.body.contains(this.activeModal)
        ? this.activeModal
        : CustomCartModal.findModal();

    if (!this.modal) return;

    this.dialog = this.modal.querySelector('[data-custom-modal-dialog]');
    this.overlay = this.modal.querySelector('[data-custom-modal-overlay]');
    this.closeBtn = this.modal.querySelector('[data-custom-modal-close]');
  }

  portalToBody() {
    this.cacheElements();
    if (!this.modal) return;

    if (this.modal.parentElement !== document.body) {
      document.body.appendChild(this.modal);
    }

    this.modal.classList.add('custom-cart__modal--portaled');
    this.activeModal = this.modal;
  }

  bindEvents() {
    if (document.documentElement.__customModalBound) return;
    document.documentElement.__customModalBound = true;

    document.addEventListener(
      'click',
      (e) => {
        const trigger = e.target.closest('[data-custom-protection-info]');
        if (!trigger || !trigger.closest('[data-custom-cart]')) return;

        e.preventDefault();
        e.stopPropagation();
        window.CustomCartModal.getInstance().open();
      },
      true
    );

    document.addEventListener('click', (e) => {
      if (
        e.target.closest('[data-custom-modal-close]') ||
        e.target.closest('[data-custom-modal-overlay]')
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.CustomCartModal.getInstance().close();
      }
    });

    document.addEventListener('keydown', (e) => {
      const instance = window.CustomCartModal.getInstance();
      if (!instance.isOpen()) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        instance.close();
      }

      if (e.key === 'Tab') {
        instance.trapFocus(e);
      }
    });

    const closeOnCartHide = () => {
      window.CustomCartModal.getInstance().close();
    };

    document.addEventListener('menudrawer:close', closeOnCartHide);
    document.addEventListener('drawer:force-close', closeOnCartHide);

    document.addEventListener('close', (e) => {
      if (e.target?.tagName === 'CART-DRAWER') {
        closeOnCartHide();
      }
    });

    document.addEventListener(
      'toggle',
      (e) => {
        const details = e.target;
        if (details.tagName !== 'DETAILS') return;
        if (!details.classList.contains('cart-drawer-container')) return;
        if (!details.open) {
          closeOnCartHide();
        }
      },
      true
    );
  }

  isOpen() {
    return Boolean(document.querySelector('[data-custom-cart-modal]:not([hidden])'));
  }

  getFocusableElements() {
    const root = this.activeModal || this.modal;
    const dialog = root?.querySelector('[data-custom-modal-dialog]');
    return Array.from(dialog?.querySelectorAll(this.focusableSelector) || []).filter(
      (el) => !el.disabled && el.offsetParent !== null
    );
  }

  trapFocus(e) {
    const focusable = this.getFocusableElements();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  open() {
    CustomCartModal.cleanupStaleModals();
    this.activeModal = null;
    this.cacheElements();

    if (!this.modal) return;

    this.portalToBody();
    this.previousFocus = document.activeElement;
    this.activeModal = this.modal;
    this.modal.hidden = false;
    this.modal.removeAttribute('hidden');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('custom-cart-modal-open');

    requestAnimationFrame(() => {
      const focusable = this.getFocusableElements();
      (focusable[0] || this.closeBtn)?.focus();
    });
  }

  close() {
    CustomCartModal.closeAll();
  }

  static closeAll() {
    document.querySelectorAll('[data-custom-cart-modal]').forEach((modal) => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('hidden', '');
      CustomCartModal.reparentToCart(modal);
    });

    document.body.classList.remove('custom-cart-modal-open');
    CustomCartModal.cleanupStaleModals();

    const instance = window.__customCartModalInstance;
    if (instance) {
      instance.activeModal = null;
      instance.cacheElements();
    }
  }

  static getInstance() {
    if (!window.__customCartModalInstance) {
      window.__customCartModalInstance = new CustomCartModal();
    } else {
      window.__customCartModalInstance.cacheElements();
    }
    return window.__customCartModalInstance;
  }

  static init() {
    CustomCartModal.cleanupStaleModals();
    return CustomCartModal.getInstance();
  }
}

window.CustomCartModal = CustomCartModal;

document.addEventListener('DOMContentLoaded', () => {
  if (window.customCartDrawerEnabled || window.CustomCartUtils?.isEnabled()) {
    CustomCartModal.init();
  }
});

document.addEventListener('cartdrawer:opened', () => {
  CustomCartModal.init();
});
