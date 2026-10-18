# Searchanise App — Update

**App:** Searchanise Search & Filter  
**Admin path:** Shopify Admin → Apps → Searchanise Search & Filter  
**Theme status:** Storefront pe heavily wired hai. Collection pages Searchanise ke bina empty dikhengi.

---

## 1. Theme / storefront pe kahan use ho raha hai

### A. Collection pages (main use)

Yeh app yahan **Shopify ka product grid replace** kar raha hai.

| Template | Section | Searchanise? |
|---|---|---|
| `collection.json` (default collections) | `collection-template` | **Haan** — poora grid + filters |
| `collection.no-image.json` | `collection-template` | **Haan** |
| Market contexts (Denmark / France / Europe) of above | same | **Haan** |
| `collection.early_access.json` | `collection-template-simple` | **Nahi** — native Shopify grid |
| Click-disabled collection | `collection-template-simple` | **Nahi** |

`collection-template.liquid` me Shopify product loop nahi hai. Sirf yeh mount hai:

- snippet: `snippets/searchanise-navigation.liquid`
- mount: `#snize_results`
- Searchanise JS yahan products, filters, sort, load more inject karta hai

Theme ke native filters **off** hain: `filter_mode: hidden`, sort/layout switch bhi off.

Collection pe Searchanise de raha hai:

- Product grid
- Horizontal filters (color, size, etc.)
- Sticky filter bar
- Mobile filter drawer
- Pagination / Load more

### B. Header instant search

Header search input Searchanise hijack karta hai.

- Autocomplete dropdown: `.snize-ac-results`
- Open state: `.snize-instant-widget-is-open`

Theme ka apna Prestige search (`SearchBar` + `search.ajax`) abhi code me hai, lekin live pe Searchanise upar se chalta hai.

### C. Search results page (`/search`)

Theme me native `main-search.liquid` hai, lekin Searchanise app JS `/search` ko bhi override karta hai (CSS me `.snize-search-results` styling hai).

### D. Theme custom logic jo Searchanise pe depend karti hai

Yeh extras Searchanise ke DOM pe chipke hue hain (`custom.scripts.js.liquid` + `custom.styles.scss.liquid`):

- A/B duplicate products hide (`-a-` / `-b-` handles)
- Collection / preorder / sale badges
- Hover pe available sizes (`/search?view=variants`)
- Collection timer + featured review clone into grid
- Color swatch + filter branding CSS

**Matlab:** app uninstall karoge bina replacement ke → collection pages blank + yeh extras toot jayenge.

---

## 2. Admin side pe kya kya deta hai

Control panel: **Apps → Searchanise Search & Filter**

| Admin section | Kya milta hai |
|---|---|
| **Indexation** | Products / collections / pages / blogs index. Force re-indexation |
| **Search & Navigation** | Instant search widget look, search preferences, SKU search, voice search, typo/autocomplete settings |
| **Synonyms** | “hoodie” = “sweatshirt” type mapping |
| **Redirects** | Search term → collection / page / URL pe bhejna |
| **Filters** | Filter list, collection filter trees, color/size/price/tag/metafield filters, hide/rename/reorder |
| **Filters on collections** | Collection pages pe Smart Navigation on/off, embed vs redirect |
| **Merchandising** | Product pin/boost/hide rules (Always, On Match, Keywords, Last) — products, tags, collections |
| **Banners** | Search / collection pe promo banners |
| **Product labels** | Searchanise wale badges |
| **Recommendations** | Recently viewed / upsell widgets |
| **Analytics** | Top searches, zero-result queries, clicks, conversions, popular filters |
| **Translations & Texts** | Widget / filter text translations |
| **Integrations** | Reviews, wishlist, translation apps, etc. |

**Important:** Admin me jo synonyms, merchandising, filter trees, banners set hain — woh theme code me nahi dikhte. Uninstall se pehle Searchanise admin ka **export / screenshot / list** nikalna zaroori hai, warna yeh rules lose ho sakte hain.

---

## 3. Alternative hai ya nahi?

**Haan, alternative hai.** Petrit Nord ke use-case ke hisaab se yeh options hain:

### Option 1 — Shopify Search & Discovery (recommended pehla step)

- **Price:** Free (Shopify official)
- **Admin:** Shopify Admin → Apps → Search & Discovery
- **Kya cover karta hai:**
  - Collection filters (color, size, price, availability, tags)
  - Synonyms
  - Search redirects
  - Product boost / hide for search terms
  - Related / complementary products
  - Basic search analytics (zero-result queries)
- **Theme pe kaam:** native `collection.filters` + Predictive Search API
- **Is store ke liye fit kyun:** `collection-template-simple` me native grid already kaam kar raha hai; badges / hover sizes native cards pe already hain

**Kamzor vs Searchanise:** typo tolerance, AI search, unlimited custom filter trees, search conversion analytics, banners, advanced merchandising rules.

### Option 2 — Paid search apps (agar merchandising/search quality zaroori ho)

| App | Kab use karein |
|---|---|
| **Boost AI Search & Filter** | Closest Searchanise replacement, filters + merchandising + analytics |
| **Algolia** | Best search quality / typo / speed, zyada cost + setup |
| **Klevu** | Strong AI search + merchandising |
| **Searchspring** | Larger catalog / heavy merchandising |

Yeh tab sochna jab Search & Discovery se search results / merchandising kam pad jaye.

### Option 3 — Theme-only native (bina extra app)

Sirf Liquid product loop + Shopify storefront filters.  
Possible hai, lekin synonyms / redirects / boost admin se manage nahi honge. Search & Discovery ke saath better hai.

---

## 4. Recommendation

1. Searchanise admin se **filters, synonyms, redirects, merchandising rules** list nikal lo.
2. Unhe **Search & Discovery** me recreate karo.
3. Theme me `collection-template` ko `collection-template-simple` jaisa native grid + Shopify filters pe lao.
4. Header autocomplete ko **Predictive Search** pe shift karo.
5. Phir Searchanise uninstall.

Agar search merchandising / zero-result analytics business ke liye critical hai, tab Search & Discovery ke saath **Boost** backup option rakho — Algolia tab jab search quality really weak lage.
