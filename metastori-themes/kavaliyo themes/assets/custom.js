/**
 * DEVELOPER DOCUMENTATION
 *
 * Include your custom JavaScript here.
 *
 * The theme Focal has been developed to be easily extensible through the usage of a lot of different JavaScript
 * events, as well as the usage of custom elements (https://developers.google.com/web/fundamentals/web-components/customelements)
 * to easily extend the theme and re-use the theme infrastructure for your own code.
 *
 * The technical documentation is summarized here.
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A VARIANT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a the user has changed the variant in a selector. The target get you the form
 * that triggered this event.
 *
 * Example:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   let variant = event.detail.variant; // Gives you access to the whole variant details
 *   let form = event.target;
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * MANUALLY CHANGE A VARIANT
 * ------------------------------------------------------------------------------------------------------------
 *
 * You may want to manually change the variant, and let the theme automatically adjust all the selectors. To do
 * that, you can get the DOM element of type "<product-variants>", and call the selectVariant method on it with
 * the variant ID.
 *
 * Example:
 *
 * const productVariantElement = document.querySelector('product-variants');
 * productVariantElement.selectVariant(12345);
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A NEW VARIANT IS ADDED TO THE CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a variant is added to the cart through a form selector (product page, quick
 * view...). This event DOES NOT include any change done through the cart on an existing variant. For that,
 * please refer to the "cart:updated" event.
 *
 * Example:
 *
 * document.addEventListener('variant:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN THE CART CONTENT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever the cart content has changed (if the quantity of a variant has changed, if a variant
 * has been removed, if the note has changed...). This event will also be emitted when a new variant has been
 * added (so you will receive both "variant:added" and "cart:updated"). Contrary to the variant:added event,
 * this event will give you the complete details of the cart.
 *
 * Example:
 *
 * document.addEventListener('cart:updated', function(event) {
 *   var cart = event.detail.cart; // Get the updated content of the cart
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * REFRESH THE CART/MINI-CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * If you are adding variants to the cart and would like to instruct the theme to re-render the cart, you cart
 * send the cart:refresh event, as shown below:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 *
 * ------------------------------------------------------------------------------------------------------------
 * USAGE OF CUSTOM ELEMENTS
 * ------------------------------------------------------------------------------------------------------------
 *
 * Our theme makes extensive use of HTML custom elements. Custom elements are an awesome way to extend HTML
 * by creating new elements that carry their own JavaScript for adding new behavior. The theme uses a large
 * number of custom elements, but the two most useful are drawer and popover. Each of those components add
 * a "open" attribute that you can toggle on and off. For instance, let's say you would like to open the cart
 * drawer, whose id is "mini-cart", you simply need to retrieve it and set its "open" attribute to true (or
 * false to close it):
 *
 * document.getElementById('mini-cart').open = true;
 *
 * Thanks to the power of custom elements, the theme will take care automagically of trapping focus, maintaining
 * proper accessibility attributes...
 *
 * If you would like to create your own drawer, you can re-use the <drawer-content> content. Here is a simple
 * example:
 *
 * // Make sure you add "aria-controls", "aria-expanded" and "is" HTML attributes to your button:
 * <button type="button" is="toggle-button" aria-controls="id-of-drawer" aria-expanded="false">Open drawer</button>
 *
 * <drawer-content id="id-of-drawer">
 *   Your content
 * </drawer-content>
 *
 * The nice thing with custom elements is that you do not actually need to instantiate JavaScript yourself: this
 * is done automatically as soon as the element is inserted to the DOM.
 *
 * ------------------------------------------------------------------------------------------------------------
 * THEME DEPENDENCIES
 * ------------------------------------------------------------------------------------------------------------
 *
 * While the theme tries to keep outside dependencies as small as possible, the theme still uses third-party code
 * to power some of its features. Here is the list of all dependencies:
 *
 * "vendor.js":
 *
 * The vendor.js contains required dependencies. This file is loaded in parallel of the theme file.
 *
 * - custom-elements polyfill (used for built-in elements on Safari - v1.0.0): https://github.com/ungap/custom-elements
 * - web-animations-polyfill (used for polyfilling WebAnimations on Safari 12, this polyfill will be removed in 1 year - v2.3.2): https://github.com/web-animations/web-animations-js
 * - instant-page (v5.1.0): https://github.com/instantpage/instant.page
 * - tocca (v2.0.9); https://github.com/GianlucaGuarini/Tocca.js/
 * - seamless-scroll-polyfill (v2.0.0): https://github.com/magic-akari/seamless-scroll-polyfill
 *
 * "flickity.js": v2.2.0 (with the "fade" package). Flickity is only loaded on demand if there is a product image
 * carousel on the page. Otherwise it is not loaded.
 *
 * "photoswipe": v4.1.3. PhotoSwipe is only loaded on demand to power the zoom feature on product page. If the zoom
 * feature is disabled, then this script is never loaded.
 */

// Global Full Width Scroller Slider Manager
class GlobalScrollerManager {
  constructor() {
    this.sections = [];
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupAllSections());
    } else {
      this.setupAllSections();
    }
  }

  setupAllSections() {
    const sections = document.querySelectorAll(".full_width_scroller_section");

    if (sections.length === 0) {
      return;
    }

    let scrollerIndex = 0;
    sections.forEach((section) => {
      section.querySelectorAll(".scroller").forEach((scrollerEl) => {
        const scrollerSection = new ScrollerSection(scrollerEl, scrollerIndex++);
        this.sections.push(scrollerSection);
      });
    });

    this.setupResizeListener();
  }

  setupResizeListener() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.reEvaluateAllSections();
      }, 250);
    });
  }

  reEvaluateAllSections() {
    this.sections.forEach((section) => {
      if (section.reEvaluateScrollable) {
        section.reEvaluateScrollable();
      }
    });
  }

  addSection(sectionElement) {
    sectionElement.querySelectorAll(".scroller").forEach((scrollerEl) => {
      const scrollerSection = new ScrollerSection(scrollerEl, this.sections.length);
      this.sections.push(scrollerSection);
    });
  }
}

// Individual Scroller Section Class
// scrollerElement: the .scroller div that actually scrolls (pairs with its own prev/next inside the same row)
class ScrollerSection {
  constructor(scrollerElement, sectionIndex) {
    this.scroller = scrollerElement;
    this.sectionIndex = sectionIndex;
    this.prevButton = null;
    this.nextButton = null;

    this.init();
  }

  init() {
    if (!this.scroller) {
      console.warn(`Scroller not found at index ${this.sectionIndex}`);
      return;
    }

    this.prevButton = this.scroller.querySelector(".prev-next-button--prev");
    this.nextButton = this.scroller.querySelector(".prev-next-button--next");

    const multiColumn = this.scroller.closest("multi-column");
    this.multiColumnHandlesClicks = !!(multiColumn && !multiColumn.hasAttribute("stack"));

    if (this.isScrollable()) {
      if (!this.multiColumnHandlesClicks) {
        this.setupButtonNavigation();
      }
      this.setupScrollListener();
      this.scrollListenerSetup = true;
      this.updateButtonStates();
    } else {
      this.hideNavigationButtons();
    }
  }

  isScrollable() {
    if (!this.scroller) return false;

    const scrollWidth = this.scroller.scrollWidth;
    const clientWidth = this.scroller.clientWidth;

    return scrollWidth > clientWidth + 1;
  }

  setupButtonNavigation() {
    if (this.prevButton) {
      this.prevButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.scrollToDirection("prev");
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.scrollToDirection("next");
      });
    }
  }

  scrollToDirection(direction) {
    if (!this.scroller) return;

    const scrollAmount = 300;
    const currentScroll = this.scroller.scrollLeft;

    if (direction === "prev") {
      this.scroller.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: "smooth",
      });
    } else {
      this.scroller.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  }

  setupScrollListener() {
    this.scroller.addEventListener("scroll", () => {
      this.updateButtonStates();
    });
  }

  updateButtonStates() {
    if (!this.prevButton || !this.nextButton) return;

    const scrollLeft = this.scroller.scrollLeft;
    const scrollWidth = this.scroller.scrollWidth;
    const clientWidth = this.scroller.clientWidth;

    if (scrollLeft <= 0) {
      this.prevButton.disabled = true;
      this.prevButton.style.opacity = "0.5";
    } else {
      this.prevButton.disabled = false;
      this.prevButton.style.opacity = "1";
    }

    if (scrollLeft >= scrollWidth - clientWidth - 1) {
      this.nextButton.disabled = true;
      this.nextButton.style.opacity = "0.5";
    } else {
      this.nextButton.disabled = false;
      this.nextButton.style.opacity = "1";
    }
  }

  reEvaluateScrollable() {
    if (this.isScrollable()) {
      if (this.prevButton) this.prevButton.style.display = "";
      if (this.nextButton) this.nextButton.style.display = "";

      if (!this.scrollListenerSetup) {
        if (!this.multiColumnHandlesClicks) {
          this.setupButtonNavigation();
        }
        this.setupScrollListener();
        this.scrollListenerSetup = true;
      }
      this.updateButtonStates();
    } else {
      this.hideNavigationButtons();
      this.scrollListenerSetup = false;
    }
  }

  hideNavigationButtons() {
    if (this.prevButton) {
      this.prevButton.style.display = "none";
    }
    if (this.nextButton) {
      this.nextButton.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.globalScrollerManager = new GlobalScrollerManager();
});

if (document.readyState === "complete") {
  window.globalScrollerManager = new GlobalScrollerManager();
}

window.GlobalScrollerManager = GlobalScrollerManager;

// Sticky header detection
(function () {
  const header = document.querySelector("store-header[sticky]");
  if (!header) return;

  const html = document.documentElement;

  function getStickyTopPx() {
    const topVal = getComputedStyle(header).top;
    const n = parseFloat(topVal);
    return Number.isFinite(n) ? n : 0;
  }

  let ticking = false;
  let stickyTop = getStickyTopPx();

  function update() {
    stickyTop = getStickyTopPx();

    const headerTop = header.getBoundingClientRect().top;
    const atSticky = headerTop <= stickyTop + 0.5;
    html.classList.toggle("header-sticky", atSticky);

    ticking = false;
  }

  function onScrollOrResize() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);

  update();
})();

// Multi-column scroller custom pagination
class MultiColumnScroller {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.scroller = document.querySelector(`[data-multicolumn-scroller][data-section-id="${sectionId}"]`);
    if (!this.scroller) return;

    this.inner = this.scroller.querySelector(".multi-column__inner");
    this.items = Array.from(this.inner?.querySelectorAll(".multi-column__item") || []);

    this.controls = document.querySelector(`[data-multicolumn-controls][data-section-id="${sectionId}"]`);
    this.prevBtn = this.controls?.querySelector("[data-prev]");
    this.nextBtn = this.controls?.querySelector("[data-next]");
    this.dots = Array.from(this.controls?.querySelectorAll("[data-index]") || []);

    this.positions = [];
    this.currentIndex = 0;
    this.ticking = false;

    if (this.items.length) {
      this.computePositions();
      this.bindEvents();
      this.scrollToIndex(0, false);
    }
  }

  computePositions() {
    if (!this.items.length) return;
    const base = this.items[0].offsetLeft;
    this.positions = this.items.map((el) => el.offsetLeft - base);
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.positions.length - 1));
    this.updateUI();
  }

  scrollToIndex(index, smooth = true) {
    this.currentIndex = Math.max(0, Math.min(index, this.positions.length - 1));
    const target = this.positions[this.currentIndex] || 0;
    this.scroller.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
    this.updateUI();
  }

  updateUI() {
    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex <= 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex >= this.positions.length - 1;
    if (this.dots.length) {
      this.dots.forEach((dot, i) => dot.classList.toggle("is-active", i === this.currentIndex));
    }
  }

  nearestIndexFromScrollLeft(sl) {
    let nearest = 0,
      min = Infinity;
    for (let i = 0; i < this.positions.length; i++) {
      const diff = Math.abs(this.positions[i] - sl);
      if (diff < min) {
        min = diff;
        nearest = i;
      }
    }
    return nearest;
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.currentIndex = this.nearestIndexFromScrollLeft(this.scroller.scrollLeft);
      this.updateUI();
      this.ticking = false;
    });
  }

  bindEvents() {
    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.scrollToIndex(this.currentIndex - 1));
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.scrollToIndex(this.currentIndex + 1));
    if (this.dots.length) {
      this.dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          this.scrollToIndex(parseInt(dot.dataset.index, 10));
        });
      });
    }

    this.scroller.addEventListener("scroll", () => this.onScroll(), { passive: true });
    window.addEventListener("resize", () => this.computePositions());

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => this.computePositions());
      ro.observe(this.inner);
      this.items.forEach((el) => ro.observe(el));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-multicolumn-scroller]").forEach((el) => {
    const id = el.getAttribute("data-section-id");
    new MultiColumnScroller(id);
  });
});

document.addEventListener("shopify:section:load", (e) => {
  new MultiColumnScroller(e.detail.sectionId);
});

// Dynamic Color Swatch Manager
class DynamicSwatchManager {
  constructor() {
    this.containers = [];
    this.resizeObserver = null;
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupAllContainers());
    } else {
      this.setupAllContainers();
    }

    document.addEventListener("shopify:section:load", () => {
      setTimeout(() => this.setupAllContainers(), 100);
    });

    this.setupResizeObserver();
  }

  setupAllContainers() {
    const containers = document.querySelectorAll("[data-swatch-container]");

    containers.forEach((container) => {
      if (container.dataset.swatchInitialized === "true") {
        this.calculateSwatches(container);
        return;
      }

      container.dataset.swatchInitialized = "true";
      this.calculateSwatches(container);

      if (this.resizeObserver) {
        this.resizeObserver.observe(container);
      }
    });
  }

  setupResizeObserver() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        document.querySelectorAll("[data-swatch-container]").forEach((container) => {
          this.calculateSwatches(container);
        });
      }, 150);
    });

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.calculateSwatches(entry.target);
        });
      });

      document.querySelectorAll("[data-swatch-container]").forEach((container) => {
        this.resizeObserver.observe(container);
      });
    }
  }

  calculateSwatches(container) {
    const swatches = Array.from(container.querySelectorAll(".color-swatch--dynamic"));
    const remainingIndicator = container.querySelector("[data-swatch-remaining]");
    const remainingCountSpan = container.querySelector("[data-remaining-count]");

    if (!swatches.length || !remainingIndicator) return;

    swatches.forEach((swatch) => {
      swatch.style.display = "";
    });
    remainingIndicator.style.display = "";

    const containerWidth = container.offsetWidth;
    if (containerWidth === 0) {
      setTimeout(() => this.calculateSwatches(container), 100);
      return;
    }

    const computedStyle = window.getComputedStyle(container);
    const gap = parseFloat(computedStyle.gap) || 8;

    const firstSwatch = swatches[0];
    if (!firstSwatch) return;

    const swatchWidth = firstSwatch.offsetWidth;
    if (swatchWidth === 0) {
      setTimeout(() => this.calculateSwatches(container), 100);
      return;
    }

    const remainingIndicatorWidth = remainingIndicator.offsetWidth || swatchWidth;

    let maxVisible = 0;

    const allSwatchesWidth = swatches.length * swatchWidth + (swatches.length - 1) * gap;

    if (allSwatchesWidth <= containerWidth) {
      swatches.forEach((swatch) => {
        swatch.style.display = "";
      });
      remainingIndicator.style.display = "none";
      return;
    }

    for (let i = 1; i <= swatches.length; i++) {
      const visibleSwatchesWidth = i * swatchWidth + (i - 1) * gap;
      const widthWithIndicator = visibleSwatchesWidth + gap + remainingIndicatorWidth;

      if (widthWithIndicator <= containerWidth) {
        maxVisible = i;
      } else {
        break;
      }
    }

    const visibleCount = Math.max(1, maxVisible);
    const remainingCount = swatches.length - visibleCount;

    swatches.forEach((swatch, index) => {
      if (index < visibleCount) {
        swatch.style.display = "";
      } else {
        swatch.style.display = "none";
      }
    });

    if (remainingCount > 0) {
      if (remainingCountSpan) {
        remainingCountSpan.textContent = `${remainingCount}+`;
      }
      remainingIndicator.style.display = "";
    } else {
      remainingIndicator.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.dynamicSwatchManager = new DynamicSwatchManager();
});

