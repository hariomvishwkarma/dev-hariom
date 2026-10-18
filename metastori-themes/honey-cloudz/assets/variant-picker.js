window.variantPickerSettings = window.variantPickerSettings || {
  requireSizeBeforeAddToCart: false,
  allowSoldOutVariantSelection: false,
  sizeSelectionPopupHtml: ''
};

window.VariantPicker = window.VariantPicker || {};

window.VariantPicker.getSwitcher = function (sectionId) {
  return document.querySelector(
    'variant-radios[data-section="' + sectionId + '"], variant-selects[data-section="' + sectionId + '"]'
  );
};

window.VariantPicker.openSizeRequiredModal = function (sectionId) {
  var modal = document.getElementById('SizeRequiredModal-' + sectionId);
  if (modal && typeof modal.show === 'function') {
    modal.show();
    return;
  }

  var wrapper = document.createElement('div');
  wrapper.innerHTML = window.variantPickerSettings.sizeSelectionPopupHtml || '';
  var message = (wrapper.textContent || wrapper.innerText || '').trim();
  if (message) window.alert(message);
};

window.VariantPicker.validateAddToCart = function (productFormEl) {
  if (!window.variantPickerSettings.requireSizeBeforeAddToCart || !productFormEl) return true;

  var sectionId = productFormEl.dataset.section;
  if (!sectionId) return true;

  var switcher = window.VariantPicker.getSwitcher(sectionId);
  if (!switcher || typeof switcher.hasIncompleteSelection !== 'function') return true;

  if (switcher.hasIncompleteSelection()) {
    window.VariantPicker.openSizeRequiredModal(sectionId);
    return false;
  }

  return true;
};

document.addEventListener('DOMContentLoaded', function () {
  window.VariantPicker.bindProductForms();
});

document.addEventListener('quickview:loaded', function () {
  window.VariantPicker.bindProductForms();
});

window.VariantPicker.bindProductForms = function () {
  document.querySelectorAll('product-form[data-section]').forEach(function (productForm) {
    var form = productForm.querySelector('form');
    if (!form || form.dataset.variantPickerBound === 'true') return;
    form.dataset.variantPickerBound = 'true';

    form.addEventListener(
      'submit',
      function (evt) {
        if (!window.VariantPicker.validateAddToCart(productForm)) {
          evt.preventDefault();
          evt.stopImmediatePropagation();
        }
      },
      true
    );
  });
};
