class HcDonationLocator extends HTMLElement {
  constructor() {
    super();
    this.map = null;
    this.infoWindow = null;
    this.geocoder = null;
    this.markers = {};
    this.activeId = null;
    this.orgs = [];
    this.myLocation = null;
    this.lastFitCoords = [];
    this.geocodePromise = null;
    this.geoCacheKey = 'hc-donation-locator-geo:v2';
  }

  connectedCallback() {
    this.orgs = this.readOrgs();
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

  readOrgs() {
    const node = this.querySelector('[data-donation-locator-orgs]');
    if (!node) return [];

    try {
      const orgs = JSON.parse(node.textContent);
      return orgs.map((org) => ({
        ...org,
        name: org.name || '',
        state: org.state || '',
        stateCode: org.stateCode || '',
        addr: org.addr || '',
        contacts: Array.isArray(org.contacts) ? org.contacts.filter(Boolean) : [],
        types: Array.isArray(org.types) ? org.types.filter(Boolean) : [],
        ...this.parseCoords(org.lat, org.lng)
      }));
    } catch (error) {
      return [];
    }
  }

  /* Metaobject latitude/longitude (number or text). Invalid / empty values → null so the address fallback is used. */
  parseCoords(latValue, lngValue) {
    const toNumber = (value) => {
      if (value === null || value === undefined) return NaN;
      const text = String(value).trim();
      return text === '' ? NaN : Number(text);
    };
    const lat = toNumber(latValue);
    const lng = toNumber(lngValue);
    const valid =
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      Math.abs(lat) <= 90 &&
      Math.abs(lng) <= 180 &&
      !(lat === 0 && lng === 0);

    return valid ? { lat, lng } : { lat: null, lng: null };
  }

  bindEvents() {
    const stateInput = this.querySelector('[data-state-input]');

    this.querySelector('[data-search-btn]')?.addEventListener('click', () => this.render());
    stateInput?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') this.render();
    });
    stateInput?.addEventListener('input', () => {
      if (this.myLocation && stateInput.value !== this.myLocationLabel()) this.myLocation = null;
    });
    stateInput?.addEventListener('change', () => this.render());
    this.querySelector('[data-distance-select]')?.addEventListener('change', () => this.render());
    this.querySelector('[data-count-select]')?.addEventListener('change', () => this.render());
    this.querySelectorAll('[data-filter-type]').forEach((input) => {
      input.addEventListener('change', () => this.render());
    });
    this.querySelector('[data-near-btn]')?.addEventListener('click', () => this.useMyLocation());
    this.querySelector('[data-clear-selection]')?.addEventListener('click', () => this.clearSelection());
  }

  escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  addressHtml(addr) {
    return this.escapeHtml(addr).replace(/\r?\n/g, '<br>');
  }

  addressOneLine(addr) {
    return String(addr || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(', ');
  }

  normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  myLocationLabel() {
    return '(my location)';
  }

  /* ---------- Google Maps ---------- */

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
    const mapOptions = {
      center: { lat: centerLat, lng: centerLng },
      zoom,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      clickableIcons: false
    };

    if (this.dataset.mapId) {
      mapOptions.mapId = this.dataset.mapId;
    }

    this.map = new google.maps.Map(mapEl, mapOptions);
    this.infoWindow = new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0, -14)
    });
    this.geocoder = new google.maps.Geocoder();

    this.orgs.forEach((org) => this.ensureMarker(org));
    this.render();

    this.geocodePromise = this.geocodeAll().then(() => {
      if (this.activeId == null) this.render();
    });
  }

  /* ---------- Geocoding (addresses → pins) ---------- */

  readGeoCache() {
    try {
      return JSON.parse(window.localStorage.getItem(this.geoCacheKey) || '{}') || {};
    } catch (error) {
      return {};
    }
  }

  writeGeoCache(cache) {
    try {
      window.localStorage.setItem(this.geoCacheKey, JSON.stringify(cache));
    } catch (error) {
      /* storage unavailable – ignore */
    }
  }

  addressTokens(value) {
    return this.normalize(value).split(/[^a-z0-9]+/).filter(Boolean);
  }

  addressHasState(org) {
    const lower = this.normalize(this.addressOneLine(org.addr));
    if (org.state && lower.includes(this.normalize(org.state))) return true;
    if (org.stateCode && this.addressTokens(org.addr).includes(this.normalize(org.stateCode))) return true;
    return false;
  }

  geocodeQuery(org) {
    const parts = [this.addressOneLine(org.addr)];

    if ((org.state || org.stateCode) && !this.addressHasState(org)) {
      parts.push(org.state || org.stateCode);
    }

    if (this.dataset.geocodeSuffix) {
      parts.push(this.dataset.geocodeSuffix);
    }

    return parts.filter(Boolean).join(', ');
  }

  geocodeOnce(request) {
    return new Promise((resolve) => {
      this.geocoder.geocode(request, (results, status) => {
        resolve({ status, results: status === 'OK' && results?.length ? results : [] });
      });
    });
  }

  /* Client-side geocoding is rate limited per session – back off and retry instead of skipping. */
  async geocodeWithRetry(request) {
    let delay = 1000;

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const response = await this.geocodeOnce(request);
      if (response.status !== 'OVER_QUERY_LIMIT') return response;
      await this.wait(delay);
      delay = Math.min(delay * 2, 8000);
    }

    return { status: 'OVER_QUERY_LIMIT', results: [] };
  }

  resultCoords(result) {
    const location = result.geometry.location;
    return [location.lat(), location.lng()];
  }

  /* True when a geocoder result lies in the org's state (or the org has no state to compare). */
  resultMatchesState(result, org) {
    if (!org.state && !org.stateCode) return true;

    const component = (result.address_components || []).find((c) => c.types.includes('administrative_area_level_1'));
    if (!component) return false;

    return (
      (org.stateCode && this.normalize(component.short_name) === this.normalize(org.stateCode)) ||
      (org.state && this.normalize(component.long_name) === this.normalize(org.state))
    );
  }

  /* State- or country-level hits mean the address wasn't specific enough – don't drop a pin in the middle of a state. */
  isPreciseResult(result) {
    const coarse = ['country', 'administrative_area_level_1'];
    return !(result.types || []).some((type) => coarse.includes(type));
  }

  async geocodeOrg(org, query) {
    const primary = await this.geocodeWithRetry({ address: query });
    primary.results = primary.results.filter((result) => this.isPreciseResult(result));
    const inState = primary.results.find((result) => this.resultMatchesState(result, org));
    if (inState) return { status: 'OK', coords: this.resultCoords(inState) };

    if (primary.status !== 'OK' && primary.status !== 'ZERO_RESULTS') {
      return { status: primary.status, coords: null };
    }

    /* First pass landed outside the org's state (or found nothing) – retry restricted to that state. */
    if (org.stateCode || org.state) {
      const restricted = await this.geocodeWithRetry({
        address: this.addressOneLine(org.addr),
        componentRestrictions: { administrativeArea: org.stateCode || org.state }
      });
      const precise = restricted.results.filter((result) => this.isPreciseResult(result));
      const restrictedMatch = precise.find((result) => this.resultMatchesState(result, org)) || precise[0];
      if (restrictedMatch) return { status: 'OK', coords: this.resultCoords(restrictedMatch) };
      if (restricted.status !== 'OK' && restricted.status !== 'ZERO_RESULTS') {
        return { status: restricted.status, coords: null };
      }
    }

    return { status: 'ZERO_RESULTS', coords: null };
  }

  wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async geocodeAll() {
    if (!this.geocoder) return;

    const cache = this.readGeoCache();
    const pending = [];
    let fromCache = 0;

    this.orgs.forEach((org) => {
      if (this.hasCoords(org)) return;
      if (!this.addressOneLine(org.addr)) return;

      const query = this.geocodeQuery(org);
      const cached = cache[query];

      if (Array.isArray(cached)) {
        org.lat = cached[0];
        org.lng = cached[1];
        this.ensureMarker(org);
        fromCache += 1;
      } else if (cached !== 0) {
        pending.push({ org, query });
      }
    });

    if (fromCache) this.render();

    for (let i = 0; i < pending.length; i += 1) {
      const { org, query } = pending[i];
      const response = await this.geocodeOrg(org, query);

      if (response.coords) {
        org.lat = response.coords[0];
        org.lng = response.coords[1];
        cache[query] = response.coords;
        this.ensureMarker(org);
        this.refreshMarkerVisibility();
      } else if (response.status === 'ZERO_RESULTS') {
        cache[query] = 0;
      } else if (response.status === 'REQUEST_DENIED') {
        console.warn('[donation-locator] Geocoding request denied – enable the Geocoding API for this Maps key.');
        break;
      }

      if (i % 10 === 9) this.writeGeoCache(cache);
      await this.wait(120);
    }

    this.writeGeoCache(cache);
  }

  hasCoords(org) {
    return org.lat != null && org.lng != null;
  }

  /* ---------- Markers ---------- */

  pinHtml() {
    return `<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 0C6.3 0 0 6.1 0 13.7 0 23.4 14 38 14 38s14-14.6 14-24.3C28 6.1 21.7 0 14 0z"/>
      <circle cx="14" cy="13.6" r="5" fill="#fff"/></svg>`;
  }

  /* Blue pin for orgs with a "Types shown in blue" type (e.g. Mastectomy boutique), pink for everything else. */
  pinVariant(org) {
    const blueTypes = this.blueTagTypes();
    return org.types.some((type) => blueTypes.includes(this.normalize(type))) ? 'blue' : 'pink';
  }

  ensureMarker(org) {
    if (!this.map || !this.hasCoords(org) || this.markers[org.id]) return;

    const pinEl = document.createElement('div');
    pinEl.className = `hc-donation-locator__g-pin hc-donation-locator__g-pin--${this.pinVariant(org)}`;
    pinEl.innerHTML = this.pinHtml();

    let marker;
    const position = { lat: org.lat, lng: org.lng };

    if (google.maps.marker?.AdvancedMarkerElement && this.dataset.mapId) {
      marker = new google.maps.marker.AdvancedMarkerElement({
        map: null,
        position,
        content: pinEl,
        title: org.name
      });
      pinEl.addEventListener('click', (event) => {
        event.stopPropagation();
        this.selectOrg(org.id, true);
      });
    } else {
      marker = new google.maps.Marker({ map: null, position, title: org.name });
      marker.addListener('click', () => this.selectOrg(org.id, true));
    }

    this.markers[org.id] = { marker, el: pinEl };
  }

  setMarkerMap(entry, map) {
    if (entry.marker.setMap) {
      entry.marker.setMap(map);
    } else {
      entry.marker.map = map;
    }
  }

  refreshMarkerVisibility() {
    const visible = this.visibleIds || new Set();

    Object.entries(this.markers).forEach(([id, entry]) => {
      const orgId = parseInt(id, 10);
      entry.el?.classList.toggle('is-active', orgId === this.activeId);
      this.setMarkerMap(entry, visible.has(orgId) ? this.map : null);
    });
  }

  updateVisibleMarkers(list, fitCoords) {
    this.visibleIds = new Set(list.map((org) => org.id));
    this.refreshMarkerVisibility();

    if (this.map && fitCoords.length) {
      this.lastFitCoords = fitCoords;
      this.fitTo(fitCoords);
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

  /* ---------- Filtering ---------- */

  typeFilters() {
    return Array.from(this.querySelectorAll('[data-filter-type]:checked')).map((input) => this.normalize(input.value));
  }

  orgMatchesTypes(org, wanted) {
    if (!wanted.length) return true;
    return org.types.some((type) => wanted.includes(this.normalize(type)));
  }

  findStateMatches(query) {
    const q = this.normalize(query);
    if (!q) return null;

    const exact = this.orgs.filter(
      (org) => this.normalize(org.stateCode) === q || this.normalize(org.state) === q
    );
    if (exact.length) return exact;

    if (q.length < 2) return [];

    return this.orgs.filter((org) => this.normalize(org.state).startsWith(q));
  }

  stateLabel(matches, query) {
    const names = Array.from(new Set(matches.map((org) => org.state).filter(Boolean)));
    return names.length === 1 ? names[0] : query;
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

  sortByName(list) {
    return list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }

  /* ---------- Rendering ---------- */

  directionsUrl(org) {
    const address = this.addressOneLine(org.addr);
    const destination = address || (this.hasCoords(org) ? `${org.lat},${org.lng}` : '');
    if (!destination) return '';
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  }

  contactHtml(contact) {
    const value = String(contact).trim();
    const safe = this.escapeHtml(value);

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return `<a href="mailto:${safe}">${safe}</a>`;
    }

    if (/^https?:\/\//i.test(value) || /^www\./i.test(value)) {
      const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      return `<a href="${this.escapeHtml(href)}" target="_blank" rel="noopener">${safe}</a>`;
    }

    const digits = value.replace(/[^\d+]/g, '');
    if (digits.replace(/\D/g, '').length >= 7 && /^[\d\s()+.\-extEXT]+$/.test(value)) {
      return `<a href="tel:${this.escapeHtml(digits)}">${safe}</a>`;
    }

    return `<span>${safe}</span>`;
  }

  blueTagTypes() {
    if (!this._blueTagTypes) {
      this._blueTagTypes = String(this.dataset.blueTagTypes || '')
        .split(',')
        .map((type) => this.normalize(type))
        .filter(Boolean);
    }
    return this._blueTagTypes;
  }

  typeTagsHtml(org) {
    const wanted = this.typeFilters();

    return org.types
      .map((type) => {
        const matched = wanted.includes(this.normalize(type)) ? ' is-matched' : '';
        const blue = this.blueTagTypes().includes(this.normalize(type)) ? ' hc-donation-locator__type-tag--blue' : '';
        return `<span class="hc-donation-locator__type-tag${blue}${matched}">${this.escapeHtml(type)}</span>`;
      })
      .join('');
  }

  buildCardHtml(org, index, showDistance) {
    const distanceHtml =
      showDistance && org.d != null
        ? `<div class="hc-donation-locator__distance"><b>${org.d.toFixed(1)}</b>mi</div>`
        : '';
    const typeTags = this.typeTagsHtml(org);
    const directionsUrl = this.directionsUrl(org);
    const stateLine = [org.state, org.stateCode ? `(${org.stateCode})` : ''].filter(Boolean).join(' ');
    const contacts = org.contacts.length
      ? `<div class="hc-donation-locator__contacts">${org.contacts.map((c) => this.contactHtml(c)).join('')}</div>`
      : '';

    return `
      <div class="hc-donation-locator__card" data-id="${org.id}">
        <div class="hc-donation-locator__rail">
          <div class="hc-donation-locator__list-pin"><span>${index + 1}</span></div>
          ${distanceHtml}
        </div>
        <div class="hc-donation-locator__card-body">
          <p class="hc-donation-locator__org-name">${this.escapeHtml(org.name)}</p>
          <div class="hc-donation-locator__card-details">
            <div class="hc-donation-locator__card-info">
              ${org.addr ? `<p class="hc-donation-locator__address">${this.addressHtml(org.addr)}</p>` : ''}
              ${stateLine ? `<p class="hc-donation-locator__state">${this.escapeHtml(stateLine)}</p>` : ''}
              ${contacts}
              ${directionsUrl ? `<div class="hc-donation-locator__meta-row">
                <a href="${directionsUrl}" target="_blank" rel="noopener">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                  ${this.escapeHtml(this.dataset.directionsLabel || 'Directions')}
                </a>
              </div>` : ''}
            </div>
            ${typeTags ? `<div class="hc-donation-locator__card-tags">${typeTags}</div>` : ''}
          </div>
        </div>
      </div>`;
  }

  renderList(list, showDistance) {
    const listEl = this.querySelector('[data-results-list]');
    if (!listEl) return;

    listEl.innerHTML = list.map((org, index) => this.buildCardHtml(org, index, showDistance)).join('');

    listEl.querySelectorAll('.hc-donation-locator__card').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        this.selectOrg(parseInt(card.dataset.id, 10), true);
      });
    });
  }

  renderEmpty(title, text) {
    const listEl = this.querySelector('[data-results-list]');
    if (!listEl) return;
    listEl.innerHTML = `<div class="hc-donation-locator__empty"><h3>${this.escapeHtml(title)}</h3>${
      text ? `<p>${this.escapeHtml(text)}</p>` : ''
    }</div>`;
  }

  countLabel(count) {
    return `<b>${count}</b> organization${count === 1 ? '' : 's'}`;
  }

  coordsOf(list) {
    return list.filter((org) => this.hasCoords(org)).map((org) => ({ lat: org.lat, lng: org.lng }));
  }

  async render() {
    const renderId = (this._renderId = (this._renderId || 0) + 1);
    const query = this.querySelector('[data-state-input]')?.value.trim() || '';
    const maxDist = parseInt(this.querySelector('[data-distance-select]')?.value || '0', 10);
    const limit = parseInt(this.querySelector('[data-count-select]')?.value || '0', 10);
    const wanted = this.typeFilters();
    const head = this.querySelector('[data-results-head]');

    if (!this.orgs.length) return;

    this.activeId = null;
    this.updateClearSelectionButton();
    this.infoWindow?.close();

    const noResultsTitle = this.dataset.noResultsTitle || 'No organizations found';
    const noResultsText = this.dataset.noResultsText || 'Try another state or clearing a filter.';

    /* Near me: sort by distance from the visitor */
    if (this.myLocation && query === this.myLocationLabel()) {
      const origin = this.myLocation;
      const pendingCoords = this.orgs.some((org) => org.addr && !this.hasCoords(org));

      if (pendingCoords && this.geocodePromise) {
        if (head) head.textContent = this.dataset.locatingText || 'Locating organizations…';
        await this.geocodePromise;
        if (renderId !== this._renderId) return;
      }

      let list = this.orgs
        .filter((org) => this.orgMatchesTypes(org, wanted) && this.hasCoords(org))
        .map((org) => ({ ...org, d: this.haversine(origin[0], origin[1], org.lat, org.lng) }))
        .sort((a, b) => a.d - b.d);

      if (maxDist > 0) list = list.filter((org) => org.d <= maxDist);
      if (limit > 0) list = list.slice(0, limit);

      const within = maxDist > 0 ? ` within ${maxDist} mi` : '';
      if (head) head.innerHTML = `${this.countLabel(list.length)} found near <b>you</b>${within}`;

      const originCoord = { lat: origin[0], lng: origin[1] };

      if (!list.length) {
        this.renderEmpty(noResultsTitle, noResultsText);
        this.updateVisibleMarkers([], [originCoord]);
        return;
      }

      this.renderList(list, true);
      this.updateVisibleMarkers(list, [originCoord, ...this.coordsOf(list)]);
      return;
    }

    /* State search or show all */
    let base = this.orgs;
    let stateText = '';

    if (query) {
      const matches = this.findStateMatches(query);

      if (!matches || !matches.length) {
        if (head) head.innerHTML = `${this.countLabel(0)} found for <b>${this.escapeHtml(query)}</b>`;
        this.renderEmpty(
          this.dataset.invalidSearchTitle || 'State not found',
          this.dataset.invalidSearchText || 'Enter a state name or state code and search again.'
        );
        this.updateVisibleMarkers([], []);
        return;
      }

      base = matches;
      stateText = this.stateLabel(matches, query);
    }

    let list = this.sortByName(base.filter((org) => this.orgMatchesTypes(org, wanted)));
    if (limit > 0) list = list.slice(0, limit);

    if (head) {
      head.innerHTML = stateText
        ? `${this.countLabel(list.length)} in <b>${this.escapeHtml(stateText)}</b>`
        : `${this.countLabel(list.length)} available`;
    }

    if (!list.length) {
      this.renderEmpty(noResultsTitle, noResultsText);
      this.updateVisibleMarkers([], []);
      return;
    }

    this.renderList(list, false);
    this.updateVisibleMarkers(list, this.coordsOf(list));
  }

  /* ---------- Selection ---------- */

  updateClearSelectionButton() {
    const btn = this.querySelector('[data-clear-selection]');
    if (!btn) return;
    btn.hidden = this.activeId == null;
  }

  clearSelection() {
    if (this.activeId == null) return;

    this.activeId = null;
    this.updateClearSelectionButton();

    this.querySelectorAll('.hc-donation-locator__card').forEach((card) => card.classList.remove('is-active'));
    Object.values(this.markers).forEach((entry) => {
      entry.el?.classList.remove('is-active');
      if (entry.marker.zIndex !== undefined) entry.marker.zIndex = 1;
    });

    this.infoWindow?.close();

    if (this.map) {
      if (this.lastFitCoords.length) {
        this.fitTo(this.lastFitCoords);
      } else {
        this.map.panTo({
          lat: parseFloat(this.dataset.defaultLat || '39'),
          lng: parseFloat(this.dataset.defaultLng || '-95')
        });
        this.map.setZoom(parseInt(this.dataset.defaultZoom || '4', 10));
      }
    }
  }

  selectOrg(id, fly) {
    this.activeId = id;

    this.querySelectorAll('.hc-donation-locator__card').forEach((card) => {
      card.classList.toggle('is-active', parseInt(card.dataset.id, 10) === id);
    });

    Object.entries(this.markers).forEach(([markerId, entry]) => {
      const isActive = parseInt(markerId, 10) === id;
      entry.el?.classList.toggle('is-active', isActive);
      if (entry.marker.zIndex !== undefined) entry.marker.zIndex = isActive ? 1000 : 1;
    });

    const org = this.orgs.find((entry) => entry.id === id);

    if (org && fly && this.map && this.hasCoords(org)) {
      this.map.panTo({ lat: org.lat, lng: org.lng });
      if (this.map.getZoom() < 10) this.map.setZoom(11);
      this.openInfo(org);
    }

    const card = this.querySelector(`.hc-donation-locator__card[data-id="${id}"]`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    this.updateClearSelectionButton();
  }

  openInfo(org) {
    const entry = this.markers[org.id];
    if (!this.infoWindow || !this.map || !entry?.marker) return;

    const contacts = org.contacts
      .map((contact) => `<div style="font-size:12.5px;line-height:1.45">${this.contactHtml(contact)}</div>`)
      .join('');

    this.infoWindow.setContent(`
      <div style="font-family:inherit;min-width:180px;max-width:260px">
        <div style="font-weight:600;font-size:14px;margin-bottom:3px">${this.escapeHtml(org.name)}</div>
        <div style="font-size:12.5px;line-height:1.45;opacity:0.75">${this.addressHtml(org.addr)}</div>
        ${org.types.length ? `<div style="font-size:12px;margin-top:5px;font-weight:600">${org.types.map((t) => this.escapeHtml(t)).join(' · ')}</div>` : ''}
        ${contacts ? `<div style="margin-top:6px">${contacts}</div>` : ''}
        <a href="${this.directionsUrl(org)}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;font-size:12.5px;font-weight:600;text-decoration:none">${this.escapeHtml(this.dataset.directionsLabel || 'Get directions')} →</a>
      </div>`);

    this.infoWindow.open({ anchor: entry.marker, map: this.map });
  }

  /* ---------- Geolocation ---------- */

  useMyLocation() {
    if (!navigator.geolocation) {
      window.alert(this.dataset.geoUnavailableText || "Geolocation isn't available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.myLocation = [position.coords.latitude, position.coords.longitude];

        const stateInput = this.querySelector('[data-state-input]');
        if (stateInput) stateInput.value = this.myLocationLabel();

        this.render();
      },
      () => {
        window.alert(this.dataset.geoFailedText || "Couldn't get your location. Search by state instead.");
      }
    );
  }

  showMapError() {
    this.querySelector('[data-map-msg]')?.classList.add('is-visible');
  }
}

if (!customElements.get('hc-donation-locator')) {
  customElements.define('hc-donation-locator', HcDonationLocator);
}
