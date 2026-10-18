const accordions = document.querySelectorAll('.accordion-header');

const toggleAccordion = (target) => {
  target.parentNode.classList.toggle("active")
}

accordions.forEach(accordion => {
  accordion.addEventListener('click', (e) => {
    toggleAccordion(e.target)
  })
})
