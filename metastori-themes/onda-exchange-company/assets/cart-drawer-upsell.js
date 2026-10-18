function mountCartDrawerUpsellControls(container) {
  const controls = container.querySelector('[data-cart-drawer-upsell-controls]');
  const host =
    container.closest('.cart-drawer__upsell')?.querySelector('[data-cart-drawer-upsell-controls-host]') ||
    document.querySelector('[data-cart-drawer-upsell-controls-host]');

  if (controls && host && controls.parentElement !== host) {
    host.appendChild(controls);
  }
}

function initCartDrawerUpsellSliders(root = document) {
  root.querySelectorAll('[data-cart-drawer-upsell-slider]').forEach((container) => {
    if (container.dataset.sliderInit === 'true') return;

    mountCartDrawerUpsellControls(container);

    const track = container.querySelector('.cart-drawer-upsell-slider__track');
    const upsellRoot = container.closest('.cart-drawer__upsell') || root;
    const prevButton = upsellRoot.querySelector('button[name="previous"]');
    const nextButton = upsellRoot.querySelector('button[name="next"]');
    const controls = upsellRoot.querySelector('[data-cart-drawer-upsell-controls]');
    const slides = track?.querySelectorAll('.cart-drawer-upsell-slider__slide');

    if (!track || !prevButton || !nextButton || !slides?.length) return;

    container.dataset.sliderInit = 'true';

    if (slides.length <= 1) {
      controls?.classList.add('is-hidden');
      return;
    }

    const getActiveIndex = () => {
      const scrollLeft = track.scrollLeft;
      let activeIndex = 0;
      let minDistance = Infinity;

      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      return activeIndex;
    };

    const updateButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 1;
      const atEnd = track.scrollLeft >= maxScroll - 1;

      prevButton.toggleAttribute('disabled', atStart);
      nextButton.toggleAttribute('disabled', atEnd);
    };

    const scrollToSlide = (direction) => {
      const activeIndex = getActiveIndex();
      const targetIndex = Math.min(Math.max(activeIndex + direction, 0), slides.length - 1);

      track.scrollTo({
        left: slides[targetIndex].offsetLeft,
        behavior: 'smooth',
      });
    };

    prevButton.addEventListener('click', () => scrollToSlide(-1));
    nextButton.addEventListener('click', () => scrollToSlide(1));
    track.addEventListener('scroll', updateButtons, { passive: true });
    const resizeObserver = new ResizeObserver(updateButtons);
    resizeObserver.observe(track);

    updateButtons();
  });
}

class CartDrawerUpsell extends HTMLElement {
  constructor() {
    super();
    this.load = this.load.bind(this);
  }

  connectedCallback() {
    if (!this.dataset.productId) return;
    this.load();
  }

  load() {
    const { url, productId, sectionId } = this.dataset;
    if (!url || !productId || !sectionId) return;

    fetch(`${url}&product_id=${productId}&section_id=${sectionId}`)
      .then((response) => response.text())
      .then((text) => {
        const html = document.createElement('div');
        html.innerHTML = text;
        const content =
          html.querySelector('[data-cart-drawer-upsell-content]') ||
          html.querySelector('.shopify-section');

        if (content?.innerHTML.trim().length) {
          this.innerHTML = content.innerHTML;
          initCartDrawerUpsellSliders(this);
        } else {
          this.closest('.cart-drawer__upsell')?.remove();
        }
      })
      .catch((error) => {
        console.error(error);
        this.closest('.cart-drawer__upsell')?.remove();
      });
  }
}

customElements.define('cart-drawer-upsell', CartDrawerUpsell);

window.initCartDrawerUpsellSliders = initCartDrawerUpsellSliders;

function scheduleCartDrawerUpsellSliderInit() {
  requestAnimationFrame(() => {
    initCartDrawerUpsellSliders(document.querySelector('cart-drawer') || document);
  });
}

document.addEventListener('DOMContentLoaded', scheduleCartDrawerUpsellSliderInit);

document.addEventListener('shopify:section:load', scheduleCartDrawerUpsellSliderInit);

if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
  subscribe(PUB_SUB_EVENTS.cartUpdate, scheduleCartDrawerUpsellSliderInit);
}
