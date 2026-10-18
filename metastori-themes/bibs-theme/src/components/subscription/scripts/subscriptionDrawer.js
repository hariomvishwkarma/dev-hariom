import { debounce } from '../../../scripts/utils/debounce';
import replaceCartContent from '../../cart/replaceCartContent';

if (!customElements.get('subscription-drawer')) {
  class SubscriptionDrawer extends HTMLElement {
    constructor() {
      super();

      this.cachedProducts = {};

      this.initEventListerners();
    }

    initEventListerners() {
      const _this = this;

      document.addEventListener('quick-view:open', () => {
        _this.init();
      });

      _this.drawerOpener = document.querySelector('.subscription-drawer-opener');
      _this.drawerOpener?.addEventListener('click', (e) => {
        e.preventDefault();
        _this.dataset.drawerOpen = true;
      });

      _this.backdrop = _this.querySelector('.subscription-selection--backdrop');
      _this.backdrop?.addEventListener('click', (e) => {
        e.preventDefault();
        _this.dataset.drawerOpen = false;
      });

      _this.closeButton?.addEventListener('click', (e) => {
        e.preventDefault();
        _this.dataset.drawerOpen = false;
      });

      this.subscriptionBuilderForm?.addEventListener('submit', (e) => this.onAddSubscriptionToCart(e));
    }

    init() {
      this.productForm = this.querySelector('.subscription-product-form');
      this.productsList = this.querySelector('.subscription-selection--products-list');
      this.subtotal_placeholder = this.querySelector('.subscription-selection--subtotal');

      this.sellingPlanInput = this.querySelector('input[name="selling_plan"]');

      if (this.subscriptionBuilderForm) this.subscriptionsWrapper = this.subscriptionBuilderForm.querySelector('.subscription-selection--subscriptions');
      this.upsellProductsWrapper = this.querySelector('.subscription-selection--upsell-products');
      this.subscriptionSelector = this.querySelector('.subscription-selection--subscriptions-options');

      this.header = this.querySelector('.subscription-selection--header');
      this.upsellHeader = this.querySelector('.subscription-selection-upsell--header');

      this.productForm?.addEventListener('submit', (e) => this.onAddToSubscription(e));

      if (this.subscriptionSelector) this.subscriptionSelector.addEventListener('change', (e) => this.onSubscriptionChange(e));

      if (this.upsellCloseButton) this.upsellCloseButton.addEventListener('click', () => this.closeUpsellProducts());

      this.debouncedRemoveProduct = debounce((product) => {
        this.removeProduct(product);
      }, 100);
    }

    get subscriptionBuilderForm() {
      return this.querySelector('form#subscription_builder');
    }

    get hasUpsellProducts() {
      if (this.subscriptionBuilderForm) return this.subscriptionBuilderForm.classList.contains('has_upsell_products');
    }

    get productId() {
      if (this.productForm) return this.productForm.querySelector('[name="product-id"]')?.value;
    }

    get productHandle() {
      if (this.productForm) return this.productForm.querySelector('[name="product-handle"]')?.value;
    }

    set productHandle(productHandle) {
      this._productHandle = productHandle;
    }

    get selectedVariant() {
      if (this.productForm) return this.productForm.querySelector('[name="id[]"]')?.value;
    }

    set selectedVariant(selectedVariant) {
      this._selectedVariant = selectedVariant;
    }

    get quantity() {
      if (this.productForm) {
        const quantityInput = this.productForm.querySelector('[name="quantity"]');
        if (quantityInput) {
          return parseInt(quantityInput.value);
        }
      }
      return 1;
    }

    get sellingPlan() {
      if (this.subscriptionBuilderForm) return this.subscriptionBuilderForm.querySelector('input[name="subscription_frequency"]:checked')?.dataset.sellingPlanId;
    }

    set sellingPlan(sellingPlan) {
      if (this.sellingPlanInput) this.sellingPlanInput.value = sellingPlan;
    }

    get submitButton() {
      if (this.subscriptionBuilderForm) return this.subscriptionBuilderForm.querySelector('button#subscription-submit-button');
    }

    get href() {
      if (!this.productHandle || !this.sellingPlan) return;
      let href = `${window.routes.root_url}/products/${this.productHandle}?variant=${this.selectedVariant}&view=subscription-drawer-item&selling_plan=${this.sellingPlan}`;

      href = href.replace('//', '/');

      return href;
    }

    set href(href) {
      this._href = href;
    }

    get spinner() {
      if (this.productForm) return this.productForm.querySelector('.add-to-subscription-button-spinner');
      return null;
    }

    get emptyPlaceholder() {
      if (!this.productsList) return;
      let emptyPlaceholder = this.productsList.querySelector('.subscription-selection--product.subscription-selection--product-skeleton');
      if (!emptyPlaceholder) {
        emptyPlaceholder = document.createElement('div');
        emptyPlaceholder.classList.add('subscription-selection--product', 'subscription-selection--product-skeleton');
        this.productsList.appendChild(emptyPlaceholder);
      }
      return emptyPlaceholder;
    }

    get closeButtonWrapper() {
      return this.querySelector('.upsell-close-button');
    }

    get upsellCloseButton() {
      if (this.closeButtonWrapper) return this.closeButtonWrapper.querySelector('button');
    }

    get closeButton() {
      return this.querySelector('[data-drawer-close]');
    }

    addEmptyPlaceholder() {
      if (!this.productsList) return;
      const emptyPlaceholder = this.productsList.getElementsByTagName('template')[0];
      if (emptyPlaceholder) {
        const cloneEmptyPlaceholder = emptyPlaceholder.content.cloneNode(true);
        this.productsList.appendChild(cloneEmptyPlaceholder);
      }
    }

    async onAddToSubscription(e) {
      e.preventDefault();

      if (!this.href || !this.productHandle) {
        return;
      }

      if (this.spinner) {
        if (!this.spinner.classList.contains('hidden')) {
          return;
        }
        this.spinner.classList.remove('hidden');
      }

      await this.fetchSubscriptionItem();

      const mq = window.matchMedia('(min-width: 1024px)');
      if (!mq.matches) {
        const productDrawer = document.querySelector('[data-component-id="Product-drawer"]');
        if (productDrawer) {
          productDrawer.close();
        }
        this.dataset.drawerOpen = true;
      }
    }

    async onAddSubscriptionToCart(e) {
      e.preventDefault();
      if (e.submitter.classList.contains('disabled')) {
        this.dataset.drawerOpen = false;
        return;
      } else {
        if (this.hasUpsellProducts && this.dataset.upsellOpen !== 'true') {
          this.openUpsellProducts();
        } else {
          let spinner;
          const cartElement = document.querySelector('[data-component-id="cart-drawer"]');
          if (this.submitButton) spinner = this.submitButton.querySelector('.add-to-cart-button-spinner');

          if (spinner) spinner.classList.remove('hidden');

          const formData = {
            items: [],
          };

          const allProducts = this.subscriptionBuilderForm.querySelectorAll('.subscription-selection--products-list .subscription-selection--product:not(.subscription-selection--product-skeleton)');
          const sellingPlanId = this.subscriptionBuilderForm.querySelector('input[name="selling_plan"]')?.value;
          allProducts.forEach((product) => {
            const productId = product.querySelector('input[name="id[]"]');
            const quantity = product.querySelector('input[name="quantity"]');

            if (productId && quantity) {
              formData.items.push({
                id: productId.value,
                quantity: quantity.value,
                selling_plan: parseInt(sellingPlanId),
                subscription_frequency: this.subscriptionBuilderForm.querySelector('input[name="subscription_frequency"]:checked')?.value,
              });
            }
          });

          if (sellingPlanId) {
            const itemsCount = formData.items.reduce((acc, item) => acc + parseInt(item.quantity), 0);

            if (itemsCount < 3) {
              this.onErrorMsg(window.variantStrings.atleastthreeProducts, this.subscriptionBuilderForm);
              if (spinner) spinner.classList.add('hidden');
              return;
            }
          }

          const errorMessageElement = this.subscriptionBuilderForm.querySelector('[data-product-form-error-message]');
          if (errorMessageElement) {
            errorMessageElement.textContent = '';
            errorMessageElement.classList.add('hidden');
          }

          const variantAdded = await this.addVariantToCart(formData, this.subscriptionBuilderForm, cartElement);

          if (variantAdded) {
            await replaceCartContent();
            cartElement.open();
            const mq = window.matchMedia('(min-width: 1024px)');
            if (!mq.matches) {
              this.dataset.drawerOpen = false;
            }
          }
          if (spinner) spinner.classList.add('hidden');
        }
      }
    }

    openUpsellProducts() {
      this.dataset.upsellOpen = true;
      this.header.classList.add('hidden');
      this.upsellHeader.classList.remove('hidden');
      this.upsellProductsWrapper.classList.remove('!hidden');
      const connectedProducts = this.upsellProductsWrapper.querySelectorAll('connected-products');
      connectedProducts.forEach((connectedProduct) => {
        connectedProduct.calculateRemainingSwatches();
      });

      this.productsList.classList.add('!hidden');
      this.subscriptionsWrapper.classList.add('!hidden');
      if (this.closeButtonWrapper) this.closeButtonWrapper.classList.remove('hidden');
      this.toggleSubmitButton();
    }

    closeUpsellProducts() {
      this.dataset.upsellOpen = false;
      this.header.classList.remove('hidden');
      this.upsellHeader.classList.add('hidden');
      this.upsellProductsWrapper.classList.add('!hidden');
      this.productsList.classList.remove('!hidden');
      this.subscriptionsWrapper.classList.remove('!hidden');
      if (this.closeButtonWrapper) this.closeButtonWrapper.classList.add('hidden');
      this.toggleSubmitButton();
    }

    onErrorMsg(errorMessage = false) {
      const errorMessageElement = this.subscriptionBuilderForm.querySelector('[data-product-form-error-message]');
      if (!errorMessageElement) return;
      this.errorMessage = errorMessage || errorMessageElement.querySelector('.product-form__error-message');
      errorMessageElement.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        errorMessageElement.textContent = errorMessage;
        errorMessageElement.classList.remove('hidden');
      }
    }

    async addVariantToCart(formData, form, cartElement) {
      try {
        const response = await fetch(`${window.routes.root_url}cart/add.js`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok || data.status) {
          this.onErrorMsg(data.description || 'Error adding product to cart', form);
          return false;
        }

        if (!cartElement) {
          window.location = window.routes.cart_url;
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error adding variant to cart:', error);
        return false;
      }
    }

    async onSubscriptionChange(e) {
      e.preventDefault();
      this.sellingPlan = this.subscriptionBuilderForm.querySelector('input[name="subscription_frequency"]:checked')?.dataset.sellingPlanId;
      if (!this.sellingPlan) return;

      const products = this.productsList.querySelectorAll('.subscription-selection--product:not(.subscription-selection--product-skeleton)');

      let href;
      for (const product of products) {
        href = `${window.routes.root_url}/products/${product.dataset.handle}?variant=${product.dataset.variant}&view=subscription-drawer-item&selling_plan=${this.sellingPlan}`;
        href = href.replace('//', '/');

        const productHandle = product.dataset.handle;
        const selectedVariant = product.dataset.variant;
        const quantity = product.dataset.quantity;

        await this.fetchSubscriptionItem(product, href, productHandle, selectedVariant, quantity);
      }
    }

    updateQuantity(wrapper, quantity) {
      if (wrapper) {
        const quantityInput = wrapper.querySelector('[name="quantity"]');
        if (quantityInput) quantityInput.value = quantity;
      }
    }

    onProductsListUpdate() {
      const event = new CustomEvent('subscription-productList:updated');
      document.dispatchEvent(event);

      const products = this.productsList.querySelectorAll('.subscription-selection--product:not(.subscription-selection--product-skeleton)');

      this.toggleSubmitButton();
      this.updateSubtotal();
      this.updateDrawerOpenerProducts();

      products?.forEach((product) => {
        const removeButton = product.querySelector('.subscription-selection--product-remove');
        removeButton.addEventListener('click', this.onRemoveProduct.bind(this));

        const quantityInput = product.querySelector('[name="quantity"]');
        quantityInput.addEventListener('change', (e) => {
          const quantity = parseInt(e.target.value);
          product.dataset.quantity = quantity;
          this.toggleSubmitButton();
          this.updateSubtotal();
          this.updateDrawerOpenerProducts();
        });
      });
    }

    updateDrawerOpenerProducts() {
      const totalProducts = this.productsList.querySelectorAll('.subscription-selection--product');
      const drawerOpener = document.querySelector('.subscription-drawer-opener');
      if (!drawerOpener) return;
      const drawerProductsPlaceholders = Array.from(drawerOpener.querySelectorAll('.subscription-drawer-opener--products .subscription-drawer-opener--product'));

      let placeholderIndex = 0;

      totalProducts.forEach((product) => {
        if (!product) return;

        const productQuantity = parseInt(product.dataset.quantity) || 0;
        const productImage = product.querySelector('img')?.outerHTML || product.querySelector('.subscription-selection--product-image svg')?.outerHTML;
        for (let i = 0; i < productQuantity; i++) {
          if (placeholderIndex >= drawerProductsPlaceholders.length) break;

          const placeholder = drawerProductsPlaceholders[placeholderIndex];
          if (productImage) {
            placeholder.innerHTML = productImage;
          }

          placeholderIndex++;
        }
      });

      for (let i = placeholderIndex; i < drawerProductsPlaceholders.length; i++) {
        drawerProductsPlaceholders[i].innerHTML = totalProducts[i]?.querySelector('img')?.outerHTML || totalProducts[i]?.querySelector('.subscription-selection--product-image svg')?.outerHTML;
      }
    }

    updateSubtotal() {
      const products = this.productsList.querySelectorAll('.subscription-selection--product:not(.subscription-selection--product-skeleton)');

      let subtotal = Array.from(products).reduce(
        (acc, product) => {
          const quantityEl = product.querySelector('[name="quantity"]');
          const priceEl = product.querySelector('.subscription-selection--product-price');

          const price = parseFloat(priceEl?.dataset.price || 0);
          const quantity = parseInt(quantityEl?.value || 0);

          const totalPrice = acc.price + price * quantity;

          const compareAtPrice = parseFloat(priceEl?.dataset.compareAtPrice || 0);
          const totalCompareAtPrice = acc.compareAtPrice + compareAtPrice * quantity;

          if (compareAtPrice) {
            return { price: totalPrice, compareAtPrice: totalCompareAtPrice };
          } else {
            return { price: totalPrice, compareAtPrice: acc.compareAtPrice };
          }
        },
        { price: 0, compareAtPrice: 0 }
      );

      const price = Shopify.formatMoney(subtotal.price, window.theme.moneyFormat);

      if (subtotal.compareAtPrice) {
        const compareAtPrice = Shopify.formatMoney(subtotal.compareAtPrice, window.theme.moneyFormat);
        this.subtotal_placeholder.innerHTML = `<span class="subscription-selection--subtotal-price">${price}</span>
        <span class="subscription-selection--subtotal-compare-at-price">${compareAtPrice}</span>`;
      } else {
        this.subtotal_placeholder.innerHTML = price;
      }
    }

    onRemoveProduct(e) {
      e.preventDefault();
      const product = e.target.closest('.subscription-selection--product');
      this.debouncedRemoveProduct(product);
    }

    removeProduct(product) {
      const totalProducts = this.productsList.querySelectorAll('.subscription-selection--product');
      product.remove();
      if (totalProducts.length <= 3) {
        this.addEmptyPlaceholder();
      }
      this.toggleSubmitButton();
      this.updateSubtotal();
      this.updateDrawerOpenerProducts();
    }

    toggleSubmitButton() {
      const productsCountELs = this.productsList.querySelectorAll('.subscription-selection--product:not(.subscription-selection--product-skeleton) input[name="quantity"]');

      const products = Array.from(productsCountELs).reduce((acc, el) => {
        const quantity = parseInt(el.value);
        return acc + quantity;
      }, 0);

      const addMoreLabel = this.submitButton.dataset.addMoreLabel;
      const addToCartLabel = this.submitButton.dataset.addToCartLabel;
      const continueLabel = this.submitButton.dataset.continueLabel;

      const buyButtontext = this.submitButton.querySelector('.buy-button-text');

      if (products >= 3) {
        this.submitButton.classList.remove('disabled');
        if (buyButtontext) buyButtontext.innerHTML = this.hasUpsellProducts && this.dataset.upsellOpen !== 'true' ? continueLabel : addToCartLabel;
      } else {
        this.submitButton.classList.add('disabled');
        if (buyButtontext) buyButtontext.innerHTML = addMoreLabel;
        const countText = buyButtontext.querySelector('span');
        if (countText) countText.textContent = 3 - products;
      }
    }

    async fetchSubscriptionItem(productEL, href = this.href, productHandle = this.productHandle, selectedVariant = this.selectedVariant, quantity = this.quantity) {
      const queryKey = `${selectedVariant}-${this.sellingPlan}`;
      if (this.cachedProducts[queryKey]) {
        if (productEL) {
          productEL.innerHTML = this.cachedProducts[queryKey];
          this.updateQuantity(productEL, quantity);
        } else {
          const activeProduct = this.productsList.querySelector(`.subscription-selection--product[data-variant="${selectedVariant}"]`);
          if (activeProduct) {
            const quantityInput = activeProduct.querySelector('[name="quantity"]');

            if (quantityInput && quantityInput.value) quantity = parseInt(quantityInput.value) + quantity;
            this.updateQuantity(activeProduct, quantity);
          } else {
            this.renderSubscriptionItem(this.cachedProducts[queryKey], productHandle, selectedVariant, quantity);
          }
        }
        this.spinner.classList.add('hidden');

        this.onProductsListUpdate();
        return;
      }

      try {
        const response = await fetch(href);
        this.spinner.classList.add('hidden');

        const text = await response.text();
        const sectionInnerHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('.section-subscription-drawer-item').outerHTML;

        if (productEL) {
          productEL.innerHTML = sectionInnerHTML;
          this.updateQuantity(productEL, quantity);
        } else {
          this.renderSubscriptionItem(sectionInnerHTML, productHandle, selectedVariant, quantity);
        }

        this.cachedProducts[queryKey] = sectionInnerHTML;
        this.onProductsListUpdate();
      } catch (error) {
        this.spinner.classList.add('hidden');
        console.error('Error:', error);
      }
    }

    renderSubscriptionItem(sectionInnerHTML, productHandle, selectedVariant, quantity) {
      if (!sectionInnerHTML) return;

      if (this.emptyPlaceholder) {
        this.emptyPlaceholder.innerHTML = sectionInnerHTML;
        this.emptyPlaceholder.dataset.handle = productHandle;
        this.emptyPlaceholder.dataset.variant = selectedVariant;

        this.emptyPlaceholder.dataset.quantity = quantity;

        const quantityInput = this.emptyPlaceholder.querySelector('[name="quantity"]');
        if (quantityInput) quantityInput.value = quantity;

        this.emptyPlaceholder.classList.remove('subscription-selection--product-skeleton');
      }
    }
  }

  customElements.define('subscription-drawer', SubscriptionDrawer);
}
