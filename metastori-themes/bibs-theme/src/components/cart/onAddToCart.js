import fetchConfig from '../../scripts/utils/fetchConfig';
import replaceCartContent from '../cart/replaceCartContent';

if (!customElements.get('product-form')) {
  class ProductForm extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      if (!this.form) return;
      this.form.noValidate = true;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    }

    get form() {
      return this.querySelector('.product-form');
    }

    get submitButton() {
      return this.form.querySelector('.add-to-cart-button');
    }

    get sectionProductForm() {
      return this.closest('.section-product-form') || this.closest('.section-main-product-quick-view');
    }

    get variantSelector() {
      if (this.sectionProductForm) return this.sectionProductForm.querySelector('variant-selector');
    }

    get errorMessageElement() {
      return this.form.querySelector('[data-product-form-error-message]');
    }

    get cartElement() {
      return document.querySelector('[data-component-id="cart-drawer"]');
    }

    get spinner() {
      if (this.submitButton) return this.submitButton.querySelector('.add-to-cart-button-spinner');
    }

    get mainIcon() {
      if (this.submitButton) return this.submitButton.querySelector('.main_icon');
    }

    get openedProductDrawers() {
      return document.querySelectorAll('[data-component-id="Product-drawer"][data-drawer-open="true"]');
    }
    async addVariantToCart(config) {
      try {
        const sellingPlanId = config.body.get('selling_plan');
        if (sellingPlanId) {
          const products = config.body.getAll('id[]');
          if (products.length < 3) {
            this.onErrorMsg(window.variantStrings.atleastthreeProducts, this.form);
            return false;
          }
        }

        const response = await fetch(`${window.routes.root_url}cart/add.js`, config);
        const data = await response.json();

        if (!response.ok || data.status) {
          let quantity = data.description?.match(/\d+/)?.[0] || "1";
          let errorMessage = window.cartStrings?.limited_quantity?.replace("[quantity]", quantity) || `Only ${quantity} items were added to your cart due to availability.`;

          this.onErrorMsg(errorMessage, this.form);
          return;
        }

        if (!this.cartElement) {
          window.location = window.routes.cart_url;
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error adding variant to cart:', error);
        return false;
      }
    }

    async onSubmitHandler(event) {
      //check if the submit button is clicked from the floating bar
      const isFloatingForm = this.form.classList.contains('floating-product-form');
      const isValidated = await this.customValidation(event);

      if (isFloatingForm && !isValidated) {
        const productFormSection = document.querySelector('.section-product-form');
        productFormSection.scrollIntoView({ behavior: 'smooth' });
      }

      if (isValidated) return;

      event.preventDefault();

      if (this.spinner) this.spinner.classList.remove('invisible');
      if (this.mainIcon) this.mainIcon.classList.add('invisible');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];
      const formData = new FormData(this.form);
      config.body = formData;

      if (this.errorMessageElement) {
        this.errorMessageElement.textContent = '';
        this.errorMessageElement.classList.add('hidden');
      }

      const variantAdded = await this.addVariantToCart(config);
      if (variantAdded) {
        await replaceCartContent();
        if (this.variantSelector) {
          this.variantSelector.updateQuantitySelector();
        }
        if (this.openedProductDrawers.length > 0) {
          this.openedProductDrawers.forEach((drawer) => {
            drawer.close();
          });
        }
        this.cartElement.open();
      }
      if (this.spinner) this.spinner.classList.add('invisible');
      if (this.mainIcon) this.mainIcon.classList.remove('invisible');
    }

    async customValidation(event) {
      const radioGroups = {};
      const radios = this.variantSelector?.querySelectorAll('input[type="radio"][required]');

      radios?.forEach((radio) => {
        radioGroups[radio.name] = radioGroups[radio.name] || [];
        radioGroups[radio.name].push(radio);
      });

      let invalidFields = [];
      Object.keys(radioGroups).forEach((groupName) => {
        const group = radioGroups[groupName];
        if (group.length > 0) {
          const isSelected = group.some((radio) => radio.checked);
          const firstRadio = group[0];
          if (firstRadio) {
            const fieldset = firstRadio.closest('fieldset');
            if (!isSelected) {
              firstRadio.setCustomValidity('');
              if (fieldset) fieldset.classList.add('invalid');
              invalidFields.push(firstRadio);
            } else {
              if (fieldset) fieldset.classList.remove('invalid');
            }
          }
        }
      });

      if (!this.form.checkValidity()) {
        event.preventDefault();
        event.stopImmediatePropagation();

        invalidFields.forEach((i) => {
          if (!i.checkValidity()) {
            i.closest('fieldset')?.classList.add('invalid');
          }
        });
        const tsChoose = window.variantStrings?.productForm?.choose;
        const tsAnd = window.variantStrings?.productForm?.and;
        const variantSelectorTS = window.variantStrings?.variant_selector

        if (this.errorMessageElement && tsChoose) {
          let invalidFieldsNames = invalidFields.map((i) => {
            if (i.name) {
              const nameLowerCase = this.camelize(i.name);
              return variantSelectorTS[nameLowerCase] || i.name;
            }
          });
          invalidFieldsNames = invalidFieldsNames.join(', ');
          if (tsAnd) {
            invalidFieldsNames = invalidFieldsNames.replace(/,([^,]*)$/, ` ${tsAnd}$1`);
            if (invalidFieldsNames) this.errorMessageElement.textContent = `${tsChoose} ${invalidFieldsNames}`;
            this.errorMessageElement.classList.remove('hidden');
          }
        }
        return true;
      }
      return false;
    }

    camelize(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    }

    onErrorMsg(errorMessage = false) {
      if (!this.errorMessageElement) return;
      this.errorMessage = errorMessage || this.errorMessageElement.querySelector('.product-form__error-message');
      this.errorMessageElement.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessageElement.textContent = errorMessage;
        this.errorMessageElement.classList.remove('hidden');
      }
    }
  }
  customElements.define('product-form', ProductForm);
}
