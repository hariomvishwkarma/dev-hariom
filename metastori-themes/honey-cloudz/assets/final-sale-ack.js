/**
 * Final sale checkout acknowledgment.
 * When the cart holds a final sale item, snippets/final-sale-cart-ack.liquid
 * renders a checkbox and checkout stays blocked until it is ticked.
 */
(function () {
  const ACK_SELECTOR = "[data-final-sale-ack]";
  const INPUT_SELECTOR = "[data-final-sale-ack-input]";
  const ERROR_SELECTOR = "[data-final-sale-ack-error]";
  const STORAGE_KEY = "hc-final-sale-ack";
  const CHECKOUT_SELECTOR = [
    "[data-custom-checkout-btn]",
    "[data-custom-checkout-without]",
    "button[name='checkout']",
    "[name='checkout']",
    "redo-checkout-buttons",
    ".custom-cart__checkout",
    ".custom-cart__checkout-alt",
  ].join(", ");
  const REDO_SELECTOR = "redo-checkout-buttons, redo-shopify-toggle, [class*='redo' i], [id*='redo' i]";
  const REDO_SCOPE_SELECTOR = "[data-custom-cart] .custom-cart__footer, #main-cart-footer .cart__ctas";
  // Redo renders its checkout buttons in a closed shadow root and can act on
  // pointer/mouse/touch events before "click", so those are held back too.
  const PRESS_EVENTS = ["pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"];

  function isStoredAcknowledged() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function storeAcknowledged(value) {
    try {
      if (value) {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      // Ignore private-mode storage failures.
    }
  }

  function setInvalid(ack, invalid) {
    if (!ack) return;
    ack.classList.toggle("is-invalid", invalid);
    const error = ack.querySelector(ERROR_SELECTOR);
    if (error) error.hidden = !invalid;
  }

  // The drawer footer and the cart page footer are re-rendered on every cart
  // change, which resets the checkbox, so restore it from the stored choice.
  function syncInputs() {
    const acknowledged = isStoredAcknowledged();
    document.querySelectorAll(INPUT_SELECTOR).forEach((input) => {
      if (input.checked !== acknowledged) input.checked = acknowledged;
      if (acknowledged) setInvalid(input.closest(ACK_SELECTOR), false);
    });
  }

  function isCheckoutUrl(url) {
    if (!url) return false;
    const value = String(url).trim();
    if (!value || value.startsWith("javascript:") || value.startsWith("#")) return false;
    try {
      const parsed = new URL(value, window.location.origin);
      return parsed.pathname === "/checkout" || parsed.pathname.startsWith("/checkouts/");
    } catch (error) {
      return /\/checkout(\/|$|\?|#)/.test(value);
    }
  }

  function isRedoTarget(target) {
    if (!target?.closest || !target.closest(REDO_SCOPE_SELECTOR)) return false;
    if (target.closest(ACK_SELECTOR)) return false;
    if (target.closest(REDO_SELECTOR)) return true;
    return String(target.tagName || "").toLowerCase().startsWith("redo-");
  }

  function isCheckoutTrigger(event) {
    const target = event.target;
    if (!target?.closest) return false;
    if (event.type === "submit") {
      return event.submitter?.name === "checkout";
    }
    if (event.type === "keydown") {
      if (event.key !== "Enter" && event.key !== " ") return false;
    }
    if (target.closest(ACK_SELECTOR)) return false;
    if (target.closest(CHECKOUT_SELECTOR)) return true;
    const link = target.closest("a[href]");
    if (link && isCheckoutUrl(link.getAttribute("href") || link.href)) return true;
    return isRedoTarget(target);
  }

  function pendingAck(target) {
    const ack = ackForTarget(target);
    if (!ack) return null;
    const input = ack.querySelector(INPUT_SELECTOR);
    if (!input || input.checked) return null;
    return ack;
  }

  function ackForTarget(target) {
    const drawer = target.closest?.("[data-custom-cart]");
    if (drawer) return drawer.querySelector(ACK_SELECTOR);
    return document.querySelector(`#main-cart-footer ${ACK_SELECTOR}`);
  }

  function blockEvent(event) {
    if (!isCheckoutTrigger(event)) return;
    const ack = pendingAck(event.target);
    if (!ack) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    setInvalid(ack, true);
    ack.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    ack.querySelector(INPUT_SELECTOR)?.focus({ preventScroll: true });
  }

  // Not cancelled, so the browser still fires "click" and blockEvent shows the error.
  function holdPress(event) {
    if (!isRedoTarget(event.target)) return;
    if (!pendingAck(event.target)) return;
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  ["click", "submit", "keydown"].forEach((type) => {
    window.addEventListener(type, blockEvent, true);
  });
  PRESS_EVENTS.forEach((type) => {
    window.addEventListener(type, holdPress, { capture: true, passive: true });
  });

  document.addEventListener("change", (event) => {
    const input = event.target?.closest?.(INPUT_SELECTOR);
    if (!input) return;
    storeAcknowledged(input.checked);
    syncInputs();
  });

  let syncTimer = null;
  function scheduleSync() {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(syncInputs, 16);
  }

  function init() {
    syncInputs();
    if (window.__finalSaleAckObserver || typeof MutationObserver === "undefined") return;
    window.__finalSaleAckObserver = new MutationObserver(scheduleSync);
    window.__finalSaleAckObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
