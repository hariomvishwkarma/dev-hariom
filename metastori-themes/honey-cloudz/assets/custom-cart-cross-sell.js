/**
 * Custom Cart — Search & Discovery cross-sell recommendations.
 */
class CustomCartCrossSell {
  constructor() {
    this.root = null;
    this.slot = null;
    this.config = window.CustomCartUtils?.getConfig()?.crossSell || {};
    this.loading = false;
    this._lastCartSignature = null;
    this._loadId = 0;
    this.bindEvents();
  }

  bindEvents() {
    if (!document.documentElement.__crossSellAddBound) {
      document.documentElement.__crossSellAddBound = true;
      document.addEventListener("click", (e) => {
        const addBtn = e.target.closest("[data-custom-cross-sell-add]");
        if (!addBtn?.closest("[data-custom-cart]")) return;
        e.preventDefault();
        window.CustomCartCrossSell.init()?.addToCart(addBtn);
      });
    }

    if (!document.documentElement.__crossSellCartBound) {
      document.documentElement.__crossSellCartBound = true;

      const scheduleReload = () => this.debouncedReloadIfNeeded({ force: true });

      document.addEventListener("custom-cart:updated", scheduleReload);
      document.addEventListener("cart:updated", scheduleReload);
      document.addEventListener("cartdrawer:opened", () => {
        const instance = window.CustomCartCrossSell.init();
        if (!instance) return;

        const isEmpty = Boolean(
          document.querySelector("[data-custom-cart].is-empty"),
        );
        if (isEmpty) {
          instance.debouncedLoadEmptyIfNeeded();
        } else {
          instance.debouncedReloadIfNeeded({ force: true });
        }
      });
    }
  }

  debouncedReloadIfNeeded(options = {}) {
    clearTimeout(this._reloadTimer);
    this._reloadTimer = setTimeout(() => {
      window.CustomCartCrossSell.init()?.reloadIfNeeded(options);
    }, 120);
  }

  debouncedLoadEmptyIfNeeded() {
    clearTimeout(this._emptyTimer);
    this._emptyTimer = setTimeout(() => {
      window.CustomCartCrossSell.init()?.loadEmptyIfNeeded();
    }, 80);
  }

  isEnabled() {
    return this.config?.enabled !== false;
  }

  getMaxRecommendations() {
    const limit = parseInt(this.config?.maxRecommendations, 10);
    return Number.isFinite(limit) && limit > 0 ? limit : 4;
  }

  getEmptyConfig() {
    return window.CustomCartUtils?.getConfig()?.emptyRecommendations || {};
  }

  getEmptySlot() {
    return document.querySelector("[data-custom-empty-recommendations-slot]");
  }

  getProtectionFilters() {
    const config = window.CustomCartUtils.getConfig() || {};
    if (!config.protection?.enabled) {
      return {
        protectionEnabled: false,
        protectionProductId: null,
        protectionVariantId: null,
      };
    }

    return {
      protectionEnabled: true,
      protectionProductId: config.protection?.productId,
      protectionVariantId: config.protection?.variantId,
    };
  }

  isExcludedRecommendationProductId(productId) {
    const id = parseInt(productId, 10);
    if (!id) return true;

    const { protectionProductId, protectionEnabled } = this.getProtectionFilters();
    if (protectionEnabled && protectionProductId && id === protectionProductId) {
      return true;
    }

    return false;
  }

  isExcludedRecommendationCard(card) {
    const productId = parseInt(card?.dataset?.productId, 10);
    if (!productId || this.isExcludedRecommendationProductId(productId)) {
      return true;
    }

    const { protectionEnabled } = this.getProtectionFilters();
    if (!protectionEnabled) return false;

    const vendor = String(card?.dataset?.productVendor || "").toLowerCase();
    return (
      vendor === "redo" ||
      vendor === "returngo" ||
      vendor === "return go"
    );
  }

  filterRecommendationCards(cards) {
    return cards.filter((card) => !this.isExcludedRecommendationCard(card));
  }

