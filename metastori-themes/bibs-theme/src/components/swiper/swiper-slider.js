import Swiper from '../../scripts/vendor/swiper-bundle';

if (!customElements.get('swiper-slider')) {
  class SwiperSlider extends HTMLElement {
    constructor() {
      super();
      this.swiperOptions = JSON.parse(this.dataset.swiper || '{}');
      this.swiper = new Swiper(this, { ...this.swiperOptions });
      this.zoomEls = this.querySelectorAll('.image-magnify-click');
    }
    connectedCallback() {
      if (!this.swiper) return;
      this.zoomEls.forEach((zoomEl) => {
        zoomEl.addEventListener('mouseover', (e) => {
          this.swiper.zoom.in();
        });
        zoomEl.addEventListener('mouseout', (e) => {
          this.swiper.zoom.out();
        });
      });
    }
  }
  customElements.define('swiper-slider', SwiperSlider);
}
