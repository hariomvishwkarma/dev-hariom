/**
 * Cart page redirects to homepage and auto-opens the cart drawer.
 */
(function () {
  function isDrawerCart() {
    return (
      window.themeVariables &&
      window.themeVariables.settings &&
      window.themeVariables.settings.cartType === "drawer"
    );
  }

  function getCartPath() {
    try {
      var cartUrl =
        window.themeVariables &&
        window.themeVariables.routes &&
        window.themeVariables.routes.cartUrl;
      if (!cartUrl) return "/cart";
      return new URL(cartUrl, window.location.origin).pathname || "/cart";
    } catch (e) {
      return "/cart";
    }
  }

  function openMiniCartAndCleanUrl() {
    var cartDrawer = document.getElementById("mini-cart");
    if (cartDrawer && "open" in cartDrawer) {
      cartDrawer.open = true;
    }

    try {
      var params = new URLSearchParams(window.location.search || "");
      if (params.get("open_cart_drawer") === "1") {
        params.delete("open_cart_drawer");
        var newUrl =
          window.location.pathname +
          (params.toString() ? "?" + params.toString() : "") +
          window.location.hash;
        window.history.replaceState({}, "", newUrl);
      }
    } catch (e) {}
  }

  // Direct visit
  (function handleCartPathRedirect() {
    var path = window.location.pathname || "";
    var isCartPath = path === "/cart" || path === "/cart/";
    if (!isCartPath) return;

    try {
      var params = new URLSearchParams(window.location.search || "");
      params.set("open_cart_drawer", "1");
      var target = "/" + (params.toString() ? "?" + params.toString() : "");
      window.location.replace(target);
    } catch (e) {
      window.location.replace("/?open_cart_drawer=1");
    }
  })();

  // 2) If we land with ?open_cart_drawer=1, open once drawer exists
  (function handleAutoOpenFromFlag() {
    var params;
    try {
      params = new URLSearchParams(window.location.search || "");
    } catch (e) {
      return;
    }

    if (params.get("open_cart_drawer") !== "1") return;

    function tryOpen(attempt) {
      var cartDrawer = document.getElementById("mini-cart");
      if (cartDrawer && "open" in cartDrawer) {
        openMiniCartAndCleanUrl();
        return;
      }

      if (attempt > 60) return;
      requestAnimationFrame(function () {
        tryOpen(attempt + 1);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        tryOpen(0);
      });
    } else {
      tryOpen(0);
    }
  })();

  // 3) Cart link clicks
  document.addEventListener(
    "click",
    function (event) {
      var link =
        event.target && event.target.closest
          ? event.target.closest("a[href]")
          : null;
      if (!link) return;
      if (link.hasAttribute("data-no-cart-drawer")) return;

      if (link.getAttribute("aria-controls") === "mini-cart") {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        openMiniCartAndCleanUrl();
        return;
      }

      if (!isDrawerCart()) return;

      var href = link.getAttribute("href") || "";
      if (!href || href.indexOf("javascript:") === 0 || href.indexOf("#") === 0)
        return;

      var cartPath = getCartPath();
      var url;
      try {
        url = new URL(href, window.location.origin);
      } catch (e) {
        return;
      }

      if (
        url.origin === window.location.origin &&
        (url.pathname === cartPath || url.pathname === cartPath + "/")
      ) {
        event.preventDefault();
        openMiniCartAndCleanUrl();
      }
    },
    true
  );
})();

