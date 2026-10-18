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

  const buildCartQuantityListItems = currentQty => {
    const q = typeof currentQty === 'number' ? currentQty : parseInt(String(currentQty), 10) || 1;
    let html = '';
    for (let n = 1; n <= 100; n++) {
      const selected = q <= 100 && n === q ? ' aria-selected="true" class="is-selected"' : '';
      html += `<li class="custom-cart-drawer__quantity-option"${selected} role="option" data-cart-drawer-quantity-option data-value="${n}">${n}</li>`;
    }
    if (q > 100) {
      html += `<li class="custom-cart-drawer__quantity-option is-selected" aria-selected="true" role="option" data-cart-drawer-quantity-option data-value="${q}">${q}</li>`;
    }
    return html;
  };

  const syncCustomQuantityFromSelect = quantitySelect => {
    if (!quantitySelect) return;
    const quantityField = quantitySelect.closest('.custom-cart-drawer__quantity-field');
    if (!quantityField) return;

    const display = quantityField.querySelector('[data-cart-drawer-quantity-display]');
    const options = quantityField.querySelectorAll('[data-cart-drawer-quantity-option]');
    const value = String(quantitySelect.value || '1');

    if (display) display.textContent = value;

    options.forEach(option => {
      const isSelected = String(option.dataset.value) === value;
      option.classList.toggle('is-selected', isSelected);
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  };

  const closeQuantityDropdown = quantityField => {
    if (!quantityField) return;
    quantityField.classList.remove('is-open');
    const display = quantityField.querySelector('[data-cart-drawer-quantity-display]');
    const list = quantityField.querySelector('[data-cart-drawer-quantity-list]');
    if (display) display.setAttribute('aria-expanded', 'false');
    if (list) {
      const host = list.closest('.custom-cart-drawer__quantity-list-wrap');
      (host || list).hidden = true;
    }
  };

  const closeAllQuantityDropdowns = exceptField => {
    drawer.querySelectorAll('.custom-cart-drawer__quantity-field.is-open').forEach(field => {
      if (exceptField && field === exceptField) return;
      closeQuantityDropdown(field);
    });
  };

  const ensureCustomQuantityDropdowns = () => {
    const quantityFields = drawer.querySelectorAll('.custom-cart-drawer__quantity-field');
    quantityFields.forEach((quantityField, index) => {
      const quantitySelect = quantityField.querySelector('[data-cart-drawer-quantity]');
      if (!quantitySelect) return;

      quantitySelect.classList.add('custom-cart-drawer__quantity-select--native');
      quantitySelect.setAttribute('tabindex', '-1');
      quantitySelect.setAttribute('aria-hidden', 'true');

      let display = quantityField.querySelector('[data-cart-drawer-quantity-display]');
      if (!display) {
        display = document.createElement('button');
        display.type = 'button';
        display.className = 'custom-cart-drawer__quantity-display';
        display.setAttribute('data-cart-drawer-quantity-display', '');
        display.setAttribute('aria-haspopup', 'listbox');
        display.setAttribute('aria-expanded', 'false');
        quantityField.appendChild(display);
      }

      let list = quantityField.querySelector('[data-cart-drawer-quantity-list]');
      if (!list) {
        const wrap = document.createElement('div');
        wrap.className = 'custom-cart-drawer__quantity-list-wrap';
        list = document.createElement('ul');
        list.className = 'custom-cart-drawer__quantity-list';
        list.setAttribute('data-cart-drawer-quantity-list', '');
        list.setAttribute('role', 'listbox');
        wrap.appendChild(list);
        wrap.hidden = true;
        quantityField.appendChild(wrap);
      } else if (!list.parentElement || !list.parentElement.classList.contains('custom-cart-drawer__quantity-list-wrap')) {
        const wrap = document.createElement('div');
        wrap.className = 'custom-cart-drawer__quantity-list-wrap';
        wrap.hidden = list.hidden;
        list.removeAttribute('hidden');
        const parent = list.parentElement;
        if (parent) {
          parent.insertBefore(wrap, list);
          wrap.appendChild(list);
        }
      }

      list.id = `custom-cart-drawer-quantity-list-${index + 1}`;
      display.setAttribute('aria-controls', list.id);
      list.innerHTML = buildCartQuantityListItems(quantitySelect.value);
      syncCustomQuantityFromSelect(quantitySelect);
    });
  };
  const isBackorderCartItem = item => {
    const planName = item?.selling_plan_allocation?.selling_plan?.name;
    return typeof planName === 'string' && planName.toLowerCase() === 'backordered';
  };

  const buildBackorderLabelHtml = () => '<p class="custom-cart-drawer__item-backorder">Backorder</p>';

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
            ${isBackorderCartItem(item) ? buildBackorderLabelHtml() : ''}
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
    ensureCustomQuantityDropdowns();
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

  const isCartAddRequestUrl = url => {
    if (typeof url !== 'string' || !url) return false;
    try {
      const path = (url.startsWith('http') ? new URL(url, window.location.origin).pathname : url.split('?')[0])
        .replace(/\/+$/, '');
      return /\/cart\/add(\.js)?$/i.test(path);
    } catch (error) {
      return /\/cart\/add(\.js)?(\?|$)/i.test(url);
    }
  };

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
   * use it and skip waiting on /cart.js â€” that was causing multi-second delays.
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

    const quantityOption = event.target.closest('[data-cart-drawer-quantity-option]');
    if (quantityOption) {
      const quantityField = quantityOption.closest('.custom-cart-drawer__quantity-field');
      const quantitySelect = quantityField ? quantityField.querySelector('[data-cart-drawer-quantity]') : null;
      if (!quantitySelect || quantitySelect.disabled) return;

      event.preventDefault();
      const nextValue = String(quantityOption.dataset.value || '1');
      quantitySelect.value = nextValue;
      syncCustomQuantityFromSelect(quantitySelect);
      closeQuantityDropdown(quantityField);
      quantitySelect.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    const quantityField = event.target.closest('.custom-cart-drawer__quantity-field');
    if (quantityField && !quantityOption) {
      const quantityDisplayEl = quantityField.querySelector('[data-cart-drawer-quantity-display]');
      const list = quantityField.querySelector('[data-cart-drawer-quantity-list]');
      const quantitySelect = quantityField.querySelector('[data-cart-drawer-quantity]');
      if (!quantityDisplayEl || !list || !quantitySelect || quantitySelect.disabled) return;

      event.preventDefault();
      const willOpen = !quantityField.classList.contains('is-open');
      closeAllQuantityDropdowns(quantityField);
      quantityField.classList.toggle('is-open', willOpen);
      quantityDisplayEl.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      const listHost = list.closest('.custom-cart-drawer__quantity-list-wrap') || list;
      listHost.hidden = !willOpen;
      return;
    }

    if (!event.target.closest('.custom-cart-drawer__quantity-field')) {
      closeAllQuantityDropdowns();
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
    syncCustomQuantityFromSelect(qtyInput);
    closeQuantityDropdown(qtyInput.closest('.custom-cart-drawer__quantity-field'));

    const lineItem = qtyInput.closest('.custom-cart-drawer__item');
    if (!lineItem) return;

    const line = Number(lineItem.dataset.line);
    const quantity = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    const quantityField = qtyInput.closest('.custom-cart-drawer__quantity-field');
    updateLine(line, quantity, quantityField || qtyInput);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeAllQuantityDropdowns();
      closeDrawer();
    }
  });

  ensureCustomQuantityDropdowns();

  const checkoutForm = drawer.querySelector('.custom-cart-drawer__buttons form[action]');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', event => {
      const submitter = event.submitter || checkoutForm.querySelector('[data-cart-drawer-checkout-button]');
      const checkoutButton = submitter && submitter.matches('[data-cart-drawer-checkout-button]')
        ? submitter
        : checkoutForm.querySelector('[data-cart-drawer-checkout-button]');

      if (!checkoutButton) return;
      checkoutButton.classList.add('processing');
      checkoutButton.setAttribute('aria-disabled', 'true');
    });
  }

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
      if (drawer.classList.contains('is-open')) {
        if (!isUpdating) {
          fetchCart().then(cart => renderCart(cart)).catch(() => {});
        }
        return;
      }
      openAndRefresh(data && typeof data === 'object' ? data : undefined);
    });
  }

  // Frequently Bought Together (CBB) does not know this custom drawer.
  // Open on first /cart/add success, then do a couple of follow-up refreshes.
  (function bindCbbFrequentlyBoughtDrawer() {
    const buttonSelector = '.cbb-frequently-bought-add-button';
    let pending = false;
    let opened = false;
    let pollTimer = null;
    let stopTimer = null;
    let followUpTimers = [];

    const hasCbbError = () => {
      const errorBox = document.querySelector('.cbb-frequently-bought-error');
      if (!errorBox) return false;
      const hidden = errorBox.style.display === 'none' || errorBox.getAttribute('hidden') !== null;
      return !hidden && Boolean(errorBox.textContent && errorBox.textContent.trim());
    };

    const clearFollowUps = () => {
      followUpTimers.forEach(timer => clearTimeout(timer));
      followUpTimers = [];
    };

    const clearWatch = () => {
      pending = false;
      opened = false;
      if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
      }
      if (stopTimer) {
        clearTimeout(stopTimer);
        stopTimer = null;
      }
      clearFollowUps();
    };

    const refreshDrawerCart = () => {
      if (isUpdating) return;
      fetchCart()
        .then(cart => {
          if (isUpdating) return;
          renderCart(cart);
          window.dispatchEvent(new CustomEvent('cartcount:update', { detail: { ...cart, source: 'custom-drawer' } }));
        })
        .catch(() => {});
    };

    const scheduleFollowUpRefreshes = () => {
      clearFollowUps();
      followUpTimers = [350, 900].map(delay => setTimeout(refreshDrawerCart, delay));
    };

    const onCbbCartAddSuccess = addData => {
      if (!pending || hasCbbError()) return;

      try {
        if (!opened) {
          opened = true;
          if (pollTimer) {
            clearTimeout(pollTimer);
            pollTimer = null;
          }
          openAndRefresh(addData && typeof addData === 'object' ? addData : undefined);
          scheduleFollowUpRefreshes();
          return;
        }

        refreshDrawerCart();
      } catch (error) {
        // Never break the app/theme add request if our drawer hook fails.
      }
    };

    const getRequestUrl = input => {
      if (typeof input === 'string') return input;
      if (input && typeof input.url === 'string') return input.url;
      return '';
    };

    const originalFetch = window.fetch;
    if (typeof originalFetch === 'function') {
      window.fetch = function patchedCbbFetch() {
        const url = getRequestUrl(arguments[0]);
        const shouldWatch = pending && isCartAddRequestUrl(url);
        const request = originalFetch.apply(this, arguments);
        if (!shouldWatch) return request;
        return request.then(response => {
          if (response && response.ok) onCbbCartAddSuccess();
          return response;
        });
      };
    }

    const originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function patchedCbbXhrSend() {
      if (pending && this._cbbRequestUrl && isCartAddRequestUrl(this._cbbRequestUrl)) {
        this.addEventListener('load', function onCbbXhrLoad() {
          if (!(pending && this.status >= 200 && this.status < 300)) return;
          let addData;
          try {
            addData = JSON.parse(this.responseText);
          } catch (error) {
            addData = undefined;
          }
          onCbbCartAddSuccess(addData);
        }, { once: true });
      }
      return originalXhrSend.apply(this, arguments);
    };

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function patchedCbbXhrOpen(method, url) {
      this._cbbRequestUrl = String(url || '');
      return originalXhrOpen.apply(this, arguments);
    };

    if (window.jQuery && typeof window.jQuery === 'function') {
      window.jQuery(document).on('ajaxSuccess.cbb-cart-drawer', (_event, _xhr, settings, data) => {
        if (!pending || !settings || !isCartAddRequestUrl(settings.url)) return;
        onCbbCartAddSuccess(data);
      });
    }

    document.addEventListener('click', event => {
      if (!event.target.closest(buttonSelector)) return;

      clearWatch();
      pending = true;
      stopTimer = setTimeout(clearWatch, 4000);

      let lastCount = cachedCart ? Number(cachedCart.item_count) || 0 : 0;
      const poll = () => {
        if (!pending || opened) return;
        if (hasCbbError()) {
          clearWatch();
          return;
        }

        fetchCart()
          .then(cart => {
            if (!pending || opened) return;
            const count = Number(cart.item_count) || 0;
            if (count > lastCount) {
              onCbbCartAddSuccess(cart);
              return;
            }
            pollTimer = setTimeout(poll, 150);
          })
          .catch(() => {
            if (pending && !opened) pollTimer = setTimeout(poll, 200);
          });
      };

      pollTimer = setTimeout(poll, 80);
    }, true);
  })();

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
  const body = document.body;
  if (!body || body.classList.contains('template-product')) return;

  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const sourceSearch = document.querySelector('[data-site-header] .live-search');
  if (!sourceSearch) return;

  const floatingSearch = document.createElement('div');
  floatingSearch.className = 'mobile-scroll-search';
  floatingSearch.setAttribute('aria-hidden', 'true');
  floatingSearch.innerHTML = sourceSearch.outerHTML;
  body.appendChild(floatingSearch);

  const sourceInput = sourceSearch.querySelector('[data-live-search-input]');
  const sourceForm = sourceSearch.querySelector('[data-live-search-form]');
  const sourceTakeoverCancel = sourceSearch.querySelector('[data-live-search-takeover-cancel]');
  const floatingInput = floatingSearch.querySelector('[data-live-search-input]');
  const floatingForm = floatingSearch.querySelector('[data-live-search-form]');

  let isSyncing = false;
  let rafId = null;
  const stickyTriggerOffset = 270;

  const syncInputValue = (fromInput, toInput, triggerLiveEvents) => {
    if (!fromInput || !toInput || isSyncing) return;
    isSyncing = true;
    toInput.value = fromInput.value;
    if (triggerLiveEvents) {
      toInput.dispatchEvent(new Event('input', { bubbles: true }));
      toInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Unidentified' }));
    }
    isSyncing = false;
  };

  const forceOpenSearchTakeover = () => {
    sourceSearch.classList.add('live-search', 'live-search--focused', 'live-search--takeover', 'live-search--active');
    body.classList.add('allow-scroll-while-locked', 'mobile-search-takeover-active');
    // body.classList.remove('mobile-scroll-search-active');
    // floatingSearch.classList.remove('is-active');

    if (sourceTakeoverCancel) {
      sourceTakeoverCancel.hidden = false;
      sourceTakeoverCancel.removeAttribute('hidden');
    }

    if (!sourceInput) return;
    sourceInput.focus();

    setTimeout(() => {
      // body.classList.remove('mobile-scroll-search-active');
      // floatingSearch.classList.remove('is-active');
    }, 00);
    sourceInput.dispatchEvent(new Event('input', { bubbles: true }));
    sourceInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Unidentified' }));
  };

  if (floatingInput && sourceInput) {
    floatingInput.addEventListener('input', () => syncInputValue(floatingInput, sourceInput, true));
    sourceInput.addEventListener('input', () => syncInputValue(sourceInput, floatingInput, false));
    floatingInput.addEventListener('focus', () => {
      syncInputValue(floatingInput, sourceInput, false);
      forceOpenSearchTakeover();
    });
    floatingInput.addEventListener('click', () => {
      syncInputValue(floatingInput, sourceInput, false);
      forceOpenSearchTakeover();
    });
  }

  if (floatingForm && sourceForm && sourceInput && floatingInput) {
    floatingForm.addEventListener('submit', event => {
      event.preventDefault();
      syncInputValue(floatingInput, sourceInput, false);
      forceOpenSearchTakeover();
    });
  }

  const setFloatingState = () => {
    if (body.classList.contains('mobile-search-takeover-active')) {
      // body.classList.remove('mobile-scroll-search-active');
      // floatingSearch.classList.remove('is-active');
      return; 
    }

    if (!mobileQuery.matches || body.classList.contains('template-product')) {
      // body.classList.remove('mobile-scroll-search-active');
      // floatingSearch.classList.remove('is-active');
      return;
    }

    const shouldShow =
      window.scrollY > stickyTriggerOffset &&
      !body.classList.contains('custom-cart-drawer-open');

    body.classList.toggle('mobile-scroll-search-active', shouldShow);
    floatingSearch.classList.toggle('is-active', shouldShow);

    const searchHeight = shouldShow ? (floatingSearch.getBoundingClientRect().height || 59) : 0;
    document.documentElement.style.setProperty(
      '--mobile-scroll-search-height',
      `${Math.round(searchHeight)}px`
    );
  };

  const onScroll = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      setFloatingState();
    });
  };

  setFloatingState();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setFloatingState);
})();

