const labels = document.getElementsByClassName('filter__label');

for (const label of labels) {
  label.addEventListener('click', function (element) {
    const parent = element.target.closest('.filter-types');
    const content = parent.querySelector('.filter__content');
    parent.classList.toggle('filter--open');
    content.classList.toggle('hidden');
  });
}
