class PageStickyProductBar extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('[data-pspb-form]');
    this.variantSelect = this.querySelector('[data-pspb-variant-select]');
    this.variantInput = this.querySelector('[data-pspb-variant-input]');
    this.variantBadge = this.querySelector('[data-pspb-variant-badge]');
    this.priceWrap = this.querySelector('[data-pspb-price]');
    this.compareEl = this.querySelector('[data-pspb-compare]');
    this.currentEl = this.querySelector('[data-pspb-current]');
    this.imageWrap = this.querySelector('[data-pspb-image]');
    this.atcButton = this.querySelector('[data-pspb-atc]');
    this.quantityInput = this.querySelector('[data-pspb-qty-input]');
    this.qtyMinusBtn = this.querySelector('[data-pspb-qty-minus]');
    this.qtyPlusBtn = this.querySelector('[data-pspb-qty-plus]');
    this.onQtyMinus = this.onQtyMinus.bind(this);
    this.onQtyPlus = this.onQtyPlus.bind(this);
    this.onQtyInputChange = this.onQtyInputChange.bind(this);
    this.showOnScroll = this.classList.contains('page-sticky-product-bar--scroll');
    this.showPriceAfterFaq = this.dataset.showPriceAfterFaq === 'true';
    this.faqSelector = this.dataset.faqSelector || '.faqs-section';
    this.scrollOffset = parseInt(this.dataset.scrollOffset || '300', 10);
    this.onScroll = this.onScroll.bind(this);
    this.onPriceScroll = this.onPriceScroll.bind(this);
    this.onVariantChange = this.onVariantChange.bind(this);
    this.onAddToCart = this.onAddToCart.bind(this);
    this.onResize = this.onResize.bind(this);
    this.faqSection = null;
    this.priceVisible = false;
  }

  connectedCallback() {
    if (this.atcButton && !this.atcButton.dataset.defaultLabel) {
      this.atcButton.dataset.defaultLabel = this.atcButton.textContent.trim();
    }

    this.variantSelect?.addEventListener('change', this.onVariantChange);
    this.form?.addEventListener('submit', this.onAddToCart);
    this.initQuantityControls();

    if (this.showOnScroll) {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    } else {
      this.setVisible(true);
    }

    if (this.showPriceAfterFaq && this.priceWrap) {
      this.faqSection = document.querySelector(this.faqSelector);
      window.addEventListener('scroll', this.onPriceScroll, { passive: true });
      this.onPriceScroll();
    }

    this.syncBarOffset();
    window.addEventListener('resize', this.onResize);
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('scroll', this.onPriceScroll);
    window.removeEventListener('resize', this.onResize);
    this.variantSelect?.removeEventListener('change', this.onVariantChange);
    this.form?.removeEventListener('submit', this.onAddToCart);
    this.qtyMinusBtn?.removeEventListener('click', this.onQtyMinus);
    this.qtyPlusBtn?.removeEventListener('click', this.onQtyPlus);
    this.quantityInput?.removeEventListener('change', this.onQtyInputChange);
    this.quantityInput?.removeEventListener('blur', this.onQtyInputChange);
    document.body.classList.remove('has-page-sticky-bar');
  }

  onResize() {
    this.syncBarOffset();
    if (this.showPriceAfterFaq) this.onPriceScroll();
  }

  onScroll() {
    this.setVisible(window.scrollY >= this.scrollOffset);
  }

  onPriceScroll() {
    if (!this.priceWrap) return;

    if (!this.faqSection) {
      this.setPriceVisible(true);
      return;
    }

    const faqRect = this.faqSection.getBoundingClientRect();
    const buttonLine = this.atcButton
      ? this.atcButton.getBoundingClientRect().top
      : this.getBoundingClientRect().top;

    // Show price only after the full FAQ section has scrolled past the ATC button
    this.setPriceVisible(faqRect.bottom <= buttonLine);
  }

  setPriceVisible(show) {
    if (!this.priceWrap || this.priceVisible === show) return;
    this.priceVisible = show;
    this.priceWrap.classList.toggle('is-hidden', !show);
  }

  setVisible(show) {
    this.classList.toggle('is-visible', show);
    document.body.classList.toggle('has-page-sticky-bar', show);
    if (show) this.syncBarOffset();
  }

  syncBarOffset() {
    if (!this.classList.contains('is-visible')) return;
    const height = this.offsetHeight || 0;
    document.documentElement.style.setProperty('--page-sticky-bar-offset', `${height}px`);
  }

  initQuantityControls() {
    if (!this.quantityInput) return;

    this.qtyMinusBtn?.addEventListener('click', this.onQtyMinus);
    this.qtyPlusBtn?.addEventListener('click', this.onQtyPlus);
    this.quantityInput.addEventListener('change', this.onQtyInputChange);
    this.quantityInput.addEventListener('blur', this.onQtyInputChange);
    this.clampQuantity();
  }

  getQuantity() {
    const value = parseInt(this.quantityInput?.value, 10);
    return Number.isNaN(value) ? 1 : value;
  }

  clampQuantity() {
    if (!this.quantityInput) return 1;

    const min = parseInt(this.quantityInput.min, 10) || 1;
    const max = parseInt(this.quantityInput.max, 10) || 9999;
    let qty = this.getQuantity();

    qty = Math.max(min, Math.min(max, qty));
    this.quantityInput.value = qty;

    if (this.qtyMinusBtn) this.qtyMinusBtn.disabled = qty <= min;
    if (this.qtyPlusBtn) this.qtyPlusBtn.disabled = qty >= max;

    return qty;
  }

  onQtyMinus(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.quantityInput) return;
    this.quantityInput.value = this.getQuantity() - 1;
    this.clampQuantity();
  }

  onQtyPlus(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.quantityInput) return;
    this.quantityInput.value = this.getQuantity() + 1;
    this.clampQuantity();
  }

  onQtyInputChange() {
    this.clampQuantity();
  }

  onAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (!this.atcButton || this.atcButton.disabled) return;

    const variantId = this.variantInput?.value;
    if (!variantId) return;

    const qty = this.clampQuantity();
    const $ = window.jQuery;

    if (!$) {
      this.addToCartFetch(variantId, qty);
      return;
    }

    const $btn = $(this.atcButton);
    const $input = this.quantityInput ? $(this.quantityInput) : null;

    if (typeof Shopify !== 'undefined' && typeof Shopify.addItem === 'function') {
      $btn.addClass('is-loading');
      Shopify.addItem(variantId, qty, $btn, () => {
        $btn.removeClass('is-loading');
        this.handleCartSuccess();
      }, $input);
      return;
    }

    this.addToCartFetch(variantId, qty);
  }

  handleCartSuccess() {
    const $ = window.jQuery;
    const afterAdd = window.after_add_to_cart || { type: 'quick_cart' };

    if (afterAdd.type === 'cart' && window.routes?.cart) {
      window.location.href = window.routes.cart;
      return;
    }

    if (typeof Shopify.getCart !== 'function') return;

    Shopify.getCart((cart) => {
      if (!$) return;

      const $body = $('body');
      $body.find('[data-cart-count]').text(cart.item_count);

      if (afterAdd.type === 'popup_cart_1') {
        $body.addClass('add-to-cart-show');
      }

      if (afterAdd.type === 'quick_cart' && window.quick_cart?.show !== false) {
        $body.addClass('cart-sidebar-show');
        const $cartDropdown = $('#halo-cart-sidebar .halo-sidebar-wrapper .previewCart-wrapper');

        if ($cartDropdown.length) {
          $.ajax({
            type: 'GET',
            url: `${window.routes?.root || '/'}cart?view=ajax_side_cart`,
            cache: false,
            success(data) {
              $cartDropdown.html($(data));
            }
          });
        }
      }
    });
  }

  addToCartFetch(variantId, qty) {
    this.atcButton.classList.add('is-loading');
    this.atcButton.disabled = true;

    fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: parseInt(variantId, 10), quantity: parseInt(qty, 10) || 1 })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status && data.status >= 400) throw data;
        this.handleCartSuccess();
      })
      .catch((error) => {
        console.error('Add to cart failed:', error);
        const message = error?.description || error?.message;
        if (message) alert(message);
      })
      .finally(() => {
        this.atcButton.classList.remove('is-loading');
        if (!this.atcButton.hasAttribute('data-sold-out')) {
          this.atcButton.disabled = false;
        }
      });
  }

  onVariantChange(event) {
    const option = event.target.selectedOptions[0];
    if (!option) return;

    const variantId = option.value;
    const price = parseInt(option.dataset.price || '0', 10);
    const comparePrice = parseInt(option.dataset.comparePrice || '0', 10);
    const available = option.dataset.available === 'true';
    const title = option.dataset.title || option.textContent.trim();
    const imageUrl = option.dataset.imageUrl;

    if (this.variantInput) this.variantInput.value = variantId;
    if (this.variantBadge) this.variantBadge.textContent = title;
    if (this.quantityInput) this.quantityInput.dataset.price = price;

    this.updatePrice(price, comparePrice);
    this.updateImage(imageUrl);
    this.updateAtc(available);
  }
 
  updatePrice(price, comparePrice) {
    if (!this.currentEl || typeof Shopify === 'undefined') return;

    const formatted = Shopify.formatMoney(price, window.money_format);
    this.currentEl.innerHTML = `<span class="money">${formatted}</span>`;

    if (comparePrice > price) {
      const compareFormatted = Shopify.formatMoney(comparePrice, window.money_format);
      if (this.compareEl) {
        this.compareEl.innerHTML = `<span class="money">${compareFormatted}</span>`;
        this.compareEl.hidden = false;
      } else if (this.priceWrap) {
        const compare = document.createElement('s');
        compare.className = 'page-sticky-product-bar__compare';
        compare.setAttribute('data-pspb-compare', '');
        compare.innerHTML = `<span class="money">${compareFormatted}</span>`;
        this.priceWrap.prepend(compare);
        this.compareEl = compare;
      }
      this.priceWrap?.classList.add('page-sticky-product-bar__price--sale');
    } else if (this.compareEl) {
      this.compareEl.remove();
      this.compareEl = null;
      this.priceWrap?.classList.remove('page-sticky-product-bar__price--sale');
    }
  }

  updateImage(imageUrl) {
    if (!imageUrl || !this.imageWrap) return;
    const img = this.imageWrap.querySelector('img');
    if (img) {
      img.src = imageUrl;
      img.srcset = imageUrl;
    }
  }

  updateAtc(available) {
    if (!this.atcButton) return;
    this.atcButton.disabled = !available;
    if (available) {
      this.atcButton.removeAttribute('data-sold-out');
    } else {
      this.atcButton.setAttribute('data-sold-out', '');
    }
    this.atcButton.textContent = available
      ? this.atcButton.dataset.defaultLabel || 'Add to cart'
      : window.variantStrings?.soldOut || 'Sold out';
  }
}

if (!customElements.get('page-sticky-product-bar')) {
  customElements.define('page-sticky-product-bar', PageStickyProductBar);
}
