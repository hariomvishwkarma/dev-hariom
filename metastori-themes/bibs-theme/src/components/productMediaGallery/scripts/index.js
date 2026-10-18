import Swiper from '../../../scripts/vendor/swiper-bundle';

let init = false;
let swiper;

function initMediaGallerySwiper() {
  const mq = window.matchMedia('(min-width: 768px)');
  if (!mq.matches) {
    if (!init) {
      init = true;
      const swiperEls = document.querySelectorAll('.swiper.product-media-gallery-swiper');

      swiperEls.forEach((swiperEl) => {
        const options = JSON.parse(swiperEl.dataset.swiper || {});
        swiper = new Swiper(swiperEl, { ...options });

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
  } else if (init) {
    if (swiper) swiper.destroy();
    init = false;
  }
}

window.addEventListener('load', initMediaGallerySwiper());
window.addEventListener('resize', initMediaGallerySwiper);
