const visitedCart = sessionStorage.getItem('visitedCart');
if (visitedCart) {
  const drawer = document.querySelector('[data-component-id="cart-drawer"]');
  if (drawer) {
    drawer.open();
    sessionStorage.removeItem('visitedCart');
  }
}
