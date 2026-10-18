// const formOptionSelectorLength = document.querySelectorAll('.product-form__option-selector').length;

// if (formOptionSelectorLength > 1) {
//   document.querySelectorAll('.product-form__option-selector input[type="radio"]').forEach( inputElement => {
//     inputElement.addEventListener( 'change', () => {
//       if (inputElement.name !== `option${formOptionSelectorLength}`) {

//         const optionSelectorArray = [...document.querySelectorAll('.product-form__option-selector input[type="radio"]:checked')];

//         const optionSelectedArray = optionSelectorArray.map( optionSelectedItem => {
//           if (optionSelectedItem.name !== `option${formOptionSelectorLength}`) {
//             return optionSelectedItem.value;
//           }
//         });

//         document.querySelectorAll(`.product-form__option-selector input[name="option${formOptionSelectorLength}"]`).forEach( inputLastElement => {
//           optionSelectedArray[optionSelectedArray.length - 1] = inputLastElement.value;
//           const variantTitle = optionSelectedArray.join(' / ');
          
//           const inputLabel = inputLastElement.parentElement.querySelector('label');
//           const discountLabelSelector = inputLastElement.parentElement.querySelector('.block-swatch__discount-label');
//           const discountSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="23" viewBox="0 0 46 23" fill="none"><path d="M1.82178 0L46 3.91L40.3069 13.11L44.1782 23L0 18.86L5.69307 9.66L1.82178 0Z" fill="#35907E"></path></svg>';
          
//           if (discountLabelSelector) discountLabelSelector.remove();
          
//           variants.forEach( variant => {
//             if (variant.available && variant.title == variantTitle && variant.compare_at_price > variant.price) {
//               console.log(variant.available);
//               const discount = Math.round((((variant.compare_at_price - variant.price) * 100) / variant.compare_at_price));
//               const discountHTML = `<span class="block-swatch__discount-label">${discountSVG}<span style="color: #F6ECEC">${discount}%</span></span>`;
              
//               inputLabel.innerHTML = inputLabel.innerHTML + discountHTML;
//             }
//           });
//         });
//       }
//     });
//   });
// }


function getMiniCartSectionIdForCartAjax() {
	try {
		if (typeof __miniCartSectionId === 'function') {
			return __miniCartSectionId();
		}
		const el = document.getElementById('mini-cart');
		const sid = el && el.getAttribute('section-id');
		return sid && String(sid).length ? sid : 'mini-cart';
	} catch (e) {
		return 'mini-cart';
	}
}


