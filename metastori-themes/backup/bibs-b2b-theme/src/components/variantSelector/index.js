if (!customElements.get('variant-selector')) {
  class VariantSelector extends HTMLElement {
    constructor() {
      super();
      this.inputs = Array.from(this.querySelectorAll('input[type="radio"]'));
      this.inputs.forEach((input) => {
        input.addEventListener('click', this.onInputUncheck.bind(this));
      });
      this.addEventListener('change', this.onVariantChange);

      this.sectionId = this.dataset.section;
      this.datasetUrl = this.dataset.url;

      this.availablePartnerLocations = [];

      this.mediaGallery = document.querySelector('[data-media-gallery-id]');

      this.productForm = document.getElementById(`product-form-${this.sectionId}`);
      this.floatingProductForm = document.getElementById(`floating-product-form-${this.sectionId}`);
      this.productFormSection = document.getElementById(`shopify-section-${this.sectionId}`);

      if (this.productForm) this.isSubscription = this.productForm.classList.contains('subscription-product-form');

      this.init();
    }

    init() {
      this.getSelectedOptions();
      this.getSelectedVariant();
      this.updateVariantStatuses();
      this.currentVariantId = this.currentVariant?.id;
      this.updateURL();
      this.updateFormID();
      if (this.currentVariant) {
        this.getSectionContent();
        this.updateGalleryLabels();
      }
    }

    onInputUncheck(e) {
      const input = e.target;
      if (!input || input.type !== 'radio') return;
      // If already checked, toggle it off
      if (input.checked && input.dataset.wasChecked === 'true') {
        input.checked = false; // Uncheck the radio
        input.dataset.wasChecked = 'false'; // Update state
        this.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        // Otherwise, mark it as checked
        input.dataset.wasChecked = 'true';
        // update data-wasChecked for other inputs in the fieldset
        const fieldset = input.closest('fieldset');
        if (!fieldset) return;
        const inputs = fieldset.querySelectorAll('input[type="radio"]');
        // Reset the state of other inputs in the group
        inputs?.forEach((otherInput) => {
          if (otherInput !== input) {
            otherInput.dataset.wasChecked = 'false';
          }
        });
      }
    }

    onVariantChange() {
      this.getSelectedOptions();
      this.getSelectedVariant();
      this.updateQuantitySelector();
      this.removeErrorMessages();
      this.updateVariantStatuses();

      this.currentVariantId = this.currentVariant?.id;

      this.updateURL();
      this.updateFormID();

      if (!this.currentVariant) {
        this.updateAddToCartButton(this.productForm, true, '', true);
        if (this.isSubscription) this.updateAddToSubscriptionButton(this.productForm, true, '', true);
        if (this.floatingProductForm) this.updateAddToCartButton(this.floatingProductForm, true, '', true);
      } else {
        this.updateAddToCartButton(this.productForm, false, '', false);
        if (this.isSubscription) this.updateAddToSubscriptionButton(this.productForm, false, '', false);
        if (this.floatingProductForm) this.updateAddToCartButton(this.floatingProductForm, false, '', false);
        this.getSectionContent();
        this.updateGalleryLabels();
      }

      const event = new Event('variant-changed');
      this.dispatchEvent(event);
    }

    getSelectedOptions() {
      this.productFormSection.classList.add('section-loading');

      const fieldsets = Array.from(this.querySelectorAll('fieldset'));
      this.options = fieldsets.map((fieldset) => {
        const optionValueEl = fieldset.querySelector('[data-option-value]');
        const activeOptionValue = Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked)?.value;
        if (activeOptionValue) {
          optionValueEl.textContent = activeOptionValue;
          return activeOptionValue;
        } else {
          optionValueEl.textContent = '';
        }
      });
    }

    updateVariantStatuses() {
      const inputWrappers = [...this.querySelectorAll('fieldset')];

      const selectedValues = inputWrappers.map((fieldset, index) => ({
        index,
        value: fieldset.querySelector(':checked')?.value || null,
      }));

      inputWrappers.forEach((fieldset, currentIndex) => {
        const inputs = [...fieldset.querySelectorAll('input[type="radio"], option')];

        const existingOptions = this.variantData
          .filter((variant) => {
            // Check if the variant matches all selected values from other fieldsets
            return selectedValues.every(
              ({ index, value }) =>
                index === currentIndex || // Skip filtering for the current fieldset
                value === null || // Include all variants if no selection
                variant[`option${index + 1}`] === value // Match selected value
            );
          })
          .map((variant) => variant[`option${currentIndex + 1}`]);

        // Calculate available options for the current fieldset
        const availableOptions = this.variantData
          .filter((variant) => {
            // Check if the variant matches all selected values from other fieldsets
            return selectedValues.every(
              ({ index, value }) =>
                variant.available &&
                (index === currentIndex || // Skip filtering for the current fieldset
                  value === null || // Include all variants if no selection
                  variant[`option${index + 1}`] === value) // Match selected value
            );
          })
          .map((variant) => variant[`option${currentIndex + 1}`]);

        // Update input availability for the current fieldset
        this.setInputAvailability(inputs, existingOptions, availableOptions);
      });
    }

    setInputAvailability(listOfOptions, existingOptions, availableOptions) {
      listOfOptions.forEach((input) => {
        const existingOptionsIncludeValue = existingOptions.includes(input.value);
        input.classList.toggle('option-hidden', !existingOptionsIncludeValue);

        const availableOptionsIncludeValue = availableOptions.includes(input.value);
        input.classList.toggle('disabled', !availableOptionsIncludeValue);
      });
    }

    getVariantJSON() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData || [];
    }

    getSelectedVariant() {
      this.currentVariant = this.getVariantJSON().find((variant) => {
        const findings = !variant.options
          .map((option, index) => {
            return this.options[index] === option;
          })
          .includes(false);
        if (findings) return variant;
      });
      return this.currentVariant;
    }

    updateURL() {
      if (this.dataset?.updateUrl != 'true') return;
      const params = new URLSearchParams(window.location.search);

      this.currentVariantId ? params.set('variant', this.currentVariantId) : params.delete('variant');

      const newURL = `${window.location.pathname}${params.size > 0 ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newURL);
    }

    updateFormID() {
      if (!this.productForm) return;

      const form_input = this.productForm.querySelector('input[name^="id"]');

      form_input.value = this.currentVariantId;

      if (this.floatingProductForm) {
        const floatingForm_input = this.floatingProductForm.querySelector('input[name^="id"]');
        if (floatingForm_input) floatingForm_input.value = this.currentVariantId;
      }
    }

    getSectionContent() {
      const requestedVariantId = this.currentVariant.id;
      fetch(`${this.datasetUrl}?variant=${requestedVariantId}&section_id=${this.sectionId}`)
        .then((response) => response.text())
        .then((responseText) => {
          if (this.currentVariant?.id !== requestedVariantId) return;

          const html = new DOMParser().parseFromString(responseText, 'text/html');

          if (this.currentVariant) this.updateSku(this.currentVariant.sku);
          this.updatePrice(html);
          const addButtonUpdated = html.getElementById(`Add-to-cart-${this.sectionId}`);
          const disable = addButtonUpdated ? addButtonUpdated.classList.contains('disabled') : true;
          this.updateAddToCartButton(this.productForm, disable, window.variantStrings.soldOut, true);
          if (this.floatingProductForm) this.updateAddToCartButton(this.floatingProductForm, disable, window.variantStrings.soldOut, true);
          if (this.isSubscription) this.updateAddToSubscriptionButton(this.productForm, disable, window.variantStrings.subscription.soldOut, true);
          this.updateInventoryStatus(html);
          this.updateSimilarProducts(html);
        });
    }

    updatePrice(html) {
      this.productFormSection;
      const classSelector = 'product-title-block--price-wrapper';
      const oldPrices = document.querySelectorAll(classSelector);
      const newPrices = html.querySelectorAll(classSelector);

      oldPrices.forEach((oldPrice, index) => {
        const newPrice = newPrices[index];
        if (newPrice) {
          if (oldPrice.id === newPrice.id) {
            oldPrice.innerHTML = newPrice.innerHTML;
          }
        }
      });
    }

    updateSimilarProducts(html) {
      const btnSelector = '.button-similar-products';
      const drawerSelector = '.similar-products-drawer-content';

      const similarProductsButtonDestination = document.querySelector(btnSelector);
      const similarProductsDrawerDestination = document.querySelector(drawerSelector);

      const similarProductsButtonSource = html.querySelector(btnSelector);
      const similarProductsDrawerSource = html.querySelector(drawerSelector);

      if (similarProductsButtonDestination && similarProductsButtonSource) {
        similarProductsButtonDestination.classList = similarProductsButtonSource.classList;
        similarProductsButtonDestination.dataset.openDrawer = similarProductsButtonSource.dataset.openDrawer;
      }
      if (similarProductsDrawerDestination && similarProductsDrawerSource) similarProductsDrawerDestination.outerHTML = similarProductsDrawerSource.outerHTML;
    }

    async updateAddToCartButton(productForm, disable = true, text, modifyClass = true) {
      if (!productForm) return;
      const addButtonWrap = productForm.querySelector('.add-to-cart-button-wrap');
      if (!addButtonWrap) return;
      const addButton = productForm.querySelector('.add-to-cart-button');
      const notifyButton = productForm.querySelector('.notify-button-wrap');
      const qtyWrap = productForm.querySelector('quantity-input');
      if (!addButton) return;
      const addButtonText = addButton.querySelector('.buy-button-text');
      if (!addButtonText) return;
      if (this.options.includes(undefined)) {
        this.setButtonToSelectOptions(addButton, addButtonText, notifyButton, addButtonWrap, qtyWrap);
      } else if (!this.currentVariant) {
        this.setButtonToSoldOut(addButton, addButtonText, notifyButton, addButtonWrap, qtyWrap);
      } else {
        if (disable) {
          this.setButtonToSoldOut(addButton, addButtonText, notifyButton, addButtonWrap, qtyWrap);
        } else {
          this.setButtonToAddToCart(productForm, addButton, addButtonText, notifyButton, addButtonWrap, qtyWrap);
        }
        if (!modifyClass) return;
      }
    }

    async updateAddToSubscriptionButton(productForm, disable = true, text, modifyClass = true) {
      if (!productForm) return;
      const addButtonWrap = productForm.querySelector('.add-to-subscription-button-wrap');
      if (!addButtonWrap) return;
      const addButton = productForm.querySelector('.add-to-subscription-button');
      if (!addButton) return;
      const addButtonText = addButton.querySelector('.buy-button-text');
      if (!addButtonText) return;

      if (this.options.includes(undefined)) {
        addButton.setAttribute('disabled', 'disabled');
        if (addButtonWrap.dataset.allVariantsSoldOut) {
          addButtonText.textContent = window.variantStrings.subscription.soldOut;
        } else {
          addButtonText.textContent = window.variantStrings.subscription.selectOptions;
        }
      } else if (!this.currentVariant) {
        addButton.setAttribute('disabled', 'disabled');
        addButtonText.textContent = window.variantStrings.subscription.unavailable;
      } else {
        if (disable) {
          addButton.setAttribute('disabled', 'disabled');
          if (text) addButtonText.textContent = text;
        } else {
          addButton.removeAttribute('disabled');
          addButtonText.textContent = window.variantStrings.subscription.addToSubscription;
        }
        if (!modifyClass) return;
      }
    }

    setButtonToSoldOut(addButton, addButtonText, notifyButton, addButtonWrap, qtyWrap) {
      addButton.classList.add('disabled');
      addButtonText.textContent = window.variantStrings.soldOut;
      notifyButton.classList.remove('hidden');
      addButtonWrap.classList.add('hidden');
      qtyWrap.classList.add('hidden');
      this.refreshNotifyDrawer();
    }

    setButtonToSelectOptions(addButton, addButtonText, notifyButton, addButtonWrap, qtyWrap) {
      addButton.classList.add('disabled');
      addButtonText.textContent = window.variantStrings.selectOptions;
      notifyButton.classList.add('hidden');
      addButtonWrap.classList.remove('hidden');
      qtyWrap.classList.remove('hidden');
    }

    setButtonToAddToCart(productForm, addButton, addButtonText, notifyButton, addButtonWrap, qtyWrap) {
      addButton.classList.remove('disabled');
      notifyButton.classList.add('hidden');
      addButtonWrap.classList.remove('hidden');
      qtyWrap.classList.remove('hidden');

      let buttoncontent;
      if (productForm == this.floatingProductForm) {
        const priceText = document.querySelector('.section-product-form .price-item').innerText;
        buttoncontent = window.variantStrings.addToCart + ' - ' + priceText;
      } else {
        buttoncontent = window.variantStrings.addToCart;
      }
      addButtonText.textContent = buttoncontent;
    }

    async refreshNotifyDrawer() {
      const page = await fetch(window.location.href);
      const pageHtml = page.text();
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(pageHtml, 'text/html');
      const optionChoices = document.querySelector('.option-choices');
      const updatedOptionChoices = htmlDoc.querySelector('.option-choices');
      if (optionChoices && updatedOptionChoices) optionChoices.innerHTML = updatedOptionChoices.innerHTML;
    }

    updateQuantitySelector() {
      const quantitySelector = this.productForm.querySelector('[name="quantity"]');
      if (!quantitySelector) return;

      if (quantitySelector.value) {
        const inputValue = parseInt(quantitySelector.value);

        if (inputValue > 1) quantitySelector.value = 1;
      }
    }

    removeErrorMessages() {
      const errorMessages = this.productForm.querySelector('[data-product-form-error-message]');
      errorMessages.textContent = '';
      errorMessages.classList.add('hidden');
    }

    updateSku(newSku) {
      const id = 'Sku-placeholder';
      const oldSku = document.getElementById(id);
      if (!oldSku || !newSku) return;

      const skuValueEl = oldSku.querySelector('[data-value]');

      if (skuValueEl) skuValueEl.textContent = newSku;
    }

    updateInventoryStatus(html) {
      const id = `Inventory-status-${this.sectionId}`;
      const oldInventory = document.getElementById(id);
      const newInventory = html.getElementById(id);
      if (oldInventory && newInventory) oldInventory.innerHTML = newInventory.innerHTML;
    }

    updateGalleryLabels() {
      if (!this.mediaGallery) return;

      this.soldOutLabels = this.mediaGallery.querySelectorAll('[data-sold-out-label]');
      this.salesOfferLabels = this.mediaGallery.querySelectorAll('[data-sales-offer-label]');

      if (this.currentVariant && this.currentVariant.available) {
        this.soldOutLabels.forEach((label) => {
          label.classList.add('!hidden');
        });
      } else {
        this.soldOutLabels.forEach((label) => {
          label.classList.remove('!hidden');
        });
      }

      if (this.currentVariant && this.currentVariant.compare_at_price) {
        this.salesOfferLabels.forEach((label) => {
          label.classList.remove('!hidden');
        });
      } else {
        this.salesOfferLabels.forEach((label) => {
          label.classList.add('!hidden');
        });
      }
    }
  }
  customElements.define('variant-selector', VariantSelector);
}
