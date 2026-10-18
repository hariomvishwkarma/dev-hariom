const cartDrawer = document.querySelector('[data-component-id="store-availability-drawer"]');
const grindingService = document.querySelector('[data-component-id="product-add-on"]');
const collapse = document.querySelector('[data-collapse]');
const productFormSection = document.querySelector('.section-product-form');

if (cartDrawer && grindingService && productFormSection) {

function mutationCallback(mutationRecords) {
  const isCartDrawerOpen = cartDrawer.hasAttribute('data-drawer-open');
  const isGrindingServiceOpen = grindingService.hasAttribute('data-drawer-open');


  if (isCartDrawerOpen || isGrindingServiceOpen) {
    productFormSection?.classList.remove('z-5');
    productFormSection?.classList.add('z-10');
  } else {
    // waiting for the close cart drawer animation to complete
    setTimeout(() => { 
      productFormSection?.classList.remove('z-10') 
      productFormSection?.classList.add('z-5') 
    }, 400);
  }
}

let observerCartDrawer = new MutationObserver(mutationCallback);
let observerGrindingService = new MutationObserver(mutationCallback)

const observerConfig = {
  attributes: true,  
  attributeFilter: ['data-drawer-open']
};

observerCartDrawer.observe(cartDrawer, observerConfig);
observerGrindingService.observe(grindingService, observerConfig);
}
