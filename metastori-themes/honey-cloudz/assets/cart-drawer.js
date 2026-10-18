
class MiniCart extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.header = document.querySelector('sticky-header');
    this.drawer = document.querySelector('cart-drawer');
    new IntersectionObserver(this.handleIntersection.bind(this)).observe(this);

    // Add the <template> for the gift note button inside the component
    this.addGiftNoteButtonTemplate();
  }

  handleIntersection(entries, observer) {
    if (!entries[0].isIntersecting) return;
    observer.unobserve(this);

    const miniCart = document.getElementById('mini-cart');
    const customCartEnabled =
      window.customCartDrawerEnabled === true || window.CustomCartUtils?.isEnabled();

    if (customCartEnabled && miniCart?.querySelector('[data-custom-cart]')) {
      window.CustomCartUtils?.dedupeCartDrawerChrome?.(
        miniCart.querySelector('[data-custom-cart]')
      );
      this.renderGiftNoteButton();
      document.dispatchEvent(new CustomEvent('cartdrawer:opened'));
      return;
    }

    fetch(this.dataset.url)
      .then(response => response.text())
      .then(html => {
        if (customCartEnabled && window.CustomCartUtils?.patchCartDrawerContent) {
          window.CustomCartUtils.patchCartDrawerContent(miniCart, html);
        } else {
          miniCart.innerHTML = this.getSectionInnerHTML(html, '.shopify-section');
        }

        window.CustomCartUtils?.dedupeCartDrawerChrome?.(
          miniCart.querySelector('[data-custom-cart]')
        );

        this.renderGiftNoteButton();

        document.dispatchEvent(new CustomEvent('cartdrawer:opened'));
      })
      .catch(e => {
        console.error(e);
      });
  }

  open() {
    const detailsElement = this.drawer.querySelector('details');
    if (detailsElement.hasAttribute('open')) {
      return;
    }
    
    this.drawer.openMenuDrawer();
  }

  renderContents(parsedState) {
    this.productId = parsedState.id;

    if (window.CustomCartUtils?.isEnabled?.()) {
      const sections = window.CustomCartUtils.getSectionsToRender();
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        const sectionHtml = window.CustomCartUtils.getSectionHtmlFromState?.(parsedState.sections, section);
        if (!element || !sectionHtml) return;

        if (section.id === 'mini-cart') {
          window.CustomCartUtils.patchCartDrawerContent(element, sectionHtml);
        } else {
          element.innerHTML = window.CustomCartUtils.getSectionInnerHTML(sectionHtml, section.selector);
        }
      });

      this.renderGiftNoteButton();
      requestAnimationFrame(() => {
        window.CustomCartUtils?.dedupeCartDrawerChrome?.(document.querySelector('[data-custom-cart]'));
      });
      window.CustomCart?.onSectionRendered?.({ fromPatch: true, forceCrossSell: true });

      const drawerDetails = document.querySelector('cart-drawer details.cart-drawer-container');
      if (!drawerDetails?.hasAttribute('open')) {
        this.open();
      }
      return;
    }

    this.getSectionsToRender().forEach((section) => {
      if (document.getElementById(section.id)) {
        const sectionKey = section.section || section.id;
        const sectionHtml = parsedState.sections?.[sectionKey] || parsedState.sections?.[section.id];
        if (!sectionHtml) return;

        document.getElementById(section.id).innerHTML =
          this.getSectionInnerHTML(sectionHtml, section.selector);
      }
    });

    this.renderGiftNoteButton();
    this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'mini-cart',
        section: 'mini-cart',
        selector: '.shopify-section'
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'mobile-cart-icon-bubble',
        section: 'mobile-cart-icon-bubble',
        selector: '.shopify-section'
      }
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  // Method to add the template to the DOM
  addGiftNoteButtonTemplate() {
    if (this.querySelector('#giftButtonTemplate')) return;

    const template = document.createElement('template');
    template.id = 'giftButtonTemplate';
    template.innerHTML = `
      <style>
        .gift-button {
          padding: 10px;
          background-color: #FFB6C1;
          border-radius: 5px;
          color: white;
          font-size: 16px;
        }
      </style>
    `;

    this.appendChild(template);
  }

  // Method to render the gift note button
  renderGiftNoteButton() {
    const buttonHTML = `
      <giftnote-button
        data-styles="giftButtonTemplate"
        data-add="Add a gift message 🎁"
        data-edit="Edit gift message 🎁"
      ></giftnote-button>
    `;

    const miniCartElement = document.getElementById('mini-cart');
    if (miniCartElement) {
      miniCartElement.querySelectorAll('giftnote-button').forEach((node) => node.remove());
      miniCartElement.insertAdjacentHTML('beforeend', buttonHTML);
    }
  }
}

customElements.define('mini-cart', MiniCart);
