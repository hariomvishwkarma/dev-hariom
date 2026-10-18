class HcStoreLocator extends HTMLElement {
  constructor() {
    super();
    this.map = null;
    this.infoWindow = null;
    this.markers = {};
    this.activeId = null;
    this.stores = [];
    this.zipCache = {};
    this.geocoder = null;
    this.lastFitCoords = [];
  }

  connectedCallback() {
    this.stores = this.readStores();
    this.cacheIcons();
    this.bindEvents();
    this.render();

    if (!this.dataset.apiKey) {
      this.showMapError();
      return;
    }

    if (typeof theme !== 'undefined' && theme.initWhenVisible) {
      theme.initWhenVisible({
        element: this,
        callback: this.loadMapsApi.bind(this),
        threshold: 200
      });
    } else {
      this.loadMapsApi();
    }
  }

  cacheIcons() {
    const filterCloud = this.querySelector('[data-filter-postop] .hc-store-locator__icon--cloud');
    const filterRibbon = this.querySelector('[data-filter-mastectomy] .hc-store-locator__icon--ribbon');
    const iconTemplate = this.querySelector('[data-store-locator-icon-template]');

    this.iconCloud =
      filterCloud?.innerHTML.trim() ||
      iconTemplate?.content.querySelector('[data-icon-cloud]')?.innerHTML.trim() ||
      this.defaultCloudIcon();
    this.iconRibbon =
      filterRibbon?.innerHTML.trim() ||
      iconTemplate?.content.querySelector('[data-icon-ribbon]')?.innerHTML.trim() ||
      this.defaultRibbonIcon();
  }

  defaultCloudIcon() {
    return `<svg class="hc-store-locator__svg-icon" viewBox="0 0 28 18" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 14.5h19c3.6 0 6.5-2.7 6.5-6.1 0-3.1-2.3-5.7-5.4-6.1-.8-3-3.5-5.2-6.8-5.2-2.9 0-5.4 1.6-6.7 4C6.2 1.2 3.8 3.4 3.8 6.3 1.7 7 0 9.1 0 11.5c0 1.7.9 3.2 2.2 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  }

  defaultRibbonIcon() {
    return `<svg class="hc-store-locator__svg-icon" viewBox="0 0 16 22" fill="none" aria-hidden="true" focusable="false"><path d="M8 0C4.7 0 2 2.7 2 6c0 4.8 6 13 6 13s6-8.2 6-13c0-3.3-2.7-6-6-6zm0 9.2A3.2 3.2 0 1 1 8 2.8a3.2 3.2 0 0 1 0 6.4z" fill="currentColor"/><path d="M5.4 17.8 3.5 21M10.6 17.8l1.9 3.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  }

  defaultMapCloudIcon() {
    return `<svg class="hc-store-locator__svg-icon hc-store-locator__svg-icon--pin-cloud" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 45" aria-hidden="true" focusable="false"><path stroke="currentColor" stroke-width="1.5" fill="currentColor" d="M3.69531 15.498C8.59196 3.86257 18.4072 -1.45573 29.208 0.421875C34.5974 1.35882 39.5361 4.46331 43.0957 9.32031C44.9796 11.8907 46.3715 14.8031 47.4492 17.9443C49.7277 24.5884 50.2524 31.4891 50.2461 38.6104V38.6348L50.2266 38.6504C49.7466 39.0407 49.3125 39.2961 48.7793 39.585C44.7871 41.7497 40.5523 43.1341 36.1328 43.9443L36.1318 43.9463L36.1133 43.9492C27.884 45.4554 19.5977 45.2475 11.4961 43.3994H11.4941C7.55174 42.3855 3.68486 41.0403 0.105469 38.7617L0.0810547 38.7471V38.7188C-0.112455 30.7402 0.659825 22.712 3.69531 15.498ZM40.9062 9.50293C34.5514 1.52937 24.1577 -0.194726 15.7939 4.1123C12.3354 5.89292 9.45005 8.79247 7.33398 12.4609C3.0961 19.8127 1.95523 28.8868 1.99121 37.6172C6.11028 39.936 10.5511 41.2564 15.0283 42.1064L16.0264 42.2734C26.4021 43.9123 38.8759 42.8967 48.3516 37.5264C48.306 30.1958 47.4709 23.2217 44.873 16.5322L44.4688 15.5762C43.5018 13.3681 42.3634 11.3304 40.9062 9.50293Z"/></svg>`;
  }

  getMapRibbonIconHtml() {
    if (this.dataset.iconRibbonUrl) {
      return `<span class="hc-store-locator__g-pin-icon-mask hc-store-locator__g-pin-icon-mask--ribbon" style="--icon-mask: url('${this.dataset.iconRibbonUrl}');" aria-hidden="true"></span>`;
    }

    return `<span class="hc-store-locator__g-pin-icon-svg hc-store-locator__g-pin-icon-svg--ribbon">${this.defaultRibbonIcon()}</span>`;
  }

  getMapCloudIconHtml() {
    if (this.dataset.iconCloudUrl) {
      return `<span class="hc-store-locator__g-pin-icon-mask hc-store-locator__g-pin-icon-mask--cloud" style="--icon-mask: url('${this.dataset.iconCloudUrl}');" aria-hidden="true"></span>`;
    }

    return `<span class="hc-store-locator__g-pin-icon-svg hc-store-locator__g-pin-icon-svg--cloud">${this.defaultMapCloudIcon()}</span>`;
  }

  pinStyleFromFilters(wanted) {
    const hasMastectomy = wanted.includes('mastectomy');
    const hasPostop = wanted.includes('postop');

    if (hasPostop && !hasMastectomy) return 'cloud';
    if (hasMastectomy && !hasPostop) return 'ribbon';

    return null;
  }

  pinStyleForStore(store, wanted) {
    const fromFilters = this.pinStyleFromFilters(wanted);
    if (fromFilters) return fromFilters;

    if (store.mastectomy && store.postop) return 'both';
    if (store.mastectomy) return 'ribbon';
    if (store.postop) return 'cloud';

    return 'default';
  }

  applyPinElement(el, pinStyle, active) {
    const activeClass = active ? ' is-active' : '';

    if (pinStyle === 'both') {
      el.className = `hc-store-locator__g-pin hc-store-locator__g-pin--both${activeClass}`;
      el.innerHTML = `<svg class="hc-store-locator__g-pin-shape" width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M14 0C6.3 0 0 6.1 0 13.7 0 23.4 14 38 14 38s14-14.6 14-24.3C28 6.1 21.7 0 14 0z"/>
      </svg>
      <div class="hc-store-locator__g-pin-icon-wrap hc-store-locator__g-pin-icon-wrap--dual">
        ${this.getMapCloudIconHtml()}
        ${this.getMapRibbonIconHtml()}
      </div>`;
      return;
    }

    if (pinStyle === 'ribbon') {
      el.className = `hc-store-locator__g-pin hc-store-locator__g-pin--ribbon${activeClass}`;
      el.innerHTML = `<svg class="hc-store-locator__g-pin-shape" width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M14 0C6.3 0 0 6.1 0 13.7 0 23.4 14 38 14 38s14-14.6 14-24.3C28 6.1 21.7 0 14 0z"/>
      </svg>
      <div class="hc-store-locator__g-pin-icon-wrap">${this.getMapRibbonIconHtml()}</div>`;
      return;
    }

    if (pinStyle === 'cloud') {
      el.className = `hc-store-locator__g-pin hc-store-locator__g-pin--cloud${activeClass}`;
      el.innerHTML = `<svg class="hc-store-locator__g-pin-shape" width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M14 0C6.3 0 0 6.1 0 13.7 0 23.4 14 38 14 38s14-14.6 14-24.3C28 6.1 21.7 0 14 0z"/>
      </svg>
      <div class="hc-store-locator__g-pin-icon-wrap">${this.getMapCloudIconHtml()}</div>`;
      return;
    }

    el.className = `hc-store-locator__g-pin${activeClass}`;
    el.innerHTML = `<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 0C6.3 0 0 6.1 0 13.7 0 23.4 14 38 14 38s14-14.6 14-24.3C28 6.1 21.7 0 14 0z"/>
      <circle cx="14" cy="13.6" r="5" fill="#fff"/></svg>`;
  }

  getTagIconHtml(type) {
    if (type === 'cloud') {
      if (this.dataset.iconCloudUrl) {
        return `<span class="hc-store-locator__icon hc-store-locator__icon--cloud"><span class="hc-store-locator__icon-mask hc-store-locator__icon-mask--cloud" style="--icon-mask: url('${this.dataset.iconCloudUrl}');" aria-hidden="true"></span></span>`;
      }
      return `<span class="hc-store-locator__icon hc-store-locator__icon--cloud">${this.iconCloud}</span>`;
    }

    if (this.dataset.iconRibbonUrl) {
      return `<span class="hc-store-locator__icon hc-store-locator__icon--ribbon"><span class="hc-store-locator__icon-mask hc-store-locator__icon-mask--ribbon" style="--icon-mask: url('${this.dataset.iconRibbonUrl}');" aria-hidden="true"></span></span>`;
    }
    return `<span class="hc-store-locator__icon hc-store-locator__icon--ribbon">${this.iconRibbon}</span>`;
  }

  storeProductTags(store) {
    const tags = [];

    if (store.postop) {
      tags.push(`<span class="hc-store-locator__product-tag hc-store-locator__product-tag--cloud">
        ${this.getTagIconHtml('cloud')}
        <span>${this.dataset.labelBraInserts || 'Bra Inserts'}</span>
      </span>`);
    }

    if (store.mastectomy) {
      tags.push(`<span class="hc-store-locator__product-tag hc-store-locator__product-tag--ribbon">
        ${this.getTagIconHtml('ribbon')}
        <span>${this.dataset.labelBreastForms || 'Breast Forms'}</span>
      </span>`);
    }

    return tags.join('');
  }

  readStores() {
    const node = this.querySelector('[data-store-locator-stores]');
    if (!node) return [];

    try {
      const stores = JSON.parse(node.textContent);
      return stores.map((store) => ({
        ...store,
        mastectomy: this.asBool(store.mastectomy),
        postop: this.asBool(store.postop)
      }));
    } catch (error) {
      return [];
    }
  }

  asBool(value) {
    if (value === true || value === 1) return true;
    if (value === false || value === 0 || value == null) return false;
    const normalized = String(value).trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  bindEvents() {
    this.querySelector('[data-search-btn]')?.addEventListener('click', () => this.render());
    this.querySelector('[data-zip-input]')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') this.render();
    });
    this.querySelector('[data-distance-select]')?.addEventListener('change', () => this.render());
    this.querySelector('[data-count-select]')?.addEventListener('change', () => this.render());
    this.querySelector('[data-filter-mastectomy]')?.addEventListener('change', () => this.render());
    this.querySelector('[data-filter-postop]')?.addEventListener('change', () => this.render());
    this.querySelector('[data-near-btn]')?.addEventListener('click', () => this.useMyLocation());
    this.querySelector('[data-clear-selection]')?.addEventListener('click', () => this.clearSelection());
  }

  loadMapsApi() {
    if (this.map || this._mapsLoading) return;
    this._mapsLoading = true;

    if (window.google && window.google.maps) {
      this.initMap();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(this.dataset.apiKey)}&libraries=marker&v=weekly`;
    script.onload = () => this.initMap();
    script.onerror = () => {
      this._mapsLoading = false;
      this.showMapError();
    };
    document.body.appendChild(script);

    window.gm_authFailure = () => this.showMapError();
  }

  clearMarkers() {
    Object.values(this.markers).forEach(({ marker }) => {
      if (marker.map !== undefined) {
        marker.map = null;
      } else if (marker.setMap) {
        marker.setMap(null);
      }
    });

    this.markers = {};
  }

  initMap() {
    if (this.map) return;
    const mapEl = this.querySelector('[data-map]');
    if (!mapEl || !window.google || !window.google.maps) {
      this.showMapError();
      return;
    }

    const centerLat = parseFloat(this.dataset.defaultLat || '39');
    const centerLng = parseFloat(this.dataset.defaultLng || '-95');
    const zoom = parseInt(this.dataset.defaultZoom || '4', 10);
    const mapId = this.dataset.mapId || '';

    const mapOptions = {
      center: { lat: centerLat, lng: centerLng },
      zoom,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      clickableIcons: false
    };

    if (mapId) {
      mapOptions.mapId = mapId;
    }

    this.map = new google.maps.Map(mapEl, mapOptions);
    this.infoWindow = new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0, -14)
    });
    this.geocoder = new google.maps.Geocoder();
    this.buildMarkers();
    this.render();

    requestAnimationFrame(() => {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setCenter({ lat: centerLat, lng: centerLng });
    });
  }

  buildMarkers() {
    if (!this.map || !this.stores.length) return;

    this.clearMarkers();

    this.stores.forEach((store) => {
      const wanted = this.categoryFilters();
      const pinEl = this.createPinElement(store, false, wanted);
      let marker;

      if (google.maps.marker?.AdvancedMarkerElement) {
        marker = new google.maps.marker.AdvancedMarkerElement({
          map: this.map,
          position: { lat: store.lat, lng: store.lng },
          content: pinEl,
          title: store.name
        });
      } else {
        marker = new google.maps.Marker({
          map: this.map,
          position: { lat: store.lat, lng: store.lng },
          title: store.name
        });
      }

      pinEl.addEventListener
        ? pinEl.addEventListener('click', (event) => {
            event.stopPropagation();
            this.selectStore(store.id, true);
          })
        : null;

      this.markers[store.id] = { marker, el: pinEl };
    });
  }

  createPinElement(store, active, wanted) {
    const el = document.createElement('div');
    const pinStyle = this.pinStyleForStore(store, wanted || this.categoryFilters());
    this.applyPinElement(el, pinStyle, active);
    return el;
  }

  categoryFilters() {
    const filters = [];
    const mastectomy = this.querySelector('[data-filter-mastectomy]');
    const postop = this.querySelector('[data-filter-postop]');

    if (mastectomy && mastectomy.checked) filters.push('mastectomy');
    if (postop && postop.checked) filters.push('postop');

    return filters;
  }

  storeMatchesFilters(store, wanted) {
    if (!wanted.length) return true;
    return wanted.some((filter) => store[filter] === true);
  }

  haversine(lat1, lng1, lat2, lng2) {
    const radius = 3958.8;
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  directionsUrl(store) {
    return `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
  }

  websiteHref(url) {
    if (!url) return '';
    const trimmed = String(url).trim();
    if (!trimmed) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  normalizePostalCode(code) {
    return String(code || '').trim().toUpperCase();
  }

  compactPostalCode(code) {
    return this.normalizePostalCode(code).replace(/[\s-]/g, '');
  }

  formatCanadianPostal(code) {
    const compact = this.compactPostalCode(code);
    if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(compact)) {
      return this.normalizePostalCode(code);
    }

    return `${compact.slice(0, 3)} ${compact.slice(3)}`;
  }

  isCanadianPostal(code) {
    return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(this.compactPostalCode(code));
  }

  isUsZip(code) {
    return /^\d{5}(-\d{4})?$/.test(String(code || '').trim());
  }

  findOriginFromStores(zip) {
    const search = this.compactPostalCode(zip);
    if (!search) return null;

    const matches = this.stores.filter((store) => this.compactPostalCode(store.zip) === search);
    if (!matches.length) return null;

    const lat = matches.reduce((sum, store) => sum + store.lat, 0) / matches.length;
    const lng = matches.reduce((sum, store) => sum + store.lng, 0) / matches.length;
    return [lat, lng];
  }

  geocodeOnce(request) {
    return new Promise((resolve) => {
      this.geocoder.geocode(request, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve([location.lat(), location.lng()]);
          return;
        }

        resolve(null);
      });
    });
  }

  async geocodePostalCode(zip) {
    const trimmed = zip.trim();
    const attempts = [];

    if (this.isCanadianPostal(trimmed)) {
      const formatted = this.formatCanadianPostal(trimmed);
      attempts.push({ componentRestrictions: { postalCode: formatted, country: 'CA' } });
      attempts.push({ address: `${formatted}, Canada` });
    } else if (this.isUsZip(trimmed)) {
      const base = trimmed.split('-')[0];
      attempts.push({ componentRestrictions: { postalCode: base, country: 'US' } });
      attempts.push({ address: `${base}, United States` });
    } else {
      attempts.push({ address: trimmed });
    }

    for (const request of attempts) {
      const result = await this.geocodeOnce(request);
      if (result) return result;
    }

    return null;
  }

  getZipInputValue() {
    const zipInput = this.querySelector('[data-zip-input]');
    const zip = zipInput?.value.trim() || '';

    if (!zip) return '';
    if (zip === '(my location)' || zip === '__me__') return zip;

    return zip;
  }

  async resolveSearchContext() {
    const zip = this.getZipInputValue();

    if (!zip) {
      return { type: 'all' };
    }

    if (zip === '(my location)' || zip === '__me__') {
      if (this.zipCache['__me__']) {
        return { type: 'near', origin: this.zipCache['__me__'], label: '(my location)' };
      }

      return { type: 'invalid', reason: 'location' };
    }

    if (this.zipCache[zip]) {
      return { type: 'near', origin: this.zipCache[zip], label: zip };
    }

    const localOrigin = this.findOriginFromStores(zip);
    if (localOrigin) {
      this.zipCache[zip] = localOrigin;
      return { type: 'near', origin: localOrigin, label: zip };
    }

    if (this.geocoder) {
      const result = await this.geocodePostalCode(zip);

      if (result) {
        this.zipCache[zip] = result;
        return { type: 'near', origin: result, label: zip };
      }
    }

    return { type: 'invalid', reason: 'zip' };
  }

  buildCardHtml(store, index, showDistance) {
    const distanceHtml = showDistance
      ? `<div class="hc-store-locator__distance"><b>${store.d.toFixed(1)}</b>mi</div>`
      : '';
    const productTags = this.storeProductTags(store);

    return `
      <div class="hc-store-locator__card" data-id="${store.id}">
        <div class="hc-store-locator__rail">
          <div class="hc-store-locator__list-pin"><span>${index + 1}</span></div>
          ${distanceHtml}
        </div>
        <div class="hc-store-locator__card-body">
          <p class="hc-store-locator__store-name">${store.name}</p>
          <div class="hc-store-locator__card-details">
            <div class="hc-store-locator__card-info">
              <p class="hc-store-locator__address">${store.addr}<br>${store.city}, ${store.state} ${store.zip}${store.country ? `, ${store.country}` : ''}</p>
              ${store.website ? `<a class="hc-store-locator__website" href="${this.websiteHref(store.website)}" target="_blank" rel="noopener">${store.website}</a>` : ''}
              <div class="hc-store-locator__meta-row">
                <a href="${this.directionsUrl(store)}" target="_blank" rel="noopener">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                  ${this.dataset.directionsLabel || 'Directions'}
                </a>
                ${this.asBool(this.dataset.showPhone) && store.phone ? `<span class="hc-store-locator__phone">${store.phone}</span>` : ''}
              </div>
            </div>
            ${productTags ? `<div class="hc-store-locator__card-tags">${productTags}</div>` : ''}
          </div>
        </div>
      </div>`;
  }

  renderList(list, showDistance) {
    const listEl = this.querySelector('[data-results-list]');
    if (!listEl) return;

    listEl.innerHTML = list.map((store, index) => this.buildCardHtml(store, index, showDistance)).join('');

    listEl.querySelectorAll('.hc-store-locator__card').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        this.selectStore(parseInt(card.dataset.id, 10), true);
      });
    });
  }

  updateVisibleMarkers(list, fitCoords) {
    const visible = new Set(list.map((store) => store.id));
    const wanted = this.categoryFilters();
    const activeId = this.activeId;

    Object.entries(this.markers).forEach(([id, marker]) => {
      const storeId = parseInt(id, 10);
      const isVisible = visible.has(storeId);
      const store = this.stores.find((entry) => entry.id === storeId);

      if (store && marker.el) {
        const pinStyle = this.pinStyleForStore(store, wanted);
        this.applyPinElement(marker.el, pinStyle, storeId === activeId);
      }

      if (this.map) {
        if (marker.marker.map !== undefined) {
          marker.marker.map = isVisible ? this.map : null;
        } else {
          marker.marker.setMap(isVisible ? this.map : null);
        }
      }
    });

    if (this.map && fitCoords.length) {
      this.lastFitCoords = fitCoords;
      this.fitTo(fitCoords);
    }
  }

  async render() {
    const context = await this.resolveSearchContext();
    const maxDist = parseInt(this.querySelector('[data-distance-select]')?.value || '0', 10);
    const limit = parseInt(this.querySelector('[data-count-select]')?.value || '0', 10);
    const wanted = this.categoryFilters();
    const head = this.querySelector('[data-results-head]');
    const listEl = this.querySelector('[data-results-list]');

    let list = this.stores.filter((store) => this.storeMatchesFilters(store, wanted));

    if (context.type === 'invalid') {
      const title =
        context.reason === 'location'
          ? this.dataset.geoFailedText || "Couldn't get your location. Enter a ZIP instead."
          : this.dataset.invalidZipTitle || 'ZIP not recognized';
      const message =
        context.reason === 'location'
          ? this.dataset.invalidZipText || 'Enter a valid US ZIP code and search again.'
          : this.dataset.invalidZipText || 'Enter a valid US ZIP code and search again.';

      if (head) head.textContent = this.dataset.emptyZipText || 'Enter a valid ZIP and search';
      if (listEl) {
        listEl.innerHTML = `<div class="hc-store-locator__empty"><h3>${title}</h3><p>${message}</p></div>`;
      }

      Object.values(this.markers).forEach((marker) => marker.el?.classList.remove('is-active'));
      this.activeId = null;
      this.updateClearSelectionButton();
      return;
    }

    if (context.type === 'all') {
      list = list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      if (limit > 0) {
        list = list.slice(0, limit);
      }

      if (head) {
        head.innerHTML = `<b>${list.length}</b> store${list.length === 1 ? '' : 's'} available`;
      }

      if (!list.length) {
        if (listEl) {
          listEl.innerHTML = `<div class="hc-store-locator__empty"><h3>${this.dataset.noResultsTitle || 'No stores in range'}</h3><p>${this.dataset.noResultsText || 'Try clearing a filter.'}</p></div>`;
        }

        this.updateVisibleMarkers([], []);
        this.activeId = null;
        this.updateClearSelectionButton();
        return;
      }

      this.renderList(list, false);
      this.updateVisibleMarkers(list, list.map((store) => ({ lat: store.lat, lng: store.lng })));
      this.activeId = null;
      this.updateClearSelectionButton();
      return;
    }

    list = list
      .map((store) => ({ ...store, d: this.haversine(context.origin[0], context.origin[1], store.lat, store.lng) }))
      .sort((a, b) => a.d - b.d);

    if (maxDist > 0) {
      list = list.filter((store) => store.d <= maxDist);
    }

    if (limit > 0) {
      list = list.slice(0, limit);
    }

    const within = maxDist > 0 ? ` within ${maxDist} mi` : '';

    if (head) {
      head.innerHTML = `<b>${list.length}</b> store${list.length === 1 ? '' : 's'} found near <b>${context.label}</b>${within}`;
    }

    if (!list.length) {
      if (listEl) {
        listEl.innerHTML = `<div class="hc-store-locator__empty"><h3>${this.dataset.noResultsTitle || 'No stores in range'}</h3><p>${this.dataset.noResultsText || 'Try increasing the distance or clearing a filter.'}</p></div>`;
      }

      this.updateVisibleMarkers([], [{ lat: context.origin[0], lng: context.origin[1] }]);

      if (this.map) {
        this.map.panTo({ lat: context.origin[0], lng: context.origin[1] });
        this.map.setZoom(9);
      }

      this.activeId = null;
      this.updateClearSelectionButton();
      return;
    }

    this.renderList(list, true);
    this.updateVisibleMarkers(list, [
      { lat: context.origin[0], lng: context.origin[1] },
      ...list.map((store) => ({ lat: store.lat, lng: store.lng }))
    ]);
    this.activeId = null;
    this.updateClearSelectionButton();
  }

  updateClearSelectionButton() {
    const btn = this.querySelector('[data-clear-selection]');
    if (!btn) return;
    btn.hidden = this.activeId == null;
  }

  clearSelection() {
    if (this.activeId == null) return;

    this.activeId = null;
    this.updateClearSelectionButton();

    this.querySelectorAll('.hc-store-locator__card').forEach((card) => {
      card.classList.remove('is-active');
    });

    const wanted = this.categoryFilters();
    Object.entries(this.markers).forEach(([markerId, marker]) => {
      const storeId = parseInt(markerId, 10);
      const store = this.stores.find((entry) => entry.id === storeId);

      if (store && marker.el) {
        const pinStyle = this.pinStyleForStore(store, wanted);
        this.applyPinElement(marker.el, pinStyle, false);
      }

      if (marker.marker.zIndex !== undefined) {
        marker.marker.zIndex = 1;
      }
    });

    if (this.infoWindow) {
      this.infoWindow.close();
    }

    if (this.map) {
      if (this.lastFitCoords && this.lastFitCoords.length) {
        this.fitTo(this.lastFitCoords);
      } else {
        const centerLat = parseFloat(this.dataset.defaultLat || '39');
        const centerLng = parseFloat(this.dataset.defaultLng || '-95');
        const zoom = parseInt(this.dataset.defaultZoom || '4', 10);
        this.map.panTo({ lat: centerLat, lng: centerLng });
        this.map.setZoom(zoom);
      }
    }
  }

  fitTo(coords) {
    if (!this.map || !coords.length) return;

    if (coords.length === 1) {
      this.map.panTo(coords[0]);
      this.map.setZoom(9);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    coords.forEach((coord) => bounds.extend(coord));
    this.map.fitBounds(bounds, { top: 70, bottom: 70, left: 70, right: 70 });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      if (this.map.getZoom() > 12) this.map.setZoom(12);
    });
  }

  selectStore(id, fly) {
    this.activeId = id;
    const wanted = this.categoryFilters();

    this.querySelectorAll('.hc-store-locator__card').forEach((card) => {
      card.classList.toggle('is-active', parseInt(card.dataset.id, 10) === id);
    });

    Object.entries(this.markers).forEach(([markerId, marker]) => {
      const storeId = parseInt(markerId, 10);
      const isActive = storeId === id;
      const store = this.stores.find((entry) => entry.id === storeId);

      if (store && marker.el) {
        const pinStyle = this.pinStyleForStore(store, wanted);
        this.applyPinElement(marker.el, pinStyle, isActive);
      }

      if (marker.marker.zIndex !== undefined) {
        marker.marker.zIndex = isActive ? 1000 : 1;
      }
    });

    const store = this.stores.find((entry) => entry.id === id);

    if (store && fly && this.map) {
      this.map.panTo({ lat: store.lat, lng: store.lng });
      if (this.map.getZoom() < 10) this.map.setZoom(11);
      this.openInfo(store);
    }

    const card = this.querySelector(`.hc-store-locator__card[data-id="${id}"]`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    this.updateClearSelectionButton();
  }

  openInfo(store) {
    if (!this.infoWindow || !this.map) return;

    const markerEntry = this.markers[store.id];
    if (!markerEntry?.marker) return;

    this.infoWindow.setContent(`
      <div style="font-family:inherit;min-width:180px">
        <div style="font-weight:600;font-size:14px;margin-bottom:3px">${store.name}</div>
        <div style="font-size:12.5px;line-height:1.45;opacity:0.75">${store.addr}<br>${store.city}, ${store.state} ${store.zip}</div>
        ${store.website ? `<a href="${this.websiteHref(store.website)}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;font-size:12.5px;font-weight:600;text-decoration:none">${store.website}</a>` : ''}
        <a href="${this.directionsUrl(store)}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;font-size:12.5px;font-weight:600;text-decoration:none">${this.dataset.directionsLabel || 'Get directions'} →</a>
      </div>`);

    this.infoWindow.open({
      anchor: markerEntry.marker,
      map: this.map
    });
  }

  useMyLocation() {
    if (!navigator.geolocation) {
      window.alert(this.dataset.geoUnavailableText || "Geolocation isn't available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = [position.coords.latitude, position.coords.longitude];
        this.zipCache['__me__'] = origin;

        const zipInput = this.querySelector('[data-zip-input]');
        if (zipInput) zipInput.value = '__me__';

        this.render();

        if (zipInput) zipInput.value = '(my location)';
      },
      () => {
        window.alert(this.dataset.geoFailedText || "Couldn't get your location. Enter a ZIP instead.");
      }
    );
  }

  showMapError() {
    this.querySelector('[data-map-msg]')?.classList.add('is-visible');
  }
}

customElements.define('hc-store-locator', HcStoreLocator);
