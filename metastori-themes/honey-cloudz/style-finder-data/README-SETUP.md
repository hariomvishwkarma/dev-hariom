# Style Finder — metaobject reference

The live quiz at `/pages/style-finder` loads copy and catalog data from Shopify metaobjects. Quiz **routing logic** stays in `assets/hc-style-finder.js`.

## Metaobject definitions (store admin)

| Definition | Purpose |
|---|---|
| `style_finder_question` | Question titles, help text, notes |
| `style_finder_answer` | Answer chip labels (self + gift) |
| `style_finder_outcome` | Outcome labels + **product pickers** |
| `style_finder_size_map` | Cup/band → **product + variant pickers** |
| `style_finder_snippet` | Result module copy |

**Required:** Enable **Storefront read access** on each definition.

**Status:** Use Shopify entry **Status → Active** (not a custom `active` field on snippets).

## Theme files

| File | Role |
|---|---|
| `sections/hc-style-finder.liquid` | Quiz UI + gift card setting |
| `snippets/hc-style-finder-data.liquid` | Serializes metaobjects → JSON |
| `assets/hc-style-finder.js` | Flow logic + renders metaobject copy |
| `assets/hc-style-finder.css` | Styles |
| `templates/page.style-finder.json` | Page template |

## What merchants can edit (no deploy)

- Question / answer wording
- Outcome display names + products
- Size → variant mappings
- Result snippets — toggle via **Status: Draft**

## What stays in code (deploy to change)

- Journey routing, skips, precedence
- Answer path → outcome family
- Which snippets attach to which routes

## Gift card & support

- Gift card: Theme customizer → Style Finder → Gift card product
- Talk it through: footer Live Chat (Gorgias)