// (function () {
//   const body = document.body;

//   if (!body || body.classList.contains('template-product')) return;

//   const mobileQuery = window.matchMedia('(max-width: 767px)');
//   const sourceSearch = document.querySelector('[data-site-header] .live-search');

//   if (!sourceSearch) return;

//   const floatingSearch = document.createElement('div');

//   floatingSearch.className = 'mobile-scroll-search';
//   floatingSearch.setAttribute('aria-hidden', 'true');

//   floatingSearch.innerHTML = sourceSearch.outerHTML;

//   body.appendChild(floatingSearch);
  
//   let rafId = null;

//   const stickyTriggerOffset = 270;

//   const setFloatingState = () => {
//     if (!mobileQuery.matches) {
//       body.classList.remove('mobile-scroll-search-active');
//       floatingSearch.classList.remove('is-active');
//       return;
//     }

//     const shouldShow =
//       window.scrollY > stickyTriggerOffset &&
//       !body.classList.contains('custom-cart-drawer-open');

//     body.classList.toggle(
//       'mobile-scroll-search-active',
//       shouldShow
//     );

//     floatingSearch.classList.toggle(
//       'is-active',
//       shouldShow
//     );
//   };

//   const onScroll = () => {
//     if (rafId) return;

//     rafId = requestAnimationFrame(() => {
//       rafId = null;
//       setFloatingState();
//     });
//   };

