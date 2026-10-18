(function () {
  'use strict';

  if (window.__reviewsioRatingsMetaModalLoaded) {
    return;
  }
  window.__reviewsioRatingsMetaModalLoaded = true;

  var MODAL_ID = 'reviewsio-meta-modal';
  var WIDGET_ID = 'reviewsio-meta-modal-widget';
  var ACTIVE_CLASS = 'reviews-popup';
  var POLARIS_SCRIPT_ID = 'reviewsio-meta-polaris-core';
  var POLARIS_SCRIPT_URL = 'https://widget.reviews.io/polaris/build.js';
  var lastTrigger = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function buildConfig(productReference) {
    var baseConfig = window.CRO_REVIEWS_SPOTLIGHT_CONFIG || {
      store: 'kavalio',
      widget: 'polaris',
      options: {},
    };
    var config = clone(baseConfig);

    config.store = 'kavalio';
    config.widget = 'polaris';
    config.options = config.options || {};
    config.options.types = 'product_review';
    config.options.lang = (document.documentElement.lang || 'de').split('-')[0];
    config.options.layout = '';
    config.options.per_page = 8;
    config.options.product_review = config.options.product_review || {};
    config.options.product_review.sku = productReference
      .split(';')
      .map(function (reference) {
        return reference.trim();
      })
      .filter(function (reference, index, references) {
        return reference && references.indexOf(reference) === index;
      })
      .join(';');
    config.options.product_review.hide_if_no_results = false;
    config.options.product_review.min_rating = 1;
    delete config.options.product_review.structured_data;
    delete config.options.product_review.enable_rich_snippets;

    config.options.header = config.options.header || {};
    config.options.header.enable_summary = true;
    config.options.header.enable_ratings = true;
    config.options.header.enable_attributes = true;
    config.options.header.enable_image_gallery = true;
    config.options.header.enable_percent_recommended = false;
    config.options.header.enable_write_review = true;
    config.options.header.enable_ask_question = true;
    config.options.header.enable_sub_header = true;
    config.options.header.always_show = true;

    config.options.filtering = config.options.filtering || {};
    config.options.filtering.enable = true;
    config.options.filtering.enable_text_search = true;
    config.options.filtering.enable_sorting = true;
    config.options.filtering.enable_product_filter = false;
    config.options.filtering.enable_media_filter = false;
    config.options.filtering.enable_overall_rating_filter = false;
    config.options.filtering.enable_language_filter = false;
    config.options.filtering.enable_ratings_filters = false;
    config.options.filtering.enable_attributes_filters = false;

    config.options.reviews = config.options.reviews || {};
    config.options.reviews.enable_avatar = true;
    config.options.reviews.enable_reviewer_name = true;
    config.options.reviews.enable_verified_badge = true;
    config.options.reviews.enable_ratings = true;
    config.options.reviews.enable_helpful_vote = true;
    config.options.reviews.enable_helpful_display = true;
    config.options.reviews.enable_report = true;
    config.options.reviews.enable_share = true;
    config.options.reviews.enable_date = true;

    return config;
  }

  function closeModal() {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) {
      return;
    }

    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove(ACTIVE_CLASS);
    document.body.classList.remove(ACTIVE_CLASS);

    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  function ensureModal(trigger) {
    var existingModal = document.getElementById(MODAL_ID);
    if (existingModal) {
      return existingModal;
    }

    var modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'reviewsio-meta-modal';
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');

    var dialog = document.createElement('div');
    dialog.className = 'reviewsio-meta-modal__dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', trigger.getAttribute('data-reviewsio-modal-label') || 'Reviews');

    var closeButton = document.createElement('button');
    closeButton.className = 'reviewsio-meta-modal__close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', trigger.getAttribute('data-reviewsio-close-label') || 'Close');
    closeButton.textContent = '\u00d7';

    var widget = document.createElement('div');
    widget.id = WIDGET_ID;

    dialog.appendChild(closeButton);
    dialog.appendChild(widget);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('.reviewsio-meta-modal__close')) {
        closeModal();
      }
    });

    return modal;
  }

  function renderModal(trigger) {
    var productReference = trigger.getAttribute('data-reviewsio-product-reference');
    if (!productReference || typeof window.ReviewsWidget !== 'function') {
      trigger.removeAttribute('aria-busy');
      return;
    }

    var modal = ensureModal(trigger);
    var widget = document.getElementById(WIDGET_ID);
    widget.replaceChildren();

    try {
      new window.ReviewsWidget('#' + WIDGET_ID, buildConfig(productReference));
    } catch (error) {
      trigger.removeAttribute('aria-busy');
      return;
    }

    lastTrigger = trigger;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add(ACTIVE_CLASS);
    document.body.classList.add(ACTIVE_CLASS);
    trigger.removeAttribute('aria-busy');

    var closeButton = modal.querySelector('.reviewsio-meta-modal__close');
    if (closeButton) {
      closeButton.focus();
    }
  }

  function openWhenPolarisIsReady(trigger, attempt) {
    if (typeof window.ReviewsWidget === 'function') {
      renderModal(trigger);
      return;
    }

    if (
      attempt === 0 &&
      !document.getElementById(POLARIS_SCRIPT_ID) &&
      !document.querySelector('script[src="' + POLARIS_SCRIPT_URL + '"]')
    ) {
      var script = document.createElement('script');
      script.id = POLARIS_SCRIPT_ID;
      script.src = POLARIS_SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }

    if (attempt >= 100) {
      trigger.removeAttribute('aria-busy');
      return;
    }

    window.setTimeout(function () {
      openWhenPolarisIsReady(trigger, attempt + 1);
    }, 100);
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-reviewsio-meta-modal-trigger]');
    if (!trigger || trigger.getAttribute('aria-busy') === 'true') {
      return;
    }

    trigger.setAttribute('aria-busy', 'true');
    openWhenPolarisIsReady(trigger, 0);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
})();
