import { Component } from '@theme/component';
import { fetchConfig, onAnimationEnd, preloadImage } from '@theme/utilities';
import { ThemeEvents, CartAddEvent, CartErrorEvent, CartUpdateEvent, VariantUpdateEvent } from '@theme/events';
import { cartPerformance } from '@theme/performance';
import { morph } from '@theme/morph';

export const ADD_TO_CART_TEXT_ANIMATION_DURATION = 2000;

// Error message display duration - gives users time to read the message
const ERROR_MESSAGE_DISPLAY_DURATION = 10000;

// Button re-enable delay after error - prevents rapid repeat attempts
const ERROR_BUTTON_REENABLE_DELAY = 1000;

// Success message display duration for screen readers
const SUCCESS_MESSAGE_DISPLAY_DURATION = 5000;

/**
 * A custom element that manages an add to cart button.
 *
 * @typedef {object} AddToCartRefs
 * @property {HTMLButtonElement} addToCartButton - The add to cart button.
 * @extends Component<AddToCartRefs>
 */
export class AddToCartComponent extends Component {
  requiredRefs = ['addToCartButton'];

  /** @type {number | undefined} */
  #animationTimeout;

  /** @type {number | undefined} */
  #cleanupTimeout;

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('pointerenter', this.#preloadImage);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.#animationTimeout) clearTimeout(this.#animationTimeout);
    if (this.#cleanupTimeout) clearTimeout(this.#cleanupTimeout);
    this.removeEventListener('pointerenter', this.#preloadImage);
  }

  /**
   * Disables the add to cart button.
   */
  disable() {
    this.refs.addToCartButton.disabled = true;
  }

  /**
   * Enables the add to cart button.
   */
  enable() {
    this.refs.addToCartButton.disabled = false;
  }

  /**
   * Handles the click event for the add to cart button.
   * @param {MouseEvent & {target: HTMLElement}} event - The click event.
   */
  handleClick(event) {
    const form = this.closest('form');
    if (!form?.checkValidity()) return;

    // Check if adding would exceed max before animating
    const quantitySelector = /** @type {any} */ (form.querySelector('quantity-selector-component'));
    if (quantitySelector?.canAddToCart) {
      const validation = quantitySelector.canAddToCart();
      if (!validation.canAdd) {
        return;
      }
    }

    this.animateAddToCart();

    const animationEnabled = this.dataset.addToCartAnimation === 'true';

    if (animationEnabled && !event.target.closest('.quick-add-modal')) {
      this.#animateFlyToCart();
    }
  }

  #preloadImage = () => {
    const image = this.dataset.productVariantMedia;

    if (!image) return;

    preloadImage(image);
  };

  /**
   * Animates the fly to cart animation.
   */
  #animateFlyToCart() {
    const { addToCartButton } = this.refs;
    const cartIcon = document.querySelector('.header-actions__cart-icon');

    const image = this.dataset.productVariantMedia;

    if (!cartIcon || !addToCartButton || !image) return;

    const flyToCartElement = /** @type {FlyToCart} */ (document.createElement('fly-to-cart'));

    flyToCartElement.style.setProperty('background-image', `url(${image})`);
    flyToCartElement.source = addToCartButton;
    flyToCartElement.destination = cartIcon;

    document.body.appendChild(flyToCartElement);
  }

  /**
   * Animates the add to cart button.
   */
  animateAddToCart() {
    const { addToCartButton } = this.refs;

    if (this.#animationTimeout) clearTimeout(this.#animationTimeout);
    if (this.#cleanupTimeout) clearTimeout(this.#cleanupTimeout);

    if (!addToCartButton.classList.contains('atc-added')) {
      addToCartButton.classList.add('atc-added');
    }

    this.#animationTimeout = setTimeout(() => {
      this.#cleanupTimeout = setTimeout(() => {
        this.refs.addToCartButton.classList.remove('atc-added');
      }, 10);
    }, ADD_TO_CART_TEXT_ANIMATION_DURATION);
  }
}

if (!customElements.get('add-to-cart-component')) {
  customElements.define('add-to-cart-component', AddToCartComponent);
}

