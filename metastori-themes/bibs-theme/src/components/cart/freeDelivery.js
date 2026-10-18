async function freeDelivery() {
  if (!document.querySelector('.free-delivery-cart-bar') || !document.querySelector('.free-delivery-cart-bar__text.empty')) return;
  let freeGiftLimit = false;
  let isFreeGiftRemoved = false;
  let giftId = false;
  let giftVariantId = false;

  if (window.theme.freeGift) {
    giftId = window.theme.freeGift.variantId;
    giftVariantId = window.theme.freeGift.id;
    freeGiftLimit = window.theme.freeGift.limit;
    isFreeGiftRemoved = localStorage.getItem('freeGiftRemoved');
  }
  if (!freeGiftLimit || !giftVariantId || !giftId) return;

  if (isFreeGiftRemoved) {
    localStorage.removeItem('freeGiftRemoved');
    return;
  }

  let items = document.querySelectorAll('#cart-form div[data-tracking-cart-item]');

  let cart_total = 0;
  if (document.querySelector('.drawer_cart__footer')) {
    if (document.querySelector('.drawer_cart__footer').dataset.cartTotal) {
      cart_total = parseFloat(document.querySelector('.drawer_cart__footer').dataset?.cartTotal);
    }
  }

  let hasGift = false;
  let gift_price = 0;
  items.forEach((item) => {
    const variantId = item.dataset.id;
    const variantPrice = item.dataset.price;
    if (variantId && giftVariantId) {
      if (variantId == giftVariantId) {
        hasGift = true;
        gift_price = variantPrice;
      }
    }
  });

  const totalCartWithoutGift = cart_total - gift_price;

  const hasReachedFreeGiftLimit = totalCartWithoutGift > freeGiftLimit;
  if (hasReachedFreeGiftLimit && !hasGift) {
    await Shopify.functions.updateCart(giftId, 1);
  }

  const hasNotReachedFreeGiftLimit = totalCartWithoutGift <= freeGiftLimit;
  if (hasNotReachedFreeGiftLimit && hasGift) {
    await Shopify.functions.updateCart(giftId, 0);
  }
  return true;
}

freeDelivery();
export default freeDelivery;
