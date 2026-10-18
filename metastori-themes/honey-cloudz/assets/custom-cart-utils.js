/**
 * Custom Cart — shared utilities and native cart bridge patches.
 */
window.CustomCartUtils = (function () {
  const SECTION_HANDLE = 'custom-cart-drawer';
  const CART_ROOT_ID = 'mini-cart';
  const SELECTOR = '.shopify-section';

  function debounce(fn, wait) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function getSectionInnerHTML(html, selector = SELECTOR) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector)?.innerHTML || '';
  }

  function formatMoney(cents, format) {
    const moneyFormat = format || getConfig()?.moneyFormat || window.shopSettings?.moneyFormat || '${{amount}}';
    const rounded = Math.round(Number(cents) || 0);
    const value = rounded % 100 === 0 ? String(Math.round(rounded / 100)) : (rounded / 100).toFixed(2);
    return moneyFormat.replace(/\{\{\s*amount\s*\}\}/, value).replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(rounded / 100));
  }

  function replaceOptional(oldNode, newNode) {
    if (!oldNode && !newNode) return;
    if (!newNode) {
      oldNode?.remove();
      return;
    }
    if (!oldNode) return;
    oldNode.replaceWith(newNode.cloneNode(true));
  }

  function dedupeBySelector(root, selector) {
    if (!root) return;
    root.querySelectorAll(selector).forEach((node, index) => {
      if (index > 0) node.remove();
    });
  }

  function dedupeCartDrawerChrome(cartRoot) {
    const miniCart = document.getElementById(CART_ROOT_ID);
    if (miniCart) {
      dedupeBySelector(miniCart, '[data-custom-cart]');
      dedupeBySelector(miniCart, '[data-custom-cart-bottom]');
      dedupeBySelector(miniCart, '[data-custom-protection]');
      dedupeBySelector(miniCart, '[data-custom-redo]');
      dedupeBySelector(miniCart, '[data-custom-footer-notice]');
      dedupeBySelector(miniCart, '[data-custom-checkout]');
    }

    const root = miniCart?.querySelector('[data-custom-cart]') || cartRoot;
    if (!root) return;

    const bottom = root.querySelector('[data-custom-cart-bottom]');

    const scrollBody = root.querySelector('[data-custom-cart-scroll], .custom-cart__body');

    root.querySelectorAll('[data-custom-protection], [data-custom-checkout], .custom-cart__footer-wrap, [data-custom-cross-sell], .custom-cart__tagline').forEach((node) => {
      if (scrollBody?.contains(node)) return;
      if (bottom?.contains(node)) return;
      node.remove();
    });

    if (!bottom) return;

    dedupeBySelector(bottom, '.custom-cart__footer-wrap');
    dedupeBySelector(bottom, '[data-custom-cart-savings]');
    dedupeBySelector(bottom, '[data-custom-protection]');
    dedupeBySelector(bottom, '[data-custom-redo]');
    dedupeBySelector(bottom, '[data-custom-footer-notice]');
    dedupeBySelector(bottom, '[data-custom-checkout]');
    dedupeBySelector(bottom, '[data-custom-checkout-btn]');
    dedupeBySelector(bottom, '[data-custom-checkout-without]');
    dedupeBySelector(bottom, '[data-b2b-min-order-notice]');
    dedupeBySelector(bottom, '[data-b2b-moq-order-notice]');
    dedupeBySelector(bottom, '[data-b2b-min-order-config]');
  }

  function replaceCartBottom(oldCart, newCart) {
    if (!oldCart) return;

    const oldBottom = oldCart.querySelector('[data-custom-cart-bottom]');
    const newBottom = newCart?.querySelector('[data-custom-cart-bottom]');
    if (!oldBottom || !newBottom) return;

    replaceOptional(
      oldBottom.querySelector('.custom-cart__footer-wrap'),
      newBottom.querySelector('.custom-cart__footer-wrap'),
    );
  }

  function replaceCartScrollExtras(oldCart, newCart) {
    const oldCross = oldCart.querySelector('[data-custom-cross-sell]');
    const newCross = newCart.querySelector('[data-custom-cross-sell]');

    if (!oldCross && newCross) {
      const oldTagline = oldCart.querySelector('.custom-cart__tagline');
      const scrollBody = oldCart.querySelector('[data-custom-cart-scroll], .custom-cart__body');
      if (scrollBody) {
        scrollBody.insertBefore(newCross.cloneNode(true), oldTagline || null);
      }
    } else if (oldCross && !newCross) {
      oldCross.remove();
    } else if (oldCross && newCross) {
      const oldHeading = oldCross.querySelector('.custom-cart__cross-sell-heading');
      const newHeading = newCross.querySelector('.custom-cart__cross-sell-heading');
      if (oldHeading && newHeading) {
        oldHeading.textContent = newHeading.textContent;
      }

      const oldSlot = oldCross.querySelector('[data-custom-cross-sell-slot]');
      if (oldSlot) {
        oldSlot.innerHTML = '';
        oldSlot.classList.remove('custom-cart__cross-sell--loading');
        if (window.__customCrossSellInstance) {
          window.__customCrossSellInstance._loadId += 1;
          window.__customCrossSellInstance.loading = false;
        }
      }
    }

    replaceOptional(
      oldCart.querySelector('.custom-cart__tagline'),
      newCart.querySelector('.custom-cart__tagline'),
    );
  }

  function removeOrphanedFooterChrome(cartRoot) {
    if (!cartRoot) return;

    const bottom = cartRoot.querySelector('[data-custom-cart-bottom]');
    const selectors = [
      '.custom-cart__footer-wrap',
      '[data-custom-protection]',
      '[data-custom-checkout]',
    ];

    selectors.forEach((selector) => {
      cartRoot.querySelectorAll(selector).forEach((node) => {
        if (!bottom?.contains(node)) {
          node.remove();
        }
      });
    });
  }

  function countCartLineItems(cartRoot) {
    return cartRoot?.querySelectorAll('[data-custom-item]').length || 0;
  }

  function shouldFullReplaceCartDrawer(oldCart, newCart) {
    if (!oldCart || !newCart) return true;

    const wasEmpty = oldCart.classList.contains('is-empty');
    const isEmpty = newCart.classList.contains('is-empty');
    if (wasEmpty !== isEmpty) return true;

    if (countCartLineItems(oldCart) !== countCartLineItems(newCart)) return true;

    const oldBottomCount = oldCart.querySelectorAll('[data-custom-cart-bottom]').length;
    const newBottomCount = newCart.querySelectorAll('[data-custom-cart-bottom]').length;
    if (oldBottomCount !== newBottomCount) return true;
    if (oldBottomCount > 1) return true;

    return false;
  }

  function finalizeCartDrawerPatch(cartRoot) {
    removeOrphanedFooterChrome(cartRoot);
    dedupeCartDrawerChrome(cartRoot);
    updateSavingsFromSaw({});

    if (cartRoot?.classList.contains('is-empty')) {
      requestAnimationFrame(() => {
        window.CustomCart?.onSectionRendered?.({ fromPatch: true });
      });
    }

    if (window.__customCrossSellInstance) {
      window.__customCrossSellInstance._loadId += 1;
      window.__customCrossSellInstance.loading = false;
    }

    window.CustomCartRedo?.scheduleReattach?.();
  }

  function htmlHasCustomCart(html) {
    return typeof html === 'string' && html.includes('data-custom-cart');
  }

  function getSectionHtmlFromState(sections, section) {
    if (!sections) return null;

    const preferred = sections[section.section];
    if (preferred) {
      if (section.id !== CART_ROOT_ID || !isEnabled() || htmlHasCustomCart(preferred)) {
        return preferred;
      }
    }

    if (section.id === CART_ROOT_ID && isEnabled()) {
      const customEntry = Object.values(sections).find(
        (value) => typeof value === 'string' && htmlHasCustomCart(value)
      );
      if (customEntry) return customEntry;
      return null;
    }

    return sections[section.id] || null;
  }

  function patchCartDrawerContent(miniCartElement, sectionHtml) {
    if (!sectionHtml) return { fullReplace: false, skipped: true };

    const html = getSectionInnerHTML(sectionHtml, SELECTOR);
    const doc = new DOMParser().parseFromString(`<div data-wrap>${html}</div>`, 'text/html');
    const newCart = doc.querySelector('[data-wrap] [data-custom-cart]');
    const oldCart = miniCartElement.querySelector('[data-custom-cart]');

    if (!newCart) {
      if (isEnabled() && oldCart) {
        finalizeCartDrawerPatch(oldCart);
        return { fullReplace: false, skipped: true };
      }
      if (htmlHasCustomCart(html)) {
        miniCartElement.innerHTML = html;
        finalizeCartDrawerPatch(miniCartElement.querySelector('[data-custom-cart]'));
        return { fullReplace: true };
      }
      return { fullReplace: false, skipped: true };
    }

    if (!oldCart) {
      miniCartElement.innerHTML = html;
      finalizeCartDrawerPatch(miniCartElement.querySelector('[data-custom-cart]'));
      return { fullReplace: true };
    }

    if (newCart.classList.contains('is-empty') && !oldCart.classList.contains('is-empty')) {
      miniCartElement.innerHTML = html;
      finalizeCartDrawerPatch(miniCartElement.querySelector('[data-custom-cart]'));
      return { fullReplace: true };
    }

    if (shouldFullReplaceCartDrawer(oldCart, newCart)) {
      miniCartElement.innerHTML = html;
      finalizeCartDrawerPatch(miniCartElement.querySelector('[data-custom-cart]'));
      return { fullReplace: true };
    }

    const scroll = oldCart.querySelector('.custom-cart__body');
    const scrollTop = scroll?.scrollTop ?? 0;
    const modalOpen = Boolean(document.querySelector('[data-custom-cart-modal]:not([hidden])'));

    const oldConfig = oldCart.querySelector('[data-custom-cart-config]');
    const newConfig = newCart.querySelector('[data-custom-cart-config]');
    if (oldConfig && newConfig) oldConfig.textContent = newConfig.textContent;

    replaceOptional(oldCart.querySelector('[data-custom-progress]'), newCart.querySelector('[data-custom-progress]'));
    replaceOptional(oldCart.querySelector('.custom-cart__items-wrap'), newCart.querySelector('.custom-cart__items-wrap'));

    replaceCartScrollExtras(oldCart, newCart);
    replaceCartBottom(oldCart, newCart);

    oldCart.classList.toggle('is-empty', newCart.classList.contains('is-empty'));

    if (newCart.classList.contains('is-empty')) {
      const oldBody = oldCart.querySelector('.custom-cart__body');
      const newBody = newCart.querySelector('.custom-cart__body');
      if (oldBody && newBody) {
        oldBody.replaceWith(newBody.cloneNode(true));
      }
      oldCart.querySelector('[data-custom-cart-bottom]')?.remove();
    }

    if (!modalOpen) {
      replaceOptional(oldCart.querySelector('[data-custom-cart-modal]'), newCart.querySelector('[data-custom-cart-modal]'));
    }

    if (scroll) scroll.scrollTop = scrollTop;

    finalizeCartDrawerPatch(oldCart);

    return { fullReplace: false };
  }

  async function fetchDrawerSectionHtml() {
    const root = window.Shopify?.routes?.root || window.routes?.root_url || '/';
    const base = root.endsWith('/') ? root : `${root}/`;
    const response = await fetch(`${base}?section_id=${SECTION_HANDLE}`);
    return response.text();
  }

  async function refreshDrawerAfterChange(sections) {
    if (!isEnabled()) return false;

    const miniCart = getCartRoot();
    if (!miniCart) return false;

    const drawerSections = getDrawerSectionsToRender();
    let drawerHtml = getSectionHtmlFromState(sections, drawerSections[0]);

    if (!drawerHtml || !htmlHasCustomCart(drawerHtml)) {
      drawerHtml = await fetchDrawerSectionHtml();
    }

    if (drawerHtml) {
      patchCartDrawerContent(miniCart, drawerHtml);
      requestAnimationFrame(() => {
        finalizeCartDrawerPatch(miniCart.querySelector('[data-custom-cart]'));
      });
    }

    drawerSections.slice(1).forEach((section) => {
      const sectionHtml = getSectionHtmlFromState(sections, section);
      if (!sectionHtml) return;

      const element = document.getElementById(section.id);
      if (!element) return;

      const target = element.querySelector(section.selector) || element;
      target.innerHTML = getSectionInnerHTML(sectionHtml, section.selector);
    });

    window.CustomCart?.onSectionRendered?.({ fromPatch: true, forceCrossSell: false });
    window.setTimeout(() => refreshWholesaleDiscount(), 0);
    return true;
  }

  function getRequestedSectionKeys(sectionsToRender) {
    return sectionsToRender.map((section) => section.section || section.id);
  }

  function getQuantityUpdateSections() {
    return [
      { id: CART_ROOT_ID, section: SECTION_HANDLE, selector: SELECTOR },
      { id: 'cart-icon-bubble', section: 'cart-icon-bubble', selector: SELECTOR },
    ];
  }

  function getDrawerSectionsToRender() {
    return getQuantityUpdateSections();
  }

  function getSectionsToRender() {
    return [
      { id: CART_ROOT_ID, section: SECTION_HANDLE, selector: SELECTOR },
      { id: 'cart-icon-bubble', section: 'cart-icon-bubble', selector: SELECTOR },
      { id: 'mobile-cart-icon-bubble', section: 'mobile-cart-icon-bubble', selector: SELECTOR },
    ];
  }

  function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: `application/${type}`,
      },
    };
  }

  function getCartRoot() {
    return document.getElementById(CART_ROOT_ID);
  }

  function getConfig() {
    const root = getCartRoot();
    if (!root) return null;
    try {
      return JSON.parse(root.querySelector('[data-custom-cart-config]')?.textContent || '{}');
    } catch (e) {
      return null;
    }
  }

  function isEnabled() {
    if (window.customCartDrawerEnabled === true) return true;
    return Boolean(getConfig()?.enabled);
  }

  function patchNativeCart() {
    if (!isEnabled()) return;

    const sections = getSectionsToRender();

    if (window.MiniCartPatched) return;
    window.MiniCartPatched = true;

    const applyMiniCartPatch = () => {
      const proto = customElements.get('mini-cart')?.prototype;
      if (!proto || proto.__customCartPatched) return;
      proto.__customCartPatched = true;
      proto.getSectionsToRender = function () {
        return sections;
      };
      proto.renderContents = function (parsedState) {
        this.productId = parsedState.id;
        sections.forEach((section) => {
          const element = document.getElementById(section.id);
          const sectionHtml = getSectionHtmlFromState(parsedState.sections, section);
          if (element && sectionHtml) {
            if (section.id === CART_ROOT_ID) {
              patchCartDrawerContent(element, sectionHtml);
            } else {
              element.innerHTML = getSectionInnerHTML(sectionHtml, section.selector);
            }
          }
        });
        if (typeof this.renderGiftNoteButton === 'function') {
          this.renderGiftNoteButton();
        }

        const drawerDetails = document.querySelector('cart-drawer details.cart-drawer-container');
        if (!drawerDetails?.hasAttribute('open')) {
          this.open();
        }

        requestAnimationFrame(() => {
          finalizeCartDrawerPatch(document.querySelector('[data-custom-cart]'));
          const crossSell = window.CustomCartCrossSell?.init();
          if (crossSell) {
            crossSell._lastCartSignature = null;
            crossSell.loading = false;
            crossSell.reloadIfNeeded({ force: true });
          }
        });

        dispatchCartUpdated({ cart: parsedState, patched: true });
        window.CustomCart?.onSectionRendered?.({ fromPatch: true, forceCrossSell: true });
      };
    };

    customElements.whenDefined('mini-cart').then(applyMiniCartPatch);
    applyMiniCartPatch();

    customElements.whenDefined('cart-items').then(() => {
      const proto = customElements.get('cart-items')?.prototype;
      if (!proto || proto.__customCartPatched) return;
      proto.__customCartPatched = true;

      const originalGetSections = proto.getSectionsToRender;
      proto.getSectionsToRender = function () {
        if (this.closest('[data-custom-cart]')) {
          return getDrawerSectionsToRender();
        }

        return originalGetSections.call(this).map((entry) => {
          if (entry.id === CART_ROOT_ID) {
            return { ...entry, section: SECTION_HANDLE, selector: SELECTOR };
          }
          return entry;
        });
      };

      const originalUpdate = proto.updateQuantity;
      let qtyRequestId = 0;
      let qtyAbortController = null;

      proto.updateQuantity = function (line, quantity, name) {
        if (!this.closest('[data-custom-cart]')) {
          return originalUpdate.call(this, line, quantity, name);
        }

        this.enableLoading(line);
        optimisticUpdateLine(line, quantity);

        if (qtyAbortController) qtyAbortController.abort();
        qtyAbortController = new AbortController();
        const requestId = ++qtyRequestId;
        const signal = qtyAbortController.signal;
        const qty = Math.max(0, parseInt(quantity, 10) || 0);

        // JSON-only change — skip heavy section HTML render (that was the 5–6s delay).
        fetch(`${window.routes.cart_change_url}`, {
          ...fetchConfig(),
          signal,
          body: JSON.stringify({
            line,
            quantity: qty,
          }),
        })
          .then((response) => response.json())
          .then((cart) => {
            if (requestId !== qtyRequestId) return;

            applyCartJsonToDrawer(cart);
            this.classList.toggle('is-empty', cart.item_count === 0);
            this.disableLoading();
            clearQuantityLoaders();

            if (typeof this.updateLiveRegions === 'function') {
              this.updateLiveRegions(line, cart.item_count);
            }

            const lineItem = document.getElementById(`CartItem-${line}`) ||
              document.querySelector(`.custom-cart__item[data-line="${line}"]`);
            if (lineItem && name) lineItem.querySelector(`[name="${name}"]`)?.focus();

            document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
            dispatchCartUpdated({
              cart,
              patched: true,
              forceCrossSell: false,
              jsonOnly: true,
            });

            // Soft sync section HTML in background (empty state / discounts) — no loader.
            softRefreshCartDrawer(requestId, () => requestId === qtyRequestId, {
              force: cart.item_count === 0,
            });
          })
          .catch((error) => {
            if (error?.name === 'AbortError') return;
            this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
            this.disableLoading();
            clearQuantityLoaders();
            if (this.cartErrors) {
              this.cartErrors.textContent = window.cartStrings?.error || 'Error';
            }
            softRefreshCartDrawer(requestId, () => requestId === qtyRequestId, { force: true });
          });
      };

      // Faster path is handled in custom-cart-items (direct updateQuantity).
      if (!proto.__customCartDebouncePatched) {
        proto.__customCartDebouncePatched = true;
        const originalOnChange = proto.onChange;
        proto.onChange = function (event) {
          if (!this.closest('[data-custom-cart]')) {
            return originalOnChange.call(this, event);
          }
          if (event?.target?.closest?.('.custom-cart__qty-btn')) return;
          return originalOnChange.call(this, event);
        };
      }
    });
  }

  function clearQuantityLoaders() {
    document.querySelectorAll('.custom-cart__qty-btn.is-loading').forEach((btn) => {
      btn.classList.remove('is-loading');
      btn.removeAttribute('aria-busy');
    });
    document.querySelectorAll('.custom-cart__item.is-loading').forEach((item) => {
      item.classList.remove('is-loading');
    });
  }

  function updateCartCountBubbles(itemCount) {
    const count = Math.max(0, parseInt(itemCount, 10) || 0);
    ['cart-icon-bubble', 'mobile-cart-icon-bubble'].forEach((id) => {
      const root = document.getElementById(id);
      if (!root) return;

      let bubble = root.querySelector('.cart-count-bubble');
      if (count <= 0) {
        bubble?.remove();
        return;
      }

      if (!bubble) {
        bubble = document.createElement('span');
        bubble.className = 'cart-count-bubble';
        root.appendChild(bubble);
      }

      bubble.classList.toggle('cart-count-bubble--dot', count >= 100);
      let visible = bubble.querySelector('[aria-hidden="true"]');
      if (count < 100) {
        if (!visible) {
          visible = document.createElement('span');
          visible.setAttribute('aria-hidden', 'true');
          bubble.prepend(visible);
        }
        visible.textContent = String(count);
      } else {
        visible?.remove();
      }
    });
  }

  function applyCartJsonToDrawer(cart) {
    if (!cart) return;
    const root = document.querySelector('[data-custom-cart]');
    if (!root) return;

    const items = Array.isArray(cart.items) ? cart.items : [];
    const byVariant = new Map();
    items.forEach((item, index) => {
      byVariant.set(String(item.variant_id), { item, line: index + 1 });
    });

    root.querySelectorAll('[data-custom-item]').forEach((row) => {
      const match = byVariant.get(String(row.dataset.variantId));
      if (!match) {
        row.remove();
        return;
      }

      const { item, line } = match;
      const unitPrice = Number(item.final_price) || 0;
      const linePrice = Number(item.final_line_price) || unitPrice * item.quantity;

      row.dataset.line = String(line);
      row.dataset.qty = String(item.quantity);
      row.dataset.unitPrice = String(unitPrice);
      row.dataset.linePrice = String(linePrice);
      row.id = `CartItem-${line}`;

      const input = row.querySelector('.custom-cart__qty-input');
      if (input) {
        input.value = String(item.quantity);
        input.dataset.index = String(line);
        input.id = `Quantity-${line}`;
      }

      const removeBtn = row.querySelector('cart-remove-button[data-custom-remove]');
      if (removeBtn) removeBtn.dataset.index = String(line);

      const priceEl = row.querySelector('[data-custom-line-price]');
      if (priceEl) priceEl.textContent = formatMoney(linePrice);

      byVariant.delete(String(row.dataset.variantId));
    });

    const total = Math.max(0, Number(cart.total_price) || 0);
    const footer = root.querySelector('[data-custom-checkout]');
    if (footer) {
      footer.dataset.checkoutTotal = String(total);
      footer.querySelectorAll('[data-custom-checkout-total]').forEach((el) => {
        el.textContent = formatMoney(total);
      });
    }

    const progress = window.CustomCartProgress?.init?.();
    if (progress?.updateFromDiscountedTotal) {
      progress.updateFromDiscountedTotal(total);
    } else {
      const progressEl = root.querySelector('[data-custom-progress]');
      if (progressEl) {
        const threshold = parseInt(progressEl.dataset.threshold, 10) || 0;
        if (threshold > 0) {
          const remaining = threshold - total;
          const percent = Math.min(100, Math.max(0, Math.round((total * 100) / threshold)));
          progressEl.dataset.total = String(total);
          progressEl.dataset.remaining = String(remaining);
          progressEl.dataset.percent = String(percent);
          window.CustomCartProgress?.init()?.updateFromElement?.(progressEl);
        }
      }
    }

    const configNode = root.querySelector('[data-b2b-min-order-config]');
    if (configNode) {
      try {
        const config = JSON.parse(configNode.textContent);
        config.cartTotalCents = total;
        configNode.textContent = JSON.stringify(config);
        configNode.setAttribute(
          'data-blocked',
          config.applies && total < Number(config.thresholdCents || 0) ? 'true' : 'false',
        );
      } catch (error) {
        // ignore
      }
    }

    root.classList.toggle('is-empty', cart.item_count === 0);
    updateCartCountBubbles(cart.item_count);
    window.B2BMinOrder?.apply?.();
  }

  let softRefreshTimer = null;
  function softRefreshCartDrawer(requestId, isCurrent, { force = false } = {}) {
    window.clearTimeout(softRefreshTimer);
    softRefreshTimer = window.setTimeout(async () => {
      if (typeof isCurrent === 'function' && !isCurrent()) return;
      try {
        const html = await fetchDrawerSectionHtml();
        if (typeof isCurrent === 'function' && !isCurrent()) return;
        const miniCart = getCartRoot();
        if (!miniCart || !html) return;
        patchCartDrawerContent(miniCart, html);
        window.CustomCartRedo?.scheduleReattach?.();
        window.B2BMinOrder?.apply?.();
      } catch (error) {
        // Background sync failure is non-blocking.
      }
    }, force ? 50 : 600);
  }

  function optimisticUpdateLine(line, quantity) {
    const qty = Math.max(0, parseInt(quantity, 10) || 0);
    const item = document.querySelector(`.custom-cart__item[data-line="${line}"]`);
    if (!item) return;

    const unitPrice = parseInt(item.dataset.unitPrice, 10);
    if (!Number.isFinite(unitPrice)) return;

    const previousQty = parseInt(item.dataset.qty, 10) || 0;
    const previousLine = parseInt(item.dataset.linePrice, 10) || unitPrice * previousQty;
    const nextLine = unitPrice * qty;
    const delta = nextLine - previousLine;

    item.dataset.qty = String(qty);
    item.dataset.linePrice = String(nextLine);

    const priceEl = item.querySelector('[data-custom-line-price]');
    if (priceEl) priceEl.textContent = formatMoney(nextLine);

    const footer = document.querySelector('[data-custom-checkout]');
    if (footer) {
      const currentTotal = parseInt(footer.dataset.checkoutTotal, 10);
      if (Number.isFinite(currentTotal)) {
        const nextTotal = Math.max(0, currentTotal + delta);
        footer.dataset.checkoutTotal = String(nextTotal);
        footer.querySelectorAll('[data-custom-checkout-total]').forEach((el) => {
          el.textContent = formatMoney(nextTotal);
        });
      }
    }

    if (window.B2BMinOrder?.apply) {
      const configNode = document.querySelector('[data-custom-cart] [data-b2b-min-order-config]');
      if (configNode) {
        try {
          const config = JSON.parse(configNode.textContent);
          config.cartTotalCents = Math.max(0, Number(config.cartTotalCents || 0) + delta);
          configNode.textContent = JSON.stringify(config);
        } catch (error) {
          // ignore
        }
      }
      window.B2BMinOrder.apply();
    }
  }

  function deferHeavyCartWork(detail = {}) {
    window.setTimeout(() => {
      refreshWholesaleDiscount();
      window.CustomCart?.onSectionRendered?.({
        fromPatch: true,
        forceCrossSell: Boolean(detail.forceCrossSell),
      });
    }, 0);
  }

  function dispatchCartUpdated(detail) {
    document.dispatchEvent(new CustomEvent('custom-cart:updated', { detail }));
    deferHeavyCartWork(detail);
  }

  function buildSawCartItem(cartItem) {
    const row = document.querySelector(
      `[data-custom-item][data-variant-id="${cartItem.variant_id}"]`
    );
    let sawholesale = {};

    if (row?.dataset.sawholesale) {
      try {
        sawholesale = JSON.parse(row.dataset.sawholesale);
      } catch (e) {
        sawholesale = {};
      }
    }

    const item = {
      ...cartItem,
      variant_title: cartItem.variant_title || '',
      compare_at_price: cartItem.compare_at_price,
      sawholesale,
    };

    delete item.image;
    delete item.url;
    return item;
  }

  async function refreshWholesaleDiscount() {
    if (typeof SAWCartCheck !== 'function' || !window.saw_customer) return;

    try {
      const cart = await fetchCart();
      window.saw_cart = {
        ...cart,
        items: cart.items.map(buildSawCartItem),
      };
      SAWCartCheck();
    } catch (err) {
      console.warn('CustomCartUtils: wholesale discount refresh failed', err);
    }
  }

  function ensureSavingsDiscountBadge(badgesEl, title) {
    if (!badgesEl || !title) return;

    const label = String(title).trim().toUpperCase();
    if (!label) return;

    const exists = [...badgesEl.querySelectorAll('.custom-cart__discount-badge-text')].some(
      (el) => el.textContent.trim().toUpperCase() === label
    );
    if (exists) return;

    const template = badgesEl.querySelector('[data-custom-discount-badge]');
    const badge = template ? template.cloneNode(true) : document.createElement('span');

    if (!template) {
      badge.className = 'custom-cart__discount-badge';
      badge.dataset.customDiscountBadge = '';
      const text = document.createElement('span');
      text.className = 'custom-cart__discount-badge-text';
      text.textContent = label;
      badge.appendChild(text);
    } else {
      const text = badge.querySelector('.custom-cart__discount-badge-text');
      if (text) text.textContent = label;
    }

    badgesEl.appendChild(badge);
  }

  function ensureSavingsRow() {
    const footerWrap = document.querySelector('.custom-cart__footer-wrap');
    if (!footerWrap) return null;

    const existing = footerWrap.querySelector('[data-custom-cart-savings]');
    if (existing) return existing;

    const savingsEl = document.createElement('div');
    savingsEl.className = 'custom-cart__savings';
    savingsEl.setAttribute('data-custom-cart-savings', '');
    savingsEl.dataset.shopifySavings = 'false';
    savingsEl.dataset.sawSavings = 'true';
    savingsEl.innerHTML = `
      <div class="custom-cart__savings-left">
        <span class="custom-cart__savings-label">Savings 🍯</span>
        <div class="custom-cart__savings-badges" data-custom-cart-savings-badges></div>
      </div>
      <span class="custom-cart__savings-amount" data-custom-cart-savings-amount></span>
    `;

    const protection = footerWrap.querySelector('[data-custom-protection]');
    footerWrap.insertBefore(savingsEl, protection || footerWrap.firstChild);
    return savingsEl;
  }

  function removeDynamicSavingsRow() {
    document
      .querySelectorAll('[data-custom-cart-savings][data-saw-savings="true"]')
      .forEach((node) => node.remove());
  }

  function updateSavingsFromSaw(res = {}) {
    const priceDiff = parseInt(res.price_difference, 10) || 0;

    let sawSavingsCents = priceDiff;
    if (sawSavingsCents <= 0 && window.saw_cart?.total_price != null && window.saw_discounted_total_cents != null) {
      sawSavingsCents = window.saw_cart.total_price - window.saw_discounted_total_cents;
    }

    const hasSawSavings = Boolean(window.saw_discount) && sawSavingsCents > 0;

    if (!hasSawSavings) {
      removeDynamicSavingsRow();
      return;
    }

    const savingsEl = ensureSavingsRow();
    if (!savingsEl) return;

    const badgesEl = savingsEl.querySelector('[data-custom-cart-savings-badges]');
    const amountEl = savingsEl.querySelector('[data-custom-cart-savings-amount]');

    if (amountEl) amountEl.textContent = `–${formatMoney(sawSavingsCents)}`;

    const discountCode = window.sawDocCookies?.getItem?.('saw_discount_code');
    if (discountCode) {
      ensureSavingsDiscountBadge(badgesEl, discountCode);
    } else if (res.discount_code_cart) {
      ensureSavingsDiscountBadge(badgesEl, res.discount_code_cart);
    }

    savingsEl.hidden = false;
  }

  async function fetchCart() {
    const url = window.routes?.cart_js_url || '/cart.js';
    const response = await fetch(url);
    return response.json();
  }

  return {
    SECTION_HANDLE,
    CART_ROOT_ID,
    SELECTOR,
    debounce,
    getSectionInnerHTML,
    getSectionHtmlFromState,
    formatMoney,
    getSectionsToRender,
    getRequestedSectionKeys,
    fetchConfig,
    fetchCart,
    getCartRoot,
    getConfig,
    isEnabled,
    patchNativeCart,
    patchCartDrawerContent,
    refreshDrawerAfterChange,
    getDrawerSectionsToRender,
    dispatchCartUpdated,
    refreshWholesaleDiscount,
    updateSavingsFromSaw,
    dedupeCartDrawerChrome,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (window.customCartDrawerEnabled || window.CustomCartUtils?.isEnabled()) {
    window.CustomCartUtils.patchNativeCart();
  }
});
