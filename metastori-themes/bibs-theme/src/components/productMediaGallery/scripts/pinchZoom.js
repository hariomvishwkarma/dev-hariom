document.addEventListener("DOMContentLoaded", () => {
  let isAnyImageZoomed = false;
  document.addEventListener(
    "touchstart",
    (e) => {
      if (!isAnyImageZoomed && e.touches.length === 1) {
        document.querySelectorAll(".swiper").forEach((swiperEl) => {
          if (swiperEl.swiper) {
            if (swiperEl.swiper._originalTouchRatio === undefined) {
              swiperEl.swiper._originalTouchRatio = swiperEl.swiper.params.touchRatio;
            }
            swiperEl.swiper.params.touchRatio = swiperEl.swiper._originalTouchRatio;
            swiperEl.swiper.params.touchStartPreventDefault = false
          };
        });
      }
    },
    { passive: true },
  )

  const zoomableSlides = document.querySelectorAll(".swiper-slide");
  if (!zoomableSlides.length) return;
  zoomableSlides.forEach((slide) => {
    const image = slide.querySelector("img");
    if (!image) return;
    let currentScale = 1;
    let startDistance = 0;
    let startScale = 1;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let isZooming = false;
    let swiperInstance = null;
    const swiperElement = slide.closest(".swiper");
    if (swiperElement && window.Swiper) {
      swiperInstance = swiperElement.swiper;
    }
    const wrapper = document.createElement("div");
    wrapper.className = "pinch-zoom-wrapper";
    image.parentNode.insertBefore(wrapper, image);
    wrapper.appendChild(image);
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";

    image.style.transition = "transform 0.1s ease-out";
    let lastTap = 0;
    wrapper.classList.add("pinch-zoom-scrollable");
    wrapper.style.touchAction = "pan-y";

    wrapper.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 2) {
          e.stopPropagation();
          e.preventDefault();

          if (swiperInstance) {
            swiperInstance.allowTouchMove = false;
            swiperInstance.allowSlideNext = false;
            swiperInstance.allowSlidePrev = false;
          }

          isZooming = true;
          isAnyImageZoomed = true;
          startDistance = getDistance(e.touches[0], e.touches[1]);
          startScale = currentScale;

          const rect = wrapper.getBoundingClientRect();
          const touch1X = e.touches[0].clientX - rect.left;
          const touch1Y = e.touches[0].clientY - rect.top;
          const touch2X = e.touches[1].clientX - rect.left;
          const touch2Y = e.touches[1].clientY - rect.top;

          const centerX = (touch1X + touch2X) / 2;
          const centerY = (touch1Y + touch2Y) / 2;

          const originXPercent = (centerX / rect.width) * 100;
          const originYPercent = (centerY / rect.height) * 100;
          image.style.transformOrigin = `${originXPercent}% ${originYPercent}%`;
        } else if (e.touches.length === 1 && currentScale > 1) {
          e.stopPropagation();
          e.preventDefault();

          startX = e.touches[0].pageX - translateX;
          startY = e.touches[0].pageY - translateY;
        }
      },
      { passive: false },
    )

    wrapper.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 2 && isZooming) {
          e.stopPropagation();
          e.preventDefault();
          const currentDistance = getDistance(e.touches[0], e.touches[1]);
          const newScale = Math.min(Math.max(startScale * (currentDistance / startDistance), 1), 4);
          if (Math.abs(newScale - currentScale) > 0.01) {
            currentScale = newScale;
            applyTransform();
          }
        } else if (e.touches.length === 1 && currentScale > 1) {
          e.stopPropagation();
          e.preventDefault();

          translateX = e.touches[0].pageX - startX;
          translateY = e.touches[0].pageY - startY;

          const rect = wrapper.getBoundingClientRect();
          const scaledWidth = rect.width * currentScale;
          const scaledHeight = rect.height * currentScale;

          const maxTranslateX = Math.max(0, (scaledWidth - rect.width) / 2);
          const maxTranslateY = Math.max(0, (scaledHeight - rect.height) / 2);

          translateX = Math.max(Math.min(translateX, maxTranslateX), -maxTranslateX);
          translateY = Math.max(Math.min(translateY, maxTranslateY), -maxTranslateY);

          applyTransform();
        }
      },
      { passive: false },
    )

    wrapper.addEventListener(
      "touchend",
      (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < 300 && tapLength > 0 && e.touches.length === 0) {
          resetZoom();
          e.preventDefault();
        }

        lastTap = currentTime;

        if (isZooming && e.touches.length < 2) {
          isZooming = false;

          if (currentScale > 1) {
            if (swiperInstance) {
              swiperInstance.allowTouchMove = false;
              swiperInstance.allowSlideNext = false;
              swiperInstance.allowSlidePrev = false;
            }
            isAnyImageZoomed = true;
          } else {
            if (swiperInstance) {
              swiperInstance.allowTouchMove = true;
              swiperInstance.allowSlideNext = true;
              swiperInstance.allowSlidePrev = true;
            }
            isAnyImageZoomed = false;
          }
        }

        if (e.touches.length === 0 && currentScale === 1) {
          if (swiperInstance) {
            swiperInstance.allowTouchMove = true;
            swiperInstance.allowSlideNext = true;
            swiperInstance.allowSlidePrev = true;
          }
          isAnyImageZoomed = false;
        }
      },
      { passive: false },
    )
    wrapper.addEventListener(
      "touchcancel",
      () => {
        isZooming = false;

        if (currentScale === 1) {
          isAnyImageZoomed = false;
          if (swiperInstance) {
            swiperInstance.allowTouchMove = true;
            swiperInstance.allowSlideNext = true;
            swiperInstance.allowSlidePrev = true;
          }
        }
      },
      { passive: false },
    )

    image.addEventListener("transitionend", () => {
      if (currentScale === 1 && swiperInstance) {
        swiperInstance.allowTouchMove = true;
        swiperInstance.allowSlideNext = true;
        swiperInstance.allowSlidePrev = true;
        isAnyImageZoomed = false;
      }
    });

    function getDistance(touch1, touch2) {
      const dx = touch1.pageX - touch2.pageX;
      const dy = touch1.pageY - touch2.pageY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function applyTransform() {
      image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    }

    function resetZoom() {
      currentScale = 1;
      translateX = 0;
      translateY = 0;
      isZooming = false;
      isAnyImageZoomed = false;
      applyTransform();

      if (swiperInstance) {
        swiperInstance.allowTouchMove = true;
        swiperInstance.allowSlideNext = true;
        swiperInstance.allowSlidePrev = true;
      }
    }
  });
});
