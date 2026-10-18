if (!customElements.get('localization-form')) {
  let GLOBAL_MARKET_LINK = null;
  class LocalizationForm extends HTMLElement {
    constructor() {
      super();

      if (GLOBAL_MARKET_LINK === null) {
        GLOBAL_MARKET_LINK = this.currentMarketLink;
      }
      this.setupEventListeners();
    }

    get form() {
      return this.querySelector('form#localization_form');
    }

    get triggerEl() {
      if (this.form) return this.form.querySelector('summary');
    }

    get currentURLPath() {
      return window.location.pathname + window.location.search;
    }

    get pathToRedirect() {
      let currentPath = '';
      if (this.currentMarketLink == '/') {
        currentPath = this.currentURLPath;
      } else {
        currentPath = this.currentURLPath.split(this.currentMarketLink)[1];
      }
      return currentPath;
    }
    get currentMarketLink() {
      if (!this.form) return;
      if (this.triggerEl) {
        const marketLink = this.triggerEl.dataset.link;
        return marketLink || '';
      }
      console.warn('currentMarketLink could not be determined.');
      return '';
    }
    set currentMarketLink(currentMarketLink) {
      this._currentMarketLink = currentMarketLink;
    }

    get localizationLinks() {
      return this.querySelectorAll('.disclosure__content .disclosure__link');
    }

    setupEventListeners() {
      this.localizationLinks.forEach((link) => {
        link.addEventListener('click', this.handleLinkClick.bind(this));
      });
    }

    getPathToRedirect(event) {
      let newMarketLink = event.currentTarget.dataset.href;
      let pathToRedirect = '';
      const isAbsolute = newMarketLink.startsWith('http');

      if (isAbsolute) {
        pathToRedirect = newMarketLink + this.pathToRedirect;
      } else {
        if (!newMarketLink.startsWith('/')) {
          newMarketLink = '/' + newMarketLink;
        }
        pathToRedirect = newMarketLink + this.pathToRedirect;
        if (pathToRedirect.includes('//')) {
          pathToRedirect = pathToRedirect.replace('//', '/');
        }

        pathToRedirect = window.location.origin + pathToRedirect;
      }
      return pathToRedirect;
    }

    handleLinkClick(event) {
      event.preventDefault();
      if (this.currentMarketLink) {
        const pathToRedirect = this.getPathToRedirect(event);
        window.location.href = pathToRedirect;
      }
    }
  }
  customElements.define('localization-form', LocalizationForm);

  if (!customElements.get('leaflet-switcher')) {
    class LeafletSwitcher extends LocalizationForm {
      constructor() {
        super();

        this.productLeafletEl = this.closest('#product-leaflet');
        if (this.productLeafletEl) {
          this.productLeafletContent = this.productLeafletEl.querySelector('.drawer-content');
          this.loadingEl = this.productLeafletEl.querySelector('.loading');
        }
      }

      get currentMarketLink() {
        return GLOBAL_MARKET_LINK;
      }

      handleLinkClick(event) {
        event.preventDefault();
        if (this.currentMarketLink) {
          this.loadingEl?.setAttribute('loading', '');
          const pathToRedirect = this.getPathToRedirect(event);
          this.fetchLeafletContent(pathToRedirect);
        }
      }

      fetchLeafletContent(pathToRedirect) {
        fetch(pathToRedirect)
          .then((response) => {
            if (response.ok) {
              return response.text();
            }
            throw new Error('Network response was not ok.');
          })
          .then((html) => {
            const parser = new DOMParser();
            const newDocument = parser.parseFromString(html, 'text/html');
            const newLeaflet = newDocument.querySelector('#product-leaflet .drawer-content');
            if (newLeaflet) this.replaceLeafletContent(newLeaflet);
          })
          .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
            this.loadingEl?.removeAttribute('loading');
          });
      }

      replaceLeafletContent(newLeaflet) {
        if (this.productLeafletContent) {
          this.productLeafletContent.innerHTML = newLeaflet.innerHTML;
          this.productLeafletContent.setAttribute('aria-live', 'polite');
          this.loadingEl?.removeAttribute('loading');
          this.setupEventListeners();
        }
      }
    }
    customElements.define('leaflet-switcher', LeafletSwitcher);
  }
}
