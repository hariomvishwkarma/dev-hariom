async function replaceShippingUSP() {
  let currentHref = window.location.href
  let USP = document.querySelector(".free-delivery-usp");

  if (!currentHref.includes("/products/") || !USP) return;
  const res = await fetch(currentHref, {
    headers: {
      Accept: "text/html"
    },
    credentials: "same-origin",
  });

  if (!res.ok) {
    throw new Error(`Page fetch failed: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const htmlDoc = new DOMParser().parseFromString(html, "text/html");

  // Update shipping usp
  const sourceUSP = htmlDoc.querySelector(".free-delivery-usp");
  if (USP && sourceUSP) USP.innerHTML = sourceUSP.innerHTML;
}

export default replaceShippingUSP;
