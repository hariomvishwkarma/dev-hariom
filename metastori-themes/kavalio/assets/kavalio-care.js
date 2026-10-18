(function () {
  var STORAGE_KEY = "kavalio_care_declined";
  var settings = {
    show: false,
    autoAdd: true,
    showCartBox: true,
    productId: null,
    variantId: null,
  };

  var addInProgress = false;
  var addScheduled = false;
  var userJustAddedVariant = false;
  var prevCartHadCare = false;
  var enforceInProgress = false;
  var removalInProgress = false;

  function getCartRoot() {
    return (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || "/";
  }

  function getCartAddUrl() {
    var root = getCartRoot();
    return (
      (window.themeVariables && window.themeVariables.routes && window.themeVariables.routes.cartAddUrl) ||
      root + "cart/add.js"
    );
  }

  function getLineKey(item) {
    if (!item) return null;
    if (item.key != null && String(item.key) !== "") return String(item.key);
    if (item.id != null && String(item.id) !== "") return String(item.id);
    return null;
  }

  function applySettings(nextSettings) {
    settings = Object.assign({}, settings, nextSettings || {});
    window.kavalioCareMiniCartEnabled = settings.show === true;
    window.kavalioCareAutoAddEnabled = settings.autoAdd === true;
    window.kavalioCareCartBoxEnabled = settings.showCartBox === true;
    window.kavalioCareProductId = settings.productId;
    window.kavalioCareVariantId = settings.variantId;
    window.kavalio_care_product_id = settings.productId;
    window.kavalio_care_variant_id = settings.variantId;

    if (!isAutoAddActive()) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  }

  function getProductId() {
    return settings.productId;
  }

  function getVariantId() {
    return settings.variantId;
  }

  function isMiniCartActive() {
    return settings.show === true;
  }

  function isAutoAddActive() {
    return isMiniCartActive() && settings.autoAdd === true && getVariantId() != null;
  }

  function userDeclined() {
    if (!isAutoAddActive()) return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function syncDeclinedState() {
    if (isAutoAddActive()) return;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function cartHasCare(cartContent) {
    var productId = getProductId();
    var variantId = getVariantId();
    if (productId == null && variantId == null) return false;
    if (!cartContent || !Array.isArray(cartContent.items) || cartContent.items.length === 0) return false;
    return cartContent.items.some(function (item) {
      if (productId != null && Number(item.product_id) === Number(productId)) return true;
      return variantId != null && Number(item.variant_id) === Number(variantId);
    });
  }

  function cartHasOtherProducts(cartContent) {
    if (!cartContent || !Array.isArray(cartContent.items)) return false;
    var productId = getProductId();
    var variantId = getVariantId();
    if (productId == null && variantId == null) return cartContent.items.length > 0;
    return cartContent.items.some(function (item) {
      if (productId != null && Number(item.product_id) === Number(productId)) return false;
      if (variantId != null && Number(item.variant_id) === Number(variantId)) return false;
      return true;
    });
  }

  function dispatchCartEvents(cart, options) {
    options = options || {};
    document.documentElement.dispatchEvent(
      new CustomEvent("cart:updated", { bubbles: true, detail: { cart: cart } })
    );
    document.documentElement.dispatchEvent(
      new CustomEvent("cart:refresh", {
        bubbles: true,
        detail: Object.assign({ cart: cart }, options),
      })
    );
  }

  function appendToAddToCartItems(items, context) {
    context = context || {};
    if (context.fromMiniCartForm) return;
    if (!context.currentCart || context.currentCart.item_count !== 0) return;
    if (userDeclined() || !isAutoAddActive()) return;
    var variantId = getVariantId();
    if (variantId == null) return;
    items.push({ id: variantId, quantity: 1 });
  }

  function buildClampUpdates(cart) {
    var productId = getProductId();
    if (productId == null || !cart || !Array.isArray(cart.items) || cart.items.length === 0) return null;

    var careItems = cart.items.filter(function (item) {
      return Number(item.product_id) === Number(productId);
    });
    if (careItems.length === 0) return null;

    var totalQty = 0;
    careItems.forEach(function (item) {
      totalQty += Number(item.quantity || 0);
    });
    if (totalQty <= 1) return null;

    var updates = {};
    careItems.forEach(function (item, idx) {
      var key = getLineKey(item);
      if (!key) return;
      updates[key] = idx === 0 ? 1 : 0;
    });

    return Object.keys(updates).length ? updates : null;
  }

  function enforceMaxOne(cart) {
    if (enforceInProgress) return;
    var updates = buildClampUpdates(cart);
    if (!updates) return;

    enforceInProgress = true;
    fetch(getCartRoot() + "cart/update.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: updates }),
    })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (newCart) {
        enforceInProgress = false;
        if (!newCart) return;
        dispatchCartEvents(newCart, { forceFullRefresh: true });
      })
      .catch(function () {
        enforceInProgress = false;
      });
  }

  function removeIfOnlyItem(cartContent) {
    var productId = getProductId();
    if (productId == null || !cartContent || !Array.isArray(cartContent.items) || cartContent.items.length === 0) {
      return;
    }
    if (removalInProgress) return;

    var allAreCare = cartContent.items.every(function (item) {
      return Number(item.product_id) === Number(productId);
    });
    if (!allAreCare) return;

    removalInProgress = true;
    var updates = {};
    cartContent.items.forEach(function (item) {
      updates[String(item.id)] = 0;
    });

    fetch(getCartRoot() + "cart/update.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: updates }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (newCart) {
        removalInProgress = false;
        dispatchCartEvents(newCart, { forceFullRefresh: true });
      })
      .catch(function () {
        removalInProgress = false;
      });
  }

  function doAddCare() {
    if (addInProgress) return;
    var variantId = getVariantId();
    if (variantId == null) return;

    addInProgress = true;
    fetch(getCartAddUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: variantId, quantity: 1 }],
        sections: ["mini-cart"],
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        addInProgress = false;
        if (!result.ok || (result.data && result.data.status === 422)) return null;

        var sections = (result.data && result.data.sections) || {};
        var sectionHtml = sections["mini-cart"] || sections["mini_cart"] || null;
        return fetch("/cart.js")
          .then(function (r) {
            return r.ok ? r.json() : null;
          })
          .then(function (newCart) {
            return { cart: newCart, sectionHtml: sectionHtml };
          });
      })
      .then(function (payload) {
        if (!payload || !payload.cart) return;
        var cartForRefresh = Object.assign({}, payload.cart);
        if (payload.sectionHtml && typeof payload.sectionHtml === "string") {
          cartForRefresh.sections = { "mini-cart": payload.sectionHtml };
        }
        dispatchCartEvents(payload.cart, {
          cart: cartForRefresh,
          replacementDelay: 0,
          forceFullRefresh: !payload.sectionHtml,
        });
      })
      .catch(function () {
        addInProgress = false;
      });
  }

  function shouldAutoAddAfterCartChange(cartContent) {
    if (!isAutoAddActive()) return false;
    if (!cartContent || !Array.isArray(cartContent.items) || cartContent.items.length === 0) return false;
    if (cartHasCare(cartContent)) return false;
    if (!cartHasOtherProducts(cartContent)) return false;
    if (userDeclined()) return false;
    return true;
  }

  function addIfMissing(cartContent) {
    if (!shouldAutoAddAfterCartChange(cartContent)) return;
    if (getVariantId() == null || addInProgress || addScheduled) return;

    addScheduled = true;
    window.setTimeout(function () {
      addScheduled = false;
      fetch("/cart.js")
        .then(function (r) {
          return r.ok ? r.json() : null;
        })
        .then(function (currentCart) {
          if (!currentCart || !currentCart.items || currentCart.items.length === 0) return;
          if (cartHasCare(currentCart)) return;
          doAddCare();
        })
        .catch(function () {
          addScheduled = false;
        });
    }, 700);
  }

  function onCartUpdated(cart) {
    syncDeclinedState();

    if (!cartHasOtherProducts(cart) && !cartHasCare(cart)) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }

    var currentHadCare = cartHasCare(cart);
    if (isAutoAddActive() && prevCartHadCare && !currentHadCare && cartHasOtherProducts(cart) && !userJustAddedVariant) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch (e) {}
    }
    if (currentHadCare) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }

    addIfMissing(cart);
    enforceMaxOne(cart);
    removeIfOnlyItem(cart);

    prevCartHadCare = currentHadCare;
  }

  function initPdpSync() {
    var section = document.querySelector('section[data-kavalio-care="true"][data-product-id]');
    if (!section) return;

    var productId = parseInt(section.getAttribute("data-product-id"), 10);
    if (!productId) return;

    var atcButton = document.getElementById("AddToCart");
    if (!atcButton) return;

    var defaultHtml = atcButton.innerHTML;
    var defaultDisabled = atcButton.disabled;

    function setState(hasInCart) {
      if (hasInCart) {
        atcButton.disabled = true;
        atcButton.classList.add("button--ternary");
        atcButton.innerHTML = "Bereits im Warenkorb";
      } else {
        atcButton.disabled = defaultDisabled;
        atcButton.classList.remove("button--ternary");
        atcButton.innerHTML = defaultHtml;
      }
    }

    function checkCartOnce() {
      fetch("/cart.js")
        .then(function (res) {
          if (!res.ok) throw new Error("Cart fetch failed");
          return res.json();
        })
        .then(function (cart) {
          var hasItem =
            cart &&
            Array.isArray(cart.items) &&
            cart.items.some(function (item) {
              return item.product_id === productId;
            });
          setState(hasItem);
        })
        .catch(function () {});
    }

    checkCartOnce();

    document.documentElement.addEventListener("cart:updated", function (e) {
      if (!e.detail || !e.detail.cart) return;
      var cart = e.detail.cart;
      var hasItem =
        Array.isArray(cart.items) &&
        cart.items.some(function (item) {
          return item.product_id === productId;
        });
      setState(hasItem);
    });

    document.documentElement.addEventListener("cart:refresh", function (e) {
      if (!e.detail || !e.detail.cart) {
        checkCartOnce();
        return;
      }
      var cart = e.detail.cart;
      var hasItem =
        Array.isArray(cart.items) &&
        cart.items.some(function (item) {
          return item.product_id === productId;
        });
      setState(hasItem);
    });
  }

  function initCollapsible() {
    document.documentElement.addEventListener("click", function (e) {
      if (e.target.closest(".kavalio_care_product_content_button_add")) return;
      var heading = e.target.closest(".kavalio_care_product_heading");
      if (!heading) return;
      var wrap = heading.closest(".kavalio_care_product_wrap");
      if (!wrap) return;
      wrap.classList.toggle("is-expanded");
    });
  }

  function init() {
    applySettings(window.__KAVALIO_CARE_SETTINGS || {});

    document.documentElement.addEventListener("variant:added", function () {
      userJustAddedVariant = true;
      window.setTimeout(function () {
        userJustAddedVariant = false;
      }, 3000);
    });

    document.documentElement.addEventListener("cart:updated", function (e) {
      if (e.detail && e.detail.cart) onCartUpdated(e.detail.cart);
    });

    fetch("/cart.js")
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (cart) {
        prevCartHadCare = cart ? cartHasCare(cart) : false;
        if (cart) {
          enforceMaxOne(cart);
          removeIfOnlyItem(cart);
        }
      })
      .catch(function () {});

    initPdpSync();
    initCollapsible();
  }

  window.KavalioCare = {
    applySettings: applySettings,
    getProductId: getProductId,
    getVariantId: getVariantId,
    isMiniCartActive: isMiniCartActive,
    isAutoAddActive: isAutoAddActive,
    userDeclined: userDeclined,
    cartHasCare: cartHasCare,
    cartHasOtherProducts: cartHasOtherProducts,
    appendToAddToCartItems: appendToAddToCartItems,
  };

  window.getKavalioCareProductId = getProductId;
  window.getKavalioCareVariantId = getVariantId;
  window.isKavalioCareMiniCartActive = isMiniCartActive;
  window.isKavalioCareAutoAddActive = isAutoAddActive;
  window.userDeclinedKavalioCare = userDeclined;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
