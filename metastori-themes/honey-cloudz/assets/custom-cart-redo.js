/**
 * Custom Cart — Redo (ReturnGo) widget refresh + custom checkout re-bind.
 */
class CustomCartRedo {
  static _refreshTimer = null;
  static _reattachTimer = null;
  static _refreshing = false;
  static _checkoutObserver = null;

  static isEnabled() {
    // Redo hidden for this shopper (Theme settings → Redo easy returns).
    // window.blockRedo is Redo's own switch, set in <head> before it boots.
    if (window.blockRedo === true) return false;

    const config = window.CustomCartUtils?.getConfig()?.protection || {};
    if (config.hiddenForCustomer === true) return false;
    return config.enabled === true && config.provider === 'redo';
  }

  static setButtonLoading(btn, loading) {
    if (!btn) return;

    if (loading) {
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
      btn.disabled = true;
      return;
    }

    btn.classList.remove('is-loading');
    btn.removeAttribute('aria-busy');

    if (window.B2BMinOrder?.isBlocked?.()) {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
      btn.classList.add('b2b-min-order-blocked');
      window.B2BMinOrder.apply?.();
      return;
    }

    btn.disabled = false;
    btn.removeAttribute('aria-disabled');
    btn.classList.remove('b2b-min-order-blocked');
  }

  static goToCheckout(btn) {
    if (window.B2BMinOrder?.isBlocked?.()) {
      window.B2BMinOrder.apply?.();
      return;
    }

    if (btn?.classList.contains('is-loading')) return;

    CustomCartRedo.setButtonLoading(btn, true);
    const checkoutUrl = window.routes?.checkout_url || '/checkout';

    if (typeof SAWCheckout === 'function' && window.saw_discount === true) {
      fetch(window.routes?.cart_js_url || '/cart.js')
        .then((response) => response.json())
        .then((cart) => {
          window.saw_cart = cart;
          SAWCheckout();
        })
        .catch(() => {
          window.location.assign(checkoutUrl);
        });
      return;
    }

    window.location.assign(checkoutUrl);
  }

  static getCheckoutButtons(root = document) {
    const cartRoot = root.querySelector?.('[data-custom-cart]') || root;
    if (!cartRoot?.matches?.('[data-custom-cart]') && !cartRoot.querySelector) {
      return [];
    }

    const scope =
      cartRoot.matches?.('[data-custom-cart]') ? cartRoot : cartRoot.querySelector('[data-custom-cart]');
    if (!scope || scope.classList.contains('is-empty')) return [];

    return Array.from(scope.querySelectorAll('[data-custom-checkout-btn]'));
  }

  static bindCheckoutButton(btn) {
    if (!btn || btn.__customCheckoutBound) return;
    btn.__customCheckoutBound = true;

    btn.addEventListener(
      'click',
      (e) => {
        if (!btn.closest('[data-custom-cart]')) return;
        if (window.B2BMinOrder?.isBlocked?.()) {
          e.preventDefault();
          e.stopPropagation();
          window.B2BMinOrder.apply?.();
          return;
        }
        if (btn.disabled || btn.classList.contains('is-loading')) return;

        e.preventDefault();
        e.stopPropagation();
        CustomCartRedo.goToCheckout(btn);
      },
      false,
    );
  }

  static reattachCustomCheckout() {
    CustomCartRedo.clearCheckoutLoading();
    CustomCartRedo.getCheckoutButtons().forEach((btn) => {
      CustomCartRedo.bindCheckoutButton(btn);
    });
  }

  static clearCheckoutLoading() {
    CustomCartRedo.getCheckoutButtons().forEach((btn) => {
      CustomCartRedo.setButtonLoading(btn, false);
    });
  }

  static scheduleReattach() {
    if (CustomCartRedo._reattachTimer) {
      window.clearTimeout(CustomCartRedo._reattachTimer);
    }

    CustomCartRedo._reattachTimer = window.setTimeout(() => {
      CustomCartRedo._reattachTimer = null;
      CustomCartRedo.reattachCustomCheckout();
    }, 150);
  }

