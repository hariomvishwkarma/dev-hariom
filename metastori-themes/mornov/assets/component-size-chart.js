(function () {
  'use strict';

  function initSizeChart(scope) {
    var sizeChartBtn = scope.querySelector('[data-open-size-chart-popup]');
    if (!sizeChartBtn) return;

    sizeChartBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      document.body.classList.add('size-chart-show');

      if (document.body.classList.contains('quick-view-show')) {
        var popupInScope = scope.querySelector('.halo-popup-content .halo-size-chart-popup');
        if (popupInScope) popupInScope.classList.add('is-show');
      } else {
        var mainPopup = document.querySelector('#MainContent .halo-size-chart-popup');
        if (mainPopup) mainPopup.classList.add('is-show');
      }
    });

    document.addEventListener('click', function (event) {
      // Close button
      if (event.target.closest('[data-close-size-chart-popup]')) {
        document.body.classList.remove('size-chart-show');
        document.querySelectorAll('.halo-size-chart-popup').forEach(function (el) {
          el.classList.remove('is-show');
        });
        return;
      }

      // Outside click
      if (document.body.classList.contains('size-chart-show')) {
        var clickedInsideBtn   = event.target.closest('[data-open-size-chart-popup]');
        var clickedInsidePopup = event.target.closest('[data-size-chart-popup]');

        if (!clickedInsideBtn && !clickedInsidePopup) {
          document.body.classList.remove('size-chart-show');
        }
      }
    });
  }

  function productSizeChart(scope) {
    var isQuickView   = document.body.classList.contains('quick-view-show');
    var isProductPage = document.body.classList.contains('template-product');
    var hasSizeChart  = scope.querySelector('.halo-productView .productView-sizeChart') !== null;

    var shouldInit =
      !isProductPage ||
      (!isQuickView && hasSizeChart) ||
      (isQuickView && !hasSizeChart);

    if (shouldInit) {
      initSizeChart(scope);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var scope = document.querySelector('[data-section-type="size-chart"]') || document;
    productSizeChart(scope);
  });

  document.addEventListener('shopify:section:load', function (event) {
    productSizeChart(event.target);
  });

})();