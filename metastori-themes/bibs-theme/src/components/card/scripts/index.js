import { dispatchCustomEvent } from '../../../scripts/utils/dispatchCustomEvent';

if (!customElements.get('product-card')) {
  class ProductCard extends HTMLElement {
    constructor() {
      super();
    }

    get notifyButton() {
      return this.querySelector('.notify-sold-out-from-collection');
    }

    get notifyDrawerContent() {
      return document.querySelector('#notify-sold-out-drawer .drawer-content-wrapper');
    }

    get productRecommendations() {
      if (this.notifyDrawerContent) return this.notifyDrawerContent.querySelector('product-recommendations');
    }

    connectedCallback() {
      if (this.notifyButton) {
        this.notifyButton.addEventListener('click', async (event) => {
          if (!this.notifyDrawerContent) return;
          const productHandle = event.target.dataset.productHandle;
          const response = await fetch(`${window.routes.root_url}products/${productHandle}?view=notify`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const htmlText = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, 'text/html');
          if (doc) {
            const content = doc.querySelector('#notify-sold-out-drawer .drawer-content-wrapper');
            if (content) {
              this.notifyDrawerContent.innerHTML = content.innerHTML;
              this.productRecommendations?.connectedCallback();
            }
          }

          dispatchCustomEvent('notify-sold-out:open', {});
        });
      }
    }
  }
  customElements.define('product-card', ProductCard);
}
