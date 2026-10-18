const headers = document.querySelectorAll(".pdp-bundle-builder-option-header");
const dropdowns = document.querySelectorAll(".pdp-bundle-builder-option-dropdown");

function closeAllDropdowns() {
    dropdowns.forEach(d => d.classList.remove("open"));
}

function getMiniCartSectionIdForCartAjax() {
    try {
        if (typeof __miniCartSectionId === "function") {
            return __miniCartSectionId();
        }
        const el = document.getElementById("mini-cart");
        const sid = el && el.getAttribute("section-id");
        return sid && String(sid).length ? sid : "mini-cart";
    } catch (e) {
        return "mini-cart";
    }
}
headers.forEach(header => {
    header.addEventListener("click", function(e) {
        e.stopPropagation();
        const dropdown = this.nextElementSibling;
        if (!dropdown || !dropdown.classList.contains("pdp-bundle-builder-option-dropdown")) return;

        const isOpen = dropdown.classList.contains("open");
        closeAllDropdowns();
        if (!isOpen) dropdown.classList.add("open");
    });
});


document.addEventListener("click", function(e) {
    if (!e.target.closest(".pdp-bundle-builder-option")) {
        closeAllDropdowns();
    }
});


document.addEventListener("click", function(e) {
    const closeBtn = e.target.closest(".pdp-bundle-builder-option-dropdown-close");
    if (closeBtn) {
        e.stopPropagation();
        closeAllDropdowns();
    }
});

document.addEventListener("click", function(e) {
    const product = e.target.closest(".pdp-bundle-builder-option-dropdown-product");
    if (!product) return;

    const qty = product.getAttribute("data-qty");
    const vid = product.getAttribute("data-vid");
    const title = product.querySelector("h4") ? product.querySelector("h4").textContent : "";
    const img = product.querySelector("img");

    const header = product.closest(".pdp-bundle-builder-option").querySelector(".pdp-bundle-builder-option-header");
    if (!header) return;

    const headerImg = header.querySelector("img");
    if (headerImg && img) {
        headerImg.src = img.src;
        headerImg.srcset = img.srcset || "";
        headerImg.alt = img.alt || "";
    }
    const headerText = header.querySelector(".pdp-bundle-builder-option-header-text");
    if (headerText) {
        headerText.textContent = title;
    }
    header.setAttribute("data-vid", vid);
    header.setAttribute("data-qty", qty);

    header.classList.add("active");


    const siblings = product.parentElement.querySelectorAll(".pdp-bundle-builder-option-dropdown-product");
    siblings.forEach(s => s.classList.remove("active"));
    product.classList.add("active");

    updateBundleATC();
    const dropdown = product.closest(".pdp-bundle-builder-option-dropdown");
    if (dropdown) dropdown.classList.remove("open");

});



document.querySelectorAll(".pdp-bundle-builder-single-product-info-label").forEach(label => {
    label.addEventListener("click", function(e) {
        e.stopPropagation();

        const info = this.nextElementSibling;
        if (!info || !info.classList.contains("pdp-bundle-builder-single-product-info")) return;


        document.querySelectorAll(".pdp-bundle-builder-single-product-info.open").forEach(other => {
            if (other !== info) other.classList.remove("open");
        });

        info.classList.toggle("open");
    });
});


document.addEventListener("click", function(e) {
    document.querySelectorAll(".pdp-bundle-builder-single-product-info.open").forEach(info => {
        if (!e.target.closest(".pdp-bundle-builder-single-product-info") && !e.target.closest(".pdp-bundle-builder-single-product-info-label")) {
            info.classList.remove("open");
        }
    });
});




function updateBundleATC() {
    const headers = document.querySelectorAll('.pdp-bundle-builder-option-header');
    const atcButtons = document.querySelectorAll('.bundle-atc');
    const allActive = Array.from(headers).every(header => header.classList.contains('active'));

    // atcButtons.forEach(button => {
    //     if (allActive) {
    //         button.classList.remove('disabled');
    //     } else {
    //         button.classList.add('disabled');
    //     }
    // });
}


