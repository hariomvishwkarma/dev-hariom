import { dispatchCustomEvent } from '../../../scripts/utils/dispatchCustomEvent';
import { initButtons } from '../../../sections/wishlist/scripts/wishlist';
import { initTooltip } from '../../tooltip/scripts';

if (!customElements.get('quick-view')) {
  class QuickView extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.init();
    }

    get isSubscriptionCollection() {
      return document.body.classList.contains('template-collection-subscription');
    }

    get productCard() {
      return this.closest('product-card');
    }

    get quickViewButton() {
      return this.querySelector('.product-quickview-button');
    }

    get drawer() {
      return document.querySelector('[data-component-id="Product-drawer"]');
    }

    get cartDrawer() {
      return document.querySelector('[data-component-id="cart-drawer"]');
    }

    get subscriptionDrawer() {
      return document.querySelector('subscription-drawer');
    }

    get loading() {
      if (this.drawer) return this.drawer.querySelector('.loading');
    }

    init() {
      if (this.quickViewButton) {
        if (this.isSubscriptionCollection) {
          const productLinks = this.productCard?.querySelectorAll('a[href*="/products/"]');
          if (productLinks) {
            this.triggers = [this.quickViewButton, ...productLinks];
          } else {
            this.triggers = [this.quickViewButton];
          }
          if (this.triggers.length > 0) {
            this.triggers.forEach((trigger) => {
              this.enableQuickview(trigger);
            });
          }
        } else {
          this.enableQuickview(this.quickViewButton);
        }

        this.triggers = [];
      }
    }

    enableQuickview(triggerEl) {
      if (!triggerEl) return;
      triggerEl.addEventListener('click', this.onClick.bind(this));
    }

    onClick(e) {
      e.preventDefault();
      let templateSuffix,
        noOverFlowHidden = false;
      if (this.isSubscriptionCollection) {
        this.subscriptionDrawer.appendChild(this.drawer);
        templateSuffix = 'subscription-quick-view';
        noOverFlowHidden = true;
      } else {
        templateSuffix = 'quick-view';
      }
      let productHandle = this.quickViewButton.dataset.productHandle,
        href = `${window.routes.root_url}/products/${productHandle}?view=${templateSuffix}`;

      if (QuickView.productHandle !== productHandle) {
        href = href.replace('//', '/');

        if (!href || !productHandle) {
          return;
        }

        if (this.loading) this.loading.setAttribute('loading', '');
        if (this.cartDrawer) this.cartDrawer.close();
        if (this.drawer) this.drawer.open(false, noOverFlowHidden);

        fetch(href)
          .then((response) => {
            return response.text();
          })
          .then((text) => {
            const elem = new DOMParser().parseFromString(text, 'text/html');
            const sectionInnerHTML = elem?.querySelector('.section-main-product-quick-view')?.outerHTML;
            const sectionInnerHTMLNotifyMe = elem?.querySelector('#notify-sold-out-drawer .contents .contents-inner')?.outerHTML;
            this.renderQuickview(sectionInnerHTML, href, productHandle);
            this.renderNotifySoldOut(sectionInnerHTMLNotifyMe, href, productHandle);
          })
          .catch((error) => {
            console.error('Error:', error);
            this.drawer.close();
          })
          .finally(() => {
            QuickView.productHandle = productHandle;
            if (this.loading) this.loading.removeAttribute('loading');
          });

        if (e.target) e.target.removeEventListener('click', this.onClick);
      } else {
        if (this.drawer) this.drawer.open(false, noOverFlowHidden);
      }
    }

    renderQuickview(sectionInnerHTML, href, productHandle) {
      if (!sectionInnerHTML) return;

      const drawerContentEl = this.drawer.querySelector('.drawer-content-wrapper > .contents');
      if (drawerContentEl) drawerContentEl.innerHTML = sectionInnerHTML;
      this.activateLikeButton();
      this.activateTooltip();

      dispatchCustomEvent('quick-view:open', {
        productUrl: href,
        productHandle: productHandle,
      });
    }

    renderNotifySoldOut(sectionInnerHTML, href, productHandle) {
      if (!this.drawer) return;
      const button = this.drawer.querySelector('[data-open-drawer=notify-sold-out-drawer]');
      const notifyDrawer = document.querySelector('[data-component-id=notify-sold-out-drawer]');
      if (!button || !notifyDrawer) return;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.drawer.close();
        notifyDrawer.open(false);
      });

      const drawerContentEl = notifyDrawer.querySelector('.drawer-content-wrapper > .contents');
      if (drawerContentEl) drawerContentEl.innerHTML = sectionInnerHTML;

      dispatchCustomEvent('notify-sold-out:open', {
        productUrl: href,
        productHandle: productHandle,
      });
    }

    activateLikeButton() {
      initButtons();
    }

    activateTooltip() {
      initTooltip();
    }
  }
  customElements.define('quick-view', QuickView);
}
