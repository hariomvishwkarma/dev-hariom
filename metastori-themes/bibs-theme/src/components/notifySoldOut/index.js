
function initNotifyButtons() {
  const notifyDrawer = document.querySelector('#notify-sold-out-drawer');
  if (!notifyDrawer) return;
  const notifyButton = notifyDrawer.querySelector('#notify-button');
  const successMessage = notifyDrawer.querySelector('#notify__success');
  const errorMessage = notifyDrawer.querySelector('#notify__error');

  if (notifyButton) {
    notifyButton.addEventListener('click', async () => {
      const emailEl = notifyDrawer.querySelector('#notify-email');
      if (!emailEl) return;
      const newsletterEl = notifyDrawer.querySelector('#Subscribe-newsletter');
      const email = emailEl.value;
      const newsletter = newsletterEl ? (newsletterEl.checked ? true : false) : false;

      const notifyCollectionVariant = notifyDrawer.querySelector('#notify-collection-variant');
      const variantSelector = notifyDrawer.querySelector('#variant-selector');
      const selectedVariantId = notifyCollectionVariant ? notifyCollectionVariant.dataset.variantId : variantSelector?.getSelectedVariant()?.id;

      try {
        const domain = window.shop.domain || null;

        const response = await fetch(`https://bibsapi.netlify.app/.netlify/functions/backInStock?store=${encodeURIComponent(domain)}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            variantId: selectedVariantId,
            newsletter: newsletter,
          }),
        });

        if (!response.ok) {
          throw new Error(`Cart fetch failed: ${response.status} ${response.statusText}`);
        }

        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
      } catch (error) {
        console.log('🚀 ~ error:', error);
        successMessage.style.display = 'none';
        errorMessage.style.display = 'block';
      }
    });
  }
}

initNotifyButtons();

document.addEventListener('notify-sold-out:open', (event) => {
  initNotifyButtons();
});
