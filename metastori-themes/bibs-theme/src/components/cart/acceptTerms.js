function acceptTerms() {
  const cartElement = document.getElementById('cart-form');

  cartElement?.addEventListener('submit', async function (event) {

    // const isTermsElement = cartElement.querySelector('#terms-and-conditions');

    // const isTermsChecked = isTermsElement?.checked;
    // if (!isTermsChecked) {
    //   event.preventDefault();
    //   alert(window.cartStrings.acceptTerms || 'Please accept the terms and conditions');
    //   return false;
    // }

    // Keeping for future reference
    const cart = await Shopify.functions.getCart();
    // const sellingPlanItems = cart.items.reduce((total, item) => {
    //   return total + (item.selling_plan_allocation ? item.quantity : 0);
    // }, 0);

    // To disable checkout if subscription items are less than 3
    const subscriptionItems = cart.items.filter((item) => item.selling_plan_allocation);
    const subscriptionItemsQuantity = subscriptionItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    if (subscriptionItems.length > 0 && subscriptionItemsQuantity < 3) {
      event.preventDefault();
      return;
    }
  });
}
acceptTerms();

export default acceptTerms;