if (window.giftLevels) {
	function giftGuardCartBarSubtotal(cart) {
		if (!cart || !Array.isArray(cart.items)) return 0;
		let sum = cart.items
			.filter((item) => item.requires_shipping)
			.reduce((s, item) => s + (item.final_line_price || 0), 0);
		const apps = cart.cart_level_discount_applications || [];
		for (let i = 0; i < apps.length; i++) {
			sum -= apps[i].total_allocated_amount || 0;
		}
		return sum;
	}

	async function processGiftLevels(cart) {
		if (!cart) return;

		const updates = {};
		window.giftLevels.forEach((giftLevel) => {
			const isGiftLevelActive = giftGuardCartBarSubtotal(cart) >= giftLevel.threshold;
			const giftItemsInCart = cart.items.filter((item) => giftLevel.giftIds.includes(item.product_id));

			if (!isGiftLevelActive) {
				giftItemsInCart.forEach((item) => {
					updates[item.variant_id] = 0;
				});
			} else if (giftLevel.autoAdd && giftLevel.defaultVariantId && giftItemsInCart.length === 0) {
				updates[giftLevel.defaultVariantId] = 1;
			}
		});

		if (Object.keys(updates).length === 0) return;

		const data = {
			updates: updates,
			sections: [getMiniCartSectionIdForCartAjax()],
		};
		const response = await fetch(`${window.themeVariables.routes.cartUpdateUrl}.js`, {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		const responseJson = await response.json();
		if (response.ok) {
			if (window.themeVariables.settings.cartType === 'page' || window.themeVariables.settings.pageType === 'cart') {
				return (window.location.href = `${Shopify.routes.root}cart`);
			}
			document.documentElement.dispatchEvent(
				new CustomEvent('cart:refresh', {
					bubbles: true,
					detail: {
						cart: responseJson,
						replacementDelay: 400,
					},
				}),
			);
		}
	}

	document.addEventListener('cart:updated', async function (event) {
		await processGiftLevels(event.detail.cart);
	});

	document.addEventListener('DOMContentLoaded', async function () {
		try {
			const response = await fetch(`${window.themeVariables.routes.cartUrl}.js`);
			const cart = await response.json();
			await processGiftLevels(cart);
		} catch (e) {}
	});
}


document.addEventListener('DOMContentLoaded', async () => {
	window.goToCheckout = async (event) => {
		event.preventDefault();
		// const preventCheckout = await checkGiftRules();
		// if(preventCheckout) return;
		const allGiftsSelected = Array.from(
			document.querySelectorAll('.drawer__content--gift > .gift-level__wrapper'),
		).every((item) => item.hasAttribute('gift-already-in-cart'));
		const checkoutBar = document.querySelector('checkout-bar');
		if (checkoutBar && !allGiftsSelected) {
			checkoutBar.open = true;
		} else {
			window.location.href = '/checkout';
		}
	};

	const productStar = document.querySelector('[scroll-to-review]');
	setTimeout(() => {
		const clonedStar = productStar?.cloneNode(true);
		productStar?.parentNode.replaceChild(clonedStar, productStar);

		clonedStar?.addEventListener('click', () => {
			let reviewTab = document.querySelector('[review-tab]');
			if (window.matchMedia(window.themeVariables.breakpoints.pocket).matches) {
				reviewTab = document.querySelector('[review-button]');
			}
			reviewTab.getAttribute('aria-expanded') === 'false' && reviewTab.click();

			const reviewTabOffset = reviewTab.getBoundingClientRect().top;

			const reviewTabScrollTop = parseInt(window.getComputedStyle(reviewTab).getPropertyValue('scroll-margin-top'));
			const scrollTo = reviewTabOffset - reviewTabScrollTop;
			window.scrollBy({
				top: scrollTo,
				behavior: 'smooth',
			});
		});
	}, 1000);
});








// Function to handle non-dropdown bundle add to cart
function addNonDropdownBundleToCart(button) {
    return async function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Disable button during processing
        button.setAttribute("disabled", "disabled");
        button.setAttribute("aria-busy", "true");
        
        // Get variant data from data attribute
        const variantIdsString = button.getAttribute('data-variant-ids');
        const mainVariantId = button.getAttribute('data-product-id'); // This is the main product variant
        
        if (!variantIdsString || !mainVariantId) {
            console.error('Missing variant data');
            button.removeAttribute("disabled");
            button.removeAttribute("aria-busy");
            return;
        }
        
        // Parse variant IDs and quantities
        const items = [];
        
        const timestamp = crypto.randomUUID();


        // First item is the main product from the product page
        items.push({
            id: mainVariantId,
            quantity: 1,
              properties: {
                _group: timestamp
            }
        });
        
        // Parse all bundle items from data-variant-ids
        const variantPairs = variantIdsString.split(',');
        
        variantPairs.forEach(pair => {
            if (pair.trim()) {
                const [variantId, quantity] = pair.split(':');
                if (variantId && quantity) {
                    // All bundle items are addons with parent_id
                    items.push({
                        id: variantId,
                        quantity: parseInt(quantity, 10),
                        parent_id: mainVariantId, // Use current product variant as parent
                        properties: {
                            _addon_item: true,
                            _bundle_item: true,
                            _group: timestamp
                        }
                    });
                }
            }
        });

        const addonItems = items.slice(1);
        items[0].properties._addon_count = addonItems.length;
        items[0].properties._addon_qty = addonItems.reduce((sum, addon) => sum + (addon.quantity || 0), 0);
        
        if (!items.length) {
            console.error('No valid items to add to cart');
            button.removeAttribute("disabled");
            button.removeAttribute("aria-busy");
            return;
        }
        
        // Debug log
        console.log('Adding to cart:', {
            mainVariantId: mainVariantId,
            addonCount: items.length - 1,
            items: items
        });
        
        // Prepare payload
        const payload = {
            items,
            sections: [getMiniCartSectionIdForCartAjax()]
        };
        
        try {
            // Add to cart
            const response = await fetch(`${window.themeVariables.routes.cartAddUrl}.js`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(payload)
            });
            
            // Re-enable button
            button.removeAttribute("disabled");
            button.removeAttribute("aria-busy");
            
            const responseJson = await response.json();
            
            if (response.ok) {
                console.log('Successfully added bundle to cart:', responseJson);
                
                // Redirect to cart page if cart type is page
                if (window.themeVariables.settings.cartType === "page" || window.themeVariables.settings.pageType === "cart") {
                    return window.location.href = `${Shopify.routes.root}cart`;
                }
                
                // Dispatch variant added event
                button.dispatchEvent(new CustomEvent("variant:added", {
                    bubbles: true,
                    detail: {
                        variant: responseJson.hasOwnProperty("items") ? responseJson["items"][0] : responseJson
                    }
                }));
                
                // Fetch updated cart and dispatch events
                fetch(`${window.themeVariables.routes.cartUrl}.js`).then(async (response2) => {
                    const cartContent = await response2.json();
                    
                    document.documentElement.dispatchEvent(new CustomEvent("cart:updated", {
                        bubbles: true,
                        detail: {
                            cart: cartContent
                        }
                    }));
                    
                    cartContent["sections"] = responseJson["sections"];
                    
                    document.documentElement.dispatchEvent(new CustomEvent("cart:refresh", {
                        bubbles: true,
                        detail: {
                            cart: cartContent,
                            openMiniCart: window.themeVariables.settings.cartType === "drawer" && button.closest(".drawer") === null
                        }
                    }));
                });
            } else {
                console.error('Failed to add to cart:', responseJson);
                // Dispatch refresh event on error
                button.dispatchEvent(new CustomEvent("cart:refresh", {
                    bubbles: true
                }));
            }
            
            // Show cart notification
            button.dispatchEvent(new CustomEvent("cart-notification:show", {
                bubbles: true,
                cancelable: true,
                detail: {
                    status: response.ok ? "success" : "error",
                    error: responseJson["description"] || responseJson["message"] || "Unknown error"
                }
            }));
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            button.removeAttribute("disabled");
            button.removeAttribute("aria-busy");
            
            // Show error notification
            button.dispatchEvent(new CustomEvent("cart-notification:show", {
                bubbles: true,
                cancelable: true,
                detail: {
                    status: "error",
                    error: "Network error. Please try again."
                }
            }));
        }
    };
}

