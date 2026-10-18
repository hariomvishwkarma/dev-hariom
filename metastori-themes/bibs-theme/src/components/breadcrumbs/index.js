import { elementIsVisibleInViewport } from '../../scripts/utils/elementIsVisibleInViewport.js';

if (!customElements.get('breadcrumbs-nav')) {
  class Breadcrumbs extends HTMLElement {
    constructor() {
      super();

      this.buttonEle = this.querySelector('button');
      this.button = this.querySelector('button > p');
      this.buttonContent = this.button && this.button.innerHTML;
      this.links = this.querySelectorAll('li > a');

      if (!this.buttonEle) return;
      this.inits();

      window.addEventListener('resize', this.replaceButtonContent.bind(this));
      this.button.addEventListener('click', this.goBack.bind(this));
    }

    inits() {
      this.previousLink = this.links.length && this.links[this.links.length - 1];
      this.previousLinkHref = this.previousLink && this.previousLink.href;
      this.previousLinkContent = this.previousLink && this.previousLink.innerHTML;

      window.addEventListener('load', this.replaceButtonContent.bind(this));
      this.disableButton();
    }

    replaceButtonContent() {
      if (!this.previousLinkContent) return;
      const breadcrumbs = this.querySelector('.breadcrumbs');
      const breadcrumbsIsVisible = elementIsVisibleInViewport(breadcrumbs);
      if (!breadcrumbsIsVisible) {
        this.button.innerHTML = this.previousLinkContent;
      } else {
        this.button.innerHTML = this.buttonContent;
      }
    }

    disableButton() {
      if (this.previousLinkHref) return;
      this.button.disabled = true;
    }

    goBack() {
      if (!this.previousLink || !this.previousLinkHref) return;
      window.location.href = this.previousLinkHref;
    }
  }

  customElements.define('breadcrumbs-nav', Breadcrumbs);
}
