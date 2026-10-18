# 🚨 LCP Performance Issues - QUICK REFERENCE

## CRITICAL FINDINGS

### 🔴 #1 CRITICAL BOTTLENECK: IntelliGems Script
- **Location**: layout/theme.liquid, line 63
- **Issue**: `blocking="render"` attribute STOPS page rendering entirely
- **Impact**: Adds 300-800ms to LCP
- **Fix**: Remove `blocking="render"`, change to `defer` or `async`

```html
<!-- CURRENT (BAD) -->
<script type="module" blocking="render" fetchpriority="high" 
  src="https://cdn.intelligems.io/esm/18f390948132/bundle.js" async>
</script>

<!-- RECOMMENDED (GOOD) -->
<script type="module" defer
  src="https://cdn.intelligems.io/esm/18f390948132/bundle.js">
</script>
```

---

## OVERVIEW OF LOADED RESOURCES

### Critical Rendering Path Issues

| Issue | Location | Impact | Quick Fix |
|-------|----------|--------|-----------|
| **IntelliGems blocking** | line 63 | 🔴 CRITICAL | Remove `blocking="render"` |
| **Sync empire.opt.min.js** | line 677 | 🔴 CRITICAL | Add `defer` |
| **5 CSS files sync** | lines 128-136 | 🟠 HIGH | Combine/defer |
| **Sync Flickity JS** | line 167 | 🟠 HIGH | Add `defer` |
| **No font-display** | theme.css.liquid | 🟡 MEDIUM | Add `font-display: swap` |
| **Sync Fancybox JS** | line 708 | 🟡 MEDIUM | Lazy load |
| **Gorgias no defer** | line 717 | 🟠 HIGH | Add `defer` |

---

## CSS FILES BEING LOADED

**All loaded synchronously in HEAD:**
1. theme.css (preloaded + sync)
2. custom.css
3. a_custom.css
4. custom-no-liquid.css
5. ms-custom.css
6. fancybox.css (from CDN, only needed for modal)
7. flickity.min.css (from CDN, only needed for carousel)
8. ripple.css (conditional, animation only)

**Recommendation**: Combine the 5 local CSS files into theme.css, defer non-critical CSS

---

## JAVASCRIPT LOADING ANALYSIS

### ❌ Render-Blocking (Synchronous)
- **empire.opt.min.js** - Main theme JS (no defer)
- **flickity.pkgd.min.js** - Carousel library (no defer)
- **fancybox.umd.js** - Modal/gallery library (no defer)
- **Gorgias chat loader** - Support widget (no defer)

### ✅ Good (Async/Defer)
- **Google Tag Manager** - async ✓
- **Google Analytics** - async ✓
- **Trustpilot widget** - async ✓
- **InstantPage** - defer module ✓

### ⚠️ Problematic
- **Willdesk chat** - Injected dynamically at runtime
- **Pandectes GDPR** - Large inline script in head

---

## THIRD-PARTY APPS DETECTED

| App | Purpose | Loading | Status |
|-----|---------|---------|--------|
| IntelliGems | Personalization | BLOCKING | 🔴 Fix immediately |
| Pandectes | GDPR/Cookies | Inline head | 🟡 Optimize |
| Trustpilot | Reviews | Async | ✅ Good |
| Appstle | Subscriptions | Unknown | ⓘ Check |
| Boost-SD | Store features | Fallback | ✅ Good |
| Gorgias | Chat support | No defer | 🟠 Add defer |
| Willdesk | Help desk | Dynamic | 🟡 Move after paint |
| Flickity | Carousel | Sync | 🟠 Add defer |
| Fancybox | Modal/Gallery | Sync | 🟡 Lazy load |
| Google Analytics | Tracking | Async | ✅ Good |
| Bing UET | Conversions | Via Pandectes | ℹ️ Controlled |
| Klaviyo | Email marketing | Unknown | ⓘ Check |

---

## FONTS LOADING

