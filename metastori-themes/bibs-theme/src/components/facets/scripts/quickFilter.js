if (!customElements.get('quick-filter')) {
  class QuickFilter extends HTMLElement {
    constructor() {
      super();
      this.mainDetailsToggle = this.querySelector('details');
      this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    }

    onFocusOut() {
      setTimeout(() => {
        if (!this.contains(document.activeElement)) this.close();
      });
    }

    close() {
      this.mainDetailsToggle.removeAttribute('open');
    }
  }

  customElements.define('quick-filter', QuickFilter);
}
