import acceptTerms from './acceptTerms';
import freeDelivery from './freeDelivery';
import onCartUpdate from './onCartUpdate';
import replaceShippingUSP from './replaceShippingUSP';

async function replaceCartContent() {
  const url = `${window.routes.root_url}cart`;

  const fetchDoc = async () => {
    const res = await fetch(url, {
      headers: { Accept: "text/html" },
      credentials: "same-origin",
    });
    if (!res.ok) throw new Error(`Cart page fetch failed: ${res.status} ${res.statusText}`);
    const html = await res.text();
    return new DOMParser().parseFromString(html, "text/html");
  };

  const htmlDoc = await fetchDoc();

  // Update cart page
  const destinationCartEl = document.getElementById("cart");
  const sourceCartEl = htmlDoc.getElementById("cart");
  if (destinationCartEl && sourceCartEl) destinationCartEl.innerHTML = sourceCartEl.innerHTML;

  // Update cart drawer
  const destinationCartDrawerEl = document.querySelector("#cart-drawer .drawer-content-wrapper");
  const sourceCartDrawerEl = htmlDoc.querySelector("#cart-drawer .drawer-content-wrapper");
  if (destinationCartDrawerEl && sourceCartDrawerEl) {
    destinationCartDrawerEl.innerHTML = sourceCartDrawerEl.innerHTML;
  }

  // Update cart count in header
  const destinationCartCountEl = document.querySelector(".text-cart_count");
  const sourceCartCountEl = htmlDoc.querySelector(".text-cart_count");
  if (destinationCartCountEl && sourceCartCountEl) {
    destinationCartCountEl.replaceWith(sourceCartCountEl);
  }

  // Check for free gift and repaint the cart again
  await freeDelivery();

  const htmlDocAfterDelivery = await fetchDoc();
  const destinationCartDrawerElAfterDelivery = document.querySelector("#cart-drawer .drawer-content-wrapper");
  const sourceCartDrawerElAfterDelivery = htmlDocAfterDelivery.querySelector("#cart-drawer .drawer-content-wrapper");
  if (destinationCartDrawerElAfterDelivery && sourceCartDrawerElAfterDelivery) {
    destinationCartDrawerElAfterDelivery.innerHTML = sourceCartDrawerElAfterDelivery.innerHTML;
  }

  onCartUpdate();
  acceptTerms();
  replaceShippingUSP();
}

export default replaceCartContent;
