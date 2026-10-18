const formBtn = document.querySelector('.product-blocks .add-to-cart-content-wrapper');
const stickyATCBtn = document.querySelector('.sticky_atc');

if (formBtn && stickyATCBtn) {
  function updateVisibility(isVisible) {
    if (isVisible) {
      stickyATCBtn.classList.add('hidden');
    } else {
      stickyATCBtn.classList.remove('hidden');
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      updateVisibility(entry.isIntersecting);
    });
  });
  observer.observe(formBtn);
}
