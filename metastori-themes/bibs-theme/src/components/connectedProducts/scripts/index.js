import { debounce } from '../../../scripts/utils/debounce';
import { initButtons } from '../../../sections/wishlist/scripts/wishlist';

if (!customElements.get('connected-products')) {
  class ConnectedProducts extends HTMLElement {
    constructor() {
      super();
      this.el = this;

      this.colorPlaceholder = this.el.querySelector('[data-color-placeholder]');
      this.swatches = this.el.querySelectorAll('.slider-item');
      this.mainSwatch = this.el.querySelector('.slider-item.main-slider-item');
      this.connectedProductData = [];

      this.productCard = this.el.closest('product-card');
      if (this.productCard) this.setDefaultSwatch = this.productCard.dataset.setDefaultColorSwatch;
      this.isRendered = this.el.getAttribute('data-render') === 'true';
      this.isSubscription = this.el.getAttribute('data-subscription-products') === 'true';

      this.remainingSwatches = this.el.querySelector('[data-remaining-swatches]');
      this.remainingSwatchesCount = this.remainingSwatches.querySelector('[data-remaining-swatches-count]');

      if (this.mainSwatch) this.productId = this.mainSwatch.getAttribute('data-connected-product-id');

      this.productHandle = this.el.dataset.productHandle;
      const root_url = window.routes.root_url;

      if (window.theme?.template?.suffix?.includes('subscription') && this.isSubscription) {
        this.connectedProductsHref = `${root_url}products/${this.productHandle}?view=subscription-connected-products`;
      } else {
        this.connectedProductsHref = `${root_url}products/${this.productHandle}?view=connected-products`;
      }

      if (!this.isRendered) {
        setTimeout(() => {
          this.getConnectedProductsHtml(this.connectedProductsHref);
        }, 5000);
      } else {
        this.swatches.forEach((swatch) => {
          swatch.addEventListener(
            'mouseenter',
            debounce(() => {
              this.onhover(swatch, 'mouseenter');
            }, 100)
          );
        });

        this.addEventListener(
          'mouseleave',
          debounce(async () => {
            await this.onhover(this.mainSwatch, 'mouseleave');
          }, 100).bind(this)
        );

        this.inProductCard = this.el.classList.contains('in-product-card');
        this.inProductPage = this.el.classList.contains('in-product-page');
        this.variantSelector = this.el.parentNode.querySelector('variant-selector');

        if (this.inProductPage) this.adjustConnectedProductAvailability();

        if (this.variantSelector) {
          this.variantSelector.addEventListener('variant-changed', () => {
            this.adjustConnectedProductAvailability();
            this.reorderPDPSwatchesBasedOnAvailability();
          });
        }

        this.calculateSwatchesOnPages();
      }
    }

    reorderPDPSwatchesBasedOnAvailability() {
      if (this.remainingSwatches.classList.contains('!hidden')) return;
      const max = window.swatches.maxAmount ? window.swatches.maxAmount : 50;
      const connectedProductSwatches = this.swatches;
      if (max >= connectedProductSwatches.length) {
        this.remainingSwatches.classList.add('!hidden');
        return;
      }
      if (this.remainingSwatchesCount) this.remainingSwatchesCount.innerHTML = `(${connectedProductSwatches.length - max})`;

      const ArrayOfSwatches = Array.from(connectedProductSwatches);

      // Reset all swatches to visible
      ArrayOfSwatches.forEach(function (item) {
        item.style.display = 'flex';
      });

      // Calculate the visual order considering the 'order' property
      let visualOrder = ArrayOfSwatches.map(function (item) {
        return parseInt(window.getComputedStyle(item).getPropertyValue('order'), 10);
      });

      // Sort elements based on the visual order
      ArrayOfSwatches.sort(function (a, b) {
        return visualOrder[Array.prototype.indexOf.call(ArrayOfSwatches, a)] - visualOrder[Array.prototype.indexOf.call(ArrayOfSwatches, b)];
      });

      // Hide elements above the max amount
      ArrayOfSwatches.slice(max).forEach(function (item) {
        item.style.display = 'none';
      });

      this.remainingSwatches.addEventListener('click', () => {
        this.swatches.forEach((swatch) => {
          swatch.style.display = 'flex';
        });
        this.remainingSwatches.classList.add('!hidden');
      });
    }

    adjustConnectedProductAvailability() {
      const connectedProductAvailabilityDataRaw = this.el.querySelector('[connected-product-data]')?.textContent;
      let connectedProductAvailabilityData;
      if (connectedProductAvailabilityDataRaw) {
        connectedProductAvailabilityData = JSON.parse(connectedProductAvailabilityDataRaw);
      }

      if (!connectedProductAvailabilityData || this.inProductCard) return;
      this.getSelectedOptions();
      const connectedProducts = document.querySelector('connected-products.in-product-page.is-color-swatches');

      connectedProductAvailabilityData.forEach((connectedProduct) => {
        let productAvailable = false;
        let matchingVariantID = false;
        let alloptionsChoosen = true;
        connectedProduct.variants?.forEach((variant) => {
          if (variant.availability) {
            let matchingChosenOptions = true;
            productAvailable = true;
            if (!connectedProduct.has_only_default_variant) {
              this.options.forEach((option) => {
                if (!variant.options.includes(option)) {
                  matchingChosenOptions = false;
                }
                if (!option) {
                  alloptionsChoosen = false;
                }
              });
            }
            if (matchingChosenOptions) {
              matchingVariantID = variant.variant_id;
            }
          }
        });

        const associatedColorSwatch = connectedProducts?.querySelector("[data-connected-product-id='" + connectedProduct.product_id + "']");
        if (associatedColorSwatch) {
          if (productAvailable) {
            associatedColorSwatch.classList.remove('disabled');
          } else {
            associatedColorSwatch.classList.add('disabled');
          }
          let productHref = '';
          if (associatedColorSwatch.href.includes('?variant=')) {
            productHref = associatedColorSwatch.href.split('?variant=');
            associatedColorSwatch.href = productHref[0];
          }
          if (matchingVariantID) {
            let variantHref = associatedColorSwatch.href + '?variant=' + matchingVariantID;
            associatedColorSwatch.href = variantHref;
          }
          // only enable/disable color swatches if the current variant is selected is present
          if (alloptionsChoosen && !connectedProduct.has_only_default_variant && this.options[0] != 'Default Title') {
            if (matchingVariantID) {
              associatedColorSwatch.classList.remove('disabled');
            } else {
              associatedColorSwatch.classList.add('disabled');
            }
          }
        }
      });
    }

    getSelectedOptions() {
      const fieldsets = Array.from(document.querySelectorAll('#variant-selector fieldset'));
      this.options = fieldsets.map((fieldset) => {
        const optionValueEl = fieldset.querySelector('[data-option-value]');
        const activeOptionValue = Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked)?.value;
        if (activeOptionValue) {
          optionValueEl.textContent = activeOptionValue;
          return activeOptionValue;
        }
        return null;
      });
    }

    async getConnectedProductsHtml(href) {
      try {
        const resp = await fetch(href, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseText = await resp.text();
        const respDOM = new DOMParser().parseFromString(responseText, 'text/html');
        const connectedProducts = respDOM.querySelector('connected-products');
        if (!connectedProducts) return;
        const fetchedConnectedProducts = connectedProducts.cloneNode(true);
        const parent = this.el.parentNode;
        if (this.el && parent) {
          parent.replaceChild(fetchedConnectedProducts, this.el);
        } else {
          console.error('Element to replace not found or not properly referenced.');
        }

        this.el = parent.querySelector('connected-products');
        this.colorPlaceholder = this.el.querySelector('[data-color-placeholder]');
        this.swatches = this.el.querySelectorAll('.slider-item');
        this.mainSwatch = this.el.querySelector('.slider-item.main-slider-item');
        if (this.mainSwatch) this.productId = this.mainSwatch.getAttribute('data-connected-product-id');

        this.remainingSwatches = this.el.querySelector('[data-remaining-swatches]');
        this.remainingSwatchesCount = this.remainingSwatches.querySelector('[data-remaining-swatches-count]');

        this.inProductCard = this.el.classList.contains('in-product-card');
        this.inProductPage = this.el.classList.contains('in-product-page');

        this.calculateSwatchesOnPages();
      } catch (error) {
        console.log('Error fetching connected products:', error);
      }
    }

    calculateSwatchesOnPages() {
      if (this.inProductCard) {
        this.calculateRemainingSwatches();
        window.addEventListener(
          'resize',
          debounce(() => {
            this.calculateRemainingSwatches();
          }, 100).bind(this)
        );
      }

      if (this.inProductPage) {
        this.reorderPDPSwatchesBasedOnAvailability();
      }
    }

    calculateRemainingSwatches() {
      let containerWidth = this.el.offsetWidth;
      let renderedSwatches = 0;
      this.swatches.forEach((swatch) => {
        swatch.classList.remove('!hidden');

        const swatchPosition = swatch.offsetLeft + swatch.offsetWidth;
        containerWidth -= 6;

        if (swatchPosition > containerWidth) {
          swatch.classList.add('!hidden');
        } else {
          renderedSwatches++;
        }
      });

      const remainingSwatches = this.swatches.length - renderedSwatches;
      if (this.remainingSwatchesCount && remainingSwatches > 0) {
        this.remainingSwatchesCount.innerHTML = `+${remainingSwatches}`;
      } else {
        this.remainingSwatchesCount.classList.add('!hidden');
      }
    }

    async onhover(swatch, eventType = 'mouseenter') {
      if (!swatch) return;

      if (eventType === 'mouseenter') {
        this.swatches.forEach((s) => {
          s.classList.remove('active');
        });

        const color = swatch.getAttribute('data-color');
        if (this.colorPlaceholder) this.colorPlaceholder.innerHTML = color;

        swatch.classList.add('active');

        const mq = window.matchMedia('(min-width: 768px)');
        if (mq.matches) {
          const connectedProductHandle = swatch.getAttribute('data-connected-product-handle');
          this.connectedProductId = swatch.getAttribute('data-connected-product-id');

          const connectedProductHtml = await this.getProductData(connectedProductHandle);
          if (connectedProductHtml) {
            this.renderProduct(connectedProductHtml);
          }
        }
      } else if (eventType === 'mouseleave') {

        this.swatches.forEach((s) => {
          s.classList.remove('active');
        });

        if (this.mainSwatch) {
          this.mainSwatch.classList.add('active');

          const mainColor = this.mainSwatch.getAttribute('data-color');
          if (this.colorPlaceholder && mainColor) this.colorPlaceholder.innerHTML = mainColor;

          const mq = window.matchMedia('(min-width: 768px)');
          if (mq.matches) {
            const mainProductHandle = this.mainSwatch.getAttribute('data-connected-product-handle');
            this.connectedProductId = this.mainSwatch.getAttribute('data-connected-product-id');

            const mainProductHtml = await this.getProductData(mainProductHandle);
            if (mainProductHtml) {
              this.renderProduct(mainProductHtml);
            }
          }
        }
      }
    }

    async getProductData(productHandle) {
      if (this.connectedProductData[productHandle]) return this.connectedProductData[productHandle];

      const data = await fetch(`${window.routes.root_url}products/${productHandle}?view=card`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resp = await data.text();
      this.connectedProductData[productHandle] = resp;

      this.productData = resp;
      return this.productData;
    }

    renderProduct(html) {
      const destination = this.el.closest(`#CardWrapper-${this.productId}`);
      const parsedHtml = new DOMParser().parseFromString(html, 'text/html');
      const source = parsedHtml.querySelector(`#CardWrapper-${this.connectedProductId}`);

      if (destination && source) {
        const destinationCardInner = destination.querySelector('.product-card-image-wrapper');
        const sourceCardInner = source.querySelector('.product-card-image-wrapper');
        if (destinationCardInner && sourceCardInner) destinationCardInner.innerHTML = sourceCardInner.innerHTML;

        const destinationCardInfoPrice = destination.querySelector('.product-card-title-wrapper');
        const sourceCardInfoPrice = source.querySelector('.product-card-title-wrapper');
        if (destinationCardInfoPrice && sourceCardInfoPrice) destinationCardInfoPrice.innerHTML = sourceCardInfoPrice.innerHTML;

        const destinationCardQuickAdd = destination.querySelector('.product-card-vendor-wrapper');
        const sourceCardQuickAdd = source.querySelector('.product-card-vendor-wrapper');
        if (destinationCardQuickAdd && sourceCardQuickAdd) destinationCardQuickAdd.innerHTML = sourceCardQuickAdd.innerHTML;

        initButtons();

        const event = new CustomEvent('connected-products:changed', {});
        destination.dispatchEvent(event);
      }
    }
  }
  customElements.define('connected-products', ConnectedProducts);
}
