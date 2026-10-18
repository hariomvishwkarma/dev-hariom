import { debounce } from '../../scripts/utils/debounce';
import replaceCartContent from '../cart/replaceCartContent';

if (!customElements.get('quantity-input')) {
  class QuantityInput extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('input');
      this.buttons = this.querySelectorAll('button');
      this.cartDrawer = document.getElementById('cart-drawer');

      this.changeEvent = new Event('change', { bubbles: true });

      this.debouncedOnUpdateQuantity = debounce(() => {
        this.updateQuantity();
      }, 300);

      this.preventChangeEvent = false;

      this.input.addEventListener('change', (event) => {
        if (this.preventChangeEvent) {
          // Skip the change event if the flag is set
          this.preventChangeEvent = false;
          return;
        }

        this.onInputChange(event);
      });

      if (this.input) {
        this.input.removeEventListener('keyup', this.handleKeyUp.bind(this)); // Remove the old listener
        this.input.addEventListener('keyup', this.handleKeyUp.bind(this)); // Add the new listener
      }

      this.buttons.forEach((button) => button.addEventListener('click', this.onButtonClick.bind(this)));

      this.isCartInput = this.classList.contains('cart_quantity_input');
    }

    handleKeyUp(event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'Enter') {
        this.preventChangeEvent = true; // Set the flag to prevent the change event
        this.debouncedOnUpdateQuantity();
        return false;
      }
    }

    connectedCallback() {
      this.validateQtyRules();
    }

    onInputChange() {
      this.debouncedOnUpdateQuantity();
    }

    async onButtonClick(event) {
      event.preventDefault();
      const previousValue = this.input.value;

      event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();

      if (this.input.min) {
        const value = parseInt(this.input.value);
        const buttonMinus = this.querySelector("button[name='minus']");
        const min = parseInt(this.input.min);
        buttonMinus.classList.toggle('disabled', value <= min);
      }

      if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);

      if (this.isCartInput) this.debouncedOnUpdateQuantity();
    }

    async updateQuantity() {
      if (this.isCartInput) {
        const lineItemId = this.input.dataset.id;
        const quantity = this.input.value;
        if (lineItemId && quantity) {
          await Shopify.functions.updateCart(lineItemId, quantity);
          await replaceCartContent();
        }
      }
    }

    validateQtyRules() {
      const value = parseInt(this.input.value);
      if (this.input.min) {
        const min = parseInt(this.input.min);
        const buttonMinus = this.querySelector("button[name='minus']");
        buttonMinus.classList.toggle('disabled', value <= min);
      }
      if (this.input.max) {
        const max = parseInt(this.input.max);
        const buttonPlus = this.querySelector("button[name='plus']");
        buttonPlus.classList.toggle('disabled', value >= max);
      }
    }
  }

  customElements.define('quantity-input', QuantityInput);
}
