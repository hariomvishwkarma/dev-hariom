
Shopify.functions.updateCart = async function updateCart(lineItemId, quantity) {
  //we need to set a variable in localstorage if the free gift is removed so it does not add the free gift back again
  if (window.theme.freeGift) {
    if (lineItemId == window.theme.freeGift.variantId && quantity == 0) {
      localStorage.setItem('freeGiftRemoved', true);
    }
  }

  try {
    const response = await fetch(`${window.routes.root_url}cart/update.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        updates: {
          [lineItemId]: quantity,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Cart fetch failed: ${response.status} ${response.statusText}`);
    }

    const cart = await response.json();

    return cart;
  } catch (error) {
    console.error(error);
  }
};

const cartForm = document.getElementById('cart-form');
if (cartForm) {
  cartForm.addEventListener('keydown', (e) => {
    var key = e.charCode || e.keyCode || 0;
    if (key == 13) {
      e.preventDefault();
    }
  });
}