/**
 * A custom element that manages a product form.
 *
 * @typedef {object} ProductFormRefs
 * @property {HTMLInputElement} variantId - The form input for submitting the variant ID.
 * @property {AddToCartComponent | undefined} addToCartButtonContainer - The add to cart button container element.
 * @property {HTMLElement | undefined} addToCartTextError - The add to cart text error.
 * @property {HTMLElement | undefined} acceleratedCheckoutButtonContainer - The accelerated checkout button container element.
 * @property {HTMLElement} liveRegion - The live region.
 * @property {HTMLElement | undefined} quantityLabelCartCount - The quantity label cart count element.
 * @property {HTMLElement | undefined} quantityRules - The quantity rules element.
 * @property {HTMLElement | undefined} productFormButtons - The product form buttons container.
 *
 * @extends Component<ProductFormRefs>
 */
class ProductFormComponent extends Component {
  requiredRefs = ['variantId', 'liveRegion'];
  #abortController = new AbortController();

  /** @type {number | undefined} */
  #timeout;

  /** @type {AbortController | null} */
  #quantityWatchAbort = null;

  connectedCallback() {
    super.connectedCallback();

    const { signal } = this.#abortController;
    const target = this.closest('.shopify-section, dialog, product-card');
    target?.addEventListener(ThemeEvents.variantUpdate, this.#onVariantUpdate, { signal });
    target?.addEventListener(ThemeEvents.variantSelected, this.#onVariantSelected, { signal });

    // Listen for cart updates to sync data-cart-quantity
    document.addEventListener(ThemeEvents.cartUpdate, this.#onCartUpdate, { signal });

    // On page load: only init toggle mode if opt-in class is present
    if (this.#isToggleMode()) {
      this.#initModeFromCart();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#abortController.abort();
    if (this.#quantityWatchAbort) this.#quantityWatchAbort.abort();
  }

  // ─── Mode toggle helpers ─────────────────────────────────────────────────────

  /**
   * Returns the quantity-selector-component inside this form.
   * @returns {HTMLElement | null}
   */
  #getQuantitySelector() {
    return this.querySelector('quantity-selector-component');
  }

  /**
   * Returns true only if the product-form-buttons container has the
   * opt-in class "atc-toggle-mode". Without this class the component
   * behaves exactly like the original — no show/hide toggling.
   * @returns {boolean}
   */
  #isToggleMode() {
    return !!this.refs.productFormButtons?.classList.contains('atc-toggle-mode');
  }

  /**
   * Show ATC button + accelerated checkout, hide quantity selector.
   * Resets quantity input back to min (usually 1).
   */
  #showATC() {
    const { addToCartButtonContainer, acceleratedCheckoutButtonContainer } = this.refs;
    const quantitySelector = this.#getQuantitySelector();

    if (addToCartButtonContainer) {
      addToCartButtonContainer.removeAttribute('hidden');
    }

    if (acceleratedCheckoutButtonContainer) {
      acceleratedCheckoutButtonContainer.removeAttribute('hidden');
    }

    if (quantitySelector) {
      quantitySelector.setAttribute('hidden', '');
    }

    // Reset quantity input to min so it's ready for next ATC
    const quantityInput = /** @type {HTMLInputElement | null} */ (
      this.querySelector('input[ref="quantityInput"]')
    );
    if (quantityInput) {
      const min = parseInt(quantityInput.min || '1', 10);
      quantityInput.value = String(min);
      quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /**
   * Hide ATC button + accelerated checkout, show quantity selector.
   * Optionally sets the quantity input to a specific value.
   * @param {number} [quantity]
   */
  #showQuantitySelector(quantity) {
    const { addToCartButtonContainer, acceleratedCheckoutButtonContainer } = this.refs;
    const quantitySelector = this.#getQuantitySelector();

    if (addToCartButtonContainer) {
      addToCartButtonContainer.setAttribute('hidden', '');
    }

    if (acceleratedCheckoutButtonContainer) {
      acceleratedCheckoutButtonContainer.setAttribute('hidden', 'true');
    }

    if (quantitySelector) {
      quantitySelector.removeAttribute('hidden');
    }

    if (quantity !== undefined) {
      const quantityInput = /** @type {HTMLInputElement | null} */ (
        this.querySelector('input[ref="quantityInput"]')
      );
      if (quantityInput) {
        quantityInput.value = String(quantity);
        quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  /**
   * On page load: hide quantity selector by default, then fetch cart.
   * If this variant is already in cart → show quantity selector.
   * Otherwise → show ATC (default).
   */
  async #initModeFromCart() {
    // Immediately hide quantity selector (prevents flash)
    const quantitySelector = this.#getQuantitySelector();
    if (quantitySelector) {
      quantitySelector.setAttribute('hidden', '');
    }

    const variantIdInput = /** @type {HTMLInputElement | null} */ (this.querySelector('input[name="id"]'));
    if (!variantIdInput?.value) return;

    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();

      const cartItem = cart.items.find(
        /** @param {any} item */
        (item) => item.variant_id.toString() === variantIdInput.value.toString()
      );

      if (cartItem && cartItem.quantity > 0) {
        this.#showQuantitySelector(cartItem.quantity);
        this.#updateQuantityLabel(cartItem.quantity);
        this.#watchQuantityButtons();
      }
    } catch {
      // Silently fail — default ATC mode is fine
    }
  }

  // ─── Quantity button watcher ─────────────────────────────────────────────────

  /**
   * Attaches listeners to the existing quantity selector's minus/plus buttons.
   * - Plus: updates cart line to new quantity
   * - Minus at min (1): removes from cart and switches back to ATC mode
   */
  #watchQuantityButtons() {
    if (this.#quantityWatchAbort) this.#quantityWatchAbort.abort();
    this.#quantityWatchAbort = new AbortController();
    const { signal } = this.#quantityWatchAbort;

    const quantitySelector = this.#getQuantitySelector();
    if (!quantitySelector) return;

    const minusButton = quantitySelector.querySelector('[name="minus"]');
    const plusButton = quantitySelector.querySelector('[name="plus"]');
    const quantityInput = /** @type {HTMLInputElement | null} */ (
      quantitySelector.querySelector('input[ref="quantityInput"]')
    );

    if (!quantityInput) return;

    if (minusButton) {
      minusButton.addEventListener('click', () => {
        // Read value after quantity-selector-component has processed the click
        setTimeout(() => {
          const currentValue = parseInt(quantityInput.value, 10);
          const min = parseInt(quantityInput.min || '1', 10);

          if (currentValue < min) {
            // Below min means user wants to remove — reset to min visually then remove
            quantityInput.value = String(min);
            this.#removeFromCartAndShowATC();
          } else {
            this.#updateCartLine(currentValue);
          }
        }, 50);
      }, { signal });
    }

    if (plusButton) {
      plusButton.addEventListener('click', () => {
        setTimeout(() => {
          const currentValue = parseInt(quantityInput.value, 10);
          this.#updateCartLine(currentValue);
        }, 50);
      }, { signal });
    }
  }

  /**
   * Removes the current variant from cart and switches to ATC mode.
   */
  async #removeFromCartAndShowATC() {
    await this.#updateCartLine(0);
    this.#showATC();
    this.#updateQuantityLabel(0);
    this.#setLiveRegionText(Theme.translations?.removed || 'Item removed from cart');
    setTimeout(() => this.#clearLiveRegionText(), SUCCESS_MESSAGE_DISPLAY_DURATION);
  }

  /**
   * Updates the cart line for the current variant via /cart/change.js.
   * @param {number} quantity - New quantity (0 = remove)
   */
  async #updateCartLine(quantity) {
    const variantIdInput = /** @type {HTMLInputElement | null} */ (this.querySelector('input[name="id"]'));
    if (!variantIdInput?.value) return;

    try {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantIdInput.value, quantity }),
      });

      this.#updateQuantityLabel(quantity);

      // Suppress cart drawer on plus/minus updates (toggle mode)
      const cartDrawer = /** @type {HTMLElement | null} */ (
        document.querySelector('cart-drawer-component')
      );
      if (cartDrawer) {
        cartDrawer.setAttribute('suppress-open', '');
        setTimeout(() => cartDrawer.removeAttribute('suppress-open'), 100);
      }

      // Dispatch so header cart count refreshes
      document.dispatchEvent(
        new CartAddEvent({}, variantIdInput.value, {
          source: 'product-form-component',
          itemCount: quantity,
          productId: this.dataset.productId,
          sections: {},
        })
      );
    } catch (error) {
      console.error('Failed to update cart line:', error);
    }
  }

  /**
   * Fetches cart and updates quantity selector for current variant
   * @returns {Promise<number>} The cart quantity for the current variant
   */
  async #fetchAndUpdateCartQuantity() {
    const variantIdInput = /** @type {HTMLInputElement | null} */ (this.querySelector('input[name="id"]'));
    if (!variantIdInput?.value) return 0;

    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();

      const cartItem = cart.items.find(
        /** @param {any} item */
        (item) => item.variant_id.toString() === variantIdInput.value.toString()
      );
      const cartQty = cartItem ? cartItem.quantity : 0;

      const quantitySelector = /** @type {any} */ (this.querySelector('quantity-selector-component'));
      if (quantitySelector?.setCartQuantity) {
        quantitySelector.setCartQuantity(cartQty);
      }

      this.#updateQuantityLabel(cartQty);

      return cartQty;
    } catch (error) {
      console.error('Failed to fetch cart quantity:', error);
      return 0;
    }
  }

  /**
   * @param {CartUpdateEvent|CartAddEvent} event
   */
  #onCartUpdate = async (event) => {
    if (event.detail?.sourceId === this.id || event.detail?.data?.source === 'product-form-component') return;

    await this.#fetchAndUpdateCartQuantity();
  };

  // ─── Form submit (ATC click) ─────────────────────────────────────────────────

  /**
   * Handles the submit event for the product form.
   * @param {Event} event - The submit event.
   */
  handleSubmit(event) {
    const { addToCartTextError, addToCartButtonContainer } = this.refs;
    event.preventDefault();

    if (this.#timeout) clearTimeout(this.#timeout);

    if (addToCartButtonContainer?.refs.addToCartButton?.disabled) return;

    const form = this.querySelector('form');
    if (!form) throw new Error('Product form element missing');

    const formData = new FormData(form);
    // In toggle mode: always add 1 (quantity selector is hidden, user hasn't picked qty)
    // In normal mode: use whatever quantity the user selected in the quantity selector
    if (this.#isToggleMode()) {
      formData.set('quantity', '1');
    }

    const cartItemsComponents = document.querySelectorAll('cart-items-component');
    let cartItemComponentsSectionIds = [];
    cartItemsComponents.forEach((item) => {
      if (item instanceof HTMLElement && item.dataset.sectionId) {
        cartItemComponentsSectionIds.push(item.dataset.sectionId);
      }
      formData.append('sections', cartItemComponentsSectionIds.join(','));
    });

    const fetchCfg = fetchConfig('javascript', { body: formData });

    fetch(Theme.routes.cart_add_url, {
      ...fetchCfg,
      headers: {
        ...fetchCfg.headers,
        Accept: 'text/html',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.dispatchEvent(
            new CartErrorEvent(form.getAttribute('id') || '', response.message, response.description, response.errors)
          );

          if (!addToCartTextError) return;
          addToCartTextError.classList.remove('hidden');

          const textNode = addToCartTextError.childNodes[2];
          if (textNode) {
            textNode.textContent = response.message;
          } else {
            addToCartTextError.appendChild(document.createTextNode(response.message));
          }

          this.#setLiveRegionText(response.message);

          this.#timeout = setTimeout(() => {
            if (!addToCartTextError) return;
            addToCartTextError.classList.add('hidden');
            this.#clearLiveRegionText();
          }, ERROR_MESSAGE_DISPLAY_DURATION);

          this.dispatchEvent(
            new CartAddEvent({}, this.id, {
              didError: true,
              source: 'product-form-component',
              itemCount: 1,
              productId: this.dataset.productId,
            })
          );

          return;
        }

        const id = formData.get('id');

        if (addToCartTextError) {
          addToCartTextError.classList.add('hidden');
          addToCartTextError.removeAttribute('aria-live');
        }

        if (!id) throw new Error('Form ID is required');

        // Screen reader announcement
        if (this.refs.addToCartButtonContainer?.refs.addToCartButton) {
          const btn = this.refs.addToCartButtonContainer.refs.addToCartButton;
          const addedText = btn.querySelector('.add-to-cart-text--added')?.textContent?.trim()
            || Theme.translations.added;
          this.#setLiveRegionText(addedText);
          setTimeout(() => this.#clearLiveRegionText(), SUCCESS_MESSAGE_DISPLAY_DURATION);
        }

        // ── Switch to quantity selector showing "1" (only in toggle mode) ──
        if (this.#isToggleMode()) {
          this.#showQuantitySelector(1);
          this.#updateQuantityLabel(1);
          this.#watchQuantityButtons();

          // Set suppress-open on cart drawer BEFORE dispatching CartAddEvent
          // so #handleCartAdd sees it and skips showDialog()
          const cartDrawer = /** @type {HTMLElement | null} */ (
            document.querySelector('cart-drawer-component')
          );
          if (cartDrawer) {
            cartDrawer.setAttribute('suppress-open', '');
            setTimeout(() => cartDrawer.removeAttribute('suppress-open'), 100);
          }
        }

        this.dispatchEvent(
          new CartAddEvent({}, id.toString(), {
            source: 'product-form-component',
            itemCount: 1,
            productId: this.dataset.productId,
            sections: response.sections,
          })
        );
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        cartPerformance.measureFromEvent('add:user-action', event);
      });
  }

  // ─── Quantity label ──────────────────────────────────────────────────────────

  /**
   * @param {number} cartQty
   */
  #updateQuantityLabel(cartQty) {
    const quantityLabel = this.refs.quantityLabelCartCount;
    if (quantityLabel) {
      const inCartText = quantityLabel.textContent?.match(/\((\d+)\s+(.+)\)/);
      if (inCartText && inCartText[2]) {
        quantityLabel.textContent = `(${cartQty} ${inCartText[2]})`;
      }
      quantityLabel.classList.toggle('hidden', cartQty === 0);
    }
  }

  // ─── Live region ─────────────────────────────────────────────────────────────

  /** @param {string} text */
  #setLiveRegionText(text) {
    this.refs.liveRegion.textContent = text;
  }

  #clearLiveRegionText() {
    this.refs.liveRegion.textContent = '';
  }

  // ─── Morph helper ────────────────────────────────────────────────────────────

  /**
   * @param {Element | null | undefined} currentElement
   * @param {Element | null | undefined} newElement
   * @param {Element | null} [insertReferenceElement]
   */
  #morphOrUpdateElement(currentElement, newElement, insertReferenceElement = null) {
    if (currentElement && newElement) {
      morph(currentElement, newElement);
    } else if (currentElement && !newElement) {
      currentElement.remove();
    } else if (!currentElement && newElement && insertReferenceElement) {
      insertReferenceElement.insertAdjacentElement('beforebegin', /** @type {Element} */ (newElement.cloneNode(true)));
    }
  }

  // ─── Variant update ──────────────────────────────────────────────────────────

  /**
   * @param {VariantUpdateEvent} event
   */
  #onVariantUpdate = async (event) => {
    if (event.detail.data.newProduct) {
      this.dataset.productId = event.detail.data.newProduct.id;
    } else if (event.detail.data.productId !== this.dataset.productId) {
      return;
    }

    const { variantId, addToCartButtonContainer } = this.refs;

    const currentAddToCartButton = addToCartButtonContainer?.refs.addToCartButton;
    const newAddToCartButton = event.detail.data.html.querySelector('[ref="addToCartButton"]');

    variantId.value = event.detail.resource?.id ?? '';

    if (!currentAddToCartButton && !this.refs.acceleratedCheckoutButtonContainer) return;

    if (currentAddToCartButton) {
      if (event.detail.resource == null || event.detail.resource.available == false) {
        addToCartButtonContainer.disable();
      } else {
        addToCartButtonContainer.enable();
      }

      if (newAddToCartButton) {
        morph(currentAddToCartButton, newAddToCartButton);
      }
    }

    if (this.refs.acceleratedCheckoutButtonContainer) {
      if (event.detail.resource == null || event.detail.resource.available == false) {
        this.refs.acceleratedCheckoutButtonContainer?.setAttribute('hidden', 'true');
      } else {
        this.refs.acceleratedCheckoutButtonContainer?.removeAttribute('hidden');
      }
    }

    if (event.detail.resource) {
      const productVariantMedia = event.detail.resource.featured_media?.preview_image?.src;
      productVariantMedia &&
        addToCartButtonContainer?.setAttribute('data-product-variant-media', productVariantMedia + '&width=100');
    }

    const quantitySelector = /** @type {any} */ (this.querySelector('quantity-selector-component'));
    const newQuantityInput = /** @type {HTMLInputElement | null} */ (
      event.detail.data.html.querySelector('quantity-selector-component input[ref="quantityInput"]')
    );

    if (quantitySelector?.updateConstraints && newQuantityInput) {
      quantitySelector.updateConstraints(
        newQuantityInput.min,
        newQuantityInput.max || null,
        newQuantityInput.step
      );
    }

    const quantityRules = this.refs.quantityRules;
    const newQuantityRules = event.detail.data.html.querySelector('.quantity-rules');
    const isQuantityRulesChanging = !!quantityRules !== !!newQuantityRules;

    if (isQuantityRulesChanging && quantitySelector) {
      const currentQuantityValue = quantitySelector.getValue?.();

      const currentProductFormButtons = this.refs.productFormButtons;
      const newProductFormButtons = event.detail.data.html.querySelector('.product-form-buttons');

      if (currentProductFormButtons && newProductFormButtons) {
        morph(currentProductFormButtons, newProductFormButtons);

        const newQuantitySelector = /** @type {any} */ (this.querySelector('quantity-selector-component'));
        const newQuantityInputElement = /** @type {HTMLInputElement | null} */ (
          event.detail.data.html.querySelector('quantity-selector-component input[ref="quantityInput"]')
        );

        if (newQuantitySelector?.updateConstraints && newQuantityInputElement && currentQuantityValue) {
          newQuantitySelector.setValue(currentQuantityValue);
          newQuantitySelector.updateConstraints(
            newQuantityInputElement.min,
            newQuantityInputElement.max || null,
            newQuantityInputElement.step
          );
        }
      }
    } else {
      const quantityLabel = this.querySelector('.quantity-label');
      const newQuantityLabel = event.detail.data.html.querySelector('.quantity-label');
      this.#morphOrUpdateElement(quantityLabel, newQuantityLabel, quantitySelector);

      const addToCartButton = this.querySelector('[ref="addToCartButtonContainer"]');
      this.#morphOrUpdateElement(quantityRules, newQuantityRules, addToCartButton);
    }

    // Variant changed: reset to ATC mode, then check if new variant is in cart
    if (this.#isToggleMode()) {
      this.#showATC();
      await this.#initModeFromCart();
    }
  };

  /**
   * Disable the add to cart button while the UI is updating before #onVariantUpdate is called.
   */
  #onVariantSelected = () => {
    this.refs.addToCartButtonContainer?.disable();
  };
}