if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(() => {
    window.dynamicSwatchManager = new DynamicSwatchManager();
  }, 100);
}

window.DynamicSwatchManager = DynamicSwatchManager;

// Wishlist Add to Cart Handler
(function () {
  let refreshTimeout = null;
  let isRefreshing = false;
  let lastRefreshTime = 0;
  const REFRESH_DEBOUNCE_MS = 1000;

  function refreshCart() {
    if (!window.themeVariables || !window.themeVariables.routes || !window.themeVariables.routes.cartUrl) {
      return;
    }

    const now = Date.now();
    if (isRefreshing || (now - lastRefreshTime) < REFRESH_DEBOUNCE_MS) {
      return;
    }

    isRefreshing = true;
    lastRefreshTime = now;

    fetch(`${window.themeVariables.routes.cartUrl}.js`)
      .then(async (response) => {
        if (!response.ok) {
          isRefreshing = false;
          return;
        }
        const cartContent = await response.json();

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
              openMiniCart: window.themeVariables.settings.cartType === "drawer",
            },
          })
        );

        isRefreshing = false;
      })
      .catch((error) => {
        console.warn("Failed to refresh cart:", error);
        isRefreshing = false;
      });
  }

  function setupWishlistCartHandler() {
    const processedButtons = new WeakSet();

    function handleButtonClick(button) {
      if (processedButtons.has(button)) {
        return;
      }

      const originalText = button.textContent.trim();
      const originalAriaLabel = button.getAttribute("aria-label") || "";
      let checkInterval = null;
      let timeoutId = null;

      const cleanup = () => {
        if (checkInterval) clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
        processedButtons.delete(button);
      };

      checkInterval = setInterval(() => {
        const currentText = button.textContent.trim();
        const currentAriaLabel = button.getAttribute("aria-label") || "";

        const textChanged = currentText !== originalText;
        const ariaChanged = currentAriaLabel !== originalAriaLabel;
        const isSuccessText = currentText.includes("hinzugefügt") ||
          currentText.includes("Added") ||
          currentAriaLabel.includes("hinzugefügt") ||
          currentAriaLabel.includes("Added");

        if ((textChanged || ariaChanged) && isSuccessText) {
          cleanup();
          setTimeout(() => {
            refreshCart();
          }, 300);
        }
      }, 100);

      timeoutId = setTimeout(() => {
        cleanup();
      }, 5000);
    }

    document.addEventListener("click", (event) => {
      const button = event.target.closest(".swym-storefront-layout-grid-item-add-to-cart-button");
      if (button && button.getAttribute("data-action") === "add-to-cart") {
        handleButtonClick(button);
      }
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupWishlistCartHandler);
  } else {
    setupWishlistCartHandler();
  }
})();

// Kavalio Care and Free Gift quantity guard
(function () {
  function clampInputToOne(input) {
    if (!input) return;
    var value = parseInt(input.value || "1", 10);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 1) value = 1;
    input.value = String(value);
  }

  document.addEventListener(
    "click",
    function (event) {
      var plusButton = event.target.closest(
        ".line-item--kavalio-care .quantity-selector__button, .line-item--free-gift .quantity-selector__button"
      );
      if (!plusButton) return;

      var selector = plusButton.closest(".quantity-selector");
      if (!selector) return;
      var buttons = selector.querySelectorAll(".quantity-selector__button");
      if (!buttons.length) return;

      var isPlusButton = buttons[buttons.length - 1] === plusButton;
      if (!isPlusButton) return;

      var input = selector.querySelector(
        ".quantity-selector__input, input[type='number']"
      );
      if (!input) return;

      var current = parseInt(input.value || "1", 10);
      if (isNaN(current)) current = 1;

      if (current >= 1) {
        event.preventDefault();
        event.stopPropagation();
        clampInputToOne(input);
      }
    },
    true
  );

  document.addEventListener("change", function (event) {
    var input = event.target;
    if (
      !input.matches(
        ".line-item--kavalio-care .quantity-selector__input, .line-item--kavalio-care input[type='number'], .line-item--free-gift .quantity-selector__input, .line-item--free-gift input[type='number']"
      )
    ) {
      return;
    }
    clampInputToOne(input);
  });
})();

// Kavalio Garantie: auto-remove when its main product is no longer in the cart
(function () {
  var guaranteeRemovalInProgress = false;
  var guaranteeProductTitle = "3 Jahre kavalio Garantie";

  function normalizeTitle(str) {
    if (str == null || str === "") return "";
    return String(str).trim().replace(/\s+/g, " ");
  }

  function removeOrphanedGuarantees(cartContent) {
    if (!cartContent || !Array.isArray(cartContent.items) || cartContent.items.length === 0) return false;
    if (guaranteeRemovalInProgress) return false;

    var mainProductTitles = new Set();
    cartContent.items.forEach(function (item) {
      var isGuaranteeLine =
        item.product_title === guaranteeProductTitle &&
        item.properties &&
        item.properties["For product"] != null &&
        String(item.properties["For product"]).trim() !== "";
      if (!isGuaranteeLine && item.product_title) {
        mainProductTitles.add(normalizeTitle(item.product_title));
      }
    });

    var updates = {};
    cartContent.items.forEach(function (item) {
      if (item.product_title !== guaranteeProductTitle) return;
      var forProduct = item.properties && item.properties["For product"];
      if (forProduct == null || forProduct === "") return;
      var forTitle = normalizeTitle(forProduct);
      if (forTitle === "") return;
      if (mainProductTitles.has(forTitle)) return;
      var lineKey = item.key != null ? String(item.key) : String(item.id);
      updates[lineKey] = 0;
    });

    if (Object.keys(updates).length === 0) return false;

    guaranteeRemovalInProgress = true;
    var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || "/";
    fetch(root + "cart/update.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: updates }),
    })
      .then(function (res) { return res.json(); })
      .then(function (newCart) {
        guaranteeRemovalInProgress = false;
        document.documentElement.dispatchEvent(
          new CustomEvent("cart:updated", { bubbles: true, detail: { cart: newCart } })
        );
        document.documentElement.dispatchEvent(
          new CustomEvent("cart:refresh", {
            bubbles: true,
            detail: { cart: newCart, forceFullRefresh: true },
          })
        );
      })
      .catch(function () {
        guaranteeRemovalInProgress = false;
      });
    return true;
  }

  document.documentElement.addEventListener("cart:updated", function (e) {
    if (e.detail && e.detail.cart) removeOrphanedGuarantees(e.detail.cart);
  });

  function checkGuaranteesOnLoad() {
    fetch("/cart.js")
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (cart) {
        if (cart) removeOrphanedGuarantees(cart);
      })
      .catch(function () { });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkGuaranteesOnLoad);
  } else {
    checkGuaranteesOnLoad();
  }
})();

// Cart drawer: show gift card "Gute Wahl" message ONLY when cart has only gift cards
(function () {
  var STORAGE_KEY = "kavalio_gc_good_choice_flash";
  var PROP_KEY = "_kavalio_gift_card_template";

  document.documentElement.addEventListener("variant:added", function (e) {
    try {
      var variant = e && e.detail && e.detail.variant ? e.detail.variant : null;
      var props = variant && variant.properties ? variant.properties : null;
      if (!props) return;
      var isGiftCard = String(props[PROP_KEY] || "").trim() === "1";
      if (isGiftCard) sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (err) {
      // ignore
    }
  });

  function applyGoodChoiceMessage(root) {
    root = root || document;
    var blocks = root.querySelectorAll("[data-ed-good-choice]");
    if (!blocks || !blocks.length) return;
    blocks.forEach(function (block) {
      var onlyGiftCards = block.getAttribute("data-only-giftcards") === "true";
      var regularEl = block.querySelector("[data-ed-good-choice-regular]");
      var giftEl = block.querySelector("[data-ed-good-choice-giftcard]");
      if (!regularEl || !giftEl) return;

      if (onlyGiftCards) {
        regularEl.setAttribute("hidden", "hidden");
        giftEl.removeAttribute("hidden");
      } else {
        giftEl.setAttribute("hidden", "hidden");
        regularEl.removeAttribute("hidden");
      }
    });
  }

  function scheduleApply() {
    window.setTimeout(function () {
      applyGoodChoiceMessage(document);
    }, 0);
  }

  document.documentElement.addEventListener("cart:refresh", scheduleApply);
  document.documentElement.addEventListener("cart:updated", scheduleApply);
  document.documentElement.addEventListener("cart:drawer:rendered", scheduleApply);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleApply);
  } else {
    scheduleApply();
  }
})();

