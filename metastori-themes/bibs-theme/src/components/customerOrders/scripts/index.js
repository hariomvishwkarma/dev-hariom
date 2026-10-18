const searchInput = document.querySelector('[name="search_orders"]');
const clearSearchButton = document.querySelector('[data-clear-search]');
const orderIdFields = document.querySelectorAll('[data-order-card-id]');

if (searchInput || clearSearchButton || orderIdFields.length) {

function toggleClearSearchButton() {
  const inputValue = searchInput.value;
  if (!inputValue.trim()) clearSearchButton.hidden = true;
  else clearSearchButton.hidden = false;
}

function clearSearchInput() {
  searchInput.value = '';
}

function displayMathchingOrders(searchInputValue) {
  orderIdFields.forEach(orderIdField => {
    const orderContainer = orderIdField.closest('[data-order-card-container]');
    if (!orderContainer) return;
    orderContainer.hidden = !orderIdField.innerHTML.includes(searchInputValue)
  })
}

searchInput.addEventListener('input', (e) => {
  toggleClearSearchButton();
  displayMathchingOrders(e.target.value);
});

clearSearchButton.addEventListener('click', () => {
  clearSearchInput();
  toggleClearSearchButton();
});
}