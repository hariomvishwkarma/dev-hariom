const showEditAddressButtons = document.querySelectorAll('[data-show-edit-address-content]');
const showMainAddressButtons = document.querySelectorAll('[data-show-main-address-content]');
const defaultAddressRadioBtns = document.querySelectorAll('input[type="radio"][name="address[default]"]');
const deleteCustomerAddressBtns = document.querySelectorAll('[data-delete-customer-address]');
const mainContent = document.querySelector('[data-addresses-main-content]');

if (!mainContent) return 

function deleteAddress(target) {
  if (Shopify && target && target.dataset && target.dataset.target) {
    Shopify.postLink(target.dataset.target, {
      parameters: { _method: 'delete' },
    });
  }
}

defaultAddressRadioBtns?.forEach((rb) => {
  rb.addEventListener('change', (event) => {
    defaultAddressRadioBtns.forEach((radioButton) => {
      radioButton.checked = radioButton === event.target;
    });
  });
});

function toggleElementVisibility(element, isVisible) {
  element.classList.toggle('hidden', !isVisible);
  element.classList.toggle('md:flex', isVisible);
}

function showEditAddressContent(el) {
  const editContent = document.querySelector(`[${el.dataset.toggleSection}]`);
  if (!editContent) return;
  toggleElementVisibility(mainContent, false);
  toggleElementVisibility(editContent, true);
}

function showMainAddressContent(el) {
  const editContent = document.querySelector(`[${el.dataset.toggleSection}]`);
  if (!editContent) return;
  toggleElementVisibility(mainContent, true);
  toggleElementVisibility(editContent, false);
}

showEditAddressButtons?.forEach(button => {
  button.addEventListener('click', function (e) {
    showEditAddressContent(this);
  });
})

showMainAddressButtons?.forEach(button => {
  button.addEventListener('click', function (e) {
    showMainAddressContent(this);
  });
})

deleteCustomerAddressBtns.forEach(button => {
  button.addEventListener('click', function (e) {
    deleteAddress(this);
  });
})