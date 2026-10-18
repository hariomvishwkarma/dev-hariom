const modals = Array.from(document.querySelectorAll('[data-modal-target]'));

class Modal {
  constructor(triggerEl, targetEl) {
    this.triggerEl = triggerEl;
    this.targetEl = targetEl;
    this.modalId = triggerEl.dataset.modalTarget;

    this.options = {
      backdropClasses: 'bg-white bg-opacity-50 fixed inset-0 z-40',
    };

    this.modalClose = Array.from(this.targetEl.querySelectorAll('[data-modal-hide]'));

    this.isProductMediaGalleryModal = false;
    if (this.modalId === 'Media-gallery-popup') {
      this.isProductMediaGalleryModal = true;
    }

    this.init();
  }

  init() {
    this.triggerEl.addEventListener('click', () => {
      this.openModal(this.targetEl);
    });

    this.modalClose.forEach((close) => {
      close.addEventListener('click', () => {
        this.closeModal(this.targetEl);
      });
    });
  }

  setupClickOutsideListener() {
    const _this = this;
    this.clickOutsideEventListener = function (ev) {
      _this.handleOutsideClick(ev, _this.modalId);
    };
    document.body.addEventListener('click', this.clickOutsideEventListener, true);
  }

  removeClickOutsideListener() {
    document.body.removeEventListener('click', this.clickOutsideEventListener, true);
  }

  openModal() {
    document.body.classList.add('overflow-hidden');
    this.targetEl.classList.remove('hidden');
    this.targetEl.classList.add('flex');
    this.createBackdrop(this.targetEl);

    if (this.isProductMediaGalleryModal) {
      const slide = this.triggerEl.closest('.swiper-slide');
      const mediaId = slide.dataset.mediaId;
      if (mediaId) {
        const swiperEl = this.targetEl.querySelector(`.swiper:not([thumbsSlider])`);
        const destinationSliderEl = swiperEl.querySelector(`[data-media-id="${mediaId}"]`);
        if (destinationSliderEl) {
          const ariaLabel = destinationSliderEl.getAttribute('aria-label');
          const sliderIndex = parseInt(ariaLabel.split('/')[0].replace(/\s/g, '')) - 1;
          const swiperElInstance = swiperEl.swiper;
          swiperElInstance.slideToLoop(sliderIndex, 0, false);
        }
      }
    }

    this.setupClickOutsideListener();
  }

  closeModal() {
    document.body.classList.remove('overflow-hidden');
    this.targetEl.classList.add('hidden');
    this.targetEl.classList.remove('flex');
    this.destroyBackdropEl();

    this.removeClickOutsideListener();
  }

  createBackdrop() {
    const backdropEl = document.createElement('div');
    backdropEl.setAttribute('modal-backdrop', this.modalId);
    backdropEl.classList.add(...this.options.backdropClasses.split(' '));
    document.body.append(backdropEl);
  }

  destroyBackdropEl() {
    const backdropEl = document.querySelector(`[modal-backdrop="${this.modalId}"]`);
    if (backdropEl) {
      backdropEl.remove();
    }
  }

  handleOutsideClick(ev, target) {
    const eventTarget = ev.target.id;

    if (eventTarget === target || (eventTarget !== target && ev.target.hasAttribute('modal-backdrop'))) {
      this.closeModal();
    }
  }
}

modals.forEach((triggerEl) => {
  const targetId = triggerEl.dataset.modalTarget;
  const targetEl = document.getElementById(targetId);

  if (targetEl) {
    new Modal(triggerEl, targetEl);
  }
});

export default Modal;