  filterCartItems(items) {
    const { protectionProductId, protectionVariantId, protectionEnabled } = this.getProtectionFilters();
    return items.filter((item) => {
      if (protectionEnabled) {
        if (protectionProductId && item.product_id === protectionProductId) {
          return false;
        }
        if (protectionVariantId && item.variant_id === protectionVariantId) {
          return false;
        }
        const vendor = String(item.vendor || '').toLowerCase();
        if (vendor === 'redo' || vendor === 'returngo' || vendor === 'return go') {
          return false;
        }
      }
      return true;
    });
  }

  async getCartSignature() {
    const cart = await window.CustomCartUtils.fetchCart();
    return this.filterCartItems(cart.items)
      .map((item) => `${item.product_id}:${item.quantity}`)
      .sort()
      .join("|");
  }

  getScrollContainer() {
    return document.querySelector("[data-custom-cart-scroll], [data-custom-cart] .custom-cart__body");
  }

  setSlotLoading(isLoading) {
    if (!this.slot) return;
    this.slot.classList.toggle("custom-cart__cross-sell--loading", isLoading);
    if (!isLoading) {
      this.slot.style.pointerEvents = "";
    }
  }

  refreshDomRefs() {
    this.root = document.querySelector("[data-custom-cross-sell]");
    this.slot = this.root?.querySelector("[data-custom-cross-sell-slot]");
    return Boolean(this.root && this.slot);
  }

  showCrossSellSection() {
    if (this.root) this.root.hidden = false;
  }

  hideCrossSellSection() {
    if (!this.refreshDomRefs()) {
      this.root = document.querySelector("[data-custom-cross-sell]");
      if (this.root) this.root.hidden = true;
      return;
    }
    this.slot.innerHTML = "";
    this.root.hidden = true;
    this.setSlotLoading(false);
  }

  async loadEmptyIfNeeded() {
    const cartRoot = document.querySelector("[data-custom-cart].is-empty");
    if (!cartRoot) return;

    const slot = this.getEmptySlot();
    if (!slot) return;

    if (slot.querySelector("[data-custom-cross-sell-card]")) {
      window.CustomCartVariants?.bindAll(slot);
      return;
    }

    await this.loadEmptyRecommendations();
  }

  async loadEmptyRecommendations() {
    const config = this.getEmptyConfig();
    const slot = this.getEmptySlot();
    if (!config.enabled || !slot || this.loading) return;

    if (
      config.hasSelectedProducts &&
      slot.querySelector("[data-custom-cross-sell-card]")
    ) {
      window.CustomCartVariants?.bindAll(slot);
      return;
    }

    const seedId = config.seedProductId;
    if (!seedId) {
      if (!slot.querySelector("[data-custom-cross-sell-card]")) {
        slot.innerHTML =
          '<p class="custom-cart__cross-sell-empty">Select products in Theme settings → Custom cart drawer → Empty cart products.</p>';
      }
      return;
    }

    this.loading = true;
    slot.classList.add("custom-cart__cross-sell--loading");

    try {
      const cards = await this.fetchAllForProduct(seedId, config);
      const seen = new Set();
      const collected = [];

      for (const card of cards) {
        const cardProductId = parseInt(card.dataset.productId, 10);
        if (
          !cardProductId ||
          seen.has(cardProductId) ||
          this.isExcludedRecommendationCard(card)
        ) {
          continue;
        }
        seen.add(cardProductId);
        collected.push(card);
      }

      const limit = parseInt(config.maxRecommendations, 10) || 10;
      if (collected.length) {
        slot.innerHTML = "";
        collected
          .slice(0, limit)
          .forEach((card) => slot.appendChild(card.cloneNode(true)));
        window.CustomCartVariants?.bindAll(slot);
      } else {
        slot.innerHTML =
          '<p class="custom-cart__cross-sell-empty">No recommendations yet. Add complementary products in Shopify Admin → Search &amp; Discovery.</p>';
      }
    } catch (err) {
      console.error("CustomCartCrossSell empty:", err);
      slot.innerHTML =
        '<p class="custom-cart__cross-sell-empty">No recommendations right now.</p>';
    } finally {
      this.loading = false;
      slot.classList.remove("custom-cart__cross-sell--loading");
    }
  }

