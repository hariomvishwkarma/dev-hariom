class FooterAccordion extends HTMLElement {
  constructor() {
    super();

    this.detailsContainer = this.querySelector('details');
    this.summaryToggle = this.querySelector('summary');
    if (!this.detailsContainer || !this.summaryToggle) return;

    this.summaryIsEmpty = this.summaryToggle.textContent.trim().length == 0;
    this.mobileQuery = window.matchMedia('(max-width: 767px)');
    this.footer = this.closest('.footer');

    this.onSummaryClick = this.onSummaryClick.bind(this);
    this.onMediaChange = this.onMediaChange.bind(this);

    this.detailsContainer.addEventListener('keyup', (event) => event.code.toUpperCase() === 'ESCAPE' && this.close());
    this.summaryToggle.addEventListener('click', this.onSummaryClick);

    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this.onMediaChange);
    } else if (this.mobileQuery.addListener) {
      this.mobileQuery.addListener(this.onMediaChange);
    }
  }

  // Attributes are only guaranteed to be readable once the element is in the
  // document, so the first sync waits for connectedCallback rather than the
  // constructor. Re-running it on reconnect (theme editor re-renders) is safe.
  connectedCallback() {
    this.footer = this.closest('.footer');
    this.syncForViewport();
  }

  get isMobile() {
    return this.mobileQuery.matches;
  }

  get isMobileAccordion() {
    return this.isMobile && this.footer && this.footer.getAttribute('data-mobile-layout') === 'accordion';
  }

  // Blocks with the "Open by default on mobile" setting start expanded in the
  // mobile accordion instead of collapsed. Still tappable to close.
  get opensOnMobile() {
    return this.hasAttribute('data-open-on-mobile') && this.getAttribute('data-open-on-mobile') !== 'false';
  }

  syncForViewport() {
    if (!this.detailsContainer || !this.summaryToggle) return;

    if (this.summaryIsEmpty) {
      this.open();
      this.summaryToggle.setAttribute('tabindex', '-1');
      return;
    }

    if (this.isMobileAccordion) {
      if (this.opensOnMobile) {
        this.open();
      } else {
        this.close();
      }
      this.summaryToggle.removeAttribute('tabindex');
    } else {
      this.open();
      this.summaryToggle.setAttribute('tabindex', '-1');
    }
  }

  onMediaChange() {
    this.syncForViewport();
  }

  onSummaryClick(event) {
    if (!this.detailsContainer) return;

    // Only accordion mobile layout allows toggle. Desktop/tablet/stacked stay open.
    if (!this.isMobileAccordion || this.summaryIsEmpty) {
      event.preventDefault();
      this.open();
    }
  }

  open() {
    if (!this.detailsContainer) return;
    this.detailsContainer.setAttribute('open', '');
  }

  close() {
    if (!this.detailsContainer) return;
    this.detailsContainer.removeAttribute('open');
  }
}

customElements.define('footer-accordion', FooterAccordion);
