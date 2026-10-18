const faq = document.querySelectorAll('.faq__title');

faq?.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    item.parentElement.querySelector('ul').classList.toggle('hidden');
    item.parentElement.querySelector('.faq__icon-plus').classList.toggle('hidden');
    item.parentElement.querySelector('.faq__icon-minus').classList.toggle('hidden');
  });
});

const faqSearch = document.getElementById('faq-search');

faqSearch?.addEventListener('input', (e) => {
  const searchKey = e.target.value.toLowerCase();

  for (const entry of faq) {
    const entries = entry.parentElement.querySelector('ul');
    entries?.classList.add('hidden');

    const includesKeyword = entries?.textContent.toLowerCase().includes(searchKey);

    if (searchKey && includesKeyword) {
      entries.classList.remove('hidden');
    }
  }
});

const faqCountrySelector = document.querySelectorAll('.faq-country-selector');

for (const selector of faqCountrySelector) {
  selector.addEventListener('change', (e) => {
    const selectedCountry = e.target.value;

    //set value of all selectors to the selected value
    const allSelectors = document.querySelectorAll('.faq-country-selector');
    for (const selector of allSelectors) {
      selector.value = selectedCountry;
    }

    const allContent = document.querySelectorAll('.faq__country');
    for (const content of allContent) {
      content.classList.add('hidden');
    }

    const countryContent = document.querySelectorAll(`.faq__country-${selectedCountry}`);
    for (const country of countryContent) {
      country.classList.remove('hidden');
    }
  });
}
