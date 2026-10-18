if (!customElements.get('share-link')) {
  class ShareLink extends HTMLElement {
    constructor() {
      super();
    }
    get shareInput() {
      return this.querySelector('input');
    }
    get shareLink() {
      if (this.shareInput) return this.shareInput.value;
    }
    get copyButton() {
      return this.querySelector('button[type="button"]');
    }
    get copyLink() {
      return this.querySelector('.copy_link');
    }
    get copyLinkSuccess() {
      return this.querySelector('.copy_link_success');
    }

    connectedCallback() {
      this.copyButton.addEventListener('click', this.onCopy.bind(this));
    }

    onCopy() {
      if (!this.shareLink) {
        this.copyButton.disabled = true;
        return;
      } else {
        this.copyButton.disabled = false;
      }
      this.copyToClipboard(this.shareLink);
      this.copyLinkSuccess.classList.remove('!hidden');
      this.copyLink.classList.add('!hidden');
      setTimeout(() => {
        this.copyLink.classList.remove('!hidden');
        this.copyLinkSuccess.classList.add('!hidden');
      }, 2500);
    }

    copyToClipboard(copyText) {
      navigator.clipboard.writeText(copyText);
    }
  }
  customElements.define('share-link', ShareLink);
}
