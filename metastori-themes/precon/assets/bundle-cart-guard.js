(function () {
  if (window.__bundleCartGuardLoaded) return;
  window.__bundleCartGuardLoaded = true;

  const CONFIG = {
    debug: false,
    cartUrl: '/cart.js',
    updateUrl: '/cart/update.js',
    clearUrl: '/cart/clear.js',
    cooldownMs: 4000,
  };

  let lastActionAt = 0;

  function now() {
    return Date.now();
  }

  function isObject(value) {
    return value !== null && typeof value === 'object';
  }

  function getProperty(item, name) {
    const props = isObject(item && item.properties) ? item.properties : null;
    if (!props || props[name] == null || props[name] === '') return null;
    return props[name];
  }

  function isTruthyProperty(value) {
    return value === true || value === 'true';
  }

  function isZeroPriceItem(item) {
    const price = item && typeof item.price === 'number' ? item.price : null;
    return price === 0;
  }

  function isAddonItem(item) {
    const props = isObject(item && item.properties) ? item.properties : null;
    if (!props) return false;
    return isTruthyProperty(props._addon_item) || isTruthyProperty(props._bundle_item);
  }

  function isThemeFreeGiftItem(item) {
    if (!item) return false;
    const productId = item.product_id != null ? String(item.product_id) : '';
    if (productId && Array.isArray(window.giftLevels)) {
      for (let i = 0; i < window.giftLevels.length; i++) {
        const level = window.giftLevels[i];
        if (!level || !Array.isArray(level.giftIds)) continue;
        for (let j = 0; j < level.giftIds.length; j++) {
          if (String(level.giftIds[j]) === productId) return true;
        }
      }
    }
    const handle = item.handle;
    if (handle && Array.isArray(window.hiddenGifts) && window.hiddenGifts.indexOf(handle) !== -1) {
      return true;
    }
    return false;
  }

  function buildParentKeys(items) {
    const parentKeys = new Set();
    for (const item of items) {
      if (!isAddonItem(item) && item && item.key) parentKeys.add(item.key);
    }
    return parentKeys;
  }

  function getParentKey(item) {
    if (item && item.parent_relationship && item.parent_relationship.parent_key) {
      return item.parent_relationship.parent_key;
    }
    return null;
  }

  function hasValidParent(item, parentKeys) {
    const parentKey = getParentKey(item);
    if (!parentKey) return false;
    return parentKeys.has(parentKey);
  }

  function getItemQuantity(item) {
    const qty = item && typeof item.quantity === 'number' ? item.quantity : parseInt(String(item && item.quantity), 10);
    return Number.isNaN(qty) ? 0 : qty;
  }

  function collectBundleAddons(items, parentItem) {
    const addons = [];
    const parentKey = parentItem && parentItem.key;
    const groupId = getProperty(parentItem, '_group');

    for (const item of items) {
      if (!isAddonItem(item)) continue;
      const matchesGroup = groupId && getProperty(item, '_group') === groupId;
      const matchesParent = parentKey && getParentKey(item) === parentKey;
      if (matchesGroup || matchesParent) addons.push(item);
    }

    return addons;
  }

  function parsePositiveInt(value) {
    if (value == null || value === '') return null;
    const parsed = parseInt(String(value), 10);
    if (Number.isNaN(parsed) || parsed < 1) return null;
    return parsed;
  }

  function isIncompleteBundle(parentItem, addons) {
    const expectedCount = parsePositiveInt(getProperty(parentItem, '_addon_count'));
    if (expectedCount == null) return false;

    const uniqueCount = addons.length;
    const totalQty = addons.reduce((sum, item) => sum + getItemQuantity(item), 0);

    if (uniqueCount === 0 || totalQty < 1) return true;
    if (uniqueCount > expectedCount) return true;

    const expectedQty = parsePositiveInt(getProperty(parentItem, '_addon_qty'));
    if (expectedQty != null) {
      return totalQty !== expectedQty;
    }
    if (uniqueCount === expectedCount) return false;
    return totalQty < expectedCount;
  }

  function findIncompleteBundleKeys(items) {
    const keysToRemove = new Set();

    for (const item of items) {
      if (isAddonItem(item)) continue;

      const expectedCountRaw = getProperty(item, '_addon_count');
      if (expectedCountRaw == null) continue;

      const addons = collectBundleAddons(items, item);
      if (!isIncompleteBundle(item, addons)) continue;

      if (item && item.key) keysToRemove.add(item.key);
      addons.forEach((addon) => {
        if (addon && addon.key) keysToRemove.add(addon.key);
      });
    }

    return Array.from(keysToRemove);
  }

  function shouldClearCart(cart) {
    const items = Array.isArray(cart && cart.items) ? cart.items : [];
    if (items.length === 0) return false;

    const parentKeys = buildParentKeys(items);

    for (const item of items) {
      if (!isZeroPriceItem(item)) continue;
      if (isThemeFreeGiftItem(item)) continue;
      if (!hasValidParent(item, parentKeys)) return true;
    }

    return false;
  }

  function isOnCooldown() {
    return now() - lastActionAt < CONFIG.cooldownMs;
  }

  function markAction() {
    lastActionAt = now();
  }

  async function removeCartItemsAndRefresh(keys, reason) {
    if (!keys.length || isOnCooldown()) return;
    markAction();

    if (CONFIG.debug) {
      console.warn('[Bundle Cart Guard] Removing incomplete bundle items:', reason, keys);
    }

    const updates = {};
    keys.forEach((key) => {
      updates[key] = 0;
    });

    try {
      await fetch(CONFIG.updateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'same-origin',
        body: JSON.stringify({ updates }),
      });
    } catch (e) {
      return;
    }

    try {
      window.location.reload();
    } catch (e) {}
  }

  async function clearCartAndRefresh(reason) {
    if (isOnCooldown()) return;
    markAction();

    if (CONFIG.debug) {
      console.warn('[Bundle Cart Guard] Clearing cart:', reason);
    }

    try {
      await fetch(CONFIG.clearUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'same-origin',
      });
    } catch (e) {
    }

    try {
      window.location.reload();
    } catch (e) {}
  }

  async function runGuard(source) {
    try {
      const res = await fetch(CONFIG.cartUrl, { cache: 'no-store', credentials: 'same-origin' });
      if (!res.ok) return;
      const cart = await res.json();
      const items = Array.isArray(cart && cart.items) ? cart.items : [];

      const incompleteBundleKeys = findIncompleteBundleKeys(items);
      if (incompleteBundleKeys.length > 0) {
        await removeCartItemsAndRefresh(incompleteBundleKeys, `incomplete_bundle (${source})`);
        return;
      }

      if (shouldClearCart(cart)) {
        await clearCartAndRefresh(`integrity_failed (${source})`);
      }
    } catch (e) {
    }
  }

  runGuard('immediate');
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      runGuard('dom_content_loaded');
    });
  }

  window.addEventListener('pageshow', function (event) {
    if (event && event.persisted) runGuard('pageshow_bfcache');
    else runGuard('pageshow');
  });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') runGuard('visibility');
  });
})();
