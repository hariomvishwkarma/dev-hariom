function updateAmazonStyleDots() {
  const scroller = document.querySelector('.product-gallery--navigation .gallery-navigation--scroller');
  if (!scroller) return;

  const dots = Array.from(
    scroller.querySelectorAll('.product-gallery--media-thumbnail')
  );

  const total = dots.length;
  if (!total) return;

  const activeIndex = dots.findIndex(
    dot => dot.getAttribute('data-gallery-selected') === 'true'
  );

  if (activeIndex === -1) return;

  /* ----------------------
     1. AMAZON STYLE DOTS
  ----------------------- */

  const windowSize = 5;
  const centerIndex = 2;

  let start = activeIndex - centerIndex;
  let end = start + windowSize - 1;

  if (total <= windowSize) {
    dots.forEach(d => d.classList.add('is-visible'));
  } else {
    if (start < 0) {
      start = 0;
      end = windowSize - 1;
    }

    if (end >= total) {
      end = total - 1;
      start = end - windowSize + 1;
    }

    dots.forEach((dot, index) => {
      dot.classList.remove('is-visible', 'is-edge');

      if (index >= start && index <= end) {
        dot.classList.add('is-visible');

        if (index === start || index === end) {
          dot.classList.add('is-edge');
        }
      }
    });
  }

  /* ----------------------
     2. CENTER ACTIVE DOT
  ----------------------- */

  const activeDot = dots[activeIndex];

  const dotCenter =
    activeDot.offsetLeft + activeDot.offsetWidth / 2;

  const containerCenter =
    scroller.clientWidth / 2;

  const targetScrollLeft =
    dotCenter - containerCenter;

  scroller.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth'
  });
}


const galleryRoot = document.querySelector('.product-gallery--navigation .gallery-navigation--scroller');

if (galleryRoot && window.innerWidth < 767) {
  const observer = new MutationObserver(updateAmazonStyleDots);

  observer.observe(galleryRoot, {
    subtree: true,
    attributes: true,
    attributeFilter: ['data-gallery-selected']
  });

  updateAmazonStyleDots();
}

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('.qty-dropdown-trigger');
  const list = document.querySelector('.qty-dropdown-list');
  const selectedText = document.querySelector('.qty-selected');
  const qtyInput = document.querySelector('.product-form--regular .quantity-selector__input');

  if (!trigger || !list || !qtyInput) return;

  trigger.addEventListener('click', () => {
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
  });

  list.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      const value = li.dataset.value;

      selectedText.textContent = value;
      qtyInput.value = value;

      qtyInput.dispatchEvent(new Event('change', { bubbles: true }));

      list.style.display = 'none';
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.qty-dropdown-wrapper')) {
      list.style.display = 'none';
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.querySelector('[data-live-search-input]');
  const mobileSearchButton = document.querySelector('.site-header-mobile-search-button[data-mobile-search-button]');

  if (searchInput && mobileSearchButton) {
    searchInput.addEventListener('click', function () {
      if (window.innerWidth <= 719) {
        mobileSearchButton.click();
      }
    });
  }
});

