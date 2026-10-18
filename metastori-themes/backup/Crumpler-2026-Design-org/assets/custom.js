document.addEventListener("DOMContentLoaded", function () {

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const popup = document.querySelector('.search-popup-main');

      if (popup) {
        popup.classList.remove('active-search');
      }
    }
  });

  const quickviewWrapper = document.querySelector('.bpp-quickview-product');
  const quickviewItems = document.querySelectorAll('.bpp-quickview-product-item');
  const quickviewOverlay = document.querySelector('.bpp-product-overlay');
  const quickviewClose = document.querySelectorAll('.bpp-quickview_close');

  document.querySelectorAll('.bpp-product-quickview').forEach(btn => {
    btn.addEventListener('click', () => {
      const product_id = btn.dataset.id;
      
      if (!quickviewWrapper) return;

      // Show main wrapper
      quickviewWrapper.classList.add('active_quick');

      // Show the selected product item
      const targetItem = document.querySelector(`.bpp-quickview-product-item[data-id="${product_id}"]`);
      if (targetItem) {
        targetItem.style.display = 'block';
        targetItem.classList.add('active_popup');
        // const targetSwiper = targetItem.querySelector('.bpp-quickview-media')?.swiper;
        // if (targetSwiper) {
        //   targetSwiper.update();
        // }
      }
    });
  });

  if (quickviewOverlay) {
    quickviewOverlay.addEventListener('click', () => {
      quickviewItems.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('active_popup');
      });
      quickviewWrapper.classList.remove('active_quick');
    });
  }


  quickviewClose.forEach(btn => {
    btn.addEventListener('click', () => {
      quickviewItems.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('active_popup');
      });
      quickviewWrapper.classList.remove('active_quick');
    });
  });


document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.bpp-quick-add');
    if(btn){
        const productId = btn.getAttribute('data-id');
        if (!productId) {
            console.error('No data-id found on .bpp-quick-add button');
            return;
        }
        btn.classList.add('loading');
        btn.textContent = 'Adding...';
        try {
            // ✅ Shopify AJAX API call
            const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: productId,
                quantity: 1
            })
            });

            const data = await response.json();

            if (response.ok) {
            console.log('Added to cart:', data);

            // Optional success feedback
            btn.textContent = 'Added!';
            btn.classList.add('added');

            // You can show a popup or update cart count here
            // Example:
            // document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
            } else {
            console.error('Error adding to cart:', data);
            btn.textContent = 'Error!';
            }
        } catch (err) {
            console.error('Cart add failed:', err);
            btn.textContent = 'Error!';
        } finally {
            // Remove loading after a short delay
            setTimeout(() => {
            btn.classList.remove('loading');
            btn.textContent = 'Quick Add';
                quickviewItems.forEach(item => item.style.display = 'none');
                quickviewWrapper.classList.remove('active_quick');
                const this_cartDrawer = document.querySelector('cart-drawer');
                this_cartDrawer.refresh(true);
            }, 1500);
        }
    }

    // const filter_menubtn = e.target.closest('.fillter--menubtn');
    // if(filter_menubtn){
    //   document.querySelector('.header__icon.header__icon--menu').click();
    // }
        
});

    const delivery_dropdown = document.querySelectorAll('.delivery_country_list_dropdown');
    const delivery_tab_selected = document.querySelectorAll('.delivery_tab_selected');
    const delivery_tab_btns = document.querySelectorAll('.delivery_tab_btn');
    const delivery_tab_content_items = document.querySelectorAll('.delivery_tab_content_item');

    /* Dropdown open / close */

    delivery_tab_selected.forEach((btn)=>{
      btn.addEventListener('click', function () {
        const delivery_dp = btn.closest('.delivery_country_list_dropdown');
        delivery_dp.classList.toggle('active_deliveryList');
      });
    });

    if (delivery_tab_btns.length > 0) {
      delivery_tab_btns.forEach(btn => {
        btn.addEventListener('click', function () {

          const country = btn.getAttribute('country_name');
          if (!country) return;

          delivery_tab_content_items.forEach(el => {
            el.classList.remove('active_delivery');
          });

          const activeItem = document.querySelectorAll(
            `.delivery_tab_content_item[country_name="${country}"]`
          );

          activeItem.forEach((el)=>{
            el.classList.add('active_delivery');
          });

          delivery_tab_selected.forEach((btn)=>{
              btn.querySelector('.delivery_tab_selected_text').textContent = country;
          });

          delivery_dropdown.forEach((el)=>{
              el.classList.remove('active_deliveryList');
          });

        });
      });
    }
});

// document.addEventListener('mousemove', function (e) {
//   if (!(e.target instanceof Element)) return;

//   const drawerOverlay = e.target.closest('#CartDrawer-Overlay');
//   if (!drawerOverlay) return;

//   const drawerCursor = document.querySelector('.drawer-close-cursor');
//   if (!drawerCursor) return;

//   drawerCursor.style.left = e.clientX + 'px';
//   drawerCursor.style.top = e.clientY + 'px';
// });

// document.addEventListener('mouseenter', function (e) {
//   if (!(e.target instanceof Element)) return;

//   const drawerOverlay = e.target.closest('#CartDrawer-Overlay');
//   if (!drawerOverlay) return;

//   const drawerCursor = document.querySelector('.drawer-close-cursor');
//   if (drawerCursor) drawerCursor.style.display = 'block';
// }, true);

// document.addEventListener('mouseleave', function (e) {
//   if (!(e.target instanceof Element)) return;

//   const drawerOverlay = e.target.closest('#CartDrawer-Overlay');
//   if (!drawerOverlay) return;

//   const drawerCursor = document.querySelector('.drawer-close-cursor');
//   if (drawerCursor) drawerCursor.style.display = 'none';
// }, true);


