/**
 * Theme-level B2B minimum order value + style MOQ.
 * Applies to company customers tagged B2B Customer.
 */
(function () {
  const NOTICE_SELECTOR = "[data-b2b-min-order-notice]";
  const MOQ_ORDER_SELECTOR = "[data-b2b-moq-order-notice]";
  const CONFIG_SELECTOR = "[data-b2b-min-order-config]";
  const MOQ_LINE_SELECTOR = "[data-b2b-moq-line-notice]";
  const ITEM_SELECTOR = "[data-custom-item]";
  const CHECKOUT_SELECTOR = [
    "[data-custom-checkout-btn]",
    "[data-custom-checkout-without]",
    "button[name='checkout']",
    "[name='checkout']",
    "redo-checkout-buttons",
    ".custom-cart__checkout",
    ".custom-cart__checkout-alt",
  ].join(", ");
  const REORDER_STORAGE_PREFIX = "hc-b2b-mov-reorder:";

  let liveCartTotalCents = null;
  let liveCartItems = null;
  let liveTotalPromise = null;
  let sawTotalStale = false;
  // Config nodes and live cart payloads share one counter so we can tell which
  // is newer: a freshly rendered section beats an older /cart.js result and
  // vice versa.
  let freshnessSeq = 0;
  let liveCartSeq = 0;

  function parseConfig(node) {
    if (!node) return null;
    try {
      return JSON.parse(node.textContent);
    } catch (error) {
      return null;
    }
  }

  function rememberReorder(config) {
    if (!config?.customerId) return;
    if (config.isReorder || Number(config.ordersCount) > 0) {
      try {
        window.localStorage.setItem(REORDER_STORAGE_PREFIX + config.customerId, "1");
      } catch (error) {
        // Ignore private-mode storage failures.
      }
    }
  }

  function storedReorder(config) {
    if (!config?.customerId) return false;
    try {
      return window.localStorage.getItem(REORDER_STORAGE_PREFIX + config.customerId) === "1";
    } catch (error) {
      return false;
    }
  }

  function normalizeConfig(config) {
    if (!config) return null;
    rememberReorder(config);

    const next = { ...config };
    const isReorder = Boolean(next.isReorder) || Number(next.ordersCount) > 0 || storedReorder(next);
    next.isReorder = isReorder;
    next.thresholdCents = isReorder
      ? Number(next.reorderThresholdCents || next.thresholdCents || 25000)
      : Number(next.firstOrderThresholdCents || next.thresholdCents || 30000);
    next.messageTemplate = isReorder
      ? next.reorderMessageTemplate || next.messageTemplate
      : next.firstOrderMessageTemplate || next.messageTemplate;
    next.moq = next.moq || {
      enabled: false,
      defaultQty: 6,
      met: true,
      shortfalls: [],
      messageTemplate: "Add [qty] more of this style to reach the [minimum] style minimum.",
    };
    return next;
  }

  function configSeq(node) {
    if (!node.__b2bSeq) node.__b2bSeq = ++freshnessSeq;
    return node.__b2bSeq;
  }

  function readConfig() {
    // The drawer, the cart page and the layout each carry a copy. Only some of
    // them are re-rendered on a cart change, so use the most recently inserted.
    let best = null;
    let bestNode = null;
    let bestSeq = -1;
    document.querySelectorAll(CONFIG_SELECTOR).forEach((node) => {
      const seq = configSeq(node);
      if (seq < bestSeq) return;
      const parsed = parseConfig(node);
      if (!parsed) return;
      best = parsed;
      bestNode = node;
      bestSeq = seq;
    });

    const config = normalizeConfig(best);
    if (config) {
      config.renderSeq = bestSeq;
      config.sourceNode = bestNode;
    }
    return config;
  }

  function liveCartIsNewer(config) {
    return liveCartSeq > 0 && liveCartSeq > Number(config?.renderSeq || 0);
  }

  function formatMoney(cents) {
    if (window.CustomCartUtils?.formatMoney) {
      return window.CustomCartUtils.formatMoney(cents);
    }
    const amount = Math.max(0, Number(cents) || 0) / 100;
    const value = amount % 1 === 0 ? String(Math.round(amount)) : amount.toFixed(2);
    return `$${value}`;
  }

  function protectionVariantIds() {
    const ids = new Set();
    const cfg = window.CustomCartUtils?.getConfig?.()?.protection || {};
    if (cfg.variantId) ids.add(String(cfg.variantId));
    return ids;
  }

  function isProtectionItem(item) {
    const protectedIds = protectionVariantIds();
    const vendor = String(item?.vendor || "").toLowerCase();
    return (
      protectedIds.has(String(item?.variant_id)) ||
      vendor === "redo" ||
      vendor === "returngo" ||
      vendor === "return go"
    );
  }

  function usableCartTotalFromCart(cart) {
    if (!cart) return null;
    let total = Math.max(0, Number(cart.total_price) || 0);
    (cart.items || []).forEach((item) => {
      if (isProtectionItem(item)) total -= Math.max(0, Number(item.final_line_price) || 0);
    });
    return Math.max(0, total);
  }

  function parseCartPayload(payload) {
    if (!payload) return null;
    if (typeof payload === "string") {
      try {
        return JSON.parse(payload);
      } catch (error) {
        return null;
      }
    }
    if (typeof payload === "object") return payload;
    return null;
  }

  function setLiveCartFromPayload(payload) {
    const cart = parseCartPayload(payload);
    if (!cart) return null;
    liveCartItems = Array.isArray(cart.items) ? cart.items : [];
    const total = usableCartTotalFromCart(cart);
    if (total != null) liveCartTotalCents = total;
    liveCartSeq = ++freshnessSeq;
    return cart;
  }

  function refreshLiveCartTotal() {
    if (liveTotalPromise) return liveTotalPromise;
    liveTotalPromise = fetch("/cart.js", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((cart) => {
        setLiveCartFromPayload(cart);
        return liveCartTotalCents;
      })
      .catch(() => liveCartTotalCents)
      .finally(() => {
        liveTotalPromise = null;
      });
    return liveTotalPromise;
  }

  function cartTotalCents(config) {
    const liquidTotal = Math.max(0, Number(config?.cartTotalCents) || 0);
    const saw = Number(window.saw_discounted_total_cents);
    const live = liveCartTotalCents;
    const base = liveCartIsNewer(config) && Number.isFinite(live) && live >= 0 ? live : liquidTotal;

    if (!sawTotalStale && Number.isFinite(saw) && saw > 0) {
      return base > 0 ? Math.min(base, saw) : saw;
    }
    return base;
  }

  function quantityItems(config) {
    // The drawer and the cart page can both list the same lines; count from
    // one of them only, the one that belongs to the config being applied.
    const drawer = config?.sourceNode?.closest?.("[data-custom-cart]");
    const root = drawer || document.getElementById("main-cart-items") || document.querySelector("[data-custom-cart]");
    return root ? root.querySelectorAll(ITEM_SELECTOR) : document.querySelectorAll(ITEM_SELECTOR);
  }

  function moqRequiredForItem(itemEl, config) {
    const fromAttr = Number(itemEl?.dataset?.moqRequired);
    if (Number.isFinite(fromAttr) && fromAttr > 0) return fromAttr;
    return Number(config?.moq?.defaultQty || 6);
  }

  function computeMoqShortfalls(config) {
    if (!config?.applies || !config?.moq?.enabled) return [];

    const qtyByProduct = new Map();
    const requiredByProduct = new Map();
    const titleByProduct = new Map();

    // Pick one quantity source and stick to it. Mixing them per product used to
    // count only the first line of a style, so a 2-line style read as 1 unit and
    // the notice flashed the wrong remaining count until /cart.js came back.
    const useLiveItems = Array.isArray(liveCartItems) && liveCartIsNewer(config);

    if (useLiveItems) {
      liveCartItems.forEach((item) => {
        if (isProtectionItem(item)) return;
        const productId = String(item.product_id);
        qtyByProduct.set(productId, (qtyByProduct.get(productId) || 0) + (Number(item.quantity) || 0));
        if (!titleByProduct.has(productId)) titleByProduct.set(productId, item.product_title || item.title || "");
      });
    } else {
      quantityItems(config).forEach((itemEl) => {
        const productId = String(itemEl.dataset.productId || "");
        if (!productId) return;
        const qty = Number(itemEl.dataset.qty || itemEl.querySelector(".custom-cart__qty-input")?.value || 0);
        qtyByProduct.set(productId, (qtyByProduct.get(productId) || 0) + (Number.isFinite(qty) ? qty : 0));
      });
    }

    // Liquid already resolved the metafield/default minimum for short styles,
    // which covers pages where no cart lines are in the DOM.
    (config.moq.shortfalls || []).forEach((entry) => {
      if (entry?.productId != null && entry.required) {
        requiredByProduct.set(String(entry.productId), Number(entry.required));
      }
    });

    document.querySelectorAll(ITEM_SELECTOR).forEach((itemEl) => {
      const productId = String(itemEl.dataset.productId || "");
      if (!productId) return;
      requiredByProduct.set(productId, moqRequiredForItem(itemEl, config));
      if (!titleByProduct.has(productId)) {
        const titleEl = itemEl.querySelector(".custom-cart__item-title, .cart-item__name");
        titleByProduct.set(productId, titleEl?.textContent?.trim() || "");
      }
    });

    if (!useLiveItems && !qtyByProduct.size && Array.isArray(config.moq.shortfalls)) {
      return config.moq.shortfalls;
    }

    const shortfalls = [];
    qtyByProduct.forEach((qty, productId) => {
      const required = Number(requiredByProduct.get(productId) || config.moq.defaultQty || 6);
      if (qty < required) {
        shortfalls.push({
          productId: Number(productId) || productId,
          qty,
          required,
          remaining: required - qty,
          title: titleByProduct.get(productId) || "",
        });
      }
    });
    return shortfalls;
  }

  function isMovBlocked(config) {
    if (!config?.applies || config.movEnabled === false) return false;
    return cartTotalCents(config) < Number(config.thresholdCents || 0);
  }

  function isMoqBlocked(config) {
    if (!config?.applies || !config?.moq?.enabled) return false;
    return computeMoqShortfalls(config).length > 0;
  }

  function isBlocked(config = readConfig()) {
    if (!config?.applies) return false;
    return isMovBlocked(config) || isMoqBlocked(config);
  }

  function remainingCents(config) {
    return Math.max(0, Number(config.thresholdCents || 0) - cartTotalCents(config));
  }

  function buildMovMessage(config, notice) {
    const template =
      notice?.getAttribute("data-b2b-template") ||
      config.messageTemplate ||
      "Add [amount] more to reach the [minimum] minimum order.";
    return template
      .split("[amount]")
      .join(formatMoney(remainingCents(config)))
      .split("[minimum]")
      .join(formatMoney(Number(config.thresholdCents || 0)));
  }

  function buildMoqMessage(template, shortfall) {
    return String(template || "Add [qty] more of this style to reach the [minimum] style minimum.")
      .split("[qty]")
      .join(String(shortfall.remaining))
      .split("[minimum]")
      .join(String(shortfall.required));
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

  function applyMovNotice(config) {
    const blocked = isMovBlocked(config);
    const notices = Array.from(document.querySelectorAll(NOTICE_SELECTOR));
    notices.forEach((notice, index) => {
      if (index > 0) {
        notice.remove();
        return;
      }

      notice.hidden = !blocked;
      notice.classList.toggle("is-visible", blocked);
      if (!blocked) return;

      if (config.messageTemplate) {
        notice.setAttribute("data-b2b-template", config.messageTemplate);
      }

      const nextText = buildMovMessage(config, notice);
      if (notice.textContent !== nextText) {
        notice.textContent = nextText;
      }
    });
  }

  function applyMoqOrderNotice(config) {
    // Only speaks up once the money minimum is satisfied — until then the MOV
    // notice already explains why checkout is blocked.
    const visible = isMoqBlocked(config) && !isMovBlocked(config);
    const message =
      config?.moq?.orderMessage ||
      "Please add the minimum required limit for each product to proceed to checkout";

    Array.from(document.querySelectorAll(MOQ_ORDER_SELECTOR)).forEach((notice, index) => {
      if (index > 0) {
        notice.remove();
        return;
      }
      notice.hidden = !visible;
      notice.classList.toggle("is-visible", visible);
      if (visible && notice.textContent !== message) notice.textContent = message;
    });
  }

  function applyMoqLineNotices(config) {
    const shortfalls = computeMoqShortfalls(config);
    const shortfallByProduct = new Map(shortfalls.map((entry) => [String(entry.productId), entry]));
    const template = config?.moq?.messageTemplate;

    document.querySelectorAll(ITEM_SELECTOR).forEach((itemEl) => {
      const productId = String(itemEl.dataset.productId || "");
      const shortfall = shortfallByProduct.get(productId);
      let notice = itemEl.querySelector(MOQ_LINE_SELECTOR);

      // Every line of a short style carries the notice, not just the last one.
      if (!shortfall) {
        notice?.remove();
        return;
      }

      const message = buildMoqMessage(template || notice?.getAttribute("data-b2b-moq-template"), shortfall);
      if (!notice) {
        notice = document.createElement("p");
        notice.className = "b2b-moq-line-notice is-visible";
        notice.setAttribute("data-b2b-moq-line-notice", "");
        notice.setAttribute("role", "status");
        // Cart page lines are table rows, which can only hold cells.
        (itemEl.querySelector(".cart-item__details") || itemEl).appendChild(notice);
      }

      notice.hidden = false;
      notice.classList.add("is-visible");
      notice.dataset.productId = productId;
      notice.dataset.moqRequired = String(shortfall.required);
      notice.dataset.moqQty = String(shortfall.qty);
      notice.dataset.moqRemaining = String(shortfall.remaining);
      if (template) notice.setAttribute("data-b2b-moq-template", template);
      if (notice.textContent !== message) notice.textContent = message;
    });

    document.querySelectorAll(MOQ_LINE_SELECTOR).forEach((notice) => {
      const productId = String(notice.dataset.productId || "");
      if (!shortfallByProduct.has(productId)) notice.remove();
    });
  }

  function lockElement(el, blocked) {
    if (!el) return;
    const isControl = el.tagName === "INPUT" || el.tagName === "BUTTON" || el.tagName === "A";
    if (isControl) {
      if (blocked) {
        el.disabled = true;
        if (el.tagName === "A") {
          if (!el.dataset.b2bHref) el.dataset.b2bHref = el.getAttribute("href") || "";
          el.setAttribute("href", "#");
          el.setAttribute("role", "link");
        }
      } else if (!el.classList.contains("is-loading")) {
        el.disabled = false;
        if (el.tagName === "A" && el.dataset.b2bHref != null) {
          el.setAttribute("href", el.dataset.b2bHref);
        }
      }
    }
    el.setAttribute("aria-disabled", blocked ? "true" : "false");
    el.classList.toggle("b2b-min-order-blocked", blocked);
    el.toggleAttribute("data-b2b-mov-blocked", blocked);
  }

  function applyCheckoutButtons(config) {
    const blocked = isBlocked(config);
    document.querySelectorAll("[data-custom-cart], #main-cart-footer, .mini-cart, .custom-cart__footer").forEach((root) => {
      root.toggleAttribute("data-b2b-mov-blocked", blocked);
    });
    document.querySelectorAll(CONFIG_SELECTOR).forEach((node) => {
      node.setAttribute("data-blocked", blocked ? "true" : "false");
    });
    document.querySelectorAll(CHECKOUT_SELECTOR).forEach((el) => lockElement(el, blocked));
    document.querySelectorAll('a[href*="/checkout"], a[href*="/checkouts/"]').forEach((el) => {
      if (isCheckoutUrl(el.getAttribute("href") || el.href)) lockElement(el, blocked);
    });
  }

  function syncCartPageNoticeWidth() {
    const slot = document.querySelector("#main-cart-footer .js-b2b-min-order");
    if (!slot) return;

    // Redo hides the theme button and renders its own inside a closed shadow
    // root, so measure whichever checkout element is actually showing.
    let button = null;
    slot
      .closest("#main-cart-footer")
      .querySelectorAll(
        "button[name='checkout'], .cart__checkout-button, redo-shopify-toggle, redo-checkout-buttons, [data-custom-checkout-btn]",
      )
      .forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (!button || rect.width > button.width)) button = rect;
      });

    const slotRect = slot.getBoundingClientRect();
    if (!button || !slotRect.width) {
      slot.style.removeProperty("--b2b-notice-width");
      slot.style.removeProperty("--b2b-notice-offset");
      return;
    }

    const width = `${Math.round(button.width)}px`;
    const offset = `${Math.max(0, Math.round(slotRect.right - button.right))}px`;
    if (slot.style.getPropertyValue("--b2b-notice-width") !== width) slot.style.setProperty("--b2b-notice-width", width);
    if (slot.style.getPropertyValue("--b2b-notice-offset") !== offset) slot.style.setProperty("--b2b-notice-offset", offset);
  }

  function watchCartPageLayout() {
    if (window.__b2bCartPageResize) return;
    const ctas = document.querySelector("#main-cart-footer .cart__ctas");
    if (!ctas || typeof ResizeObserver === "undefined") return;
    window.__b2bCartPageResize = new ResizeObserver(() => syncCartPageNoticeWidth());
    window.__b2bCartPageResize.observe(ctas);
  }

  function apply() {
    const config = readConfig();
    if (!config) return;
    applyMovNotice(config);
    applyMoqOrderNotice(config);
    applyMoqLineNotices(config);
    applyCheckoutButtons(config);
    syncCartPageNoticeWidth();
  }

  function applyFromCartEvent(event) {
    sawTotalStale = true;
    const detail = event?.detail || {};
    setLiveCartFromPayload(detail.cart);
    apply();
    refreshLiveCartTotal().then(() => apply());
  }

  function applyAfterSaw() {
    sawTotalStale = false;
    apply();
  }

  function isCheckoutTrigger(event) {
    const target = event.target;
    if (!target?.closest) return false;
    if (target.closest(CHECKOUT_SELECTOR)) return true;
    const link = target.closest("a[href]");
    if (link && isCheckoutUrl(link.getAttribute("href") || link.href)) return true;
    if (event.type === "submit") {
      const form = event.target;
      if (form?.id === "cart" || form?.querySelector?.(CHECKOUT_SELECTOR)) return true;
    }
    // On the cart page Redo replaces the checkout button with its own widget
    // ("Checkout+", "Checkout without free returns"), so treat anything in the
    // checkout area other than our notice as a checkout trigger.
    if (target.closest("#main-cart-footer") && !target.closest(".js-b2b-min-order")) {
      if (target.closest(".cart__ctas, [class*='redo' i], [id*='redo' i]")) return true;
      if (String(target.tagName || "").toLowerCase().startsWith("redo-")) return true;
    }
    return false;
  }

  function blockEvent(event) {
    if (!isBlocked()) return false;
    if (!isCheckoutTrigger(event)) return false;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    apply();
    const notice =
      document.querySelector(`${NOTICE_SELECTOR}.is-visible`) ||
      document.querySelector(`${MOQ_ORDER_SELECTOR}.is-visible`) ||
      document.querySelector(`${MOQ_LINE_SELECTOR}.is-visible`);
    notice?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    return true;
  }

  function interceptCheckoutNavigation() {
    if (window.__b2bMinOrderNavPatched) return;
    window.__b2bMinOrderNavPatched = true;

    const assign = window.location.assign.bind(window.location);
    const replace = window.location.replace.bind(window.location);

    window.location.assign = function (url) {
      if (isBlocked() && isCheckoutUrl(url)) {
        apply();
        return;
      }
      return assign(url);
    };

    window.location.replace = function (url) {
      if (isBlocked() && isCheckoutUrl(url)) {
        apply();
        return;
      }
      return replace(url);
    };

    try {
      const descriptor = Object.getOwnPropertyDescriptor(Location.prototype, "href");
      if (descriptor?.set && descriptor?.get) {
        Object.defineProperty(window.location, "href", {
          configurable: true,
          get() {
            return descriptor.get.call(this);
          },
          set(value) {
            if (isBlocked() && isCheckoutUrl(value)) {
              apply();
              return;
            }
            descriptor.set.call(this, value);
          },
        });
      }
    } catch (error) {
      // Some browsers block Location.prototype patches.
    }
  }

  function observeCheckoutRemounts() {
    if (window.__b2bMinOrderObserver) return;
    const root = document.querySelector("[data-custom-cart]") || document.body;
    window.__b2bMinOrderObserver = new MutationObserver(() => {
      window.clearTimeout(window.__b2bMinOrderObserveTimer);
      window.__b2bMinOrderObserveTimer = window.setTimeout(() => {
        if (readConfig()?.applies) apply();
      }, 16);
    });
    window.__b2bMinOrderObserver.observe(root, {
      childList: true,
      subtree: true,
    });
  }

  document.addEventListener("click", blockEvent, true);
  document.addEventListener("submit", blockEvent, true);
  document.addEventListener("custom-cart:updated", applyFromCartEvent);
  document.addEventListener("cart:updated", applyFromCartEvent);
  document.addEventListener("cartdrawer:opened", () => {
    observeCheckoutRemounts();
    // The drawer markup was just rendered from Liquid, so it is the freshest
    // quantity source. Drop the cached items so the first paint reads from it
    // rather than from whatever /cart.js last returned.
    liveCartItems = null;
    apply();
    refreshLiveCartTotal().then(() => apply());
  });
  document.addEventListener("saw:cart-checked", applyAfterSaw);

  function init() {
    interceptCheckoutNavigation();
    observeCheckoutRemounts();
    watchCartPageLayout();
    apply();
    refreshLiveCartTotal().then(() => apply());
  }

  window.B2BMinOrder = {
    isBlocked: () => isBlocked(),
    apply,
    applyFromCartEvent,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("load", init);
})();