document.querySelectorAll('.bundle-atc').forEach(button => {
    button.addEventListener('click', async function(event) {
        event.preventDefault();
        event.stopPropagation();


        const submitButtons = document.querySelectorAll('.bundle-atc');
        submitButtons.forEach((submitButton) => {
            submitButton.setAttribute("disabled", "disabled");
            submitButton.setAttribute("aria-busy", "true");
        });

        const form = button.closest('form');
        if (!form) return;

        const mainVariantInput = form.querySelector('[name="id"]');
        if (!mainVariantInput) {
            console.error('Main variant input not found');
            return;
        }

        const timestamp = crypto.randomUUID();

        const mainVariantId = mainVariantInput.value;
        const mainQuantity = parseInt(form.querySelector('[name="quantity"]')?.value || 1, 10);

        const items = [{
            id: mainVariantId,
            quantity: mainQuantity,
            properties: {
                _group: timestamp
            }
        }];

        document.querySelectorAll('.pdp-bundle-builder-single-product, .pdp-bundle-builder-option-header.active').forEach(el => {
            const variantId = el.dataset.vid;
            const qty = parseInt(el.dataset.qty || 1, 10);
            if (variantId) {
                items.push({
                    id: variantId,
                    quantity: qty,
                    parent_id: mainVariantId,
                    properties: {
                        _addon_item: true,
                        _group: timestamp
                    }
                });
            }
        });

        const addonItems = items.slice(1);
        items[0].properties._addon_count = addonItems.length;
        items[0].properties._addon_qty = addonItems.reduce((sum, addon) => sum + (addon.quantity || 0), 0);

        if (!items.length) return;


        const payload = {
            items,
            sections: [getMiniCartSectionIdForCartAjax()]
        };
        const response = await fetch(`${window.themeVariables.routes.cartAddUrl}.js`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });
        submitButtons.forEach((submitButton) => {
            submitButton.removeAttribute("disabled");
            submitButton.removeAttribute("aria-busy");
        });
        const responseJson = await response.json();

        if (response.ok) {
            if (window.themeVariables.settings.cartType === "page" || window.themeVariables.settings.pageType === "cart") {
                return window.location.href = `${Shopify.routes.root}cart`;
            }
            this.dispatchEvent(new CustomEvent("variant:added", {
                bubbles: true,
                detail: {
                    variant: responseJson.hasOwnProperty("items") ? responseJson["items"][0] : responseJson
                }
            }));
            fetch(`${window.themeVariables.routes.cartUrl}.js`).then(async (response2) => {
                const cartContent = await response2.json();
                document.documentElement.dispatchEvent(new CustomEvent("cart:updated", {
                    bubbles: true,
                    detail: {
                        cart: cartContent
                    }
                }));
                cartContent["sections"] = responseJson["sections"];
                if (document.body.classList.contains("atc-popup-version")) {
                    // ---------------- Start ATC Popup ----------------
                    const qty = document.querySelector('.product__info .quantity-selector__input')?.value;
                    const appc_qty = document.querySelector('.appc-qty-count');
                    if(appc_qty) appc_qty.textContent = qty;

                    const atcpopup = document.querySelector('.atc-popup-main');
                    if(atcpopup) {
                    atcpopup.classList.add('atc-popup-active');
                    setTimeout(()=>{ atcpopup.classList.remove('atc-popup-active') },2000);
                    }
                    document.documentElement.dispatchEvent(new CustomEvent("cart:refresh", {
                    bubbles: true,
                    detail: {
                        cart: cartContent,
                    }
                    }));
                    // ---------------- End ATC Popup ----------------
                }
                // ---------------- Start ATC Popup CP ----------------
                else if (document.body.classList.contains("atc-popup-cp-version")) {
                    const atc_img = document.querySelector('.atc-popup-product-img');
                    const notification_title = document.querySelector('.appc-title')
                    if (atc_img && responseJson?.image) {
                    atc_img.src = `${responseJson.image}&width=100`;
                    }
                    if(notification_title) notification_title.textContent = responseJson.product_title;
                    setTimeout(()=>{
                    const atcpopup = document.querySelector('.atc-popup-main');
                    if(atcpopup) {
                        atcpopup.classList.add('atc-popup-active');
                        setTimeout(()=>{ atcpopup.classList.remove('atc-popup-active') },2000);
                    }
                    document.documentElement.dispatchEvent(new CustomEvent("cart:refresh", {
                        bubbles: true,
                        detail: {
                        cart: cartContent,
                        }
                    }));
                    },700);
                }
                // ---------------- End ATC Popup CP ----------------
                else{
                    document.documentElement.dispatchEvent(new CustomEvent("cart:refresh", {
                        bubbles: true,
                        detail: {
                            cart: cartContent,
                            openMiniCart: window.themeVariables.settings.cartType === "drawer" && this.closest(".drawer") === null
                        }
                    }));   
                }
            });
        } else {
            this.dispatchEvent(new CustomEvent("cart:refresh", {
                bubbles: true
            }));
        }
        this.dispatchEvent(new CustomEvent("cart-notification:show", {
            bubbles: true,
            cancelable: true,
            detail: {
                status: response.ok ? "success" : "error",
                error: responseJson["description"] || ""
            }
        }));


    });
});

console.log("Testing");