//   setFloatingState();

//   window.addEventListener('scroll', onScroll, {
//     passive: true
//   });

//   window.addEventListener('resize', setFloatingState);
// })();

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

(function () {
  const closeDropdown = dropdown => {
    if (!dropdown) return;
    const toggle = dropdown.querySelector('[data-sortby-toggle]');
    const menu = dropdown.querySelector('[data-sortby-menu]');
    dropdown.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (menu) menu.hidden = true;
  };

  const closeAllDropdowns = except => {
    document.querySelectorAll('[data-sortby-dropdown].is-open').forEach(dropdown => {
      if (dropdown !== except) closeDropdown(dropdown);
    });
  };

  document.addEventListener('click', event => {
    const toggle = event.target.closest('[data-sortby-toggle]');
    const option = event.target.closest('[data-sort-value]');
    const dropdown = event.target.closest('[data-sortby-dropdown]');

    if (toggle) {
      event.preventDefault();
      const parent = toggle.closest('[data-sortby-dropdown]');
      const isOpen = parent.classList.contains('is-open');
      closeAllDropdowns();
      if (!isOpen) {
        const menu = parent.querySelector('[data-sortby-menu]');
        parent.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        if (menu) menu.hidden = false;
      }
      return;
    }

    if (option) {
      event.preventDefault();
      const parent = option.closest('[data-sortby-dropdown]');
      const select = document.getElementById('product_grid_sort');
      const value = option.getAttribute('data-sort-value');
      const label = option.textContent.trim();

      if (parent) {
        parent.querySelectorAll('[data-sort-value]').forEach(item => {
          item.classList.toggle('is-selected', item === option);
          item.setAttribute('aria-selected', item === option ? 'true' : 'false');
        });
        const valueEl = parent.querySelector('[data-sortby-value]');
        if (valueEl) valueEl.textContent = label;
        closeDropdown(parent);
      }

      if (select && value && select.value !== value) {
        select.value = value;
        if (window.jQuery) {
          window.jQuery(select).trigger('change');
        } else {
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      return;
    }

    if (!dropdown) closeAllDropdowns();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAllDropdowns();
  });
})();

/* ==========================================================================
   Collection filters
   - "Show all" overflow toggle + per-filter value search
   - Price range: linked number inputs, dual handle slider, interval shortcuts
   The mobile drawer copies the sidebar markup, so every handler here is
   delegated from the document and all state lives in the DOM.
   ========================================================================== */
(function () {
  const VISIBLE_LIMIT = 6;
  const WRAPPER = '[data-filter-values-count]';
  const PRICE_FORM = '[data-price-filter]';

  /* The accordion animates to a fixed --menu-open-height, so any change to the
     content height has to be measured back in or the group clips its content. */
  function refreshAccordionHeight(el) {
    const content = el.closest('[data-accordion-content]');
    if (!content) return;
    const previous = content.style.height;
    content.style.height = 'auto';
    const height = content.scrollHeight;
    content.style.height = previous;
    /* A collapsed group measures 0; writing that would wedge it shut. */
    if (height > 0) content.style.setProperty('--menu-open-height', height + 'px');
  }

  /* ---------------------------------------------------------------- values */

  function updateValueList(wrapper) {
    const list = wrapper.querySelector('[data-filter-list]');
    if (!list) return;

    const searchInput = wrapper.querySelector('[data-filter-search]');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const expanded = wrapper.hasAttribute('data-filter-expanded');
    const items = list.querySelectorAll('[data-filter-value-item]');
    let shown = 0;

    items.forEach(function (item, index) {
      const haystack = item.getAttribute('data-filter-search-text') || '';
      const active = item.getAttribute('data-filter-open') === 'true';
      const visible = query
        ? haystack.indexOf(query) !== -1
        : expanded || active || index < VISIBLE_LIMIT;

      if (visible) {
        item.removeAttribute('data-filter-hidden');
        shown += 1;
      } else {
        item.setAttribute('data-filter-hidden', '');
      }
    });

    if (query) {
      wrapper.setAttribute('data-filter-searching', '');
    } else {
      wrapper.removeAttribute('data-filter-searching');
    }

    const empty = wrapper.querySelector('[data-filter-empty]');
    if (empty) empty.hidden = shown !== 0;

    const toggle = wrapper.querySelector('[data-filter-show-all]');
    if (toggle) {
      toggle.hidden = Boolean(query);
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      const label = toggle.querySelector('[data-filter-show-all-text]');
      if (label) {
        const next = expanded ? label.dataset.labelLess : label.dataset.labelMore;
        if (next) label.textContent = next;
      }
    }

    refreshAccordionHeight(wrapper);
  }

  /* A value the shopper is already filtering by must stay visible even when it
     sits past the cut-off, so it never hides behind the "Show all" toggle. */
  function revealActiveValues(root) {
    (root || document)
      .querySelectorAll('[data-filter-value-item][data-filter-overflow][data-filter-open="true"]')
      .forEach(function (item) {
        item.removeAttribute('data-filter-overflow');
      });
  }

  /* Remember both toggle labels up front - the markup only ships "Show all". */
  function primeToggleLabels(root) {
    (root || document).querySelectorAll('[data-filter-show-all-text]').forEach(function (label) {
      if (label.dataset.labelMore) return;
      label.dataset.labelMore = label.textContent.trim();
      label.dataset.labelLess = label.getAttribute('data-label-less') || 'Show less';
    });
  }

  /* ----------------------------------------------------------------- price */

  function toNumber(value, fallback) {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function priceParts(form) {
    return {
      ceiling: toNumber(form.dataset.priceCeiling, 0),
      minInput: form.querySelector('[data-price-input="min"]'),
      maxInput: form.querySelector('[data-price-input="max"]'),
      minSlider: form.querySelector('[data-price-slider-input="min"]'),
      maxSlider: form.querySelector('[data-price-slider-input="max"]'),
      fill: form.querySelector('[data-price-slider-fill]')
    };
  }

  function paintSlider(form) {
    const parts = priceParts(form);
    if (!parts.fill || !parts.minSlider || !parts.maxSlider || parts.ceiling <= 0) return;
    const min = toNumber(parts.minSlider.value, 0);
    const max = toNumber(parts.maxSlider.value, parts.ceiling);
    const left = Math.max(0, Math.min(100, (min / parts.ceiling) * 100));
    const right = Math.max(0, Math.min(100, (max / parts.ceiling) * 100));
    parts.fill.style.left = left + '%';
    parts.fill.style.width = Math.max(0, right - left) + '%';
  }

  /* Keep the two handles from crossing over each other. */
  function syncFromSlider(form, moved) {
    const parts = priceParts(form);
    if (!parts.minSlider || !parts.maxSlider) return;
    let min = toNumber(parts.minSlider.value, 0);
    let max = toNumber(parts.maxSlider.value, parts.ceiling);

    if (min > max) {
      if (moved === 'min') {
        min = max;
        parts.minSlider.value = String(min);
      } else {
        max = min;
        parts.maxSlider.value = String(max);
      }
    }

    if (parts.minInput) parts.minInput.value = min > 0 ? String(min) : '';
    if (parts.maxInput) parts.maxInput.value = max < parts.ceiling ? String(max) : '';
    paintSlider(form);
  }

  function syncFromInput(form) {
    const parts = priceParts(form);
    if (!parts.minSlider || !parts.maxSlider) return;
    const rawMin = parts.minInput ? parts.minInput.value : '';
    const rawMax = parts.maxInput ? parts.maxInput.value : '';
    const min = Math.max(0, Math.min(parts.ceiling, toNumber(rawMin, 0)));
    const max = Math.max(0, Math.min(parts.ceiling, toNumber(rawMax, parts.ceiling)));
    parts.minSlider.value = String(Math.min(min, max));
    parts.maxSlider.value = String(Math.max(min, max));
    paintSlider(form);
  }

  function baseParams(form) {
    const params = new URLSearchParams(window.location.search);
    params.delete(form.dataset.priceMinName);
    params.delete(form.dataset.priceMaxName);
    params.delete('page');
    params.delete('view');
    return params;
  }

  function applyPrice(form) {
    const parts = priceParts(form);
    const params = baseParams(form);
    const rawMin = parts.minInput ? parts.minInput.value.trim() : '';
    const rawMax = parts.maxInput ? parts.maxInput.value.trim() : '';

    const min = Math.max(0, Math.min(parts.ceiling, toNumber(rawMin, 0)));
    const max = Math.max(0, Math.min(parts.ceiling, toNumber(rawMax, parts.ceiling)));
    const low = Math.min(min, max);
    const high = Math.max(min, max);

    if (rawMin !== '' && low > 0) params.set(form.dataset.priceMinName, String(low));
    if (rawMax !== '' && high < parts.ceiling) params.set(form.dataset.priceMaxName, String(high));

    const query = params.toString();
    window.location.search = query ? '?' + query : '';
  }

  function intervalKey(item) {
    return item.dataset.intervalMin + '-' + (item.dataset.intervalMax || '');
  }

  /* Liquid works out what each interval link should select - the selection
     with this interval added, or shrunk back if it is already part of it - and
     ships it as data-target-min / data-target-max (an empty min clears the
     price filter, an empty max means open ended). All that is left here is to
     rebuild the URL so sort_by and anything else on the query string survives.
     Shopify only accepts one gte/lte pair, so a multi-interval pick travels as
     the hull of the chosen intervals. */
  function upgradeIntervalLinks(form) {
    form.querySelectorAll('[data-price-interval]').forEach(function (item) {
      const link = item.querySelector('a');
      if (!link) return;

      const params = baseParams(form);
      const targetMin = item.dataset.targetMin;
      const targetMax = item.dataset.targetMax;

      if (targetMin !== undefined && targetMin !== '') {
        params.set(form.dataset.priceMinName, targetMin);
        if (targetMax) params.set(form.dataset.priceMaxName, targetMax);
      }

      const query = params.toString();
      const url = window.location.pathname + (query ? '?' + query : '');
      link.setAttribute('href', url);
      link.setAttribute('data-url', encodeURIComponent(url));
    });
  }

  function intervalCountUrl(form, item) {
    const params = baseParams(form);
    params.set('view', 'count');
    params.set(form.dataset.priceMinName, item.dataset.intervalMin);
    if (item.dataset.intervalMax) {
      params.set(form.dataset.priceMaxName, item.dataset.intervalMax);
    }
    return window.location.pathname + '?' + params.toString();
  }

  function cacheKey(form) {
    return 'kt-price-counts:' + window.location.pathname + '?' + baseParams(form).toString();
  }

  function readCache(form) {
    try {
      const raw = window.sessionStorage.getItem(cacheKey(form));
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeCache(form, counts) {
    try {
      window.sessionStorage.setItem(cacheKey(form), JSON.stringify(counts));
    } catch (error) {
      /* Private mode or a full quota - counts just will not be cached. */
    }
  }

  function renderCounts(form, counts) {
    const list = form.querySelector('[data-price-intervals]');
    if (!list) return;

    form.querySelectorAll('[data-price-interval]').forEach(function (item) {
      const count = counts[intervalKey(item)];
      if (typeof count !== 'number') return;

      /* An interval nothing falls into is dropped, unless it is the one the
         shopper is currently filtering by. */
      if (count === 0 && !item.querySelector('[data-filter-active]')) {
        item.remove();
        return;
      }

      const target = item.querySelector('[data-price-interval-count]');
      if (target) target.textContent = '(' + count + ')';
    });

    list.removeAttribute('data-price-intervals-loading');
    refreshAccordionHeight(list);
  }

  function loadIntervalCounts(form) {
    const list = form.querySelector('[data-price-intervals]');
    if (!list) return;

    const items = Array.prototype.slice.call(form.querySelectorAll('[data-price-interval]'));
    if (!items.length) return;

    const cached = readCache(form);
    if (cached) {
      renderCounts(form, cached);
      return;
    }

    list.setAttribute('data-price-intervals-loading', '');

    Promise.all(
      items.map(function (item) {
        const key = intervalKey(item);
        return fetch(intervalCountUrl(form, item), {
          credentials: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
          .then(function (response) {
            return response.ok ? response.text() : null;
          })
          .then(function (text) {
            const count = text === null ? NaN : parseInt(text.trim(), 10);
            return { key: key, count: Number.isFinite(count) ? count : null };
          })
          .catch(function () {
            return { key: key, count: null };
          });
      })
    ).then(function (results) {
      const counts = {};
      results.forEach(function (result) {
        if (typeof result.count === 'number') counts[result.key] = result.count;
      });
      if (Object.keys(counts).length) writeCache(form, counts);
      renderCounts(form, counts);
    });
  }

  /* ------------------------------------------------------------ delegation */

  document.addEventListener('input', function (event) {
    if (!event.target || !event.target.closest) return;

    const search = event.target.closest('[data-filter-search]');
    if (search) {
      const wrapper = search.closest(WRAPPER);
      if (wrapper) updateValueList(wrapper);
      return;
    }

    const slider = event.target.closest('[data-price-slider-input]');
    if (slider) {
      const form = slider.closest(PRICE_FORM);
      if (form) syncFromSlider(form, slider.getAttribute('data-price-slider-input'));
      return;
    }

    const priceInput = event.target.closest('[data-price-input]');
    if (priceInput) {
      const form = priceInput.closest(PRICE_FORM);
      if (form) syncFromInput(form);
    }
  });

  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;
    const toggle = event.target.closest('[data-filter-show-all]');
    if (!toggle) return;
    event.preventDefault();
    const wrapper = toggle.closest(WRAPPER);
    if (!wrapper) return;
    if (wrapper.hasAttribute('data-filter-expanded')) {
      wrapper.removeAttribute('data-filter-expanded');
    } else {
      wrapper.setAttribute('data-filter-expanded', '');
    }
    updateValueList(wrapper);
  });

  document.addEventListener('submit', function (event) {
    if (!event.target || !event.target.closest) return;
    const form = event.target.closest(PRICE_FORM);
    if (!form) return;
    event.preventDefault();
    applyPrice(form);
  });

  function init() {
    primeToggleLabels(document);
    revealActiveValues(document);
    document.querySelectorAll(WRAPPER).forEach(updateValueList);
    document.querySelectorAll(PRICE_FORM).forEach(function (form) {
      paintSlider(form);
      upgradeIntervalLinks(form);
      loadIntervalCounts(form);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
