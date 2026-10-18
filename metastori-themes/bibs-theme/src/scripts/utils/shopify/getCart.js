Shopify.functions.getCart = async function getCart() {
  try {
    const response = await fetch(`${window.routes.root_url}cart.js`, {
      headers: {
        'Accept': 'application/json',
      }
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
