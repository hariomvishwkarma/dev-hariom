(function () {
  'use strict';
  if (window.__unifiedBundlePdpDefined) return;
  window.__unifiedBundlePdpDefined = true;

  class UnifiedBundlePDPWidget extends HTMLElement {
    connectedCallback() {
      this.sectionId = this.dataset.sectionId;
      this.sectionApiId = this.dataset.sectionApiId;
      this.formId = this.dataset.formId;
      this.sizeIndex = parseInt(this.dataset.sizeIndex, 10);
      this.packIndex = parseInt(this.dataset.packIndex, 10);
      this.sizeOptionName = this.dataset.sizeOptionName;
      this.packOptionName = this.dataset.packOptionName;
      this.valueMode = this.dataset.valueMode || 'percent';
      this.recommendedFreq = this.dataset.recommendedFrequency || '';
      this.recommendedLabel = this.dataset.recommendedLabel || '';
      this.recurringQty = this.dataset.recurringPackQty || '5';
      this.recurringPrice = this.dataset.recurringPackPrice || '299';
      this.stickyBuyLabel = this.dataset.stickyBuyLabel || 'Kjøp';

      this.basePackQty = parseInt(this.dataset.basePackQty, 10);
      if (!Number.isFinite(this.basePackQty) || this.basePackQty <= 0) this.basePackQty = 5;

      // Optional manual override, entered in kroner in the theme editor.
      const baseFull = parseFloat(
        String(this.dataset.basePackFullPrice || '').replace(/\s/g, '').replace(',', '.')
      );
      this.basePackFullPrice = Number.isFinite(baseFull) && baseFull > 0
        ? Math.round(baseFull * 100)
        : 0;

      this.showPackCompare = this.dataset.showPackCompare !== 'false';
      this._readyRetryCount = 0;
      this._readyRetryMax = 20;

      this.copy = this._parseJSON('.abu__copy') || {};
      this.variants = this._parseJSON('.abu__variant-data') || [];
      this.typeProducts = this._parseJSON('.abu__type-products') || [];
      this.freqMap = this._parseJSON('.abu__frequency-map') || [];

      this.sizeInputs = this.querySelectorAll('input[name^="abu-size-"]');
      this.packInputs = this.querySelectorAll('input[name^="abu-pack-"]');
      this.typeCards = this.querySelectorAll('[data-type-card]');

      this.freqWrap = this.querySelector('[data-frequency-wrap]');
      this.freqOptionsWrap = this.querySelector('.abu__frequency-options');
      this.futureEl = this.querySelector('[data-future-deliveries]');
      this.summaryEl = this.querySelector('[data-order-summary]');
      this.stickyEl = document.querySelector(`[data-abu-sticky="${this.id}"]`);

      this._initializeWhenReady();
    }

    _initializeWhenReady() {
      this.form = document.getElementById(this.formId);
      if (!this.form) {
        if (this._readyRetryCount++ < this._readyRetryMax) {
          setTimeout(() => this._initializeWhenReady(), 50);
          return;
        }
        return;
      }

      this.variantOptionsEl =
        document.querySelector(`variant-options[data-section="${this.sectionId}"]`) ||
        document.querySelector('variant-options');

      this.ctaButton = this.form.querySelector('button[type="submit"]');

      // abu_keep is set only by _swapProduct(). It is never re-added by
      // _persistUrlState(), so it disappears from the URL on the first update
      // after a swap and a later refresh behaves like a fresh visit.
      const initialParams = new URLSearchParams(window.location.search);
      this.isCarriedOverState = initialParams.get('abu_keep') === '1';
      this._ensureSellingPlanInput();
      this._initStickyCta();
      this._restoreUrlState();

      this._bind(this.sizeInputs, (e) => this._proxyToSection('size', e.target.value));
      this._bind(this.packInputs, (e) => this._proxyToSection('pack', e.target.value));
      this.typeCards.forEach((card) => {
        card.addEventListener('click', () => this._onTypeCardClick(card));
      });

      this._listenForSectionVariantChange();

      if (this.isCarriedOverState) {
        this._applyCarriedPack();
      } else {
        const urlVariant = initialParams.get('variant');
        if (!urlVariant) this._initBundleDefaultSize();
        if (this.dataset.bundlePackDefault === 'true') {
          this._initBundleDefaultPack();
        } else {
          this._syncBlockRadiosToSectionVariant();
        }
      }

      this._refreshFrequencyOptions();
      this._restoreFrequencyFromUrl();
      this._afterVariantUpdated();
      this._showStickyCta();
    }

    _parseJSON(selector) {
      const el = this.querySelector(selector);
      if (!el) return null;
      try { return JSON.parse(el.textContent); } catch (e) { return null; }
    }

    _bind(list, handler) {
      list.forEach((el) => el.addEventListener('change', handler));
    }

    _selectedEl(namePrefix) {
      return this.querySelector(`input[name^="${namePrefix}-"]:checked`);
    }

    _selected(namePrefix) {
      const el = this._selectedEl(namePrefix);
      return el ? el.value : null;
    }

    _selectedFreqEl() {
      return this.querySelector('input[name^="abu-frequency-"]:checked');
    }

    _selectedFreqId() {
      const el = this._selectedFreqEl();
      return el ? el.value : null;
    }

    _ensureSellingPlanInput() {
      this.sellingPlanInput = this.form.querySelector('input[name="selling_plan"]');
      if (!this.sellingPlanInput) {
        this.sellingPlanInput = document.createElement('input');
        this.sellingPlanInput.type = 'hidden';
        this.sellingPlanInput.name = 'selling_plan';
        this.sellingPlanInput.value = '';
        this.form.appendChild(this.sellingPlanInput);
      }
      this.variantIdInput = this.form.querySelector('input[name="id"]');
    }

    _normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    _proxyToSection(kind, value) {
      if (!this.variantOptionsEl) {
        this._fallbackVariantSelect();
        return;
      }

      const optionName = kind === 'size' ? this.sizeOptionName : this.packOptionName;
      if (!optionName) return;

      const normalizedValue = this._normalize(value);
      const normalizedName = this._normalize(optionName);
      const radios = this.variantOptionsEl.querySelectorAll('input[type="radio"]');
      let target = null;
      radios.forEach((r) => {
        if (this._normalize(r.name) === normalizedName && this._normalize(r.value) === normalizedValue) {
          target = r;
        }
      });

      if (target) {
        // Already reflecting this value (e.g. the server rendered it after a
        // product swap) - don't re-fire events and cause a needless re-render.
        if (target.checked) {
          this._scheduleVariantUpdate();
          return;
        }
        target.checked = true;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
        try { target.click(); } catch (e) { /* noop */ }
      } else {
        this._fallbackVariantSelect();
      }
      this._scheduleVariantUpdate();
    }

    _fallbackVariantSelect() {
      const variant = this._resolveSelectedVariant();
      if (variant && this.variantIdInput) {
        this.variantIdInput.value = variant.id;
        this.variantIdInput.dispatchEvent(new Event('input', { bubbles: true }));
        this.variantIdInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      this._scheduleVariantUpdate();
    }

    _listenForSectionVariantChange() {
      const onSettled = () => {
        // Still restoring a carried-over pack: skip the sync that would
        // overwrite it and wait for the next settle.
        if (this._reconcileCarriedPack()) return;
        this._syncBlockRadiosToSectionVariant();
        this._refreshFrequencyOptions();
        this._afterVariantUpdated();
      };
      this._onVariantSettled = onSettled;

      const debounced = () => {
        clearTimeout(this._variantTimer);
        this._variantTimer = setTimeout(onSettled, 50);
      };
      this._debouncedSettle = debounced;

      if (this.variantOptionsEl) {
        this.variantOptionsEl.addEventListener('change', debounced);
      }

      document.addEventListener('variant:changed', debounced);
      document.addEventListener('variantChangeEnd', debounced);

      if (this.variantIdInput) {
        this._variantObserver = new MutationObserver(debounced);
        this._variantObserver.observe(this.variantIdInput, {
          attributes: true,
          attributeFilter: ['value']
        });
      }
    }

    disconnectedCallback() {
      clearTimeout(this._variantTimer);
      if (this._swapAbort) {
        try { this._swapAbort.abort(); } catch (e) { /* noop */ }
        this._swapAbort = null;
      }
      if (this._debouncedSettle) {
        document.removeEventListener('variant:changed', this._debouncedSettle);
        document.removeEventListener('variantChangeEnd', this._debouncedSettle);
        if (this.variantOptionsEl) {
          this.variantOptionsEl.removeEventListener('change', this._debouncedSettle);
        }
      }
      if (this._variantObserver) {
        this._variantObserver.disconnect();
        this._variantObserver = null;
      }
      this._onVariantSettled = null;
    }

    _scheduleVariantUpdate() {
      clearTimeout(this._variantTimer);
      this._variantTimer = setTimeout(this._onVariantSettled || (() => {}), 80);
    }

    _normalizeSize(value) {
      return this._normalize(value)
        .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-')
        .replace(/\s+/g, '');
    }

    _findSizeInput(sizeValue) {
      if (!sizeValue) return null;
      const wanted = this._normalizeSize(sizeValue);
      let match = null;
      this.sizeInputs.forEach((input) => {
        if (!match && this._normalizeSize(input.value) === wanted) match = input;
      });
      return match;
    }

    // Fresh load only. A ?variant= link and a product swap keep the size
    // the customer already chose.
    _initBundleDefaultSize() {
      if (this.dataset.bundleSizeDefault !== 'true' || this.sizeIndex < 0) return;

      const targetValue = this.dataset.defaultSizeValue || '';
      if (!targetValue) return;

      const variantId = this.variantIdInput && this.variantIdInput.value;
      const currentVariant = variantId
        ? this.variants.find((v) => String(v.id) === String(variantId))
        : null;
      const currentSize = currentVariant ? currentVariant.options[this.sizeIndex] : '';

      if (currentSize && this._normalizeSize(currentSize) === this._normalizeSize(targetValue)) return;

      const target = this._findSizeInput(targetValue);
      if (!target) return;

      target.checked = true;
      this._proxyToSection('size', target.value);
      this._fallbackVariantSelect();
    }

    _parsePackQty(packValue) {
      const normalized = this._normalize(packValue).replace(/par|pack|-/g, '').trim();
      const qty = parseInt(normalized, 10);
      return Number.isFinite(qty) ? qty : 0;
    }

    _packMatchesDefault(packValue, targetQty, targetValue) {
      if (!packValue) return false;
      if (targetValue && this._normalize(packValue) === this._normalize(targetValue)) return true;
      if (targetQty > 0 && this._parsePackQty(packValue) === targetQty) return true;
      return false;
    }

    _findPackInput(packValue) {
      if (!packValue) return null;
      const wanted = this._normalize(packValue);
      const wantedQty = this._parsePackQty(packValue);

      let exact = null;
      let byQty = null;
      this.packInputs.forEach((input) => {
        if (!exact && this._normalize(input.value) === wanted) exact = input;
        if (!byQty && wantedQty > 0 && this._parsePackQty(input.value) === wantedQty) {
          byQty = input;
        }
      });
      return exact || byQty;
    }

    // Straight after a product swap: force the pack the customer was on.
    // The theme re-renders the variant picker asynchronously and would snap the
    // radios back to whatever the server rendered, so the wanted value is kept
    // in _pendingCarriedPack and re-asserted until the variant actually matches.
    _applyCarriedPack() {
      const carried = new URLSearchParams(window.location.search).get('abu_pack');
      const target = this.packIndex >= 0 ? this._findPackInput(carried) : null;

      if (!target) {
        this._pendingCarriedPack = null;
        this._syncBlockRadiosToSectionVariant();
        return;
      }

      this._pendingCarriedPack = target.value;
      this._carriedPackTries = 0;
      this._forcePack(target);
    }

    _forcePack(input) {
      input.checked = true;
      this._proxyToSection('pack', input.value);
      // Belt and braces: write the resolved variant onto the form ourselves in
      // case the theme's radio was already in the "right" state and swallowed
      // the event, leaving the form pointing at another variant.
      this._fallbackVariantSelect();
    }

    _currentVariantPackQty() {
      const id = this.variantIdInput && this.variantIdInput.value;
      if (!id || this.packIndex < 0) return 0;
      const variant = this.variants.find((v) => String(v.id) === String(id));
      if (!variant) return 0;
      return this._parsePackQty((variant.options || [])[this.packIndex]);
    }

    // Returns true while the carried pack is still being reconciled, which tells
    // the settle handler to leave the radios alone for one more round.
    _reconcileCarriedPack() {
      if (!this._pendingCarriedPack) return false;

      const wantQty = this._parsePackQty(this._pendingCarriedPack);
      if (wantQty > 0 && this._currentVariantPackQty() === wantQty) {
        this._pendingCarriedPack = null;
        return false;
      }

      if ((this._carriedPackTries || 0) >= 3) {
        this._pendingCarriedPack = null;
        return false;
      }

      const target = this._findPackInput(this._pendingCarriedPack);
      if (!target) {
        this._pendingCarriedPack = null;
        return false;
      }

      this._carriedPackTries = (this._carriedPackTries || 0) + 1;
      this._forcePack(target);
      return true;
    }

    _initBundleDefaultPack() {
      if (this.dataset.bundlePackDefault !== 'true' || this.packIndex < 0) {
        this._syncBlockRadiosToSectionVariant();
        return;
      }

      const targetQty = parseInt(this.dataset.defaultPackQty, 10) || 0;
      const targetValue = this.dataset.defaultPackValue || '';
      const variantId = this.variantIdInput && this.variantIdInput.value;
      const currentVariant = variantId
        ? this.variants.find((v) => String(v.id) === String(variantId))
        : null;
      const currentPackValue = currentVariant ? currentVariant.options[this.packIndex] : '';

      if (this._packMatchesDefault(currentPackValue, targetQty, targetValue)) {
        this._syncBlockRadiosToSectionVariant();
        return;
      }

      let target = null;
      this.packInputs.forEach((input) => {
        if (this._packMatchesDefault(input.value, targetQty, targetValue)) target = input;
      });

      if (!target) {
        this._syncBlockRadiosToSectionVariant();
        return;
      }

      target.checked = true;
      this._proxyToSection('pack', target.value);
    }

    _syncBlockRadiosToSectionVariant() {
      const id = this.variantIdInput && this.variantIdInput.value;
      if (!id) return;
      const variant = this.variants.find((v) => String(v.id) === String(id));
      if (!variant) return;

      const setChecked = (inputs, value) => {
        const nv = this._normalize(value);
        inputs.forEach((el) => { el.checked = this._normalize(el.value) === nv; });
      };
      if (this.sizeIndex >= 0) setChecked(this.sizeInputs, variant.options[this.sizeIndex]);
      if (this.packIndex >= 0) setChecked(this.packInputs, variant.options[this.packIndex]);
    }

    _isRecommendedPlan(planId, displayName, rawName) {
      const clean = (v) => this._normalize(v).replace(/^#/, '').trim();
      const rec = clean(this.recommendedFreq);
      if (!rec) return false;
      return (
        rec === clean(planId) ||
        rec === clean(displayName) ||
        rec === clean(rawName)
      );
    }

    // Returns the frequency options to render, already filtered and ordered.
    // When the theme setting lists selling plan IDs we follow that list exactly;
    // anything not in it is dropped, which is what keeps the second Loop
    // selling plan group off this template.
    _buildFrequencyList(allocations) {
      const allocs = allocations || [];

      if (this.freqMap && this.freqMap.length) {
        const list = [];
        this.freqMap.forEach((entry) => {
          if (!entry || !entry.id) return;
          const alloc = allocs.find(
            (a) => String(a.selling_plan_id) === String(entry.id)
          );
          if (!alloc) return; // plan not sold on this variant
          const rawName = (alloc.selling_plan_raw_name || alloc.selling_plan_name || '').trim();
          list.push({
            id: alloc.selling_plan_id,
            label: (entry.label || '').trim() || (alloc.selling_plan_name || '').trim() || rawName,
            rawName: rawName
          });
        });
        return list;
      }

      const seen = new Set();
      const list = [];
      allocs.forEach((a) => {
        const name = (a.selling_plan_name || '').trim();
        if (seen.has(name)) return;
        seen.add(name);
        list.push({
          id: a.selling_plan_id,
          label: name,
          rawName: (a.selling_plan_raw_name || name).trim()
        });
      });
      return list;
    }

    _refreshFrequencyOptions() {
      if (!this.freqOptionsWrap) return;

      let variant = null;
      if (this.variantIdInput && this.variantIdInput.value) {
        variant = this.variants.find((v) => String(v.id) === String(this.variantIdInput.value));
      }
      if (!variant) variant = this._resolveSelectedVariant();
      if (!variant) return;

      const options = this._buildFrequencyList(variant.selling_plan_allocations);
      const prevPlanId = this._selectedFreqId();
      const freqName = `abu-frequency-${this.sectionId}-${this.id}`;

      this.freqOptionsWrap.innerHTML = '';

      let checkedOne = false;
      options.forEach((opt, i) => {
        const inputId = `${freqName}-${i}`;
        const isRec = this._isRecommendedPlan(opt.id, opt.label, opt.rawName);
        const wasChosen = String(opt.id) === String(prevPlanId);
        const shouldCheck = wasChosen || (!checkedOne && isRec);

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = freqName;
        input.id = inputId;
        input.value = String(opt.id);
        input.dataset.planName = opt.label;
        input.dataset.planRawName = opt.rawName;
        input.className = 'abu__radio';
        if (shouldCheck) { input.checked = true; checkedOne = true; }
        input.addEventListener('change', () => this._afterVariantUpdated());

        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.className = 'abu__pill';
        label.textContent = opt.label;

        if (isRec && this.recommendedLabel) {
          const badge = document.createElement('span');
          badge.className = 'abu__pill-pop';
          badge.textContent = this.recommendedLabel;
          label.insertBefore(badge, label.firstChild);
        }

        this.freqOptionsWrap.appendChild(input);
        this.freqOptionsWrap.appendChild(label);
      });

      if (!checkedOne) {
        const first = this.freqOptionsWrap.querySelector('input[type="radio"]');
        if (first) first.checked = true;
      }
    }

    _optionMatches(variantValue, selectedValue) {
      return this._normalize(variantValue) === this._normalize(selectedValue);
    }

    _resolveSelectedVariant() {
      const size = this._selectedEl('abu-size') ? this._selectedEl('abu-size').value : null;
      const pack = this._selectedEl('abu-pack') ? this._selectedEl('abu-pack').value : null;
      return this.variants.find((v) => {
        const opts = v.options || [];
        const mSize = this.sizeIndex < 0 || this._optionMatches(opts[this.sizeIndex], size);
        const mPack = this.packIndex < 0 || this._optionMatches(opts[this.packIndex], pack);
        return mSize && mPack;
      }) || null;
    }

    _findAllocation(variant, sellingPlanId) {
      if (!variant || !sellingPlanId) return null;
      return (variant.selling_plan_allocations || [])
        .find((a) => String(a.selling_plan_id) === String(sellingPlanId)) || null;
    }

    // Safe fallback when no frequency is selected yet: the first allocation
    // that the allowlist actually permits, never just allocations[0].
    _firstAllowedAllocation(variant) {
      if (!variant) return null;
      const list = this._buildFrequencyList(variant.selling_plan_allocations);
      if (!list.length) return null;
      return this._findAllocation(variant, list[0].id);
    }

    _getPackCopy(slot) {
      const packs = (this.copy && this.copy.packs) || {};
      return packs[String(slot)] || {};
    }

    _formatValueLabel(price, compareRef, packQty) {
      const saved = compareRef - price;
      if (saved <= 0 || compareRef <= 0) return '';
      const percent = Math.round((saved / compareRef) * 100);
      const savedNOK = Math.round(saved / 100);
      const perPair = Math.round((price / 100) / Math.max(packQty, 1));
      const template = (this.copy.value_modes || {})[this.valueMode] || 'Spar __PERCENT__%';
      return template
        .replace('__PERCENT__', percent)
        .replace('__SAVED__', savedNOK.toLocaleString('nb-NO'))
        .replace('__PER_PAIR__', perPair);
    }

    // What a variant actually costs the customer right now: its price under the
    // selected selling plan, falling back to the plain variant price.
    _variantSellingPrice(variant, planId) {
      if (!variant) return 0;
      const alloc = this._findAllocation(variant, planId)
        || this._firstAllowedAllocation(variant);
      if (alloc && alloc.price) return alloc.price;
      return variant.price || 0;
    }

    // The base pack variant (5 par by default) for the size currently selected.
    _findBasePackVariant(refSize) {
      if (this.packIndex < 0) return null;
      return this.variants.find((v) => {
        const opts = v.options || [];
        if (this._parsePackQty(opts[this.packIndex]) !== this.basePackQty) return false;
        if (this.sizeIndex < 0 || !refSize) return true;
        return this._optionMatches(opts[this.sizeIndex], refSize);
      }) || null;
    }

    // Anchor a pack card against the base pack's own price, scaled by how many
    // base packs it holds: 10 par -> 5 par price x 2, 15 par -> x 3. That is
    // what "buying 5 par at a time" would have cost, so the difference is the
    // bulk saving. Returns 0 when no sensible anchor exists.
    _getAnchorPrice(refSize, packQty, planId) {
      const qty = parseInt(packQty, 10);
      if (!Number.isFinite(qty) || qty <= 0) return 0;

      let basePrice = this.basePackFullPrice;
      if (!basePrice) {
        const baseVariant = this._findBasePackVariant(refSize);
        basePrice = this._variantSellingPrice(baseVariant, planId);
      }
      if (!basePrice) return 0;

      const multiplier = qty / this.basePackQty;
      if (!Number.isFinite(multiplier) || multiplier <= 0) return 0;

      return Math.round(basePrice * multiplier);
    }

    _getOriginalComparePrice(variant, displayPrice) {
      if (!variant) return 0;
      const compareAt = variant.compare_at_price || 0;
      const oneTime = variant.price || 0;
      const original = compareAt > oneTime ? compareAt : oneTime;
      return original > displayPrice ? original : 0;
    }

    _formatNOK(cents) {
      return Math.round(cents / 100).toLocaleString('nb-NO') + ' kr';
    }

    // bundle-product-1 is subscription-only: there is no one-time option.
    // Kept as a method so the price/summary helpers stay readable and so a
    // one-time mode could be reintroduced from a single place if ever needed.
    _isSubscription() {
      return true;
    }

    _getSelectedTypeLabel() {
      const active = this.querySelector('[data-type-card].is-selected');
      return active ? (active.dataset.typeLabel || '') : '';
    }

    _afterVariantUpdated() {
      const isSub = this._isSubscription();
      const planId = this._selectedFreqId();

      let selectedVariant = null;
      if (this.variantIdInput && this.variantIdInput.value) {
        selectedVariant = this.variants.find(
          (v) => String(v.id) === String(this.variantIdInput.value)
        );
      }
      if (!selectedVariant) selectedVariant = this._resolveSelectedVariant();

      const refSize = selectedVariant ? selectedVariant.options[this.sizeIndex] : null;

      this.packInputs.forEach((input) => {
        const cardPackVal = input.value;
        const cardPackQty = parseInt(input.dataset.packQuantity, 10) || 1;
        const variant = this.variants.find((v) => {
          const opts = v.options || [];
          const mSize = this.sizeIndex < 0 || this._optionMatches(opts[this.sizeIndex], refSize);
          const mPack = this.packIndex < 0 || this._optionMatches(opts[this.packIndex], cardPackVal);
          return mSize && mPack;
        });

        const card = this.querySelector(`label[for="${input.id}"]`);
        if (!card) return;

        const priceEl = card.querySelector('[data-pack-price]');
        const saveEl = card.querySelector('[data-pack-save]');

        if (!variant) {
          if (priceEl) priceEl.textContent = '—';
          if (saveEl) saveEl.textContent = '';
          card.classList.add('abu__pcard--unavailable');
          return;
        }
        card.classList.remove('abu__pcard--unavailable');

        const imgEl = card.querySelector('[data-pack-image]');
        const mediaEl = card.querySelector('[data-pack-media]');
        if (imgEl && mediaEl) {
          if (variant.image) {
            imgEl.src = variant.image;
            imgEl.srcset = `${variant.image} 240w`;
            imgEl.sizes = '120px';
            imgEl.alt = variant.image_alt || '';
            mediaEl.hidden = false;
          } else {
            imgEl.removeAttribute('src');
            imgEl.removeAttribute('srcset');
            mediaEl.hidden = true;
          }
        }

        let displayPrice;
        if (isSub) {
          const alloc = this._findAllocation(variant, planId)
            || this._firstAllowedAllocation(variant)
            || null;
          displayPrice = alloc ? alloc.price : variant.price;
        } else {
          displayPrice = variant.price;
        }

        // Preferred anchor: base pack full price x multiplier. If that cannot be
        // worked out (no base pack variant, missing prices) fall back to the old
        // per-variant compare-at behaviour so a card is never left blank.
        let anchorPrice = this._getAnchorPrice(refSize, cardPackQty, planId);
        if (anchorPrice <= displayPrice) {
          anchorPrice = this._getOriginalComparePrice(variant, displayPrice);
        }

        if (priceEl) priceEl.textContent = this._formatNOK(displayPrice);

        const compareEl = card.querySelector('[data-pack-compare]');
        if (compareEl) {
          const showCompare = this.showPackCompare && anchorPrice > displayPrice;
          compareEl.textContent = showCompare ? this._formatNOK(anchorPrice) : '';
          compareEl.hidden = !showCompare;
        }

        if (saveEl) {
          const packSlot = input.dataset.packSlot;
          const pack = this._getPackCopy(packSlot);
          const custom = (pack.value_subscription || '').trim();
          const ref = anchorPrice || variant.price;
          const text = custom || this._formatValueLabel(displayPrice, ref, cardPackQty);
          saveEl.textContent = text || '\u00a0';
        }
      });

      if (isSub && planId && selectedVariant) {
        const alloc = this._findAllocation(selectedVariant, planId);
        this.sellingPlanInput.value = alloc ? String(planId) : '';
      } else {
        this.sellingPlanInput.value = '';
      }

      this._updateCTA(selectedVariant, isSub, planId);
      this._updateOrderSummary(selectedVariant, isSub, planId);
      this._updateStickyCta(selectedVariant, isSub, planId);
      this._persistUrlState();
    }

    _updateCTA(variant, isSub, planId) {
      if (!this.ctaButton) return;
      let price = 0;
      if (variant) {
        if (isSub) {
          const alloc = this._findAllocation(variant, planId)
            || this._firstAllowedAllocation(variant);
          price = alloc ? alloc.price : variant.price;
        } else {
          price = variant.price;
        }
      }

      const labelSpan = this.ctaButton.querySelector('span:not([data-abu-cta-price])');
      if (labelSpan && !this.ctaButton.disabled) {
        labelSpan.textContent = (this.copy && this.copy.cta_label) || 'Legg i handlekurv';
      }

      let priceSpan = this.ctaButton.querySelector('[data-abu-cta-price]');
      if (!priceSpan) {
        priceSpan = document.createElement('span');
        priceSpan.setAttribute('data-abu-cta-price', '');
        this.ctaButton.appendChild(priceSpan);
      }
      const tpl = (this.copy && this.copy.cta_suffix_template) || ' – __PRICE__';
      priceSpan.textContent = variant ? tpl.replace('__PRICE__', this._formatNOK(price)) : '';
    }

    _updateOrderSummary(variant, isSub, planId) {
      if (!this.summaryEl) return;

      const todayEl = this.summaryEl.querySelector('[data-summary-today]');
      const refillEl = this.summaryEl.querySelector('[data-summary-refill]');
      const totalEl = this.summaryEl.querySelector('[data-summary-total]');
      const refillRow = this.summaryEl.querySelector('[data-summary-refill-row]');

      if (!variant) return;

      const packVal = variant.options[this.packIndex] || '';
      const typeLabel = this._getSelectedTypeLabel();
      if (todayEl) todayEl.textContent = `${packVal} ${typeLabel}`.trim();

      if (refillRow) refillRow.hidden = !isSub;
      if (isSub && refillEl) {
        const freqEl = this._selectedFreqEl();
        const planName = freqEl ? (freqEl.dataset.planName || '') : '';
        refillEl.textContent = `${this.recurringQty} par · ${this.recurringPrice} kr ${planName}`.trim();
      }

      let price = 0;
      if (isSub) {
        const alloc = this._findAllocation(variant, planId)
          || this._firstAllowedAllocation(variant);
        price = alloc ? alloc.price : variant.price;
      } else {
        price = variant.price;
      }
      if (totalEl) totalEl.textContent = this._formatNOK(price);
    }

    _initStickyCta() {
      if (!this.stickyEl || !this.ctaButton) return;
      const btn = this.stickyEl.querySelector('[data-abu-sticky-btn]');
      if (btn) {
        btn.textContent = this.stickyBuyLabel;
        btn.addEventListener('click', () => {
          this.ctaButton.click();
        });
      }
    }

    _showStickyCta() {
      if (!this.stickyEl) return;
      this.stickyEl.removeAttribute('aria-hidden');
    }

    _updateStickyCta(variant, isSub, planId) {
      if (!this.stickyEl || !variant) return;

      const priceEl = this.stickyEl.querySelector('[data-abu-sticky-price]');
      const subEl = this.stickyEl.querySelector('[data-abu-sticky-sub]');

      let price = 0;
      if (isSub) {
        const alloc = this._findAllocation(variant, planId)
          || this._firstAllowedAllocation(variant);
        price = alloc ? alloc.price : variant.price;
      } else {
        price = variant.price;
      }

      if (priceEl) priceEl.textContent = this._formatNOK(price);

      if (subEl) {
        const packVal = variant.options[this.packIndex] || '';
        if (isSub) {
          subEl.textContent = `${packVal} · deretter ${this.recurringQty} par / ${this.recurringPrice}`;
          subEl.hidden = false;
        } else {
          subEl.textContent = packVal;
          subEl.hidden = false;
        }
      }
    }

    _getStateParams() {
      const size = this._selected('abu-size');
      const pack = this._selected('abu-pack');
      const freq = this._selectedFreqId();
      const params = new URLSearchParams();
      if (size) params.set('abu_size', size);
      if (pack) params.set('abu_pack', pack);
      if (freq) params.set('abu_freq', freq);
      return params;
    }

    _persistUrlState() {
      const params = this._getStateParams();
      const variantId = this.variantIdInput && this.variantIdInput.value;
      if (variantId) params.set('variant', variantId);
      const url = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', url);
    }

    _restoreUrlState() {
      // Only replay the carried-over selections straight after a product swap.
      // On a plain load the server has already rendered the right variant and
      // the configured defaults must win.
      if (!this.isCarriedOverState) return;
      const params = new URLSearchParams(window.location.search);
      const size = params.get('abu_size');
      if (size) {
        const input = Array.from(this.sizeInputs).find((el) => this._normalize(el.value) === this._normalize(size));
        if (input) { input.checked = true; this._proxyToSection('size', input.value); }
      }
      const pack = params.get('abu_pack');
      if (pack) {
        const input = this._findPackInput(pack);
        if (input) { input.checked = true; this._proxyToSection('pack', input.value); }
      }
    }

    _restoreFrequencyFromUrl() {
      if (!this.isCarriedOverState) return;
      const params = new URLSearchParams(window.location.search);
      const freq = params.get('abu_freq');
      const freqName = params.get('abu_freq_name');
      if (!freq && !freqName) return;

      let input = freq
        ? this.querySelector(`input[name^="abu-frequency-"][value="${freq}"]`)
        : null;

      if (!input && freqName) {
        const wanted = this._normalize(freqName);
        input = Array.from(this.querySelectorAll('input[name^="abu-frequency-"]')).find(
          (el) => this._normalize(el.dataset.planName) === wanted
        ) || null;
      }

      if (input) input.checked = true;
    }

    _setSwapping(on) {
      this.classList.toggle('abu--swapping', !!on);
      if (on) {
        this.setAttribute('aria-busy', 'true');
      } else {
        this.removeAttribute('aria-busy');
      }
    }

    _markTypeCardSelected(card) {
      this.typeCards.forEach((c) => {
        const on = c === card;
        c.classList.toggle('is-selected', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    _buildSwapParams(typeProduct) {
      const params = this._getStateParams();
      params.delete('variant');

      const freqEl = this._selectedFreqEl();
      if (freqEl && freqEl.dataset.planName) {
        params.set('abu_freq_name', freqEl.dataset.planName);
      }

      const size = params.get('abu_size');
      const pack = params.get('abu_pack');
      const variants = typeProduct.variants || [];
      const wantPackQty = this._parsePackQty(pack);

      const sizeOf = (v) => (v.options || [])[this.sizeIndex];
      const packOf = (v) => (v.options || [])[this.packIndex];

      const sizeOk = (v) =>
        !size || this.sizeIndex < 0 || this._optionMatches(sizeOf(v), size);

      // Exact spelling first, then fall back to comparing the parsed quantity so
      // "10 par" still matches "10" on a product that labels its options
      // differently.
      const packOk = (v) => {
        if (!pack || this.packIndex < 0) return true;
        if (this._optionMatches(packOf(v), pack)) return true;
        return wantPackQty > 0 && this._parsePackQty(packOf(v)) === wantPackQty;
      };

      // Progressively looser: keep both -> keep the pack -> keep the size ->
      // anything in stock. Losing the pack silently was what sent every swap
      // back to 5 par.
      const matched =
        variants.find((v) => v.available && sizeOk(v) && packOk(v)) ||
        variants.find((v) => v.available && packOk(v)) ||
        variants.find((v) => v.available && sizeOk(v)) ||
        variants.find((v) => v.available) ||
        null;

      if (matched) params.set('variant', String(matched.id));

      return params;
    }

    _onTypeCardClick(card) {
      const handle = card.dataset.productHandle;
      if (!handle || card.classList.contains('is-selected')) return;

      const typeProduct = this.typeProducts.find((p) => p.handle === handle);
      if (!typeProduct) return;

      this._markTypeCardSelected(card);
      this._swapProduct(typeProduct);
    }

    async _swapProduct(typeProduct) {
      if (this._swapAbort) {
        try { this._swapAbort.abort(); } catch (e) { /* noop */ }
      }

      const params = this._buildSwapParams(typeProduct);
      params.set('abu_keep', '1');
      const publicUrl = `${typeProduct.url}?${params.toString()}`;

      const sectionParams = new URLSearchParams(params.toString());
      sectionParams.set('section_id', this.sectionApiId || this.sectionId);
      const sectionUrl = `${typeProduct.url}?${sectionParams.toString()}`;

      const controller = new AbortController();
      this._swapAbort = controller;
      this._setSwapping(true);

      try {
        const res = await fetch(sectionUrl, {
          signal: controller.signal,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          credentials: 'same-origin'
        });
        if (!res.ok) throw new Error(`Section request failed (${res.status})`);

        const html = await res.text();
        if (controller.signal.aborted) return;

        const wrapperId = `shopify-section-${this.sectionId}`;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const fresh = doc.getElementById(wrapperId);
        const markup = fresh ? fresh.innerHTML : doc.body.innerHTML;

        if (!markup || !markup.trim()) throw new Error('Empty section markup');
        if (markup.indexOf('unified-bundle-pdp-widget') === -1) {
          throw new Error('Bundle block missing on target product template');
        }

        const container = document.getElementById(wrapperId);
        if (!container) throw new Error('Section container not found');

        window.history.replaceState({}, '', publicUrl);

        this._swapAbort = null;
        // Replacing innerHTML disconnects this element; the fresh widget
        // re-initialises itself and rebuilds state from the URL params above.
        container.innerHTML = markup;

        document.dispatchEvent(
          new CustomEvent('abu:product-swapped', {
            bubbles: true,
            detail: { handle: typeProduct.handle, url: publicUrl }
          })
        );
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        this._swapAbort = null;
        this._setSwapping(false);
        console.warn('[abu] In-place product swap failed, falling back to navigation.', err);
        window.location.assign(publicUrl);
      }
    }

  }

  if (!customElements.get('unified-bundle-pdp-widget')) {
    customElements.define('unified-bundle-pdp-widget', UnifiedBundlePDPWidget);
  }
})();