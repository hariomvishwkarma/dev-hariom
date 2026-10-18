document.addEventListener('DOMContentLoaded', function () {

  // Helper to read either data-vairant-id (typo) or data-variant-id
  function readVariantIdFromEl(el) {
    return el && (el.getAttribute('data-vairant-id') || el.getAttribute('data-variant-id'));
  }

  function updateSubscriptionBlocks(productEl, selectedVariantId) {
    const blocks = productEl.querySelectorAll(".variant_selling_plan-wrapper");
    blocks.forEach(block => {
      const blockVariantId = block.dataset.variantId || block.getAttribute("data-variant-id");
      if (String(blockVariantId) === String(selectedVariantId)) {
        block.classList.remove("hidden");
        block.classList.add("block");
      } else {
        block.classList.remove("block");
        block.classList.add("hidden");
      }
    });
  }

  // Loop through all featured products
  document.querySelectorAll('.featured-product').forEach(productEl => {
    const form = productEl.querySelector('form');
    const variantInput = form ? form.querySelector('.product-vairant-id-pass') : null;
    const sellingPlanInput = form ? form.querySelector('.selected-selling-plan-id') : null;
    const sellingPlanWrappers = Array.from(productEl.querySelectorAll('.variant_selling_plan-wrapper'));

    function syncVariantState() {
      const checkedRadio = productEl.querySelector('input[type="radio"][data-vairant-id]:checked, input[type="radio"][data-variant-id]:checked');
      const vid = readVariantIdFromEl(checkedRadio) || null;

      if (vid && variantInput) {
        variantInput.value = vid;
      }

      // Update subscription blocks visibility
      if (vid) updateSubscriptionBlocks(productEl, vid);

      // update selling_plan hidden input from the visible selector (if any)
      if (sellingPlanInput) {
        const activeSelect = productEl.querySelector('.variant_selling_plan-wrapper:not(.hidden) select.widget-sp-selector, .variant_selling_plan-wrapper.block select.widget-sp-selector');
        sellingPlanInput.value = activeSelect ? activeSelect.value : '';
      }
    }

    // Initial sync on load
    syncVariantState();

    // When radio changes
    productEl.addEventListener('change', function (e) {
      if (e.target && (e.target.matches('input[type="radio"][data-vairant-id]') || e.target.matches('input[type="radio"][data-variant-id]'))) {
        setTimeout(syncVariantState, 0);
      }

      // When selling plan select changes
      if (e.target && e.target.matches('select.widget-sp-selector')) {
        if (sellingPlanInput) sellingPlanInput.value = e.target.value;

        // Also update variant id in hidden input if select has data-variant-id
        const variantId = e.target.options[e.target.selectedIndex].dataset.variant || e.target.options[e.target.selectedIndex].dataset.vairant;
        if (variantId && variantInput) {
          variantInput.value = variantId;
          updateSubscriptionBlocks(productEl, variantId);
        }

        const selectedOption = e.target.options[e.target.selectedIndex];
        const price = selectedOption.dataset.price;
        const discountPriceEl = productEl.querySelector('.discount-price');

        if (discountPriceEl && price) {
          const regularPrice = discountPriceEl.dataset.regularPrice; // e.g. "239.20 kr"
          const formattedPrice = price.replace(',', '.');

          if (regularPrice && regularPrice === formattedPrice) {
            // Prices are the same → clear text and add class
            discountPriceEl.textContent = '';
            discountPriceEl.classList.add('same-price');
          } else {
            // Prices differ → show discounted price and remove class
            discountPriceEl.textContent = formattedPrice;
            discountPriceEl.classList.remove('same-price');
          }
        }
      }
    });

    // Handle label clicks
    productEl.addEventListener('click', function (e) {
      const label = e.target.closest('label');
      if (!label) return;
      const forAttr = label.getAttribute('for');
      if (forAttr) setTimeout(syncVariantState, 0);
    });

    // MutationObserver for programmatic changes
    const mo = new MutationObserver((mutations) => {
      let shouldSync = false;
      for (const m of mutations) {
        if (m.type === 'attributes' && (m.attributeName === 'checked' || m.attributeName === 'class' || m.attributeName === 'value')) {
          shouldSync = true;
          break;
        }
      }
      if (shouldSync) syncVariantState();
    });
    productEl.querySelectorAll('input[type="radio"][data-vairant-id], input[type="radio"][data-variant-id]').forEach(r => mo.observe(r, { attributes: true }));
    window.addEventListener('unload', () => mo.disconnect());

    // Update variant select labels & hidden input
    productEl.querySelectorAll(".variant-select select, .selling-plan-container select").forEach(select => {
      // Initial update
      let header = select.closest(".variant-select")?.querySelector(".selector-header");
      let selectedValueSpan = header ? header.querySelector(".selected-value") : null;
      if (selectedValueSpan) selectedValueSpan.textContent = select.options[select.selectedIndex].text;

      const variantId = select.options[select.selectedIndex].dataset.variant || select.options[select.selectedIndex].dataset.vairant;
      if (variantId && variantInput) {
        variantInput.value = variantId;
        updateSubscriptionBlocks(productEl, variantId);
      }

      // On change
      select.addEventListener("change", function() {
        if (selectedValueSpan) selectedValueSpan.textContent = this.options[this.selectedIndex].text;

        const variantId = this.options[this.selectedIndex].dataset.variant || this.options[this.selectedIndex].dataset.vairant;
        if (variantId && variantInput) {
          variantInput.value = variantId;
          updateSubscriptionBlocks(productEl, variantId);
        }
      });
    });

  });

});


