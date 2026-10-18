import { DialogComponent } from '@theme/dialog';
import { CartAddEvent } from '@theme/events';

/**
 * A custom element that manages a cart drawer.
 *
 * @extends {DialogComponent}
 */
class CartDrawerComponent extends DialogComponent {
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(CartAddEvent.eventName, this.#handleCartAdd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(CartAddEvent.eventName, this.#handleCartAdd);
  }

  #handleCartAdd = () => {
    if (this.hasAttribute('suppress-open')) return;

    if (this.hasAttribute('auto-open')) {
      this.showDialog();
      // Thoda delay taa ki drawer DOM fully render ho jaye
      setTimeout(() => this.#ensureRecommendationsLoaded(), 50);
    }
  };

  open() {
    this.showDialog();
    // Manual open par bhi same behaviour
    setTimeout(() => this.#ensureRecommendationsLoaded(), 50);

    /**
     * Close cart drawer when installments CTA is clicked to avoid overlapping dialogs
     */
    customElements.whenDefined('shopify-payment-terms').then(() => {
      const installmentsContent = document.querySelector('shopify-payment-terms')?.shadowRoot;
      const cta = installmentsContent?.querySelector('#shopify-installments-cta');
      cta?.addEventListener('click', this.closeDialog, { once: true });
    });
  }

  close() {
    this.closeDialog();
  }

  /**
   * Ensure cart drawer product recommendations load on first open,
   * especially on non-product pages.
   */
  #ensureRecommendationsLoaded() {
    const recommendations = this.querySelector('product-recommendations');
    if (!recommendations) return;

    // If recommendations already performed and product id set, rely on existing behaviour
    const alreadyLoaded = recommendations.dataset.recommendationsPerformed === 'true';
    const hasProductId = !!recommendations.dataset.productId;

    if (alreadyLoaded && hasProductId) return;

    // Fetch cart to get first product id when opening from non-product pages
    fetch('/cart.js')
      .then((res) => res.json())
      .then((cart) => {
        if (!cart.items || !cart.items.length) return;

        const firstItem = cart.items[0];
        const productId = firstItem.product_id || firstItem.product?.id;
        if (!productId) return;

        // Update attributes; ProductRecommendations MutationObserver will trigger reload
        recommendations.dataset.productId = String(productId);
        recommendations.dataset.recommendationsPerformed = 'false';
      })
      .catch(() => {});
  }
}

if (!customElements.get('cart-drawer-component')) {
  customElements.define('cart-drawer-component', CartDrawerComponent);
}

document.addEventListener("DOMContentLoaded", function () {
  const heading = document.querySelector("h1");
  const cusShop = document.querySelector(".cus-shop");

  if (heading && cusShop) {
    heading.addEventListener("click", function () {
      cusShop.click();
    });
  }
});