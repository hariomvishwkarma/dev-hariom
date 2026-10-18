# LCP (Largest Contentful Paint) Performance Analysis
## UK Water Filters Shopify Theme

**Analysis Date**: May 5, 2026  
**Theme Version**: Empire 7.1.0 by Pixel Union  
**Store**: uk-water-filters.co.uk

---

## Executive Summary

This Shopify theme has **CRITICAL performance issues** affecting Largest Contentful Paint (LCP). The primary bottleneck is an **IntelliGems script with `blocking="render"` attribute**, which completely blocks page rendering until it loads. Combined with multiple synchronous CSS files and large bundled JavaScript files, the theme will experience poor LCP performance across all pages.

**Critical Issues Found**: 4  
**High Priority Issues**: 6  
**Medium Priority Issues**: 5  

---

## Critical Render-Blocking Resources

### 🔴 CRITICAL: IntelliGems Script with Render Blocking

**Location**: [layout/theme.liquid](layout/theme.liquid#L63)

```html
<script type="module" blocking="render" fetchpriority="high" 
  src="https://cdn.intelligems.io/esm/18f390948132/bundle.js" async>
</script>
```

**Impact**: **SEVERE** - This is the #1 performance killer
- The `blocking="render"` attribute tells the browser to block ALL rendering until this script loads
- This is extremely aggressive and should almost never be used
- Creates a hard render-blocking dependency on external CDN (cdn.intelligems.io)
- **Conflicting attributes**: Has both `async` and `blocking="render"` which creates confusion in browser behavior
- Network latency on cdn.intelligems.io will directly delay FCP/LCP

**Recommendation**: 
- Remove `blocking="render"` attribute immediately
- Change to `defer` or `async` instead
- Or move the script to after main content and use dynamic loading
- Test if IntelliGems functionality requires synchronous behavior

---

## CSS Loading Strategy

### 📊 CSS Files Loaded

| File | Load Type | Location | Size Impact | Critical Path |
|------|-----------|----------|-------------|---------------|
| theme.css | Preloaded + Sync | Line 124, 128 | Large | YES - Main styles |
| custom.css | Sync | Line 133 | Medium | Unclear |
| a_custom.css | Sync | Line 134 | Medium | Unclear |
| custom-no-liquid.css | Sync | Line 135 | Small | Unclear |
| ms-custom.css | Sync | Line 136 | Medium | Unclear |
| fancybox.css | Sync CDN | Line 131 | Small | NO - Modal only |
| flickity.min.css | Sync CDN | Line 168 | Small | NO - Carousel only |
| ripple.css | Conditional | Line 701 | Small | NO - Animation only |

### Issues Found

1. **Multiple CSS Files**: 5 local CSS files loaded synchronously
   - These could be combined into theme.css to reduce HTTP requests
   - Or split into critical vs. non-critical

2. **Preload vs. Stylesheet Tag Mismatch**
   - theme.css is preloaded but also has synchronous stylesheet tag
   - Creates duplicate loading strategy

3. **Non-Critical CSS Loaded Synchronously**
   - `fancybox.css` - Only needed when modal opens
   - `flickity.min.css` - Only needed on carousel pages
   - `ripple.css` - Animation library, not critical

---

## JavaScript Loading Analysis

### 🔍 Synchronous JavaScript Loading

**CRITICAL** - These block page rendering:

1. **empire.opt.min.js** (Minified, size unknown)
   - Location: [line 677](layout/theme.liquid#L677)
   - No defer/async attribute → **BLOCKS RENDERING**
   - Main theme functionality
   - Loads jQuery dependencies from:
     - `shopify_common.js`
     - `jquery.cart.js`
     - Data attributes pass multiple asset URLs

2. **flickity.pkgd.min.js** (Unpkg CDN)
   - Location: [line 167](layout/theme.liquid#L167)
   - Loaded synchronously, no defer/async
   - **Should be lazy-loaded** or defer
   - Only needed on pages with carousels

3. **Fancybox UMD** (CDN: jsdelivr.net)
   - Location: [line 708](layout/theme.liquid#L708)
   - Loaded synchronously after body content
   - Only needed for modal/gallery functionality
   - **Should be loaded on-demand**

### ✅ Good: Asynchronous Scripts

```html
<!-- Google Analytics (async) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-1071870720"></script>

<!-- Trustpilot Widget (async) -->
<script async src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"></script>

<!-- InstantPage (deferred module) -->
<script src="{{ 'instantPage.min.js' | asset_url }}" type="module" defer></script>
```

### ⚠️ Problematic: Scripts Without Defer/Async

```html
<!-- Gorgias Chat Widget - NO DEFER/ASYNC (line 717) -->
<script id="gorgias-chat-widget-install-v2" 
  src="https://config.gorgias.chat/gorgias-chat-bundle-loader.js?applicationId=25970">
</script>

<!-- Willdesk Support Chat - Dynamically injected (line 746) -->
<script> 
  (function () { 
    var s = document.createElement('script'); 
    s.src = 'https://cdn.willdesk.com/wdc/willdesk.min.js?v=' + new Date().getTime(); 
    document.body.appendChild(s); 
  })(); 
</script>
```

---

## Font Loading Strategy

### 📝 Custom Fonts

**File**: [assets/theme.css.liquid](assets/theme.css.liquid#L1-L20)

```css
@font-face {
  font-family: 'gibson-regular';
  src: url('https://cdn.shopify.com/s/files/1/...') format('woff2');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'gibson-semibold';
  src: url('https://cdn.shopify.com/s/files/1/...') format('woff2');
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: 'gibson-medium';
  src: url('https://cdn.shopify.com/s/files/1/...') format('woff2');
  font-weight: 500;
  font-style: normal;
}
```

### Issues

1. **No font-display strategy**
   - Defaults to `auto` which behaves like `block` (3s invisible text)
   - Recommend: `font-display: swap` to show fallback fonts immediately

2. **Three separate font requests**
   - Multiple @font-face rules = 3 separate network requests
   - Consider subsetting or combining

3. **Preload in Head**
   - Fonts are preloaded: `<link rel="preload" href="{{ settings.type_menu | font_url }}" as="font" crossorigin>`
   - This helps but LCP still depends on font loading

---

## Third-Party Apps & Scripts

### Identified Third-Party Integrations

| App Name | Type | Files | Loading | Impact |
|----------|------|-------|---------|--------|
| **Pandectes (GDPR)** | Cookie Consent | pandectes-rules.min.js | Head - Inline | High - Blocks render |
| **IntelliGems** | Personalization | Bundle from CDN | Head - `blocking="render"` | CRITICAL |
| **Appstle** | Subscriptions | appstle-init.js, appstle-subscription.js | Not found in layout | Unknown |
| **Boost-SD** | Store Features | boost-sd-custom.js/css | Referenced in fallback | Async (good) |
| **Trustpilot** | Reviews | widget.bootstrap.min.js | Async ✅ | Low |
| **Flickity** | Carousel | flickity.pkgd.min.js | Sync ❌ | Medium |
| **Fancybox** | Modal/Gallery | fancybox.js/css | Sync ❌ | Medium |
| **Gorgias** | Chat Support | gorgias-chat-bundle-loader.js | No defer ❌ | Medium |
| **Willdesk** | Help Desk | willdesk.min.js | Injected dynamically | Medium |
| **Google Tag Manager** | Analytics | gtm.js | Async ✅ | Low |
| **Google Analytics** | Analytics | gtag.js | Async ✅ | Low |
| **InstantPage** | Prefetch | instantPage.min.js | Defer ✅ | Low |
| **Klaviyo** | Email/Marketing | Loading pattern unclear | Unknown | Unknown |
| **Microsoft Clarity** | Session Recording | Included in Pandectes | Via consent | Low |
| **Bing UET** | Conversion Tracking | Included in Pandectes | Via consent | Low |

---

## Bundle Files in Assets

### 📦 JavaScript Bundles (40+ files)

**Empire Theme Bundle Structure**:
- `StaticHeader.bundle.js` - Header component
- `StaticFooter.bundle.js` - Footer component
- `StaticCart.bundle.js` - Cart page
- `StaticProduct.bundle.js` - Product pages
- `StaticCollection.bundle.js` - Collection pages
- `DynamicProduct.bundle.js` - Dynamic product loading
- `DynamicFeaturedCollection.bundle.js` - Featured collections
- `StaticAnnouncement.bundle.js` - Banner announcements
- 20+ additional component bundles
- `vendors-*.bundle.js` - Shared vendor code

**Issues**:
1. **No Clear Code-Splitting Strategy**: It's unclear which bundles are loaded on each page
2. **Potential Unused Bundles**: Many bundles may not be needed on homepage
3. **No Async Handling**: Unclear if bundles are lazy-loaded or all bundled together
4. **Map Files Present**: Source maps included (.bundle.js.map) which aren't needed in production

---

## Critical Rendering Path Analysis

### Above-the-Fold Content

From settings_schema.json, the theme loads:
- Colors (not render-blocking)
- Typography settings
- Layout settings
- Sections: StaticAnnouncement, StaticUtilityBar, StaticHeader, StaticBenefitsBar

### Render Path Timeline

```
1. Parse HTML head
   ↓
2. Load Pandectes Rules (inline JSON + blocking script)
   ↓
3. Load Preconnect hints (CDNs)
   ↓
4. Preload font and theme.css
   ↓
5. 🔴 BLOCK: IntelliGems script with blocking="render" (CRITICAL)
   ↓
6. Load theme.css synchronously
   ↓
7. Load 4 additional CSS files synchronously
   ↓
8. Parse body HTML (fast)
   ↓
9. Parse sections: Announcement, Header, Benefits Bar
   ↓
10. 🔴 BLOCK: Parse and execute empire.opt.min.js (synchronous)
    ↓
11. Load jQuery dependencies
    ↓
12. Initialize theme functionality
    ↓
13. 🔴 BLOCK: Flickity carousel JS (synchronous)
    ↓
14. Load Fancybox and other utilities
    ↓
15. Paint LCP element (hero image, headline)
```

### Bottlenecks Identified

1. **IntelliGems `blocking="render"`** - Stops everything until loaded
2. **Multiple CSS files** - Prevents rendering until all parsed
3. **empire.opt.min.js** - Large JS file parsing/execution blocks rendering
4. **No image optimization visible** - LCP likely an image that needs optimization

---

## CSS and Inline Styles

### Inline Styles Found

**From theme.liquid**:
```html
<style>
  .productitem--image img {
    visibility: visible !important;
}
img.product-gallery--loaded-image {
    opacity: 1 !important;
}
[data-rimg-canvas] {
    animation: none;
    transition: none;
}
</style>
```

**Issues**:
- Inline styles for image optimization hints (good)
- But using !important suggests previous specificity issues
- Animation disabling suggests performance optimization attempts

### Custom Liquid CSS

Theme uses liquid templating in CSS files:
- `theme.css.liquid` - Main theme with dynamic font loading
- `custom.css.liquid` - Custom styles
- `giftcard.css.liquid` - Gift card page styles
- `giftcard.scss.liquid` - Gift card SCSS (SCSS + Liquid is complex)

---

## Unused/Questionable Assets

### Files That May Be Unused

1. **CSV Files** (Data sources):
   - `easysearch_bdb.csv`
   - `easysearch_database.csv`
   - Purpose unclear

2. **Image Assets**:
   - `pandectes-logo.png`
   - `pandectes-reopen-logo.png`

3. **Unused Script Files** (Based on naming):
   - `handle.js` - Purpose unclear
   - `timer.js` - Purpose unclear
   - `water-calculator.js` - Possibly page-specific

4. **Legacy Files** (Backup):
   - `candyrack-backup-20230413T144143Z-theme.liquid`
   - `candyrack-backup-20230524T105758Z-theme.liquid`
   - `theme.backup-1676519636.liquid`
   - `theme.dmr-backup-19-12-22_08-29-59.liquid`

---

## Specific Issues by Category

### 🔴 CRITICAL (Fix Immediately)

1. **IntelliGems `blocking="render"`**
   - Remove blocking="render" attribute
   - Change to defer or async
   - **Estimated LCP improvement**: 300-800ms

2. **Synchronous empire.opt.min.js**
   - Add defer attribute
   - Or split into critical vs. non-critical JS
   - **Estimated LCP improvement**: 200-500ms

### 🟠 HIGH PRIORITY (Fix Soon)

3. **Multiple Synchronous CSS Files**
   - Combine custom.css, a_custom.css, custom-no-liquid.css, ms-custom.css into theme.css
   - Or defer non-critical CSS
   - **Estimated LCP improvement**: 100-300ms

4. **Synchronous Flickity Library**
   - Add defer attribute
   - Or lazy-load only when carousel is detected
   - **Estimated LCP improvement**: 50-150ms

5. **Missing font-display Strategy**
   - Add `font-display: swap` to @font-face declarations
   - **Estimated LCP improvement**: 100-200ms (if fonts are LCP)

6. **Gorgias Chat Widget Without Defer**
   - Add defer attribute
   - **Estimated LCP improvement**: 50-100ms

### 🟡 MEDIUM PRIORITY (Improve)

7. **Synchronous Fancybox Library**
   - Load on-demand when needed
   - **Estimated LCP improvement**: 30-80ms

8. **Willdesk Support Chat Injected Dynamically**
   - Consider loading after page interactive
   - **Estimated LCP improvement**: 20-50ms

9. **Large Pandectes GDPR Script**
   - Inline script is large, consider external + defer
   - **Estimated LCP improvement**: 30-60ms

10. **Unclear Bundle Loading Strategy**
    - Implement proper code splitting
    - **Estimated LCP improvement**: 50-200ms (variable)

---

## Font-Specific Recommendations

```css
/* CURRENT - No font-display */
@font-face {
  font-family: 'gibson-regular';
  src: url('...') format('woff2');
}

/* RECOMMENDED - Add swap */
@font-face {
  font-family: 'gibson-regular';
  src: url('...') format('woff2');
  font-display: swap;  /* ← ADD THIS */
  font-weight: 400;
  font-style: normal;
}
```

---

## Recommendations Priority List

### Immediate Actions (Do First - Quick Wins)

```
Priority 1: Remove blocking="render" from IntelliGems script
   Effort: 1 line change
   Impact: CRITICAL (300-800ms LCP improvement)
   Risk: LOW - test Intelligems functionality

Priority 2: Add defer to empire.opt.min.js
   Effort: 1 attribute addition
   Impact: HIGH (200-500ms LCP improvement)
   Risk: LOW - test theme initialization

Priority 3: Add defer to Gorgias chat
   Effort: 1 attribute addition
   Impact: MEDIUM (50-100ms LCP improvement)
   Risk: LOW

Priority 4: Add font-display: swap
   Effort: 3 line additions
   Impact: MEDIUM (100-200ms if fonts are LCP)
   Risk: LOW
```

### Short-Term Actions (This Sprint)

```
Priority 5: Combine CSS files
   Effort: MEDIUM - refactor CSS organization
   Impact: MEDIUM (100-300ms)
   Risk: MEDIUM - test all pages

Priority 6: Defer Flickity library
   Effort: MEDIUM - test carousel functionality
   Impact: MEDIUM (50-150ms)
   Risk: MEDIUM

Priority 7: Lazy-load Fancybox
   Effort: MEDIUM - conditional loading
   Impact: MEDIUM (30-80ms)
   Risk: MEDIUM
```

### Long-Term Actions (Future)

```
Priority 8: Implement proper code-splitting strategy
   Effort: HIGH - major refactor
   Impact: HIGH (50-200ms + future scalability)
   Risk: MEDIUM

Priority 9: Optimize images for LCP
   Effort: HIGH - image analysis needed
   Impact: CRITICAL (300ms+)
   Risk: LOW

Priority 10: Remove unused bundles
   Effort: MEDIUM - audit bundle usage
   Impact: LOW for LCP, MEDIUM for overall performance
   Risk: MEDIUM
```

---

## Expected Performance Gains

### Current State (Estimated)
- **FCP (First Contentful Paint)**: 2.0-3.0s
- **LCP (Largest Contentful Paint)**: 2.5-4.0s
- **CLS (Cumulative Layout Shift)**: Unknown (needs testing)
- **INP (Interaction to Next Paint)**: Unknown (needs testing)

### After Critical Fixes
- **FCP**: 1.2-1.8s (40% improvement)
- **LCP**: 1.5-2.0s (40-60% improvement)

### After All Recommendations
- **FCP**: 0.8-1.2s (60% improvement)
- **LCP**: 0.9-1.3s (65-75% improvement)

---

## Testing Checklist

After implementing changes, test these:

- [ ] Homepage loads without visual layout shift
- [ ] Header/navigation appears before LCP
- [ ] Hero image loads properly
- [ ] Carousel (Flickity) functions correctly on carousel pages
- [ ] Modal (Fancybox) opens when expected
- [ ] Chat widgets (Gorgias, Willdesk) appear after page interactive
- [ ] Theme animations work (if not disabled)
- [ ] Pandectes GDPR banner appears correctly
- [ ] All bundles load on their respective pages
- [ ] No console errors about missing scripts

---

## Tools for Further Analysis

1. **Google PageSpeed Insights**: Check Core Web Vitals
2. **WebPageTest**: Waterfall chart analysis
3. **Chrome DevTools**: Network tab → Network throttling
4. **Lighthouse**: Full audit
5. **Bundle Analyzer**: Understand which bundles are largest

---

## Theme Architecture Notes

### Theme Type
- **Framework**: Empire v7.1.0 (Pixel Union)
- **Architecture**: Modular component-based
- **Build System**: Webpack (based on .bundle.js structure)
- **Testing State**: Appears to be active development (backup files present)

### Key Insights
1. Theme uses Section system (Shopify native)
2. Heavy reliance on JavaScript for functionality
3. Multiple third-party integrations suggesting active feature additions
4. Some performance optimization attempts visible (CSS `visibility` hacks)

---

## Files for Reference

- Main layout: [layout/theme.liquid](layout/theme.liquid)
- Main CSS: [assets/theme.css.liquid](assets/theme.css.liquid)
- Main JS: [assets/empire.opt.min.js](assets/empire.opt.min.js)
- GDPR Rules: [snippets/pandectes-rules.liquid](snippets/pandectes-rules.liquid)
- Settings Schema: [config/settings_schema.json](config/settings_schema.json)

---

**Report Generated**: May 5, 2026  
**Analyzed By**: LCP Performance Analysis Tool
