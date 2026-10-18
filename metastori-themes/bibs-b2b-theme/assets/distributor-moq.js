/**
 * Distributor minimum order (theme UX). Enforcement: checkout validation Function + Flow metafield.
 * Cart total: DOM estimated total and cart-update event first, then Shopify cart cents, then WPD.
 */
(function () {
    'use strict';
  
    const CONFIG_EL = '#distributor-moq-config';
    const NOTICE_ID = 'distributor-moq-notice';
    const CHECKOUT_SELECTORS =
      "input[name='checkout'], button[name='checkout'], #checkout, #CartDrawer-Checkout, .cart__checkout-button, [href$='/checkout']";
    const TOTAL_SELECTORS =
      '#main-cart-footer .totals__total-value, cart-drawer .totals__total-value, .cart-drawer__footer .totals__total-value';

    let lastApplied = { block: null, message: null };
    let checkoutBlocked = null;
    let applyTimer = null;
  
    function readConfig() {
      const el = document.querySelector(CONFIG_EL);
      if (!el) return null;
      try {
        return JSON.parse(el.textContent);
      } catch (e) {
        return null;
      }
    }
  
    function writeConfig(config) {
      const el = document.querySelector(CONFIG_EL);
      if (el && config) {
        el.textContent = JSON.stringify(config);
      }
    }
  
    function getThresholdMajor(config) {
      const currency = (
        config.cartCurrency ||
        (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) ||
        'EUR'
      ).toUpperCase();
      const thresholds = config.thresholds || {};
      if (thresholds[currency] != null && thresholds[currency] !== '') {
        return parseFloat(thresholds[currency], 10);
      }
      const fallback = config.defaultThresholdCurrency || 'EUR';
      return parseFloat(thresholds[fallback] || thresholds.EUR || 5000, 10);
    }
  
    function parseMoneyString(text) {
      if (!text) return null;
      let s = String(text).replace(/[^\d,.\-]/g, '').trim();
      if (!s) return null;
  
      if (s.includes(',') && s.includes('.')) {
        if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
          s = s.replace(/\./g, '').replace(',', '.');
        } else {
          s = s.replace(/,/g, '');
        }
      } else if (s.includes(',')) {
        s = s.replace(',', '.');
      }
  
      const n = parseFloat(s, 10);
      return Number.isNaN(n) ? null : n;
    }
  
    function parseTotalFromDom() {
      const el = document.querySelector(TOTAL_SELECTORS);
      if (!el) return null;
      return parseMoneyString(el.textContent);
    }
  
    function getCartTotalMajor(config) {
      const domTotal = parseTotalFromDom();
      if (domTotal != null) {
        return domTotal;
      }
  
      if (config && config.cartTotalCents != null) {
        return config.cartTotalCents / 100;
      }
  
      const hash = window.wcp_data && window.wcp_data.discounted_hash;
      if (hash && hash.wcp_total != null && hash.wcp_total !== '') {
        return parseFloat(hash.wcp_total, 10);
      }
  
      return 0;
    }
  
    function formatMoney(amountMajor, currency) {
      try {
        return new Intl.NumberFormat(document.documentElement.lang || 'en', {
          style: 'currency',
          currency: currency || 'EUR',
          minimumFractionDigits: 2,
        }).format(amountMajor);
      } catch (e) {
        return amountMajor.toFixed(2) + ' ' + (currency || 'EUR');
      }
    }
  
    function evaluate(config) {
      if (!config || !config.isDistributor) {
        return { block: false, message: '' };
      }
      if (config.bypassActive) {
        let message = config.messages.bypassActive || '';
        const until = config.bypassUntilFormatted || '';
        message = message.replace('[date]', until);
        return { block: false, message: message };
      }
      const threshold = getThresholdMajor(config);
      const total = getCartTotalMajor(config);
      if (total >= threshold) {
        return { block: false, message: '' };
      }
      const remaining = threshold - total;
      const currency = config.cartCurrency || 'EUR';
      let message = config.messages.belowMinimum || 'Minimum order not reached.';
      message = message
        .replace('[remaining]', formatMoney(remaining, currency))
        .replace('[minimum]', formatMoney(threshold, currency));
      return { block: true, message: message };
    }
  
    function setCheckoutBlocked(blocked) {
      if (checkoutBlocked === blocked) return;
      checkoutBlocked = blocked;

      document.querySelectorAll(CHECKOUT_SELECTORS).forEach(function (btn) {
        if (btn.tagName === 'A') {
          btn.setAttribute('aria-disabled', blocked ? 'true' : 'false');
          btn.classList.toggle('distributor-moq-checkout--blocked', blocked);
          if (blocked) {
            btn.addEventListener('click', preventCheckoutClick, true);
          } else {
            btn.removeEventListener('click', preventCheckoutClick, true);
          }
        } else {
          btn.disabled = blocked;
          btn.classList.toggle('distributor-moq-checkout--blocked', blocked);
        }
      });
      window.wpd_prevent_checkout = blocked;
    }

    function preventCheckoutClick(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  
    function updateNotice(result) {
      document.querySelectorAll('#' + NOTICE_ID).forEach(function (notice) {
        if (!result.message && !result.block) {
          if (notice.hidden && !notice.textContent) return;
          notice.hidden = true;
          notice.classList.add('hidden');
          notice.textContent = '';
          return;
        }
        if (
          notice.textContent === result.message &&
          !notice.hidden &&
          notice.classList.contains(result.block ? 'distributor-moq-notice--error' : 'distributor-moq-notice--info')
        ) {
          return;
        }
        notice.hidden = false;
        notice.classList.remove('hidden');
        notice.classList.toggle('distributor-moq-notice--error', result.block);
        notice.classList.toggle('distributor-moq-notice--info', !result.block && !!result.message);
        notice.textContent = result.message;
      });
    }

    function apply() {
      const config = readConfig();
      const result = evaluate(config);

      if (lastApplied.block === result.block && lastApplied.message === result.message) {
        return;
      }
      lastApplied = { block: result.block, message: result.message };

      setCheckoutBlocked(result.block);
      updateNotice(result);
      document.dispatchEvent(
        new CustomEvent('distributor-moq:evaluated', { detail: result })
      );
    }

    function scheduleApply() {
      if (applyTimer) clearTimeout(applyTimer);
      applyTimer = setTimeout(function () {
        applyTimer = null;
        apply();
      }, 100);
    }
  
    function syncConfigFromCart(cart) {
      const config = readConfig();
      if (!config || !cart) return config;
      if (cart.total_price != null) {
        config.cartTotalCents = cart.total_price;
        writeConfig(config);
      }
      return config;
    }
  
    function onCartUpdate(event) {
      if (event && event.cartData) {
        syncConfigFromCart(event.cartData);
      }
      scheduleApply();
    }
  
    function onCartUpdated() {
      fetch('/cart.js')
        .then(function (r) {
          return r.json();
        })
        .then(function (cart) {
          syncConfigFromCart(cart);
          scheduleApply();
        })
        .catch(function () {
          scheduleApply();
        });
    }
  
    function init() {
      apply();
  
      if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        subscribe(PUB_SUB_EVENTS.cartUpdate, onCartUpdate);
      }
  
      document.addEventListener('cart:updated', onCartUpdated);
      document.addEventListener('cart:refresh', onCartUpdated);
  
      const footer = document.getElementById('main-cart-footer');
      if (footer && typeof MutationObserver !== 'undefined') {
        const totalNodes = footer.querySelectorAll('.totals__total-value');
        if (totalNodes.length) {
          const observer = new MutationObserver(function () {
            scheduleApply();
          });
          totalNodes.forEach(function (node) {
            observer.observe(node, { childList: true, subtree: true, characterData: true });
          });
        }
      }
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  
    window.b2bDistributorMoqApply = scheduleApply;
  })();
  