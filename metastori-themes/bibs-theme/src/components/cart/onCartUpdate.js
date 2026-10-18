import replaceCartContent from './replaceCartContent';

const cartElement = document.getElementById('cart');
const cartDrawerElement = document.getElementById('cart-drawer');

function onCartUpdate() {
  const cartTriggers = document.querySelectorAll('.update-cart');
  const cartDrawer = document.getElementById('cart-drawer');
  if (!cartDrawer) return;

  cartTriggers.forEach(async (trigger) => {
    const lineItemId = trigger.dataset.lineItemId;
    const quantity = trigger.dataset.quantity;
    trigger.addEventListener('click', async (event) => {
      event.preventDefault();
      await Shopify.functions.updateCart(lineItemId, quantity);
      await replaceCartContent();
    });
  });
}

if (cartElement || cartDrawerElement) {
  onCartUpdate();
}

export default onCartUpdate;
