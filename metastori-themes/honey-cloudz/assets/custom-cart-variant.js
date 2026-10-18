/**
 * Custom Cart — variant picker for cross-sell recommendations.
 */
class CustomCartVariants {
  constructor(card) {
    this.card = card;
    this.select = card.querySelector('[data-custom-cross-sell-select]');
    this.priceWrap = card.querySelector('[data-custom-cross-sell-price-wrap]');
    this.priceEl = card.querySelector('[data-custom-cross-sell-price]');
    this.compareEl = card.querySelector('[data-custom-cross-sell-compare]');
    this.imageEl = card.querySelector('[data-custom-cross-sell-image]');
    this.addBtn = card.querySelector('[data-custom-cross-sell-add]');
    this.hiddenInput = card.querySelector('[data-custom-cross-sell-variant]');

    this.bindEvents();
  }

  bindEvents() {
    if (this.select) {
      this.select.addEventListener('change', () => this.onVariantChange());
    }
  }

  updatePriceDisplay(price, comparePrice) {
    if (!this.priceEl || Number.isNaN(price)) return;

    this.priceEl.textContent = window.CustomCartUtils.formatMoney(price);

    if (comparePrice > price) {
      if (!this.compareEl) {
        const compare = document.createElement('s');
        compare.className = 'custom-cart__recommendation-price-compare';
        compare.setAttribute('data-custom-cross-sell-compare', '');
        this.priceWrap?.insertBefore(compare, this.priceEl);
        this.compareEl = compare;
      }
      this.compareEl.textContent = window.CustomCartUtils.formatMoney(comparePrice);
      this.compareEl.hidden = false;
    } else if (this.compareEl) {
      this.compareEl.hidden = true;
    }

    if (this.addBtn) {
      this.addBtn.dataset.price = String(price);
    }
  }

  onVariantChange() {
    const option = this.select.selectedOptions[0];
    if (!option) return;

    const price = parseInt(option.dataset.price, 10);
    const comparePrice = parseInt(option.dataset.comparePrice || '0', 10);
    const available = option.dataset.available === 'true';
    const image = option.dataset.image;

    this.updatePriceDisplay(price, comparePrice);

    if (this.imageEl && image) {
      this.imageEl.src = image;
    }
    if (this.addBtn) {
      this.addBtn.dataset.variantId = option.value;
      this.addBtn.disabled = !available;
    }
  }

  static bindAll(container = document) {
    container.querySelectorAll('[data-custom-cross-sell-card]').forEach((card) => {
      if (!card.__customVariantBound) {
        card.__customVariantBound = true;
        new CustomCartVariants(card);
      }
    });
  }
}

window.CustomCartVariants = CustomCartVariants;