if (!customElements.get('product-form-component')) {
  customElements.define('product-form-component', ProductFormComponent);
}

class FlyToCart extends HTMLElement {
  /** @type {Element} */
  source;

  /** @type {Element} */
  destination;

  connectedCallback() {
    this.#animate();
  }

  #animate() {
    const rect = this.getBoundingClientRect();
    const sourceRect = this.source.getBoundingClientRect();
    const destinationRect = this.destination.getBoundingClientRect();

    const offset = {
      x: rect.width / 2,
      y: rect.height / 2,
    };
    const startPoint = {
      x: sourceRect.left + sourceRect.width / 2 - offset.x,
      y: sourceRect.top + sourceRect.height / 2 - offset.y,
    };
    const endPoint = {
      x: destinationRect.left + destinationRect.width / 2 - offset.x,
      y: destinationRect.top + destinationRect.height / 2 - offset.y,
    };

    const controlPoint1 = { x: startPoint.x, y: startPoint.y - 200 };
    const controlPoint2 = { x: endPoint.x - 300, y: endPoint.y - 100 };

    /** @type {number | null} */
    let startTime = null;
    const duration = 600;

    this.style.opacity = '1';

    /** @param {number} currentTime */
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const position = bezierPoint(progress, startPoint, controlPoint1, controlPoint2, endPoint);

