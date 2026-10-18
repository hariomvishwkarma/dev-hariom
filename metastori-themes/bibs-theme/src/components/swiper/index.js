import Swiper from '../../scripts/vendor/swiper-bundle';

function initSwiper(wrapper = document) {
  const swiperEls = wrapper.querySelectorAll('.swiper:not(swiper-slider):not([thumbsSlider]):not(.product-media-gallery-swiper)');
  swiperEls.forEach((swiperEl) => {
    const options = JSON.parse(swiperEl.dataset.swiper || '{}');
    const swiper = new Swiper(swiperEl, { ...options });

    const zoomEls = swiperEl.querySelectorAll('.image-magnify-click');
    zoomEls.forEach((zoomEl) => {
      zoomEl.addEventListener('mouseover', (e) => {
        swiper.zoom.in();
      });
      zoomEl.addEventListener('mouseout', (e) => {
        swiper.zoom.out();
      });
    });
  });
}

window.addEventListener('load', initSwiper());

['related-products:loaded', 'shopify-wishlist:init-product-grid'].forEach((event) => {
  document.addEventListener(event, (e) => {
    initSwiper(e.detail?.wrapperElement);
  });
});
export default initSwiper;
