window.refreshCart = () => {
  fetch(`/cart?section_id=cart-drawer`)
    .then((response) => response.text())
    .then((responseText) => {
      const html = new DOMParser().parseFromString(responseText, "text/html");
      console.log("html:", html);
      const count = parseInt(
        html.querySelector("cart-drawer-items")?.getAttribute("item_count") ||
          "0",
        10
      );
      //console.log("count:", count);
      const selectors = [
        ".cart-drawer-new"
      ];
      const cartDrawer = document.querySelector("cart-drawer");
      if (cartDrawer) {
        if (count > 0) {
          cartDrawer.classList.remove("is-empty");
          document.querySelectorAll(".cart-count-bubble").forEach((bubble) => {
            bubble.classList.remove("hidden");
          });
        } else {
          cartDrawer.classList.add("is-empty");
          document.querySelectorAll(".cart-count-bubble").forEach((bubble) => {
            bubble.classList.add("hidden");
          });
        }
      }
      //console.log(cartDrawer, selectors);
      for (const selector of selectors) {
        const targetElement = document.querySelector(selector);
        const sourceElement = html.querySelector(selector);
        // console.log(
        //   { targetElement, sourceElement, selector },
        //   "<<<sourceElement"
        // );

          if (targetElement && sourceElement) {
            targetElement.replaceWith(sourceElement);
          }
        
      }
      document
        .querySelectorAll(".cart-count-bubble span:first-child")
        .forEach((bubble) => {
          bubble.textContent = count;
        });
      const totalItemElement = document.querySelector(".ttl_item");
      if (totalItemElement) {
        totalItemElement.textContent = count;
      }
      $(".cart-drawer-main").addClass('drawer-open');
      $("body").addClass('body_stick');
      try {
      } catch (err) {
        console.error("Error updating widgets:", err);
      }
    })
    .catch((error) => {
      console.error("Error refreshing cart:", error);
    })
    .finally(()=>{
      if (typeof renderApplied === "function") {
        renderApplied();
      }
    });
};

document.addEventListener("ajaxProduct:added", function () {
    if (typeof window.refreshCart === "function") {
        window.refreshCart();
    }
    setTimeout(function(){
      cart_drawer_upsell();
      progressBar();
    },500);
});

$(document).on('click', '.cart-drawer__overlay, .drawer__close', function () {
    $(".cart-drawer-main").removeClass('drawer-open');
    $("body").removeClass('body_stick');
});
$(document).on('click', '#DrawerCartTrigger', function () {
    $(".cart-drawer-main").addClass('drawer-open');
    $("body").addClass('body_stick');
});

function updateCartQuantity($input, newQty) {
  const current_id = $input.attr('data-id');
  let updates = { [current_id]: newQty };
  fetch(window.Shopify.routes.root + 'cart/update.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ updates })
  })
    .then(response => response.json())
    .then(data => {
      document.dispatchEvent(new CustomEvent('ajaxProduct:added', { detail: {} }));
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Plus / Minus buttons
$(document).on('click', '.drawer-qty__adjust--plus, .drawer-qty__adjust--minus', function () {
  const $input = $(this).closest('.js-qty__wrapper').find('.js-qty__num');
  let current_qty = parseInt($input.val()) || 1;

  if ($(this).hasClass('drawer-qty__adjust--plus')) {
    current_qty += 1;
  } else if ($(this).hasClass('drawer-qty__adjust--minus')) {
    current_qty = current_qty - 1;
  }
  updateCartQuantity($input, current_qty);
});

// Manual input change
$(document).on('change', '.cart_drawer_qty', function () {
  const $input = $(this);
  let current_qty = parseInt($input.val()) || 1;
  current_qty = current_qty < 1 ? 1 : current_qty;

  updateCartQuantity($input, current_qty);
});



$(document).on('click', '.cart_upsell_atc', function () {
      $(this).addClass('btn--loading active_atc');
      var product_id  = parseInt($(this).attr('product_id'));
      const items = [{ id: product_id, quantity: 1 }];
      fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items })
      })
      .then(response => response.json())
      .then(data => {
          document.dispatchEvent(new CustomEvent("ajaxProduct:added", {
              detail: {}
          }));
      })
      .catch(error => {
          console.error("Error:", error);
      });
});

//----------------------- Shipping and Product Progress Bar ----------------------
document.addEventListener('cart:updated', function() {
  console.log('cart:updated');
  setTimeout(function(){
    progressBar();
  },500);
});

function addfree_product(product_id){
  fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product_id, quantity: 1 })
  })
  .then(response => response.json())
  .then(data => {
      document.dispatchEvent(new CustomEvent('ajaxProduct:added', { detail: {} }));
  })
  .catch(error => {
      console.error("Error adding free product to cart:", error);
  });
}

function remove_freeproduct(product_id){
  var product_ = parseInt(product_id);
  let updates = { [product_]: 0 };
  fetch(window.Shopify.routes.root + 'cart/update.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ updates })
  })
  .then(response => response.json())
  .then(data => {
    document.dispatchEvent(new CustomEvent('ajaxProduct:added', { detail: {} }));
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


function progressBar() {
    const progressBarMain = document.querySelector('.progress_bar_main');
    if (!progressBarMain) return;

    const freeproduct_threshold = parseInt(progressBarMain.getAttribute('freeproduct_threshold'), 10);
    const free_product_id = parseInt(progressBarMain.getAttribute('free_product_id'), 10) || 0;
    const free_product_available = progressBarMain.getAttribute('free_product_available');
    const excluded_products = progressBarMain.getAttribute('excluded_products')?.split(',').map(id => parseInt(id, 10)) || [];

    if (!freeproduct_threshold || !free_product_id || free_product_available !== 'true') return;

    fetch('/cart.js', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(cart => {
        const cartTotal = cart.items.reduce((total, item) => {
            if (!excluded_products.includes(item.product_id)) {
                return total + (item.final_price * item.quantity);
               
            }
            return total;
        }, 0);
        console.log('total😅',cartTotal)
        const hasFreeProduct = cart.items.some(item => item.id === free_product_id);

        if (hasFreeProduct && cartTotal < freeproduct_threshold) {
            remove_freeproduct(free_product_id);
        } else if (!hasFreeProduct && cartTotal > freeproduct_threshold) {
            addfree_product(free_product_id);
        }
    })
    .catch(error => {
        console.error('Error fetching cart data:', error);
    });
}

function cart_drawer_upsell() {
  setTimeout(function() {
    const cartUpsellMain = document.querySelector('.cart_upsell_main');
    const cartUpsellList = document.querySelector('.cart_upsell_list');
    if (cartUpsellMain && cartUpsellList) {
      cartUpsellMain.style.display = 'block';
      requestAnimationFrame(() => {
        const flkty = new Flickity(cartUpsellList, {
          cellAlign: 'left',
          contain: true,
          pageDots: false,
          prevNextButtons: false,
          groupCells: 1,
          wrapAround: false
        });
      });
    }
  }, 1000);
}
cart_drawer_upsell();

