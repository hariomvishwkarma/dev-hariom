import { debounce } from '../../../scripts/utils/debounce';

class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    const filterDrawer = this.querySelector('[data-component-id="filters-drawer"]');
    const applyButton = filterDrawer?.querySelector('input[type="button"]');

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    this.debouncedOnApply = debounce((event) => {
      event.preventDefault();
      filterDrawer.close();
    }, 100);

    const facetForm = this.querySelector('form');
    if (facetForm) {
      const sortings = facetForm.querySelector('select#SortBy');
      if (sortings) sortings.addEventListener('change', this.debouncedOnSubmit.bind(this));
      facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));
    }
    if (applyButton) applyButton.addEventListener('click', this.debouncedOnApply.bind(this));
  }

  onSubmitHandler(e) {
    e.preventDefault();
    const optionId = e.target.dataset.optionId;

    const checkboxChecked = e.target.checked;
    const checkboxes = this.querySelectorAll(`input[type="checkbox"][data-option-id="${optionId}"]`);

    for (const checkbox of checkboxes) {
      checkbox.checked = checkboxChecked;
    }

    const container = e.target.closest('[data-filter-group]');
    if (!container) return;

    const inputs = container.querySelectorAll('input[data-option-id], select');

    const formData = new FormData();
    inputs.forEach((input) => {
      if (input.type === 'checkbox') {
        if (input.checked) {
          formData.append(input.name, input.value);
        }
      } else {
        formData.append(input.name, input.value);
      }
    });
    const searchParams = new URLSearchParams(formData).toString();
    FacetFiltersForm.renderContent(searchParams, e);
  }

  static renderContent(urlParams, e) {
    const gridContainer = document.getElementById('ProductGridContainer');
    if (gridContainer) {
      const loading = gridContainer.querySelector('[data-loading]');
      if (loading) loading.classList.remove('hidden');
    }

    const sections = FacetFiltersForm.getSections();

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.sectionId}&${urlParams}`;
      const filterDataUrl = (element) => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl) ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, e) : FacetFiltersForm.renderSectionFromFetch(url, e);
    });

    FacetFiltersForm.updateURLHash(urlParams);
  }

  static renderSectionFromFetch(url, e) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(responseText, 'text/html');

        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];

        FacetFiltersForm.replaceContent(html, e);
      });
  }

  static renderSectionFromCache(filterDataUrl, e) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;

    FacetFiltersForm.replaceContent(html, e);
  }

  static replaceContent(html, e) {
    if (!html) return;

    FacetFiltersForm.replaceContentByid('ProductGridContainer', html);
    FacetFiltersForm.replaceContentByid('filterDrawerBtn', html);

    // replace filters
    const filterEls = document.querySelectorAll('#FilteringAndSorting .filter-types, #FilteringAndSorting .quick-filters quick-filter, #FilteringAndSorting .sort-wrap');
    filterEls?.forEach((filterGroup) => {
      filterGroup.querySelectorAll('.facets__list > .facet, .sort-by-wrap > #SortBy').forEach((checkBoxGroup) => {
        const checkID = checkBoxGroup.id;
        if (checkID) FacetFiltersForm.replaceContentByid(checkID, html);
      });

      const filterActiveCountWrapperID = filterGroup.querySelector('.filter__label-reactive')?.id;
      if (filterActiveCountWrapperID) FacetFiltersForm.replaceContentByid(filterActiveCountWrapperID, html);
    });

    FacetFiltersForm.replaceFilterElements(html, e);

    const event = new CustomEvent('product-grid:replaced', {});
    document.dispatchEvent(event);

    const gridContainer = document.getElementById('ProductGridContainer');
    if (gridContainer) {
      const loading = gridContainer.querySelector('[data-loading]');
      if (loading) loading.classList.add('hidden');
    }
  }

  static replaceContentByid(targetId, html) {
    const sourceEl = html.getElementById(targetId);
    const destinationEl = document.getElementById(targetId);

    if (destinationEl && sourceEl) destinationEl.innerHTML = sourceEl.innerHTML;
  }

  static resetActiveFacets(target) {
    if (!target) return;
    const targetElements = target.querySelectorAll('.facets__list li input');

    targetElements.forEach((element) => {
      element.checked = false;
    });
  }

  static replaceFilterElements(html, e) {
    const filterElements = html.querySelectorAll('#FilteringAndSorting .js-filter, #FilteringAndSortingMobile .js-filter');

    const matchesIndex = (element) => {
      const jsFilter = e ? e.target.closest('.js-filter') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    };

    const otherFacetsToRender = Array.from(filterElements).filter((element) => !matchesIndex(element));
    const facetToRender = Array.from(filterElements).find(matchesIndex);

    otherFacetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    if (facetToRender) FacetFiltersForm.replaceCurrentFacet(facetToRender, e.target.closest('.js-filter'));

    FacetFiltersForm.activeFilters();
  }

  static replaceCurrentFacet(source, target) {
    const targetElement = target.querySelector('.facets__header');
    const sourceElement = source.querySelector('.facets__header');

    if (sourceElement && targetElement) {
      targetElement.outerHTML = sourceElement.outerHTML;
    }
  }

  static getSections() {
    return [
      {
        sectionId: document.getElementById('ProductGridContainer')?.dataset.id,
      },
    ];
  }

  static updateURLHash(urlParams) {
    history.pushState({ urlParams }, '', `${window.location.pathname}${urlParams && '?'.concat(urlParams)}`);
  }

  static activeFilters() {
    const activeFilters = document.querySelectorAll('#ActiveFiltersContainer a, .facets__header a');
    activeFilters.forEach((filter) => {
      filter.addEventListener('click', (e) => {
        e.preventDefault();

        const url = e.currentTarget.href.indexOf('?') == -1 ? '' : e.currentTarget.href.slice(e.currentTarget.href.indexOf('?') + 1);

        FacetFiltersForm.renderContent(url, e);

        const target = e.currentTarget.closest('.js-filter');

        FacetFiltersForm.resetActiveFacets(target);
      });
    });
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FacetFiltersForm.renderContent(url);
  }
}

FacetFiltersForm.filterData = [];

customElements.define('facet-filters-form', FacetFiltersForm);