// Initialize buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.custom-non-dropdown-button.single-button').forEach(button => {
        button.addEventListener('click', addNonDropdownBundleToCart(button));
    });
});

document.addEventListener('click', (e) => {
  const lineToggle = e.target.closest('.line_item_toggle');
  if (!lineToggle) return;
  const parent = lineToggle.closest('.line_item_acc');
  parent.classList.toggle('hide_acc_content');
});

// ---------------- Cart Reminder JS -----------------------

document.addEventListener('DOMContentLoaded', function () {

    const cartDrawer = document.querySelector('.header__icon-wrapper[aria-controls="mini-cart"]');
    const popupCart_Btns = document.querySelectorAll('.precon-popup__cta');

    var popupContainer = document.querySelector('.precon-cart-popup-container');
    var popup = document.getElementById('precon-cart-popup');
    var overlay = document.getElementById('precon-cart-popup-overlay');
    var closeBtn = document.getElementById('precon-popup-close');

    // 1. Cart is empty (Liquid did not render the popup) → nothing to do.
    if (!popupContainer) return;

    // ── Close helpers ──────────────────────────────────────────────────────

    function closePopup() {
      popup.classList.remove('is-visible');
      // Hide after transition completes (350 ms matches CSS).
      setTimeout(function () {
        popupContainer.style.display = 'none';
      }, 360);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }

    // Click on the transparent overlay (outside the card) closes popup.
    if (overlay) {
      overlay.addEventListener('click', closePopup);
    }

    popupCart_Btns.forEach(el => {
      el.addEventListener('click', () => {
        closePopup();
        cartDrawer.click();
      });
    });

});

