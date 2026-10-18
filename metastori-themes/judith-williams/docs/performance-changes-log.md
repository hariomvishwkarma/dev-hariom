# Performance changes log — Speed / Core Web Vitals

Is file mein **speed & performance** se related saari changes note ki jayengi. Jab aap kahenge tab inka **LCP, CLS, FCP, INP** par asar ki report bana di jayegi.

---

## Kaise use karein

- **Change karte waqt:** Jo bhi performance-related edit (images, CSS, JS, fonts, sections) karo, mujhe bata dena — main yahan entry add kar dunga.
- **Report chahiye:** Jab sab changes ho jayein, bolo **"report bana do"** / **"performance report bana na"** — main is log se impact report bana dunga.

---

## Changes log (chronological)

| # | Date | File(s) | Kya change kiya | LCP | CLS | FCP | INP |
|---|------|---------|-----------------|-----|-----|-----|-----|
| 1 | 2025-03 | theme.js, custom.js | Collection grid view: desktop par server-rendered \`data-view\` preserve (theme.js); mobile par setInterval hata kar sirf ek baar \`applyMobileGridViewOnce\` (custom.js) | — | **CLS ↓** (list→medium flash fix) | FCP slight ↑ | INP ↑ (no 300ms interval) |

---

## Report section — Performance impact report (2025-03)

### 1. Summary

- **Total implemented changes:** 1 (collection page grid view).
- **Focus area:** Collection page — layout shift (CLS) aur unnecessary JS (INP) fix.
- **Theme.liquid:** Sirf audit/suggestions kiye gaye; abhi koi code change nahi.

---

### 2. Implemented changes — per-metric impact

| # | File(s) | Change | LCP | CLS | FCP | INP |
|---|---------|--------|-----|-----|-----|-----|
| 1 | theme.js, custom.js | Collection grid: desktop par Liquid `data-view` preserve; mobile par setInterval hata kar theme.js se control (desktop = Liquid, mobile = data-default-mobile, resize = screen ke hisaab). | — | **↓ Better** — list→medium flash fix, initial view ab shift nahi hota | Slight ↑ — kam JS on load | **↑ Better** — 300ms setInterval remove, main thread kam load |

**LCP:** Is change se direct LCP impact nahi; layout stable hone se indirectly LCP measure stable reh sakta hai.  
**CLS:** Pehle refresh par grid list se medium me jump karta tha → ab Liquid value + resize logic se stable.  
**FCP:** Thoda better — mobile par repeated DOM updates nahi.  
**INP:** Clearly better — har 300ms wala interval hata diya, main thread lighter.

---

### 3. Recommendations (next steps) — theme.liquid audit se

Ye abhi **implement nahi** kiye gaye; in par kaam kiya to LCP / FCP / INP aur improve ho sakte hain:

| Priority | Kya karna | Expected impact |
|----------|-----------|------------------|
| **High** | jQuery (L226) — defer ya conditional load (sirf product/collection/home jahan zaroori) | LCP ↓, FCP ↓, INP ↑ |
| **High** | Judge.me (L246–274 + related scripts) — sirf product/collection par load karo | FCP ↓, LCP ↓, INP ↑ |
| **Medium** | Slick carousel CSS (L12) — conditional (sirf home/product) | FCP ↓, LCP ↓ |
| **Medium** | Flickity setInterval 100ms (L517–523) — conditional ya sirf carousel pages par | INP ↑ |
| **Medium** | Sticky add-to-cart script (L358–409) — `{% if template contains 'product' %}` wrap | FCP ↑ (parse kam) |
| **Low** | validation.css / validation.js — sirf form wale templates par | FCP ↑ |
| **Low** | rewardFunc (L179–192) — sirf account/subscribe page par | Chota FCP gain |

---

### 4. Metric-wise summary (current state)

| Metric | Implemented change se asar | Aur improve karne ke liye (suggestions) |
|--------|----------------------------|----------------------------------------|
| **LCP** | Indirect (layout stable) | jQuery defer, Judge.me conditional, Slick CSS conditional |
| **CLS** | **↓ Better** (collection grid flash fix) | — |
| **FCP** | Slight ↑ | jQuery, Judge.me, validation.css/js conditional |
| **INP** | **↑ Better** (no 300ms interval) | Judge.me conditional, Flickity interval conditional |

---

*Report date: 2025-03. Neeche Theme.liquid audit table refer kar sakte ho.*

---

---

## Theme.liquid audit (suggestions only — no code change)

*Audit date: 2025-03 — layout/theme.liquid. Sirf suggestions; implementation baad me.*

| Location | Issue | Product/Collection specific but loads everywhere? | Expected impact |
|----------|--------|---------------------------------------------------|------------------|
| L4 | `pandectes-rules.js` in `<head>`, blocking | No | FCP, LCP (blocking parse) |
| L11 | Ablyft script – no defer/async, external | No | FCP, LCP |
| L12 | Slick carousel CSS (jsDelivr) – carousel/slider ke liye | **Yes** – home/product sliders; not needed on blog, cart, most pages | FCP, LCP (extra CSS everywhere) |
| L94 | `country-flags.css` – multi-currency | Only needed where currency selector | Minor FCP (small file) |
| L95–96 | `theme.css` + `validation.css` | **validation.css** – forms (product, contact, customer) ke liye; not needed on all pages | FCP (unused CSS on many pages) |
| L110–155 | `theme.routes` / `theme.strings` / `theme.settings` – product, cart, quickView, quickAdd, etc. | Partly – cart drawer global hai, but product-only strings sab jagah | FCP (parse + eval on every page) |
| L179–192 | `rewardFunc()` – newsletter subscribe button ke liye | **Yes** – used only on `account/subscribe` (L306) | Small – script sab jagah parse ho raha |
| L201 | `validation.js` | **Yes** – form validation; product/contact/customer | FCP, INP (unused on blog, collection, etc.) |
| L221–224 | `stylesheet.css`, `custom.css`, `font_mobile.css` | No (global) | — |
| L226 | **jQuery** – sync load, no defer | **Yes** – sliders, cart, product gallery; many pages don’t need it | **LCP, FCP (blocking), INP** – major |
| L246–274 | Judge.me (dns-prefetch, metafields, loader 2s delay) | **Yes** – reviews/product badges; mainly product (and collection if badges) | FCP, LCP, INP – heavy on all pages |
| L326–334 | Templates: `naturalImageMarkup`, `fixedRatioImageMarkup`, `articleImageMarkup` | **natural/fixed** – collection/product grid; **article** – blog | Minor DOM weight on non-relevant pages |
| L358–409 | Sticky add-to-cart **script** (quantity sync, button click) | **Yes** – only when `#apply_sticky` exists (product only) | Script sent on every page; product-only would help FCP/parse |
| L424–461 | `updateReviewCount` – setInterval 300ms, 20 times; Judge.me badge text | **Yes** – product/collection review badges | **INP, LCP** (main thread, reflows) on all pages |
| L462–511 | `updateBadges` – MutationObserver on `document.body`, Judge.me badges | **Yes** – product/collection | **INP** (heavy on all pages) |
| L517–523 | setInterval 100ms – Flickity slider `aria-hidden` fix | **Yes** – carousels (product gallery, home) | **INP** (runs every 100ms on every page) |
| L526–471 | Judge.me carousel (review links, product images), setInterval 500ms | **Yes** – product/review pages | INP, unnecessary on non-product |
| L473–480 | `jdgm.doneSetup` – Judge.me links | **Yes** – review widgets | Small, but product-focused |

*Is file ko mat delete karo; bas changes karte raho, report baad mein bana denge.*
