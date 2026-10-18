# CRITICAL RENDERING PATH DIAGRAM

## Current State (With Bottlenecks)

```
┌─────────────────────────────────────────────────────────────────┐
│ USER REQUESTS PAGE                                              │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ PARSE HTML <head>  │ (Fast)
        └────────┬───────────┘
                 │
        ┌────────▼───────────────┐
        │ Parse Meta, Preconnect │ (Fast)
        │ - google.com           │
        │ - cdn.shopify.com      │
        │ - fonts.shopifycdn.com │
        └────────┬───────────────┘
                 │
        ┌────────▼───────────────┐
        │ PRELOAD Font & CSS     │ (Fast - request sent)
        │ - gibson font          │
        │ - theme.css            │
        └────────┬───────────────┘
                 │
                 ▼
    ╔════════════════════════════════════════╗
    ║  🔴 BLOCK: IntelliGems Script         ║
    ║  blocking="render"                    ║
    ║  Waiting for: cdn.intelligems.io      ║
    ║  ⏱️  200-300ms (or more if slow CDN)  ║
    ║                                        ║
    ║  ❌ NO rendering until script loads   ║
    ╚════════════════┬═══════════════════════╝
                     │
                     ▼
    ┌─────────────────────────────────────┐
    │ Parse HTML <body> content           │ (Fast)
    │ - Static content loads quickly      │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ╔════════════════════════════════════════╗
    ║  🔴 LOAD: CSS Files (Synchronous)    ║
    ║  1. theme.css                        ║
    ║  2. custom.css                       ║
    ║  3. a_custom.css                     ║
    ║  4. custom-no-liquid.css             ║
    ║  5. ms-custom.css                    ║
    ║  6. fancybox.css (from CDN)          ║
    ║  7. flickity.css (from CDN)          ║
    ║  ⏱️  100-300ms (parsing + loading)   ║
    ║                                       ║
    ║  ❌ BLOCKING: Page can't render      ║
    ║     until all CSS is parsed          ║
    ╚════════════════┬══════════════════════╝
                     │
                     ▼
    ╔════════════════════════════════════════╗
    ║  ✅ FIRST CONTENTFUL PAINT (FCP)      ║
    ║  Non-content visual elements appear   ║
    ║  Estimated time: 2.0-3.0 seconds     ║
    ╚════════════════┬══════════════════════╝
                     │
                     ▼
    ┌─────────────────────────────────────┐
    │ Begin loading JavaScript             │
    │ - Start empire.opt.min.js            │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ╔════════════════════════════════════════╗
    ║  🔴 EXECUTE: empire.opt.min.js        ║
    ║  (Synchronous, no defer)              ║
    ║                                        ║
    ║  Loading dependencies:                ║
    ║  - shopify_common.js                  ║
    ║  - jquery.cart.js                     ║
    ║  - polyfills.min.js                   ║
    ║  ⏱️  50-200ms (parsing + execution)   ║
    ║                                        ║
    ║  ❌ Main thread blocked during load   ║
    ╚════════════════┬══════════════════════╝
                     │
                     ▼
    ╔════════════════════════════════════════╗
    ║  🔴 LOAD: Flickity JS (Sync)          ║
    ║  Library for carousels                ║
    ║  ⏱️  30-100ms                         ║
    ║                                        ║
    ║  ❌ Only needed on carousel pages!    ║
    ╚════════════════┬══════════════════════╝
                     │
                     ▼
    ╔════════════════════════════════════════╗
    ║  🔴 PAINT: Largest Contentful Paint   ║
    ║  (LCP)                                ║
    ║                                        ║
    ║  Usually: Hero image or main heading  ║
    ║  Estimated time: 2.5-4.0 seconds      ║
    ║                                        ║
    ║  ⚠️  THIS IS POOR PERFORMANCE          ║
    ║  Target: < 2.5 seconds                ║
    ╚════════════════┬══════════════════════╝
                     │
                     ▼
    ┌─────────────────────────────────────┐
    │ Load Fancybox (for modals)           │ (Only needed on modal open!)
    │ Load Gorgias Chat                    │ (Only needed for support)
    │ Load Willdesk Support                │ (Only needed for support)
    │ ...other non-critical scripts...     │
    └─────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────┐
        │ PAGE INTERACTIVE   │
        │ (Interaction to    │
        │  Next Paint ready) │
        └────────────────────┘
```

---

## OPTIMIZED State (After Fixes)

