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

## Theme customizer settings (Bundle subscription block)

| Setting | What it controls |
|--------|-------------------|
| **Popular pack badge** | Label on the “most popular” pack (e.g. *Mest populær*) |
| **Popular pack note** | Extra line under that pack (optional) |
| **Selected indicator** | Text when a pack is selected (e.g. *Valgt*) |
| **Selected state color** | Border, focus, and selected text color for all options + popular badge when selected |
| **Purchase type label** | Heading above Subscribe / One-time |
| **Subscription label** | Subscribe option title |
| **Subscription savings hint** | Small line under Subscribe (default text; % updates automatically when possible) |
| **One-time label** | One-time purchase option title |
| **Frequency label** | Text before delivery interval pills (e.g. *Påfyll hver:*) |
| **Recommended label** | Tag on recommended interval (e.g. *Anbefalt*) |
| **Show product tagline** | On/off line under product title area |
| **Tagline fallback** | Text if product has no tagline metafield |
| **Trust info content** | Rich text (icons + bullets, e.g. no lock-in, free shipping) |

**Not in theme settings (fixed in code):**

- Color / size / **pack headings** → from Shopify **option names** (e.g. Farge, Størrelse, Pakke)
- Pack savings text format → product metafield (see below)
- Microcopy under Add to cart → fixed Norwegian template with selected months
- Add to cart price suffix → ` – [price]`

---

## Product metafields (per product in Shopify Admin)

| Metafield | Values | Purpose |
|-----------|--------|---------|
| `custom.most_popular_pack` | Number, e.g. `15` | Which pack gets the popular badge (matches pack quantity in option name) |
| `custom.recommended_frequency` | Text, e.g. `Deliver every 4 months` | Which selling plan is pre-selected and tagged *Anbefalt* |
| `custom.value_display_mode` | `percent` · `nok_saved` · `per_pair` | How savings show on pack cards |
| `custom.tagline` | Text | Short line above bundle UI (optional) |

---

## Images on pack cards

- Set a **featured image on each variant** in Shopify (Products → Variants).
- Each pack row shows the image for **current color + size + that pack**.
- If a variant has no image, the main product image is used.
- Color and size rows have **no** thumbnails (pack only).

---

## Shopify / Loop setup (your team)

1. Product must use template **bundle product** (or equivalent with **Bundle subscription** + **Variant picker** blocks).
2. **Loop** selling plans attached to all relevant variants.
3. Option names should include recognizable words for auto-detection: color (*farge/color*), size (*størrelse/size*), pack (*pakke/pack/par*).

---

## Customer experience (short)

| Action | Result |
|--------|--------|
| Change color / size | Pack prices, images, and frequency options update |
| Change pack | Variant, gallery, and prices update |
| Choose **Subscription** | Frequency + note under Add to cart visible |
| Choose **One-time** | Frequency and note hidden; one-time price on option |
| Add to cart | Correct variant + selling plan sent to cart |

---

## Where to edit what

| Want to change… | Where |
|-----------------|--------|
| Wording, colors, trust text | Theme customizer → Product → Bundle subscription |
| Popular pack, recommended interval, savings format, tagline | Product metafields |
| Pack photos | Variant images in Shopify |
| Subscription intervals & prices | Loop + variant selling plans |

---

*Questions or copy changes — list the setting or metafield name above.*
