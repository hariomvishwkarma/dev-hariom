(function () {
  const DISMISS_KEY = 'bibs-localization-checker-dismissed-v1';
  const SWAP_KEY = 'bibs-localization-checker-swap-history-v1';
  const HIDE_ANIMATION_MS = 300;
  const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;
  const SWAP_TTL_MS = 60 * 24 * 60 * 60 * 1000;

  const toLower = (v) => (v || '').toString().toLowerCase();
  const toUpper = (v) => (v || '').toString().toUpperCase();

  function replaceCountry(template, countryName) {
    if (!template) return countryName;
    return template.replace(/\{\{\s*country\s*\}\}/g, countryName);
  }

  function readJSON(key) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }

  function writeJSON(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { }
  }

  function removeStorage(key) {
    try { window.localStorage.removeItem(key); } catch { }
  }

  function dismissedKey(countryCode, languageCode) {
    return toUpper(countryCode) + ':' + toLower(languageCode);
  }

  function readDismissed() {
    const parsed = readJSON(DISMISS_KEY) || {};
    const now = Date.now();
    const cleaned = {};
    let expired = false;
    Object.keys(parsed).forEach((key) => {
      const ts = Number(parsed[key]);
      if (Number.isFinite(ts) && now - ts < DISMISS_TTL_MS) {
        cleaned[key] = ts;
      } else {
        expired = true;
      }
    });
    if (expired) writeJSON(DISMISS_KEY, cleaned);
    return cleaned;
  }

  function saveDismissed(countryCode, languageCode) {
    const dismissed = readDismissed();
    dismissed[dismissedKey(countryCode, languageCode)] = Date.now();
    writeJSON(DISMISS_KEY, dismissed);
  }

  function isDismissed(countryCode, languageCode) {
    return Boolean(readDismissed()[dismissedKey(countryCode, languageCode)]);
  }

  function readSwap() {
    const parsed = readJSON(SWAP_KEY);
    if (!parsed) return {};
    const ts = Number(parsed.ts);
    if (!Number.isFinite(ts) || Date.now() - ts >= SWAP_TTL_MS) {
      removeStorage(SWAP_KEY);
      return {};
    }
    return parsed;
  }

  function saveSwap(countryCode) {
    writeJSON(SWAP_KEY, {
      hasSwapped: true,
      countryCode: toUpper(countryCode || ''),
      ts: Date.now(),
    });
  }

  function normalizeMarketLink(link) {
    if (!link) return '/';
    let normalized = link;
    if (/^https?:\/\//i.test(normalized)) {
      try { normalized = new URL(normalized).pathname; } catch { return '/'; }
    }
    if (!normalized.startsWith('/')) normalized = '/' + normalized;
    if (normalized.length > 1) normalized = normalized.replace(/\/$/, '');
    return normalized || '/';
  }

  function getRedirectPath(currentMarketLink) {
    const fullPath = window.location.pathname + window.location.search + window.location.hash;
    const current = normalizeMarketLink(currentMarketLink);
    if (current === '/') return fullPath;
    if (fullPath.indexOf(current + '/') === 0) return fullPath.slice(current.length) || '/';
    if (fullPath === current) return '/';
    return fullPath;
  }

  function buildRedirectUrl(targetMarketLink, currentMarketLink) {
    if (!targetMarketLink) return '';
    const redirectPath = getRedirectPath(currentMarketLink);

    if (/^https?:\/\//i.test(targetMarketLink)) {
      try {
        const targetUrl = new URL(targetMarketLink);
        const basePath = (targetUrl.pathname || '').replace(/\/$/, '');
        const appendedPath = redirectPath.startsWith('/') ? redirectPath : '/' + redirectPath;
        if (!basePath || appendedPath.indexOf(basePath + '/') === 0) {
          targetUrl.pathname = appendedPath;
        } else if (appendedPath !== '/') {
          targetUrl.pathname = (basePath + appendedPath).replace(/\/\//g, '/');
        }
        return targetUrl.toString();
      } catch {
        return targetMarketLink;
      }
    }

    const normalizedTarget = normalizeMarketLink(targetMarketLink);
    if (normalizedTarget === '/') return window.location.origin + redirectPath;
    return window.location.origin + (normalizedTarget + redirectPath).replace(/\/\//g, '/');
  }

  function getSuggestionsUrl(currentCountry, currentLanguage) {
    const root = (window.routes && window.routes.root_url) || '/';
    const params = new URLSearchParams();
    params.append('country[enabled]', 'true');
    params.append('language[enabled]', 'true');
    if (currentCountry) params.append('country[exclude]', toUpper(currentCountry));
    if (currentLanguage) params.append('language[exclude]', toLower(currentLanguage));
    return root + 'browsing_context_suggestions.json?' + params.toString();
  }

  function resolveTarget(currentCountry, currentLanguage, payload) {
    const currentCountryUp = toUpper(currentCountry);
    const currentLanguageLow = toLower(currentLanguage);

    const suggestions = (payload && payload.suggestions) || [];
    for (const s of suggestions) {
      if (!s || !s.parts) continue;
      const country = toUpper(s.parts.country && s.parts.country.handle);
      const language = toLower(s.parts.language && s.parts.language.handle);
      if (!country && !language) continue;
      if (country !== currentCountryUp || language !== currentLanguageLow) {
        return {
          countryCode: country,
          countryName: s.parts.country && s.parts.country.name,
          languageCode: language,
        };
      }
    }

    const detected = (payload && payload.detected_values) || {};
    const country = toUpper(detected.country && detected.country.handle);
    const language = toLower(detected.language && detected.language.handle);
    if (!country && !language) return null;
    if (country === currentCountryUp && language === currentLanguageLow) return null;

    return {
      countryCode: country,
      countryName: detected.country && detected.country.name,
      languageCode: language,
    };
  }

  function getDetectedCountry(payload) {
    return toUpper(
      payload && payload.detected_values &&
      payload.detected_values.country && payload.detected_values.country.handle
    );
  }

  function submitLocalization(countryCode, languageCode) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/localization';
    form.style.display = 'none';

    const fields = {
      form_type: 'localization',
      utf8: '✓',
      _method: 'put',
      return_to: window.location.pathname + window.location.search + window.location.hash,
      country_code: toUpper(countryCode),
      language_code: toLower(languageCode),
    };
    Object.keys(fields).forEach((name) => {
      if (!fields[name]) return;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = fields[name];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  function showPrompt(wrapper) {
    if (!wrapper) return;
    wrapper.classList.remove('hidden');
    wrapper.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => {
      wrapper.classList.remove('translate-x-full', 'opacity-0');
      wrapper.classList.add('translate-x-0', 'opacity-100');
    });
  }

  function hidePrompt(wrapper) {
    if (!wrapper) return;
    wrapper.classList.remove('translate-x-0', 'opacity-100');
    wrapper.classList.add('translate-x-full', 'opacity-0');
    wrapper.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => wrapper.classList.add('hidden'), HIDE_ANIMATION_MS);
  }

  function init() {
    const wrapper = document.querySelector('.language-checker-wrapper');
    if (!wrapper) return;

    const dismissButton = wrapper.querySelector('.dismiss_button');
    const swapButton = wrapper.querySelector('.swap_button');
    const closeButton = wrapper.querySelector('.close');
    const titleEl = wrapper.querySelector('.localization-title');
    if (!dismissButton || !swapButton || !closeButton || !titleEl) return;

    const marketData = window.market || {};
    const marketLanguages = window.MARKET_LANGUAGES || {};
    const countryNames = window.COUNTRY_NAMES || {};
    const marketLinks = window.MARKET_LINKS || {};

    const browserLanguage = toLower(((navigator && navigator.language) || '').split('-')[0]);
    const currentCountry = toLower(marketData.currentCountry || (window.Shopify && window.Shopify.country));
    const currentLanguage = toLower(
      marketData.currentLanguage || (window.Shopify && window.Shopify.language) || browserLanguage
    );
    const currentMarketLink = marketData.currentMarketLink || '/';
    const normalizedCurrentMarketLink = normalizeMarketLink(currentMarketLink);

    if (!currentCountry && !currentLanguage) return;

    fetch(getSuggestionsUrl(currentCountry, currentLanguage), {
      method: 'GET',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to fetch browsing context suggestions');
        return response.json();
      })
      .then((payload) => {
        const target = resolveTarget(currentCountry, currentLanguage, payload);
        if (!target || !target.countryCode) return;

        const marketDefaultLanguage = toLower(marketLanguages[target.countryCode]);
        const fallbackLanguage = marketDefaultLanguage || browserLanguage;
        if (!target.languageCode && fallbackLanguage) target.languageCode = fallbackLanguage;

        if (isDismissed(target.countryCode, target.languageCode || '')) return;

        const targetMarketLink = marketLinks[target.countryCode];
        const normalizedTargetMarketLink = normalizeMarketLink(targetMarketLink);
        const resolvedLanguage = toLower(target.languageCode || fallbackLanguage);
        const isSameCountry = toUpper(target.countryCode) === toUpper(currentCountry);
        const isSameLanguage = !resolvedLanguage || resolvedLanguage === toLower(currentLanguage);
        const isSameMarket = normalizedTargetMarketLink === normalizedCurrentMarketLink;

        // Only surface when visitor is in a wrong shopping experience.
        if (isSameMarket || (isSameCountry && isSameLanguage)) return;

        const shouldRedirectByLink = Boolean(targetMarketLink) && !isSameMarket;
        const isCurrentMarketUS = toUpper(currentCountry) === 'US';
        const isOnRootMarket = normalizedCurrentMarketLink === '/';
        const swap = readSwap();
        const detectedCountry = getDetectedCountry(payload);
        const detectedMatchesSavedPreference =
          Boolean(detectedCountry) && detectedCountry === toUpper(swap.countryCode);
        // Auto-redirect only when the visitor landed on the root/default market
        // (i.e. hasn't deliberately navigated to a specific one), their saved
        // preference matches IP geo, and we're not on US (SEO: Googlebot).
        const canAutoRedirect =
          swap.hasSwapped &&
          !isCurrentMarketUS &&
          isOnRootMarket &&
          detectedMatchesSavedPreference;

        function go() {
          if (shouldRedirectByLink) {
            window.location.href = buildRedirectUrl(targetMarketLink, currentMarketLink);
            return;
          }
          submitLocalization(target.countryCode, target.languageCode || fallbackLanguage);
        }

        if (canAutoRedirect) {
          go();
          return;
        }

        const suggestedCountryName = target.countryName || countryNames[target.countryCode] || target.countryCode;
        const currentCountryName = countryNames[toUpper(currentCountry)] || toUpper(currentCountry);
        titleEl.textContent = replaceCountry(wrapper.dataset.i18nQuestion, suggestedCountryName);
        swapButton.textContent = replaceCountry(wrapper.dataset.i18nSwitch, suggestedCountryName);
        dismissButton.textContent = replaceCountry(wrapper.dataset.i18nStay, currentCountryName);

        function onKey(event) {
          if (event.key === 'Escape') dismiss();
        }

        function dismiss() {
          saveDismissed(target.countryCode, target.languageCode || '');
          document.removeEventListener('keydown', onKey);
          hidePrompt(wrapper);
        }

        closeButton.addEventListener('click', dismiss);
        dismissButton.addEventListener('click', dismiss);
        swapButton.addEventListener('click', () => {
          saveDismissed(target.countryCode, target.languageCode || '');
          saveSwap(target.countryCode);
          document.removeEventListener('keydown', onKey);
          go();
        });

        document.addEventListener('keydown', onKey);
        showPrompt(wrapper);
      })
      .catch((error) => {
        console.warn('Localization checker: suggestions fetch failed', error);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