  async getSeedProductIds() {
    const cart = await window.CustomCartUtils.fetchCart();
    return this.filterCartItems(cart.items).map((item) => item.product_id);
  }

  getRecommendationsUrl() {
    if (window.routes?.product_recommendations_url) {
      return window.routes.product_recommendations_url;
    }

    const root = window.Shopify?.routes?.root || window.routes?.root_url || "/";
    const base = root.endsWith("/") ? root.slice(0, -1) : root;
    return `${base}/recommendations/products`;
  }

  async fetchRecommendationCards(productId, intent, configOverride = null) {
    const config = configOverride || this.config;
    const limit = config.maxRecommendations || this.getMaxRecommendations();
    const sectionId = config.sectionId || "custom-cart-recommendations";
    const baseUrl = this.getRecommendationsUrl();
    let url = `${baseUrl}?section_id=${sectionId}&product_id=${productId}&limit=${limit}`;
    if (intent) url += `&intent=${intent}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.warn(
        "CustomCartCrossSell: recommendations request failed",
        response.status,
        url,
      );
      return [];
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const wrapper = doc.querySelector("custom-cart-recommendations");
    if (wrapper) {
      return Array.from(
        wrapper.querySelectorAll("[data-custom-cross-sell-card]"),
      );
    }

    return Array.from(doc.querySelectorAll("[data-custom-cross-sell-card]"));
  }

  async fetchAllForProduct(productId, configOverride = null) {
    const complementary = this.filterRecommendationCards(
      await this.fetchRecommendationCards(
        productId,
        "complementary",
        configOverride,
      ),
    );
    if (complementary.length) return complementary;

    return this.filterRecommendationCards(
      await this.fetchRecommendationCards(productId, "related", configOverride),
    );
  }

  renderCards(cards) {
    if (!this.refreshDomRefs()) return;

    const wrap = document.createElement("div");
    wrap.className = "custom-cart__cross-sell-cards";
    cards.forEach((card) => wrap.appendChild(card.cloneNode(true)));
    this.slot.innerHTML = "";
    this.slot.appendChild(wrap);
  }

  removeInCartCards(inCart) {
    if (!this.slot) return false;

    let removed = false;
    this.slot.querySelectorAll("[data-custom-cross-sell-card]").forEach((card) => {
      const cardProductId = parseInt(card.dataset.productId, 10);
      if (inCart.has(cardProductId) || this.isExcludedRecommendationCard(card)) {
        card.remove();
        removed = true;
      }
    });

    if (removed && !this.slot.querySelector("[data-custom-cross-sell-card]")) {
      const wrap = this.slot.querySelector(".custom-cart__cross-sell-cards");
      wrap?.remove();
      this.hideCrossSellSection();
    }

    return removed;
  }

  async reloadIfNeeded({ force = false } = {}) {
    if (!this.refreshDomRefs()) return;
    if (!this.isEnabled()) return;
    if (this.loading && !force) return;

    const signature = await this.getCartSignature();
    const hasCards = Boolean(
      this.slot.querySelector("[data-custom-cross-sell-card]"),
    );

    if (!force && hasCards && this._lastCartSignature === signature) {
      const cart = await window.CustomCartUtils.fetchCart();
      const inCart = new Set(cart.items.map((item) => item.product_id));
      this.removeInCartCards(inCart);
      window.CustomCartVariants?.bindAll(this.slot);
      if (this.slot.querySelector("[data-custom-cross-sell-card]")) {
        this.showCrossSellSection();
        return;
      }
    }

    this._lastCartSignature = signature;
    await this.load();
  }

  async load() {
    if (!this.refreshDomRefs() || !this.isEnabled()) return;

    const loadId = ++this._loadId;
    const seedIds = await this.getSeedProductIds();
    if (loadId !== this._loadId) return;

    if (!seedIds.length) {
      this.hideCrossSellSection();
      this._lastCartSignature = "";
      return;
    }

    this.loading = true;
    this.setSlotLoading(true);

    const body = this.getScrollContainer();
    const scrollTop = body?.scrollTop ?? 0;

    try {
      const cart = await window.CustomCartUtils.fetchCart();
      if (loadId !== this._loadId) return;

      const inCart = new Set(cart.items.map((item) => item.product_id));
      const seen = new Set(inCart);
      const collected = [];
      const limit = this.getMaxRecommendations();

      const batches = await Promise.all(
        seedIds.map((productId) => this.fetchAllForProduct(productId)),
      );

      if (loadId !== this._loadId) return;

      for (const cards of batches) {
        for (const card of cards) {
          const cardProductId = parseInt(card.dataset.productId, 10);
          if (
            !cardProductId ||
            seen.has(cardProductId) ||
            this.isExcludedRecommendationCard(card)
          ) {
            continue;
          }

          seen.add(cardProductId);
          collected.push(card);
          if (collected.length >= limit) break;
        }
        if (collected.length >= limit) break;
      }

      if (loadId !== this._loadId || !this.refreshDomRefs()) return;

      if (collected.length) {
        this.renderCards(collected.slice(0, limit));
        this.showCrossSellSection();
        this._lastCartSignature = await this.getCartSignature();
        window.CustomCartVariants?.bindAll(this.slot);
      } else {
        this.hideCrossSellSection();
      }
    } catch (err) {
      console.error("CustomCartCrossSell:", err);
      if (loadId === this._loadId) {
        this.hideCrossSellSection();
      }
    } finally {
      if (loadId === this._loadId) {
        this.loading = false;
        this.setSlotLoading(false);
        if (body) body.scrollTop = scrollTop;
      }
    }
  }

  async addToCart(button) {
    if (button.disabled || button.classList.contains("is-loading")) return;

    const card = button.closest("[data-custom-cross-sell-card]");
    const select = card?.querySelector("[data-custom-cross-sell-select]");
    const hiddenVariant = card?.querySelector(
      "[data-custom-cross-sell-variant]",
    );
    const variantId =
      select?.value || hiddenVariant?.value || button.dataset.variantId;

    if (!variantId) return;

    button.classList.add("is-loading");
    button.disabled = true;

    const sections = window.CustomCartUtils.getDrawerSectionsToRender().map(
      (s) => s.section,
    );

    try {
      const response = await fetch(window.routes.cart_add_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          items: [{ id: parseInt(variantId, 10), quantity: 1 }],
          sections,
          sections_url: `${window.location.pathname}${window.location.search}`,
        }),
      });

      const state = await response.json();

      if (state.status) {
        throw new Error(state.description || state.message);
      }

      this._lastCartSignature = null;
      await window.CustomCartUtils.refreshDrawerAfterChange(state.sections);
      window.CustomCartUtils.dispatchCartUpdated({ cart: state });
    } catch (err) {
      console.error("CustomCartCrossSell add:", err);
      button.disabled = false;
    } finally {
      button.classList.remove("is-loading");
    }
  }

  static init() {
    const cartRoot = document.querySelector("[data-custom-cart]");
    if (!cartRoot || cartRoot.classList.contains("is-empty")) {
      if (cartRoot?.classList.contains("is-empty")) {
        if (!window.__customCrossSellInstance) {
          window.__customCrossSellInstance = new CustomCartCrossSell();
        }
        return window.__customCrossSellInstance;
      }
      return null;
    }

    if (!window.__customCrossSellInstance) {
      window.__customCrossSellInstance = new CustomCartCrossSell();
    }

    const instance = window.__customCrossSellInstance;
    instance.refreshDomRefs();
    instance.config = window.CustomCartUtils?.getConfig()?.crossSell || {};
    return instance;
  }
}

window.CustomCartCrossSell = CustomCartCrossSell;
