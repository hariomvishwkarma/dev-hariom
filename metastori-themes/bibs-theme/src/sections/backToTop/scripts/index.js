const backToTopBtn = document.querySelector('#back-to-top-btn');

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0');
      backToTopBtn.classList.add('opacity-100');
      backToTopBtn.classList.add('duration-300');
      backToTopBtn.classList.add('transition-opacity');
    } else {
      backToTopBtn.classList.remove('opacity-100');
      backToTopBtn.classList.add('opacity-0');
    }
  });
}