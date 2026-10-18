window.Preorder = window.Preorder || {};

// Master switch, set from Theme settings > Preorder in theme.liquid. Layouts that
// never render a product form do not set it, so an undefined flag means enabled.
window.Preorder.isEnabled = function () {
  return window.preorderEnabled !== false;
};

window.Preorder.isVariant = function (variant) {
  if (!variant) return false;
  if (!window.Preorder.isEnabled()) return false;
  return variant.inventory_policy === 'continue' && variant.inventory_quantity <= 0;
};

window.Preorder.getData = function (sectionId) {
  const el = document.getElementById('PreorderData-' + sectionId);
  if (!el) return null;

  try {
    return JSON.parse(el.textContent);
  } catch (e) {
    return null;
  }
};

window.Preorder.getVariantEntry = function (sectionId, variantId) {
  const data = window.Preorder.getData(sectionId);
  if (!data || !data.variants) return null;
  return data.variants[String(variantId)] || null;
};

window.Preorder.getVariantMessageHtml = function (sectionId, variantId) {
  const data = window.Preorder.getData(sectionId);
  const entry = window.Preorder.getVariantEntry(sectionId, variantId);

  if (!entry || !entry.isPreorder) return '';
  if (entry.messageHtml) return entry.messageHtml;
  if (data && data.defaultMessage) return data.defaultMessage;
  if (window.variantStrings && window.variantStrings.preorderMessageHtml) return window.variantStrings.preorderMessageHtml;
  if (window.variantStrings && window.variantStrings.preorderMessageDefault) {
    return `<p>${window.variantStrings.preorderMessageDefault}</p>`;
  }
  return '';
};

window.Preorder.getVariantMessageText = function (sectionId, variantId) {
  const entry = window.Preorder.getVariantEntry(sectionId, variantId);
  if (entry && entry.messageText) return entry.messageText;

  const html = window.Preorder.getVariantMessageHtml(sectionId, variantId);
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').trim();
};

window.Preorder.updateUi = function (sectionId, variant) {
  const isPreorder = window.Preorder.isVariant(variant);
  const propEl = document.getElementById('PreorderProperty-' + sectionId);
  const flagEl = document.getElementById('PreorderFlag-' + sectionId);
  const msgEl = document.getElementById('PreorderMessageProperty-' + sectionId);
  const messageEl = document.getElementById('preorder-message-' + sectionId);

  [propEl, flagEl, msgEl].forEach((el) => {
    if (el) el.disabled = !isPreorder;
  });

  if (msgEl && isPreorder && variant) {
    msgEl.value = window.Preorder.getVariantMessageText(sectionId, variant.id);
  }

  if (messageEl) {
    if (isPreorder && variant) {
      messageEl.innerHTML = window.Preorder.getVariantMessageHtml(sectionId, variant.id);
      messageEl.hidden = false;
    } else {
      messageEl.innerHTML = '';
      messageEl.hidden = true;
    }
  }

  const productForms = document.querySelectorAll('#product-form-' + sectionId + ', #product-form-' + sectionId + '--alt');
  productForms.forEach((productForm) => {
    const addButton = productForm.querySelector('[name="add"]');
    if (!addButton) return;
    addButton.dataset.preOrder = isPreorder ? 'true' : 'false';
  });
};

window.Preorder.getLineItemProperties = function (variant) {
  if (!window.Preorder.isVariant(variant)) return null;

  const sectionId = variant.section_id || document.querySelector('[id^="PreorderData-"]')?.id?.replace('PreorderData-', '');
  const messageText = sectionId
    ? window.Preorder.getVariantMessageText(sectionId, variant.id)
    : (window.variantStrings && window.variantStrings.preorderMessageDefault) || '';

  return {
    'Pre-order': 'Yes',
    _preorder: 'true',
    'Pre-order message': messageText
  };
};

window.Preorder.initSection = function (sectionId) {
  if (!window.Preorder.isEnabled()) return;

  const variantSwitch = document.querySelector(
    `quick-view-drawer details[open] variant-radios[data-section="${sectionId}"], ` +
    `quick-view-drawer details[open] variant-selects[data-section="${sectionId}"], ` +
    `variant-radios[data-section="${sectionId}"], variant-selects[data-section="${sectionId}"]`
  );

  if (!variantSwitch) return;

  if (!variantSwitch.currentVariant && typeof variantSwitch.getVariantData === 'function') {
    const form = document.getElementById('product-form-' + sectionId);
    const variantId = form?.querySelector('input[name="id"]')?.value;
    if (variantId) {
      variantSwitch.currentVariant = variantSwitch.getVariantData().find(
        (variant) => String(variant.id) === String(variantId)
      );
    }
  }

  if (!variantSwitch.currentVariant) {
    if (typeof variantSwitch.requiresVariantSelection === 'function' &&
        variantSwitch.requiresVariantSelection() &&
        typeof variantSwitch.areAllOptionsSelected === 'function' &&
        !variantSwitch.areAllOptionsSelected()) {
      window.Preorder.updateUi(sectionId, null);
    }
    return;
  }

  if (typeof variantSwitch.requiresVariantSelection === 'function' &&
      variantSwitch.requiresVariantSelection() &&
      typeof variantSwitch.areAllOptionsSelected === 'function' &&
      !variantSwitch.areAllOptionsSelected()) {
    window.Preorder.updateUi(sectionId, null);
    return;
  }

  const isPreorder = window.Preorder.isVariant(variantSwitch.currentVariant);
  if (typeof variantSwitch.toggleAddButton === 'function') {
    variantSwitch.toggleAddButton(
      !variantSwitch.currentVariant.available && !isPreorder,
      window.variantStrings.soldOut
    );
  }
  window.Preorder.updateUi(sectionId, variantSwitch.currentVariant);
};

document.addEventListener('quickview:loaded', () => {
  window.setTimeout(() => {
    document.querySelectorAll('[id^="PreorderData-"]').forEach((el) => {
      window.Preorder.initSection(el.id.replace('PreorderData-', ''));
    });
  }, 50);
});
