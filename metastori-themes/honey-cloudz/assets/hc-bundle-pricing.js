window.HcBundlePricing = window.HcBundlePricing || {};

window.HcBundlePricing.parseSavePercent = function (value, fallback) {
  var parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

window.HcBundlePricing.calculate = function (unitPriceCents, compareUnitCents, quantities, savePercents, staticFirst) {
  var qty1 = quantities[0];
  var qtyMid = quantities[1];
  var qtyMax = quantities[2];
  var saveMid = savePercents.mid || 0;
  var saveMax = savePercents.max || 0;
  var unit = unitPriceCents || 0;
  var compareUnit = compareUnitCents > unit ? compareUnitCents : unit;

  var compareMid = compareUnit * qtyMid;
  var priceMid = Math.round(compareMid * (100 - saveMid) / 100);

  var compareMax = compareUnit * qtyMax;
  var priceMax = Math.round(compareMax * (100 - saveMax) / 100);

  var totals = {};

  if (staticFirst && typeof staticFirst.price === 'number') {
    var sfPrice = staticFirst.price;
    var sfCompare = staticFirst.compare || 0;
    totals[qty1] = { price: sfPrice, compare: sfCompare > sfPrice ? sfCompare : 0 };
  } else {
    var price1 = unit * qty1;
    var compare1 = compareUnit * qty1;
    totals[qty1] = { price: price1, compare: compare1 > price1 ? compare1 : 0 };
  }

  totals[qtyMid] = { price: priceMid, compare: compareMid > priceMid ? compareMid : 0 };
  totals[qtyMax] = { price: priceMax, compare: compareMax > priceMax ? compareMax : 0 };
  return totals;
};

window.HcBundlePricing.formatMoney = function (cents) {
  try {
    var fmt = window.shopSettings && window.shopSettings.moneyFormat ? window.shopSettings.moneyFormat : '${{amount}}';
    if (window.theme && window.theme.Currency && typeof window.theme.Currency.formatMoney === 'function') {
      return window.theme.Currency.formatMoney(cents, fmt);
    }
  } catch (e) {}

  return (Math.round(cents) / 100).toFixed(2);
};

window.HcBundlePricing.applyToHcBundle = function (bundleEl, totals, qtyOptions, qtyFilter) {
  if (!bundleEl || !totals) return;

  qtyOptions.forEach(function (qty) {
    if (qtyFilter && qtyFilter.length && qtyFilter.indexOf(qty) === -1) return;
    var entry = totals[qty];
    if (!entry) return;

    var btn = bundleEl.querySelector('[data-hc-bundle-qty="' + String(qty) + '"]');
    if (!btn) return;

    btn.setAttribute('data-hc-bundle-price-cents', String(entry.price));
    btn.setAttribute('data-hc-bundle-compare-cents', String(entry.compare || entry.price));

    var totalEl = btn.querySelector('.hc-bundle__total');
    var compareEl = btn.querySelector('.hc-bundle__compare');

    if (totalEl) totalEl.textContent = window.HcBundlePricing.formatMoney(entry.price);
    if (compareEl) {
      if (entry.compare > entry.price) {
        compareEl.textContent = window.HcBundlePricing.formatMoney(entry.compare);
        compareEl.style.display = '';
      } else {
        compareEl.textContent = '';
        compareEl.style.display = 'none';
      }
    }
  });
};

window.HcBundlePricing.applyToOptionCards = function (container, totals, qtyFilter) {
  if (!container || !totals) return;

  container.querySelectorAll('.option-card[data-quantity]').forEach(function (card) {
    var qty = parseInt(card.getAttribute('data-quantity'), 10);
    if (qtyFilter && qtyFilter.length && qtyFilter.indexOf(qty) === -1) return;
    var entry = totals[qty];
    if (!entry) return;

    var priceEl = card.querySelector('.to-cart-price');
    var compareEl = card.querySelector('.compare-at-price');

    if (priceEl) priceEl.textContent = window.HcBundlePricing.formatMoney(entry.price);
    if (compareEl) {
      if (entry.compare > entry.price) {
        compareEl.textContent = window.HcBundlePricing.formatMoney(entry.compare);
        compareEl.style.display = '';
      } else {
        compareEl.textContent = '';
        compareEl.style.display = 'none';
      }
    }
  });
};

window.HcBundlePricing.getVariantCompareCents = function (variant) {
  if (!variant) return 0;
  var compare = variant.compare_at_price;
  if (typeof compare === 'number' && compare > variant.price) return compare;
  return variant.price || 0;
};

window.HcBundlePricing.getFirstOptionStatic = function (variantId, tiers) {
  if (!tiers || !tiers.tier1) return { price: 0, compare: 0, savings: '' };
  var id = parseInt(variantId, 10);
  var tier2 = tiers.tier2 || {};
  if (!isNaN(id) && tier2.variantIds && tier2.variantIds.length && tier2.variantIds.indexOf(id) !== -1) {
    return {
      price: tier2.price || 0,
      compare: tier2.compare || 0,
      savings: tier2.savings || ''
    };
  }
  return {
    price: tiers.tier1.price || 0,
    compare: tiers.tier1.compare || 0,
    savings: tiers.tier1.savings || ''
  };
};

window.HcBundlePricing.updateFirstOptionSavingsTag = function (card, savings) {
  if (!card) return;
  var tag = card.querySelector('[data-first-option-savings]');
  var text = card.querySelector('[data-first-option-savings-text]');
  if (!savings) {
    if (tag) tag.style.display = 'none';
    return;
  }
  if (tag) tag.style.display = '';
  if (text) text.textContent = 'Save ' + savings + '%';
};

window.HcBundlePricing.updateHcBundleOptionMeta = function (bundleEl, qty, savePercent, priceCents, options) {
  if (!bundleEl || !qty) return;
  options = options || {};
  var btn = bundleEl.querySelector('[data-hc-bundle-qty="' + String(qty) + '"]');
  if (!btn) return;
  var meta = btn.querySelector('.hc-bundle__meta');
  if (!meta) return;
  var html = '';
  if (savePercent) html += 'SAVE ' + savePercent + '%';
  if (options.isUsCustomer && priceCents > (options.freeShippingThreshold || 0)) {
    if (html) html += '&nbsp;•&nbsp;';
    html += 'FREE SHIPPING';
  }
  meta.innerHTML = html;
  meta.style.display = html ? '' : 'none';
};

window.HcBundlePricing.updateHcBundleFirstMeta = function (bundleEl, staticFirst, options) {
  if (!bundleEl || !staticFirst) return;
  options = options || {};
  var qty1 = options.qty1;
  if (!qty1) return;
  var btn = bundleEl.querySelector('[data-hc-bundle-qty="' + String(qty1) + '"]');
  if (!btn) return;
  var meta = btn.querySelector('[data-hc-first-option-meta]') || btn.querySelector('.hc-bundle__meta');
  if (!meta) return;
  var html = '';
  if (staticFirst.savings) html += 'SAVE ' + staticFirst.savings + '%';
  if (options.isUsCustomer && staticFirst.price > (options.freeShippingThreshold || 0)) {
    if (html) html += '&nbsp;•&nbsp;';
    html += 'FREE SHIPPING';
  }
  meta.innerHTML = html;
  meta.style.display = html ? '' : 'none';
};
