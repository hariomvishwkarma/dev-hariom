class ProductUpsells extends HTMLElement {
  connectedCallback() {
    if (!this.dataset.productId) return;
    this.init();
  }

  async ensureSwiper() {
    if (window.Swiper) return window.Swiper;
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs');
      const SwiperCtor = mod.default?.Swiper || mod.Swiper || mod.default || window.Swiper;
      if (!SwiperCtor) throw new Error('Swiper not found in module');
      return SwiperCtor;
    } catch (e) {
      console.warn('[ProductUpsells] Swiper load failed, slider will not initialize.', e);
      return null;
    }
  }
  async initSwiper() {
    const SwiperCtor = await this.ensureSwiper();
    if (!SwiperCtor) return null;

    const containerEl = this.querySelector('.product-list.swiper');
    if (!containerEl) {
      return null;
    }

    const wrapper = containerEl.querySelector('.product-recs-list');
    if (!wrapper) {
      return null;
    }

    const prevEl = this.querySelector('.prev .custom-slider-button');
    const nextEl = this.querySelector('.next .custom-slider-button');

    const swiper = new SwiperCtor(containerEl, {
      wrapperClass: 'product-recs-list',
      slideClass: 'swiper-slide',
      slidesPerView: 2,
      spaceBetween: 16,
      navigation: { prevEl, nextEl },
      observeParents: true,
      observer: true,
    });

    return swiper;
  }


  async fetchResponse() {
    let container = this.querySelector('#product-recommendations');
    if (!container) {
      const host = this.querySelector('.product-list') || this;
      container = document.createElement('div');
      container.id = 'product-recommendations';
      host.appendChild(container);
    }

    const productId = this.dataset.productId;
    const intent = this.dataset.intent || 'related';
    const limit = Number(this.dataset.limit || 8);
    const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
    const url = `${root}recommendations/products.json?product_id=${encodeURIComponent(productId)}&limit=${encodeURIComponent(limit)}&intent=${encodeURIComponent(intent)}`;

    container.innerHTML = `<div class="product-recs-loading" aria-live="polite">Loading…</div>`;

    try {
      const response = await fetch(url, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('[ProductUpsells]', err);
      container.innerHTML = '';
      return { products: [] };
    }
  }

  async fetchProduct({ handle }, listEl) {
    try {
      const res = await fetch(`/products/${encodeURIComponent(handle)}?view=recommendation`, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`Card HTTP ${res.status} for ${handle}`);
      const html = await res.text();

      const li = document.createElement('li');
      li.className = 'product-recs__item swiper-slide';
      li.innerHTML = html;
      listEl.appendChild(li)
    } catch (e) {
      console.warn('[ProductUpsells] card fetch failed for', handle, e);
    }
  }

  async init() {
    const container = this.querySelector('#product-recommendations') || this;

    try {
      const { products = [] } = await this.fetchResponse();
      if (!products.length) {
        container.innerHTML = '';
        return;
      }

      container.querySelector('.product-recs-loading')?.remove();

      const intent = this.dataset.intent || 'related';

      let listEl = container.querySelector('ul.product-recs-list');
      if (!listEl) {
        listEl = document.createElement('ul');
        listEl.className = `product-recs-list swiper-wrapper`;
        listEl.setAttribute('role', 'list');
        container.appendChild(listEl);
      } else {
        listEl.classList.add('swiper-wrapper');
        listEl.innerHTML = '';
      }

      await Promise.allSettled(products.map((p) => this.fetchProduct(p, listEl)));

      const swiper = await this.initSwiper();
      document.dispatchEvent(new CustomEvent('related-products:loaded'));

    } catch (error) {
      console.error(error);
      container.innerHTML = '';
    } finally {
      this.setAttribute('hydrated', '');
      this.dispatchEvent(new CustomEvent('product-recs:hydrated', {
        bubbles: true,
      }));
    }
  }
}

if (!customElements.get('custom-slider-component')) {
  customElements.define('custom-slider-component', ProductUpsells);
}