  static observeCheckoutFooter() {
    if (CustomCartRedo._checkoutObserver) return;

    CustomCartRedo._checkoutObserver = new MutationObserver(() => {
      CustomCartRedo.scheduleReattach();
    });

    const attachObserver = () => {
      const targets = document.querySelectorAll(
        '[data-custom-cart] [data-custom-checkout], [data-custom-cart] .custom-cart__footer-wrap, [data-custom-cart] [data-custom-redo]',
      );

      targets.forEach((target) => {
        if (target.__customCheckoutObserved) return;
        target.__customCheckoutObserved = true;
        CustomCartRedo._checkoutObserver.observe(target, {
          childList: true,
          subtree: true,
        });
      });

      CustomCartRedo.scheduleReattach();
    };

    attachObserver();
    document.addEventListener('cartdrawer:opened', attachObserver);
    document.addEventListener('custom-cart:updated', attachObserver);
  }

  static bindCheckout() {
    if (document.body.__customCartCheckoutBound) return;
    document.body.__customCartCheckoutBound = true;

    document.addEventListener(
      'click',
      (e) => {
        if (!e.target.closest('[data-custom-cart]')) return;
        if (window.B2BMinOrder?.isBlocked?.()) {
          e.preventDefault();
          e.stopPropagation();
          window.B2BMinOrder.apply?.();
          return;
        }

        const checkoutBtn = e.target.closest('[data-custom-checkout-btn], [data-custom-checkout-without]');
        if (!checkoutBtn) return;

        e.preventDefault();
        e.stopPropagation();
        CustomCartRedo.goToCheckout(checkoutBtn);
      },
      false,
    );
  }

  static refreshWidgets() {
    if (!CustomCartRedo.isEnabled() || CustomCartRedo._refreshing) return;

    const cartRoot = document.querySelector('[data-custom-cart]');
    const mount = cartRoot?.querySelector('.returngo-coverage-on-demand');
    if (!mount || !cartRoot || cartRoot.classList.contains('is-empty')) return;

    CustomCartRedo._refreshing = true;

    try {
      if (typeof window.ReturnGo !== 'undefined') {
        if (typeof window.ReturnGo.refresh === 'function') {
          window.ReturnGo.refresh();
        } else if (typeof window.ReturnGo.init === 'function') {
          window.ReturnGo.init();
        }
      }

      if (typeof window.Redo !== 'undefined' && typeof window.Redo.refresh === 'function') {
        window.Redo.refresh();
      }
    } finally {
      window.setTimeout(() => {
        CustomCartRedo._refreshing = false;
        CustomCartRedo.scheduleReattach();
      }, 350);
    }
  }

  static scheduleRefresh() {
    if (!CustomCartRedo.isEnabled()) {
      CustomCartRedo.scheduleReattach();
      return;
    }

    if (CustomCartRedo._refreshTimer) {
      window.clearTimeout(CustomCartRedo._refreshTimer);
    }

    CustomCartRedo._refreshTimer = window.setTimeout(() => {
      CustomCartRedo._refreshTimer = null;
      CustomCartRedo.refreshWidgets();
    }, 120);
  }

  static bindEvents() {
    if (document.documentElement.__customCartRedoBound) return;
    document.documentElement.__customCartRedoBound = true;

    const resetCheckoutOnReturn = () => {
      CustomCartRedo.clearCheckoutLoading();
    };

    window.addEventListener('pageshow', resetCheckoutOnReturn);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        resetCheckoutOnReturn();
      }
    });

    document.addEventListener('custom-cart:updated', () => CustomCartRedo.scheduleRefresh());
    document.addEventListener('cartdrawer:opened', () => {
      resetCheckoutOnReturn();
      CustomCartRedo.scheduleRefresh();
    });
  }

  static init() {
    CustomCartRedo.bindEvents();
    CustomCartRedo.bindCheckout();
    CustomCartRedo.observeCheckoutFooter();
    CustomCartRedo.clearCheckoutLoading();
    CustomCartRedo.scheduleRefresh();
    CustomCartRedo.scheduleReattach();
    return CustomCartRedo;
  }
}

window.CustomCartRedo = CustomCartRedo;

document.addEventListener('DOMContentLoaded', () => {
  if (window.customCartDrawerEnabled || window.CustomCartUtils?.isEnabled()) {
    CustomCartRedo.init();
  }
});