      this.style.setProperty('--x', `${position.x}px`);
      this.style.setProperty('--y', `${position.y}px`);
      this.style.setProperty('--scale', `${1 - progress * 0.5}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.style.opacity = '0';
        onAnimationEnd(this, () => this.remove());
      }
    };

    this.style.setProperty('--x', `${startPoint.x}px`);
    this.style.setProperty('--y', `${startPoint.y}px`);

    requestAnimationFrame(animate);
  }
}

/**
 * @param {number} t
 * @param {{x: number, y: number}} p0
 * @param {{x: number, y: number}} p1
 * @param {{x: number, y: number}} p2
 * @param {{x: number, y: number}} p3
 * @returns {{x: number, y: number}}
 */
function bezierPoint(t, p0, p1, p2, p3) {
  const cX = 3 * (p1.x - p0.x);
  const bX = 3 * (p2.x - p1.x) - cX;
  const aX = p3.x - p0.x - cX - bX;

  const cY = 3 * (p1.y - p0.y);
  const bY = 3 * (p2.y - p1.y) - cY;
  const aY = p3.y - p0.y - cY - bY;

  const x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
  const y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;

  return { x, y };
}

if (!customElements.get('fly-to-cart')) {
  customElements.define('fly-to-cart', FlyToCart);
}