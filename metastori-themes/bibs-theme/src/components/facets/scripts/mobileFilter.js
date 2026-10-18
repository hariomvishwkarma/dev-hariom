const openFilterButton = document.querySelector('#open-filter-mobile');

openFilterButton?.addEventListener('click', function (e) {
  const filterMobile = document.querySelector('#filter');
  filterMobile.classList.toggle('hidden');
  document.body.classList.toggle('overflow-hidden');
});

const closeMobileFilterButtons = document.querySelectorAll('.close-mobile-filter');

for (const closeMobileFilterButton of closeMobileFilterButtons) {
  closeMobileFilterButton?.addEventListener('click', function (e) {
    const filterMobile = document.querySelector('#filter');
    filterMobile.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  });
}
