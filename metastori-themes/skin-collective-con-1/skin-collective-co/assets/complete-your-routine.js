import { Cart } from '@troop-themes/main';

if (!customElements.get('complete-your-routine')) {
  class CompleteYourRoutine extends HTMLElement {
    connectedCallback() {
      this.mediaImg = this.querySelector('[data-cyr-media-img]');
      this.items = [...this.querySelectorAll('[data-cyr-item]')];
      this.bulkButtons = [...this.querySelectorAll('[data-cyr-bulk]')];
      this.carousel = this.querySelector('[data-cyr-carousel]');
      this.currencySymbol = this.dataset.currencySymbol || '€';
      this.currencyFormat = this.dataset.currencyFormat || 'symbol';
      this.currencyCode = this.dataset.currencyCode || 'EUR';
      this.bulkLabelRoutine = this.dataset.bulkLabelRoutine || 'ADD ROUTINE TO CART';
      this.bulkLabelPair = this.dataset.bulkLabelPair || 'ADD ALL TO CART';
      this.inCartLabel = this.dataset.inCartLabel || 'IN CART';
      this.addLabel = this.dataset.addLabel || 'ADD TO CART';
      this.mode = this.dataset.mode || 'routine';
      this.busy = false;

      this.bindDesktopHover();
      this.bindAddButtons();
      this.bindBulkButtons();
      this.bindCarousel();
      this.bindContentFitWidth();
      this.refreshFromCart();

      window.on?.('theme:cart:updated.CompleteYourRoutine', () => this.refreshFromCart());
      document.addEventListener('theme:cart:updated', () => this.refreshFromCart());
    }

    disconnectedCallback() {
      window.off?.('theme:cart:updated.CompleteYourRoutine');
      window.removeEventListener('resize', this.onResizeFit);
      this.fitObserver?.disconnect();
    }

    bindDesktopHover() {
      this.items.forEach((item) => {
        const activate = () => this.setActiveMedia(item);
        item.addEventListener('mouseenter', activate);
        item.addEventListener('focusin', activate);
      });

      const first = this.items.find((item) => item.dataset.isCurrent === 'true') || this.items[0];
      if (first) this.setActiveMedia(first);
    }

    setActiveMedia(item) {
      const src = item.dataset.imageSrc;
      const srcset = item.dataset.imageSrcset || '';
      const alt = item.dataset.imageAlt || '';
      if (!this.mediaImg || !src) return;

      this.mediaImg.src = src;
      if (srcset) this.mediaImg.srcset = srcset;
      this.mediaImg.alt = alt;

      const width = Number(item.dataset.imageWidth);
      const height = Number(item.dataset.imageHeight);
      if (width > 0) this.mediaImg.width = width;
      if (height > 0) this.mediaImg.height = height;

      this.items.forEach((el) => el.toggleAttribute('data-active', el === item));
    }

    bindAddButtons() {
      this.querySelectorAll('[data-cyr-add]').forEach((button) => {
        button.addEventListener('click', async (event) => {
          event.preventDefault();
          if (this.busy || button.getAttribute('aria-disabled') === 'true') return;

          const item = button.closest('[data-cyr-item]');
          const variantId = Number(item?.dataset.variantId);
          if (!variantId) return;

          const cartIds = await this.getCartVariantIds();
          if (cartIds.has(variantId)) {
            this.markItemInCart(item, true);
            return;
          }

          await this.addItems([{ id: variantId, quantity: 1 }], button);
        });
      });
    }

    bindBulkButtons() {
      this.bulkButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
          event.preventDefault();
          if (this.busy || button.getAttribute('aria-disabled') === 'true') return;

          const cartIds = await this.getCartVariantIds();
          const seen = new Set();
          const items = [];

          this.items.forEach((item) => {
            const id = Number(item.dataset.variantId);
            const available = item.dataset.available !== 'false';
            if (!id || seen.has(id) || !available || cartIds.has(id)) return;
            seen.add(id);
            items.push({ id, quantity: 1 });
          });

          if (!items.length) {
            await this.refreshFromCart();
            return;
          }

          await this.addItems(items, button);
        });
      });
    }

    bindCarousel() {
      if (!this.carousel) return;

      const sectionId = this.dataset.sectionId;
      const nav = sectionId
        ? this.querySelector(`.carousel-nav-arrow[data-id="${sectionId}"]`)
        : this.querySelector('.complete-your-routine--header .carousel-nav-arrow');
      const prev = nav?.querySelector('.carousel-nav-arrow--prev');
      const next = nav?.querySelector('.carousel-nav-arrow--next');
      const current = nav?.querySelector('.carousel-nav-arrow--current');

      const getCards = () => [...this.carousel.querySelectorAll('[data-cyr-slide]')];

      const getMetrics = () => {
        const cards = getCards();
        if (!cards.length) return null;

        const cardWidth = cards[0].getBoundingClientRect().width || 1;
        const gap = parseFloat(getComputedStyle(this.carousel).columnGap || getComputedStyle(this.carousel).gap) || 0;
        return { cards, cardWidth, gap };
      };

      const getIndex = () => {
        const metrics = getMetrics();
        if (!metrics) return 0;

        const { cards, cardWidth, gap } = metrics;
        const index = Math.round(this.carousel.scrollLeft / (cardWidth + gap));
        return Math.min(Math.max(index, 0), cards.length - 1);
      };

      const scrollToIndex = (index) => {
        const metrics = getMetrics();
        if (!metrics) return;

        const { cards, cardWidth, gap } = metrics;
        const target = Math.min(Math.max(index, 0), cards.length - 1);
        this.carousel.scrollTo({
          left: target * (cardWidth + gap),
          behavior: 'smooth',
        });
      };

      const updateNav = () => {
        const metrics = getMetrics();
        if (!metrics) return;

        const { cards } = metrics;
        const index = getIndex();
        const currentNum = index + 1;

        if (current) current.setAttribute('data-value', String(currentNum));
        if (prev) prev.setAttribute('aria-disabled', index <= 0 ? 'true' : 'false');
        if (next) next.setAttribute('aria-disabled', index >= cards.length - 1 ? 'true' : 'false');
      };

      prev?.addEventListener('click', () => scrollToIndex(getIndex() - 1));
      next?.addEventListener('click', () => scrollToIndex(getIndex() + 1));

      this.carousel.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateNav);
      }, { passive: true });

      window.addEventListener('resize', updateNav, { passive: true });
      updateNav();
    }

    bindContentFitWidth() {
      this.list = this.querySelector('.complete-your-routine--list');
      this.onResizeFit = () => {
        window.cancelAnimationFrame(this.fitFrame);
        this.fitFrame = window.requestAnimationFrame(() => this.syncContentFitWidth());
      };

      this.syncContentFitWidth();
      document.fonts?.ready?.then?.(() => this.syncContentFitWidth());
      window.addEventListener('resize', this.onResizeFit, { passive: true });

      if (typeof ResizeObserver === 'function' && this.list) {
        this.fitObserver = new ResizeObserver(() => this.onResizeFit());
        this.list.querySelectorAll('[data-cyr-item]').forEach((item) => {
          this.fitObserver.observe(item);
        });
      }
    }

    syncContentFitWidth() {
      const list = this.list || this.querySelector('.complete-your-routine--list');
      if (!list) return;

      if (window.matchMedia('(max-width: 639px)').matches) {
        this.lastFitWidth = 0;
        list.style.removeProperty('--cyr-fit-width');
        return;
      }

      const probe = document.createElement('div');
      probe.setAttribute('aria-hidden', 'true');
      probe.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;height:auto;width:max-content;max-width:none;';
      list.appendChild(probe);

      let maxWidth = 0;
      const selectors = [
        '.complete-your-routine--item-meta',
        '.complete-your-routine--item-row',
        '.complete-your-routine--item-vendor',
      ];

      list.querySelectorAll('[data-cyr-item]').forEach((item) => {
        selectors.forEach((selector) => {
          const el = item.querySelector(selector);
          if (!el) return;
          const clone = el.cloneNode(true);
          clone.style.display = 'flex';
          clone.style.flexWrap = 'nowrap';
          clone.style.width = 'max-content';
          clone.style.maxWidth = 'none';
          clone.style.minWidth = '0';
          clone.style.whiteSpace = 'nowrap';

          const title = clone.querySelector('.complete-your-routine--item-title');
          if (title) {
            title.style.flex = '0 0 auto';
            title.style.width = 'max-content';
            title.style.minWidth = '0';
            title.style.whiteSpace = 'nowrap';
          }

          probe.replaceChildren(clone);
          maxWidth = Math.max(maxWidth, Math.ceil(probe.getBoundingClientRect().width));
        });
      });

      const bulk = list.querySelector('[data-cyr-bulk]');
      if (bulk) {
        const clone = bulk.cloneNode(true);
        clone.style.setProperty('display', 'inline-flex', 'important');
        clone.style.setProperty('flex-wrap', 'nowrap', 'important');
        clone.style.setProperty('align-items', 'center', 'important');
        clone.style.setProperty('justify-content', 'flex-start', 'important');
        clone.style.setProperty('width', 'max-content', 'important');
        clone.style.setProperty('min-width', 'max-content', 'important');
        clone.style.setProperty('max-width', 'none', 'important');
        clone.style.setProperty('align-self', 'flex-start', 'important');

        clone.querySelectorAll('[data-cyr-bulk-label], [data-cyr-bulk-price]').forEach((el) => {
          el.style.setProperty('flex', '0 0 auto', 'important');
          el.style.setProperty('min-width', 'max-content', 'important');
          el.style.setProperty('white-space', 'nowrap', 'important');
        });

        probe.replaceChildren(clone);
        maxWidth = Math.max(maxWidth, Math.ceil(probe.getBoundingClientRect().width));
      }

      probe.remove();

      if (maxWidth > 0 && maxWidth !== this.lastFitWidth) {
        this.lastFitWidth = maxWidth;
        list.style.setProperty('--cyr-fit-width', `${maxWidth}px`);
      }
    }

    async addItems(items, trigger) {
      this.busy = true;
      trigger?.setAttribute('aria-busy', 'true');

      try {
        await Cart.addItems(
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items,
              sections: Cart.sections,
            }),
          },
          trigger || false
        );
        await this.refreshFromCart();
      } catch (error) {
        console.error('[complete-your-routine]', error);
      } finally {
        this.busy = false;
        trigger?.setAttribute('aria-busy', 'false');
      }
    }

    async getCartVariantIds() {
      try {
        const response = await fetch(`${Shopify.routes.cart}.js`);
        if (!response.ok) return new Set();
        const cart = await response.json();
        return new Set((cart.items || []).map((item) => item.id));
      } catch (error) {
        return new Set();
      }
    }

    async refreshFromCart() {
      const cartIds = await this.getCartVariantIds();
      let addableCount = 0;
      let addableTotal = 0;
      const counted = new Set();

      this.items.forEach((item) => {
        const variantId = Number(item.dataset.variantId);
        const available = item.dataset.available !== 'false';
        const inCart = cartIds.has(variantId);
        const price = Number(item.dataset.price || 0);

        this.markItemInCart(item, inCart);

        if (available && !inCart && variantId && !counted.has(variantId)) {
          counted.add(variantId);
          addableCount += 1;
          addableTotal += price;
        }
      });

      this.updateBulkButtons(addableCount, addableTotal);
    }

    markItemInCart(item, inCart) {
      item.toggleAttribute('data-in-cart', inCart);
      item.querySelectorAll('[data-cyr-add]').forEach((button) => {
        button.setAttribute('aria-disabled', inCart ? 'true' : 'false');
        const label = button.querySelector('[data-cyr-add-label]');
        if (label) label.textContent = inCart ? this.inCartLabel : this.addLabel;
      });
    }

    updateBulkButtons(count, totalCents) {
      const labelBase = this.mode === 'pair' ? this.bulkLabelPair : this.bulkLabelRoutine;
      const label = count > 0
        ? `${labelBase} (${count} ${count === 1 ? 'ITEM' : 'ITEMS'})`
        : labelBase;
      const money = count > 0 ? this.formatMoney(totalCents) : '';

      this.bulkButtons.forEach((button) => {
        button.setAttribute('aria-disabled', count > 0 ? 'false' : 'true');
        const text = button.querySelector('[data-cyr-bulk-label]');
        const price = button.querySelector('[data-cyr-bulk-price]');
        if (text) text.textContent = label;
        if (price) price.textContent = money;
      });

      this.syncContentFitWidth();
    }

    formatMoney(cents) {
      const value = Number(cents) / 100;
      const amount = value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      if (this.currencyFormat === 'code') {
        return `${amount} ${this.currencyCode}`;
      }

      return `${amount} ${this.currencySymbol}`.trim();
    }
  }

  customElements.define('complete-your-routine', CompleteYourRoutine);
}