// ---------------- End Cart Reminder JS -----------------------



(function () {
  const BREAKPOINT = 1024; // change if needed

  function initDietaryPopups() {
    document.querySelectorAll('.dietary-icon-wrapper').forEach(wrapper => {
      const popup = wrapper.querySelector('.dietary-popup');
      if (!popup) return;

      // 🔥 Reset popup state
      popup.classList.remove('is-open');
      popup.style.opacity = '';
      popup.style.visibility = '';

      // 🔥 Remove old listeners safely
      const cleanWrapper = wrapper.cloneNode(true);
      wrapper.replaceWith(cleanWrapper);

      const freshPopup = cleanWrapper.querySelector('.dietary-popup');

      const isDesktop = window.innerWidth >= BREAKPOINT;

      if (isDesktop) {
        // 🖥 DESKTOP → HOVER
        cleanWrapper.addEventListener('mouseenter', () => {
          freshPopup.style.opacity = '1';
          freshPopup.style.visibility = 'visible';
        });

        cleanWrapper.addEventListener('mouseleave', () => {
          freshPopup.style.opacity = '0';
          freshPopup.style.visibility = 'hidden';
        });
      } else {
        // 📱 MOBILE → CLICK
        cleanWrapper.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();

          const isOpen = freshPopup.classList.contains('is-open');

          document.querySelectorAll('.dietary-popup').forEach(p => {
            p.classList.remove('is-open');
          });

          if (!isOpen) {
            freshPopup.classList.add('is-open');
          }
        });
      }
    });
  }

  // Initial load
  initDietaryPopups();

  // 🔄 Re-init on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initDietaryPopups, 200);
  });

  // ❌ Close popup on outside click (mobile)
  document.addEventListener('click', () => {
    document.querySelectorAll('.dietary-popup').forEach(p => {
      p.classList.remove('is-open');
    });
  });
})();


// ---------------- Start - Verknappung ---------------- 
const TIMER_KEY = 'shortage_counter';
const DURATION = 15 * 60 * 1000;

