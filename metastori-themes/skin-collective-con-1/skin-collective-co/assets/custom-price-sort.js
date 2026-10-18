/**
 * Sort collection/search by the default/first-variant price shown on cards,
 * across the full filtered product set, then paginate that sorted list.
 */
(() => {
  const PRICE_SORTS = new Set(['price-ascending', 'price-descending']);
  const SHOPIFY_PAGE_MAX = 250;

  const getSortBy = () =>
    document.querySelector('[data-item="disclosure"][name="sort_by"]')?.value ||
    new URLSearchParams(window.location.search).get('sort_by') ||
    document.querySelector('[data-body-wrapper]')?.getAttribute('data-sort-by') ||
    '';

  const isCard = (el) => el?.classList?.contains('product-card--root');
  const isBlank = (el) => el?.matches?.('[data-item="blank"]');
  const wrapperOf = (grid) => grid.closest('[data-body-wrapper]') || grid.parentElement;

  const sortCards = (cards, sortBy) =>
    [...cards].sort((a, b) => {
      const diff = (Number(a.dataset.sortPrice) || 0) - (Number(b.dataset.sortPrice) || 0);
      return sortBy === 'price-descending' ? -diff : diff;
    });

  const transitionItems = (el) => {
    if (!(el instanceof Element)) return [];
    const nested = [...el.querySelectorAll('[data-transition-item]')];
    return el.hasAttribute('data-transition-item') ? [el, ...nested] : nested;
  };

  const revealNodes = (nodes) => {
    nodes.forEach((node) => {
      transitionItems(node).forEach((item) => {
        item.style.setProperty('--transition--delay', '0ms');
        item.setAttribute('data-transition-active', 'true');
        item.setAttribute('data-transition-finished', 'true');
      });
    });
  };

  const showGrid = (grid) => {
    grid.removeAttribute('data-price-sort-pending');
    grid.setAttribute('aria-hidden', 'false');
    grid.setAttribute('aria-busy', 'false');
    const pagination = wrapperOf(grid)?.querySelector('[data-body-pagination]');
    if (pagination) {
      pagination.setAttribute('aria-hidden', 'false');
      pagination.setAttribute('aria-busy', 'false');
    }
  };

  const fillGrid = (grid, nodes) => {
    const columns = Math.max(1, parseInt(grid.getAttribute('data-columns'), 10) || 1);
    const remainder = nodes.length % columns;
    const blankCount = remainder ? columns - remainder : 0;
    const blanks = Array.from({ length: blankCount }, () => {
      const blank = document.createElement('div');
      blank.setAttribute('data-item', 'blank');
      blank.setAttribute('aria-hidden', 'true');
      return blank;
    });

    revealNodes(nodes);
    grid.replaceChildren(...nodes, ...blanks);
    revealNodes(nodes);
    showGrid(grid);
  };

  const renderPage = (grid, state) => {
    const start = (state.page - 1) * state.pageSize;
    const pageCards = state.cards.slice(start, start + state.pageSize);
    fillGrid(grid, state.page === 1 ? [...state.extras, ...pageCards] : pageCards);
  };

  const updatePagination = (grid, state) => {
    const pagination = wrapperOf(grid)?.querySelector('[data-price-sort-pagination]');
    if (!pagination) return;

    const totalPages = Math.max(1, Math.ceil(state.cards.length / state.pageSize));
    pagination.hidden = totalPages <= 1;
    if (totalPages <= 1) return;

    const status = pagination.querySelector('[data-price-sort-status]');
    const ofLabel = wrapperOf(grid)?.getAttribute('data-pagination-of') || 'of';
    if (status) status.textContent = `${state.page} ${ofLabel} ${totalPages}`;

    pagination.querySelectorAll('[data-price-sort-action]').forEach((button) => {
      const action = button.getAttribute('data-price-sort-action');
      const disabled = action === 'first' || action === 'prev' ? state.page <= 1 : state.page >= totalPages;
      button.disabled = disabled;
      button.setAttribute('aria-hidden', disabled ? 'true' : 'false');
      if (disabled) button.removeAttribute('role');
      else button.setAttribute('role', 'button');
    });
  };

  const goToPage = (grid, page) => {
    const state = grid._priceSortState;
    if (!state) return;

    const totalPages = Math.max(1, Math.ceil(state.cards.length / state.pageSize));
    const next = Math.min(totalPages, Math.max(1, page));
    if (next === state.page && grid.dataset.priceSortReady === 'true') return;

    state.page = next;
    renderPage(grid, state);
    updatePagination(grid, state);

    if (grid.dataset.priceSortReady === 'true') {
      (grid.closest('[id]') || grid).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    grid.dataset.priceSortReady = 'true';
  };

  const bindPagination = (grid) => {
    const pagination = wrapperOf(grid)?.querySelector('[data-price-sort-pagination]');
    if (!pagination || pagination.dataset.bound === 'true') return;
    pagination.dataset.bound = 'true';

    pagination.addEventListener('click', (event) => {
      const button = event.target.closest('[data-price-sort-action]');
      const state = grid._priceSortState;
      if (!button || button.disabled || !state) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const totalPages = Math.max(1, Math.ceil(state.cards.length / state.pageSize));
      const action = button.getAttribute('data-price-sort-action');
      const page =
        action === 'first' ? 1 : action === 'prev' ? state.page - 1 : action === 'next' ? state.page + 1 : totalPages;
      goToPage(grid, page);
    });
  };

  const collectRemainingCards = async (grid, existing) => {
    const total = parseInt(wrapperOf(grid)?.getAttribute('data-products-count'), 10) || existing.length;
    const pages = Math.ceil(total / SHOPIFY_PAGE_MAX);
    if (pages <= 1) return [];

    const seen = new Set(existing.map((card) => card.dataset.handle).filter(Boolean));
    const currentPage = Number(new URLSearchParams(window.location.search).get('page') || 1);
    const fetches = [];

    for (let page = 1; page <= pages; page += 1) {
      if (page === currentPage) continue;
      const url = new URL(window.location.href);
      url.searchParams.set('page', String(page));
      fetches.push(
        fetch(url)
          .then((response) => response.text())
          .then((html) => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return [...doc.querySelectorAll('[data-body-grid] .product-card--root')]
              .filter((card) => card.dataset.handle && !seen.has(card.dataset.handle))
              .map((card) => {
                seen.add(card.dataset.handle);
                return document.importNode(card, true);
              });
          })
          .catch(() => [])
      );
    }

    return (await Promise.all(fetches)).flat();
  };

  const applyGrid = async (grid, sortBy, token) => {
    const children = [...grid.children];
    const cards = children.filter(isCard);
    const extras = children.filter((el) => !isCard(el) && !isBlank(el));
    const remaining = await collectRemainingCards(grid, cards);
    if (grid._priceSortToken !== token) return;

    grid._priceSortState = {
      extras,
      cards: sortCards([...cards, ...remaining], sortBy),
      page: 0,
      pageSize: Math.max(1, parseInt(wrapperOf(grid)?.getAttribute('data-page-size'), 10) || 20),
    };
    bindPagination(grid);
    goToPage(grid, 1);
  };

  let runToken = 0;

  const applyPriceSort = () => {
    const sortBy = getSortBy();
    const token = ++runToken;

    document.querySelectorAll('[data-body-grid]').forEach((grid) => {
      delete grid.dataset.priceSortReady;
      grid._priceSortToken = token;
      const pagination = wrapperOf(grid)?.querySelector('[data-price-sort-pagination]');

      if (!PRICE_SORTS.has(sortBy)) {
        if (pagination) {
          pagination.hidden = true;
          delete pagination.dataset.bound;
        }
        grid.removeAttribute('data-price-sort-pending');
        return;
      }

      applyGrid(grid, sortBy, token);
    });
  };

  applyPriceSort();

  if (typeof window.on === 'function') {
    window.on('theme:navigation:reloaded.priceSort', applyPriceSort);
  } else {
    window.addEventListener('theme:navigation:reloaded', applyPriceSort);
  }
})();