document.addEventListener('DOMContentLoaded', function () {
  const breakpoint = 1024; // mobile threshold

  const wrappers = Array.from(document.querySelectorAll('.info-wrapper'));

  wrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector('.trigger-label');
    const info = wrapper.querySelector('.information-details');

    // Initially hide info for mobile
    if (window.innerWidth < breakpoint) {
      info.style.display = 'none';
    }

    // Toggle info on trigger click
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth >= breakpoint) return;
      e.stopPropagation(); // prevent triggering document click

      // Hide all other info blocks
      wrappers.forEach(w => {
        if (w !== wrapper) {
          const otherInfo = w.querySelector('.information-details');
          otherInfo.style.display = 'none';
        }
      });

      // Toggle this block
      info.style.display = info.style.display === 'block' ? 'none' : 'block';
    });

    // Click outside to hide info
    document.addEventListener('click', function (e) {
      if (window.innerWidth >= breakpoint) return;
      if (!wrapper.contains(e.target)) {
        info.style.display = 'none';
      }
    });

    // Handle window resize to reset display
    window.addEventListener('resize', function () {
      if (window.innerWidth >= breakpoint) {
        info.style.display = ''; // restore default for desktop
      } else {
        info.style.display = 'none'; // hide on mobile
      }
    });
  });
});



// Function to initialize Swiper sliders (for mobile/tablet)
function initMobileSwipers() {
  // Only run if screen width is 899px or less
  if (window.innerWidth > 899) {
    return;
  }

  // Find all .mobile-swiper containers that haven't been initialized yet
  document.querySelectorAll('.mobile-swiper:not(.swiper-initialized)').forEach(swiperEl => {
    // Mark as initialized to avoid double-init
    swiperEl.classList.add('swiper-initialized');

    // Find pagination inside the same container (optional but clean)
    const paginationEl = swiperEl.closest('.swiper-container')?.querySelector('.swiper-pagination') ||
                         swiperEl.parentElement?.querySelector('.swiper-pagination') ||
                         swiperEl.querySelector('.swiper-pagination');

    new Swiper(swiperEl, {
      spaceBetween: 24,
      slidesPerView: 1.03,
      pagination: paginationEl ? {
        el: paginationEl,
        clickable: true
      } : false,
      breakpoints: {
        700: {
          slidesPerView: 2,
          spaceBetween: 26,
        }
      }
    });
  });
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  initMobileSwipers();
});

// Also re-check on window resize (optional but recommended for responsiveness)
let resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initMobileSwipers, 250); // debounce
});