// Boost AI Search: ensure wishlist buttons use same SVG icon as collections
(function () {
  var WISHLIST_HEART_SVG =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M19.6706 5.4736C17.6806 3.8336 14.7206 4.1236 12.8906 5.9536L12.0006 6.8436L11.1106 5.9536C9.29063 4.1336 6.32064 3.8336 4.33064 5.4736C2.05064 7.3536 1.93063 10.7436 3.97063 12.7836L11.6406 20.4536C11.8406 20.6536 12.1506 20.6536 12.3506 20.4536L20.0206 12.7836C22.0706 10.7436 21.9506 7.3636 19.6706 5.4736Z" stroke="#000000" stroke-width="1.7px" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>' +
    "</svg>";

  function applyWishlistIcon(root) {
    var scope = root || document;
    var buttons = scope.querySelectorAll(
      '.boost-sd__product-wishlist button.swym-button, .boost-sd__product-wishlist button.swym-wishlist-collections-v2'
    );

    buttons.forEach(function (btn) {
      if (btn.__kavalioWishlistIconApplied) return;
      btn.__kavalioWishlistIconApplied = true;

      // If Swym already rendered an icon SVG, do not override it
      if (btn.querySelector("svg")) return;

      btn.insertAdjacentHTML("beforeend", WISHLIST_HEART_SVG);
    });
  }

  var wishlistObserver = new MutationObserver(function () {
    applyWishlistIcon();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyWishlistIcon();
      wishlistObserver.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    applyWishlistIcon();
    wishlistObserver.observe(document.body, { childList: true, subtree: true });
  }
})();

// Boost AI Search: replace Boost ATC/quick-view buttons with theme form and quick-view so cart drawer works
/* Boost AI search page */
(function () {
  var BOOST_SECTION_ID = "boost-search";
  var BOOST_BLOCK_ID = "boost";
  var FALLBACK_QUICK_ATC_ICON_SVG =
    '<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.25 20.25C10.25 20.5467 10.162 20.8367 9.9972 21.0834C9.83238 21.33 9.59811 21.5223 9.32403 21.6358C9.04994 21.7494 8.74834 21.7791 8.45736 21.7212C8.16639 21.6633 7.89912 21.5204 7.68934 21.3107C7.47956 21.1009 7.3367 20.8336 7.27882 20.5426C7.22094 20.2517 7.25065 19.9501 7.36418 19.676C7.47771 19.4019 7.66997 19.1676 7.91665 19.0028C8.16332 18.838 8.45333 18.75 8.75 18.75C9.14782 18.75 9.52936 18.908 9.81066 19.1893C10.092 19.4706 10.25 19.8522 10.25 20.25ZM18.5 18.75C18.2033 18.75 17.9133 18.838 17.6666 19.0028C17.42 19.1676 17.2277 19.4019 17.1142 19.676C17.0006 19.9501 16.9709 20.2517 17.0288 20.5426C17.0867 20.8336 17.2296 21.1009 17.4393 21.3107C17.6491 21.5204 17.9164 21.6633 18.2074 21.7212C18.4983 21.7791 18.7999 21.7494 19.074 21.6358C19.3481 21.5223 19.5824 21.33 19.7472 21.0834C19.912 20.8367 20 20.5467 20 20.25C20 19.8522 19.842 19.4706 19.5607 19.1893C19.2794 18.908 18.8978 18.75 18.5 18.75ZM22.9728 6.95062L20.5691 15.6019C20.4369 16.0745 20.1542 16.4911 19.7639 16.7885C19.3736 17.0859 18.897 17.2479 18.4062 17.25H9.14C8.64784 17.2498 8.16926 17.0886 7.77725 16.791C7.38523 16.4935 7.1013 16.0758 6.96875 15.6019L3.68 3.75H2C1.80109 3.75 1.61032 3.67098 1.46967 3.53033C1.32902 3.38968 1.25 3.19891 1.25 3C1.25 2.80109 1.32902 2.61032 1.46967 2.46967C1.61032 2.32902 1.80109 2.25 2 2.25H4.25C4.41397 2.24997 4.57343 2.30367 4.70398 2.40289C4.83452 2.50211 4.92895 2.64138 4.97281 2.79938L5.86156 6H22.25C22.3656 5.99998 22.4797 6.02669 22.5833 6.07805C22.6869 6.1294 22.7772 6.20401 22.8472 6.29605C22.9171 6.38809 22.9649 6.49506 22.9867 6.60861C23.0085 6.72216 23.0037 6.83922 22.9728 6.95062ZM21.2628 7.5H6.27875L8.41719 15.2006C8.46105 15.3586 8.55548 15.4979 8.68602 15.5971C8.81657 15.6963 8.97603 15.75 9.14 15.75H18.4062C18.5702 15.75 18.7297 15.6963 18.8602 15.5971C18.9908 15.4979 19.0852 15.3586 19.1291 15.2006L21.2628 7.5Z" fill="currentColor"></path></svg>';
  var BOOST_SALE_BADGE_SVG =
    '<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M15.7308 10.2371L16.822 9.14586C17.1511 8.81686 17.3361 8.37067 17.3364 7.90534V4.24965C17.3364 3.78462 17.1515 3.33867 16.8225 3.01C16.4935 2.68133 16.0474 2.49688 15.5824 2.49725H11.9267C11.4622 2.49725 11.0168 2.68209 10.6887 3.0108L3.6774 10.0221C3.34872 10.3507 3.16406 10.7965 3.16406 11.2613C3.16406 11.7261 3.34872 12.1719 3.6774 12.5006L7.33309 16.1563C7.66176 16.485 8.10754 16.6696 8.57236 16.6696C9.03717 16.6696 9.48295 16.485 9.81162 16.1563L10.9037 15.0642" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.4188 10.0005C16.4907 10.0005 18.1704 11.6801 18.1704 13.7521C18.1704 15.824 16.4907 17.5036 14.4188 17.5036C12.3469 17.5036 10.6672 15.824 10.6672 13.7521C10.6672 11.6801 12.3469 10.0005 14.4188 10.0005" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.8316 6.21162C13.8316 6.32673 13.7382 6.42004 13.6231 6.42004C13.508 6.42004 13.4147 6.32673 13.4147 6.21162C13.4147 6.09652 13.508 6.0032 13.6231 6.0032" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.6232 6.00324C13.7383 6.00324 13.8316 6.09656 13.8316 6.21166" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.578 14.7772L15.5055 12.8497" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.8495 15.0755C15.862 15.0881 15.862 15.1085 15.8495 15.1211C15.8369 15.1337 15.8164 15.1337 15.8038 15.1211C15.7978 15.1151 15.7943 15.1069 15.7943 15.0983C15.7943 15.0898 15.7978 15.0816 15.8038 15.0755C15.8165 15.0632 15.8367 15.0632 15.8495 15.0755" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.2338 12.5514C13.2257 12.5433 13.2225 12.5314 13.2255 12.5202C13.2285 12.5091 13.2372 12.5004 13.2483 12.4974C13.2594 12.4945 13.2713 12.4976 13.2794 12.5058C13.2855 12.5118 13.289 12.52 13.289 12.5286C13.289 12.5372 13.2855 12.5454 13.2794 12.5514C13.2667 12.5637 13.2465 12.5637 13.2338 12.5514" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

  function getQuickAtcIconHtml() {
    var existingIcon =
      document.querySelector(".quick_atc_btn_wrap .ed-product-item__quick-form svg") ||
      document.querySelector(".quick_atc_btn_wrap svg") ||
      null;
    return existingIcon ? existingIcon.outerHTML : FALLBACK_QUICK_ATC_ICON_SVG;
  }

  function getRoutes() {
    var r = window.themeVariables && window.themeVariables.routes;
    if (!r) return null;
    var cartAdd = (r.cartAddUrl || "/cart/add").replace(/\.js$/, "");
    var root = typeof r.rootUrlWithoutSlash === "string" ? r.rootUrlWithoutSlash : "";
    return { cartAddUrl: cartAdd, root: root };
  }

  function getSectionId() {
    var input = document.querySelector('input[name="section-id"]');
    if (input && input.value) return input.value;
    var form = document.querySelector('form[is="product-form"]');
    if (form && form.id) {
      var m = form.id.match(/product_form_(.+?)__\d+_\d+$/);
      if (m) return m[1];
    }
    return BOOST_SECTION_ID;
  }

  function parseDataProduct(el) {
    var raw = el && el.getAttribute("data-product");
    if (!raw) return null;
    try {
      return JSON.parse(raw.replace(/&quot;/g, '"'));
    } catch (e) {
      return null;
    }
  }

  function getHandle(productItem) {
    var data = parseDataProduct(productItem);
    if (data && data.handle) return data.handle;
    var link = productItem.querySelector('a.boost-sd__product-link[href*="/products/"]');
    if (link) {
      var m = (link.getAttribute("href") || "").match(/\/products\/([^/?#]+)/);
      if (m) return m[1];
    }
    return null;
  }

  function isAddToCartButton(btn) {
    var meta = btn && btn.getAttribute("data-metadata");
    if (!meta) return false;
    try {
      var o = JSON.parse(meta.replace(/&quot;/g, '"'));
      return o && o.action && o.action.addToCart;
    } catch (e) {
      return false;
    }
  }

  function isQuickViewButton(btn) {
    var meta = btn && btn.getAttribute("data-metadata");
    if (!meta) return false;
    try {
      var o = JSON.parse(meta.replace(/&quot;/g, '"'));
      return o && o.action && o.action.quickView;
    } catch (e) {
      return false;
    }
  }

  function rememberBoostVariantHandles(handle, product) {
    if (!handle || !product || !product.variants) return;
    window.__kavalioVariantHandles = window.__kavalioVariantHandles || {};
    product.variants.forEach(function (v) {
      if (v && v.id) window.__kavalioVariantHandles[String(v.id)] = handle;
    });
  }

  function kavalioSetFormDeliveryInputs(form, variantId, entry) {
    if (!form || !variantId || !entry || !entry.range) return;
    var rangeInput = form.querySelector("[data-kavalio-delivery-range]");
    var lssInput = form.querySelector("[data-kavalio-lss-override]");
    if (!rangeInput) {
      rangeInput = document.createElement("input");
      rangeInput.type = "hidden";
      rangeInput.name = "properties[_kavalio_delivery_range]";
      rangeInput.setAttribute("data-kavalio-delivery-range", "");
      form.appendChild(rangeInput);
    }
    if (!lssInput) {
      lssInput = document.createElement("input");
      lssInput.type = "hidden";
      lssInput.name = "properties[_kavalio_lss_override]";
      lssInput.setAttribute("data-kavalio-lss-override", "");
      form.appendChild(lssInput);
    }
    rangeInput.value = entry.range;
    lssInput.value = entry.lssOverride ? "1" : "0";
  }

  function attachKavalioDeliveryToForm(form, handle, routes, variantId) {
    if (!form || !handle || !routes) return;
    var sectionKey = "kavalio-delivery-data";
    var url =
      (routes.root || "") +
      "/products/" +
      encodeURIComponent(handle) +
      "?sections=" +
      sectionKey;
    fetch(url)
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        if (!data || !data[sectionKey]) return;
        var tmp = document.createElement("div");
        tmp.innerHTML = data[sectionKey];
        var script = tmp.querySelector("script[data-kavalio-delivery-data]");
        if (!script || !variantId) return;
        try {
          var map = JSON.parse(script.textContent || "{}");
          kavalioSetFormDeliveryInputs(form, variantId, map[String(variantId)]);
        } catch (e) {
          // ignore invalid delivery JSON
        }
      })
      .catch(function () {});
  }

  function initBoostProductForm(form, handle, variantId, routes) {
    if (!form) return;
    if (typeof customElements !== "undefined" && customElements.upgrade) {
      customElements.upgrade(form);
    }
    if (handle && routes && variantId) {
      attachKavalioDeliveryToForm(form, handle, routes, variantId);
    }
  }

  function buildThemeFormHtml(variantId, productId, sectionId, cartAddUrl, atcLabel, handle) {
    var formId = "product_form_" + sectionId + "_" + BOOST_BLOCK_ID + "_" + productId + "_0";
    var iconHtml = getQuickAtcIconHtml();
    atcLabel = atcLabel || "Add to cart";
    var handleAttr = handle ? ' data-product-handle="' + String(handle).replace(/"/g, "&quot;") + '"' : "";
    return (
      '<div class="quick_atc_btn_wrap">' +
      '<form method="post" action="' +
      (cartAddUrl || "/cart/add") +
      '" id="' +
      formId +
      '" accept-charset="UTF-8" class="ed-product-item__quick-form" enctype="multipart/form-data" is="product-form"' +
      handleAttr +
      ">" +
      '<input type="hidden" name="form_type" value="product">' +
      '<input type="hidden" name="utf8" value="✓">' +
      '<input type="hidden" name="quantity" value="1">' +
      '<input type="hidden" name="id" value="' +
      variantId +
      '">' +
      '<input type="hidden" name="properties[_kavalio_delivery_range]" value="1-2" data-kavalio-delivery-range>' +
      '<input type="hidden" name="properties[_kavalio_lss_override]" value="0" data-kavalio-lss-override>' +
      '<button is="loader-button" type="submit" class="button button--primary button--text button--full hidden-touch" aria-label="' +
      atcLabel +
      '">' +
      iconHtml +
      "</button>" +
      '<button type="submit" class="product-item__quick-buy-button hidden-no-touch button button--primary button--text button--full" aria-label="' +
      atcLabel +
      '">' +
      '<span class="visually-hidden">' +
      atcLabel +
      "</span>" +
      iconHtml +
      "</button>" +
      '<input type="hidden" name="product-id" value="' +
      productId +
      '">' +
      '<input type="hidden" name="section-id" value="' +
      sectionId +
      '"></form></div>'
    );
  }

  function buildThemeQuickViewHtml(uniqueKey, handle, sectionId, blockId, productUrl, qvLabel) {
    var drawerId = "product-" + sectionId + "-" + blockId + "-" + uniqueKey + "-drawer";
    var popoverId = "product-" + sectionId + "-" + blockId + "-" + uniqueKey + "-popover";
    var iconHtml = getQuickAtcIconHtml();
    qvLabel = qvLabel || "Quick view";
    return (
      '<div class="quick_atc_btn_wrap"><div class="ed-product-item__quick-form">' +
      '<button is="toggle-button" loader aria-controls="' +
      drawerId +
      '" aria-expanded="false" aria-label="' +
      qvLabel +
      '" class="button button--primary button--text button--full hidden-touch hidden-phone">' +
      iconHtml +
      "</button>" +
      '<button is="toggle-button" aria-controls="' +
      drawerId +
      '" aria-expanded="false" aria-label="' +
      qvLabel +
      '" class="product-item__quick-buy-button button button--primary button--text button--full hidden-no-touch hidden-phone">' +
      '<span class="visually-hidden">' +
      qvLabel +
      "</span>" +
      iconHtml +
      "</button>" +
      '<button is="toggle-button" aria-controls="' +
      popoverId +
      '" aria-expanded="false" aria-label="' +
      qvLabel +
      '" class="ed-product-item__quick-buy-button button button--primary button--text button--full hidden-tablet-and-up">' +
      '<span class="visually-hidden">' +
      qvLabel +
      "</span>" +
      iconHtml +
      "</button>" +
      '</div><quick-buy-popover id="' +
      popoverId +
      '" href="' +
      (productUrl || "/products/" + handle) +
      '" class="popover popover--quick-buy hidden-tablet-and-up"></quick-buy-popover>' +
      '<quick-buy-drawer id="' +
      drawerId +
      '" href="' +
      (productUrl || "/products/" + handle) +
      '" class="drawer drawer--large drawer--quick-buy hidden-phone"></quick-buy-drawer></div>'
    );
  }

  function hasThemeQuickAtc(productItem) {
    if (!productItem) return false;
    var wrap = productItem.querySelector(".quick_atc_btn_wrap");
    if (!wrap) return false;
    return Boolean(wrap.querySelector('form.ed-product-item__quick-form[is="product-form"]'));
  }

  function hasThemeQuickView(productItem) {
    if (!productItem) return false;
    var wrap = productItem.querySelector(".quick_atc_btn_wrap");
    if (!wrap) return false;
    return Boolean(wrap.querySelector("quick-buy-popover, quick-buy-drawer, button[is='toggle-button']"));
  }

  function setBoostSaleBadgeIcon(label, fallbackLabel) {
    if (!label || label.getAttribute("data-boost-sale-svg") === "true") return;

    var textEl = label.querySelector(".boost-sd__product-label-text") || label;
    var labelText = (textEl.textContent || fallbackLabel || "Sale").trim();
    textEl.innerHTML = BOOST_SALE_BADGE_SVG;
    label.setAttribute("data-boost-sale-svg", "true");
    label.setAttribute("aria-label", labelText || "Sale");
  }

  function normalizeBoostSaleBadges(productItem) {
    if (!productItem) return;
    productItem.querySelectorAll(".boost-sd__product-label--sale").forEach(function (label) {
      if (label.classList.contains("boost-sd__product-label--soldout")) return;
      setBoostSaleBadgeIcon(label, "Sale");
    });
  }

  function normalizeBoostProductInfoLayout(productItem) {
    var info = productItem.querySelector(".boost-sd__product-info");
    if (!info) return;

    var swatch = info.querySelector(".boost-sd__product-swatch");
    var vendor = info.querySelector(".boost-sd__product-vendor");
    var link = info.querySelector(".boost-sd__product-link");
    var price = info.querySelector(".boost-sd__product-price");

    var quickAtc = productItem.querySelector(".quick_atc_btn_wrap");
    var bar = info.querySelector(".boost-sd__price-atc-row");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "boost-sd__price-atc-row";
    }

    var alreadyMarked = productItem.getAttribute("data-boost-info-normalized") === "true";
    if (alreadyMarked) {
      var ok =
        (!price || price.parentNode === bar) &&
        (!quickAtc || quickAtc.parentNode === bar) &&
        (!bar || bar.parentNode === info || !(bar.childNodes && bar.childNodes.length));
      if (!ok) {
        productItem.removeAttribute("data-boost-info-normalized");
      } else {
        return;
      }
    }

    var changed = false;
    if (price && price.parentNode !== bar) {
      bar.appendChild(price);
      changed = true;
    }
    if (quickAtc && quickAtc.parentNode !== bar) {
      bar.appendChild(quickAtc);
      changed = true;
    }

    if (bar.parentNode !== info && (bar.childNodes && bar.childNodes.length)) {
      info.appendChild(bar);
      changed = true;
    }

    var desired = [swatch, vendor, link, bar];
    var keep = new Set(desired.filter(Boolean));

    var desiredOrderOk = true;
    for (var i = 0, pos = 0; i < desired.length; i++) {
      if (!desired[i]) continue;
      if (info.children[pos] !== desired[i]) {
        desiredOrderOk = false;
        break;
      }
      pos++;
    }

    if (!desiredOrderOk) {
      desired.forEach(function (el) {
        if (el) info.appendChild(el);
      });
      changed = true;
    }

    if (!desiredOrderOk) {
      Array.from(info.children).forEach(function (child) {
        if (!keep.has(child) && child !== bar) {
          info.appendChild(child);
        }
      });
    }

    var bottomRow = productItem.querySelector(".boost-sd__product-image-row--bottom");
    if (bottomRow && !bottomRow.querySelector(".quick_atc_btn_wrap")) {
      var hasMeaningfulChild = Array.from(bottomRow.children).some(function (c) {
        return c && c.nodeType === 1 && c.tagName !== "SCRIPT" && c.tagName !== "STYLE";
      });
      if (!hasMeaningfulChild) bottomRow.remove();
    }

    if (changed || desiredOrderOk) {
      productItem.setAttribute("data-boost-info-normalized", "true");
    }
  }

  function normalizeBoostEuroPrice(productItem) {
    productItem.querySelectorAll(".boost-sd__product-price-content").forEach(function (wrap) {
      wrap.querySelectorAll(".boost-sd__format-currency").forEach(function (node) {
        if (node.querySelector(".boost-sd__format-currency")) return;
        var raw = (node.textContent || "").trim();
        if (!raw) return;
        if (/^€\s*/.test(raw) && !/€\s*$/.test(raw)) {
          node.textContent = raw.replace(/^€\s*/, "").trim() + "€";
        }
      });
    });
  }

  function normalizeBoostPriceStructure(productItem) {
    var wrappers = productItem.querySelectorAll(".boost-sd__product-price-wrapper");
    wrappers.forEach(function (w) {
      if (w.getAttribute("data-boost-price-structured") === "true") return;

      var priceContent = w.querySelector(".boost-sd__product-price-content");
      if (!priceContent) return;

      var sale = priceContent.querySelector(".boost-sd__product-price--sale");
      var compare = priceContent.querySelector(".boost-sd__product-price--compare");
      var saving = w.querySelector(".boost-sd__product-price--saving");

      if (!sale) return;

      var top = w.querySelector(".boost-sd__product-price-topline");
      if (!top) {
        top = document.createElement("div");
        top.className = "boost-sd__product-price-topline";
      }

      var bottom = w.querySelector(".boost-sd__product-price-bottomline");
      if (!bottom) {
        bottom = document.createElement("div");
        bottom.className = "boost-sd__product-price-bottomline";
      }

      if (compare) top.appendChild(compare);
      if (saving) top.appendChild(saving);
      bottom.appendChild(sale);

      if (top.parentNode !== w) w.appendChild(top);
      if (bottom.parentNode !== w) w.appendChild(bottom);

      if (priceContent.parentNode === w) {
        priceContent.remove();
      }

      w.setAttribute("data-boost-price-structured", "true");
    });
  }

  function normalizeBoostInstantSearchEuroPrice() {
    document.querySelectorAll(".boost-sd__instant-search-autocomplete").forEach(function (root) {
      root.querySelectorAll(".boost-sd__format-currency").forEach(function (node) {
        if (node.querySelector(".boost-sd__format-currency")) return;
        var raw = (node.textContent || "").trim();
        if (!raw) return;
        if (/^€\s*/.test(raw) && !/€\s*$/.test(raw)) {
          node.textContent = raw.replace(/^€\s*/, "").trim() + "€";
        }
      });
    });
  }

  // Boost instant search grid normalization (autocomplete dropdown)
  function normalizeBoostInstantSearchProductGrid() {
    document.querySelectorAll(".boost-sd__instant-search-autocomplete").forEach(function (root) {
      var routes = getRoutes();
      var sectionId = getSectionId();

      var ul = root.querySelector(".boost-sd__instant-search-product-list-items");
      if (!ul) return;

      ul.classList.add("boost-sd__instant-search-product-grid");

      ul.querySelectorAll("li.boost-sd__suggestion-queries-item--product").forEach(function (li) {
        if (li.getAttribute("data-boost-instant-grid") === "true") {
          if (!li.querySelector(".boost-sd__price-atc-row .quick_atc_btn_wrap")) return;
          return;
        }

        var link = li.querySelector("a.boost-sd__suggestion-queries-item-link");
        if (!link) return;

        var left = link.querySelector(".boost-sd__suggestion-queries-item-product--left");
        var right = link.querySelector(".boost-sd__suggestion-queries-item-product--right");
        if (!left || !right) return;

        var img = left.querySelector("img.boost-sd__suggestion-queries-item-img");
        var soldOutBadge = left.querySelector(".boost-sd__suggestion-queries-item-badge--sold-out");
        var saleBadge = left.querySelector(".boost-sd__suggestion-queries-item-badge--sale");
        var badgeText = "";
        if (soldOutBadge) badgeText = (soldOutBadge.textContent || "").trim();
        if (!badgeText && saleBadge) badgeText = (saleBadge.textContent || "").trim();

        var titleEl = right.querySelector(".boost-sd__suggestion-queries-item-title");
        var vendorEl = right.querySelector(".boost-sd__suggestion-queries-item-vendor");
        var priceEl = right.querySelector(".boost-sd__suggestion-queries-item-price");
        var skuEl = right.querySelector(".boost-sd__suggestion-queries-item-sku");
        var href = link.getAttribute("href") || "";
        var handleMatch = href.match(/\/products\/([^/?#]+)/);
        var handle = handleMatch ? handleMatch[1] : "";
        var productIdFromLi = li.getAttribute("data-id") || li.getAttribute("data-product-id") || "";

        var card = document.createElement("div");
        card.className = "boost-sd__product-item boost-sd__product-item-grid-view-layout boost-sd__product-item-grid-view-layout--instant";
        if (soldOutBadge) card.classList.add("is-soldout");

        var imageWrap = document.createElement("div");
        imageWrap.className = "boost-sd__product-item-grid-view-layout-image";

        var imageLinkWrap = document.createElement("div");
        imageLinkWrap.className = "boost-sd__product-link-image";

        var imageInner = document.createElement("div");
        imageInner.className = "boost-sd__product-image-wrapper boost-sd__product-image-wrapper--natural";

        var imageAnchor = document.createElement("a");
        imageAnchor.className = "boost-sd__product-link boost-sd__product-image";
        if (href) imageAnchor.setAttribute("href", href);
        if (link.getAttribute("target")) imageAnchor.setAttribute("target", link.getAttribute("target"));
        if (link.getAttribute("rel")) imageAnchor.setAttribute("rel", link.getAttribute("rel"));
        if (img) {
          img.classList.add("boost-sd__product-image-img", "boost-sd__product-image-img--main");
          img.setAttribute("sizes", "(min-width: 769px) 220px, 50vw");
          var src = img.getAttribute("src") || "";
          if (/([?&]width=)100\b/.test(src)) {
            img.setAttribute("src", src.replace(/([?&]width=)100\b/, "$1500"));
          }
          imageAnchor.appendChild(img);
        }
        imageInner.appendChild(imageAnchor);

        if (badgeText) {
          var topRow = document.createElement("div");
          topRow.className = "boost-sd__product-image-row boost-sd__product-image-row--top boost-sd__product-image-row--horizontal";

          var colLeft = document.createElement("div");
          colLeft.className = "boost-sd__product-image-column boost-sd__product-image-column--in-top boost-sd__product-image-column--left";

          var label = document.createElement("div");
          label.className = "boost-sd__product-label boost-sd__product-label--text boost-sd__product-label--rectangle";
          if (soldOutBadge) label.classList.add("boost-sd__product-label--soldout");
          if (!soldOutBadge && saleBadge) label.classList.add("boost-sd__product-label--sale");

          var span = document.createElement("span");
          span.className = "boost-sd__product-label-text";
          if (!soldOutBadge && saleBadge) {
            span.innerHTML = BOOST_SALE_BADGE_SVG;
            label.setAttribute("data-boost-sale-svg", "true");
            label.setAttribute("aria-label", badgeText || "Sale");
          } else {
            span.textContent = badgeText;
          }
          label.appendChild(span);
          colLeft.appendChild(label);
          topRow.appendChild(colLeft);
          imageInner.appendChild(topRow);
        }

        imageLinkWrap.appendChild(imageInner);
        imageWrap.appendChild(imageLinkWrap);

        var infoWrap = document.createElement("div");
        infoWrap.className = "boost-sd__product-info-wrapper";

        var info = document.createElement("div");
        info.className = "boost-sd__product-info boost-sd__product-info--center";

        if (vendorEl) {
          var vendor = document.createElement("p");
          vendor.className = "boost-sd__product-vendor";
          vendor.textContent = (vendorEl.textContent || "").trim();
          info.appendChild(vendor);
        }

        if (titleEl) {
          var titleLink = document.createElement("a");
          titleLink.className = "boost-sd__product-link";
          if (href) titleLink.setAttribute("href", href);
          if (link.getAttribute("target")) titleLink.setAttribute("target", link.getAttribute("target"));
          if (link.getAttribute("rel")) titleLink.setAttribute("rel", link.getAttribute("rel"));
          var title = document.createElement("div");
          title.className = "boost-sd__product-title";
          title.textContent = (titleEl.textContent || "").trim();
          titleLink.appendChild(title);
          info.appendChild(titleLink);
        }

        var bar = document.createElement("div");
        bar.className = "boost-sd__price-atc-row";

        if (priceEl) {
          var unitPriceEl = priceEl.querySelector(".unit-price-measurement");
          if (unitPriceEl) unitPriceEl.remove();

          var parseMoney = function (s) {
            var raw = (s || "").replace(/\s+/g, "").replace(/[^\d,.\-]/g, "");
            if (!raw) return NaN;
            raw = raw.replace(/\.(?=\d{3}(\D|$))/g, "");
            raw = raw.replace(",", ".");
            var n = parseFloat(raw);
            return Number.isFinite(n) ? n : NaN;
          };

          var saleNode = priceEl.querySelector(".boost-sd__format-currency--price-sale") || priceEl.querySelector(".boost-sd__suggestion-queries-item-amount--sale .boost-sd__format-currency");
          var compareNode = priceEl.querySelector(".boost-sd__format-currency--price-compare");

          var saleVal = saleNode ? parseMoney(saleNode.textContent) : NaN;
          var compareVal = compareNode ? parseMoney(compareNode.textContent) : NaN;

          var priceWrap = document.createElement("div");
          priceWrap.className = "boost-sd__product-price-wrapper";
          priceWrap.setAttribute("data-boost-price-structured", "true");

          if (compareNode && saleNode && Number.isFinite(compareVal) && compareVal > 0 && Number.isFinite(saleVal) && saleVal >= 0) {
            var topLine = document.createElement("div");
            topLine.className = "boost-sd__product-price-topline";

            var compareOuter = document.createElement("span");
            compareOuter.className = "boost-sd__format-currency boost-sd__format-currency--price-compare boost-sd__product-price--compare";
            compareOuter.appendChild(compareNode.cloneNode(true));
            topLine.appendChild(compareOuter);

            var pct = Math.round(((compareVal - saleVal) / compareVal) * 100);
            if (Number.isFinite(pct) && pct > 0) {
              var saving = document.createElement("span");
              saving.className = "boost-sd__product-price--saving";
              var savingInner = document.createElement("span");
              savingInner.className = "boost-sd__format-currency";
              savingInner.textContent = "-" + pct + "%";
              saving.appendChild(savingInner);
              topLine.appendChild(saving);
            }

            var bottomLine = document.createElement("div");
            bottomLine.className = "boost-sd__product-price-bottomline";
            var saleOuter = document.createElement("span");
            saleOuter.className = "boost-sd__product-price--sale";
            saleOuter.appendChild(saleNode.cloneNode(true));
            bottomLine.appendChild(saleOuter);

            priceWrap.appendChild(topLine);
            priceWrap.appendChild(bottomLine);
          } else {
            var regular = priceEl.querySelector(".boost-sd__format-currency");
            if (regular) {
              var regularOuter = document.createElement("span");
              regularOuter.className = "boost-sd__product-price--default";
              regularOuter.appendChild(regular.cloneNode(true));
              priceWrap.appendChild(regularOuter);
            } else {
              priceWrap.appendChild(priceEl);
            }
          }

          var price = document.createElement("div");
          price.className = "boost-sd__product-price";
          price.appendChild(priceWrap);
          if (unitPriceEl) price.appendChild(unitPriceEl);
          bar.appendChild(price);
        }

        if (!soldOutBadge && routes && handle) {
          fetchBoostProductJson(handle, routes).then(function (product) {
            if (!product || !product.variants || !product.variants.length) return;

            var anyAvailable = product.variants.some(function (vv) {
              return vv && vv.available;
            });
            if (anyAvailable) {
              card.classList.remove("is-soldout");
            } else {
              card.classList.add("is-soldout");
              return;
            }

            if (bar.querySelector(".quick_atc_btn_wrap")) return;

            var v = product.variants[0];
            var atcLabel =
              (window.themeVariables && window.themeVariables.strings && window.themeVariables.strings.productFormAddToCart) ||
              "In den Warenkorb";
            var html = buildThemeFormHtml(v.id, product.id, sectionId, routes.cartAddUrl, atcLabel, handle);
            var tmp = document.createElement("div");
            tmp.innerHTML = html;
            var el = tmp.firstElementChild;
            if (el) {
              bar.appendChild(el);
              var boostForm = el.querySelector('form[is="product-form"]');
              initBoostProductForm(boostForm, handle, v.id, routes);
            }
          });
        }

        info.appendChild(bar);

        if (skuEl) {
          skuEl.classList.add("boost-sd__instant-search-sku");
          info.appendChild(skuEl);
        }

        infoWrap.appendChild(info);

        card.appendChild(imageWrap);
        card.appendChild(infoWrap);

        li.innerHTML = "";
        li.appendChild(card);
        if (productIdFromLi) card.setAttribute("data-product-id", productIdFromLi);
        if (handle) {
          var dp = card.getAttribute("data-product");
          if (!dp) card.setAttribute("data-product", '{"handle":"' + handle + '"}');
        }

        li.setAttribute("data-boost-instant-grid", "true");
      });
    });
  }

  function isMobileBoostSwatchView() {
    var w = window.visualViewport && window.visualViewport.width ? window.visualViewport.width : window.innerWidth;
    return typeof w === "number" && w <= 740;
  }

  function normalizeBoostSwatches(productItem) {
    var mobile = isMobileBoostSwatchView();
    var swatches = productItem.querySelectorAll(".boost-sd__product-swatch");
    swatches.forEach(function (swatchWrap) {
      var optionsWrap = swatchWrap.querySelector(".boost-sd__product-swatch-options");
      if (!optionsWrap) return;

      if (swatchWrap.getAttribute("data-boost-swatch-expanded") === "true") {
        optionsWrap.querySelectorAll(".boost-sd__product-swatch-option").forEach(function (opt) {
          opt.style.display = "";
        });
        var moreBtnExpanded = optionsWrap.querySelector(".boost-sd__product-swatch-more");
        if (moreBtnExpanded) moreBtnExpanded.style.display = "none";
        return;
      }

      swatchWrap.setAttribute("data-boost-swatch-mode", mobile ? "m" : "d");

      var options = Array.from(optionsWrap.querySelectorAll(".boost-sd__product-swatch-option"));
      var moreBtn = optionsWrap.querySelector(".boost-sd__product-swatch-more");
      var totalAttr = swatchWrap.getAttribute("data-boost-swatch-total");
      var total = totalAttr ? parseInt(totalAttr, 10) : NaN;
      if (!Number.isFinite(total) || total < 0) {
        var boostHidden = 0;
        if (moreBtn) {
          var t = (moreBtn.textContent || "").replace(/\s+/g, "").trim();
          var m = t.match(/^\+(\d+)$/);
          if (m) boostHidden = parseInt(m[1], 10) || 0;
        }
        total = options.length + boostHidden;
        swatchWrap.setAttribute("data-boost-swatch-total", String(total));
        swatchWrap.setAttribute("data-boost-swatch-boosthidden", String(boostHidden));
      } else {
        if (options.length > total) {
          total = options.length;
          swatchWrap.setAttribute("data-boost-swatch-total", String(total));
        }
      }

      var maxVisible = mobile ? 3 : 4;
      var sig = (mobile ? "m" : "d") + "|" + options.length + "|" + total + "|" + maxVisible;
      if (swatchWrap.getAttribute("data-boost-swatch-sig") === sig) return;
      swatchWrap.setAttribute("data-boost-swatch-sig", sig);

      options.forEach(function (opt, idx) {
        var shouldShow = idx < maxVisible;
        var nextDisplay = shouldShow ? "" : "none";
        if (opt.style.display !== nextDisplay) opt.style.display = nextDisplay;
      });

      var hiddenCount = Math.max(0, total - maxVisible);
      if (moreBtn) {
        var nextMoreDisplay = hiddenCount > 0 ? "" : "none";
        if (moreBtn.style.display !== nextMoreDisplay) moreBtn.style.display = nextMoreDisplay;
        if (hiddenCount > 0) {
          var nextText = "+" + hiddenCount;
          if (moreBtn.textContent !== nextText) moreBtn.textContent = nextText;
        }
        if (!moreBtn.__boostSwatchBound) {
          moreBtn.__boostSwatchBound = true;
          moreBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            swatchWrap.setAttribute("data-boost-swatch-expanded", "true");
            swatchWrap.removeAttribute("data-boost-swatch-sig");
            Array.from(optionsWrap.querySelectorAll(".boost-sd__product-swatch-option")).forEach(function (opt) {
              opt.style.display = "";
            });
            moreBtn.style.display = "none";
          });
        }
      }
    });
  }

  function updateBoostSoldOutClassFromDom(productItem) {
    if (!productItem) return;

    if (productItem.querySelector(".boost-sd__product-label--soldout")) {
      productItem.classList.add("is-soldout");
      return;
    }

    var labelTextEl =
      productItem.querySelector(".boost-sd__product-label-text") ||
      productItem.querySelector(".boost-sd__product-label") ||
      null;
    var t = labelTextEl ? (labelTextEl.textContent || "").trim().toLowerCase() : "";
    if (t && (t.indexOf("ausverkauft") !== -1 || t.indexOf("sold out") !== -1 || t.indexOf("soldout") !== -1)) {
      productItem.classList.add("is-soldout");
      return;
    }

    var a1 = productItem.getAttribute("data-boost-product-available");
    var a2 = productItem.getAttribute("data-available");
    var a3 = productItem.getAttribute("data-soldout");
    var a4 = productItem.getAttribute("data-sold-out");
    var isFalse = function (v) {
      return typeof v === "string" && v.toLowerCase() === "false";
    };
    var isTrue = function (v) {
      return typeof v === "string" && v.toLowerCase() === "true";
    };
    if (isFalse(a1) || isFalse(a2) || isTrue(a3) || isTrue(a4)) {
      productItem.classList.add("is-soldout");
      return;
    }

    productItem.classList.remove("is-soldout");
  }

  var boostProductCache = Object.create(null);
  var boostProductInFlight = Object.create(null);

  function fetchBoostProductJson(handle, routes) {
    if (!handle || !routes) return Promise.resolve(null);
    if (boostProductCache[handle]) return Promise.resolve(boostProductCache[handle]);
    if (boostProductInFlight[handle]) return boostProductInFlight[handle];

    var productUrl = (routes.root || "") + "/products/" + handle + ".js";
    boostProductInFlight[handle] = fetch(productUrl)
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (product) {
        boostProductCache[handle] = product;
        rememberBoostVariantHandles(handle, product);
        return product;
      })
      .catch(function () {
        return null;
      })
      .finally(function () {
        delete boostProductInFlight[handle];
      });

    return boostProductInFlight[handle];
  }

  function replaceBoostButton(productItem, btn, sectionId, routes) {
    var handle = getHandle(productItem);
    if (!handle) return;

    var alreadyReplaced = productItem.getAttribute("data-boost-replaced") === "true";
    if (alreadyReplaced) {
      var shouldRetry = false;
      if (isAddToCartButton(btn)) {
        shouldRetry = !hasThemeQuickAtc(productItem);
      } else if (isQuickViewButton(btn)) {
        shouldRetry = !hasThemeQuickView(productItem);
      }
      if (!shouldRetry) return;
      productItem.removeAttribute("data-boost-replaced");
    }

    var productId = productItem.getAttribute("data-product-id") || productItem.id || "";
    var uniqueKey = productId ? String(productId) : String(handle);

    var isATC = isAddToCartButton(btn);
    var isQV = isQuickViewButton(btn);

    if (isATC) {
      productItem.setAttribute("data-boost-replaced", "true");
      fetchBoostProductJson(handle, routes)
        .then(function (product) {
          if (!product || !product.variants || !product.variants.length) return;
          var anyAvailable = product.variants.some(function (vv) {
            return vv && vv.available;
          });
          if (anyAvailable) {
            productItem.classList.remove("is-soldout");
          } else {
            productItem.classList.add("is-soldout");
          }
          var v = product.variants[0];
          var atcLabel =
            (window.themeVariables && window.themeVariables.strings && window.themeVariables.strings.productFormAddToCart) ||
            "In den Warenkorb";
          var html = buildThemeFormHtml(
            v.id,
            product.id,
            sectionId,
            routes.cartAddUrl,
            atcLabel,
            handle
          );
          var wrap = document.createElement("div");
          wrap.className = "boost-sd__product-image-row boost-sd__product-image-row--bottom";
          wrap.innerHTML = html;
          var row = btn.closest(".boost-sd__product-image-row--bottom");
          if (row && row.parentNode) {
            row.parentNode.replaceChild(wrap, row);
          }
          var boostForm = wrap.querySelector('form[is="product-form"]');
          initBoostProductForm(boostForm, handle, v.id, routes);
        })
        .catch(function () { });
      return;
    }

    if (isQV) {
      productItem.setAttribute("data-boost-replaced", "true");
      var productUrlForHref = (routes.root || "") + "/products/" + handle;
      var html = buildThemeQuickViewHtml(
        uniqueKey,
        handle,
        sectionId,
        BOOST_BLOCK_ID,
        productUrlForHref,
        window.themeVariables && window.themeVariables.strings && window.themeVariables.strings.collectionQuickView
          ? window.themeVariables.strings.collectionQuickView
          : "Schnellansicht"
      );
      var wrap = document.createElement("div");
      wrap.className = "boost-sd__product-image-row boost-sd__product-image-row--bottom";
      wrap.innerHTML = html;
      var row = btn.closest(".boost-sd__product-image-row--bottom");
      if (row && row.parentNode) {
        row.parentNode.replaceChild(wrap, row);
      }
    }
  }

  function processBoostProductItems() {
    var routes = getRoutes();
    var sectionId = getSectionId();
    if (!routes) return;

    var items = document.querySelectorAll(".boost-sd__product-item");
    items.forEach(function (productItem) {
      updateBoostSoldOutClassFromDom(productItem);
      normalizeBoostSaleBadges(productItem);
      var btn = productItem.querySelector(
        ".boost-sd__product-image-row--bottom .boost-sd__button--select-option"
      );
      if (btn) replaceBoostButton(productItem, btn, sectionId, routes);
      normalizeBoostProductInfoLayout(productItem);
      normalizeBoostEuroPrice(productItem);
      normalizeBoostPriceStructure(productItem);
      normalizeBoostSwatches(productItem);
    });
    normalizeBoostInstantSearchEuroPrice();
    normalizeBoostInstantSearchProductGrid();

    document.querySelectorAll('.boost-sd__product-item form[is="product-form"]').forEach(function (form) {
      if (form.getAttribute("data-kavalio-boost-form-init") === "1") return;
      form.setAttribute("data-kavalio-boost-form-init", "1");
      var card = form.closest(".boost-sd__product-item");
      var handle = card ? getHandle(card) : null;
      var variantInput = form.querySelector('input[name="id"]');
      var variantId = variantInput ? variantInput.value : "";
      initBoostProductForm(form, handle, variantId, routes);
    });
  }

  var scheduled = false;
  var observer = new MutationObserver(function () {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      processBoostProductItems();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", processBoostProductItems);
  } else {
    processBoostProductItems();
  }

  window.addEventListener("resize", function () {
    processBoostProductItems();
  });
})();

/* Boost AI search page end */

/* CP collection breadcrumbs (Level 0 > Level 1 > Level 2 > Level 3) */
(function () {
  function normalizePath(url) {
    if (!url) return "";
    var path = url.split("?")[0];
    try {
      var u = new URL(path, window.location.origin);
      path = u.pathname;
    } catch (e) { }
    return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
  }

  function buildNavTree() {
    var tree = [];
    var items = document.querySelectorAll(".header__linklist-item");
    items.forEach(function (li) {
      var level0Link = li.querySelector(".header__linklist-link");
      if (!level0Link) return;
      var level0 = { title: level0Link.textContent.trim(), url: normalizePath(level0Link.getAttribute("href")) };
      var megaMenu = li.querySelector(".mega-menu");
      var children = [];
      if (megaMenu) {
        var columns = megaMenu.querySelectorAll(".mega-menu__column");
        columns.forEach(function (col) {
          var level1Link = col.querySelector(".mega-menu__title");
          if (!level1Link) return;
          var level1 = { title: level1Link.textContent.trim(), url: normalizePath(level1Link.getAttribute("href")) };
          var level2Links = col.querySelectorAll(".linklist a, .linklist__item a");
          var level2Children = [];
          level2Links.forEach(function (a) {
            level2Children.push({
              title: a.textContent.trim(),
              url: normalizePath(a.getAttribute("href")),
            });
          });
          level1.children = level2Children;
          children.push(level1);
        });
      }
      level0.children = children;
      tree.push(level0);
    });
    return tree;
  }

  function findPath(tree, currentPath) {
    for (var i = 0; i < tree.length; i++) {
      var l0 = tree[i];
      if (l0.url === currentPath) return [l0];
      if (l0.children) {
        for (var j = 0; j < l0.children.length; j++) {
          var l1 = l0.children[j];
          if (l1.url === currentPath) return [l0, l1];
          if (l1.children) {
            for (var k = 0; k < l1.children.length; k++) {
              if (l1.children[k].url === currentPath) return [l0, l1, l1.children[k]];
            }
          }
        }
      }
    }
    return null;
  }

  function updateBreadcrumbs(path, currentTitle, rootUrl) {
    var segmentsEl = document.querySelector(".collection_breadcrumb__segments");
    var currentEl = document.querySelector(".collection_breadcrumb__current");
    var chevronEl = document.querySelector(".collection_breadcrumb .collection_breadcrumb__chevron");
    var chevronHtml = (chevronEl && chevronEl.innerHTML)
      ? "<span class=\"collection_breadcrumb__chevron\" aria-hidden=\"true\">" + chevronEl.innerHTML + "</span>"
      : "";

    if (segmentsEl) {
      var html = "";
      if (path && path.length) {
        if (path.length === 1) {
          segmentsEl.innerHTML = "";
          if (currentEl) {
            currentEl.textContent = path[0].title || currentTitle;
            currentEl.className = "collection_breadcrumb__parent";
            currentEl.style.display = "";
          }
        } else {
          for (var i = 0; i < path.length - 1; i++) {
            if (i > 0) html += chevronHtml;
            var node = path[i];
            html += "<a href=\"" + (node.url ? node.url : "#") + "\" class=\"collection_breadcrumb__parent\" data-active-collection-label>" + (node.title || "") + "</a>";
          }
          segmentsEl.innerHTML = html;
          if (currentEl) {
            currentEl.textContent = path[path.length - 1].title || currentTitle;
            currentEl.className = "collection_breadcrumb__current";
            currentEl.style.display = "";
          }
        }
      } else {
        segmentsEl.innerHTML = "";
        if (currentEl) {
          currentEl.textContent = currentTitle;
          currentEl.className = "collection_breadcrumb__current";
          currentEl.style.display = "";
        }
      }
    }

    if (chevronEl) {
      chevronEl.style.display = path && path.length >= 1 ? "" : "none";
    }

    var bannerList = document.querySelector(".shopify-section--collection-banner nav.breadcrumb .breadcrumb__list");
    if (bannerList) {
      bannerList.innerHTML = "";
      if (path && path.length) {
        path.forEach(function (node, idx) {
          var li = document.createElement("li");
          li.className = "breadcrumb__item";
          if (idx === path.length - 1) {
            var span = document.createElement("span");
            span.className = "breadcrumb__link";
            span.setAttribute("aria-current", "page");
            span.textContent = node.title || currentTitle;
            li.appendChild(span);
          } else {
            var a = document.createElement("a");
            a.className = "breadcrumb__link";
            a.href = node.url || "#";
            a.textContent = node.title || "";
            li.appendChild(a);
          }
          bannerList.appendChild(li);
        });
      } else {
        var currentLi = document.createElement("li");
        currentLi.className = "breadcrumb__item";
        var currentSpan = document.createElement("span");
        currentSpan.className = "breadcrumb__link";
        currentSpan.setAttribute("aria-current", "page");
        currentSpan.textContent = currentTitle;
        currentLi.appendChild(currentSpan);
        bannerList.appendChild(currentLi);
      }
    }

    document.querySelectorAll("[data-cp-breadcrumb], [data-cp-banner-breadcrumb]").forEach(function (el) {
      el.classList.add("breadcrumb--ready");
    });
  }

  /* PDP breadcrumb */
  function appendBreadcrumbItem(list, title, url, isCurrent) {
    var li = document.createElement("li");
    li.className = "breadcrumb__item";

    if (isCurrent) {
      var span = document.createElement("span");
      span.className = "breadcrumb__link";
      span.setAttribute("aria-current", "page");
      span.textContent = title || "";
      li.appendChild(span);
    } else {
      var a = document.createElement("a");
      a.className = "breadcrumb__link";
      a.href = url || "#";
      a.textContent = title || "";
      li.appendChild(a);
    }

    list.appendChild(li);
  }

  var PDP_BREADCRUMB_STORAGE_KEY = "kavalio_pdp_breadcrumb_context";

  var activeCollectionBreadcrumbPath = null;

  function buildStorablePath(path, currentTitle, currentPath) {
    if (path && path.length) {
      return path.map(function (node, idx) {
        return {
          title: node.title || (idx === path.length - 1 ? currentTitle : ""),
          url: node.url || "",
        };
      });
    }

    if (currentTitle) {
      return [{ title: currentTitle, url: normalizePath(currentPath) }];
    }

    return null;
  }

  function storePdpBreadcrumbContext(event) {
    var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!link) return;

    var productItem = link.closest("product-item");
    if (!productItem) return;

    var collectionUrl = productItem.getAttribute("data-breadcrumb-collection-url") || "";
    var collectionTitle = productItem.getAttribute("data-breadcrumb-collection-title") || "";
    var productUrl = productItem.getAttribute("data-product-url") || "";

    if (!collectionUrl || !collectionTitle || !productUrl) return;
    if (normalizePath(link.getAttribute("href")) !== normalizePath(productUrl)) return;

    var storedPath = (activeCollectionBreadcrumbPath && activeCollectionBreadcrumbPath.length)
      ? activeCollectionBreadcrumbPath
      : [{ title: collectionTitle, url: normalizePath(collectionUrl) }];

    try {
      sessionStorage.setItem(PDP_BREADCRUMB_STORAGE_KEY, JSON.stringify({
        productPath: normalizePath(productUrl),
        collectionUrl: collectionUrl,
        collectionTitle: collectionTitle,
        path: storedPath
      }));
    } catch (e) { }
  }

  function getStoredPdpBreadcrumbContext(currentPath) {
    try {
      var raw = sessionStorage.getItem(PDP_BREADCRUMB_STORAGE_KEY);
      if (!raw) return null;

      var context = JSON.parse(raw);
      if (!context || normalizePath(context.productPath) !== currentPath) return null;
      if (!context.collectionUrl || !context.collectionTitle) return null;

      return context;
    } catch (e) {
      return null;
    }
  }

  function parseProductCollections(pdpBreadcrumb) {
    var raw = pdpBreadcrumb.getAttribute("data-product-collections");
    if (!raw) return [];

    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function resolveCollectionFromNav(tree, collections) {
    var best = null;
    var bestDepth = -1;

    collections.forEach(function (coll) {
      if (!coll || !coll.url) return;

      var path = findPath(tree, normalizePath(coll.url));
      if (!path || !path.length || path.length <= bestDepth) return;

      bestDepth = path.length;
      best = {
        path: path,
        url: coll.url,
        title: coll.title || path[path.length - 1].title,
      };
    });

    return best;
  }

  /* Replacing PDP breadcrumb with custom breadcrumb */
  function updatePdpBreadcrumb(path, productTitle, rootUrl, collectionUrl, collectionTitle) {
    var pdpBreadcrumb = document.querySelector("[data-pdp-breadcrumb]");
    if (!pdpBreadcrumb) return;

    var list = pdpBreadcrumb.querySelector(".breadcrumb__list");
    if (!list) return;

    var rootLink = list.querySelector(".breadcrumb__item:first-child .breadcrumb__link");
    var rootTitle = rootLink ? rootLink.textContent.trim() : "Start";
    var breadcrumbPath = path && path.length ? path : null;

    if (!breadcrumbPath && collectionUrl && collectionTitle) {
      breadcrumbPath = [{
        title: collectionTitle,
        url: normalizePath(collectionUrl),
      }];
    }

    if (!breadcrumbPath || !breadcrumbPath.length) return;

    list.innerHTML = "";
    appendBreadcrumbItem(list, rootTitle, rootUrl, false);

    breadcrumbPath.forEach(function (node) {
      appendBreadcrumbItem(list, node.title || collectionTitle, node.url || collectionUrl, false);
    });

    appendBreadcrumbItem(list, productTitle, null, true);
  }

  function setActiveClasses(path) {
    var level1Container = document.querySelector('[data-cp-level="1"]');
    var level2Container = document.querySelector('[data-cp-level="2"]');
    var level3Container = document.querySelector('[data-cp-level="3"]');
    var currentPathForCp = normalizePath(window.location.pathname);
    if (level1Container) {
      var level1Items = level1Container.querySelectorAll(".multi-column__item");
      var activeUrl1 = path && path.length >= 2 ? path[1].url : path && path.length === 1 ? path[0].url : null;
      level1Items.forEach(function (item) {
        var a = item.closest("a");
        if (!a) a = item.querySelector("a");
        var href = a ? normalizePath(a.getAttribute("href")) : "";
        if (activeUrl1 && href === activeUrl1) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
    if (level2Container) {
      var level2Items = level2Container.querySelectorAll(".collection_menu-item, .multi-column__item");
      var activeUrl2 = path && path.length >= 3 ? path[2].url : path && path.length === 2 ? path[1].url : null;
      level2Items.forEach(function (item) {
        var a = item.querySelector("a");
        var href = a ? normalizePath(a.getAttribute("href")) : "";
        if (activeUrl2 && href === activeUrl2) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
    if (level3Container) {
      var level3Items = level3Container.querySelectorAll(".collection_menu-item, .multi-column__item");
      level3Items.forEach(function (item) {
        var a = item.closest("a");
        if (!a) a = item.querySelector("a");
        var href = a ? normalizePath(a.getAttribute("href")) : "";
        if (href && href === currentPathForCp) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
  }

  function runCpBreadcrumbAndActive() {
    var cpBreadcrumb = document.querySelector("[data-cp-breadcrumb]");
    var pdpBreadcrumb = document.querySelector("[data-pdp-breadcrumb]");
    if (!cpBreadcrumb && !pdpBreadcrumb) return;

    var currentPath = normalizePath(window.location.pathname);
    var rootEl = document.querySelector("nav.breadcrumb .breadcrumb__item:first-child .breadcrumb__link");
    var rootUrl = rootEl ? (rootEl.getAttribute("href") || "/") : "/";
    var tree = buildNavTree();

    if (cpBreadcrumb) {
      var currentTitle = cpBreadcrumb.getAttribute("data-collection-title") || document.querySelector(".collection_breadcrumb__current")?.textContent?.trim() || "";
      var path = findPath(tree, currentPath);
      updateBreadcrumbs(path, currentTitle, rootUrl);
      setActiveClasses(path);
      activeCollectionBreadcrumbPath = buildStorablePath(path, currentTitle, currentPath);
    } else {
      document.querySelectorAll("[data-cp-banner-breadcrumb]").forEach(function (el) {
        el.classList.add("breadcrumb--ready");
      });
    }

    if (pdpBreadcrumb) {
      var productTitle = pdpBreadcrumb.getAttribute("data-product-title") || "";
      var storedContext = getStoredPdpBreadcrumbContext(currentPath);

      if (storedContext && storedContext.path && storedContext.path.length) {
        updatePdpBreadcrumb(storedContext.path, productTitle, rootUrl, "", "");
        pdpBreadcrumb.classList.add("breadcrumb--ready");
      } else {
        var collectionUrl = pdpBreadcrumb.getAttribute("data-collection-url") || "";
        var collectionTitle = pdpBreadcrumb.getAttribute("data-collection-title") || "";
        var collectionPath = null;

        if (!collectionUrl && storedContext) {
          collectionUrl = storedContext.collectionUrl;
          collectionTitle = storedContext.collectionTitle;
        }

        if (!collectionUrl) {
          var resolved = resolveCollectionFromNav(tree, parseProductCollections(pdpBreadcrumb));
          if (resolved) {
            collectionUrl = resolved.url;
            collectionTitle = resolved.title;
            collectionPath = resolved.path;
          }
        }

        if (!collectionPath && collectionUrl) {
          collectionPath = findPath(tree, normalizePath(collectionUrl));
        }

        updatePdpBreadcrumb(collectionPath, productTitle, rootUrl, collectionUrl, collectionTitle);
        pdpBreadcrumb.classList.add("breadcrumb--ready");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runCpBreadcrumbAndActive);
  } else {
    runCpBreadcrumbAndActive();
  }

  document.addEventListener("click", storePdpBreadcrumbContext, true);
})();
/* END:CP collection breadcrumbs */

// PDP: block purchase when dropshipping is not true
(function () {
  function getPurchasableMap(form) {
    if (!form) return null;
    if (form._dropshippingPurchasableMap) return form._dropshippingPurchasableMap;

    var availabilityNode = form.querySelector("script[data-variant-availability-map]");
    if (availabilityNode) {
      try {
        var availabilityMap = JSON.parse(availabilityNode.textContent || "{}");
        var purchasableMap = {};
        Object.keys(availabilityMap).forEach(function (variantId) {
          purchasableMap[variantId] = !!(availabilityMap[variantId] && availabilityMap[variantId].canBuy);
        });
        form._dropshippingPurchasableMap = purchasableMap;
        return form._dropshippingPurchasableMap;
      } catch (e) {
        return null;
      }
    }

    var node = form.querySelector('script[data-dropshipping-purchasable-map]');
    if (!node) return null;

    try {
      form._dropshippingPurchasableMap = JSON.parse(node.textContent || "{}");
      return form._dropshippingPurchasableMap;
    } catch (e) {
      return null;
    }
  }

  function getBackInStockEligibleMap(form) {
    if (!form) return null;
    if (form._backInStockEligibleMap) return form._backInStockEligibleMap;

    var availabilityNode = form.querySelector("script[data-variant-availability-map]");
    if (availabilityNode) {
      try {
        var availabilityMap = JSON.parse(availabilityNode.textContent || "{}");
        var backInStockMap = {};
        Object.keys(availabilityMap).forEach(function (variantId) {
          backInStockMap[variantId] = !!(
            availabilityMap[variantId] && availabilityMap[variantId].backInStockEligible
          );
        });
        form._backInStockEligibleMap = backInStockMap;
        return form._backInStockEligibleMap;
      } catch (e) {
        return null;
      }
    }

    var node = form.querySelector('script[data-back-in-stock-eligible-map]');
    if (!node) return null;

    try {
      form._backInStockEligibleMap = JSON.parse(node.textContent || "{}");
      return form._backInStockEligibleMap;
    } catch (e) {
      return null;
    }
  }

  function getQuantityMaxMap(form) {
    if (!form) return null;
    if (form._shopLocationQuantityMaxMap) return form._shopLocationQuantityMaxMap;

    var node = form.querySelector('script[data-shop-location-quantity-max-map]');
    if (!node) return null;

    try {
      form._shopLocationQuantityMaxMap = JSON.parse(node.textContent || "{}");
      return form._shopLocationQuantityMaxMap;
    } catch (e) {
      return null;
    }
  }

  function getVariantMaxQuantity(form, variantId) {
    if (!variantId) return null;
    var map = getQuantityMaxMap(form);
    if (!map || !Object.prototype.hasOwnProperty.call(map, String(variantId))) return null;

    var value = map[String(variantId)];
    if (value === null || value === undefined || value === "") return null;

    var parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }

  function getQuantityInput(form) {
    if (!form) return null;

    var inForm = form.querySelector('.quantity-selector__input[name="quantity"]');
    if (inForm) return inForm;

    if (!form.id) return null;
    return document.querySelector(
      '.quantity-selector__input[name="quantity"][form="' + CSS.escape(form.id) + '"]'
    );
  }

  function clampQuantityInput(input, maxQty) {
    if (!input || maxQty == null || maxQty < 1) return;

    if (typeof input.quantity !== "undefined") {
      input.quantity = input.value;
      return;
    }

    var current = parseInt(input.value, 10) || 1;
    var min = parseInt(input.min, 10) || 1;
    input.value = String(Math.max(min, Math.min(current, maxQty)));
  }

  function applyQuantityMax(input, maxQty) {
    if (!input) return;

    if (maxQty != null && maxQty > 0) {
      input.setAttribute("max", String(maxQty));
      clampQuantityInput(input, maxQty);
      return;
    }

    input.removeAttribute("max");
    if (maxQty === 0) {
      input.setAttribute("max", "0");
      input.value = "0";
    }
  }

  function getInCartQuantityForVariant(cart, variantId) {
    var inCart = 0;
    (cart.items || []).forEach(function (item) {
      if (String(item.variant_id) === String(variantId)) {
        inCart += item.quantity;
      }
    });
    return inCart;
  }

  function fetchCartJson() {
    var cartUrl =
      (window.themeVariables && window.themeVariables.routes && window.themeVariables.routes.cartUrl) || "/cart";

    if (cartUrl.indexOf(".js") === -1) {
      cartUrl = cartUrl.replace(/\/$/, "") + ".js";
    }

    return fetch(cartUrl + (cartUrl.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now()).then(function (response) {
      if (!response.ok) {
        throw new Error("Cart fetch failed");
      }
      return response.json();
    });
  }

  function applyQuantityMaxForVariant(form, variantId, shopMax, cart) {
    var input = getQuantityInput(form);
    if (!input) return;

    if (shopMax == null) {
      input.removeAttribute("max");
      hideShopLocationNotice(form);
      return;
    }

    var remaining = shopMax;
    if (cart) {
      remaining = Math.max(0, shopMax - getInCartQuantityForVariant(cart, variantId));
    }
    applyQuantityMax(input, remaining);
    hideShopLocationNotice(form);
  }

  function getShopLocationRemaining(form, variantId) {
    var shopMax = getVariantMaxQuantity(form, variantId);
    if (shopMax == null) {
      return Promise.resolve(null);
    }

    return fetchCartJson()
      .then(function (cart) {
        return Math.max(0, shopMax - getInCartQuantityForVariant(cart, variantId));
      })
      .catch(function () {
        return shopMax;
      });
  }

  function handleShopLocationQuantityAttempt(form, requestedQty, options) {
    options = options || {};
    var variantId = getCurrentVariantId(form);
    var shopMax = getVariantMaxQuantity(form, variantId);
    if (shopMax == null) return Promise.resolve();

    return getShopLocationRemaining(form, variantId).then(function (remaining) {
      var input = getQuantityInput(form);
      var qty =
        typeof requestedQty === "number" ? requestedQty : parseInt((input && input.value) || "1", 10) || 1;

      if (input) {
        if (remaining > 0) {
          input.setAttribute("max", String(remaining));
        } else {
          input.setAttribute("max", "0");
        }
      }

      if (qty > remaining) {
        if (input && !options.skipClamp) {
          input.value = String(Math.max(remaining, 0));
          if (typeof input.quantity !== "undefined") {
            input.quantity = input.value;
          }
        }
        showShopLocationExceededNotice(form, shopMax);
        return;
      }

      hideShopLocationNotice(form);
    });
  }

  function getShopLocationNotice(form) {
    if (!form) return null;
    return form.querySelector("[data-shop-location-quantity-notice]");
  }

  function hideShopLocationNotice(form) {
    var notice = getShopLocationNotice(form);
    if (!notice) return;
    notice.hidden = true;
    notice.textContent = "";
  }

  function getShopLocationQuantityLimitTemplate() {
    var template =
      window.themeVariables &&
      window.themeVariables.strings &&
      window.themeVariables.strings.shopLocationQuantityLimitMessage;

    if (template == null || template === "") return null;

    template = String(template).trim();
    return template === "" ? null : template;
  }

  function formatShopLocationQuantityLimitMessage(shopMax) {
    var template = getShopLocationQuantityLimitTemplate();
    if (!template) return null;

    return template.split("[quantity]").join(String(shopMax));
  }

  function showShopLocationExceededNotice(form, shopMax) {
    var notice = getShopLocationNotice(form);
    if (!notice || shopMax == null || shopMax < 1) return;

    var message = formatShopLocationQuantityLimitMessage(shopMax);
    if (!message) {
      hideShopLocationNotice(form);
      return;
    }

    notice.textContent = message;
    notice.hidden = false;
  }

  function getAtcLabel(button) {
    return (
      button.getAttribute("data-button-content") ||
      (window.themeVariables && window.themeVariables.strings && window.themeVariables.strings.productFormAddToCart) ||
      "Add to cart"
    );
  }

  function setButtonState(button, canBuy) {
    if (!button) return;

    if (canBuy) {
      button.disabled = false;
      button.removeAttribute("disabled");
      button.classList.remove("button--ternary");
      if (!button.classList.contains("button--secondary")) button.classList.add("button--primary");

      var atc = getAtcLabel(button);
      var hiddenPocket = button.querySelector(".hidden-pocket");
      var hiddenLap = button.querySelector(".hidden-lap-and-up");
      var loaderText = button.querySelector(".loader-button__text");

      if (hiddenPocket || hiddenLap) {
        if (hiddenPocket) hiddenPocket.textContent = atc;
        if (hiddenLap) hiddenLap.textContent = atc;
      } else if (loaderText) {
        loaderText.textContent = atc;
      } else {
        button.textContent = atc;
      }
      return;
    }

    button.disabled = true;
    button.setAttribute("disabled", "disabled");
    button.classList.add("button--ternary");

    var soldOut =
      (window.themeVariables && window.themeVariables.strings && window.themeVariables.strings.productFormSoldOut) ||
      "Sold out";
    var hiddenPocket2 = button.querySelector(".hidden-pocket");
    var hiddenLap2 = button.querySelector(".hidden-lap-and-up");
    var loaderText2 = button.querySelector(".loader-button__text");

    if (hiddenPocket2 || hiddenLap2) {
      if (hiddenPocket2) hiddenPocket2.textContent = soldOut;
      if (hiddenLap2) hiddenLap2.textContent = soldOut;
    } else if (loaderText2) {
      loaderText2.textContent = soldOut;
    } else {
      button.textContent = soldOut;
    }
  }

  function getCurrentVariantId(form) {
    var variantInput = form && form.elements && form.elements.namedItem("id");
    return variantInput && variantInput.value;
  }

  function getBuyButtonsContext(form) {
    var root = form.closest('[data-block-type="buy-buttons"]');
    if (!root) {
      root = form.parentElement;
    }

    return {
      purchaseActions: root ? root.querySelector("[data-product-purchase-actions]") : null,
    };
  }

  function getVariantFromPicker(formId) {
    if (!formId) return null;

    var picker = document.querySelector('variant-picker[form-id="' + CSS.escape(formId) + '"]');
    if (!picker) return null;

    var variantScript = picker.querySelector("script[data-variant]");
    if (!variantScript) return null;

    try {
      return JSON.parse(variantScript.textContent || "{}");
    } catch (e) {
      return null;
    }
  }

  function setElementHidden(element, hidden) {
    if (!element) return;

    if (hidden) {
      element.classList.add("is-hidden");
    } else {
      element.classList.remove("is-hidden");
    }
  }

  function getCanBuyVariant(form, variant) {
    var map = getPurchasableMap(form);
    var variantId = variant && variant.id ? variant.id : getCurrentVariantId(form);

    if (!variantId) return true;
    if (map && Object.prototype.hasOwnProperty.call(map, String(variantId))) {
      return !!map[String(variantId)];
    }
    if (variant && typeof variant.available !== "undefined") return !!variant.available;

    return true;
  }

  function isBackInStockEligible(form, variant, canBuy) {
    return !canBuy;
  }

  function syncVariantBuyState(form, variant) {
    if (!form) return;

    var activeVariant = variant || getVariantFromPicker(form.id);
    var variantId = activeVariant && activeVariant.id ? activeVariant.id : getCurrentVariantId(form);
    var canBuyFromMap = getCanBuyVariant(form, activeVariant);
    var shopMax = getVariantMaxQuantity(form, variantId);
    var formId = form.id;
    if (!formId) return;

    var context = getBuyButtonsContext(form);

    function renderBuyState(canBuy, cart) {
      setElementHidden(context.purchaseActions, !canBuy && !backInStockEligible);

      var quantity = context.purchaseActions
        ? context.purchaseActions.querySelector(".product-form__quantity")
        : null;
      setElementHidden(quantity, !canBuy);
      var selector =
        '#' +
        CSS.escape(formId) +
        ' [data-product-add-to-cart-button], [data-product-add-to-cart-button][form="' +
        formId +
        '"]';
      document.querySelectorAll(selector).forEach(function (button) {
        setButtonState(button, canBuy);
      });

      applyQuantityMaxForVariant(form, variantId, shopMax, cart);
    }

    if (shopMax == null) {
      renderBuyState(canBuyFromMap, null);
      return;
    }

    fetchCartJson()
      .then(function (cart) {
        var remaining = Math.max(0, shopMax - getInCartQuantityForVariant(cart, variantId));
        renderBuyState(canBuyFromMap && remaining > 0, cart);
      })
      .catch(function () {
        renderBuyState(canBuyFromMap, null);
      });
  }

  function scheduleVariantBuyStateSync(form, variant) {
    if (!form) return;

    window.setTimeout(function () {
      syncVariantBuyState(form, variant || getVariantFromPicker(form.id));
    }, 0);
  }

  function handleVariantChange(event) {
    var detail = (event && event.detail) || {};
    var formId = detail.formId || (event.target && event.target.id);
    var form = formId ? document.getElementById(formId) || document.forms[formId] : event && event.target;
    if (!form) return;

    scheduleVariantBuyStateSync(form, detail.variant);
  }

  function handleProductRerender(event) {
    var form = event && event.target;
    if (!form) return;

    scheduleVariantBuyStateSync(form);
  }

  function bindProductFormVariantEvents(form) {
    if (!form || form._backInStockBound) return;

    form._backInStockBound = true;
    form.addEventListener("variant:change", handleVariantChange);
    form.addEventListener("variant:changed", handleVariantChange);
    form.addEventListener("product:rerender", handleProductRerender);
  }

  document.addEventListener("variant:change", handleVariantChange);
  document.addEventListener("variant:changed", handleVariantChange);

  function resyncAllProductFormsAfterCartChange() {
    document.querySelectorAll("form[is='product-form']").forEach(function (form) {
      scheduleVariantBuyStateSync(form, getVariantFromPicker(form.id));
    });
  }

  document.documentElement.addEventListener("cart:updated", resyncAllProductFormsAfterCartChange);
  document.documentElement.addEventListener("cart:refresh", resyncAllProductFormsAfterCartChange);

  function syncInitialBackInStockForms() {
    document.querySelectorAll("form[is='product-form']").forEach(function (form) {
      bindProductFormVariantEvents(form);
      syncVariantBuyState(form, getVariantFromPicker(form.id));
    });
  }

  document.addEventListener("shopify:section:load", syncInitialBackInStockForms);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncInitialBackInStockForms);
  } else {
    syncInitialBackInStockForms();
  }

  document.addEventListener(
    "click",
    function (event) {
      var button = event.target.closest("[data-product-add-to-cart-button]");
      if (!button || button.disabled) return;

      var form =
        button.form ||
        (button.getAttribute("form")
          ? document.getElementById(button.getAttribute("form")) || document.forms[button.getAttribute("form")]
          : null);
      if (!form || form.getAttribute("is") !== "product-form") return;

      var variantId = getCurrentVariantId(form);
      var shopMax = getVariantMaxQuantity(form, variantId);
      if (shopMax == null) return;

      var input = getQuantityInput(form);
      var qty = parseInt((input && input.value) || "1", 10) || 1;
      var inputMax = input ? parseInt(input.getAttribute("max"), 10) : NaN;

      if (!isNaN(inputMax) && qty > inputMax) {
        if (input) {
          input.value = String(inputMax);
          if (typeof input.quantity !== "undefined") {
            input.quantity = input.value;
          }
        }
        showShopLocationExceededNotice(form, shopMax);
      }
    },
    true
  );

  document.addEventListener(
    "change",
    function (event) {
      var input = event.target;
      if (!input || !input.matches('.quantity-selector__input[name="quantity"]')) return;

      var formId = input.getAttribute("form");
      var form = formId
        ? document.getElementById(formId) || document.forms[formId]
        : input.closest("form[is='product-form']");
      if (!form) return;

      if (getVariantMaxQuantity(form, getCurrentVariantId(form)) == null) return;

      handleShopLocationQuantityAttempt(form, parseInt(input.value, 10) || 1);
    },
    false
  );

  document.addEventListener(
    "click",
    function (event) {
      var plusButton = event.target.closest("quantity-selector .quantity-selector__button:last-child");
      if (!plusButton) return;

      var selector = plusButton.closest("quantity-selector");
      if (!selector) return;

      var input = selector.querySelector('.quantity-selector__input[name="quantity"]');
      if (!input) return;

      var formId = input.getAttribute("form");
      var form = formId
        ? document.getElementById(formId) || document.forms[formId]
        : input.closest("form[is='product-form']");
      if (!form) return;

      var variantId = getCurrentVariantId(form);
      var shopMax = getVariantMaxQuantity(form, variantId);
      if (shopMax == null) return;

      var currentQty = parseInt(input.value, 10) || 0;
      var step = parseInt(input.step, 10) || 1;
      var nextQty = currentQty + step;
      var inputMax = parseInt(input.getAttribute("max"), 10);

      if (!isNaN(inputMax) && currentQty >= inputMax) {
        event.preventDefault();
        event.stopPropagation();
        showShopLocationExceededNotice(form, shopMax);
        return;
      }

      if (!isNaN(inputMax) && nextQty > inputMax) {
        event.preventDefault();
        event.stopPropagation();
        input.value = String(inputMax);
        if (typeof input.quantity !== "undefined") {
          input.quantity = input.value;
        }
        showShopLocationExceededNotice(form, shopMax);
        return;
      }

      getShopLocationRemaining(form, variantId).then(function (remaining) {
        if (nextQty > remaining) {
          input.value = String(Math.max(remaining, 0));
          if (typeof input.quantity !== "undefined") {
            input.quantity = input.value;
          }
          showShopLocationExceededNotice(form, shopMax);
        }
      });
    },
    true
  );

  document.addEventListener(
    "input",
    function (event) {
      var input = event.target;
      if (!input || !input.matches('.quantity-selector__input[name="quantity"]')) return;

      var formId = input.getAttribute("form");
      var form = formId
        ? document.getElementById(formId) || document.forms[formId]
        : input.closest("form[is='product-form']");
      if (!form) return;

      if (getVariantMaxQuantity(form, getCurrentVariantId(form)) == null) return;

      handleShopLocationQuantityAttempt(form, parseInt(input.value, 10) || 1);
    },
    false
  );

})();


// Gift card variable amount picker — fast DOM update (no section rerender)
(function () {
  function getGiftCardForm() {
    var id = window.giftCardFormId;
    if (!id) return null;
    return document.getElementById(id) || document.forms[id] || null;
  }

  function applyGiftCardVariant(variant) {
    var form = getGiftCardForm();

    // Update hidden variant-id input so add-to-cart submits the right variant
    if (form) {
      var idInput = form.elements && form.elements.namedItem('id');
      if (idInput) idInput.value = variant.id;
    }

    // Update price text (preserve the visually-hidden accessibility span)
    var priceEl = document.querySelector('.product-meta__price-list-container .ed-price-list-inner .price');
    if (priceEl) {
      var vhSpan = priceEl.querySelector('.visually-hidden');
      priceEl.textContent = variant.price;
      if (vhSpan) priceEl.insertBefore(vhSpan, priceEl.firstChild);
    }

    // Update SKU
    var skuEl = document.querySelector('.product-meta__sku-number');
    if (skuEl) skuEl.textContent = variant.sku || '';

    // Update add-to-cart button availability
    if (form) {
      var fid = CSS.escape(form.id);
      var btnSel = '#AddToCart[data-product-add-to-cart-button]';
      document.querySelectorAll(btnSel).forEach(function (btn) {
        console.log(btn);
        if (variant.available) {
          btn.disabled = false;
          btn.removeAttribute('disabled');
          btn.classList.remove('button--ternary');
          btn.querySelector('.loader-button__text').innerText = 'Jetzt in den Warenkorb legen';
          btn.setAttribute('style', '--button-background: var(--primary-button-background);--button-text-color: var(--primary-button-text-color);')
        } else {
          btn.disabled = true;
          btn.setAttribute('disabled', 'disabled');
          btn.classList.add('button--ternary');
          btn.querySelector('.loader-button__text').innerText = 'Ausverkauft';
          btn.setAttribute('style', '--button-background: var(--secondary-background);--button-text-color: var(--root-text-color);')
        }
      });
    }

    // Update URL
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());
    } catch (err) {}
  }

  // Capture-phase interceptor: fires before the theme's <variant-picker> preload delegate
  // (attached on document.body). The theme preloads a full server-side section re-render on
  // pointerenter/touchstart of any swatch label (theme.js onOptionPreload_fn). For a gift card
  // with hundreds/thousands of variants that render is huge and slow, and on mobile the repeated
  // fetches stall/crash the page. We drive everything client-side via giftCardVariantMap, so kill
  // the preload before it reaches document.body.
  ['pointerenter', 'touchstart'].forEach(function (evtName) {
    document.addEventListener(evtName, function (e) {
      var el = e.target;
      if (!el || !el.closest) return;
      if (!el.closest('[has-gift-card-fixed-values]')) return;
      e.stopPropagation();
    }, true); // true = capture phase, runs before document.body's delegate
  });

  // Capture-phase interceptor: fires before theme's delegate on document.body
  // Handles ALL block-swatch radio changes when has-gift-card-fixed-values is present
  document.addEventListener('change', function (e) {
    if (!e.target.matches('.block-swatch__radio')) return;
    var container = e.target.closest('[has-gift-card-fixed-values]');
    if (!container) return;

    // Stop event before it reaches document.body's delegate → no selectCombination/fetch
    e.stopPropagation();

    var parent = e.target.closest('.block-swatch');
    var isHidden = parent && parent.hasAttribute('hidden');

    // Clear custom input when a visible preset is clicked
    var customInput = container.querySelector('#variable-gift-card-value');
    if (!isHidden && customInput) {
      customInput.value = '';
      customInput.classList.remove('is-filled');
    }

    // Look up variant by data-option-value (e.g. "10 €" → parseInt → 10)
    var optAmt = parseInt(e.target.getAttribute('data-option-value') || '', 10);
    if (isNaN(optAmt)) return;
    var variant = window.giftCardVariantMap && window.giftCardVariantMap[String(optAmt)];
    if (!variant) {
      console.warn('[GiftCard] no variant in map for preset amount', optAmt);
      return;
    }

    console.log('[GiftCard] preset', optAmt, '€ → id', variant.id);
    applyGiftCardVariant(variant);
  }, true); // true = capture phase

  // Custom amount committed → instant DOM update via variant map (no fetch)
  document.addEventListener('change', function (e) {
    if (!e.target.matches('#variable-gift-card-value')) return;
    var input = e.target;
    var amount = parseInt(input.value, 10);
    if (isNaN(amount) || amount < 1) return;

    var variant = window.giftCardVariantMap && window.giftCardVariantMap[String(amount)];
    if (!variant) {
      console.warn('[GiftCard] no variant for amount', amount, '— check giftCardVariantMap');
      return;
    }

    console.log('[GiftCard] applying variant', amount, '€ → id', variant.id);
    input.classList.add('is-filled');

    // Remove checked state from all preset radios so their labels lose active style
    var container = input.closest('[has-gift-card-fixed-values]');
    if (container) {
      container.querySelectorAll('.block-swatch input[type="radio"]').forEach(function (r) {
        r.checked = false;
      });
    }

    applyGiftCardVariant(variant);
  });
})();

// Grundfarbe Filter JS
(function () {
  var FILTER_ID = "facet-filter-filter.v.m.custom.grundfarbe";
  var INPUT_SELECTOR = "#" + CSS.escape(FILTER_ID) + " .checkbox-container .checkbox";
  var scheduled = false;

  function getFallbackLabelText(label) {
    if (!label) return "";
    var text = (label.textContent || "").trim();
    return text.replace(/\s*\(\d+\).*/, "").trim();
  }

  function applyGrundfarbeTooltipLabels(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var inputs = scope.querySelectorAll(INPUT_SELECTOR);

    inputs.forEach(function (input) {
      var label = input.nextElementSibling;
      if (!label || label.tagName !== "LABEL") return;

      var tooltipLabel = (input.value || "").trim() || getFallbackLabelText(label);
      if (!tooltipLabel) return;

      if (label.getAttribute("data-tooltip-label") !== tooltipLabel) {
        label.setAttribute("data-tooltip-label", tooltipLabel);
      }
    });
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(function () {
      scheduled = false;
      applyGrundfarbeTooltipLabels(document);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyGrundfarbeTooltipLabels(document);
    });
  } else {
    applyGrundfarbeTooltipLabels(document);
  }

  document.addEventListener("shopify:section:load", function (event) {
    applyGrundfarbeTooltipLabels(event && event.target ? event.target : document);
  });

  var observer = new MutationObserver(function () {
    scheduleApply();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
// END:Grundfarbe Filter JS

// PDP: Showing or hiding divider from related-products section when recently-viewed-products section exists.
(function () {
  if (!document.body.classList.contains("template-product")) return;

  var mo;
  function sync() {
    if (!document.querySelector(".ed_recently_viewed_products_section")) return;
    var host = document.querySelector(".shopify-section--product-recommendations product-recommendations");
    var divider = document.querySelector(".shopify-section--product-recommendations .ed_product_recommendations__divider");
    if (host) host.classList.add("rvp_available");
    if (divider) divider.classList.add("rvp_available");
    if (host && divider) mo.disconnect();
  }

  mo = new MutationObserver(sync);
  mo.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("shopify:section:load", sync);
  sync();
})();

// PDP: keep in sync with snippets/kavalio-variant-on-sale-pdp.liquid
(function () {
  function getVariantPurchasableMap(form) {
    if (!form) return null;

    var availabilityNode = form.querySelector("script[data-variant-availability-map]");
    if (availabilityNode) {
      try {
        var availabilityMap = JSON.parse(availabilityNode.textContent || "{}");
        var purchasableMap = {};
        Object.keys(availabilityMap).forEach(function (variantId) {
          purchasableMap[variantId] = !!(availabilityMap[variantId] && availabilityMap[variantId].canBuy);
        });
        return purchasableMap;
      } catch (e) {
        return null;
      }
    }

    var node = form.querySelector("script[data-dropshipping-purchasable-map]");
    if (!node) return null;

    try {
      return JSON.parse(node.textContent || "{}");
    } catch (e) {
      return null;
    }
  }

  function getBackInStockEligibleMap(form) {
    if (!form) return null;

    var availabilityNode = form.querySelector("script[data-variant-availability-map]");
    if (availabilityNode) {
      try {
        var availabilityMap = JSON.parse(availabilityNode.textContent || "{}");
        var backInStockMap = {};
        Object.keys(availabilityMap).forEach(function (variantId) {
          backInStockMap[variantId] = !!(
            availabilityMap[variantId] && availabilityMap[variantId].backInStockEligible
          );
        });
        return backInStockMap;
      } catch (e) {
        return null;
      }
    }

    var node = form.querySelector("script[data-back-in-stock-eligible-map]");
    if (!node) return null;

    try {
      return JSON.parse(node.textContent || "{}");
    } catch (e) {
      return null;
    }
  }

  function getPdpProductForm() {
    var picker = document.querySelector("variant-picker");
    var formId = picker && picker.getAttribute("form-id");
    return (
      (formId && (document.getElementById(formId) || document.forms[formId])) ||
      document.querySelector('form[is="product-form"]')
    );
  }

  function isKavalioVariantPurchasable(variant, form) {
    if (!variant || !variant.id) return false;

    if (!form) {
      form = getPdpProductForm();
    }

    var map = getVariantPurchasableMap(form);
    if (map && Object.prototype.hasOwnProperty.call(map, String(variant.id))) {
      return map[String(variant.id)] === true;
    }

    return variant.available !== false;
  }

  function isKavalioVariantBackInStockEligible(variant, form) {
    if (!variant || !variant.id) return false;

    if (!form) {
      form = getPdpProductForm();
    }

    var map = getBackInStockEligibleMap(form);
    if (map && Object.prototype.hasOwnProperty.call(map, String(variant.id))) {
      return map[String(variant.id)] === true;
    }

    return false;
  }

  function isKavalioVariantDiscounted(variant) {
    if (!variant) return false;
    var compareAt = variant.compare_at_price;
    if (compareAt == null || compareAt === "") return false;
    return Number(variant.price) < Number(compareAt);
  }

  function isKavalioVariantOnSale(variant, form) {
    return isKavalioVariantDiscounted(variant);
  }

  function setKavalioSaleBadgeVisible(badge, visible) {
    if (!badge) return;
    badge.classList.toggle("is-hidden", !visible);
    if (visible) {
      badge.removeAttribute("hidden");
    } else {
      badge.setAttribute("hidden", "");
    }
  }

  function updatePdpSaleBadges(variant, form) {
    document.querySelectorAll("[data-kavalio-sale-badge-dynamic]").forEach(function (badge) {
      setKavalioSaleBadgeVisible(badge, isKavalioVariantOnSale(variant, form));
    });
  }

  function getInitialVariantFromPicker() {
    var picker = document.querySelector("variant-picker");
    if (!picker) return null;

    var variantScript = picker.querySelector("script[data-variant]");
    if (!variantScript) return null;

    try {
      return JSON.parse(variantScript.textContent || "{}");
    } catch (e) {
      return null;
    }
  }

  function syncInitialPdpSaleBadges() {
    if (!document.querySelector("[data-kavalio-sale-badge-dynamic]")) return;
    var variant = getInitialVariantFromPicker();
    if (!variant || !variant.id) return;

    var picker = document.querySelector("variant-picker");
    var formId = picker && picker.getAttribute("form-id");
    var form =
      (formId && (document.getElementById(formId) || document.forms[formId])) ||
      getPdpProductForm();

    updatePdpSaleBadges(variant, form);
  }

  function handleVariantChange(event) {
    var variant = event.detail && event.detail.variant;
    if (!variant) return;

    var formId = event.detail && event.detail.formId;
    var form =
      (formId && (document.getElementById(formId) || document.forms[formId])) ||
      (event.target && event.target.tagName === "FORM" ? event.target : null);

    updatePdpSaleBadges(variant, form);
  }

  document.addEventListener("variant:change", handleVariantChange);
  document.addEventListener("variant:changed", handleVariantChange);
  document.addEventListener("shopify:section:load", syncInitialPdpSaleBadges);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncInitialPdpSaleBadges);
  } else {
    syncInitialPdpSaleBadges();
  }
})();

// Collection grid: update sale badge when color swatch changes (product-item)
// Keep in sync with snippets/kavalio-variant-on-sale.liquid
(function () {
  function getVariantOnSaleMap(productItem) {
    if (!productItem) return null;

    var node = productItem.querySelector("script[data-kavalio-variant-on-sale-map]");
    if (!node) return null;

    try {
      return JSON.parse(node.textContent || "{}");
    } catch (e) {
      return null;
    }
  }

  function updateGridSaleBadge(productItem, variantId) {
    if (!productItem || !variantId) return;

    var badge = productItem.querySelector("[data-kavalio-sale-badge-grid]");
    if (!badge) return;

    var map = getVariantOnSaleMap(productItem);
    var onSale = map && map[String(variantId)] === true;
    badge.classList.toggle("is-hidden", !onSale);
    if (onSale) {
      badge.removeAttribute("hidden");
    } else {
      badge.setAttribute("hidden", "");
    }
  }

  function handleGridSwatchChange(event) {
    var input = event.target;
    if (!input.matches(".product-item-meta__swatch-list .color-swatch__radio")) return;

    var productItem = input.closest("product-item");
    if (!productItem) return;

    updateGridSaleBadge(productItem, input.getAttribute("data-variant-id"));
  }

  function syncGridSaleBadges(root) {
    (root || document).querySelectorAll("product-item").forEach(function (productItem) {
      if (!productItem.querySelector("[data-kavalio-sale-badge-grid]")) return;

      var checked = productItem.querySelector(
        ".product-item-meta__swatch-list .color-swatch__radio:checked"
      );
      if (!checked) return;

      updateGridSaleBadge(productItem, checked.getAttribute("data-variant-id"));
    });
  }

  document.addEventListener("change", handleGridSwatchChange);
  document.addEventListener("shopify:section:load", function (event) {
    syncGridSaleBadges(event && event.target ? event.target : document);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      syncGridSaleBadges(document);
    });
  } else {
    syncGridSaleBadges(document);
  }
})();


// Product media: scroll pagination dots
(function () {
  function getActiveDot(dotsNav, flickity) {
    if (flickity && flickity.selectedElement) {
      var mediaId = flickity.selectedElement.getAttribute("data-media-id");
      if (mediaId) {
        var dotByMedia = dotsNav.querySelector(
          '.dots-nav__item[data-media-id="' + mediaId + '"]:not(.is-filtered)'
        );
        if (dotByMedia) return dotByMedia;
      }
    }

    return dotsNav.querySelector('.dots-nav__item[aria-current="true"]:not(.is-filtered)');
  }

  function syncActiveDotState(mediaNav, flickity) {
    var dotsNav = mediaNav.querySelector(".dots-nav");
    if (!dotsNav || !flickity || !flickity.selectedElement) return;

    var mediaId = flickity.selectedElement.getAttribute("data-media-id");
    if (!mediaId) return;

    dotsNav.querySelectorAll(".dots-nav__item").forEach(function (dot) {
      if (dot.getAttribute("data-media-id") === mediaId && !dot.classList.contains("is-filtered")) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  function scrollActiveDotIntoView(mediaNav, animate, flickity) {
    var dotsNav = mediaNav.querySelector(".dots-nav");
    if (!dotsNav) return;

    syncActiveDotState(mediaNav, flickity);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var activeDot = getActiveDot(dotsNav, flickity);
        if (!activeDot) return;

        var containerWidth = dotsNav.clientWidth;
        var maxScroll = dotsNav.scrollWidth - containerWidth;

        if (maxScroll <= 0) {
          dotsNav.scrollLeft = 0;
          return;
        }

        var containerRect = dotsNav.getBoundingClientRect();
        var dotRect = activeDot.getBoundingClientRect();
        var dotCenterInContent =
          dotRect.left - containerRect.left + dotsNav.scrollLeft + dotRect.width / 2;
        var targetScroll = dotCenterInContent - containerWidth / 2;

        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        dotsNav.scrollTo({
          left: targetScroll,
          behavior: animate ? "smooth" : "auto",
        });
      });
    });
  }

  function setupProductMediaNav(mediaNav) {
    if (mediaNav.__dotsNavScrollBound) return;
    mediaNav.__dotsNavScrollBound = true;

    mediaNav.querySelectorAll(".product__media-prev-next").forEach(function (button) {
      button.removeAttribute("disabled");
    });

    var carouselId = mediaNav.getAttribute("controls");
    if (!carouselId) return;

    var carousel = document.getElementById(carouselId);
    if (!carousel) return;

    var scrollDots = function (animate) {
      Promise.resolve(carousel.flickityInstance).then(function (flickity) {
        scrollActiveDotIntoView(mediaNav, animate, flickity);
      });
    };

    var onSlide = function (event) {
      scrollDots(event.type !== "flickity:ready");
    };

    carousel.addEventListener("flickity:ready", onSlide);
    carousel.addEventListener("flickity:slide-changed", onSlide);
    carousel.addEventListener("flickity:slide-settled", function () {
      scrollDots(true);
    });

    var productMedia = carousel.closest("product-media");
    if (productMedia) {
      var formId = productMedia.getAttribute("form-id");
      var form = formId ? document.getElementById(formId) : null;

      if (form) {
        form.addEventListener("variant:change", function () {
          scrollDots(false);
          window.setTimeout(function () {
            scrollDots(false);
          }, 150);
        });
      }
    }
  }

  function init(root) {
    (root || document).querySelectorAll("flickity-controls.product__media-nav").forEach(setupProductMediaNav);
  }

  document.addEventListener("shopify:section:load", function (event) {
    init(event && event.target ? event.target : document);
  });

  document.addEventListener("product:media-rerendered", function (event) {
    init(event && event.target ? event.target : document);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init(document);
    });
  } else {
    init(document);
  }
})();
// END: Product media: scroll pagination dots

// Product media: floating image counter
(function () {
  function updateMediaCounter(carousel) {
    var wrapper = carousel.closest(".product__media-list-wrapper");
    if (!wrapper) return;

    var counter = wrapper.querySelector("[data-pdp-media-counter]");
    if (!counter) return;

    var currentEl = counter.querySelector("[data-pdp-media-counter-current]");
    var totalEl = counter.querySelector("[data-pdp-media-counter-total]");
    if (!currentEl || !totalEl) return;

    Promise.resolve(carousel.flickityInstance).then(function (flickity) {
      if (!flickity || flickity.slides.length <= 1) {
        counter.hidden = true;
        return;
      }

      counter.hidden = false;
      currentEl.textContent = flickity.selectedIndex + 1;
      totalEl.textContent = flickity.slides.length;
    });
  }

  function setupMediaCounter(carousel) {
    if (carousel.__mediaCounterBound) {
      updateMediaCounter(carousel);
      return;
    }
    carousel.__mediaCounterBound = true;

    var onUpdate = function () {
      updateMediaCounter(carousel);
    };

    carousel.addEventListener("flickity:ready", onUpdate);
    carousel.addEventListener("flickity:slide-changed", onUpdate);
    carousel.addEventListener("flickity:slide-settled", onUpdate);

    updateMediaCounter(carousel);
  }

  function init(root) {
    (root || document).querySelectorAll("flickity-carousel.product__media-list").forEach(setupMediaCounter);
  }

  document.addEventListener("shopify:section:load", function (event) {
    init(event && event.target ? event.target : document);
  });

  document.addEventListener("product:media-rerendered", function (event) {
    init(event && event.target ? event.target : document);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init(document);
    });
  } else {
    init(document);
  }
})();
//END: Product media floating image counter

// START: Collection price sort
(function () {
  var PRICE_SORT_VALUES = ["price-ascending", "price-descending"];
  var facetMainObserver = null;

  function getActivePriceSort() {
    var sortBy = new URLSearchParams(window.location.search).get("sort_by");
    return PRICE_SORT_VALUES.indexOf(sortBy) !== -1 ? sortBy : null;
  }

  function resortCollectionPriceSort() {
    var sortBy = getActivePriceSort();
    if (!sortBy) return;

    var inner = document.querySelector(".product-facet .product-list__inner");
    if (!inner) return;

    var children = Array.from(inner.children);
    if (children.length < 2) return;

    var ascending = sortBy === "price-ascending";
    var slots = children.map(function (el, index) {
      var raw = el.getAttribute("data-sort-price");
      return {
        el: el,
        index: index,
        isProduct: raw !== null && raw !== "",
        sortPrice: parseInt(raw, 10) || 0,
      };
    });

    if (!slots.some(function (slot) { return slot.isProduct; })) return;

    var sortedProducts = slots
      .filter(function (slot) { return slot.isProduct; })
      .slice()
      .sort(function (a, b) {
        var diff = ascending ? a.sortPrice - b.sortPrice : b.sortPrice - a.sortPrice;
        return diff !== 0 ? diff : a.index - b.index;
      });

    var productIndex = 0;
    var targetOrder = slots.map(function (slot) {
      return slot.isProduct ? sortedProducts[productIndex++].el : slot.el;
    });

    // Idempotent: skip DOM work (and any observer churn) when already ordered.
    var alreadySorted = targetOrder.every(function (el, i) {
      return children[i] === el;
    });
    if (alreadySorted) return;

    targetOrder.forEach(function (el) {
      inner.appendChild(el);
    });
  }

  function scheduleResort() {
    requestAnimationFrame(resortCollectionPriceSort);
  }

  function observeFacetMain() {
    var main = document.querySelector("product-facet #facet-main");
    if (!main) return;

    if (facetMainObserver) facetMainObserver.disconnect();
    facetMainObserver = new MutationObserver(scheduleResort);
    facetMainObserver.observe(main, { childList: true });
  }

  function init() {
    observeFacetMain();
    resortCollectionPriceSort();
  }

  window.KavalioCollectionPriceSort = resortCollectionPriceSort;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("facet:criteria-changed", scheduleResort);

  document.addEventListener("shopify:section:load", function () {
    observeFacetMain();
    scheduleResort();
  });
})();
// END: Collection price sort

// START: Forced fixed discount price on variant switch
// The PDP price lives in a server-rerendered block ([data-block-type="price"], see
// snippets/product-form.liquid). Just like the SKU (.product-meta__sku-number in the
// "meta" block), it is replaced on variant switch — but the swapped-in markup shows the
// plain price without the hard-coded 30% discount. We watch the price container (same
// idea as reading variant.sku for the SKU) and rebuild the compare/sale price + badge
// from the current variant's price whenever the block changes or a variant is selected.
(function () {
  var FALLBACK_PRODUCT_ID = 15856013902155;
  var isForced = false;
  var discountPercent = 30;
  var template = null; // {prefix, suffix, decSep, thouSep} captured from a rendered price
  var regularPriceLabelHTML = ""; // visually-hidden a11y label (regular price)
  var salePriceLabelHTML = ""; // visually-hidden a11y label (sale price)
  var savedBadgeHTML = null; // "-30%" discount label markup
  var observer = null;
  var applying = false;
  var rafId = null;

  function currentProductId() {
    try {
      var meta = window.ShopifyAnalytics && window.ShopifyAnalytics.meta;
      if (meta && meta.product && meta.product.id != null) return meta.product.id;
    } catch (e) {}
    return null;
  }

  function detectForced() {
    if (document.querySelector(".ed-price-list[data-kavalio-forced-discount]")) {
      return true;
    }
    var pid = currentProductId();
    return pid != null && String(pid) === String(FALLBACK_PRODUCT_ID);
  }

  function getInner() {
    return document.querySelector(
      ".product-meta__price-list-container .ed-price-list-inner"
    );
  }

  function getVisibleText(el) {
    if (!el) return "";
    var clone = el.cloneNode(true);
    Array.prototype.forEach.call(
      clone.querySelectorAll(".visually-hidden"),
      function (node) {
        node.parentNode.removeChild(node);
      }
    );
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  // Learn the currency layout (separators, symbol, placement) from a rendered price
  // string such as "1.199,00 €" so we can format arbitrary cent amounts identically.
  function parseTemplate(sampleText) {
    if (!sampleText) return null;
    var match = sampleText.match(/\d[\d.,\u00A0\s]*\d|\d/);
    if (!match) return null;

    var numPart = match[0];
    var start = match.index;
    var decSep = "";
    var decMatch = numPart.match(/([.,])(\d{2})$/);
    if (decMatch) decSep = decMatch[1];

    return {
      prefix: sampleText.slice(0, start),
      suffix: sampleText.slice(start + numPart.length),
      decSep: decSep,
      thouSep: decSep === "," ? "." : decSep === "." ? "," : "",
    };
  }

  function formatCents(cents, tpl) {
    var negative = cents < 0;
    cents = Math.abs(Math.round(cents));
    var whole;
    var frac = "";
    if (tpl.decSep) {
      whole = Math.floor(cents / 100);
      frac = String(cents % 100);
      while (frac.length < 2) frac = "0" + frac;
    } else {
      whole = Math.round(cents / 100);
    }
    var wholeStr = String(whole);
    if (tpl.thouSep) {
      wholeStr = wholeStr.replace(/\B(?=(\d{3})+(?!\d))/g, tpl.thouSep);
    }
    var num = tpl.decSep ? wholeStr + tpl.decSep + frac : wholeStr;
    return tpl.prefix + (negative ? "-" : "") + num + tpl.suffix;
  }

  // The full-price element is the strike-through compare price if present, otherwise the
  // lone (non-discounted) price span. The theme keeps this element's value fresh — via the
  // server rerender for normal variants, or the gift-card value picker for gift cards.
  function readFullPriceEl(inner) {
    var compare = inner.querySelector(".price--compare");
    if (compare) return compare;
    var prices = inner.querySelectorAll(".price");
    for (var i = 0; i < prices.length; i++) {
      if (!prices[i].classList.contains("price--highlight")) return prices[i];
    }
    return null;
  }

  function parseCentsFromText(text) {
    if (!text || !template) return null;
    var match = text.match(/\d[\d.,\u00A0\s]*\d|\d/);
    if (!match) return null;
    var cleaned = match[0].replace(/[\s\u00A0]/g, "");
    if (template.thouSep) cleaned = cleaned.split(template.thouSep).join("");
    if (template.decSep) cleaned = cleaned.replace(template.decSep, ".");
    var value = parseFloat(cleaned);
    return isNaN(value) ? null : Math.round(value * 100);
  }

  function captureConfig() {
    var inner = getInner();
    if (inner) {
      var compare = inner.querySelector(".price--compare");
      var highlight = inner.querySelector(".price--highlight");

      var compareVH = compare && compare.querySelector(".visually-hidden");
      if (compareVH) regularPriceLabelHTML = compareVH.outerHTML;

      var highlightVH = highlight && highlight.querySelector(".visually-hidden");
      if (highlightVH) salePriceLabelHTML = highlightVH.outerHTML;

      if (!template) {
        template = parseTemplate(
          getVisibleText(compare || inner.querySelector(".price"))
        );
      }

      var badge = inner.querySelector(
        ".product-meta__label-list .label--highlight"
      );
      if (badge) savedBadgeHTML = badge.outerHTML;
    }

    var marker = document.querySelector(
      ".ed-price-list[data-kavalio-forced-discount]"
    );
    if (marker) {
      var pct = parseFloat(marker.getAttribute("data-kavalio-forced-discount"));
      if (!isNaN(pct)) discountPercent = pct;
    }
  }

  function apply() {
    if (!isForced || applying) return;

    var inner = getInner();
    if (!inner) return;

    if (!template) {
      template = parseTemplate(getVisibleText(inner.querySelector(".price")));
    }
    if (!template) return;

    var compare = inner.querySelector(".price--compare");
    var highlight = inner.querySelector(".price--highlight");
    var fullEl = readFullPriceEl(inner);
    if (!fullEl) return;

    // Derive the full price from what is actually shown (kept fresh by the theme), so the
    // reduced price always follows — including the gift-card value picker, which only
    // updates the (first) compare price and never fires a variant:change event.
    var fullCents = parseCentsFromText(getVisibleText(fullEl));
    if (fullCents == null) return;

    var saleCents = Math.round((fullCents * (100 - discountPercent)) / 100);

    // Skip when the DOM already reflects the correct discount (avoids observer loop).
    if (
      compare &&
      highlight &&
      parseCentsFromText(getVisibleText(compare)) === fullCents &&
      parseCentsFromText(getVisibleText(highlight)) === saleCents
    ) {
      return;
    }

    var fullVH =
      (compare && compare.querySelector(".visually-hidden")
        ? compare.querySelector(".visually-hidden").outerHTML
        : "") ||
      regularPriceLabelHTML ||
      (fullEl.querySelector(".visually-hidden")
        ? fullEl.querySelector(".visually-hidden").outerHTML
        : "");
    var saleVH =
      (highlight && highlight.querySelector(".visually-hidden")
        ? highlight.querySelector(".visually-hidden").outerHTML
        : "") ||
      salePriceLabelHTML ||
      fullVH;

    applying = true;
    try {
      Array.prototype.slice.call(inner.children).forEach(function (child) {
        if (child.classList && child.classList.contains("price")) {
          inner.removeChild(child);
        }
      });

      inner.insertAdjacentHTML(
        "afterbegin",
        '<span class="price price--compare">' +
          fullVH +
          formatCents(fullCents, template) +
          "</span>" +
          '<span class="price price--highlight price--large">' +
          saleVH +
          formatCents(saleCents, template) +
          "</span>"
      );

      if (savedBadgeHTML) {
        var labelList = inner.querySelector(".product-meta__label-list");
        if (!labelList) {
          labelList = document.createElement("div");
          labelList.className = "product-meta__label-list label-list";
          inner.appendChild(labelList);
        }
        if (!labelList.querySelector(".label--highlight")) {
          labelList.insertAdjacentHTML("beforeend", savedBadgeHTML);
        }
      }
    } finally {
      applying = false;
    }
  }

  function scheduleApply() {
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(function () {
      rafId = null;
      apply();
    });
  }

  function observePrice() {
    var container = document.querySelector(".product-meta__price-list-container");
    if (!container) return;
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (applying) return;
      scheduleApply();
    });
    observer.observe(container, { childList: true, subtree: true });
  }

  function init() {
    isForced = detectForced();
    if (!isForced) return;

    captureConfig();
    apply();
    observePrice();

    document.addEventListener("variant:change", scheduleApply);
    document.addEventListener("variant:changed", scheduleApply);
    document.addEventListener("shopify:section:load", function () {
      captureConfig();
      observePrice();
      scheduleApply();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
// END: Forced fixed discount price on variant switch