// Countdown function
function startCountdown() {
  const savedEndTime = localStorage.getItem(TIMER_KEY);

  if (!savedEndTime) return;

  function updateTimer() {
    const counterMain = document.querySelectorAll('.cart-counter-text');
    const shortage_counters = document.querySelectorAll('.counter-value');
    const now = Date.now();
    const remaining = savedEndTime - now;

    if (remaining <= 0) {
      counterMain.forEach((el)=>{ el.style.display = 'none' });
      localStorage.removeItem(TIMER_KEY);
      clearInterval(interval);
      return;
    }else{
      counterMain.forEach((el)=>{ el.style.display = 'flex' });
    }

    const minutes = Math.floor((remaining / 1000) / 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    shortage_counters.forEach((el)=>{ 
      el.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;  
    });
  }

  updateTimer();
  const interval = setInterval(updateTimer, 1000);
}

document.addEventListener('variant:added', function(){
    const savedEndTime = localStorage.getItem(TIMER_KEY);
    if (!savedEndTime && document.body.classList.contains('countdown_b')) {
      const endTime = Date.now() + DURATION;
      localStorage.setItem(TIMER_KEY, endTime);
      startCountdown();
    }
    if (!savedEndTime && document.body.classList.contains('countdown_c')) {
      const endTime = Date.now() + DURATION;
      localStorage.setItem(TIMER_KEY, endTime);
      startCountdown();
    }
});

startCountdown();

// ---------------- End Verknappung ----------------


// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
function cartRefresh() {
  fetch(`${window.themeVariables.routes.cartUrl}.js`).then(
    async (response2) => {
      const cartContent = await response2.json();
      document.documentElement.dispatchEvent(
        new CustomEvent("cart:updated", {
          bubbles: true,
          detail: {
            cart: cartContent,
          },
        })
      );

      document.documentElement.dispatchEvent(
        new CustomEvent("cart:refresh", {
          bubbles: true,
          detail: {
            cart: cartContent,
           
          },
        })
      );
    }
  );
}
/* 
async function purgeOrphanAddonItems() {
    try {
        const cart = await fetch('/cart.js').then(r => r.json());
        const items = cart.items || [];

        const parentKeysInCart = new Set(
            items
                .filter(i => !(i.properties && i.properties['_addon_item']))
                .map(i => i.key)
        );

        const toRemove = items.filter(item => {
            const isAddon      = !!(item.properties && item.properties['_addon_item'] === true);
            const isPaket      = !!(item.title && item.title.toLowerCase().includes('paket'));
            const isZeroPrice  = item.price === 0;
            const hasParentKey = !!(item.parent_relationship && item.parent_relationship.parent_key);
            const parentInCart = hasParentKey && parentKeysInCart.has(item.parent_relationship.parent_key);

            if (isAddon && isZeroPrice && !hasParentKey)                 return true;
            if (isAddon && isZeroPrice && hasParentKey && !parentInCart)  return true;
            if (isPaket && isZeroPrice && !hasParentKey)                  return true;
            if (isPaket && isZeroPrice && hasParentKey && !parentInCart)  return true;

            return false;
        });

        const uniqueKeys = [...new Set(toRemove.map(i => i.key))];
        if (uniqueKeys.length === 0) return;

        const updates = {};
        uniqueKeys.forEach(key => { updates[key] = 0; });

        await fetch('/cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates })
        });

        console.log(`[Cleanup] ${uniqueKeys.length} orphan item(s) removed:`, uniqueKeys);
        cartRefresh();

    } catch (err) {
        console.warn('[Cleanup] Error:', err);
    }
}


// ═══════════════════════════════════════════════════════════════════
// HARDCORE: Native fetch intercept
// ═══════════════════════════════════════════════════════════════════
(function() {
    const _originalFetch = window.fetch;

    window.fetch = async function(...args) {
        const url = typeof args[0] === 'string'
            ? args[0]
            : (args[0] instanceof Request ? args[0].url : '');

        const response = await _originalFetch.apply(this, args);

        const isCartMutation = (
            url.includes('cart/add') ||
            url.includes('cart/change') ||
            url.includes('cart/update')
        );

      
        const isCleanupCall = (
            url.includes('cart/update') &&
            args[1]?.body &&
            typeof args[1].body === 'string' &&
            args[1].body.includes('"updates"')
        );

        if (isCartMutation && !isCleanupCall && response.ok) {
          
            response.clone().json().then(() => {
                purgeOrphanAddonItems();
            }).catch(() => {});
        }

        return response;
    };
})();
 
purgeOrphanAddonItems();
// ═══════════════════════════════════════════════════════════════════
// Focal theme events — backup layer
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('cart:change', purgeOrphanAddonItems);
document.addEventListener('variant:add', purgeOrphanAddonItems);


// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', purgeOrphanAddonItems);

*/

document.addEventListener('click', function (e) {
  const link = e.target.closest('.flavour_top_btn');
  if (!link) return;

  const targetId = link.getAttribute('href');

  if (!targetId || targetId === '#') return;

  const target = document.querySelector(targetId);

  if (!target) return;

  e.preventDefault();

  const offset = 90;
  const targetPosition =
    target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
});