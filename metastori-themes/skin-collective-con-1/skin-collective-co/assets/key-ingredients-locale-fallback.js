(() => {
  const run = () => {
    document.querySelectorAll('[data-key-ingredients-fallback]').forEach(async (node) => {
      if (node.dataset.kiFallbackDone === 'true') return;
      node.dataset.kiFallbackDone = 'true';

      const sectionId = node.dataset.sectionId;
      const handle = node.dataset.productHandle;
      const primary = node.dataset.primaryLocale || 'en';
      const current = node.dataset.currentLocale || '';

      if (!sectionId || !handle || !current) return;

      const primaryRoot = primary.split('-')[0];
      const currentRoot = current.split('-')[0];
      if (current === primary || currentRoot === primaryRoot) return;

      const sectionHost = document.getElementById(`shopify-section-${sectionId}`);
      if (!sectionHost) return;

      const roots = ['', `/${primary}`, `/${primaryRoot}`];
      const urls = [];

      roots.forEach((root) => {
        const base = `${root}/products/${handle}`.replace(/\/{2,}/g, '/');
        urls.push(`${base}?sections=${sectionId}`);
        urls.push(`${base}?sections=${sectionId}&locale=${primary}`);
      });

      for (const url of urls) {
        try {
          const response = await fetch(url, { credentials: 'same-origin' });
          if (!response.ok) continue;

          const payload = await response.json();
          const html = payload?.[sectionId];
          if (!html || !html.includes('key-ingredients--root')) continue;

          sectionHost.innerHTML = html;
          document.dispatchEvent(new CustomEvent('shopify:section:load', { detail: { sectionId } }));
          return;
        } catch (error) {
          // try next URL
        }
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  document.addEventListener('shopify:section:load', run);
})();
