import Swiper from '../../../scripts/vendor/swiper-bundle';

let init = false;
let swiper;
function initMediaGallerySwiper() {
  const mq = window.matchMedia('(min-width: 1024px)');
  const isSubscriptionCollection = document.body.classList.contains('template-collection-subscription');
  if (isSubscriptionCollection) {
    initSwiper();
  } else {
    if (!mq.matches) {
      if (!init) {
        init = true;
        initSwiper();
      }
    } else if (init) {
      if (swiper) swiper.destroy();
      init = false;
    }
  }
}

function initSwiper() {
  const swiperEls = document.querySelectorAll('.swiper.quick-view-gallery-swiper-wrapper');

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

document.addEventListener('quick-view:open', () => {
  initMediaGallerySwiper();
});
window.addEventListener('resize', initMediaGallerySwiper);
