(function () {
  function readData(el) {
    if (!el._finalSaleLinkData) {
      const script = el.querySelector('[data-final-sale-link-data]');
      try {
        el._finalSaleLinkData = JSON.parse(script ? script.textContent : '{}') || {};
      } catch (e) {
        el._finalSaleLinkData = {};
      }
    }
    return el._finalSaleLinkData;
  }

  function update(el, variantId) {
    const entry = variantId != null ? readData(el)[String(variantId)] : null;
    const anchor = el.querySelector('[data-final-sale-link-anchor]');

    if (entry && anchor) {
      anchor.href = entry.url;
      anchor.textContent = entry.text;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  function hasEntry(el, variantId) {
    return Object.prototype.hasOwnProperty.call(readData(el), String(variantId));
  }

  // global.js restores the selected variant (URL / reload) and fires variant:change
  // before this deferred script runs, so read the picker's current state on load.
  function syncFromPicker(el) {
    const sectionId = el.dataset.sectionId;
    if (!sectionId) return;

    const pickers = document.querySelectorAll(
      `variant-selects[data-section="${sectionId}"], variant-radios[data-section="${sectionId}"]`
    );
    for (const picker of pickers) {
      const variant = picker.currentVariant;
      if (variant && variant.id != null && hasEntry(el, variant.id)) {
        update(el, variant.id);
        return;
      }
    }
  }

  document.addEventListener('variant:change', (event) => {
    const variant = event.detail && event.detail.variant;
    if (!variant || variant.id == null) return;

    document.querySelectorAll('[data-final-sale-link]').forEach((el) => {
      if (hasEntry(el, variant.id)) {
        update(el, variant.id);
      }
    });
  });

  document.addEventListener('variant:pending', (event) => {
    const sectionId = event.detail && event.detail.sectionId;
    if (!sectionId) return;

    document.querySelectorAll(`[data-final-sale-link][data-section-id="${sectionId}"]`).forEach((el) => {
      update(el, null);
    });
  });

  document.querySelectorAll('[data-final-sale-link]').forEach(syncFromPicker);
})();
