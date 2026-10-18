/**
 * Reset product buy button loading state on back-forward cache restores.
 *
 * The theme's own handler (ProductBuyButtons.addCacheListener in theme-async.js)
 * removes the aria-busy attribute instead of setting it to "false", and it never
 * touches the "Buy it now" button at all. Either way a page restored from
 * bfcache — e.g. going back from checkout — keeps showing the spinner.
 *
 * Also: sticky ATC bar collapse/expand on mobile so browsing isn’t blocked.
 */
(() => {
  const SELECTOR = '.product-buy-buttons--primary, .product-buy-buttons--buy-now';
  const STORAGE_KEY = 'sticky-atc-collapsed';

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;

    document.querySelectorAll(SELECTOR).forEach((button) => {
      button.setAttribute('aria-busy', 'false');
    });
  });

  const setCollapsed = (drawer, collapsed) => {
    if (!drawer) return;

    drawer.setAttribute('data-collapsed', collapsed ? 'true' : 'false');

    const toggle = drawer.querySelector('[data-sticky-atc-toggle]');
    if (toggle) {
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      const label = collapsed
        ? toggle.getAttribute('data-label-expand')
        : toggle.getAttribute('data-label-collapse');
      if (label) toggle.setAttribute('aria-label', label);
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch (_) {
      /* private mode / blocked storage */
    }
  };

  const initStickyAtcCollapse = () => {
    document.querySelectorAll('.product-buy-buttons--drawer').forEach((drawer) => {
      if (drawer.dataset.stickyAtcReady === 'true') return;
      drawer.dataset.stickyAtcReady = 'true';

      // Collapsed by default; only restore expanded if user opened it this session.
      let preferCollapsed = true;
      try {
        preferCollapsed = sessionStorage.getItem(STORAGE_KEY) !== '0';
      } catch (_) {
        preferCollapsed = true;
      }

      setCollapsed(drawer, preferCollapsed);

      const toggle = drawer.querySelector('[data-sticky-atc-toggle]');
      if (!toggle) return;

      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const collapsed = drawer.getAttribute('data-collapsed') === 'true';
        setCollapsed(drawer, !collapsed);
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyAtcCollapse);
  } else {
    initStickyAtcCollapse();
  }

  document.addEventListener('shopify:section:load', initStickyAtcCollapse);
})();
