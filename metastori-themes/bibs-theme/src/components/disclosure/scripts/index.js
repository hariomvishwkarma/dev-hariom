if (!customElements.get('c-disclosure')) {
  class Disclosure extends HTMLElement {
    constructor() {
      super();
      this.el = this.querySelector('details');
      this.el.addEventListener('focusout', this.onFocusOut.bind(this));
      this.el.addEventListener('toggle', this.onToggle.bind(this));
    }

    get sectionUspBar() {
      return document.querySelector('.section-usp-bar');
    }

    onFocusOut() {
      setTimeout(() => {
        if (!this.contains(document.activeElement)) this.close();
      });
    }

    close() {
      this.el.removeAttribute('open');
    }

    onToggle() {
      if (this.el.open) {
        if (this.sectionUspBar) this.sectionUspBar.style.zIndex = '30';
      } else {
        if (this.sectionUspBar) this.sectionUspBar.style.zIndex = '20';
      }
    }
  }

  customElements.define('c-disclosure', Disclosure);

  if (!customElements.get('c-wishlist-share-disclosure')) {
    class WishlistShareDisclosure extends Disclosure {
      constructor() {
        super();
      }

      get socialLinks() {
        const wrapper = this.querySelector('.share-social_links');
        if (wrapper) {
          const links = wrapper.querySelectorAll('a');
          return links;
        }
      }

      onToggle() {
        if (this.el.open) {
          if (this.sectionUspBar) this.sectionUspBar.style.zIndex = '30';
          this.shareInput.value = this.updatePagePath();
          if (this.socialLinks.length > 0) {
            this.socialLinks.forEach((link) => {
              const href = link.dataset.href;
              if (href) link.href = href.replace('[LINK]', this.shareInput.value);
            });
          }
        } else {
          if (this.sectionUspBar) this.sectionUspBar.style.zIndex = '20';
        }
      }
      get wishList() {
        const shopifyWishlist = localStorage.getItem('shopify-wishlist');
        if (shopifyWishlist) return shopifyWishlist;
      }
      get shareLinkComponent() {
        return this.querySelector('share-link');
      }
      get pagePath() {
        if (this.shareLinkComponent) return this.shareLinkComponent.shareLink;
      }
      get shareInput() {
        if (this.shareLinkComponent) return this.shareLinkComponent.shareInput;
      }

      updatePagePath() {
        let urlObj = new URL(this.pagePath);
        let searchParams = urlObj.searchParams;
        const hasWishlist = searchParams.has('wishlist');
        if (hasWishlist) {
          searchParams.set('wishlist', this.wishList);
        } else {
          searchParams.append('wishlist', this.wishList);
        }
        return urlObj.href;
      }
    }
    customElements.define('c-wishlist-share-disclosure', WishlistShareDisclosure);
  }
}