(function () {
  const drawer = document.querySelector('[data-custom-cart-drawer]');
  if (!drawer) return;
  if (document.body.classList.contains('template-cart')) return;

  const drawerTrigger = document.querySelector('[data-cart-drawer-trigger]');
  const panel = drawer.querySelector('.custom-cart-drawer__panel');
  const body = drawer.querySelector('[data-cart-drawer-body]');
  const countEl = drawer.querySelector('[data-cart-drawer-count]');
  const subtotalCountEl = drawer.querySelector('[data-cart-drawer-subtotal-count]');
  const subtotalEl = drawer.querySelector('[data-cart-drawer-subtotal]');
  const shippingRowEl = drawer.querySelector('[data-cart-drawer-shipping-row]');
  const recommendationsWrap = drawer.querySelector('[data-cart-drawer-recommendations]');
  const recommendationsList = drawer.querySelector('[data-cart-drawer-recommendations-list]');
  const moneyFormat = drawer.dataset.cartMoneyFormat || '${{amount}}';
  const freeShippingMinimumCents = Math.max(
    0,
    Math.round((parseFloat(drawer.dataset.freeShippingMinimum || '0') || 0) * 100)
  );
  const i18n = {
    itemOne: drawer.dataset.i18nItemOne || 'item',
    itemOther: drawer.dataset.i18nItemOther || 'items',
    empty: drawer.dataset.i18nEmpty || 'Your cart is currently empty.',
    quantity: drawer.dataset.i18nQuantity || 'Quantity',
    remove: drawer.dataset.i18nRemove || 'Remove',
    recommendationsTitle: drawer.dataset.i18nRecommendationsTitle || 'Upgrade your protection with these:',
    add: drawer.dataset.i18nAdd || 'Add',
    variantDefault: drawer.dataset.i18nVariantDefault || 'Default',
    variantLabel: drawer.dataset.i18nVariantLabel || 'Variant'
  };
  let lastFocusedElement = null;
  let isUpdating = false;
  let headerPlaceholder = null;
  let activeLoadingTarget = null;
  let cachedCart = null;

  const isMobileCartDrawerViewport = () => window.innerWidth <= 767;

  const isThemeEditor = () =>
    typeof window.Shopify !== 'undefined' && window.Shopify.designMode;

  const getSiteHeaderSection = () =>
    document.querySelector('.shopify-section.site-header-wrapper');

  const attachSiteHeaderToDrawer = () => {
    if (!isMobileCartDrawerViewport() || isThemeEditor()) return;

    const host = drawer.querySelector('[data-cart-drawer-site-header-host]');
    const headerEl = getSiteHeaderSection();
    if (!host || !headerEl) return;

    if (headerEl.parentNode === host) {
      host.hidden = false;
      document.body.classList.add('custom-cart-drawer-has-site-header');
      return;
    }

    headerPlaceholder = document.createElement('div');
    headerPlaceholder.className = 'custom-cart-drawer__header-placeholder';
    headerPlaceholder.setAttribute('aria-hidden', 'true');
    headerPlaceholder.style.height = `${headerEl.offsetHeight}px`;

    headerEl.parentNode.insertBefore(headerPlaceholder, headerEl);
    host.appendChild(headerEl);
    host.hidden = false;
    document.body.classList.add('custom-cart-drawer-has-site-header');
  };

  const restoreSiteHeaderFromDrawer = () => {
    const host = drawer.querySelector('[data-cart-drawer-site-header-host]');
    const headerEl = getSiteHeaderSection();

    if (!headerPlaceholder || !headerEl) {
      document.body.classList.remove('custom-cart-drawer-has-site-header');
      if (host) host.hidden = true;
      return;
    }

    if (headerEl.parentNode !== host) {
      document.body.classList.remove('custom-cart-drawer-has-site-header');
      if (host) host.hidden = true;
      if (headerPlaceholder && headerPlaceholder.parentNode) {
        headerPlaceholder.remove();
      }
      headerPlaceholder = null;
      return;
    }

    headerPlaceholder.parentNode.insertBefore(headerEl, headerPlaceholder);
    headerPlaceholder.remove();
    headerPlaceholder = null;
    if (host) host.hidden = true;
    document.body.classList.remove('custom-cart-drawer-has-site-header');
  };

  const setMobileDrawerOffset = () => {
    if (window.innerWidth > 767) {
      drawer.style.setProperty('--custom-cart-drawer-top-offset', '0px');
      return;
    }

    if (document.body.classList.contains('custom-cart-drawer-has-site-header')) {
      drawer.style.setProperty('--custom-cart-drawer-top-offset', '0px');
      return;
    }

    const mainHeader = document.querySelector('[data-site-header-main]') || document.querySelector('.site-header-main');
    if (!mainHeader) {
      drawer.style.setProperty('--custom-cart-drawer-top-offset', '0px');
      return;
    }

    const headerBottom = Math.max(0, Math.round(mainHeader.getBoundingClientRect().bottom));
    drawer.style.setProperty('--custom-cart-drawer-top-offset', `${headerBottom}px`);
  };

  const setTriggerDrawerState = isOpen => {
    if (!drawerTrigger) return;
    drawerTrigger.classList.toggle('is-drawer-open', Boolean(isOpen));
  };

  const getInteractiveControlFromTarget = target => {
    if (!target) return null;
    if (target.matches && target.matches('button, select, input')) return target;
    return target.querySelector ? target.querySelector('button, select, input') : null;
  };

  const setLoadingTarget = (target, isLoading) => {
    if (!target || !target.classList) return;
    const control = getInteractiveControlFromTarget(target);

    if (isLoading) {
      target.classList.add('is-loading-target');
      if (control) {
        control.dataset.wasDisabledBeforeLoading = control.disabled ? 'true' : 'false';
        control.disabled = true;
      }
      return;
    }

    target.classList.remove('is-loading-target');
    if (control) {
      if (control.dataset.wasDisabledBeforeLoading === 'false') {
        control.disabled = false;
      }
      delete control.dataset.wasDisabledBeforeLoading;
    }
  };

  const startLoadingTarget = target => {
    if (activeLoadingTarget && activeLoadingTarget !== target) {
      setLoadingTarget(activeLoadingTarget, false);
    }
    activeLoadingTarget = target || null;
    setLoadingTarget(activeLoadingTarget, true);
  };

  const stopLoadingTarget = () => {
    if (!activeLoadingTarget) return;
    setLoadingTarget(activeLoadingTarget, false);
    activeLoadingTarget = null;
  };

  const stripHtml = value => {
    const tmp = document.createElement('div');
    tmp.innerHTML = value || '';
    return tmp.textContent || tmp.innerText || '';
  };

  const formatMoney = cents => {
    if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
      return stripHtml(window.Shopify.formatMoney(cents, moneyFormat));
    }

    return `$${(cents / 100).toFixed(2)}`;
  };

  const escapeHtml = value => {
    const div = document.createElement('div');
    div.textContent = value || '';
    return div.innerHTML;
  };

  const getItemWord = count => (count === 1 ? i18n.itemOne : i18n.itemOther);

  const imageUrlForLine = item => {
    if (!item.image) return '';
    if (item.image.indexOf('?') === -1) return `${item.image}?width=120`;
    return `${item.image}&width=120`;
  };

  const buildCartQuantityOptions = currentQty => {
    const q = typeof currentQty === 'number' ? currentQty : parseInt(String(currentQty), 10) || 1;
    let html = '';
    for (let n = 1; n <= 100; n++) {
      const selected = q <= 100 && n === q ? ' selected' : '';
      html += `<option value="${n}"${selected}>${n}</option>`;
    }
    if (q > 100) {
      html += `<option value="${q}" selected>${q}</option>`;
    }
    return html;
  };

  const buildItemVariantHtml = item => {
    if (!item || !item.options_with_values || !item.options_with_values.length) {
      return item && item.variant_title
        ? `<div class="custom-cart-drawer__item-variant"><p class="custom-cart-drawer__item-variant-line">${escapeHtml(item.variant_title)}</p></div>`
        : '';
    }

    const optionLines = item.options_with_values.map(option => {
      if (!option) return '';
      const name = escapeHtml(option.name || '');
      const value = escapeHtml(option.value || '');
      if (!name && !value) return '';

      return `<p class="custom-cart-drawer__item-variant-line"><span class="custom-cart-drawer__item-variant-name">${name}:</span> <span class="custom-cart-drawer__item-variant-value">${value}</span></p>`;
    }).join('');

    return optionLines ? `<div class="custom-cart-drawer__item-variant">${optionLines}</div>` : '';
  };

  const renderItems = cart => {
    if (!cart.items.length) {
      body.innerHTML = `<div class="custom-cart-drawer__empty" data-cart-drawer-empty>${escapeHtml(i18n.empty)}</div>`;
      return;
    }

    const itemsHtml = cart.items.map((item, index) => {
      const line = index + 1;
      const imageUrl = imageUrlForLine(item);
      const variantHtml = buildItemVariantHtml(item);

      return `
        <li class="custom-cart-drawer__item" data-line="${line}">
          <a class="custom-cart-drawer__image" href="${item.url}">
            ${imageUrl ? `<img src="${imageUrl}" alt="${escapeHtml(item.product_title)}" loading="lazy">` : ''}
          </a>
          <div class="custom-cart-drawer__item-content">
            <a class="custom-cart-drawer__item-title" href="${item.url}">${escapeHtml(item.product_title)}</a>
            ${variantHtml}
            <p class="custom-cart-drawer__item-price">${formatMoney(item.final_price)}</p>
            <div class="custom-cart-drawer__item-actions">
              <div class="custom-cart-drawer__quantity">
                <div class="custom-cart-drawer__quantity-field">
                  <span class="custom-cart-drawer__quantity-legend">${escapeHtml(i18n.quantity)}</span>
                  <select
                    class="custom-cart-drawer__quantity-select"
                    data-cart-drawer-quantity
                    aria-label="${escapeHtml(i18n.quantity)}"
                  >${buildCartQuantityOptions(item.quantity)}</select>
                </div>
              </div>
              <button type="button" class="custom-cart-drawer__remove" data-cart-drawer-remove>
                <svg class="custom-cart-drawer__remove-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 3h6l1 2h5v2H3V5h5l1-2zm1 6v10M14 9v10M5 9h14v12a2 2 0 01-2 2H7a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ${escapeHtml(i18n.remove)}
              </button>
            </div>
          </div>
        </li>
      `;
    }).join('');

    body.innerHTML = `<ul class="custom-cart-drawer__items" data-cart-drawer-items>${itemsHtml}</ul>`;
  };

  const variantMoneyCents = raw => {
    if (raw === null || raw === undefined || raw === '') return null;
    if (typeof raw === 'number') {
      if (!Number.isFinite(raw)) return null;
      if (Number.isInteger(raw) && raw >= 100) return raw;
      return Math.round(raw * 100);
    }
    const s = String(raw).replace(/[^0-9.]/g, '');
    if (!s) return null;
    if (s.includes('.')) {
      const n = parseFloat(s);
      return Number.isNaN(n) ? null : Math.round(n * 100);
    }
    const n = parseInt(s, 10);
    if (Number.isNaN(n)) return null;
    if (n >= 100) return n;
    return Math.round(n * 100);
  };

  const formatVariantPriceHtml = variant => {
    const priceCents = variantMoneyCents(variant.price);
    const compareCents = variantMoneyCents(variant.compare_at_price);
    if (priceCents == null) return '';
    if (compareCents != null && compareCents > priceCents) {
      return `<span class="custom-cart-drawer__rec-compare">${formatMoney(compareCents)}</span><span class="custom-cart-drawer__rec-current">${formatMoney(priceCents)}</span>`;
    }
    return `<span class="custom-cart-drawer__rec-current">${formatMoney(priceCents)}</span>`;
  };

  const getProductImageUrl = product => {
    if (!product) return '';
    if (typeof product.featured_image === 'string' && product.featured_image) return product.featured_image;
    if (product.featured_image && product.featured_image.src) return product.featured_image.src;
    if (product.image) {
      if (typeof product.image === 'string') return product.image;
      if (product.image.src) return product.image.src;
    }
    if (product.images && product.images.length) {
      const img = product.images[0];
      return typeof img === 'string' ? img : (img.src || '');
    }
    return '';
  };

  const buildRecommendationsRequestUrl = query => {
    const root = (window.Theme.routes && window.Theme.routes.root_url) || '/';
    const prefix = root === '/' ? '' : String(root).replace(/\/$/, '');
    const path = `${prefix}/recommendations/products.json`;
    const url = new URL(path, window.location.origin);
    Object.keys(query).forEach(key => {
      if (query[key] !== undefined && query[key] !== null) {
        url.searchParams.set(key, query[key]);
      }
    });
    return url.toString();
  };

  const renderRecommendations = products => {
    if (!recommendationsWrap || !recommendationsList) return;

    if (!products || !products.length) {
      recommendationsWrap.hidden = true;
      recommendationsList.innerHTML = '';
      return;
    }

    const recommendationHtml = products.slice(0, 4).map(product => {
      const featuredImage = getProductImageUrl(product);
      const variants = product.variants && product.variants.length ? product.variants : [];
      const firstVariant = variants[0] || null;
      const multipleVariants = variants.length > 1;

      const optionsHtml = variants.map(v => {
        const label = v.title && String(v.title).trim() ? v.title : i18n.variantDefault;
        return `<option value="${v.id}" data-price="${variantMoneyCents(v.price) ?? ''}" data-compare-at="${variantMoneyCents(v.compare_at_price) ?? ''}">${escapeHtml(label)}</option>`;
      }).join('');

      const priceHtml = firstVariant ? formatVariantPriceHtml(firstVariant) : '';
      const actionsClass = multipleVariants
        ? 'custom-cart-drawer__rec-actions'
        : 'custom-cart-drawer__rec-actions custom-cart-drawer__rec-actions--single';

      const selectHtml = multipleVariants
        ? `<label class="visually-hidden" for="rec-select-${product.id}">${escapeHtml(i18n.variantLabel)}</label>
          <select id="rec-select-${product.id}" class="custom-cart-drawer__rec-select" data-cart-drawer-rec-select>${optionsHtml}</select>`
        : '';

      return `
        <li class="custom-cart-drawer__rec-card" data-cart-drawer-rec-card data-product-id="${product.id}" data-default-variant-id="${firstVariant ? firstVariant.id : ''}">
          <a href="${product.url}" class="custom-cart-drawer__rec-media">
            ${featuredImage ? `<img src="${featuredImage}" alt="${escapeHtml(product.title)}" loading="lazy" width="72" height="72">` : ''}
          </a>
          <div class="custom-cart-drawer__rec-main">
            <a href="${product.url}" class="custom-cart-drawer__rec-title">${escapeHtml(product.title)}</a>
            <div class="custom-cart-drawer__rec-price" data-rec-price>${priceHtml}</div>
            <div class="${actionsClass}">
              ${selectHtml}
              <button
                type="button"
                class="custom-cart-drawer__rec-add"
                data-cart-drawer-recommendation-atc
                ${firstVariant ? '' : 'disabled'}
              >
                ${escapeHtml(i18n.add)}
              </button>
            </div>
          </div>
        </li>
      `;
    }).join('');

    recommendationsList.innerHTML = recommendationHtml;
    recommendationsWrap.hidden = false;
    const heading = recommendationsWrap.querySelector('.custom-cart-drawer__recommendations-title');
    if (heading) {
      heading.textContent = i18n.recommendationsTitle;
    }
  };

  const updateRecCardPriceFromSelect = select => {
    const card = select.closest('[data-cart-drawer-rec-card]');
    if (!card) return;
    const opt = select.options[select.selectedIndex];
    if (!opt) return;
    const priceEl = card.querySelector('[data-rec-price]');
    if (!priceEl) return;
    const variant = {
      price: opt.dataset.price,
      compare_at_price: opt.dataset.compareAt
    };
    if (!variant.price) return;
    priceEl.innerHTML = formatVariantPriceHtml({
      price: Number(variant.price),
      compare_at_price: variant.compare_at_price !== '' && variant.compare_at_price != null
        ? Number(variant.compare_at_price)
        : null
    });
  };

  const fetchRecommendationProducts = (productId, intent) => {
    const url = buildRecommendationsRequestUrl({
      product_id: productId,
      limit: 8,
      intent
    });
    return fetch(url, {
      headers: { Accept: 'application/json' }
    }).then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`Recommendations HTTP ${response.status}`));
      }
      return response.json();
    });
  };

  const loadRecommendations = cart => {
    if (!recommendationsWrap || !recommendationsList) return Promise.resolve();

    if (!cart.items.length) {
      renderRecommendations([]);
      return Promise.resolve();
    }

    const productId = cart.items[0].product_id;
    if (!productId) {
      renderRecommendations([]);
      return Promise.resolve();
    }

    const cartProductIds = new Set(
      cart.items.map(line => line.product_id).filter(Boolean)
    );

    const pickFresh = products => {
      const list = products || [];
      return list.filter(p => p && p.id && !cartProductIds.has(p.id)).slice(0, 4);
    };

    return fetchRecommendationProducts(productId, 'complementary')
      .then(data => pickFresh(data.products))
      .then(products => {
        if (products.length) {
          renderRecommendations(products);
          return;
        }
        return fetchRecommendationProducts(productId, 'related')
          .then(data => pickFresh(data.products))
          .then(relatedProducts => {
            if (relatedProducts.length) {
              renderRecommendations(relatedProducts);
              return;
            }
            return fetch(
              buildRecommendationsRequestUrl({ product_id: productId, limit: 8 })
            )
              .then(response => {
                if (!response.ok) return { products: [] };
                return response.json();
              })
              .then(data => pickFresh(data.products))
              .then(fallbackProducts => renderRecommendations(fallbackProducts));
          });
      })
      .catch(() => renderRecommendations([]));
  };

  const renderCart = cart => {
    drawer.classList.toggle('custom-cart-drawer--empty', cart.item_count === 0);
    countEl.textContent = `(${cart.item_count} ${getItemWord(cart.item_count)})`;
    if (subtotalCountEl) {
      subtotalCountEl.textContent = `(${cart.item_count} ${getItemWord(cart.item_count)})`;
    }
    subtotalEl.textContent = formatMoney(cart.total_price);
    cachedCart = cart;
    if (shippingRowEl) {
      const showFreeShipping = freeShippingMinimumCents > 0 && cart.total_price >= freeShippingMinimumCents;
      shippingRowEl.hidden = !showFreeShipping;
    }
    renderItems(cart);
    loadRecommendations(cart);
  };

  const fetchCart = () => fetch(`${window.Theme.routes.cart_url}.js`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(response => response.json());

  /** True when `detail` from cartcount:update is a full cart payload (same shape as /cart.js). */
  const isShopifyCartLike = detail => {
    if (!detail || typeof detail !== 'object') return false;
    if (detail.source === 'custom-drawer') return false;
    return Array.isArray(detail.items) && typeof detail.item_count === 'number';
  };

  const normalizeLineAddCents = detail => {
    if (!detail || typeof detail !== 'object') return 0;
    if (typeof detail.final_line_price === 'number') return detail.final_line_price;
    if (typeof detail.line_price === 'number') return detail.line_price;
    if (typeof detail.final_price === 'number' && typeof detail.quantity === 'number') {
      return detail.final_price * detail.quantity;
    }
    if (typeof detail.price === 'number' && typeof detail.quantity === 'number') {
      return detail.price * detail.quantity;
    }
    return 0;
  };

  const buildOptimisticCartFromAddDetail = detail => {
    if (!cachedCart || !detail || typeof detail !== 'object') return null;

    const addedQty = Math.max(1, Number(detail.quantity) || 1);
    const addedCents = normalizeLineAddCents(detail);
    const variantId = Number(detail.id) || null;
    const lineKey = detail.key || null;

    if (!variantId && !lineKey) return null;

    const optimisticItems = cachedCart.items.map(item => ({ ...item }));
    const existingIndex = optimisticItems.findIndex(item =>
      (lineKey && item.key === lineKey) || (variantId && Number(item.id) === variantId)
    );

    if (existingIndex >= 0) {
      const item = { ...optimisticItems[existingIndex] };
      item.quantity = (Number(item.quantity) || 0) + addedQty;

      if (typeof item.final_line_price === 'number') {
        item.final_line_price += addedCents;
      }
      if (typeof item.line_price === 'number') {
        item.line_price += addedCents;
      }

      optimisticItems[existingIndex] = item;
    } else {
      optimisticItems.unshift({
        id: variantId,
        key: lineKey || `${variantId}:${Date.now()}`,
        product_id: Number(detail.product_id) || null,
        product_title: detail.product_title || detail.title || '',
        url: detail.url || '#',
        image: detail.image || '',
        quantity: addedQty,
        final_price: typeof detail.final_price === 'number'
          ? detail.final_price
          : (typeof detail.price === 'number' ? detail.price : 0),
        final_line_price: addedCents,
        line_price: addedCents,
        variant_title: detail.variant_title || '',
        options_with_values: []
      });
    }

    return {
      ...cachedCart,
      items: optimisticItems,
      item_count: (Number(cachedCart.item_count) || 0) + addedQty,
      total_price: (Number(cachedCart.total_price) || 0) + addedCents
    };
  };

  const isCartAddRequestUrl = url =>
    typeof url === 'string' &&
    url.indexOf(`${window.Theme.routes.cart_add_url}.js`) !== -1;

  const openDrawer = () => {
    lastFocusedElement = document.activeElement;
    attachSiteHeaderToDrawer();
    setMobileDrawerOffset();
    setTriggerDrawerState(true);
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('custom-cart-drawer-open');
    panel.focus();
  };

  const closeDrawer = () => {
    restoreSiteHeaderFromDrawer();
    setMobileDrawerOffset();
    setTriggerDrawerState(false);
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('custom-cart-drawer-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  /**
   * Open the drawer immediately. When the theme already has cart JSON (e.g. after ATC),
   * use it and skip waiting on /cart.js — that was causing multi-second delays.
   */
  const openAndRefresh = prefetchedCart => {
    if (isShopifyCartLike(prefetchedCart)) {
      renderCart(prefetchedCart);
      openDrawer();
      return;
    }

    const optimisticCart = buildOptimisticCartFromAddDetail(prefetchedCart);
    if (optimisticCart) {
      renderCart(optimisticCart);
      openDrawer();
      fetchCart().then(cart => renderCart(cart)).catch(() => {});
      return;
    }

    openDrawer();
    fetchCart()
      .then(cart => renderCart(cart))
      .catch(() => {});
  };

  const updateLine = (line, quantity, actionTarget) => {
    if (isUpdating) return;
    isUpdating = true;
    startLoadingTarget(actionTarget);

    fetch(window.Theme.routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line, quantity })
    }).then(response => {
      if (!response.ok) throw new Error('Unable to update cart');
      return response.json();
    }).then(cart => {
      renderCart(cart);
      window.dispatchEvent(new CustomEvent('cartcount:update', { detail: { ...cart, source: 'custom-drawer' } }));
    }).catch(() => {
      window.location.href = window.Theme.routes.cart_url;
    }).finally(() => {
      isUpdating = false;
      stopLoadingTarget();
    });
  };

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-cart-drawer-trigger]');
    if (trigger) {
      event.preventDefault();
      if (drawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openAndRefresh();
      }
      return;
    }

    if (event.target.closest('[data-cart-drawer-close]')) {
      closeDrawer();
      return;
    }

    const recommendationAtc = event.target.closest('[data-cart-drawer-recommendation-atc]');
    if (recommendationAtc) {
      event.preventDefault();
      const card = recommendationAtc.closest('[data-cart-drawer-rec-card]');
      const select = card ? card.querySelector('[data-cart-drawer-rec-select]') : null;
      const variantId = select
        ? Number(select.value)
        : Number(card && card.dataset.defaultVariantId);
      if (!variantId || isUpdating) return;

      isUpdating = true;
      startLoadingTarget(recommendationAtc);

      fetch(window.Theme.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
      }).then(response => {
        if (!response.ok) throw new Error('Unable to add recommendation');
        return response.json();
      }).then(addResponse => {
        const optimisticCart = buildOptimisticCartFromAddDetail(addResponse);
        if (optimisticCart) {
          renderCart(optimisticCart);
        }
        fetchCart().then(cart => {
          renderCart(cart);
          window.dispatchEvent(new CustomEvent('cartcount:update', { detail: { ...cart, source: 'custom-drawer' } }));
        }).catch(() => {});
      }).catch(() => {
        window.location.href = window.Theme.routes.cart_url;
      }).finally(() => {
        isUpdating = false;
        stopLoadingTarget();
      });

      return;
    }

    const lineItem = event.target.closest('.custom-cart-drawer__item');
    if (!lineItem) return;

    const line = Number(lineItem.dataset.line);
    if (!line) return;

    const removeButton = event.target.closest('[data-cart-drawer-remove]');
    if (removeButton) {
      event.preventDefault();
      updateLine(line, 0, removeButton);
      return;
    }
  });

  drawer.addEventListener('change', event => {
    const recSelect = event.target.closest('[data-cart-drawer-rec-select]');
    if (recSelect) {
      updateRecCardPriceFromSelect(recSelect);
      return;
    }

    const qtyInput = event.target.closest('[data-cart-drawer-quantity]');
    if (!qtyInput) return;

    const lineItem = qtyInput.closest('.custom-cart-drawer__item');
    if (!lineItem) return;

    const line = Number(lineItem.dataset.line);
    const quantity = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    const quantityField = qtyInput.closest('.custom-cart-drawer__quantity-field');
    updateLine(line, quantity, quantityField || qtyInput);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  window.addEventListener('cartcount:update', event => {
    const detail = (event && event.detail) || {};
    if (detail.source === 'custom-drawer') return;
    openAndRefresh(detail);
  });

  // Empire's product add flow uses jQuery ajax and dispatches cartcount:update only
  // after an extra /cart.js request. Hook cart add success to open faster.
  if (window.jQuery && typeof window.jQuery === 'function') {
    window.jQuery(document).on('ajaxSuccess.custom-cart-drawer', (_event, _xhr, settings, data) => {
      if (!settings || !isCartAddRequestUrl(settings.url)) return;
      if (!data || typeof data !== 'object') return;
      if (drawer.classList.contains('is-open')) return;
      openAndRefresh(data);
    });
  }

  window.addEventListener('resize', () => {
    if (drawer.classList.contains('is-open')) {
      if (window.innerWidth > 767) {
        restoreSiteHeaderFromDrawer();
      } else {
        attachSiteHeaderToDrawer();
      }
    }
    setMobileDrawerOffset();
  });
  window.addEventListener('scroll', () => {
    if (drawer.classList.contains('is-open')) {
      setMobileDrawerOffset();
    }
  }, { passive: true });
})();

