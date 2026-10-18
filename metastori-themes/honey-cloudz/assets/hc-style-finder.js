(() => {
  const root = document.querySelector('[data-hc-sf]');
  if (!root) return;

  const configEl = document.getElementById('hc-sf-config');
  let CONFIG = { colorPriority: [], data: {} };
  if (configEl) {
    try {
      CONFIG = { ...CONFIG, ...JSON.parse(configEl.textContent) };
    } catch (e) {
      console.warn('Style Finder: invalid config JSON', e);
    }
  }

  const DATA = CONFIG.data || {};
  const questionsById = {};
  (DATA.questions || []).forEach((q) => {
    questionsById[q.id] = q;
  });
  const answersByQuestion = {};
  (DATA.answers || []).forEach((a) => {
    if (!answersByQuestion[a.questionId]) answersByQuestion[a.questionId] = [];
    answersByQuestion[a.questionId].push(a);
  });
  Object.keys(answersByQuestion).forEach((key) => {
    answersByQuestion[key].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  });
  const snippets = DATA.snippets || {};
  const uiStrings = DATA.uiStrings || {};

  // Interface copy from the style_finder_ui_string metaobject. The fallback is
  // the shipped default, so a missing or draft entry never blanks the UI.
  // vars fill {placeholders}, e.g. t('result.size_insert', 'Size {size}', { size: 'M' }).
  function t(key, fallback, vars) {
    let out = uiStrings[key];
    if (out === undefined || out === null || out === '') out = fallback;
    if (vars) {
      Object.keys(vars).forEach((name) => {
        out = out.split('{' + name + '}').join(vars[name]);
      });
    }
    return out;
  }
  const outcomesMeta = DATA.outcomes || {};
  const sizeMaps = DATA.sizeMaps || [];

  const OUTCOME_KIND = {
    LITES: 'inserts',
    CLASSICS: 'inserts',
    PLUS: 'inserts',
    PUSH_UPS: 'inserts',
    FORM_TEARDROP_HC800: 'form',
    FORM_OVAL_HC700: 'form',
    GIFT_CARD: 'gift',
    TALK_IT_THROUGH: 'support',
  };

  const productCache = new Map();

  const el = {
    kicker: root.querySelector('[data-kicker]'),
    journey: root.querySelector('[data-journey]'),
    progress: root.querySelector('[data-progress]'),
    title: root.querySelector('[data-title]'),
    help: root.querySelector('[data-help]'),
    note: root.querySelector('[data-note]'),
    options: root.querySelector('[data-options]'),
    extra: root.querySelector('[data-extra]'),
    err: root.querySelector('[data-err]'),
    back: root.querySelector('[data-back]'),
    next: root.querySelector('[data-next]'),
    restart: root.querySelector('[data-restart]'),
    giftEscape: root.querySelector('[data-gift-escape]'),
  };

  // Fallbacks only — the metaobject answers win. Kept in step with the fit
  // chart so the quiz still covers the full range if an import is incomplete.
  const CUP = [
    ['AA', 'AA'], ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'],
    ['DD', 'DD/E'], ['DDD', 'DDD/F'], ['G', 'G'], ['H', 'H'], ['I', 'I'], ['J', 'J'], ['K', 'K'],
  ].map(([id, label]) => ({ id, label }));
  const BAND = ['26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46'].map((v) => ({
    id: v,
    label: v,
  }));

  function getAnswerRows(questionId) {
    return answersByQuestion[questionId] || [];
  }

  const FAMILIES = {
    LITES: { name: 'Oval Lites', kind: 'inserts' },
    CLASSICS: { name: 'Classics', kind: 'inserts' },
    PLUS: { name: 'Plus', kind: 'inserts' },
    PUSH_UPS: { name: 'Push-Ups', kind: 'inserts' },
    FORM_TEARDROP_HC800: { name: 'Teardrop HC800', kind: 'form' },
    FORM_OVAL_HC700: { name: 'Oval HC700', kind: 'form' },
    GIFT_CARD: { name: 'Gift Card', kind: 'gift' },
    TALK_IT_THROUGH: { name: 'Talk it through', kind: 'support' },
  };

  function isGiftVoice() {
    return state.giftMode && state.giftReady;
  }

  function qTitle(questionId) {
    const q = questionsById[questionId];
    if (!q) return '';
    return isGiftVoice() ? q.titleGift || q.titleSelf || '' : q.titleSelf || '';
  }

  function qHelp(questionId) {
    const q = questionsById[questionId];
    if (!q) return '';
    return isGiftVoice() ? q.helpGift || q.helpSelf || '' : q.helpSelf || '';
  }

  function qNote(questionId) {
    const q = questionsById[questionId];
    if (!q) return '';
    return isGiftVoice() ? q.noteGift || q.noteSelf || '' : q.noteSelf || '';
  }

  function answerLabel(questionId, answerId) {
    const a = getAnswerRows(questionId).find((row) => row.id === answerId);
    if (!a) return answerId;
    return isGiftVoice() ? a.labelGift || a.labelSelf || answerId : a.labelSelf || answerId;
  }

  function answerOptionsFor(questionId, handlers) {
    const rows = getAnswerRows(questionId);
    if (!rows.length) return [];
    const options = [];
    rows.forEach((a) => {
      const handler = handlers && (handlers[a.id] || handlers._default);
      if (handlers && !handler) {
        // answer_id has no route in the engine (typo or stray metaobject entry).
        // Skip it so shoppers never see an option that does nothing.
        console.warn('[Style Finder] Unmapped answer_id "' + a.id + '" on ' + questionId);
        return;
      }
      const opt = { id: a.id, label: answerLabel(questionId, a.id) };
      if (handler) opt.onPick = handler;
      options.push(opt);
    });
    return options;
  }

  function cupOptions(questionId, handler) {
    const fromMeta = answerOptionsFor(questionId, { _default: handler });
    if (fromMeta.length) return fromMeta;
    return CUP.map((c) => ({ id: c.id, label: c.label, onPick: handler }));
  }

  function bandOptions(questionId, handler) {
    const fromMeta = answerOptionsFor(questionId, { _default: handler });
    if (fromMeta.length) return fromMeta;
    return BAND.map((b) => ({ id: b.id, label: b.label, onPick: handler }));
  }

  function snippetText(key) {
    return snippets[key] || '';
  }

  function pushSnippets(modules, keys) {
    keys.forEach((key) => {
      const text = snippetText(key);
      if (text) modules.push(text);
    });
  }

  function getFamily(key) {
    const meta = outcomesMeta[key];
    const fallback = FAMILIES[key] || { name: key, kind: 'inserts' };
    return {
      name: (meta && meta.displayName) || fallback.name,
      kind: OUTCOME_KIND[key] || fallback.kind,
    };
  }

  function getOutcomeMeta(key) {
    return outcomesMeta[key] || null;
  }

  const SCREEN_KEYS = {
    g_recipient: ['gift_recipient_context'],
    g_readiness: ['gift_readiness'],
    a_primary: ['A_PRIMARY_NEED'],
    a_asymmetry: ['A_ASYMMETRY_TIER'],
    a_bust: ['A_BUST_PREFERENCE'],
    a_activity: ['A_ACTIVITY_CONTEXT'],
    a_size_band: ['A_SIZE_BAND'],
    a_size: ['A_SIZE'],
    b_surgery: ['B_SURGERY_CONTEXT', 'B_DAY_TO_DAY_NEED'],
    b_recency: ['B_RECENCY'],
    b_need: ['B_DAY_TO_DAY_NEED'],
    b_form_sides: ['form_quantity', 'B_FULL_FORM_SIDES'],
    b_form_priority: ['B_FORM_PRIORITY'],
    b_form_shape: ['B_FORM_SHAPE'],
    b_asymmetry: ['B_ASYMMETRY_TIER', 'single_side_pair', 'stacked', 'secondary_outcome'],
    b_implant: ['B_IMPLANT_TOP_FULLNESS'],
    b_light: ['B_LIGHT_SHAPE_DEPTH'],
    b_size_insert_band: ['B_SIZE_BAND'],
    b_size_insert: ['B_SIZE_INSERT_CUP'],
    b_size_form: ['B_SIZE_BAND'],
    b_size_form_cup: ['B_SIZE_UNILATERAL_CUP', 'B_SIZE_BILATERAL_MEMORY'],
    b_size_pref: ['B_SIZE_PREF'],
    // Nothing is answered on the result screen — the outcome is derived from
    // earlier answers, so leaving it must not erase the recommendation.
    result: [],
    gift_card: ['primary_outcome', 'gift_exit'],
    talk: ['primary_outcome'],
  };

  const state = {
    screen: 'entry',
    history: [],
    answers: {},
    journey: null,
    giftMode: false,
    giftReady: false,
    giftContext: null,
    fromFormExplore: false,
  };

  // Bumped on every render. An async screen compares its captured value and
  // bails out if the shopper has navigated on, so a slow product fetch can
  // never paint into (or wipe) a screen that has already been replaced.
  let renderSeq = 0;

  function setAnswer(key, value) {
    state.answers[key] = value;
  }

  function clearKeys(keys) {
    keys.forEach((k) => {
      delete state.answers[k];
    });
  }

  function clearOutcome() {
    clearKeys(['primary_outcome', 'secondary_outcome', 'stacked', 'route', 'single_side_pair']);
  }

  function clearScreenKeys(screen) {
    const keys = SCREEN_KEYS[screen];
    if (keys) clearKeys(keys);
    // The outcome is never set by a sizing or result screen — it is set by the
    // branch screen above them, and applyOutcome() fully overwrites it whenever
    // that branch is re-answered. Clearing it here left the surgery journeys
    // with no recommendation after Back → re-pick size.
  }

  function go(screen) {
    state.history.push(state.screen);
    state.screen = screen;
    render();
  }

  function back() {
    if (!state.history.length) return;
    clearScreenKeys(state.screen);
    const prev = state.history.pop();
    if (prev === 'entry') resetSession(false);
    state.screen = prev;
    render();
  }

  function resetSession(full) {
    state.answers = {};
    state.journey = null;
    state.giftMode = false;
    state.giftReady = false;
    state.giftContext = null;
    state.fromFormExplore = false;
    if (full) {
      state.history = [];
      state.screen = 'entry';
    }
  }

  function restart() {
    resetSession(true);
    render();
  }

  // Full size ladder, smallest to largest.
  const SIZE_LADDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '1X', '2X', '3X'];

  // One band x cup fit chart for every style — the client confirmed inserts and
  // forms share it (a 34B is a Small in both). Each product's own size range is
  // applied afterwards by nearestCatalogSize(). Do not edit without a new chart.
  const SIZE_CHART_BANDS = ['26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46'];
  const SIZE_CHART = {
    AA: ['XXS', 'XXS', 'XXS', 'XS', 'XS', 'S', 'S', 'M', 'L', 'XL', 'XL'],
    A: ['XXS', 'XXS', 'XS', 'XS', 'S', 'S', 'M', 'L', 'XL', 'XL', '1X'],
    B: ['XXS', 'XS', 'XS', 'S', 'S', 'M', 'L', 'XL', '1X', '1X', '2X'],
    C: ['XS', 'XS', 'S', 'S', 'M', 'L', 'XL', '1X', '1X', '2X', '2X'],
    D: ['XS', 'S', 'S', 'M', 'L', 'XL', '1X', '1X', '2X', '2X', '2X'],
    DD: ['S', 'S', 'M', 'L', 'XL', '1X', '1X', '2X', '2X', '2X', '3X'],
    DDD: ['S', 'M', 'L', 'XL', '1X', '1X', '2X', '2X', '2X', '3X', '3X'],
    G: ['M', 'L', 'XL', '1X', '1X', '2X', '2X', '2X', '3X', '3X', '3X'],
    H: ['L', 'XL', '1X', '1X', '2X', '2X', '2X', '2X', '3X', '3X', '3X'],
    I: ['XL', '1X', '1X', '2X', '2X', '2X', '2X', '3X', '3X', '3X', '3X'],
    J: ['1X', '1X', '2X', '2X', '2X', '2X', '3X', '3X', '3X', '3X', '3X'],
    K: ['1X', '2X', '2X', '2X', '2X', '3X', '3X', '3X', '3X', '3X', '3X'],
  };

  // Used when a shopper somehow reaches a result without a band — mid-range
  // column of the chart, so the recommendation is still sensible.
  const CUP_ONLY_FALLBACK = { AA: 'XS', A: 'S', B: 'S', C: 'M', D: 'L', DD: 'XL', DDD: '1X' };

  // Both inserts and forms size from the same chart. `pref` is the bilateral
  // form question only (same / a little fuller / a little smaller).
  function mapSize(band, cup, pref) {
    const row = SIZE_CHART[norm(cup)];
    const col = SIZE_CHART_BANDS.indexOf(String(band || '').trim());
    let size = row && col >= 0 ? row[col] : null;
    if (!size) size = CUP_ONLY_FALLBACK[norm(cup)] || 'M';
    if (!pref) return size;
    let idx = SIZE_LADDER.indexOf(size);
    if (idx === -1) return size;
    if (pref === 'fuller') idx = Math.min(SIZE_LADDER.length - 1, idx + 1);
    if (pref === 'smaller') idx = Math.max(0, idx - 1);
    return SIZE_LADDER[idx];
  }

  // The chart can name a size a given product doesn't stock (forms start at XS,
  // Push-Ups stop at XL). Step to the closest size that exists rather than
  // dropping to an unrelated one.
  function nearestCatalogSize(product, target) {
    const have = new Set((product.variants || []).map((v) => variantSizeValue(v, product)));
    const wanted = norm(target);
    if (!have.size || have.has(wanted)) return wanted;
    const i = SIZE_LADDER.indexOf(wanted);
    if (i === -1) return wanted;
    for (let step = 1; step < SIZE_LADDER.length; step += 1) {
      const up = SIZE_LADDER[i + step];
      const down = SIZE_LADDER[i - step];
      if (up && have.has(up)) return up;
      if (down && have.has(down)) return down;
    }
    return wanted;
  }

  function getOutcomeHandle(key) {
    const meta = outcomesMeta[key];
    if (meta && meta.handle) return meta.handle;
    return '';
  }

  function findSizeMapMatch(outcomeKey, cup, band, pref) {
    const matches = sizeMaps.filter((row) => row.outcomeKey === outcomeKey);
    if (!matches.length || !cup) return null;
    const bandVal = band || '';
    const prefVal = pref || '';
    return (
      matches.find((row) => row.cup === cup && (row.band || '') === bandVal && (row.pref || '') === prefVal) ||
      matches.find((row) => row.cup === cup && !row.band && !row.pref) ||
      null
    );
  }

  async function resolveVariant(outcomeKey, sizeCode, cup, band, pref) {
    const mapRow = findSizeMapMatch(outcomeKey, cup, band, pref);
    if (mapRow && mapRow.variantId) {
      const handle = mapRow.productHandle || getOutcomeHandle(outcomeKey);
      const product = await fetchProduct(handle);
      const mapped = product?.variants?.find((v) => v.id === mapRow.variantId);
      if (product && mapped) {
        // Every product is Size x Colour, so a mapped row pins the SIZE only.
        // Colour priority and the stock check still run within that size,
        // otherwise the merchant's chosen colour could be sold out.
        const size = variantSizeValue(mapped, product);
        const sameSize = (product.variants || []).filter((v) => variantSizeValue(v, product) === size);
        const inStock = sameSize.filter((v) => v.available);
        const picked = pickVariantByColor(inStock.length ? inStock : sameSize, product);
        return { product, variant: picked || mapped };
      }
    }
    const handle = getOutcomeHandle(outcomeKey);
    const product = await fetchProduct(handle);
    const variant = pickVariant(product, sizeCode);
    return { product, variant };
  }

  async function fetchProduct(handle) {
    if (!handle) return null;
    if (productCache.has(handle)) return productCache.get(handle);
    try {
      const res = await fetch(`/products/${handle}.js`);
      if (!res.ok) return null;
      const data = await res.json();
      productCache.set(handle, data);
      return data;
    } catch {
      return null;
    }
  }

  function norm(val) {
    return (val || '').trim().toUpperCase();
  }

  function variantOptions(variant) {
    return [variant.option1, variant.option2, variant.option3].filter(Boolean);
  }

  function getSizeOptionIndex(product) {
    const opts = product?.options || [];
    const idx = opts.findIndex((opt) => {
      const name = typeof opt === 'string' ? opt : opt?.name;
      return /size/i.test(name || '');
    });
    return idx >= 0 ? idx : 0;
  }


  function variantSizeValue(variant, product) {
    const idx = getSizeOptionIndex(product);
    return norm(variant[`option${idx + 1}`] || '');
  }

  function variantHasSize(variant, sizeLabel, product) {
    return variantSizeValue(variant, product) === norm(sizeLabel);
  }

  function variantColorName(variant, product) {
    const opts = product.options || [];
    const colorIdx = opts.findIndex((opt) => {
      const name = typeof opt === 'string' ? opt : opt?.name;
      return /color|tone|shade/i.test(name || '');
    });
    if (colorIdx >= 0) return variant[`option${colorIdx + 1}`] || '';
    const sizePattern = /^(XXS|XS|S|M|L|XL|1X|2X|3X|A|B|C|D|DD|DDD|\d+)$/i;
    return variantOptions(variant).find((opt) => !sizePattern.test(opt)) || variant.option2 || '';
  }

  function variantMatchesColor(variant, product, color) {
    const name = norm(variantColorName(variant, product));
    const target = norm(color);
    return name === target || name.includes(target);
  }

  function pickVariantByColor(variants, product) {
    const colors = CONFIG.colorPriority || [];
    for (const color of colors) {
      const match = variants.find((v) => variantMatchesColor(v, product, color));
      if (match) return match;
    }
    return variants[0] || null;
  }

  function pickVariant(product, sizeLabel) {
    if (!product) return null;
    const all = product.variants || [];
    if (!sizeLabel) {
      const available = all.filter((v) => v.available);
      return pickVariantByColor(available.length ? available : all, product);
    }

    const target = nearestCatalogSize(product, sizeLabel);
    const sizeMatches = all.filter((v) => variantHasSize(v, target, product));
    if (!sizeMatches.length) {
      return pickVariantByColor(all.filter((v) => v.available).length ? all.filter((v) => v.available) : all, product);
    }

    const availableMatches = sizeMatches.filter((v) => v.available);
    return pickVariantByColor(availableMatches.length ? availableMatches : sizeMatches, product);
  }

  // Use the theme's own money formatter so the quiz matches the PDP and cart
  // drawer, including the shop's currency symbol and separators.
  function formatMoney(cents) {
    const format = window.shopSettings && window.shopSettings.moneyFormat;
    const themeCurrency = window.theme && window.theme.Currency;
    if (themeCurrency && typeof themeCurrency.formatMoney === 'function') {
      return themeCurrency.formatMoney(cents, format);
    }
    if (window.CustomCartUtils && typeof window.CustomCartUtils.formatMoney === 'function') {
      return window.CustomCartUtils.formatMoney(cents, format);
    }
    const iso =
      (window.shopSettings && window.shopSettings.isoCode) ||
      (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) ||
      'USD';
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: iso }).format(cents / 100);
    } catch {
      return (cents / 100).toFixed(2);
    }
  }

  function openSupportChat() {
    const trigger = document.querySelector('[data-footer-open-chat]');
    if (trigger) {
      trigger.click();
      return;
    }
    if (window.GorgiasChat && typeof window.GorgiasChat.open === 'function') {
      window.GorgiasChat.open();
    }
  }

  async function addToCart(variantId, qty) {
    const miniCart = document.querySelector('mini-cart');
    const utils = window.CustomCartUtils;
    const sectionsToRender = utils?.isEnabled?.()
      ? utils.getDrawerSectionsToRender()
      : miniCart?.getSectionsToRender?.() || [];
    const sections = sectionsToRender.map((section) => section.section || section.id);
    const cartUrl = window.routes?.cart_add_url
      || (window.Shopify?.routes?.root ? `${window.Shopify.routes.root}cart/add.js` : '/cart/add.js');

    const res = await fetch(cartUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        items: [{ id: variantId, quantity: qty }],
        sections,
        sections_url: `${window.location.pathname}${window.location.search}`,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.status) {
      throw new Error(data.description || data.message || 'Could not add to cart');
    }

    if (miniCart?.renderContents) {
      miniCart.renderContents(data);
    } else if (utils?.refreshDrawerAfterChange) {
      await utils.refreshDrawerAfterChange(data.sections);
      document.querySelector('cart-drawer')?.openMenuDrawer?.();
    }

    utils?.dispatchCartUpdated?.({ cart: data });
    document.dispatchEvent(new CustomEvent('ajaxProduct:added', { detail: { product: data } }));
    return data;
  }

  function resolveSizeLabel(familyKind) {
    const cup =
      state.answers.A_SIZE ||
      state.answers.B_SIZE_INSERT_CUP ||
      state.answers.B_SIZE_UNILATERAL_CUP ||
      state.answers.B_SIZE_BILATERAL_MEMORY;
    const band = state.answers.A_SIZE_BAND || state.answers.B_SIZE_BAND;
    if (familyKind === 'form') return mapSize(band, cup, state.answers.B_SIZE_PREF);
    return mapSize(band, cup);
  }

  function isEverydayJourney() {
    if (state.journey === 'EVERYDAY') return true;
    if (state.journey === 'GIFT' && state.giftContext === 'EVERYDAY' && state.giftReady) return true;
    return false;
  }

  function isSurgeryJourney() {
    if (state.journey === 'AFTER_SURGERY') return true;
    if (state.journey === 'GIFT' && state.giftContext === 'AFTER_SURGERY' && state.giftReady) return true;
    return false;
  }

  function nextAfterEntry(id) {
    resetSession(false);
    if (id === 'SELF_AFTER_SURGERY') {
      state.journey = 'AFTER_SURGERY';
      go('b_surgery');
      return;
    }
    if (id === 'SELF_EVERYDAY') {
      state.journey = 'EVERYDAY';
      go('a_primary');
      return;
    }
    state.journey = 'GIFT';
    state.giftMode = true;
    go('g_recipient');
  }

  function nextAfterPrimary() {
    const needs = state.answers.A_PRIMARY_NEED || [];
    if (needs.includes('ASYMMETRY')) {
      go('a_asymmetry');
      return;
    }
    if (needs.includes('BUST_SIZE')) {
      go('a_bust');
      return;
    }
    go('a_activity');
  }

  function resolveEverydayOutcome() {
    const needs = state.answers.A_PRIMARY_NEED || [];
    const tier = state.answers.A_ASYMMETRY_TIER;
    const bust = state.answers.A_BUST_PREFERENCE;
    const activity = state.answers.A_ACTIVITY_CONTEXT;

    if (needs.includes('ASYMMETRY')) {
      if (tier === 'MILD') return { primary: 'CLASSICS', secondary: null, stacked: false, route: 'A-asymmetry-mild' };
      if (tier === 'NOTICEABLE') return { primary: 'PLUS', secondary: null, stacked: false, route: 'A-asymmetry-noticeable' };
      return { primary: 'PLUS', secondary: 'FORM_OVAL_HC700', stacked: true, route: 'A-asymmetry-significant' };
    }
    if (needs.includes('BUST_SIZE')) {
      if (bust === 'FULLNESS_AND_LIFT') return { primary: 'PUSH_UPS', secondary: null, stacked: false, route: 'A-bust-lift' };
      return { primary: 'PLUS', secondary: null, stacked: false, route: 'A-bust-fullness' };
    }
    if (activity === 'WORKOUTS' || activity === 'SWIMMING') {
      return { primary: 'PLUS', secondary: null, stacked: false, route: 'A-active' };
    }
    if (needs.includes('RESTORE_VOLUME')) return { primary: 'PLUS', secondary: null, stacked: false, route: 'A-volume' };
    if (needs.includes('LIGHT_SHAPING')) return { primary: 'CLASSICS', secondary: null, stacked: false, route: 'A-light-shaping' };
    return { primary: 'LITES', secondary: null, stacked: false, route: 'A-nipple-coverage' };
  }

  // Authoritative: every outcome key is rewritten here, so re-answering a
  // branch screen can never leave a stale pair/stacking flag behind.
  function applyOutcome(rec) {
    setAnswer('primary_outcome', rec.primary);
    setAnswer('secondary_outcome', rec.secondary || null);
    setAnswer('stacked', rec.stacked || false);
    setAnswer('single_side_pair', false);
    setAnswer('route', rec.route);
  }

  function surgeryNeedNext(id) {
    setAnswer('B_DAY_TO_DAY_NEED', id);
    if (id === 'FULL_FORM') { go('b_form_sides'); return; }
    if (id === 'BALANCE_SIDES') { go('b_asymmetry'); return; }
    if (id === 'IMPLANT_SHAPE') { go('b_implant'); return; }
    if (id === 'LIGHT_SHAPE') { go('b_light'); return; }
    if (id === 'FLAT_COVERAGE') {
      applyOutcome({ primary: 'CLASSICS', route: 'B-flat-coverage' });
      go('b_size_insert_band');
      return;
    }
    if (id === 'NOT_SURE') go('talk');
  }

  function afterSurgeryContext(id) {
    setAnswer('B_SURGERY_CONTEXT', id);
    if (id === 'UNEVEN_SIDES') setAnswer('B_DAY_TO_DAY_NEED', 'BALANCE_SIDES');
    else delete state.answers.B_DAY_TO_DAY_NEED;

    if (id === 'PRE_SURGERY') {
      setAnswer('B_RECENCY', 'NOT_YET');
      go('b_need');
      return;
    }
    if (['EXPANDERS', 'IMPLANTS', 'FLAP', 'GOLDILOCKS'].includes(id)) {
      go('b_reassure');
      return;
    }
    go('b_recency');
  }

  function afterRecency() {
    if (state.answers.B_SURGERY_CONTEXT === 'UNEVEN_SIDES') go('b_asymmetry');
    else go('b_need');
  }

  function finishInsertOutcome(primary, extra) {
    applyOutcome({
      primary,
      secondary: extra && extra.secondary_outcome,
      stacked: extra && extra.stacked,
      route: (extra && extra.route) || primary,
    });
    if (extra) Object.keys(extra).forEach((k) => setAnswer(k, extra[k]));
    go('b_size_insert_band');
  }

  function buildResult() {
    if (state.screen === 'gift_card' || state.answers.primary_outcome === 'GIFT_CARD') {
      const giftMeta = getOutcomeMeta('GIFT_CARD');
      const modules = [];
      if (giftMeta && (isGiftVoice() ? giftMeta.introGift : giftMeta.introSelf)) {
        modules.push(isGiftVoice() ? giftMeta.introGift : giftMeta.introSelf);
      }
      pushSnippets(modules, ['gift_card_body', 'gift_card_no_guess']);
      return {
        family: getFamily('GIFT_CARD'),
        qtyLabel: t('result.gift_qty', 'Recipient chooses size and style'),
        sizeLabel: '',
        route: state.answers.gift_exit || 'GIFT_CARD',
        modules,
      };
    }
    if (state.answers.primary_outcome === 'TALK_IT_THROUGH') {
      const talkMeta = getOutcomeMeta('TALK_IT_THROUGH');
      const modules = [];
      if (talkMeta && talkMeta.introSelf) modules.push(talkMeta.introSelf);
      pushSnippets(modules, ['talk_support']);
      return {
        family: getFamily('TALK_IT_THROUGH'),
        qtyLabel: '',
        sizeLabel: t('result.talk_subtitle', 'No hard product push'),
        route: 'TALK_IT_THROUGH',
        modules,
      };
    }

    let rec = {
      primary: state.answers.primary_outcome,
      secondary: state.answers.secondary_outcome,
      stacked: !!state.answers.stacked,
      route: state.answers.route,
    };
    if (isEverydayJourney() && !rec.primary) rec = resolveEverydayOutcome();

    const family = getFamily(rec.primary);
    const cup =
      state.answers.A_SIZE ||
      state.answers.B_SIZE_INSERT_CUP ||
      state.answers.B_SIZE_UNILATERAL_CUP ||
      state.answers.B_SIZE_BILATERAL_MEMORY;
    const band = state.answers.A_SIZE_BAND || state.answers.B_SIZE_BAND;
    const productSize = mapSize(band, cup);
    const isForm = family.kind === 'form';
    const qty = isForm ? state.answers.form_quantity || 1 : 1;
    const modules = [];

    if (isEverydayJourney()) {
      const needs = state.answers.A_PRIMARY_NEED || [];
      const labels = {
        NIPPLE_COVERAGE: t('need.nipple_coverage', 'nipple coverage'),
        LIGHT_SHAPING: t('need.light_shaping', 'light shaping'),
        RESTORE_VOLUME: t('need.restore_volume', 'restore volume'),
        ASYMMETRY: t('need.asymmetry', 'asymmetry'),
        BUST_SIZE: t('need.bust_size', 'increase bust size'),
      };
      modules.push(
        t('result.why_this_fits', 'Why this fits: {needs}.', {
          needs: needs.map((n) => labels[n] || n).join(', '),
        })
      );
      pushSnippets(modules, ['non_slip']);
      if (needs.includes('ASYMMETRY')) {
        pushSnippets(modules, ['asymmetry_pair']);
        if (rec.stacked) pushSnippets(modules, ['asymmetry_stacked']);
      }
      if (state.answers.A_ACTIVITY_CONTEXT === 'SWIMMING') pushSnippets(modules, ['swim_pool']);
      if (needs.includes('BUST_SIZE') && needs.includes('ASYMMETRY')) pushSnippets(modules, ['bust_asymmetry_note']);
    }

    if (isSurgeryJourney()) {
      const need = state.answers.B_DAY_TO_DAY_NEED;
      const recency = state.answers.B_RECENCY;
      modules.push(
        t('result.day_to_day_need', 'Day-to-day need: {need}.', {
          need: (need || '—').replace(/_/g, ' ').toLowerCase(),
        })
      );
      if (need === 'FLAT_COVERAGE') pushSnippets(modules, ['flat_coverage']);
      if (recency === 'UNDER_8_WEEKS') pushSnippets(modules, ['recency_under_8_weeks']);
      else if (recency === 'MONTHS_2_TO_6') pushSnippets(modules, ['recency_2_6_months']);
      else if (recency === 'NOT_YET') pushSnippets(modules, ['recency_not_yet']);
      if (state.answers.B_SURGERY_CONTEXT === 'EXPANDERS') pushSnippets(modules, ['expander_note']);
      if (state.answers.single_side_pair) pushSnippets(modules, ['single_side_pair']);
      if (rec.stacked) pushSnippets(modules, ['stacked_plus']);
      pushSnippets(modules, ['fsa_hsa', 'exchange_easy']);
    }

    if (state.giftMode && state.giftReady) {
      pushSnippets(modules, ['gift_recipient_oriented', 'gift_escape']);
    }

    const primaryMeta = getOutcomeMeta(rec.primary);
    if (primaryMeta && (isGiftVoice() ? primaryMeta.introGift : primaryMeta.introSelf)) {
      modules.unshift(isGiftVoice() ? primaryMeta.introGift : primaryMeta.introSelf);
    }

    return {
      family,
      primaryKey: rec.primary,
      secondaryKey: rec.secondary,
      secondary: rec.secondary ? getFamily(rec.secondary) : null,
      stacked: rec.stacked,
      qty,
      cup,
      band,
      pref: state.answers.B_SIZE_PREF,
      qtyLabel: isForm
        ? qty === 1
          ? t('result.qty_form_one', '1 form', { qty: qty })
          : t('result.qty_form_many', '{qty} forms', { qty: qty })
        : t('result.qty_pair', '1 pair'),
      sizeLabel: isForm
        ? qty === 2
          ? t('result.size_form_both', 'Band {band}, pre-surgery cup {cup} ({pref})', {
              band: band || '—',
              cup: cup || '—',
              pref: state.answers.B_SIZE_PREF || 'same',
            })
          : t('result.size_form_one', 'Band {band}, current cup {cup}', {
              band: band || '—',
              cup: cup || '—',
            })
        : t('result.size_insert', 'Size {size}', { size: productSize }),
      sizeCode: isForm ? mapSize(band, cup, state.answers.B_SIZE_PREF) : productSize,
      route: rec.route || rec.primary,
      modules,
      showFormAlt: isSurgeryJourney() && rec.stacked && rec.secondary && family.kind === 'inserts',
    };
  }

  function journeyLabel() {
    if (state.journey === 'EVERYDAY') return t('journey.everyday', 'Everyday & Fitness');
    if (state.journey === 'AFTER_SURGERY') return t('journey.after_surgery', 'After breast surgery');
    if (state.journey === 'GIFT') {
      if (!state.giftReady) return t('journey.gift', 'Gift');
      return state.giftContext === 'AFTER_SURGERY'
        ? t('journey.gift_after_surgery', 'Gift · after surgery path')
        : t('journey.gift_everyday', 'Gift · everyday path');
    }
    return '';
  }

  function optionButton(opt, selected, multiKey) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hc-sf__opt' + (selected ? ' is-on' : '');
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      el.err.hidden = true;
      if (multiKey) {
        const cur = new Set(state.answers[multiKey] || []);
        if (cur.has(opt.id)) cur.delete(opt.id);
        else cur.add(opt.id);
        setAnswer(multiKey, [...cur]);
        render();
        return;
      }
      if (opt.onPick) opt.onPick(opt.id);
    });
    return btn;
  }

  function showNav({ backable = true, next = false, onNext = null, giftEscape = false } = {}) {
    el.back.hidden = !backable || state.history.length === 0;
    el.next.hidden = !next;
    el.next.onclick = onNext;
    el.giftEscape.hidden = !(giftEscape && state.giftMode && state.giftReady);
  }

  // The kicker often already names the journey (e.g. "After breast surgery"),
  // so only show the journey line when it adds something.
  function setJourneyLine(kicker) {
    if (!el.journey) return;
    const label = journeyLabel();
    const duplicate = norm(label) === norm(kicker);
    el.journey.textContent = duplicate ? '' : label;
    el.journey.hidden = duplicate || !label;
  }

  function paintQuestion(cfg) {
    el.kicker.textContent = cfg.kicker;
    setJourneyLine(cfg.kicker);
    el.title.textContent = cfg.title;
    el.help.textContent = cfg.help || '';
    el.help.hidden = !cfg.help;
    el.note.hidden = !cfg.note;
    el.note.textContent = cfg.note || '';
    el.options.innerHTML = '';
    el.extra.innerHTML = '';
    el.err.hidden = true;
    const selected = cfg.multi ? state.answers[cfg.multi] || [] : [];
    (cfg.options || []).forEach((opt) => {
      el.options.appendChild(optionButton(opt, cfg.multi ? selected.includes(opt.id) : false, cfg.multi));
    });
    showNav({
      backable: cfg.backable !== false,
      next: !!cfg.onContinue,
      onNext: cfg.onContinue,
      giftEscape: cfg.giftEscape !== false,
    });
  }

  function renderModuleList(modules) {
    const ul = document.createElement('ul');
    ul.className = 'hc-sf__mods';
    modules.forEach((m) => {
      const li = document.createElement('li');
      li.textContent = m;
      ul.appendChild(li);
    });
    return ul;
  }

  // Size chart popup, mirroring the product page: the merchant's size image and
  // description, from the same product metafields the PDP reads.
  function openSizeGuide(guide) {
    const overlay = document.createElement('div');
    overlay.className = 'hc-sf__modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', t('size_guide.label', 'Size guide'));

    const panel = document.createElement('div');
    panel.className = 'hc-sf__modal-panel';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'hc-sf__modal-close';
    close.setAttribute('aria-label', t('size_guide.close', 'Close'));
    close.textContent = '×';

    // Reuse the product page's own wrapper classes so the merchant's rich text
    // renders with the same headings, sizing and centring it has on the PDP.
    const info = document.createElement('div');
    info.className = 'product-popup-modal__content-info';

    const heading = document.createElement('div');
    heading.className = 'h2';
    heading.textContent = t('size_guide.label', 'Size guide');
    info.appendChild(heading);

    if (guide.text) {
      const rte = document.createElement('div');
      rte.className = 'rte';
      rte.innerHTML = guide.text;
      info.appendChild(rte);
    }
    if (guide.image) {
      const wrapImg = document.createElement('div');
      wrapImg.className = 'rte';
      const img = document.createElement('img');
      img.className = 'hc-sf__modal-img';
      img.src = guide.image;
      img.alt = t('size_guide.label', 'Size guide');
      img.loading = 'lazy';
      wrapImg.appendChild(img);
      info.appendChild(wrapImg);
    }

    panel.appendChild(close);
    panel.appendChild(info);
    overlay.appendChild(panel);

    function dismiss() {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    }
    function onKey(e) {
      if (e.key === 'Escape') dismiss();
    }

    close.addEventListener('click', dismiss);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) dismiss();
    });
    document.addEventListener('keydown', onKey);

    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);
    close.focus();
  }

  // One select per product option that actually offers a choice, so the shopper
  // can change size and colour before adding to cart. Options that would land
  // on a sold-out variant are labelled as such rather than hidden.
  function buildVariantPicker(product, startVariant, onPick, guide) {
    const variants = (product.variants || []).filter(Boolean);
    const opts = product.options || [];
    if (variants.length < 2 || !opts.length) return null;

    const names = opts.map((opt, i) =>
      typeof opt === 'string' ? opt : (opt && opt.name) || 'Option ' + (i + 1)
    );

    const choices = names.map((_, i) => {
      const seen = [];
      variants.forEach((v) => {
        const val = v['option' + (i + 1)];
        if (val && seen.indexOf(val) === -1) seen.push(val);
      });
      return seen;
    });

    const active = names.map((_, i) => (startVariant && startVariant['option' + (i + 1)]) || '');
    const selects = [];

    function match(values) {
      return (
        variants.find((v) => values.every((val, i) => !val || v['option' + (i + 1)] === val)) || null
      );
    }

    function refreshLabels() {
      selects.forEach((sel, i) => {
        if (!sel) return;
        Array.prototype.forEach.call(sel.options, (optEl) => {
          const trial = active.slice();
          trial[i] = optEl.value;
          const found = match(trial);
          optEl.textContent =
            found && !found.available
              ? optEl.value + ' — ' + t('product.sold_out', 'Sold out')
              : optEl.value;
        });
      });
    }

    const wrap = document.createElement('div');
    wrap.className = 'hc-sf__picker-fields';

    names.forEach((name, i) => {
      if (choices[i].length < 2) {
        selects.push(null);
        return;
      }

      const field = document.createElement('div');
      field.className = 'hc-sf__field';

      const head = document.createElement('div');
      head.className = 'hc-sf__field-head';

      const selId = 'hc-sf-opt-' + Math.random().toString(36).slice(2, 8);
      const label = document.createElement('label');
      label.className = 'hc-sf__field-label';
      label.setAttribute('for', selId);
      label.textContent = name;
      head.appendChild(label);

      // Size guide sits beside the Size label, exactly as it does on the PDP.
      if (/size/i.test(name) && guide && (guide.image || guide.text || guide.url)) {
        if (guide.image || guide.text) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'hc-sf__size-guide';
          btn.textContent = t('size_guide.label', 'Size guide');
          btn.addEventListener('click', () => openSizeGuide(guide));
          head.appendChild(btn);
        } else {
          const link = document.createElement('a');
          link.className = 'hc-sf__size-guide';
          link.href = guide.url;
          link.target = '_blank';
          link.rel = 'noopener';
          link.textContent = t('size_guide.label', 'Size guide');
          head.appendChild(link);
        }
      }

      const sel = document.createElement('select');
      sel.id = selId;
      sel.className = 'hc-sf__select';
      choices[i].forEach((val) => {
        const optEl = document.createElement('option');
        optEl.value = val;
        optEl.textContent = val;
        if (val === active[i]) optEl.selected = true;
        sel.appendChild(optEl);
      });

      sel.addEventListener('change', () => {
        active[i] = sel.value;
        let next = match(active);
        if (!next) {
          // That exact combination doesn't exist, so honour the value they just
          // picked and re-sync the other selects to a variant that does.
          next = match(active.map((val, j) => (j === i ? val : '')));
        }
        if (next) {
          names.forEach((__, j) => {
            active[j] = next['option' + (j + 1)] || '';
            if (selects[j]) selects[j].value = active[j];
          });
          onPick(next);
        }
        refreshLabels();
      });

      field.appendChild(head);
      field.appendChild(sel);
      wrap.appendChild(field);
      selects.push(sel);
    });

    if (!wrap.children.length) return null;
    refreshLabels();
    return wrap;
  }

  const FORM_KEYS = ['FORM_TEARDROP_HC800', 'FORM_OVAL_HC700'];

  function largestSizeOf(product) {
    const sizes = (product.variants || [])
      .map((v) => variantSizeValue(v, product))
      .filter((s) => SIZE_LADDER.indexOf(s) !== -1);
    if (!sizes.length) return null;
    return sizes.sort((a, b) => SIZE_LADDER.indexOf(a) - SIZE_LADDER.indexOf(b)).pop();
  }

  // The breast forms run larger than the inserts, so they're the fallback when
  // a shopper's charted size is past what an insert is made in — and when a form
  // size exists but is sold out in every colour.
  async function formInSize(size, excludeKey) {
    const wanted = norm(size);
    for (const key of FORM_KEYS) {
      if (key === excludeKey) continue;
      const handle = getOutcomeHandle(key);
      if (!handle) continue;
      const product = await fetchProduct(handle);
      if (!product) continue;
      const matches = (product.variants || []).filter(
        (v) => variantSizeValue(v, product) === wanted && v.available
      );
      if (matches.length) {
        return { key, product, variant: pickVariantByColor(matches, product) };
      }
    }
    return null;
  }

  function supportNote(container, text) {
    const p = document.createElement('p');
    p.className = 'hc-sf__notice';
    p.textContent = text;
    container.appendChild(p);

    const email = t('support.email', 'support@honeycloudz.com');
    const link = document.createElement('a');
    link.className = 'hc-sf__btn hc-sf__btn--ghost';
    link.href = 'mailto:' + email;
    link.textContent = t('support.email_cta', 'Email our team');
    container.appendChild(link);
  }

  // Size chart for an outcome: the product's own metafields if the merchant has
  // set them, otherwise a link to the store's size guide page.
  function sizeGuideFor(outcomeKey) {
    const meta = getOutcomeMeta(outcomeKey);
    return {
      image: (meta && meta.sizeGuideImage) || null,
      text: (meta && meta.sizeGuideText) || null,
      url: t('size_guide.url', '/pages/size-fit-wear-care-guide'),
    };
  }

  function renderProductCard({ product, variant, qty, tag, stackedLabel, sizeGuide }) {
    const card = document.createElement('article');
    card.className = 'hc-sf__product';

    if (tag) {
      const tagEl = document.createElement('p');
      tagEl.className = 'hc-sf__product-tag';
      tagEl.textContent = tag;
      card.appendChild(tagEl);
    }

    const row = document.createElement('div');
    row.className = 'hc-sf__product-row';

    let img = null;
    if (product && product.featured_image) {
      img = document.createElement('img');
      img.className = 'hc-sf__product-img';
      img.src = product.featured_image;
      img.alt = product.title;
      img.loading = 'lazy';
      img.width = 240;
      img.height = 240;
      row.appendChild(img);
    } else {
      // No image to place, so the grid drops to a single column.
      row.classList.add('hc-sf__product-row--noimg');
    }

    const body = document.createElement('div');
    body.className = 'hc-sf__product-body';

    const title = document.createElement('h3');
    title.className = 'hc-sf__product-title';
    title.textContent = product ? product.title : stackedLabel || 'Recommended product';
    body.appendChild(title);

    // `current` is what gets added to cart; the picker below reassigns it.
    let current = variant || null;

    const meta = document.createElement('p');
    meta.className = 'hc-sf__product-meta';
    body.appendChild(meta);

    const price = document.createElement('p');
    price.className = 'hc-sf__product-price';
    body.appendChild(price);

    const actions = document.createElement('div');
    actions.className = 'hc-sf__product-actions';

    if (product) {
      const view = document.createElement('a');
      view.className = 'hc-sf__btn hc-sf__btn--ghost';
      view.href = `/products/${product.handle}`;
      view.textContent = t('product.view', 'View product');
      actions.appendChild(view);
    }

    const atc = document.createElement('button');
    atc.type = 'button';
    atc.className = 'hc-sf__btn';
    atc.addEventListener('click', async () => {
      if (!current) return;
      atc.disabled = true;
      atc.textContent = t('product.adding', 'Adding…');
      try {
        await addToCart(current.id, qty);
        atc.textContent = t('product.added', 'Added');
      } catch {
        atc.disabled = false;
        atc.textContent = t('product.add_to_cart', 'Add to cart');
        el.err.hidden = false;
        el.err.textContent = t('error.add_to_cart', 'Could not add to cart. Try again or contact support.');
      }
    });
    if (current) actions.appendChild(atc);

    function paintVariant() {
      const has = !!current;
      meta.hidden = !has;
      price.hidden = !has;
      if (!has) return;
      meta.textContent = [current.title, qty > 1 ? 'Qty ' + qty : ''].filter(Boolean).join(' · ');
      price.textContent = formatMoney(current.price);
      if (img && current.featured_image && current.featured_image.src) {
        img.src = current.featured_image.src;
      }
      const soldOut = !current.available;
      atc.disabled = soldOut;
      atc.textContent = soldOut
        ? t('product.sold_out', 'Sold out')
        : t('product.add_to_cart', 'Add to cart');
    }

    paintVariant();

    let picker = null;
    if (product && current) {
      picker = buildVariantPicker(
        product,
        current,
        (next) => {
          current = next;
          paintVariant();
        },
        sizeGuide
      );
    }

    let pickerArea = null;
    if (picker) {
      pickerArea = document.createElement('div');
      pickerArea.className = 'hc-sf__product-picker';
      pickerArea.appendChild(picker);
    }

    // Details, picker and actions are siblings of the image, so the grid can
    // stack them under it on mobile and place them beside it on desktop.
    row.appendChild(body);
    if (pickerArea) row.appendChild(pickerArea);
    row.appendChild(actions);
    card.appendChild(row);
    return card;
  }

  async function paintResult() {
    const token = renderSeq;
    const stale = () => token !== renderSeq;
    const r = buildResult();
    el.kicker.textContent =
      state.screen === 'gift_card'
        ? t('kicker.gift_card', 'Gift Card')
        : state.giftMode
          ? t('kicker.gift_result', 'Gift result')
          : t('kicker.result', 'Your match');
    setJourneyLine(el.kicker.textContent);
    el.title.textContent = r.family.name;
    el.help.hidden = !(r.sizeLabel || r.qtyLabel);
    el.help.textContent = [r.sizeLabel, r.qtyLabel].filter(Boolean).join(' · ');
    el.note.hidden = true;
    el.options.innerHTML = '';
    el.extra.innerHTML = '';
    el.err.hidden = true;

    if (state.answers.primary_outcome === 'TALK_IT_THROUGH') {
      el.extra.appendChild(renderModuleList(r.modules));
      const chatBtn = document.createElement('button');
      chatBtn.type = 'button';
      chatBtn.className = 'hc-sf__btn';
      chatBtn.style.marginTop = '1.6rem';
      chatBtn.textContent = t('support.chat_button', 'Chat with our team');
      chatBtn.addEventListener('click', openSupportChat);
      el.extra.appendChild(chatBtn);
      showNav({ backable: true, giftEscape: false });
      return;
    }

    if (state.screen === 'gift_card' || state.answers.primary_outcome === 'GIFT_CARD') {
      el.extra.appendChild(renderModuleList(r.modules));
      // Product comes from the GIFT_CARD entry in Style Finder Outcome.
      const giftHandle = getOutcomeHandle('GIFT_CARD');
      const giftProduct = giftHandle ? await fetchProduct(giftHandle) : null;
      if (stale()) return;
      if (giftProduct) {
        const giftVariant = giftProduct.variants?.find((v) => v.available) || giftProduct.variants?.[0];
        el.extra.appendChild(renderProductCard({ product: giftProduct, variant: giftVariant, qty: 1, tag: t('tag.gift_card', 'Gift card') }));
      } else {
        const warn = document.createElement('p');
        warn.className = 'hc-sf__meta';
        warn.textContent = t('error.gift_card_missing', 'Gift card could not be loaded — browse our shop or chat with us for help.');
        el.extra.appendChild(warn);
        if (!giftHandle) {
          console.warn('[Style Finder] No product set on the GIFT_CARD outcome entry.');
        }
      }
      const recover = document.createElement('button');
      recover.type = 'button';
      recover.className = 'hc-sf__btn--text';
      recover.style.marginTop = '1rem';
      recover.textContent = t('gift.recover', 'I found out more about what they need');
      recover.addEventListener('click', () => {
        state.giftReady = false;
        clearKeys(['primary_outcome', 'gift_exit', 'gift_readiness']);
        clearOutcome();
        go('g_recipient');
      });
      el.extra.appendChild(recover);
      showNav({ backable: true, giftEscape: false });
      return;
    }

    const { product: primaryProduct, variant: primaryVariant } = await resolveVariant(
      r.primaryKey,
      r.sizeCode,
      r.cup,
      r.band,
      r.pref
    );
    if (stale()) return;

    // The chart can name a size a style isn't made in — Plus stops at 1X, so a
    // chart answer of 2X or 3X is stepped down when the variant is resolved.
    // The headline follows the variant actually recommended, so the shopper is
    // never shown one size above the picker and another inside it.
    const resolvedSize =
      primaryProduct && primaryVariant ? variantSizeValue(primaryVariant, primaryProduct) : r.sizeCode;
    if (r.family.kind !== 'form' && r.sizeLabel) {
      el.help.textContent = [
        t('result.size_insert', 'Size {size}', { size: resolvedSize }),
        r.qtyLabel,
      ]
        .filter(Boolean)
        .join(' · ');
    }

    if (r.secondary) {
      const p = document.createElement('p');
      p.className = 'hc-sf__meta';
      p.textContent = r.stacked
        ? t('result.primary_stacked_secondary', 'Primary (stacked): {primary} · Secondary: {secondary}', {
            primary: r.family.name,
            secondary: r.secondary.name,
          })
        : t('result.primary_secondary', 'Primary: {primary} · Secondary: {secondary}', {
            primary: r.family.name,
            secondary: r.secondary.name,
          });
      el.extra.appendChild(p);
    }

    el.extra.appendChild(renderModuleList(r.modules));

    if (r.family.kind === 'form') {
      const sizingNote = document.createElement('p');
      sizingNote.className = 'hc-sf__meta';
      sizingNote.textContent = t(
        'result.form_size_note',
        'Recommended size {size} is a starting point from band and cup — our team can help fine-tune fit.',
        { size: resolvedSize }
      );
      el.extra.appendChild(sizingNote);
    }

    // Client rule: never quietly hand someone a smaller size than their chart
    // says. Flag it, then offer a breast form (they run larger) on the
    // after-surgery path, or our team everywhere else.
    let altCard = null;
    if (primaryProduct && primaryVariant) {
      const maxSize = largestSizeOf(primaryProduct);
      const chartIdx = SIZE_LADDER.indexOf(norm(r.sizeCode));
      const maxIdx = SIZE_LADDER.indexOf(maxSize);
      const outOfRange = chartIdx > -1 && maxIdx > -1 && chartIdx > maxIdx;
      const soldOutAtSize = !primaryVariant.available;

      if (outOfRange) {
        const notice = document.createElement('div');
        notice.className = 'hc-sf__notice-box';
        const alt = isSurgeryJourney() ? await formInSize(r.sizeCode, r.primaryKey) : null;
        if (stale()) return;

        if (alt) {
          const p = document.createElement('p');
          p.className = 'hc-sf__notice';
          p.textContent = t(
            'outofrange.form',
            '{family} is made up to {max}, and your size works out at {size}. A breast form will fit you properly at this size.',
            { family: r.family.name, max: maxSize, size: r.sizeCode }
          );
          notice.appendChild(p);
          altCard = renderProductCard({
            product: alt.product,
            variant: alt.variant,
            qty: 1,
            tag: t('tag.size_alternative', 'Available in your size'),
            sizeGuide: sizeGuideFor(alt.key),
          });
        } else {
          supportNote(
            notice,
            t(
              'outofrange.support',
              '{family} is made up to {max}, and your size works out at {size}. Our team can help you find the right fit.',
              { family: r.family.name, max: maxSize, size: r.sizeCode }
            )
          );
        }
        el.extra.appendChild(notice);
      } else if (soldOutAtSize && r.family.kind === 'form') {
        // Oval 2X is in the catalogue but not stocked until November — point to
        // the form that carries the size today.
        const alt = await formInSize(resolvedSize, r.primaryKey);
        if (stale()) return;
        if (alt) {
          const notice = document.createElement('div');
          notice.className = 'hc-sf__notice-box';
          const p = document.createElement('p');
          p.className = 'hc-sf__notice';
          p.textContent = t(
            'soldout.form_alternative',
            '{family} is not in stock in {size} yet. {alt} is available in {size} today.',
            { family: r.family.name, size: resolvedSize, alt: getFamily(alt.key).name }
          );
          notice.appendChild(p);
          el.extra.appendChild(notice);
          altCard = renderProductCard({
            product: alt.product,
            variant: alt.variant,
            qty: r.qty || 1,
            tag: t('tag.size_alternative', 'Available in your size'),
            sizeGuide: sizeGuideFor(alt.key),
          });
        }
      }
    }

    if (primaryProduct) {
      el.extra.appendChild(
        renderProductCard({
          product: primaryProduct,
          variant: primaryVariant,
          qty: r.qty || 1,
          tag: r.stacked ? t('tag.primary', 'Primary recommendation') : '',
          sizeGuide: sizeGuideFor(r.primaryKey),
        })
      );
      if (altCard) el.extra.appendChild(altCard);
    } else {
      // Covers both a failed fetch and an outcome with no product mapped —
      // never leave the shopper on an empty result.
      const warn = document.createElement('p');
      warn.className = 'hc-sf__meta';
      warn.textContent = t('error.product_missing', 'Product could not be loaded — browse our shop or chat with us for help.');
      el.extra.appendChild(warn);
    }

    if (r.secondaryKey) {
      const { product: secondaryProduct, variant: secondaryVariant } = await resolveVariant(
        r.secondaryKey,
        r.sizeCode,
        r.cup,
        r.band,
        r.pref
      );
      if (stale()) return;
      if (secondaryProduct) {
        el.extra.appendChild(
          renderProductCard({
            product: secondaryProduct,
            variant: secondaryVariant,
            qty: 1,
            tag: t('tag.secondary', 'Secondary option'),
            sizeGuide: sizeGuideFor(r.secondaryKey),
          })
        );
      }
    }

    const chatLink = document.createElement('button');
    chatLink.type = 'button';
    chatLink.className = 'hc-sf__btn--text';
    chatLink.style.marginTop = '0.8rem';
    chatLink.textContent = t('support.chat_link', 'Questions? Chat with our team');
    chatLink.addEventListener('click', openSupportChat);
    el.extra.appendChild(chatLink);

    if (r.showFormAlt) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hc-sf__btn hc-sf__btn--ghost';
      btn.style.marginTop = '1.2rem';
      btn.textContent = t('form_alt.button', "I'd rather explore a full breast form");
      btn.addEventListener('click', () => {
        state.fromFormExplore = true;
        setAnswer('form_quantity', 1);
        clearOutcome();
        go('b_form_priority');
      });
      el.extra.appendChild(btn);
    }

    showNav({ backable: true, giftEscape: state.giftMode && state.giftReady && state.screen !== 'gift_card' });
  }

  const SCREENS = {
    entry() {
      paintQuestion({
        id: 'ENTRY_SHOPPER_TYPE',
        kicker: t('kicker.entry', 'Style Finder'),
        title: qTitle('ENTRY_SHOPPER_TYPE'),
        help: qHelp('ENTRY_SHOPPER_TYPE'),
        backable: false,
        giftEscape: false,
        options: answerOptionsFor('ENTRY_SHOPPER_TYPE', {
          SELF_AFTER_SURGERY: () => nextAfterEntry('SELF_AFTER_SURGERY'),
          SELF_EVERYDAY: () => nextAfterEntry('SELF_EVERYDAY'),
          GIFT: () => nextAfterEntry('GIFT'),
        }),
      });
    },
    g_recipient() {
      paintQuestion({
        id: 'G_RECIPIENT_CONTEXT',
        kicker: t('kicker.gift_journey', 'Gift journey'),
        title: qTitle('G_RECIPIENT_CONTEXT'),
        help: qHelp('G_RECIPIENT_CONTEXT'),
        options: answerOptionsFor('G_RECIPIENT_CONTEXT', {
          Y: () => { state.giftContext = 'AFTER_SURGERY'; setAnswer('gift_recipient_context', 'AFTER_SURGERY'); go('g_readiness'); },
          N: () => { state.giftContext = 'EVERYDAY'; setAnswer('gift_recipient_context', 'EVERYDAY'); go('g_readiness'); },
          U: () => { setAnswer('gift_exit', 'RECIPIENT_UNKNOWN'); setAnswer('primary_outcome', 'GIFT_CARD'); state.giftReady = false; go('gift_card'); },
        }),
      });
    },
    g_readiness() {
      paintQuestion({
        id: 'G_GIFT_READINESS',
        kicker: t('kicker.gift_journey', 'Gift journey'),
        title: qTitle('G_GIFT_READINESS'),
        help: qHelp('G_GIFT_READINESS'),
        options: answerOptionsFor('G_GIFT_READINESS', {
          READY: () => { state.giftReady = true; setAnswer('gift_readiness', 'READY'); if (state.giftContext === 'AFTER_SURGERY') go('b_surgery'); else go('a_primary'); },
          UNSURE: () => { setAnswer('gift_exit', 'UNSURE_FIT_OR_PREFERENCE'); setAnswer('primary_outcome', 'GIFT_CARD'); state.giftReady = false; go('gift_card'); },
        }),
      });
    },
    a_primary() {
      paintQuestion({
        id: 'A_PRIMARY_NEED',
        kicker: isGiftVoice() ? t('kicker.gift_everyday', 'Gift · Everyday') : t('kicker.everyday', 'Everyday & Fitness'),
        title: qTitle('A_PRIMARY_NEED'),
        help: qHelp('A_PRIMARY_NEED'),
        multi: 'A_PRIMARY_NEED',
        onContinue: () => {
          if (!(state.answers.A_PRIMARY_NEED || []).length) {
            el.err.hidden = false;
            el.err.textContent = t('error.select_need', 'Select at least one need to continue.');
            return;
          }
          clearKeys(['A_ASYMMETRY_TIER', 'A_BUST_PREFERENCE', 'A_ACTIVITY_CONTEXT', 'A_SIZE']);
          clearOutcome();
          nextAfterPrimary();
        },
        options: answerOptionsFor('A_PRIMARY_NEED'),
      });
    },
    a_asymmetry() {
      paintQuestion({
        id: 'A_ASYMMETRY_TIER',
        kicker: t('kicker.everyday_asymmetry', 'Everyday · asymmetry'),
        title: qTitle('A_ASYMMETRY_TIER'),
        help: qHelp('A_ASYMMETRY_TIER'),
        options: answerOptionsFor('A_ASYMMETRY_TIER', {
          _default: (id) => { setAnswer('A_ASYMMETRY_TIER', id); go('a_size_band'); },
        }),
      });
    },
    a_bust() {
      paintQuestion({
        id: 'A_BUST_PREFERENCE',
        kicker: t('kicker.everyday_bust', 'Everyday · bust size'),
        title: qTitle('A_BUST_PREFERENCE'),
        help: qHelp('A_BUST_PREFERENCE'),
        options: answerOptionsFor('A_BUST_PREFERENCE', {
          _default: (id) => { setAnswer('A_BUST_PREFERENCE', id); go('a_size_band'); },
        }),
      });
    },
    a_activity() {
      paintQuestion({
        id: 'A_ACTIVITY_CONTEXT',
        kicker: t('kicker.everyday_activity', 'Everyday · where worn'),
        title: qTitle('A_ACTIVITY_CONTEXT'),
        help: qHelp('A_ACTIVITY_CONTEXT'),
        options: answerOptionsFor('A_ACTIVITY_CONTEXT', {
          _default: (id) => { setAnswer('A_ACTIVITY_CONTEXT', id); go('a_size_band'); },
        }),
      });
    },
    a_size_band() {
      paintQuestion({
        id: 'A_SIZE_BAND',
        kicker: t('kicker.sizing', 'Sizing'),
        title: qTitle('A_SIZE_BAND'),
        help: qHelp('A_SIZE_BAND'),
        options: bandOptions('A_SIZE_BAND', (id) => { setAnswer('A_SIZE_BAND', id); go('a_size'); }),
      });
    },
    a_size() {
      paintQuestion({
        id: 'A_SIZE',
        kicker: t('kicker.sizing', 'Sizing'),
        title: qTitle('A_SIZE'),
        help: qHelp('A_SIZE'),
        options: cupOptions('A_SIZE', (id) => { setAnswer('A_SIZE', id); applyOutcome(resolveEverydayOutcome()); go('result'); }),
      });
    },
    b_surgery() {
      paintQuestion({
        id: 'B_SURGERY_CONTEXT',
        kicker: isGiftVoice() ? t('kicker.gift_surgery', 'Gift · after breast surgery') : t('kicker.surgery', 'After breast surgery'),
        title: qTitle('B_SURGERY_CONTEXT'),
        help: qHelp('B_SURGERY_CONTEXT'),
        note: qNote('B_SURGERY_CONTEXT'),
        options: answerOptionsFor('B_SURGERY_CONTEXT', { _default: afterSurgeryContext }),
      });
    },
    b_reassure() {
      const expander = state.answers.B_SURGERY_CONTEXT === 'EXPANDERS';
      const qid = expander ? 'EXPANDER_REASSURANCE' : 'RECONSTRUCTION_REASSURANCE';
      paintQuestion({
        id: qid,
        kicker: t('kicker.before_continue', 'Before we continue'),
        title: qTitle(qid),
        help: qHelp(qid),
        note: qNote(qid),
        options: answerOptionsFor(qid, { _default: () => go('b_recency') }),
      });
    },
    b_recency() {
      paintQuestion({
        id: 'B_RECENCY',
        kicker: t('kicker.surgery', 'After breast surgery'),
        title: qTitle('B_RECENCY'),
        help: qHelp('B_RECENCY'),
        options: answerOptionsFor('B_RECENCY', {
          _default: (id) => { setAnswer('B_RECENCY', id); afterRecency(); },
        }),
      });
    },
    b_need() {
      paintQuestion({
        id: 'B_DAY_TO_DAY_NEED',
        kicker: t('kicker.surgery', 'After breast surgery'),
        title: qTitle('B_DAY_TO_DAY_NEED'),
        help: qHelp('B_DAY_TO_DAY_NEED'),
        options: answerOptionsFor('B_DAY_TO_DAY_NEED', { _default: surgeryNeedNext }),
      });
    },
    b_form_sides() {
      paintQuestion({
        id: 'B_FULL_FORM_SIDES',
        kicker: t('kicker.full_form', 'Full breast form'),
        title: qTitle('B_FULL_FORM_SIDES'),
        help: qHelp('B_FULL_FORM_SIDES'),
        options: answerOptionsFor('B_FULL_FORM_SIDES', {
          ONE: () => { setAnswer('form_quantity', 1); go('b_form_priority'); },
          BOTH: () => { setAnswer('form_quantity', 2); go('b_form_priority'); },
        }),
      });
    },
    b_form_priority() {
      paintQuestion({
        id: 'B_FORM_PRIORITY',
        kicker: t('kicker.form', 'Breast form'),
        title: qTitle('B_FORM_PRIORITY'),
        help: qHelp('B_FORM_PRIORITY'),
        options: answerOptionsFor('B_FORM_PRIORITY', {
          _default: (id) => { setAnswer('B_FORM_PRIORITY', id); go('b_form_shape'); },
        }),
      });
    },
    b_form_shape() {
      paintQuestion({
        id: 'B_FORM_SHAPE',
        kicker: t('kicker.form_shape', 'Breast form shape'),
        title: qTitle('B_FORM_SHAPE'),
        help: qHelp('B_FORM_SHAPE'),
        options: answerOptionsFor('B_FORM_SHAPE', {
          ROUND: () => { applyOutcome({ primary: 'FORM_TEARDROP_HC800', route: 'B-form-teardrop' }); go('b_size_form'); },
          SOFT: () => { applyOutcome({ primary: 'FORM_OVAL_HC700', route: 'B-form-oval' }); go('b_size_form'); },
          UNSURE: () => go('b_form_compare'),
        }),
      });
    },
    b_form_compare() {
      paintQuestion({
        id: 'B_FORM_SHAPE_COMPARE',
        kicker: t('kicker.form_compare', 'Compare forms'),
        title: qTitle('B_FORM_SHAPE_COMPARE'),
        help: qHelp('B_FORM_SHAPE_COMPARE'),
        options: answerOptionsFor('B_FORM_SHAPE_COMPARE', {
          FORM_TEARDROP_HC800: () => { applyOutcome({ primary: 'FORM_TEARDROP_HC800', route: 'B-form-teardrop' }); go('b_size_form'); },
          FORM_OVAL_HC700: () => { applyOutcome({ primary: 'FORM_OVAL_HC700', route: 'B-form-oval' }); go('b_size_form'); },
        }),
      });
    },
    b_asymmetry() {
      paintQuestion({
        id: 'B_ASYMMETRY_TIER',
        kicker: t('kicker.balance_sides', 'Balance sides'),
        title: qTitle('B_ASYMMETRY_TIER'),
        help: qHelp('B_ASYMMETRY_TIER'),
        options: answerOptionsFor('B_ASYMMETRY_TIER', {
          MILD: () => finishInsertOutcome('CLASSICS', { single_side_pair: true, route: 'B-asymmetry-mild' }),
          NOTICEABLE: () => finishInsertOutcome('PLUS', { single_side_pair: true, route: 'B-asymmetry-noticeable' }),
          SIGNIFICANT: () => finishInsertOutcome('PLUS', { stacked: true, secondary_outcome: 'FORM_OVAL_HC700', route: 'B-asymmetry-significant' }),
        }),
      });
    },
    b_implant() {
      paintQuestion({
        id: 'B_IMPLANT_TOP_FULLNESS',
        kicker: t('kicker.implant_shape', 'Implant shape'),
        title: qTitle('B_IMPLANT_TOP_FULLNESS'),
        help: qHelp('B_IMPLANT_TOP_FULLNESS'),
        options: answerOptionsFor('B_IMPLANT_TOP_FULLNESS', {
          GENTLE: () => finishInsertOutcome('CLASSICS', { route: 'B-implant-gentle' }),
          MORE: () => finishInsertOutcome('PLUS', { route: 'B-implant-more' }),
          UNSURE: () => go('b_compare_inserts'),
        }),
      });
    },
    b_light() {
      paintQuestion({
        id: 'B_LIGHT_SHAPE_DEPTH',
        kicker: t('kicker.lighter_shape', 'Lighter shape'),
        title: qTitle('B_LIGHT_SHAPE_DEPTH'),
        help: qHelp('B_LIGHT_SHAPE_DEPTH'),
        options: answerOptionsFor('B_LIGHT_SHAPE_DEPTH', {
          GENTLE: () => finishInsertOutcome('CLASSICS', { route: 'B-light-gentle' }),
          MORE: () => finishInsertOutcome('PLUS', { route: 'B-light-more' }),
          UNSURE: () => go('b_compare_inserts'),
        }),
      });
    },
    b_compare_inserts() {
      paintQuestion({
        id: 'INSERT_COMPARE',
        kicker: t('kicker.insert_compare', 'Compare inserts'),
        title: qTitle('INSERT_COMPARE'),
        help: qHelp('INSERT_COMPARE'),
        options: answerOptionsFor('INSERT_COMPARE', {
          CLASSICS: () => finishInsertOutcome('CLASSICS', { route: 'B-compare-classics' }),
          PLUS: () => finishInsertOutcome('PLUS', { route: 'B-compare-plus' }),
        }),
      });
    },
    b_size_insert_band() {
      paintQuestion({
        id: 'B_SIZE_BAND',
        kicker: t('kicker.sizing', 'Sizing'),
        title: qTitle('B_SIZE_BAND'),
        help: qHelp('B_SIZE_BAND'),
        options: bandOptions('B_SIZE_BAND', (id) => { setAnswer('B_SIZE_BAND', id); go('b_size_insert'); }),
      });
    },
    b_size_insert() {
      paintQuestion({
        id: 'B_SIZE_INSERT_CUP',
        kicker: t('kicker.sizing', 'Sizing'),
        title: qTitle('B_SIZE_INSERT_CUP'),
        help: qHelp('B_SIZE_INSERT_CUP'),
        options: cupOptions('B_SIZE_INSERT_CUP', (id) => { setAnswer('B_SIZE_INSERT_CUP', id); go('result'); }),
      });
    },
    b_size_form() {
      paintQuestion({
        id: 'B_SIZE_BAND',
        kicker: t('kicker.form_sizing', 'Form sizing'),
        title: qTitle('B_SIZE_BAND'),
        help: qHelp('B_SIZE_BAND'),
        options: bandOptions('B_SIZE_BAND', (id) => { setAnswer('B_SIZE_BAND', id); go('b_size_form_cup'); }),
      });
    },
    b_size_form_cup() {
      const both = state.answers.form_quantity === 2;
      const qid = both ? 'B_SIZE_BILATERAL_MEMORY' : 'B_SIZE_UNILATERAL_CUP';
      paintQuestion({
        id: qid,
        kicker: t('kicker.form_sizing', 'Form sizing'),
        title: qTitle(qid),
        help: qHelp(qid),
        options: cupOptions(qid, (id) => {
          if (both) setAnswer('B_SIZE_BILATERAL_MEMORY', id);
          else setAnswer('B_SIZE_UNILATERAL_CUP', id);
          if (both) go('b_size_pref');
          else go('result');
        }),
      });
    },
    b_size_pref() {
      paintQuestion({
        id: 'B_SIZE_PREF',
        kicker: t('kicker.form_sizing', 'Form sizing'),
        title: qTitle('B_SIZE_PREF'),
        help: qHelp('B_SIZE_PREF'),
        options: answerOptionsFor('B_SIZE_PREF', {
          _default: (id) => { setAnswer('B_SIZE_PREF', id); go('result'); },
        }),
      });
    },
    result: paintResult,
    gift_card() {
      if (state.answers.primary_outcome !== 'GIFT_CARD') setAnswer('primary_outcome', 'GIFT_CARD');
      return paintResult();
    },
    talk() {
      setAnswer('primary_outcome', 'TALK_IT_THROUGH');
      return paintResult();
    },
  };

  const PROGRESS = {
    entry: 5, g_recipient: 12, g_readiness: 18, a_primary: 22, a_asymmetry: 45, a_bust: 45,
    a_activity: 55, a_size_band: 68, a_size: 75, b_surgery: 18, b_reassure: 26, b_recency: 34, b_need: 46,
    b_form_sides: 56, b_form_priority: 64, b_form_shape: 72, b_form_compare: 76, b_asymmetry: 56,
    b_implant: 56, b_light: 56, b_compare_inserts: 68, b_size_insert_band: 76, b_size_insert: 82, b_size_form: 86,
    b_size_form_cup: 92, b_size_pref: 96, result: 100, gift_card: 100, talk: 100,
  };

  function render() {
    renderSeq += 1;
    el.progress.style.width = (PROGRESS[state.screen] || 20) + '%';
    el.restart.hidden = state.screen === 'entry';
    const fn = SCREENS[state.screen] || SCREENS.entry;
    const maybePromise = fn();
    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.catch(() => {
        el.err.hidden = false;
        el.err.textContent = t('error.result_load', 'Something went wrong loading your result. Please try again.');
      });
    }
  }

  // Static markup in the section is the fallback copy; a metaobject entry
  // overrides it on boot.
  function applyStaticStrings() {
    const pairs = [
      [el.restart, 'nav.start_over'],
      [el.back, 'nav.back'],
      [el.next, 'nav.continue'],
      [el.giftEscape, 'nav.gift_escape'],
    ];
    pairs.forEach(([node, key]) => {
      if (!node) return;
      node.textContent = t(key, (node.textContent || '').trim());
    });
  }

  applyStaticStrings();

  el.back.addEventListener('click', back);
  el.restart.addEventListener('click', restart);
  el.giftEscape.addEventListener('click', () => {
    setAnswer('gift_exit', 'SAFETY_NET');
    setAnswer('primary_outcome', 'GIFT_CARD');
    state.giftReady = false;
    clearOutcome();
    clearKeys(['A_PRIMARY_NEED', 'A_ASYMMETRY_TIER', 'A_BUST_PREFERENCE', 'A_ACTIVITY_CONTEXT', 'A_SIZE', 'B_SURGERY_CONTEXT', 'B_RECENCY', 'B_DAY_TO_DAY_NEED', 'B_SIZE_INSERT_CUP']);
    go('gift_card');
  });

  render();
})();