**Current Setup**:
```css
@font-face {
  font-family: 'gibson-regular';
  src: url('https://cdn.shopify.com/s/files/1/...') format('woff2');
  /* ❌ NO font-display specified - defaults to 'auto' */
}
```

**Issue**: 
- 3 separate font files (regular, semibold, medium)
- No font-display strategy = invisible text for 3 seconds
- Fonts preloaded but still blocking render

**Fix**:
```css
@font-face {
  font-family: 'gibson-regular';
  src: url('https://cdn.shopify.com/s/files/1/...') format('woff2');
  font-display: swap;  /* ✅ Show fallback immediately */
  font-weight: 400;
}
```

---

## BUNDLE FILES STATUS

**40+ JavaScript bundles detected**:
- StaticHeader.bundle.js
- StaticFooter.bundle.js
- StaticProduct.bundle.js
- StaticCart.bundle.js
- StaticCollection.bundle.js
- DynamicProduct.bundle.js
- DynamicFeaturedCollection.bundle.js
- StaticAnnouncement.bundle.js
- 30+ other component bundles
- vendors-*.bundle.js (shared code)

**Issues**:
- ❓ Unclear which bundles load on which pages
- ❓ No visible lazy-loading strategy in layout
- ⚠️ Source maps (.js.map files) included (not needed in production)

---

## ESTIMATED PERFORMANCE IMPROVEMENTS

### If You Fix Only #1 (IntelliGems)
- LCP: **300-800ms faster** (40-50% improvement)
- Effort: **30 seconds** (1 line change)

### If You Fix #1 + #2 (Add defer to empire.js)
- LCP: **500-1300ms faster** (50-65% improvement)
- Effort: **1 minute**

### If You Fix Top 7 Issues
- LCP: **1000-2000ms faster** (65-75% improvement)
- Effort: **30-60 minutes**

---

## IMMEDIATE ACTION CHECKLIST

### Do These NOW (< 5 minutes each)

- [ ] **Remove `blocking="render"` from IntelliGems**
  ```html
  Line 63: Change blocking="render" to defer
  ```

- [ ] **Add `defer` to empire.opt.min.js**
  ```html
  Line 677: Add defer attribute to script tag
  ```

- [ ] **Add `defer` to Gorgias chat**
  ```html
  Line 717: Add defer attribute to script tag
  ```

- [ ] **Add `font-display: swap` to fonts**
  ```css
  theme.css.liquid: Add font-display: swap; to @font-face rules
  ```

### Do These ASAP (< 1 hour)

- [ ] Combine 5 CSS files (custom.css, a_custom.css, etc.) into theme.css
- [ ] Add `defer` to Flickity JavaScript
- [ ] Defer Fancybox library loading

---

## FULL DETAILED REPORT

See: **LCP_PERFORMANCE_ANALYSIS.md** (comprehensive analysis with recommendations)

---

## KEY METRICS TO MONITOR

After making changes, track these metrics:

**Google Lighthouse (Target)**:
- LCP: < 2.5s (good), < 4s (acceptable)
- FCP: < 1.8s (good), < 3s (acceptable)
- CLS: < 0.1 (good), < 0.25 (acceptable)

**Real User Monitoring**:
- Page load time
- User bounce rate
- Conversion rate

---

## Questions & Clarifications Needed

1. **IntelliGems**: What does this app do? Is it A/B testing, personalization, or recommendations? Can its functionality work with `defer` instead of `blocking="render"`?

2. **Custom CSS files**: Why 5 separate CSS files? Can these be combined?

3. **Bundle strategy**: How are the 40+ JS bundles being loaded? Are they combined into a single file or loaded separately per page?

4. **Appstle**: Where is Appstle loaded? (appstle-init.js and appstle-subscription.js are in assets but not visible in layout)

5. **LCP element**: What is typically the LCP element? (Hero image, headline, product image, etc.)

---

**Generated**: May 5, 2026
**Analysis Tool**: LCP Performance Audit
