# Theme Update — Client Summary

**Project:** Qore8 Health  
**Date:** June 2026  
**Scope:** Product page gallery, Image with Scrolling Text, Parallax section

This document explains the recent theme improvements and how to use the new settings in the Shopify theme editor.

---

## 1. Product Page — New Image Layout: Hero Image + 2 Column Grid

**Where:** Online Store → Customize → **Product page** → Product information section

### Desktop layout → **Hero image + 2 column grid**

A new desktop-only product image layout:

| Position | Layout |
|----------|--------|
| **First image** | Full width (single row) |
| **All other images** | Two images per row |

**Mobile is unchanged** — product images still use the standard carousel/slider on phones and tablets (below 1200px width).

### How it differs from “Collage”

| | Collage | Hero image + 2 column grid |
|---|---------|------------------------------|
| First image | Full width | Full width |
| Middle images | 2 per row | 2 per row |
| Last image (when even total) | May span full width | Always stays in the 2-column grid |

---

## 2. Product Page — Hero Grid Aspect Ratio (Desktop)

**Visible only when Desktop layout = Hero image + 2 column grid**

| Setting | What it does |
|---------|----------------|
| **Enable image aspect ratio** | Turn ON to force all gallery images into a consistent shape on desktop. Turn OFF to show images at their natural proportions. |
| **Image aspect ratio** | Choose how images are cropped when enabled (see options below). |
| **Custom aspect ratio** | Appears only when aspect ratio = **Custom**. Slider value ÷ 10 = width-to-height ratio. |

### Aspect ratio options

| Option | Result |
|--------|--------|
| **Original** | Each image keeps its own natural proportions |
| **Portrait** | Theme portrait ratio (taller images) |
| **Square** | 1:1 square crop |
| **Custom** | You set the exact ratio with the slider |

### Custom slider guide (desktop)

Slider range: **5 – 20** (default: **7**)

| Slider | Ratio | Visual effect |
|--------|-------|----------------|
| 5 | 0.5 | Wider / shorter |
| 7 | 0.7 | Default — balanced portrait feel |
| 10 | 1.0 | Square |
| 15 | 1.5 | Wide landscape |
| 20 | 2.0 | Very wide |

Images use **cover** cropping when aspect ratio is enabled, so edges may be trimmed to fit the chosen ratio.

---

## 3. Product Page — Mobile Aspect Ratio

**Where:** Same Product information section → **Mobile** area (below Desktop settings)

| Setting | What it does |
|---------|----------------|
| **Enable image aspect ratio** | Turn ON to control mobile carousel image shape. Turn OFF for the theme default (square 1:1 slides). |
| **Mobile image aspect ratio** | Same options as desktop: Original, Portrait, Square, Custom |
| **Custom aspect ratio** | Same slider as desktop (5–20, default 7). Formula: slider ÷ 10 |

**Applies to:** Mobile product gallery carousel (screens **899px and below**), regardless of which desktop layout is selected.

### Recommended starting points

| Goal | Suggested setting |
|------|-------------------|
| Square mobile images | Enable ON → **Square** |
| Match desktop hero-grid feel | Enable ON → **Custom** → slider **7** |
| Show full product without crop | Enable ON → **Original** |

---

## 4. Image with Scrolling Text — Large Screen Fix

**Section:** Image with scrolling text (storytelling section)

### Problem solved
On very wide screens or when zoomed out, the section used to grow too tall (`100vh`), leaving empty space at the top and bottom.

### Behavior now (screens wider than 1600px)

- Section height is **fixed** based on the product/image content (not full viewport height)
- The **left image stays in place** while text scrolls inside the right panel
- Text blocks **center vertically** as you scroll
- Scrollbar is **hidden** but scrolling still works (mouse wheel, touch, trackpad)
- Image displays **fully** without harsh cropping (`object-fit: contain`)

**No new theme settings** — this is automatic on large desktops.

**Mobile / tablet (below 1600px):** Original scroll behavior is preserved.

---

## 5. Parallax Section — Large Screen Height Fix

**Section:** Parallax

### Problem solved
On wide screens and when zoomed out, viewport-based heights (`vh`) made the section unnecessarily tall.

### Behavior now (screens wider than 1600px)

| Element | Before | After |
|---------|--------|-------|
| Sticky text area | ~80% of viewport height | Content-based height (~32rem minimum) |
| Space between images | ~50% viewport | Fixed spacing (~22rem) |
| Bottom padding | ~20% viewport | Fixed (~8rem) |

**No new theme settings** — automatic on large desktops.

**Smaller screens:** Original parallax behavior unchanged.

---

## Quick Reference — Where to Find Settings

| Feature | Theme editor location |
|---------|----------------------|
| Hero grid layout | Product page → Product information → **Desktop layout** |
| Hero grid aspect ratio | Product page → Product information → (appears when Hero grid selected) |
| Mobile aspect ratio | Product page → Product information → **Mobile** section |
| Image with scrolling text | Any page → **Image with scrolling text** section (spacing via section settings) |
| Parallax | Any page → **Parallax** section |

---

## Testing Checklist

- [ ] Product page: switch to **Hero image + 2 column grid** on desktop
- [ ] Toggle **Enable image aspect ratio** and compare Original vs Square vs Custom
- [ ] On phone: enable **Mobile aspect ratio** and verify carousel crop
- [ ] Image with scrolling text: test on a 1920px+ monitor and zoom to 75% — no extra blank bands
- [ ] Parallax: test on wide screen — section should not feel excessively tall when zoomed out

---

## Support Notes

- Desktop hero-grid layout activates at **1200px** width and above.
- Large-screen layout fixes (scrolling text, parallax) activate at **1601px** and above.
- Mobile aspect ratio applies at **899px** and below.
- Custom aspect ratio on both desktop and mobile uses the same scale: **slider value ÷ 10**.

If you need ratio or spacing adjusted further, note the section name, screen size, and a screenshot — values can be fine-tuned in the theme code.