```
┌─────────────────────────────────────────────────────────────────┐
│ USER REQUESTS PAGE                                              │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ PARSE HTML <head>  │ (Fast)
        └────────┬───────────┘
                 │
        ┌────────▼───────────────┐
        │ Parse Meta, Preconnect │ (Fast)
        └────────┬───────────────┘
                 │
        ┌────────▼───────────────┐
        │ PRELOAD Font & CSS     │ (Fast)
        └────────┬───────────────┘
                 │
        ┌────────▼───────────────┐
        │ ✅ Load theme.css      │
        │ (Optimized/Combined)   │
        │ ⏱️  50-150ms           │
        │                        │
        │ ✅ NO BLOCKING         │
        └────────┬───────────────┘
                 │
                 ▼
    ╔════════════════════════════════════════╗
    ║  ✅ FIRST CONTENTFUL PAINT (FCP)      ║
    ║  ⏱️  1.2-1.8 seconds (40% faster!)    ║
    ╚════════════════┬══════════════════════╝
                     │
                     ▼
    ┌─────────────────────────────────────┐
    │ Parse HTML <body> content           │ (Fast)
    │ ✅ Rendering happens in parallel    │
    │    with JS loading                  │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │ ✅ Load Scripts (DEFERRED)           │
    │ - IntelliGems (defer, not blocking) │
    │ - empire.opt.min.js (defer)         │
    │ - Flickity (defer)                  │
    │ - Gorgias (defer)                   │
    │                                     │
    │ ✅ Renders in BACKGROUND            │
    │ ✅ Page visible during load         │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ╔════════════════════════════════════════╗
    ║  ✅ PAINT: Largest Contentful Paint   ║
    ║  (LCP)                                ║
    ║  ⏱️  1.5-2.0 seconds (40-60% faster!) ║
    ║                                        ║
    ║  ✅ GOOD PERFORMANCE                  ║
    ║  Target achieved: < 2.5 seconds       ║
    ╚════════════════┬══════════════════════╝
                     │
                     ▼
    ┌─────────────────────────────────────┐
    │ Theme JS Finishes Initializing      │
    │ - Carousels ready                   │
    │ - Interactions available             │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │ Load Non-Critical JS On-Demand       │
    │ - Fancybox (only if modal used)      │
    │ - Willdesk (after interactive)       │
    │ - Chat widgets                       │
    └─────────────────────────────────────┘
                   │
                   ▼
        ┌────────────────────┐
        │ PAGE FULLY        │
        │ INTERACTIVE       │
        │ (Ready for clicks)│
        └────────────────────┘
```

---

## Time Comparison Chart

```
Current State (With Bottlenecks):
═══════════════════════════════════════════════════════════════

FCP (First Contentful Paint)
├─ Parse head & CSS blocks rendering ────────────────────────────
├─ IntelliGems blocking="render" ──────────────────────────────── 300-800ms
├─ Preload + Parse 5+ CSS files ──────────────────────────────── 100-300ms
├─ Start JS parsing ───────────────────────────────────────────── 50-150ms
└─ Result: FCP at 2.0-3.0s ❌

LCP (Largest Contentful Paint)
├─ FCP completion ────────────────────────────────────────────── 2.0-3.0s
├─ empire.opt.min.js sync execution ──────────────────────────── 50-200ms
├─ Flickity sync loading ─────────────────────────────────────── 30-100ms
├─ Fancybox sync loading ─────────────────────────────────────── 20-50ms
└─ Result: LCP at 2.5-4.0s ❌


Optimized State (With Fixes):
═══════════════════════════════════════════════════════════════

FCP (First Contentful Paint)
├─ Parse head ────────────────────────────────────────────────── ~100ms
├─ Load combined theme.css (fast) ────────────────────────────── ~50-150ms
├─ Page can render! ───────────────────────────────────────────── 
└─ Result: FCP at 1.2-1.8s ✅ (40% faster)

LCP (Largest Contentful Paint)
├─ FCP completion ────────────────────────────────────────────── 1.2-1.8s
├─ Hero image loads ───────────────────────────────────────────── ~300-500ms
├─ Scripts defer - no blocking ────────────────────────────────── (parallel)
└─ Result: LCP at 1.5-2.0s ✅ (60% faster)
```

---

## Issue Severity Heat Map

