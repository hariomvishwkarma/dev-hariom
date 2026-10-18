class QuickViewDrawer extends MenuDrawer {
  constructor() {
    super();

    this.setClasses({
      open: 'quick-view--open',
      opening: 'quick-view--opening',
      closing: 'quick-view--closing'
    });

    this._portalPlaceholder = null;
    this._quickViewEl = null;
    this._onOverlayClick = this.handleOverlayClick.bind(this);

    this.addEventListener('close', () => {
      const qv = this._quickViewEl || this.querySelector('quick-view.quick-view');
      const drawerContent = qv
        ? qv.querySelector('.quick-view__content')
        : this.querySelector('.quick-view__content');

      if (drawerContent) {
        drawerContent.innerHTML = '';
        drawerContent.classList.remove('hide-cover');
      }

      if (qv) {
        qv._loadedUrl = null;
      }

      this.restorePortal();
      document.dispatchEvent(new CustomEvent('quickview:close'));
    });
  }

  openMenuDrawer(summaryElement = false) {
    this.portalToBody();
    setScrollbarWidth();
    setHeaderBottomPosition();

    // Only one modal DOM at a time — shared section IDs break radio/label pairing.
    this.clearOtherQuickViews();

    const qv = this._quickViewEl;
    if (qv && typeof qv.loadProduct === 'function') {
      qv.loadProduct();
    }

    const focusRoot = qv || this.mainDetailsToggle;

    if (summaryElement) {
      summaryElement.setAttribute('aria-expanded', true);
      // Focus the portaled shell — never the card summary (outside the portal).
      trapFocus(focusRoot, focusRoot);
    }

    // Do NOT use MenuDrawer's body-click closer — it treats portaled option
    // clicks as "outside" and closes the drawer. Overlay click handles dismiss.
    document.body.classList.add(this.classes.opening);

    this.openAnimation();
    setTimeout(() => {
      this.mainDetailsToggle.setAttribute('open', '');
      setTimeout(() => {
        this.mainDetailsToggle.classList.add('menu-opening');
      }, 10);
    });
  }

  clearOtherQuickViews() {
    const active = this._quickViewEl;
    document.querySelectorAll('quick-view.quick-view').forEach((el) => {
      if (el === active) return;
      const content = el.querySelector('.quick-view__content');
      if (content) {
        content.innerHTML = '';
        content.classList.remove('hide-cover');
      }
      el._loadedUrl = null;
    });
  }

  // Portaled radios/labels steal focus from the card <details>; ignore that.
  onFocusOut() {}

  // Disabled — see openMenuDrawer. Outside dismiss is handleOverlayClick.
  onBodyClick() {}

  handleOverlayClick(event) {
    const qv = this._quickViewEl;
    if (!qv) return;

    // Close only when clicking the dimmed shell, not the dialog panel / popups.
    if (event.target !== qv) return;
    if (event.target.closest('.product-popup-modal, #SizeSelectionModal, .product-media-modal')) return;

    this.closeMenuDrawer(event);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (this._quickViewEl) {
      this._quickViewEl.removeEventListener('click', this._onOverlayClick);
    }
    if (document.body && this.onBodyClickEvent) {
      document.body.removeEventListener('click', this.onBodyClickEvent);
    }
    super.closeMenuDrawer(event, elementToFocus);
  }

  portalToBody() {
    const qv = this.querySelector('quick-view.quick-view');
    if (!qv) return;

    if (qv.parentElement !== document.body) {
      this._quickViewEl = qv;
      this._portalPlaceholder = document.createComment('quick-view-portal');
      qv.parentElement.insertBefore(this._portalPlaceholder, qv);

      if (!qv.dataset.hcPortalCloseBound) {
        qv.dataset.hcPortalCloseBound = 'true';
        qv.addEventListener('drawer:force-close', (event) => {
          event.stopPropagation();
          this.closeMenuDrawer(event);
        });
      }

      document.body.appendChild(qv);
    } else {
      this._quickViewEl = qv;
    }

    qv.removeEventListener('click', this._onOverlayClick);
    qv.addEventListener('click', this._onOverlayClick);
  }

  restorePortal() {
    if (this._quickViewEl) {
      this._quickViewEl.removeEventListener('click', this._onOverlayClick);
    }

    if (!this._quickViewEl || !this._portalPlaceholder || !this._portalPlaceholder.parentNode) {
      this._quickViewEl = null;
      this._portalPlaceholder = null;
      return;
    }

    this._portalPlaceholder.parentNode.insertBefore(this._quickViewEl, this._portalPlaceholder);
    this._portalPlaceholder.remove();
    this._portalPlaceholder = null;
    this._quickViewEl = null;
  }
}
customElements.define('quick-view-drawer', QuickViewDrawer);

class QuickViewButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const wrapper = this.closest('.card-wrapper');
      const drawer = wrapper && wrapper.querySelector('quick-view-drawer');
      if (drawer) {
        const summary = drawer.querySelector('summary');
        if (summary) summary.click();

        document.dispatchEvent(new CustomEvent('quickview:open', {
          detail: {
            productUrl: this.dataset.productUrl
          }
        }));
        return;
      }

      if (this.dataset.productUrl) {
        window.location = this.dataset.productUrl;
      }
    });
  }
}
customElements.define('quick-view-button', QuickViewButton);

class QuickView extends HTMLElement {
  constructor() {
    super();
    this._loadedUrl = null;
    this._loading = false;
  }

