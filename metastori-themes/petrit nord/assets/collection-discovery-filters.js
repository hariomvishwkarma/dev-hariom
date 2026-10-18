(function () {
  if (window.__discoveryFiltersInit) return;
  window.__discoveryFiltersInit = true;

  var rootSelector = '[data-discovery-filters]';
  var MOBILE_MAX = 1007;

  function qs(root, selector) {
    return root ? root.querySelector(selector) : null;
  }

  function qsa(root, selector) {
    if (!root) return [];
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  }

  function isMobile() {
    return window.matchMedia('(max-width: ' + MOBILE_MAX + 'px)').matches;
  }

  function getSectionId() {
    var section = document.querySelector('[data-section-type="collection"], [data-section-type="search"]');
    if (section && section.getAttribute('data-section-id')) {
      return section.getAttribute('data-section-id');
    }
    var filters = document.querySelector(rootSelector);
    return (filters && filters.getAttribute('data-section-id')) || 'collection-template';
  }

  function closeDropdowns(except) {
    qsa(document, '[data-discovery-dropdown].is-open').forEach(function (dropdown) {
      if (dropdown === except) return;
      dropdown.classList.remove('is-open');
      var toggle = qs(dropdown, '[data-discovery-toggle]');
      var content = qs(dropdown, '.discovery-filters__content');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (content && !isMobile()) content.hidden = true;
    });
  }

  var lockScrollY = 0;

  function openDrawer(root) {
    if (!root) return;
    if (!document.body.classList.contains('discovery-filters-open')) {
      lockScrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.top = '-' + lockScrollY + 'px';
    }
    root.classList.remove('is-drawer-closing');
    root.classList.add('is-drawer-open');
    document.body.classList.remove('discovery-filters-closing');
    document.body.classList.add('discovery-filters-open');
    var section = root.closest('.shopify-section');
    if (section) section.classList.add('discovery-filters-section-open');
    var trigger = qs(root, '[data-discovery-open]');
    var overlay = qs(root, '.discovery-filters__overlay');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.hidden = false;
  }

  function closeDrawer(root) {
    var targets = root
      ? [root]
      : qsa(document, rootSelector + '.is-drawer-open, ' + rootSelector + '.is-drawer-closing');

    targets.forEach(function (item) {
      if (!item.classList.contains('is-drawer-open') && !item.classList.contains('is-drawer-closing')) {
        return;
      }

      var panel = qs(item, '[data-discovery-panel]');
      var overlay = qs(item, '.discovery-filters__overlay');
      var trigger = qs(item, '[data-discovery-open]');
      var section = item.closest('.shopify-section');

      item.classList.remove('is-drawer-open');
      item.classList.add('is-drawer-closing');
      document.body.classList.add('discovery-filters-closing');
      if (section) section.classList.add('discovery-filters-section-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');

      var finished = false;
        var finishClose = function () {
        if (finished) return;
        finished = true;
        if (panel) panel.removeEventListener('transitionend', onTransitionEnd);

        item.classList.remove('is-drawer-closing');
        if (overlay) overlay.hidden = true;
        if (section) section.classList.remove('discovery-filters-section-open');

        if (!document.querySelector(rootSelector + '.is-drawer-open, ' + rootSelector + '.is-drawer-closing')) {
          document.body.classList.remove('discovery-filters-open');
          document.body.classList.remove('discovery-filters-closing');
          document.body.style.top = '';
          qsa(document, '.discovery-filters-section-open').forEach(function (openSection) {
            openSection.classList.remove('discovery-filters-section-open');
          });
          window.scrollTo(0, lockScrollY || 0);
          // Drawer ke peeche updated grid ab visible — lazy images trigger
          refreshLazyImages(document.querySelector('[data-discovery-results]'));
        }
      };

      var onTransitionEnd = function (event) {
        if (event.target !== panel) return;
        finishClose();
      };

      if (panel) {
        panel.addEventListener('transitionend', onTransitionEnd);
        setTimeout(finishClose, 350);
      } else {
        finishClose();
      }
    });
  }

  function updateStickyOffset() {
    var bar = document.querySelector('.discovery-filters__bar');
    if (!bar) return;
    var leftPos = 0 - bar.getBoundingClientRect().left + (window.pageXOffset || 0);
    document.documentElement.style.setProperty('--collectionToolbar', leftPos + 'px');
  }

  function refreshLazyImages(container) {
    var scope = container || document;
    var images = scope.querySelectorAll('img.Image--lazyLoad, .Image--lazyLoad');

    Array.prototype.forEach.call(images, function (img) {
      // AJAX insert ke baad stale loaded state hatao agar src abhi set nahi
      if (img.classList.contains('Image--lazyLoaded') && !img.getAttribute('src') && !img.currentSrc) {
        img.classList.remove('Image--lazyLoaded', 'Image--lazyLoading');
      }
      if (!img.getAttribute('data-sizes') && (img.getAttribute('data-srcset') || img.getAttribute('data-src'))) {
        img.setAttribute('data-sizes', 'auto');
      }
    });

    if (!window.lazySizes) return;

    var run = function () {
      try {
        if (window.lazySizes.autoSizer && window.lazySizes.autoSizer.checkElems) {
          window.lazySizes.autoSizer.checkElems();
        }
        if (window.lazySizes.loader && window.lazySizes.loader.checkElems) {
          window.lazySizes.loader.checkElems();
        }
      } catch (e) {}
    };

    // DOM paint ke baad scan — pehle frame miss ho sakta hai
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () {
        run();
        setTimeout(run, 50);
      });
    } else {
      run();
      setTimeout(run, 50);
    }
  }

  function buildUrl(form) {
    var action = form.getAttribute('action') || window.location.pathname;
    var data = new FormData(form);
    var params = new URLSearchParams();

    data.forEach(function (value, key) {
      if (value === '' || value == null) return;
      params.append(key, value);
    });

    var query = params.toString();
    return query ? action + '?' + query : action;
  }

  function findCheckbox(root, name, value) {
    var match = null;
    qsa(root, 'input[type="checkbox"]').some(function (input) {
      if (input.name === name && String(input.value) === String(value)) {
        match = input;
        return true;
      }
      return false;
    });
    return match;
  }

  function syncFilterAvailability(currentRoot, nextRoot) {
    if (!currentRoot || !nextRoot) return;
    var form = qs(currentRoot, '.discovery-filters__form');
    if (form) form.dataset.syncing = 'true';

    qsa(nextRoot, 'input[type="checkbox"]').forEach(function (nextInput) {
      var currentInput = findCheckbox(currentRoot, nextInput.name, nextInput.value);
      if (!currentInput) return;

      currentInput.disabled = !!nextInput.disabled;

      var currentItem = currentInput.closest('.discovery-filters__item');
      var nextItem = nextInput.closest('.discovery-filters__item');
      if (currentItem && nextItem) {
        currentItem.classList.toggle('is-disabled', nextItem.classList.contains('is-disabled'));
        currentItem.classList.toggle('is-active', currentInput.checked);
      }
    });

    qsa(currentRoot, '[data-discovery-dropdown]').forEach(syncDropdownState);
    if (form) form.dataset.syncing = 'false';
  }

  function replaceResultsOnly(nextFaceted, currentFaceted) {
    var nextResults = nextFaceted.querySelector('[data-discovery-results]');
    var currentResults = currentFaceted.querySelector('[data-discovery-results]');
    if (!nextResults || !currentResults) return false;
    currentResults.replaceWith(nextResults);
    return true;
  }

  function replaceFaceted(html, options) {
    var keepDrawer = options && options.keepDrawer;
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var next = doc.querySelector('[data-collection-faceted]');
    var current = document.querySelector('[data-collection-faceted]');
    if (!next || !current) return false;

    if (keepDrawer) {
      var currentRoot = current.querySelector(rootSelector);
      var nextRoot = next.querySelector(rootSelector);
      var replaced = replaceResultsOnly(next, current);
      if (!replaced) {
        // fallback: full replace but keep drawer open without flicker class churn
        current.replaceWith(next);
        currentRoot = next.querySelector(rootSelector);
        bindRoot(currentRoot);
        if (currentRoot) openDrawer(currentRoot);
      } else {
        syncFilterAvailability(currentRoot, nextRoot);
        if (currentRoot) {
          var form = qs(currentRoot, '.discovery-filters__form');
          syncActiveChips(currentRoot, form);
        }
      }
      updateStickyOffset();
      cloneCollectionElements();
      refreshLazyImages(current.querySelector('[data-discovery-results]') || current);
      initScrollLoad();
      return true;
    }

    closeDrawer();
    current.replaceWith(next);
    var newRoot = next.querySelector(rootSelector) || document.querySelector(rootSelector);
    bindRoot(newRoot);
    updateStickyOffset();
    cloneCollectionElements();
    refreshLazyImages(next.querySelector('[data-discovery-results]') || next);
    initScrollLoad();
    return true;
  }

  function cloneCollectionElements() {
    var grid = document.querySelector('.product-grid') || document.querySelector('.ProductList');
    if (!grid) return;

    var timerSource = document.querySelector('.collection-elements > .timer--wrapper');
    if (timerSource && !grid.querySelector('.timer--wrapper')) {
      grid.appendChild(timerSource.cloneNode(true));
    }

    var reviewSource = document.querySelector('.collection-elements > .featured_review--wrapper');
    if (reviewSource && !grid.querySelector('.featured_review--wrapper')) {
      grid.appendChild(reviewSource.cloneNode(true));
    }
  }

  var requestToken = 0;
  var fetchController = null;
  var submitTimer = null;
  var scrollObserver = null;
  var scrollLoading = false;
  var scrollController = null;

  function disconnectScrollLoad() {
    if (scrollObserver) {
      scrollObserver.disconnect();
      scrollObserver = null;
    }
  }

  function getScrollTrigger() {
    return document.querySelector('[data-discovery-scroll-load]');
  }

  function fetchPageHtml(url) {
    var requestUrl = new URL(url, window.location.origin);

    if (scrollController) {
      try { scrollController.abort(); } catch (e) {}
    }
    scrollController = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var signal = scrollController ? scrollController.signal : undefined;

    if (requestUrl.pathname.indexOf('/search') !== -1) {
      var sectionId = getSectionId();
      requestUrl.searchParams.set('sections', sectionId);

      return fetch(requestUrl.toString(), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal: signal
      }).then(function (response) {
        if (!response.ok) throw new Error('section-render');
        var contentType = response.headers.get('content-type') || '';
        if (contentType.indexOf('application/json') === -1) throw new Error('section-render');
        return response.json();
      }).then(function (data) {
        if (!data || !data[sectionId]) throw new Error('section-render');
        return data[sectionId];
      });
    }

    requestUrl.searchParams.set('view', 'ajax');
    return fetch(requestUrl.toString(), {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      signal: signal
    }).then(function (response) {
      if (!response.ok) throw new Error('ajax-render');
      return response.text();
    });
  }

  function appendPageProducts(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var nextResults = doc.querySelector('[data-discovery-results]');
    var currentResults = document.querySelector('[data-discovery-results]');
    if (!nextResults || !currentResults) return;

    var nextGrid = nextResults.querySelector('.product-grid, .ProductList');
    var currentGrid = currentResults.querySelector('.product-grid, .ProductList');
    if (!nextGrid || !currentGrid) return;

    var existing = {};
    Array.prototype.forEach.call(currentGrid.querySelectorAll('[data-product]'), function (el) {
      var key = el.getAttribute('data-product');
      if (key) existing[key] = true;
    });

    Array.prototype.forEach.call(nextGrid.children, function (child) {
      if (
        child.classList.contains('timer--wrapper') ||
        child.classList.contains('featured_review--wrapper')
      ) {
        return;
      }

      var productEl = child.classList.contains('product-item')
        ? child
        : child.querySelector('.product-item[data-product], [data-product]');
      var key = productEl && productEl.getAttribute('data-product');
      if (key && existing[key]) return;
      if (key) existing[key] = true;

      currentGrid.appendChild(document.importNode(child, true));
    });

    var nextTrigger = nextResults.querySelector('[data-discovery-scroll-load]');
    var currentTrigger = getScrollTrigger();
    var nextUrl = nextTrigger && nextTrigger.getAttribute('data-next-url');

    if (nextUrl && currentTrigger) {
      currentTrigger.setAttribute('data-next-url', nextUrl);
      currentTrigger.classList.remove('is-loading');
      var spinner = qs(currentTrigger, '.discovery-scroll-sentinel__spinner');
      if (spinner) spinner.hidden = true;
    } else if (currentTrigger) {
      currentTrigger.remove();
    }

    refreshLazyImages(currentGrid);
    cloneCollectionElements();
  }

  function loadNextPage() {
    if (scrollLoading) return;
    var trigger = getScrollTrigger();
    if (!trigger) return;
    var nextUrl = trigger.getAttribute('data-next-url');
    if (!nextUrl) return;

    scrollLoading = true;
    trigger.classList.add('is-loading');
    var spinner = qs(trigger, '.discovery-scroll-sentinel__spinner');
    if (spinner) spinner.hidden = false;

    fetchPageHtml(nextUrl)
      .then(function (html) {
        appendPageProducts(html);
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') return;
        trigger.classList.remove('is-loading');
        if (spinner) spinner.hidden = true;
      })
      .finally(function () {
        scrollLoading = false;
        initScrollLoad();
      });
  }

  function initScrollLoad() {
    disconnectScrollLoad();
    var trigger = getScrollTrigger();
    if (!trigger || !trigger.getAttribute('data-next-url')) return;

    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: classic pagination would need a click — keep sentinel visible without auto-load
      return;
    }

    scrollObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          loadNextPage();
        });
      },
      { root: null, rootMargin: '600px 0px', threshold: 0 }
    );
    scrollObserver.observe(trigger);
  }

  function fetchFilteredHtml(url) {
    var requestUrl = new URL(url, window.location.origin);
    requestUrl.searchParams.delete('page');

    if (scrollController) {
      try { scrollController.abort(); } catch (e) {}
      scrollController = null;
    }
    scrollLoading = false;
    disconnectScrollLoad();

    if (fetchController) {
      try { fetchController.abort(); } catch (e) {}
    }
    fetchController = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var signal = fetchController ? fetchController.signal : undefined;

    // One request only:
    // - search → section render
    // - collection → ?view=ajax
    // (no sections+ajax chain — that was causing double requests)
    if (requestUrl.pathname.indexOf('/search') !== -1) {
      var sectionId = getSectionId();
      requestUrl.searchParams.set('sections', sectionId);

      return fetch(requestUrl.toString(), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal: signal
      }).then(function (response) {
        if (!response.ok) throw new Error('section-render');
        var contentType = response.headers.get('content-type') || '';
        if (contentType.indexOf('application/json') === -1) throw new Error('section-render');
        return response.json();
      }).then(function (data) {
        if (!data || !data[sectionId]) throw new Error('section-render');
        return data[sectionId];
      });
    }

    requestUrl.searchParams.set('view', 'ajax');
    return fetch(requestUrl.toString(), {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      signal: signal
    }).then(function (response) {
      if (!response.ok) throw new Error('ajax-render');
      return response.text();
    });
  }

  function submitFilters(form, pushState, options) {
    var keepDrawer = options && options.keepDrawer;
    var url = buildUrl(form);

    if (submitTimer) {
      clearTimeout(submitTimer);
      submitTimer = null;
    }

    submitTimer = setTimeout(function () {
      submitTimer = null;

      var faceted = document.querySelector('[data-collection-faceted]');
      if (faceted) {
        faceted.classList.add('is-loading');
        if (keepDrawer) faceted.classList.add('is-loading--drawer-open');
      }

      var token = ++requestToken;
      var root = form.closest(rootSelector) || document.querySelector(rootSelector);
      var drawerBody = root ? qs(root, '.discovery-filters__body') : null;
      var savedScroll = drawerBody ? drawerBody.scrollTop : 0;

      fetchFilteredHtml(url)
        .then(function (html) {
          if (token !== requestToken) return;
          if (replaceFaceted(html, { keepDrawer: keepDrawer }) && pushState !== false) {
            history.pushState({ discoveryFilters: true }, '', url);
          }
          if (keepDrawer) {
            var liveBody = document.querySelector('.discovery-filters.is-drawer-open .discovery-filters__body');
            if (liveBody) liveBody.scrollTop = savedScroll;
          }
        })
        .catch(function (err) {
          if (err && err.name === 'AbortError') return;
          window.location.href = url;
        })
        .finally(function () {
          if (token !== requestToken) return;
          var next = document.querySelector('[data-collection-faceted]');
          if (next) {
            next.classList.remove('is-loading');
            next.classList.remove('is-loading--drawer-open');
          }
        });
    }, 50);
  }

  function syncDropdownState(dropdown) {
    var checked = qsa(dropdown, 'input[type="checkbox"]:checked').length;
    var priceFilled = qsa(dropdown, '.discovery-filters__price-input').some(function (input) {
      return input.value !== '';
    });
    var count = checked + (priceFilled ? 1 : 0);
    var titleCount = qs(dropdown, '[data-discovery-title-count]');
    var selectedCount = qs(dropdown, '[data-discovery-selected-count]');

    dropdown.classList.toggle('is-selected', count > 0);
    if (titleCount) {
      titleCount.textContent = count;
      titleCount.hidden = count === 0;
    }
    if (selectedCount) selectedCount.textContent = count;
    qsa(dropdown, '[data-discovery-reset-filter]').forEach(function (resetFilter) {
      resetFilter.hidden = count === 0;
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildChipHtml(label, param, value, type) {
    var attrs = ' type="button" class="discovery-filters__chip" data-discovery-remove-chip data-filter-param="' + escapeHtml(param) + '"';
    if (type) attrs += ' data-filter-type="' + escapeHtml(type) + '"';
    if (value != null && value !== '') attrs += ' data-filter-value="' + escapeHtml(value) + '"';
    return '<button' + attrs + '><span>' + escapeHtml(label) + '</span><span class="discovery-filters__chip-x" aria-hidden="true">&times;</span></button>';
  }

  function syncActiveChips(root, form) {
    if (!root || !form) return;
    var html = '';
    var total = 0;

    qsa(form, '[data-discovery-dropdown]').forEach(function (dropdown) {
      var filterType = dropdown.getAttribute('data-filter-type') || '';
      var param = dropdown.getAttribute('data-filter-param') || '';

      if (filterType === 'price') {
        var minInput = qs(dropdown, 'input[name$=".min"], .discovery-filters__price-input[name*="min"]');
        var maxInput = qs(dropdown, 'input[name$=".max"], .discovery-filters__price-input[name*="max"]');
        var inputs = qsa(dropdown, '.discovery-filters__price-input');
        if (!minInput && inputs[0]) minInput = inputs[0];
        if (!maxInput && inputs[1]) maxInput = inputs[1];
        var minVal = minInput && minInput.value !== '' ? minInput.value : '';
        var maxVal = maxInput && maxInput.value !== '' ? maxInput.value : '';
        if (minVal !== '' || maxVal !== '') {
          var label = minVal && maxVal ? minVal + ' – ' + maxVal : minVal ? '≥ ' + minVal : '≤ ' + maxVal;
          html += buildChipHtml(label, param || (minInput && minInput.name) || 'filter.v.price', '', 'price');
          total += 1;
        }
        return;
      }

      qsa(dropdown, 'input[type="checkbox"]:checked').forEach(function (input) {
        var labelEl = input.id ? form.querySelector('label[for="' + input.id + '"]') : null;
        var label = '';
        if (labelEl) {
          var sizeLabel = labelEl.classList.contains('discovery-filters__size') ? labelEl : null;
          var textLabel = labelEl.classList.contains('discovery-filters__text') ? labelEl : null;
          var swatchName = qs(labelEl, '.discovery-filters__swatch-name');
          label = (sizeLabel && sizeLabel.textContent) || (textLabel && textLabel.textContent) || (swatchName && swatchName.textContent) || input.value;
        } else {
          label = input.value;
        }
        html += buildChipHtml(String(label).trim(), input.name, input.value);
        total += 1;
      });
    });

    qsa(root, '[data-discovery-chips]').forEach(function (wrap) {
      wrap.innerHTML = html;
    });

    var summary = qs(root, '[data-discovery-summary]');
    var drawerChips = qs(root, '[data-discovery-drawer-chips]');
    if (summary) summary.hidden = total === 0;
    if (drawerChips) drawerChips.hidden = total === 0;

    var mobileCount = qs(root, '[data-discovery-mobile-count]');
    if (mobileCount) {
      mobileCount.textContent = total;
      mobileCount.hidden = total === 0;
    }
  }

  function removeChip(form, chip) {
    var param = chip.getAttribute('data-filter-param');
    var value = chip.getAttribute('data-filter-value');
    var type = chip.getAttribute('data-filter-type');

    if (type === 'price') {
      var dropdown = qs(form, '[data-discovery-dropdown][data-filter-type="price"]');
      if (dropdown) {
        qsa(dropdown, '.discovery-filters__price-input').forEach(function (input) {
          input.value = '';
        });
        syncDropdownState(dropdown);
      }
      return;
    }

    qsa(form, 'input[type="checkbox"]').forEach(function (input) {
      if (input.name === param && String(input.value) === String(value)) {
        input.checked = false;
        var dropdown = input.closest('[data-discovery-dropdown]');
        if (dropdown) syncDropdownState(dropdown);
      }
    });
  }

  function clearFormFilters(form) {
    qsa(form, 'input[type="checkbox"]').forEach(function (input) {
      input.checked = false;
    });
    qsa(form, '.discovery-filters__price-input').forEach(function (input) {
      input.value = '';
    });
    qsa(form, '[data-discovery-dropdown]').forEach(syncDropdownState);
  }

  function bindResetButtons(root, form) {
    qsa(root, '[data-discovery-reset]').forEach(function (reset) {
      if (reset.dataset.resetBound === 'true') return;
      reset.dataset.resetBound = 'true';
      reset.addEventListener('click', function (event) {
        event.preventDefault();
        clearFormFilters(form);
        syncActiveChips(root, form);
        closeDrawer(root);
        var dummy = document.createElement('form');
        dummy.setAttribute('action', reset.getAttribute('href') || window.location.pathname);
        var sort = qs(form, 'input[name="sort_by"]');
        if (sort) dummy.appendChild(sort.cloneNode(true));
        var q = qs(form, 'input[name="q"]');
        if (q) dummy.appendChild(q.cloneNode(true));
        var type = qs(form, 'input[name="type"]');
        if (type) dummy.appendChild(type.cloneNode(true));
        submitFilters(dummy, true, { keepDrawer: false });
      });
    });
  }

  function bindRoot(root) {
    if (!root) return;

    var form = qs(root, '.discovery-filters__form');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';

    root.addEventListener('click', function (event) {
      var openBtn = event.target.closest('[data-discovery-open]');
      if (openBtn && root.contains(openBtn)) {
        event.preventDefault();
        openDrawer(root);
        return;
      }

      var closeBtn = event.target.closest('[data-discovery-close]');
      if (closeBtn && root.contains(closeBtn)) {
        event.preventDefault();
        closeDrawer(root);
      }
    });

    form.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-discovery-remove-chip]');
      if (chip) {
        event.preventDefault();
        removeChip(form, chip);
        syncActiveChips(root, form);
        var drawerOpen = root.classList.contains('is-drawer-open');
        submitFilters(form, true, { keepDrawer: isMobile() && drawerOpen });
        return;
      }

      var resetFilter = event.target.closest('[data-discovery-reset-filter]');
      if (resetFilter) {
        event.preventDefault();
        var resetDropdown = resetFilter.closest('[data-discovery-dropdown]');
        if (!resetDropdown) return;
        qsa(resetDropdown, 'input[type="checkbox"]').forEach(function (input) {
          input.checked = false;
        });
        qsa(resetDropdown, '.discovery-filters__price-input').forEach(function (input) {
          input.value = '';
        });
        syncDropdownState(resetDropdown);
        syncActiveChips(root, form);
        var drawerOpenReset = root.classList.contains('is-drawer-open');
        submitFilters(form, true, { keepDrawer: isMobile() && drawerOpenReset });
        return;
      }

      var toggle = event.target.closest('[data-discovery-toggle]');
      if (toggle) {
        if (isMobile()) return;
        event.preventDefault();
        var dropdown = toggle.closest('[data-discovery-dropdown]');
        if (!dropdown) return;
        var content = qs(dropdown, '.discovery-filters__content');
        var willOpen = !dropdown.classList.contains('is-open');
        closeDropdowns(dropdown);
        dropdown.classList.toggle('is-open', willOpen);
        toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        if (content) content.hidden = !willOpen;
      }
    });

    form.addEventListener('change', function (event) {
      if (!event.target.matches('input')) return;
      // Ignore programmatic updates during availability sync
      if (form.dataset.syncing === 'true') return;

      var dropdown = event.target.closest('[data-discovery-dropdown]');
      var drawerBody = qs(root, '.discovery-filters__body');
      var savedScroll = drawerBody ? drawerBody.scrollTop : 0;

      if (dropdown) syncDropdownState(dropdown);
      syncActiveChips(root, form);

      if (drawerBody) drawerBody.scrollTop = savedScroll;

      var drawerOpen = root.classList.contains('is-drawer-open');
      submitFilters(form, true, { keepDrawer: isMobile() && drawerOpen });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      closeDrawer(root);
      submitFilters(form, true, { keepDrawer: false });
    });

    bindResetButtons(root, form);
    syncActiveChips(root, form);
  }

  function initFilters() {
    qsa(document, rootSelector).forEach(bindRoot);
    updateStickyOffset();
    cloneCollectionElements();
    initScrollLoad();
  }

  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;
    if (event.target.closest('[data-discovery-filters]')) return;
    closeDropdowns();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    closeDropdowns();
    closeDrawer();
  });

  window.addEventListener('resize', function () {
    updateStickyOffset();
    if (!isMobile()) closeDrawer();
  });

  window.addEventListener('popstate', function () {
    var faceted = document.querySelector('[data-collection-faceted]');
    if (!faceted) return;
    fetchFilteredHtml(window.location.href)
      .then(replaceFaceted)
      .catch(function () {
        window.location.reload();
      });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilters);
  } else {
    initFilters();
  }
})();