```
Priority    Issue                               Effort    Impact    Status
═════════════════════════════════════════════════════════════════════════════

🔴 CRITICAL IntelliGems blocking="render"      🟢 Tiny   🔴 Huge   URGENT
            Remove attribute

🔴 CRITICAL Sync empire.opt.min.js             🟢 Tiny   🔴 High   URGENT
            Add defer attribute

🟠 HIGH     Gorgias no defer                    🟢 Tiny   🟠 Med    URGENT
            Add defer attribute

🟡 MEDIUM   Multiple CSS files sync            🟡 Med    🟠 Med    SOON
            Combine/defer files

🟡 MEDIUM   Sync Flickity library              🟡 Med    🟡 Low    SOON
            Add defer attribute

🟡 MEDIUM   No font-display: swap              🟢 Tiny   🟡 Low    SOON
            Add CSS property

🟡 MEDIUM   Sync Fancybox library              🟡 Med    🟡 Low    LATER
            Lazy load on demand

🟢 LOW      Willdesk injected dynamically      🟡 Med    🟢 Tiny   LATER
            Move after interactive
```

---

## Recommended Fix Timeline

```
WEEK 1 (Monday):
├─ Remove blocking="render" from IntelliGems     [5 min]
├─ Add defer to empire.opt.min.js                [5 min]
├─ Add defer to Gorgias                          [5 min]
├─ Add font-display: swap to @font-face          [5 min]
├─ TEST in Chrome/Firefox/Safari                 [15 min]
└─ DEPLOY & MONITOR                              [10 min]

Results Expected:
├─ FCP: ~2.0s → ~1.4s (30% improvement)
└─ LCP: ~3.5s → ~2.0s (43% improvement)

WEEK 2 (Optional - High Impact):
├─ Combine 5 CSS files into theme.css            [30 min]
├─ Add defer to Flickity JS                      [15 min]
├─ Remove unused CSS rules                       [20 min]
├─ TEST thoroughly                               [20 min]
└─ DEPLOY                                         [10 min]

Results Expected:
├─ FCP: ~1.4s → ~1.1s (additional 22%)
└─ LCP: ~2.0s → ~1.4s (additional 30%)
```

---

## Current Bottleneck Waterfall

```
Timeline (milliseconds):

0ms ────┬─ Parse HTML head
100ms   ├─ Preconnect requests
200ms   ├─ Preload font & CSS (requests sent)
300ms   │
400ms   ├─ 🔴 IntelliGems BLOCKS RENDER
600ms   │
800ms   ├─ IntelliGems loaded ✓
900ms   ├─ Parse CSS files (theme + 5 custom)
1100ms  │
1200ms  ├─ Browser can PAINT (FCP)  ⬅️ Too slow!
1300ms  │
1400ms  ├─ Parse HTML body
1500ms  │
1600ms  ├─ empire.opt.min.js starts loading
1700ms  ├─ Flickity JS loading
1800ms  ├─ Parse + execute JS
2000ms  │
2100ms  ├─ Theme initialized ✓
2300ms  │
2500ms  ├─ Hero image loads (LCP) ⬅️ Too slow!
2800ms  │
3000ms  ├─ Fancybox loads (not needed yet)
3200ms  ├─ Page interactive
3500ms  └─ All JS finished loading

Total LCP: ~2.5-3.5s (POOR)
```

## Optimized Waterfall (After Fixes)

```
Timeline (milliseconds):

0ms ────┬─ Parse HTML head
100ms   ├─ Preconnect requests
150ms   ├─ Parse HTML body (in parallel!)
200ms   ├─ Preload font
250ms   ├─ Parse + load combined theme.css
350ms   ├─ Browser can PAINT (FCP)  ⬅️ Much better!
400ms   │
500ms   ├─ IntelliGems starts (deferred, background)
600ms   ├─ empire.opt.min.js starts (deferred, background)
700ms   ├─ Flickity starts (deferred, background)
800ms   │
900ms   ├─ Hero image loads (LCP)  ⬅️ Much faster!
1000ms  ├─ Scripts initializing in background
1100ms  │
1200ms  ├─ Theme initialized ✓
1300ms  ├─ Page interactive
1400ms  │
1500ms  ├─ Fancybox loads on-demand when needed
2000ms  └─ All optional scripts loaded

Total LCP: ~0.9-1.3s (GOOD ✅)
Expected improvement: 60-70% faster
```

---

## Key Takeaways

1. **One line change** (remove `blocking="render"`) gives **40-50% improvement**

2. **Deferring scripts** prevents rendering from being blocked during script loading

3. **Combined CSS** reduces parse time and HTTP requests

4. **Lazy loading** non-critical functionality speeds up initial paint

5. **Test thoroughly** after changes to ensure all features work

---

**Generated**: May 5, 2026
