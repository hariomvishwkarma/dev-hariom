document.addEventListener('DOMContentLoaded', function () {
  const promoSlider = document.querySelector('.promo_slider');
  if (!promoSlider) return;

  const slides = Array.from(promoSlider.children);
  if (slides.length <= 1) return;

  // Read timing from data attribute (in seconds), convert to ms
  const timingSeconds = parseFloat(promoSlider.dataset.timing);
  const timingMs = timingSeconds * 1000;
  let currentIndex = 0;

  slides.forEach((slide, index) => {
    slide.style.transition = 'opacity 0.3s ease';
    slide.style.position = 'absolute';
    slide.style.inset = '0';
    slide.style.opacity = index === 0 ? '1' : '0';
    slide.style.pointerEvents = index === 0 ? 'auto' : 'none';
  });

  function showNextSlide() {
    const prev = slides[currentIndex];
    currentIndex = (currentIndex + 1) % slides.length;
    const next = slides[currentIndex];

    prev.style.opacity = '0';
    prev.style.pointerEvents = 'none';

    next.style.opacity = '1';
    next.style.pointerEvents = 'auto';
  }

  setInterval(showNextSlide, timingMs);
});