(function () {
  const DESKTOP_MIN_WIDTH = 768;
  const CONTINUED_CLASS = 'collection--description-continued-above';
  const TWO_COLUMNS_CLASS = 'collection--description--two-columns';
  const COLUMNS_WRAP_CLASS = 'collection--description-columns';
  const PROMO_WRAP_CLASS = 'collection--description-promo-cards';
  const BODY_WRAP_CLASS = 'collection--description-body';
  const LEAD_CLASS = 'collection--description-lead-heading';
  const SINGLE_COLUMN_ATTR = 'data-collection-description-single-column';
  const PROMO_CARD_COUNT = 3;
  const SELECTOR = '.template-collection .collection--description.rte[data-collection-description]';
  const VIEWPORT_BUFFER = 32;
  const HEADING_RE = /^H[1-6]$/;

  function getHeaderOffset() {
    const header = document.querySelector('[data-site-header]');
    return header ? header.offsetHeight : 0;
  }

  function getRootContainer(description) {
    const legacyInner = description.querySelector('.cols > :only-child');
    return legacyInner || description;
  }

  function isFlowChild(el) {
    return (
      el.nodeType === 1 &&
      !el.classList.contains(CONTINUED_CLASS) &&
      !el.classList.contains(COLUMNS_WRAP_CLASS) &&
      !el.classList.contains(PROMO_WRAP_CLASS) &&
      !el.classList.contains(BODY_WRAP_CLASS)
    );
  }

  function isSingleColumnCollection(description) {
    return description.hasAttribute(SINGLE_COLUMN_ATTR);
  }

  function unwrapSingleColumnGroups(root) {
    [PROMO_WRAP_CLASS, BODY_WRAP_CLASS].forEach((className) => {
      root.querySelectorAll(':scope > .' + className).forEach((wrap) => {
        while (wrap.firstChild) {
          root.insertBefore(wrap.firstChild, wrap);
        }
        wrap.remove();
      });
    });
  }

  function getContentChildren(root, leadCount) {
    const children = getFlowChildren(root).slice(leadCount);
    if (!children.length) return { blocks: [], wrapper: null };

    if (
      children.length === 1 &&
      children[0].tagName === 'DIV' &&
      children[0].children.length > 1
    ) {
      return {
        blocks: Array.from(children[0].children),
        wrapper: children[0],
      };
    }

    return { blocks: children, wrapper: null };
  }

  function ensureSingleColumnLayout(root) {
    unwrapColumns(root);
    unwrapSingleColumnGroups(root);
    clearLeadHeadings(root);

    const children = getFlowChildren(root);
    const leadCount =
      children.length && HEADING_RE.test(children[0].tagName) ? 1 : 0;

    if (leadCount) {
      children[0].classList.add(LEAD_CLASS);
    }

    const { blocks: contentChildren, wrapper } = getContentChildren(
      root,
      leadCount
    );
    if (!contentChildren.length) return;

    const promoChildren = contentChildren.slice(0, PROMO_CARD_COUNT);
    const bodyChildren = contentChildren.slice(PROMO_CARD_COUNT);
    const insertBefore = wrapper || promoChildren[0];

    const promoWrap = document.createElement('div');
    promoWrap.className = PROMO_WRAP_CLASS;
    insertBefore.before(promoWrap);
    promoChildren.forEach((el) => promoWrap.appendChild(el));

    if (bodyChildren.length) {
      const bodyWrap = document.createElement('div');
      bodyWrap.className = BODY_WRAP_CLASS;
      promoWrap.after(bodyWrap);
      bodyChildren.forEach((el) => bodyWrap.appendChild(el));
    }

    if (wrapper && !wrapper.children.length) {
      wrapper.remove();
    }
  }

  function getFlowChildren(container) {
    return Array.from(container.children).filter(isFlowChild);
  }

  function getAvailableHeight(description) {
    const rect = description.getBoundingClientRect();
    const viewportTop = Math.max(rect.top, getHeaderOffset());
    return window.innerHeight - viewportTop - VIEWPORT_BUFFER;
  }

  function scrollToDescriptionTop(description) {
    const top =
      description.getBoundingClientRect().top +
      window.pageYOffset -
      getHeaderOffset() -
      16;

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    description.setAttribute('tabindex', '-1');
    description.focus({ preventScroll: true });
  }

  function removeContinuedLink(description) {
    description.querySelectorAll('.' + CONTINUED_CLASS).forEach((el) => el.remove());
  }

  function unwrapColumns(root) {
    const wrap = root.querySelector(':scope > .' + COLUMNS_WRAP_CLASS);
    if (!wrap) return;

    while (wrap.firstChild) {
      root.insertBefore(wrap.firstChild, wrap);
    }

    wrap.remove();
  }

  function clearLeadHeadings(root) {
    root.querySelectorAll('.' + LEAD_CLASS).forEach((el) => {
      el.classList.remove(LEAD_CLASS);
    });
  }

  function ensureColumnWrap(root) {
    unwrapColumns(root);
    clearLeadHeadings(root);

    const children = getFlowChildren(root);
    // Only the very first child heading spans full width.
    const leadCount =
      children.length && HEADING_RE.test(children[0].tagName) ? 1 : 0;

    if (leadCount) {
      children[0].classList.add(LEAD_CLASS);
    }

    if (leadCount >= children.length) {
      return null;
    }

    const wrap = document.createElement('div');
    wrap.className = COLUMNS_WRAP_CLASS;

    const toWrap = children.slice(leadCount);
    toWrap[0].before(wrap);
    toWrap.forEach((el) => wrap.appendChild(el));

    return wrap;
  }

  function getColumnContainer(description) {
    const root = getRootContainer(description);
    return root.querySelector(':scope > .' + COLUMNS_WRAP_CLASS) || root;
  }

  function clearColumnHeight(columnContainer) {
    columnContainer.style.height = '';
    columnContainer.style.maxHeight = '';
  }

  function hasMultipleColumns(columnContainer, children) {
    if (!children.length) return false;

    const containerRect = columnContainer.getBoundingClientRect();
    const midX = containerRect.left + containerRect.width / 2;

    let hasLeft = false;
    let hasRight = false;

    children.forEach((el) => {
      Array.from(el.getClientRects()).forEach((rect) => {
        if (!rect.height || !rect.width) return;
        const centerX = rect.left + rect.width / 2;
        if (centerX < midX) hasLeft = true;
        else hasRight = true;
      });
    });

    return hasLeft && hasRight;
  }

  function findColumnOneBottom(columnContainer, children) {
    const containerRect = columnContainer.getBoundingClientRect();
    const columnMidX = containerRect.left + containerRect.width / 2;
    let maxBottom = -1;

    children.forEach((el) => {
      Array.from(el.getClientRects()).forEach((rect) => {
        if (!rect.height || !rect.width) return;

        const centerX = rect.left + rect.width / 2;

        if (centerX < columnMidX) {
          const bottom = rect.bottom - containerRect.top;
          maxBottom = Math.max(maxBottom, bottom);
        }
      });
    });

    return maxBottom;
  }

  function shouldUseTwoColumns(description, columnContainer) {
    const availableHeight = getAvailableHeight(description);
    const contentHeight = columnContainer.scrollHeight;
    return contentHeight > availableHeight;
  }

  function applyTwoColumnHeight(description, columnContainer) {
    const availableHeight = getAvailableHeight(description);
    // Measured while already in 2-col mode with unconstrained height
    // (column-fill:auto keeps content in one column until height is set).
    const contentHeight = columnContainer.scrollHeight;
    let targetHeight = Math.max(
      availableHeight,
      Math.ceil(contentHeight / 2) + 48
    );

    columnContainer.style.height = targetHeight + 'px';

    // Grow until content fits in two columns (no horizontal overflow).
    let guard = 0;
    while (
      guard < 30 &&
      columnContainer.scrollWidth > columnContainer.clientWidth + 2
    ) {
      targetHeight += 64;
      columnContainer.style.height = targetHeight + 'px';
      guard += 1;
    }
  }

  function updateContinuedLink(description) {
    removeContinuedLink(description);

    if (
      window.innerWidth < DESKTOP_MIN_WIDTH ||
      !description.classList.contains(TWO_COLUMNS_CLASS)
    ) {
      return;
    }

    const columnContainer = getColumnContainer(description);
    const children = getFlowChildren(columnContainer);

    if (!hasMultipleColumns(columnContainer, children)) return;

    const columnOneBottom = findColumnOneBottom(columnContainer, children);
    if (columnOneBottom < 0) return;

    const continued = document.createElement('p');
    continued.className = CONTINUED_CLASS;

    const link = document.createElement('a');
    link.href = '#collection-description-top';
    link.textContent = 'Continued above';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToDescriptionTop(description);
    });

    continued.appendChild(link);
    // Position inside the column wrap so it stays at the end of column 1.
    columnContainer.appendChild(continued);

    const linkHeight = continued.offsetHeight || 24;
    const gap = 8;
    const reserved = linkHeight + gap + 4;
    const currentHeight = columnContainer.clientHeight;

    // Reserve space at the bottom of column 1 for the link.
    if (columnOneBottom + reserved > currentHeight) {
      columnContainer.style.height = columnOneBottom + reserved + 'px';
    }

    const top = Math.min(
      columnOneBottom + gap,
      columnContainer.clientHeight - linkHeight - 4
    );
    continued.style.top = Math.max(0, top) + 'px';
  }

  function updateLayout(description) {
    if (description._collectionColumnsUpdating) return;
    description._collectionColumnsUpdating = true;

    try {
      const root = getRootContainer(description);

      if (isSingleColumnCollection(description)) {
        ensureSingleColumnLayout(root);
        description.classList.remove(TWO_COLUMNS_CLASS);
        removeContinuedLink(description);
        return;
      }

      const wrap = ensureColumnWrap(root);
      const columnContainer = wrap || root;

      description.classList.remove(TWO_COLUMNS_CLASS);
      clearColumnHeight(columnContainer);
      removeContinuedLink(description);

      if (window.innerWidth < DESKTOP_MIN_WIDTH) {
        return;
      }

      if (wrap && shouldUseTwoColumns(description, columnContainer)) {
        description.classList.add(TWO_COLUMNS_CLASS);
        applyTwoColumnHeight(description, columnContainer);
      }

      updateContinuedLink(description);
    } finally {
      // Allow ResizeObserver to settle after DOM/height writes.
      requestAnimationFrame(() => {
        description._collectionColumnsUpdating = false;
      });
    }
  }

  function initDescription(description) {
    if (!description.id) {
      description.id = 'collection-description-top';
    }

    let layoutTimer;
    const runLayout = () => {
      clearTimeout(layoutTimer);
      layoutTimer = setTimeout(() => updateLayout(description), 50);
    };

    updateLayout(description);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(runLayout);
      observer.observe(description);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => updateLayout(description), 150);
    });

    window.addEventListener('load', () => updateLayout(description));
  }

  function init() {
    document.querySelectorAll(SELECTOR).forEach(initDescription);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
