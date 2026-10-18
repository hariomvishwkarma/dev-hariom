const addOn = document.querySelector('[data-component-id="product-add-on"]');
const productForm = document.querySelector('.product-form');

if (addOn && productForm) {

const addOnHeading = document.querySelector('[data-add-on-heading]');
const addOnTriggerContainer = addOn.querySelector('[data-drawer-target="product-add-on"]');
const addOnTriggerEmpty = addOnTriggerContainer?.cloneNode(true);
const addOnDrawer = addOn.querySelector('#product-add-on');
const closeDrawerButton = addOnDrawer?.querySelector('[data-drawer-close]');
const plusAddOnIcons =  addOnDrawer?.querySelectorAll('.icon-plus');
let timeoutID;

if (addOnTriggerContainer && addOnDrawer && plusAddOnIcons) {

function unselectAddOns() {
  plusAddOnIcons?.forEach(plusIcon => {
    const successIcon = plusIcon.nextElementSibling;
    plusIcon?.classList.remove('hidden');
    successIcon?.classList.add('hidden');
  })
}

function selectAddOn() {
  const selectedAddOn = this.closest('summary'); 
  const selectedPrice = selectedAddOn.querySelector('[data-add-on-price] :not(del) .price-item')?.innerText;
  const plusIcon = selectedAddOn.querySelector('.icon-plus');
  const successIcon = selectedAddOn.querySelector('.icon-success');

  if (!selectedAddOn || !plusIcon || !successIcon) return;

  const isAlreadySelected = !successIcon.classList.contains('hidden')
  if (isAlreadySelected) return;

  unselectAddOns();

  // select add-on
  plusIcon.classList.add('hidden');
  successIcon.classList.remove('hidden');

  // update the content of add-on drawer trigger with the selected add-on
  const selectedAddOnClone = selectedAddOn.cloneNode(true);
  addOnTriggerContainer.innerHTML = selectedAddOnClone.outerHTML;

  const triggerShowDetailsButton = addOnTriggerContainer?.querySelector(' [data-show-details-button]');
  const triggerPlusButton = addOnTriggerContainer?.querySelector('[data-add-on-button]');
  const triggerTrashButton = addOnTriggerContainer?.querySelector('[data-add-on-remove-button]');
  const triggerPrice = addOnTriggerContainer?.querySelector('[data-add-on-price]');

  // remove prev and insert a new price
  if (selectedPrice && addOnHeading) {
    addOnHeading?.querySelector('[data-add-on-total]')?.remove();
    addOnHeading?.insertAdjacentHTML('beforeend', `<span data-add-on-total>+ ${ selectedPrice }</span>`);
  }

  triggerShowDetailsButton?.remove();
  triggerPrice?.remove();

  triggerPlusButton?.classList.add('hidden');
  triggerTrashButton?.classList.remove('hidden');

  triggerTrashButton?.addEventListener('click', (e) => {
    e.stopPropagation();

    const chosenAddOn = productForm?.querySelector('[data-addon-inputs]');
    chosenAddOn?.remove();

    addOnTriggerContainer.innerHTML = addOnTriggerEmpty.innerHTML;
    unselectAddOns();
  });

  // enable chosen addon inputs to add to cart and append to form
  const addOnInputsContainer = addOnTriggerContainer?.querySelector('[data-addon-inputs]');
  const addOnInputs = addOnInputsContainer?.querySelectorAll('input');
  addOnInputs?.forEach(addOnInput => {
    addOnInput.removeAttribute('disabled');
  })

  if (addOnInputsContainer) productForm?.appendChild(addOnInputsContainer);

  // close the drawer after 3 seconds
  if (timeoutID) clearTimeout(timeoutID);
  timeoutID = setTimeout(() => closeDrawerButton?.click(), 3000);
}

plusAddOnIcons.forEach(plusAddOnIcon => {
  const plusAddOnButton = plusAddOnIcon.closest('button');
  plusAddOnButton?.addEventListener('click', selectAddOn);
})
}
}