  // Load on open only — IntersectionObserver preloaded every card with the same
  // modal section IDs, so label[for] / #product-form-* hit the wrong node.
  loadProduct() {
    const drawerContent = this.querySelector('.quick-view__content');
    if (!drawerContent) return;

    const productUrl = (this.dataset.productUrl || '').split('?')[0];
    if (!productUrl) return;

    if (this._loadedUrl === productUrl && drawerContent.childElementCount > 0) {
      this.activateInjectedMedia(drawerContent);
      drawerContent.classList.add('hide-cover');
      this.refocusDialog(drawerContent);
      document.dispatchEvent(new CustomEvent('quickview:loaded', {
        detail: { productUrl: this.dataset.productUrl }
      }));
      return;
    }

    if (this._loading) return;
    this._loading = true;
    drawerContent.classList.remove('hide-cover');

    const sectionUrl = `${productUrl}?view=modal`;

    fetch(sectionUrl)
      .then(response => response.text())
      .then(responseText => {
        const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
        const productElement = responseHTML.querySelector('.quick-view__content');
        if (!productElement) {
          drawerContent.classList.add('hide-cover');
          return;
        }

        this.setInnerHTML(drawerContent, productElement.innerHTML);
        this._loadedUrl = productUrl;
        this.activateInjectedMedia(drawerContent);

        if (window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }

        requestAnimationFrame(() => {
          this.activateInjectedMedia(drawerContent);
          drawerContent.classList.add('hide-cover');
          this.refocusDialog(drawerContent);
          document.dispatchEvent(new CustomEvent('quickview:loaded', {
            detail: {
              productUrl: this.dataset.productUrl
            }
          }));
        });
      })
      .catch(e => {
        console.error(e);
        drawerContent.classList.add('hide-cover');
      })
      .finally(() => {
        this._loading = false;
      });
  }

  refocusDialog(drawerContent) {
    if (!drawerContent) return;
    const closeBtn = drawerContent.querySelector('.quick-view__close, [aria-label], button');
    trapFocus(this, closeBtn || drawerContent);
  }

  activateInjectedMedia(root) {
    if (!root) return;

    root.querySelectorAll('.gallery-cursor').forEach((el) => el.remove());

    root.querySelectorAll('use-animate').forEach((el) => {
      el.setAttribute('animate', '');
      el.classList.remove('loading');
    });

    root.querySelectorAll('.media-wrapper').forEach((el) => {
      el.classList.remove('loading');
      el.removeAttribute('loading');
    });

    root.querySelectorAll('img').forEach((img) => {
      img.classList.add('loaded');
      if (img.getAttribute('src') && !img.complete) {
        const src = img.getAttribute('src');
        img.removeAttribute('src');
        img.setAttribute('src', src);
      }
    });

    // Ensure gallery slider controls use the visible main-gallery treatment.
    root.querySelectorAll('.product__media-wrapper .slider-buttons').forEach((el) => {
      el.classList.add('slider-buttons--main-gallery');
      el.classList.remove('hidden');
      el.hidden = false;
      el.removeAttribute('hidden');
    });

    this.syncMobileGalleryHeight(root);
  }

  syncMobileGalleryHeight(root) {
    if (!root || window.matchMedia('(min-width: 750px)').matches) return;

    const gallery = root.querySelector('product-gallery');
    if (!gallery) return;

    const updateHeight = () => {
      if (window.matchMedia('(min-width: 750px)').matches) {
        gallery.style.removeProperty('--qv-active-slide-height');
        return;
      }

      const slider = gallery.querySelector('.product__media-list');
      if (!slider) return;

      const items = Array.from(slider.querySelectorAll('.product__media-item')).filter(
        (el) => el.clientWidth > 0
      );
      if (!items.length) return;

      let page = gallery.currentPage || 1;
      if (items.length > 1) {
        const offset = items[1].offsetLeft - items[0].offsetLeft;
        if (offset > 0) {
          page = Math.round(slider.scrollLeft / offset) + 1;
        }
      }
      page = Math.min(Math.max(page, 1), items.length);

      const active = items[page - 1] || items[0];
      const media = active.querySelector('.media') || active.querySelector('.product__modal-opener') || active;
      const height = Math.round(media.getBoundingClientRect().height);

      if (height > 0) {
        gallery.style.setProperty('--qv-active-slide-height', `${height}px`);
      }

      const ratio = media.style && media.style.getPropertyValue('--image-ratio-percent');
      if (ratio) {
        slider.style.setProperty('--force-image-ratio-percent', ratio);
      }
    };

    updateHeight();

    if (!gallery.dataset.qvHeightBound) {
      gallery.dataset.qvHeightBound = 'true';
      gallery.addEventListener('slideChanged', updateHeight);

      const slider = gallery.querySelector('.product__media-list');
      if (slider) {
        let scrollTimer;
        slider.addEventListener(
          'scroll',
          () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateHeight, 60);
          },
          { passive: true }
        );
      }

      root.querySelectorAll('img').forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', updateHeight, { once: true });
        }
      });

      window.addEventListener('resize', updateHeight);
    }

    requestAnimationFrame(updateHeight);
  }

  setInnerHTML(element, html) {
    element.innerHTML = html;

    element.querySelectorAll('script').forEach(oldScriptTag => {
      const newScriptTag = document.createElement('script');
      Array.from(oldScriptTag.attributes).forEach(attribute => {
        newScriptTag.setAttribute(attribute.name, attribute.value)
      });
      newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
      oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
    });
  }
}
customElements.define('quick-view', QuickView);

// Close any open Quick View after a successful add-to-cart.
document.addEventListener('ajaxProduct:added', () => {
  document.querySelectorAll('quick-view-drawer').forEach((drawer) => {
    if (drawer.mainDetailsToggle && drawer.mainDetailsToggle.hasAttribute('open')) {
      drawer.closeMenuDrawer(new Event('ajaxProduct:added'));
    }
  });
});
