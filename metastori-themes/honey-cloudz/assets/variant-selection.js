window.VariantSelection = window.VariantSelection || {};

window.VariantSelection.getFormId = function (form) {
  if (!form) return '';
  // Use getAttribute — form.id is shadowed by <input name="id"> on product forms.
  return form.getAttribute('id') || '';
};

window.VariantSelection.getSwitcherForForm = function (form) {
  if (!form) return null;
  const formId = window.VariantSelection.getFormId(form);
  const sectionId = formId.replace('product-form-', '').replace('--alt', '');
  if (!sectionId) return null;
  const scope = form.closest('quick-view') || form.closest('.shopify-section') || document;
  return scope.querySelector(
    'variant-radios[data-section="' + sectionId + '"], variant-selects[data-section="' + sectionId + '"]'
  );
};

window.VariantSelection.isSwitcherReady = function (switcher) {
  if (!switcher) return true;
  if (typeof switcher.areAllOptionsSelected === 'function') {
    return switcher.areAllOptionsSelected();
  }
  return true;
};

window.VariantSelection.isFormReady = function (form) {
  if (!form) return true;
  if (!window.shopSettings || !window.shopSettings.requireSizeSelection) return true;

  const switcher = window.VariantSelection.getSwitcherForForm(form);
  if (!window.VariantSelection.isSwitcherReady(switcher)) return false;

  const idInput = form.querySelector('input[name="id"]');
  return !!(idInput && idInput.value && !idInput.disabled);
};

window.VariantSelection.ensureFormReady = function (form) {
  if (!form) return false;
  const idInput = form.querySelector('input[name="id"]');
  if (idInput && idInput.value) {
    idInput.disabled = false;
  }
  return window.VariantSelection.isFormReady(form);
};

window.VariantSelection.validateForm = function (form) {
  if (!window.shopSettings || !window.shopSettings.requireSizeSelection || !form) return true;

  if (window.VariantSelection.isFormReady(form)) {
    window.VariantSelection.ensureFormReady(form);
    return true;
  }

  window.VariantSelection.showPopup();
  return false;
};

window.VariantSelection.showPopup = function () {
  const modal = document.getElementById('SizeSelectionModal');
  if (modal && typeof modal.show === 'function') {
    modal.show();
    return;
  }

  const title =
    (window.shopSettings && window.shopSettings.sizeSelectionPopupTitle) || 'Please select your options';
  alert(title);
};

window.VariantSelection.usesAjaxCart = function () {
  return (
    window.customCartDrawerEnabled === true ||
    window.CustomCartUtils?.isEnabled?.() ||
    (window.shopSettings && window.shopSettings.cartDrawer)
  );
};

document.addEventListener(
  'submit',
  function (event) {
    const form =
      event.target && event.target.getAttribute?.('data-type') === 'add-to-cart-form'
        ? event.target
        : event.target?.closest?.('form[data-type="add-to-cart-form"]');
    if (!form) return;
    if (document.body.classList.contains('template-cart')) return;

    if (window.VariantSelection.usesAjaxCart()) {
      event.preventDefault();
    }

    if (!window.VariantSelection.validateForm(form)) {
      event.stopPropagation();
    }
  },
  true
);

/* Takes the customer to the variant picker. The copy inside the sticky bar is
   marked data-no-scroll, so it is never picked as the destination. */
window.VariantSelection.scrollToPicker = function (sectionId) {
  const pickers = document.querySelectorAll(
    'variant-radios[data-section]:not([data-no-scroll]), variant-selects[data-section]:not([data-no-scroll])'
  );
  if (!pickers.length) return;

  let picker = null;
  for (let i = 0; i < pickers.length; i++) {
    if (!sectionId || pickers[i].dataset.section === sectionId) {
      picker = pickers[i];
      break;
    }
  }
  if (!picker) picker = pickers[0];

  const header = document.querySelector('sticky-header, .header-wrapper, #shopify-section-header');
  let offset = 20;
  if (header) offset += header.getBoundingClientRect().height;

  const top = Math.max(0, window.pageYOffset + picker.getBoundingClientRect().top - offset);

  /* This jump has to land before ModalDialog.show() reads window.scrollY to
     lock the body, because it scrolls back to that value on close. base.css
     sets `html { scroll-behavior: smooth !important }`, which animates even
     behavior:'auto' - the read would then catch the old position and closing
     the popup would drop the customer back where they started. Suspend it for
     this one jump; inline !important is the only thing that outranks the
     stylesheet's !important. */
  const root = document.documentElement;
  const prev = root.style.getPropertyValue('scroll-behavior');
  const prevPriority = root.style.getPropertyPriority('scroll-behavior');
  root.style.setProperty('scroll-behavior', 'auto', 'important');

  try {
    window.scrollTo({ top: top, behavior: 'instant' });
  } catch (e) {
    window.scrollTo(0, top);
  }

  if (prev) root.style.setProperty('scroll-behavior', prev, prevPriority);
  else root.style.removeProperty('scroll-behavior');
};

document.addEventListener('click', function (event) {
  const button = event.target.closest('[data-select-options-trigger]');
  if (!button) return;

  event.preventDefault();

  /* Only from the sticky bar: there the picker is scrolled off-screen, while
     the main buy buttons sit right beside it already. */
  const sticky = button.closest('.product-sticky-cart');
  if (sticky) {
    window.VariantSelection.scrollToPicker((sticky.id || '').replace(/^sticky-cart-/, ''));
    // Let the jump paint first, so the customer sees where they were taken
    // before the popup covers it.
    window.requestAnimationFrame(function () {
      window.VariantSelection.showPopup();
    });
    return;
  }

  window.VariantSelection.showPopup();
});

window.VariantSelection.syncButtonVisibility = function () {
  if (!window.shopSettings || !window.shopSettings.requireSizeSelection) return;

  document
    .querySelectorAll(
      'variant-radios[data-require-size-selection="true"], variant-selects[data-require-size-selection="true"]'
    )
    .forEach((switcher) => {
      if (typeof switcher.initRequireSizeSelection === 'function') {
        switcher.initRequireSizeSelection();
      }
    });
};

document.addEventListener('quickview:loaded', function () {
  if (typeof window.VariantSelection.syncButtonVisibility === 'function') {
    window.VariantSelection.syncButtonVisibility();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.VariantSelection.syncButtonVisibility);
} else {
  window.VariantSelection.syncButtonVisibility();
}
