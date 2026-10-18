# Bundle Subscription — Client Update

**Product template:** `product.bundle-product`  
**Theme block:** Product page → **Bundle subscription**

---

## What’s live on the product page

Custom bundle selector for subscription products:

- **Color** and **size** (if product has those options)
- **Pack size** cards with image, price, compare price, and savings line
- **Purchase type:** Subscription or one-time
- **Delivery frequency** (subscription only, from Loop selling plans)
- **Trust bullets** below the selector
- **Delivery note** under the Add to cart button (subscription only)
- **Price on Add to cart button** updates with selection

The default Shopify variant picker stays in the background (hidden) so gallery, URL, and cart stay in sync.

---

## Theme customizer — all settings in one block

**Customize theme → Product page → Bundle subscription**

### General

| Setting | What it controls |
|--------|-------------------|
| **Pack savings display** | Auto savings format: percent, kr saved, or kr per pair (when pack value line is empty) |
| **Recommended delivery frequency** | Selling plan name to pre-select + *Anbefalt* tag (must match Loop exactly) |

### Pack 1 / 2 / 3

Matches **1st, 2nd, 3rd** pack option on the product:

| Field | Purpose |
|-------|---------|
| Badge | Optional label on top of card (also applies popular card styling when filled) |
| Note (subscription) | Line under pack name when **Abonnement** is selected |
| Note (one-time) | Line when **Engangskjøp** is selected |
| Value line (subscription) | e.g. *spar 20%* — empty = auto-calculated |
| Value line (one-time) | empty = auto-calculated |

### Labels & display

| Setting | What it controls |
|--------|-------------------|
| **Selected indicator** | Text when a pack is selected (e.g. *Valgt*) |
| **Selected state color** | Border and selected text color |
| **Purchase type / subscription / one-time labels** | Kjøpsform section copy |
| **Frequency label** | Text before delivery intervals |
| **Recommended label** | Tag on recommended interval |
| **Show tagline / Tagline** | Short line above bundle UI |
| **Trust info content** | Rich text bullets below selector |

**From Shopify only (not theme settings):**

- Color / size / **pack headings** → product **option names** (Farge, Størrelse, Pakke)
- Pack **photos** → **variant images** in Shopify admin
- Subscription **plans & prices** → Loop + selling plans on variants
- Microcopy under Add to cart → fixed template in code (`Første levering nå · neste om X måneder`)
- Add to cart price suffix → fixed in code (` – [price]`)

---

## Images on pack cards

- Set a **featured image on each variant** in Shopify (Products → Variants).
- Each pack row shows the image for **current color + size + that pack**.
- Color and size rows have no thumbnails.

---

## Shopify / Loop setup

1. Product uses template **bundle product** (Bundle subscription + Variant picker blocks).
2. **Loop** selling plans on all relevant variants.
3. Pack option values as set in Shopify (e.g. `5 par`, `10 par`, `15 par`).

---

## Where to edit what

| Want to change… | Where |
|-----------------|--------|
| All text, colors, pack copy, popular pack, savings format | Theme → Bundle subscription |
| Pack photos | Variant images in Shopify |
| Subscription intervals & prices | Loop |

---

*No product metafields required for the bundle block.*