(function () {
  let cartEndpointWarmed = false;

  const warmCartEndpoints = () => {
    if (cartEndpointWarmed) return;
    if (!window.Theme || !window.Theme.routes || !window.Theme.routes.cart_url) return;
    cartEndpointWarmed = true;

    fetch(`${window.Theme.routes.cart_url}.js`, {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});
  };

  const maybeWarmFromTarget = target => {
    if (!target || !target.closest) return;
    if (
      target.closest('[data-product-atc]') ||
      target.closest('[data-product-form-atc]') ||
      target.closest('[name="add"]') ||
      target.closest('form[action*="/cart/add"]')
    ) {
      warmCartEndpoints();
    }
  };

  document.addEventListener('pointerdown', event => {
    maybeWarmFromTarget(event.target);
  }, { passive: true });

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warmCartEndpoints, { timeout: 2500 });
  } else {
    setTimeout(warmCartEndpoints, 1200);
  }
})();

(function () {
  const drawer = document.querySelector('[data-custom-cart-drawer]');
  if (!drawer || document.body.classList.contains('template-cart')) return;

  let pendingAtcButton = null;
  let fallbackTimer = null;

  const isCartAddAjax = settings =>
    settings &&
    typeof settings.url === 'string' &&
    window.Theme &&
    window.Theme.routes &&
    settings.url.indexOf(`${window.Theme.routes.cart_add_url}.js`) !== -1;

  const clearPending = () => {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
    if (pendingAtcButton) {
      pendingAtcButton.classList.remove('processing');
      pendingAtcButton = null;
    }
  };

  const scheduleFallback = () => {
    if (fallbackTimer) clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(() => {
      if (pendingAtcButton && !drawer.classList.contains('is-open')) {
        pendingAtcButton.classList.remove('processing');
        pendingAtcButton = null;
      }
      fallbackTimer = null;
    }, 15000);
  };

  new MutationObserver(() => {
    if (drawer.classList.contains('is-open') && pendingAtcButton) {
      clearPending();
    }
  }).observe(drawer, { attributes: true, attributeFilter: ['class'] });

  document.addEventListener(
    'click',
    function (e) {
      const atcBtn = e.target.closest('[data-product-atc]');
      if (!atcBtn) return;

      if (pendingAtcButton && pendingAtcButton !== atcBtn) {
        pendingAtcButton.classList.remove('processing');
      }

      pendingAtcButton = atcBtn;
      atcBtn.classList.add('processing');
      scheduleFallback();

      if (drawer.classList.contains('is-open') && window.jQuery) {
        window.jQuery(document).one('ajaxSuccess.atc-already-open', (_e, _xhr, settings) => {
          if (!isCartAddAjax(settings) || pendingAtcButton !== atcBtn) return;
          clearPending();
        });
      }
    },
    true
  );
})();