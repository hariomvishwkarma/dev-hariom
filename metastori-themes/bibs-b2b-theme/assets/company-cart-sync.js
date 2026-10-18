/**
 * Company cart
 * Phase 1 (every page load): GET company metafield → replace storefront cart (always)
 * Phase 2 (user edits): POST cart → company metafield
 */
(function () {
    if (window.__companyCartSyncInit__) return;
    window.__companyCartSyncInit__ = true;
  
    const SYNC_URL = '/apps/company-cart/sync';
    const ROOT = window.Shopify?.routes?.root || '/';
    const DEBOUNCE_MS = 600;
    const LOG = '[company-cart]';
  
    const CART_MUTATION_PATHS = [
      '/cart/add',
      '/cart/add.js',
      '/cart/change',
      '/cart/change.js',
      '/cart/update',
      '/cart/update.js',
      '/cart/clear',
      '/cart/clear.js',
    ];
  
    let phase = 'bootstrap';
    let internalCartChange = false;
  
    function customerId() {
      return String(window.__companyCartCustomerId || 'guest');
    }
  
    function userModifiedKey() {
      return `company_cart_user_modified_${customerId()}`;
    }
  
    function log(...args) {
      console.log(LOG, ...args);
    }
  
    function warn(...args) {
      console.warn(LOG, ...args);
    }
  
    function debounce(fn, ms) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
      };
    }
  
    function isCartMutation(url, method) {
      const m = (method || 'GET').toUpperCase();
      return (
        CART_MUTATION_PATHS.some((p) => String(url).includes(p)) &&
        (m === 'POST' || m === 'PUT')
      );
    }
  
    function markUserModified() {
      sessionStorage.setItem(userModifiedKey(), '1');
    }
  
    function hasUserModified() {
      return sessionStorage.getItem(userModifiedKey()) === '1';
    }
  
    function lineSignature(lines) {
      return lines
        .map((l) => `${l.variant_id}:${l.quantity}`)
        .sort()
        .join('|');
    }
  
    async function fetchStorefrontCart() {
      const res = await fetch(`${ROOT}cart.js`, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`cart.js ${res.status}`);
      return res.json();
    }
  
    async function fetchCompanyCartFromApi() {
      const res = await fetch(SYNC_URL, {
        method: 'GET',
        credentials: 'same-origin',
      });
      if (!res.ok) {
        warn('GET company cart failed', res.status, await res.text());
        return null;
      }
      const data = await res.json();
      return Array.isArray(data.lines) ? data.lines : [];
    }
  
    function fetchCompanyCartFromLiquid() {
      const el = document.getElementById('company-cart-data');
      if (!el?.textContent?.trim()) return [];
      try {
        const data = JSON.parse(el.textContent);
        return Array.isArray(data.lines) ? data.lines : [];
      } catch {
        return [];
      }
    }
  
    async function fetchCompanyCartLines() {
      const fromApi = await fetchCompanyCartFromApi();
      if (fromApi !== null) return fromApi;
      log('using Liquid fallback for company cart');
      return fetchCompanyCartFromLiquid();
    }
  
    async function storefrontMatchesCompany(companyLines) {
      try {
        const cart = await fetchStorefrontCart();
        const cartLines = (cart.items || []).map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        }));
        return lineSignature(cartLines) === lineSignature(companyLines);
      } catch {
        return false;
      }
    }
  
    /**
     * Always replace storefront cart with company metafield (clear first).
     */
    async function replaceCartFromCompanyMetafield(companyLines) {
      internalCartChange = true;
      let changed = false;
  
      try {
        const clearRes = await fetch(`${ROOT}cart/clear.js`, {
          method: 'POST',
          credentials: 'same-origin',
        });
        if (!clearRes.ok) {
          warn('cart/clear.js failed', clearRes.status);
        }
  
        const items = companyLines
          .map((line) => ({
            id: Number(line.variant_id),
            quantity: Number(line.quantity),
          }))
          .filter((item) => item.id > 0 && item.quantity > 0);
  
        if (!items.length) {
          log('phase 1 done: company cart empty — storefront cart cleared');
          changed = true;
          return changed;
        }
  
        const addRes = await fetch(`${ROOT}cart/add.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ items }),
        });
  
        if (!addRes.ok) {
          warn('cart/add.js failed', addRes.status, await addRes.text());
          return false;
        }
  
        log('phase 1 done: cart replaced from company metafield', items.length, 'item(s)');
        changed = true;
        return changed;
      } finally {
        internalCartChange = false;
      }
    }
  
    async function bootstrap() {
      phase = 'bootstrap';
      sessionStorage.removeItem(userModifiedKey());
      log('phase 1: GET company metafield → replace storefront cart');
  
      const companyLines = await fetchCompanyCartLines();
  
      if (await storefrontMatchesCompany(companyLines)) {
        log('phase 1: cart already matches company metafield');
        phase = 'listening';
        return;
      }
  
      const changed = await replaceCartFromCompanyMetafield(companyLines);
      phase = 'listening';
      log('phase 2: ready — user cart changes will update metafield');
  
      if (changed && window.location.pathname.includes('/cart')) {
        window.location.reload();
      }
    }
  
    async function syncCartToMetafield() {
      if (phase !== 'listening') return;
      if (internalCartChange) return;
  
      let cart;
      try {
        cart = await fetchStorefrontCart();
      } catch (e) {
        warn('sync: cart.js error', e);
        return;
      }
  
      const lines = (cart.items || []).map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
      }));
  
      if (lines.length === 0 && !hasUserModified()) {
        log('sync skipped (empty cart before user edit)');
        return;
      }
  
      try {
        const res = await fetch(SYNC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ lines }),
        });
        if (!res.ok) {
          warn('sync POST failed', res.status, await res.text());
          return;
        }
        const data = await res.json().catch(() => ({}));
        log('phase 2: synced cart → company metafield', data);
      } catch (e) {
        warn('sync POST error', e);
      }
    }
  
    const debouncedSync = debounce(syncCartToMetafield, DEBOUNCE_MS);
  
    function onStorefrontCartChanged(source) {
      if (internalCartChange) return;
      if (phase !== 'listening') return;
  
      markUserModified();
      log('cart changed (' + source + ') → scheduling metafield sync');
      debouncedSync();
    }
  
    function installCartHooks() {
      if (window.__companyCartHooks__) return;
      window.__companyCartHooks__ = true;
  
      const origFetch = window.fetch.bind(window);
      window.fetch = async function (input, init) {
        const url = typeof input === 'string' ? input : input?.url || '';
        const method = (init?.method || 'GET').toUpperCase();
        const resp = await origFetch(input, init);
        if (isCartMutation(url, method)) {
          onStorefrontCartChanged('fetch');
        }
        return resp;
      };
  
      const origOpen = XMLHttpRequest.prototype.open;
      const origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._ccUrl = url;
        this._ccMethod = method;
        return origOpen.call(this, method, url, ...rest);
      };
      XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener('load', () => {
          if (isCartMutation(this._ccUrl, this._ccMethod)) {
            onStorefrontCartChanged('xhr');
          }
        });
        return origSend.apply(this, args);
      };
  
      if (window.jQuery) {
        const origAjax = window.jQuery.ajax;
        window.jQuery.ajax = function (url, options) {
          let opts = options;
          let targetUrl = url;
          if (typeof url === 'object') {
            opts = url;
            targetUrl = opts.url;
          }
          const promise = origAjax.apply(this, arguments);
          const method = opts?.type || opts?.method || 'GET';
          if (isCartMutation(targetUrl, method)) {
            const run = () => onStorefrontCartChanged('jquery');
            promise.always?.(run);
            promise.then?.(run);
          }
          return promise;
        };
      }
  
      if (typeof subscribe === 'function') {
        subscribe('cart-update', () => onStorefrontCartChanged('pubsub'));
        log('listening to cart-update events');
      }
    }
  
    installCartHooks();
  
    async function start() {
      try {
        await bootstrap();
      } catch (e) {
        warn('bootstrap error', e);
        phase = 'listening';
      }
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  })();
  