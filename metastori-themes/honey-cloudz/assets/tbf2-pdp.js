/**
 * TBF2 PDP — custom interactions for renamed Replo skin.
 * Collapsibles work like theme accordion (height toggle).
 * Chart popup uses product metafield insert_diagram_popups.
 * Carousel uses transform (does not break Replo flex layout).
 */
(function () {
  'use strict';

  /* Every pdp-* section tags this file in, so the same src can appear many times
     on one page. Run once. */
  if (window.__tbf2PdpBooted) return;
  window.__tbf2PdpBooted = true;

  var ROOT = 'tbf2-fullpage';

  /* Split-section mode: the one-piece #tbf2-fullpage wrapper is gone and each
     part of the PDP renders as its own Shopify section. Widen the scope to
     <body> so the existing root.querySelector(...) calls still find the markup. */
  function splitRoot() {
    return document.querySelector('[data-pdp-sec][data-pdp-preset="breast-form"]')
      ? document.body
      : null;
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function qsa(root, sel) {
    return Array.prototype.slice.call(root.querySelectorAll(sel));
  }

  /** Hide prev/next at scroll edges (gallery / related / real talk) */
  function wireScrollEdgeArrows(scrollEl, carousel) {
    if (!scrollEl || !carousel) return;
    var prevBtns = qsa(carousel, '[data-direction="previous"], [data-tbf2-gallery-prev], [data-tbf2-rt-prev]');
    var nextBtns = qsa(carousel, '[data-direction="next"], [data-tbf2-gallery-next], [data-tbf2-rt-next]');
    var p = qsa(carousel, '[data-direction="previous"]');
    var n = qsa(carousel, '[data-direction="next"]');
    if (p.length) prevBtns = p;
    if (n.length) nextBtns = n;

    function setHidden(btn, hide) {
      if (!btn) return;
      btn.classList.toggle('is-edge-hidden', hide);
      btn.hidden = !!hide;
      if (hide) {
        btn.setAttribute('aria-hidden', 'true');
        btn.tabIndex = -1;
        btn.disabled = true;
        /* Beat global [data-direction]{opacity:1!important} */
        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('visibility', 'hidden', 'important');
        btn.style.setProperty('opacity', '0', 'important');
        btn.style.setProperty('pointer-events', 'none', 'important');
      } else {
        btn.removeAttribute('aria-hidden');
        btn.tabIndex = 0;
        btn.disabled = false;
        btn.removeAttribute('disabled');
        btn.style.setProperty('display', 'inline-flex', 'important');
        btn.style.setProperty('visibility', 'visible', 'important');
        btn.style.setProperty('opacity', '1', 'important');
        btn.style.setProperty('pointer-events', 'auto', 'important');
      }
    }

    function sync() {
      var maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
      var canScroll = maxScroll > 4;
      var atStart = scrollEl.scrollLeft <= 4;
      var atEnd = scrollEl.scrollLeft >= maxScroll - 4;
      prevBtns.forEach(function (btn) {
        setHidden(btn, !canScroll || atStart);
      });
      nextBtns.forEach(function (btn) {
        setHidden(btn, !canScroll || atEnd);
      });
    }

    scrollEl.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    setTimeout(sync, 50);
    setTimeout(sync, 300);
    return sync;
  }

  /** Hide gallery arrows at first / last image */
  function syncIndexEdgeArrows(host, index, total) {
    if (!host) return;
    var idx = typeof index === 'number' ? index : 0;
    var len = typeof total === 'number' ? total : 0;
    var atStart = idx <= 0;
    var atEnd = len <= 1 || idx >= len - 1;

    function setHidden(btn, hide) {
      if (!btn) return;
      btn.classList.toggle('is-edge-hidden', hide);
      btn.hidden = !!hide;
      if (hide) {
        btn.setAttribute('aria-hidden', 'true');
        btn.tabIndex = -1;
        btn.disabled = true;
        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('visibility', 'hidden', 'important');
        btn.style.setProperty('opacity', '0', 'important');
        btn.style.setProperty('pointer-events', 'none', 'important');
      } else {
        btn.removeAttribute('aria-hidden');
        btn.tabIndex = 0;
        btn.disabled = false;
        btn.removeAttribute('disabled');
        btn.style.setProperty('display', 'inline-flex', 'important');
        btn.style.setProperty('visibility', 'visible', 'important');
        btn.style.setProperty('opacity', '1', 'important');
        btn.style.setProperty('pointer-events', 'auto', 'important');
      }
    }

    qsa(
      host,
      '[data-direction="previous"], .tbf2-gallery__nav--prev, [data-tbf2-gallery-prev]'
    ).forEach(function (btn) {
      setHidden(btn, atStart);
    });
    qsa(
      host,
      '[data-direction="next"], .tbf2-gallery__nav--next, [data-tbf2-gallery-next]'
    ).forEach(function (btn) {
      setHidden(btn, atEnd);
    });
  }

  function initCollapsibles(root) {
    var items = qsa(root, '[data-tbf2-collapsible]');
    var durationMs = 300;
    // Replo FAQ uses separate right/down assets (not CSS rotate)
    var FAQ_ARROW_RIGHT =
      'https://assets.replocdn.com/projects/a2c7c51a-ec22-4e36-a9ea-6f00296360e2/b8841636-2636-4c73-ac94-db12e1167639';
    var FAQ_ARROW_DOWN =
      'https://assets.replocdn.com/projects/a2c7c51a-ec22-4e36-a9ea-6f00296360e2/89a72fba-452d-471a-b93d-bd4fa1472c5c';
    // Buy-box / howto uses down chevron + CSS rotate
    var HOWTO_ARROW_DOWN =
      'https://assets.replocdn.com/projects/a2c7c51a-ec22-4e36-a9ea-6f00296360e2/3d86fcec-4cc8-479b-a970-dc2daef939a7';

    function findPanel(item) {
      return (
        item.querySelector(':scope > .tbf2-animated') ||
        item.querySelector(':scope > .replo-animated') ||
        item.querySelector('.tbf2-animated') ||
        item.querySelector('.replo-animated')
      );
    }

    function findTrigger(item) {
      return item.querySelector(':scope > [role="button"]') || item.querySelector('[role="button"]');
    }

    function isFaqItem(item) {
      return (
        !!item.closest('[data-tbf2-id="c4d8d496-8a33-44cc-8fd1-135a300ecf21"]') ||
        !!item.closest('[data-tbf2-block="faq"]') ||
        !!item.closest('[data-tbf2-faq]')
      );
    }

    function setArrowSrc(trigger, url) {
      if (!trigger || !url) return;
      qsa(trigger, 'img').forEach(function (img) {
        img.setAttribute('src', url);
        img.removeAttribute('srcset');
        img.setAttribute('alt', 'arrow');
        img.classList.add('tbf2-faq-arrow');
      });
      qsa(trigger, 'source').forEach(function (el) {
        el.setAttribute('srcset', url + '?width=40');
        el.setAttribute('srcSet', url + '?width=40');
      });
      qsa(trigger, 'picture').forEach(function (el) {
        el.classList.add('tbf2-faq-arrow');
      });
    }

    function normalizeHowToArrow(trigger) {
      setArrowSrc(trigger, HOWTO_ARROW_DOWN);
    }

    items.forEach(function (item) {
      if (item.getAttribute('data-tbf2-ready') === '1') return;
      item.setAttribute('data-tbf2-ready', '1');

      var trigger = findTrigger(item);
      var panel = findPanel(item);
      if (!trigger || !panel) return;

      var inFaq = isFaqItem(item);
      if (inFaq) {
        item.setAttribute('data-tbf2-arrow', 'faq');
        setArrowSrc(trigger, item.getAttribute('data-state') === 'open' ? FAQ_ARROW_DOWN : FAQ_ARROW_RIGHT);
      } else {
        normalizeHowToArrow(trigger);
        item.setAttribute('data-tbf2-arrow', 'up');
      }

      panel.style.overflow = 'hidden';
      panel.style.transition =
        'height ' + durationMs + 'ms cubic-bezier(0.4, 0, 0.2, 1), opacity ' + durationMs + 'ms ease';

      function setOpen(open, instant) {
        item.setAttribute('data-state', open ? 'open' : 'closed');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.setAttribute('data-state', open ? 'open' : 'closed');
        item.classList.toggle('is-open', open);
        if (inFaq) setArrowSrc(trigger, open ? FAQ_ARROW_DOWN : FAQ_ARROW_RIGHT);

        if (open) {
          panel.hidden = false;
          panel.style.opacity = '1';
          if (instant) {
            panel.style.height = 'auto';
            return;
          }
          panel.style.height = '0px';
          panel.getBoundingClientRect();
          var full = panel.scrollHeight;
          panel.style.setProperty('--radix-collapsible-content-height', full + 'px');
          panel.style.height = full + 'px';
          var onEnd = function (e) {
            if (e && e.propertyName && e.propertyName !== 'height') return;
            if (item.getAttribute('data-state') === 'open') panel.style.height = 'auto';
            panel.removeEventListener('transitionend', onEnd);
          };
          panel.addEventListener('transitionend', onEnd);
        } else {
          if (instant) {
            panel.style.height = '0px';
            panel.style.opacity = '0';
            return;
          }
          var h = panel.scrollHeight;
          panel.style.setProperty('--radix-collapsible-content-height', h + 'px');
          panel.style.height = h + 'px';
          panel.getBoundingClientRect();
          panel.style.height = '0px';
          panel.style.opacity = '0';
        }
      }

      setOpen(item.getAttribute('data-state') === 'open', true);

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var willOpen = item.getAttribute('data-state') !== 'open';
        if (willOpen) {
          var parent = item.parentElement;
          if (parent) {
            qsa(parent, ':scope > [data-tbf2-collapsible]').forEach(function (sib) {
              if (sib !== item && sib.getAttribute('data-state') === 'open') {
                var sibTrigger = findTrigger(sib);
                var sibPanel = findPanel(sib);
                if (!sibTrigger || !sibPanel) return;
                sib.setAttribute('data-state', 'closed');
                sibTrigger.setAttribute('aria-expanded', 'false');
                sibPanel.setAttribute('data-state', 'closed');
                sib.classList.remove('is-open');
                var sh = sibPanel.scrollHeight;
                sibPanel.style.height = sh + 'px';
                sibPanel.getBoundingClientRect();
                sibPanel.style.height = '0px';
                sibPanel.style.opacity = '0';
                if (inFaq) setArrowSrc(sibTrigger, FAQ_ARROW_RIGHT);
              }
            });
          }
        }
        setOpen(willOpen, false);
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });
    });
  }

  function ensureModal() {
    var el = document.getElementById('tbf2-size-modal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'tbf2-size-modal';
    el.className = 'tbf2-size-modal';
    el.hidden = true;
    el.innerHTML =
      '<div class="tbf2-size-modal__overlay ReactModal__Overlay" data-tbf2-close>' +
      '<div class="tbf2-size-modal__box ReactModal__Content" role="dialog" aria-modal="true" aria-label="Size chart" data-tbf2-modal-box>' +
      '<button type="button" class="tbf2-size-modal__x" data-tbf2-close aria-label="Close">&times;</button>' +
      '<div class="tbf2-size-modal__top">' +
        '<img class="tbf2-size-modal__top-logo" src="" alt="Logo" />' +
        '<div class="tbf2-size-modal__top-heading">' +
          '<img class="tbf2-size-modal__top-icon" src="https://cdn.shopify.com/s/files/1/1711/0419/files/Frame_2.png?v=1751642870" alt="Check Insert Dimensions" />' +
          '<div class="tbf2-size-modal__top-title"></div>' +
        '</div>' +
        '<div class="tbf2-size-modal__top-subtitle"></div>' +
        '<div class="tbf2-size-modal__top-content"></div>' +
      '</div>' +
      '<div class="tbf2-size-modal__body"></div></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target.closest('.tbf2-size-modal__x')) {
        closeModal(el);
        return;
      }
      if (e.target.closest('[data-tbf2-modal-box]')) return;
      if (e.target.closest('.tbf2-size-modal__overlay')) closeModal(el);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !el.hidden) closeModal(el);
    });
    return el;
  }

  function openModal(el) {
    el.hidden = false;
    el.classList.remove('is-closing');
    document.documentElement.classList.add('tbf2-modal-open', 'replo-modal-after-open');
    document.body.classList.add('replo-modal-after-open');
    var overlay = el.querySelector('.tbf2-size-modal__overlay');
    if (overlay) {
      overlay.classList.remove('ReactModal__Overlay--after-open');
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          overlay.classList.add('ReactModal__Overlay--after-open');
        });
      });
    }
  }

  function closeModal(el) {
    el = el || document.getElementById('tbf2-size-modal');
    if (!el) return;
    var overlay = el.querySelector('.tbf2-size-modal__overlay');
    if (overlay) overlay.classList.remove('ReactModal__Overlay--after-open');
    el.classList.add('is-closing');
    setTimeout(function () {
      el.hidden = true;
      el.classList.remove('is-closing');
      document.documentElement.classList.remove('tbf2-modal-open', 'replo-modal-after-open');
      document.body.classList.remove('replo-modal-after-open');
    }, 220);
  }

  function findReploPopupTopContentByImage(url) {
    if (!url) return null;
    try {
      var base = String(url).split('?')[0].split('/').pop();
      if (!base) return null;

      var candidates = qsa(document, '.product-popup-modal__content-info');
      for (var i = 0; i < candidates.length; i++) {
        var ci = candidates[i];
        var imgs = ci.querySelectorAll('img[src], img');
        var matched = false;
        for (var j = 0; j < imgs.length; j++) {
          var src = imgs[j].getAttribute('src') || imgs[j].src || '';
          if (!src) continue;
          var srcBase = String(src).split('?')[0].split('/').pop();
          if (srcBase === base || String(src).indexOf(base) !== -1) {
            matched = true;
            break;
          }
        }
        if (!matched) continue;

        var titleEl = ci.querySelector('.h2');
        var titleHTML = titleEl ? titleEl.innerHTML : '';

        var rteEls = ci.querySelectorAll('.rte');
        var combined = '';
        for (var k = 0; k < rteEls.length; k++) {
          var rte = rteEls[k];
          var clone = rte.cloneNode(true);
          var rteImgs = clone.querySelectorAll('img');
          for (var m = 0; m < rteImgs.length; m++) rteImgs[m].remove();
          var html = (clone.innerHTML || '').trim();
          if (html) combined += html;
        }

        return { titleHTML: titleHTML, contentHTML: combined };
      }
    } catch (e) {}
    return null;
  }

  function initSizePopup(root) {
    // Only explicit triggers — never bind variants, FAQ, gallery, or other clicks
    var triggers = qsa(root, '[data-tbf2-size-trigger]');

    if (!triggers.length) {
      qsa(root, 'button, a, [role="button"]').forEach(function (el) {
        if (el.closest('[data-tbf2-collapsible]')) return;
        if (el.closest('[data-tbf2-option-select]')) return;
        if (el.closest('fieldset')) return;
        if (el.closest('modal-opener')) return;
        var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (/^view size guide$/i.test(t)) {
          el.setAttribute('data-tbf2-size-trigger', 'guide');
          triggers.push(el);
        } else if (/^check insert dimensions$/i.test(t)) {
          el.setAttribute('data-tbf2-size-trigger', 'dims');
          triggers.push(el);
        }
      });
    }

    triggers = triggers.filter(function (el, i, arr) {
      return arr.indexOf(el) === i;
    });

    triggers.forEach(function (el) {
      if (el.getAttribute('data-tbf2-ready') === '1') return;
      el.setAttribute('data-tbf2-ready', '1');
      el.style.cursor = 'pointer';
      // Bind whole row (icon + label) like Replo hit area
      var row = el.parentElement;
      var bindEl = row && row.querySelector('picture, img') ? row : el;
      if (bindEl !== el) {
        bindEl.style.cursor = 'pointer';
        if (bindEl.getAttribute('data-tbf2-ready') === '1') return;
        bindEl.setAttribute('data-tbf2-ready', '1');
        bindEl.setAttribute(
          'data-tbf2-size-trigger',
          el.getAttribute('data-tbf2-size-trigger') || 'guide'
        );
      }
      bindEl.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var modal = ensureModal();
        var body = modal.querySelector('.tbf2-size-modal__body');
        var topTitleEl = modal.querySelector('.tbf2-size-modal__top-title');
        var topSubtitleEl = modal.querySelector('.tbf2-size-modal__top-subtitle');
        var topContentEl = modal.querySelector('.tbf2-size-modal__top-content');
        var topIconEl = modal.querySelector('.tbf2-size-modal__top-icon');
        var topLogoEl = modal.querySelector('.tbf2-size-modal__top-logo');
        var kind =
          bindEl.getAttribute('data-tbf2-size-trigger') ||
          el.getAttribute('data-tbf2-size-trigger');
        var cfg = window.tbf2Pdp || {};
        var url =
          kind === 'guide'
            ? cfg.sizeGuideUrl || cfg.sizeImageUrl || ''
            : cfg.sizeImageUrl || cfg.sizeGuideUrl || '';
        var label = kind === 'guide' ? 'View Size Guide' : 'Check Insert Dimensions';

        var ICON_GUIDE = 'https://cdn.shopify.com/s/files/1/1711/0419/files/Frame_1.png?v=1751642870';
        var ICON_DIMS  = 'https://cdn.shopify.com/s/files/1/1711/0419/files/Frame_2.png?v=1751642870';

        // Pick the right content + icon based on popup kind
        var popupTitle, popupSubtitle, popupDesc, iconSrc;
        if (kind === 'guide') {
          popupTitle    = (cfg.guidePopupTitle || '').trim();
          popupSubtitle = '';
          popupDesc     = (cfg.guidePopupDescription || '').trim();
          iconSrc       = ICON_GUIDE;
          modal.classList.add('tbf2-size-modal--guide');
        } else {
          popupTitle    = (cfg.dimsPopupTitle || '').trim();
          popupSubtitle = (cfg.dimsPopupSubtitle || cfg.productTitle || '').trim();
          popupDesc     = (cfg.dimsPopupDescription || '').trim();
          iconSrc       = ICON_DIMS;
          modal.classList.remove('tbf2-size-modal--guide');
        }

        if (topIconEl) { topIconEl.src = iconSrc; topIconEl.alt = label; }
        if (topLogoEl) {
          topLogoEl.src = (cfg.siteLogo || '').trim();
          topLogoEl.style.display = kind === 'guide' ? 'none' : 'block';
        }
        if (topTitleEl) topTitleEl.innerHTML = popupTitle || label;
        if (topSubtitleEl) {
          topSubtitleEl.innerHTML = popupSubtitle;
          topSubtitleEl.style.display = popupSubtitle ? 'block' : 'none';
        }
        if (topContentEl) {
          topContentEl.innerHTML = popupDesc;
          topContentEl.style.display = popupDesc ? 'block' : 'none';
        }

        body.innerHTML = url
          ? '<img src="' +
            url +
            '" alt="' +
            label +
            '" class="tbf2-size-modal__img" />'
          : '<p class="tbf2-size-modal__empty">Chart metafield is empty for this product.</p>';
        openModal(modal);
      });
    });
  }

  function productUrlFromHandle(handle) {
    var rootPath = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';
    return rootPath.replace(/\/?$/, '/') + 'products/' + encodeURIComponent(handle);
  }

  function paintRelatedOutlineBtn(el, hovering) {
    if (!el) return;
    el.style.setProperty('background', hovering ? '#111' : 'transparent', 'important');
    el.style.setProperty('background-color', hovering ? '#111' : 'transparent', 'important');
    el.style.setProperty('background-image', 'none', 'important');
    el.style.setProperty('color', hovering ? '#fff' : '#111', 'important');
    el.style.setProperty('border', '1.5px solid #111', 'important');
    el.style.setProperty('border-color', '#111', 'important');
    el.style.setProperty('border-radius', '999px', 'important');
    el.style.setProperty('box-shadow', 'none', 'important');
    el.style.setProperty('transform', 'none', 'important');
    qsa(el, 'p, span, div, .tbf2-rte').forEach(function (node) {
      node.style.setProperty('background', 'transparent', 'important');
      node.style.setProperty('background-color', 'transparent', 'important');
      node.style.setProperty('background-image', 'none', 'important');
      node.style.setProperty('color', hovering ? '#fff' : '#111', 'important');
      node.style.setProperty('border', '0', 'important');
      node.style.setProperty('box-shadow', 'none', 'important');
    });
  }

  function wireRelatedOutlineBtn(el) {
    if (!el) return;
    el.removeAttribute('data-tbf2-black-btn');
    el.removeAttribute('data-tbf2-black-hover');
    el.classList.add('tbf2-related-card__btn');
    el.setAttribute('data-tbf2-related-cta', '1');
    paintRelatedOutlineBtn(el, false);
    if (el.getAttribute('data-tbf2-related-outline') === '1') return;
    el.setAttribute('data-tbf2-related-outline', '1');
    el.addEventListener('mouseenter', function () {
      paintRelatedOutlineBtn(el, true);
    });
    el.addEventListener('mouseleave', function () {
      paintRelatedOutlineBtn(el, false);
    });
    el.addEventListener('focus', function () {
      paintRelatedOutlineBtn(el, true);
    });
    el.addEventListener('blur', function () {
      paintRelatedOutlineBtn(el, false);
    });
  }

  function initRelatedStaticCard(root) {
    var relatedSection = root.querySelector('[data-tbf2-id="35e76b14-5048-448d-99c1-6fa77b7b6a3d"]');
    if (!relatedSection) return;
    var firstSlide = relatedSection.querySelector('[data-tbf2-part="slide"]');
    if (firstSlide) {
      /* fix broken images in first static card */
      qsa(firstSlide, 'img').forEach(function (img) {
        img.addEventListener('error', function () {
          img.style.display = 'none';
          var wrap = img.parentElement;
          if (wrap) {
            wrap.style.background = '#f0f0f0';
            wrap.style.aspectRatio = '1/1';
            wrap.style.borderRadius = '12px';
            wrap.style.minHeight = '200px';
          }
        });
        /* force reload in case it already errored */
        if (img.complete && img.naturalWidth === 0) {
          img.dispatchEvent(new Event('error'));
        }
      });
    }

    /* All related SHOP NOW CTAs: beat Replo/JS inline black fill → outline like product cards */
    qsa(relatedSection, 'a, button, [role="button"]').forEach(function (el) {
      if (el.getAttribute('data-tbf2-product-container')) return;
      var label = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!/^shop now$/i.test(label)) return;
      wireRelatedOutlineBtn(el);
    });
  }

  function initRelatedProductLinks(root) {
    // Related cards: role=button + product handle → PDP (card + CTA) — keep Replo button design
    qsa(root, '[data-tbf2-product-container][data-tbf2-product-handle][role="button"]').forEach(function (el) {
      if (el.getAttribute('data-tbf2-related-ready') === '1') return;
      var handle = (el.getAttribute('data-tbf2-product-handle') || '').trim();
      if (!handle) return;

      el.setAttribute('data-tbf2-related-ready', '1');
      el.classList.add('tbf2-related-card');
      el.style.cursor = 'pointer';

      var overrideUrl = (el.getAttribute('data-tbf2-related-override-url') || '').trim();
      var url = overrideUrl || productUrlFromHandle(handle);

      var img = el.querySelector('img');
      if (img) img.classList.add('tbf2-related-card__img');

      var ctas = [];
      qsa(el, 'a, button, [role="button"]').forEach(function (node) {
        if (node === el) return;
        var label = (node.textContent || '').replace(/\s+/g, ' ').trim();
        if (/^(shop now|out of stock|sold out|view product|buy now)$/i.test(label)) {
          ctas.push(node);
        }
      });
      // First-card override CTA (label may no longer say SHOP NOW)
      if (!ctas.length) {
        var overrideCta = el.querySelector('[data-tbf2-id="4e4ed007-ddbb-4bd7-9496-c8ed0b5b3498"]');
        if (overrideCta && overrideCta !== el) ctas.push(overrideCta);
      }
      if (!ctas.length) {
        var guess = el.querySelector('a.text, button.text, [role="button"].text');
        if (guess && guess !== el) ctas.push(guess);
      }

      ctas.forEach(function (cta) {
        // Do NOT add theme .button classes — keeps Replo outline pill look
        cta.classList.add('tbf2-related-card__btn');
        cta.setAttribute('data-tbf2-related-cta', '1');
        // Custom button label from Theme Editor (first card) — match by Shop Now default too
        var customLabel = (el.getAttribute('data-tbf2-related-override-label') || '').trim();
        if (customLabel) {
          var labelHost =
            cta.querySelector('[data-tbf2-id="7f14fd43-56a9-4209-ad56-be069f71d79e"] .tbf2-rte > span') ||
            cta.querySelector('[data-tbf2-id="7f14fd43-56a9-4209-ad56-be069f71d79e"]') ||
            cta.querySelector('p, span');
          if (labelHost) labelHost.textContent = customLabel;
        }
        if (cta.tagName === 'A') {
          cta.setAttribute('href', url);
        } else {
          cta.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = url;
          });
        }
        qsa(cta, '.tbf2-animate-spinner, .replo-animate-spinner').forEach(function (sp) {
          sp.style.display = 'none';
        });
      });

      function go(e) {
        if (e.target.closest('a[href]')) return;
        if (e.target.closest('[data-tbf2-related-cta]')) return;
        if (e.target.closest('[data-tbf2-add-product-variant-to-cart]')) return;
        if (e.target.closest('form')) return;
        if (e.target.closest('[data-tbf2-option-select]')) return;
        e.preventDefault();
        e.stopPropagation();
        window.location.href = url;
      }

      el.addEventListener('click', go);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') go(e);
      });
    });
  }

  function isPageShopCtaLabel(t) {
    t = (t || '').replace(/\s+/g, ' ').trim();
    if (!t) return false;
    // Exact sticky / related-style label
    if (/^shop now$/i.test(t)) return true;
    // Banner / hero CTAs (Replo role=link, no href)
    if (/shop now/i.test(t)) return true;
    if (/feel the difference/i.test(t) && /shop/i.test(t)) return true;
    return false;
  }

  function isLaidOut(el) {
    if (!el || !el.getClientRects) return false;
    try {
      return el.getClientRects().length > 0;
    } catch (err) {
      return false;
    }
  }

  function stickyHeaderOffset() {
    var header =
      document.querySelector('sticky-header') ||
      document.querySelector('.header-wrapper') ||
      document.querySelector('#shopify-section-header');
    var h = header ? header.offsetHeight || 0 : 0;
    var ann = document.querySelector(
      '#shopify-section-announcement-bar, .announcement-bar-section, .announcement-bar'
    );
    if (ann && header && !header.contains(ann)) {
      h += ann.offsetHeight || 0;
    }
    return h;
  }

  /* Product info at the top of the page, most specific first. Breadcrumbs / title
     come from the Replo buy box; the last three are the stock theme's product
     section, because PDP Why can be dropped on any product template and most of
     them still open with main-product rather than pdp-buybox. */
  var PRODUCT_INFO_SELECTORS = [
    '.tbf2-breadcrumbs-inline',
    '[data-tbf2-id="1d51b2c2-237f-4b0a-b342-e28148e1a349"]',
    '[data-tbf2-id="a7b2d6a4-f624-47d3-9e39-99fd48834b65"]',
    '[data-tbf2-id="305aee7a-caa9-4ecf-b522-abdf5069a7e8"]',
    /* Split-section mode: the buy box is its own section, so its wrapper is
       the product info block even when the ids above moved or were renamed. */
    '[data-pdp-sec="buybox"]',
    '[data-tbf2-product-container]:not([role="button"])',
    '[data-tbf2-product-container]',
    '#cst_main_product',
    '[id^="MainProduct-"]',
    '[id^="ProductInfo-"]'
  ];

  /* pdp-wrap-open stamps data-tbf2-product-container on every above-fold section
     wrapper — Why, How To Wear and Purpose included, not just the buy box. Without
     this, a template with no pdp-buybox sent the CTA to whichever of those blocks
     came first in the DOM instead of to the product info. */
  function isNonBuyboxSection(el) {
    var sec = el.closest ? el.closest('[data-pdp-sec]') : null;
    return !!(sec && sec.getAttribute('data-pdp-sec') !== 'buybox');
  }

  function scrollToProductTitle(root, fromEl) {
    // Prefer breadcrumbs / visible title so CTA lands at top near product name
    var target = null;
    for (var i = 0; i < PRODUCT_INFO_SELECTORS.length && !target; i++) {
      var matches = qsa(root, PRODUCT_INFO_SELECTORS[i]);
      for (var j = 0; j < matches.length; j++) {
        if (fromEl && matches[j].contains(fromEl)) continue;
        if (isNonBuyboxSection(matches[j])) continue;
        if (!isLaidOut(matches[j])) continue;
        target = matches[j];
        break;
      }
    }
    if (!target) return;
    var y =
      target.getBoundingClientRect().top +
      (window.pageYOffset || document.documentElement.scrollTop || 0) -
      stickyHeaderOffset() -
      12;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  /* The Why block's CTA, by Replo id (desktop + mobile copies). Label matching
     alone is not enough here: the PDP Why section's "Button text" setting feeds
     this label, so a renamed button stopped scrolling anywhere. Ids survive any
     copy change. */
  var WHY_CTA_IDS = [
    '23cf67c7-7abf-439f-bf3c-91eeff5605e2',
    'f03230c6-61bc-42ac-9c45-26de6a8de6dd'
  ];

  function isWhyCta(el) {
    return WHY_CTA_IDS.indexOf(el.getAttribute('data-tbf2-id') || '') !== -1;
  }

  function initShopNow(root) {
    // Why / Proven / Shop CTAs → scroll to product title (top), related cards keep product URLs
    qsa(root, '[role="button"], [role="link"], button, a').forEach(function (el) {
      if (el.closest('[data-tbf2-collapsible]')) return;
      if (el.closest('[data-tbf2-option-select]')) return;
      // Related product cards / CTAs → product URL (not main ATC)
      if (el.closest('[data-tbf2-product-container][role="button"]')) return;
      if (el.closest('[data-tbf2-related-cta]')) return;
      if (el.closest('.tbf2-related-card')) return;
      if (el.getAttribute('data-tbf2-related-cta') === '1') return;
      // Keep real links (Find Your Fit, Home, policy, etc.)
      if (el.tagName === 'A') {
        var href = (el.getAttribute('href') || '').trim();
        if (href && href !== '#' && href.toLowerCase().indexOf('javascript:') !== 0) return;
      }
      var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!isWhyCta(el) && !isPageShopCtaLabel(t)) return;
      if (el.getAttribute('data-tbf2-ready') === '1') return;
      el.setAttribute('data-tbf2-ready', '1');
      el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToProductTitle(root, el);
        // Sticky / exact SHOP NOW also triggers ATC like Replo buy flow
        if (/^shop now$/i.test(t)) {
          var atc = root.querySelector(
            '[data-tbf2-product-container]:not([role="button"]) [data-tbf2-add-product-variant-to-cart], [data-tbf2-add-product-variant-to-cart]'
          );
          if (atc) setTimeout(function () { atc.click(); }, 300);
        }
      });
    });
  }

  function parseGapPx(el, fallback) {
    var raw = '';
    try {
      raw = getComputedStyle(el).getPropertyValue('--replo-gap').trim();
    } catch (err) {}
    if (!raw) {
      try {
        raw = getComputedStyle(el).gap || getComputedStyle(el).columnGap || '';
      } catch (err2) {}
    }
    var n = parseFloat(raw);
    return isNaN(n) ? fallback : n;
  }

  function initCarousels(root) {
    qsa(root, '[data-tbf2-carousel]').forEach(function (carousel) {
      if (carousel.getAttribute('data-tbf2-ready') === '1') return;

      var track =
        carousel.querySelector('[data-tbf2-part="slide-track"]') ||
        carousel.querySelector('[data-tbf2-part-id="slide-track"]');
      if (!track) {
        var firstSlide = carousel.querySelector('[data-tbf2-part="slide"]');
        track = firstSlide && firstSlide.parentElement;
      }
      if (!track) return;

      carousel.setAttribute('data-tbf2-ready', '1');

      var gapSource =
        carousel.querySelector('.tbf2-r-sftcjo, .tbf2-r-qcb735, [style*="--replo-gap"]') ||
        carousel;
      var gapPx = parseGapPx(gapSource, 40);
      var gapCss = gapPx + 'px';
      carousel.style.setProperty('--replo-gap', gapCss);
      track.style.setProperty('--replo-gap', gapCss);
      if (gapSource !== carousel) gapSource.style.setProperty('--replo-gap', gapCss);

      var isProven = !!carousel.closest('[data-tbf2-id="be324424-0739-445d-bf83-96dc92edb077"]');
      var isTestimonials =
        isProven ||
        (carousel.id && carousel.id.indexOf('Rccj2') !== -1) ||
        ((track.getAttribute('data-tbf2-root-id') || '').indexOf('Rbscj2') !== -1);
      var isRelated =
        !!carousel.querySelector('.tbf2-r-qcb735') ||
        (carousel.id && carousel.id.indexOf('Rdkj2') !== -1) ||
        !!carousel.querySelector('[data-tbf2-product-container][role="button"]');
      var isProductGallery = !!carousel.closest('.tbf2-r-crmaa3');
      var position =
        track.getAttribute('data-active-slide-position') ||
        (track.parentElement &&
          track.parentElement.getAttribute('data-active-slide-position')) ||
        (isTestimonials ? 'center' : 'start');

      function applySpp(spp) {
        var v = String(spp);
        carousel.style.setProperty('--replo-carousel-slides-per-page', v);
        track.style.setProperty('--replo-carousel-slides-per-page', v);
        qsa(carousel, '[style*="--replo-carousel-slides-per-page"]').forEach(function (node) {
          node.style.setProperty('--replo-carousel-slides-per-page', v);
        });
      }

      function setSpp() {
        if (isProven) {
          gapPx = window.matchMedia('(max-width: 640px)').matches ? 12 : 16;
          gapCss = gapPx + 'px';
          var spp = '1';
          if (window.matchMedia('(min-width: 1100px)').matches) spp = '2';
          else if (window.matchMedia('(min-width: 550px)').matches) spp = '1.5';
          applySpp(spp);
          carousel.style.setProperty('--replo-gap', gapCss);
          track.style.setProperty('--replo-gap', gapCss);
          track.style.gap = gapCss;
          track.style.columnGap = gapCss;
        } else if (isTestimonials) {
          var spp = '1';
          if (window.matchMedia('(min-width: 1100px)').matches) spp = '2';
          else if (window.matchMedia('(min-width: 550px)').matches) spp = '1.5';
          applySpp(spp);
          gapPx = 40;
          if (window.matchMedia('(max-width: 640px)').matches) gapPx = 16;
          gapCss = gapPx + 'px';
          carousel.style.setProperty('--replo-gap', gapCss);
          track.style.setProperty('--replo-gap', gapCss);
        } else if (isRelated) {
          // Keep Replo SSR slides-per-page (cards are max-width:300px flex) — don't force SPP calc
          gapCss = '24px';
          gapPx = 24;
          if (window.matchMedia('(max-width: 640px)').matches) {
            gapCss = '16px';
            gapPx = 16;
          }
          carousel.style.setProperty('--replo-gap', gapCss);
          track.style.setProperty('--replo-gap', gapCss);
        } else {
          applySpp('1');
        }
      }
      setSpp();

      var allSlides = Array.prototype.slice
        .call(track.children)
        .filter(function (n) {
          return n.getAttribute && n.getAttribute('data-tbf2-part') === 'slide';
        });
      if (allSlides.length < 2) allSlides = qsa(carousel, '[data-tbf2-part="slide"]');
      if (allSlides.length < 2) return;

      // Rebuild infinite loop from unique source slides (Replo SSR marks many as cloned)
      var bySource = {};
      var unique = [];
      allSlides.forEach(function (slide) {
        var src = slide.getAttribute('data-slide-source-index');
        if (src == null || src === '') {
          unique.push(slide);
          return;
        }
        if (!bySource[src]) {
          bySource[src] = slide;
          unique.push(slide);
        }
      });
      if (unique.length < 2) unique = allSlides.slice();

      // Related (You May Also Like): overflow scroll, scrollbar hidden, arrows — no autoslide
      if (isRelated) {
        track.innerHTML = '';
        unique.forEach(function (src, idx) {
          var node = src.cloneNode(true);
          node.setAttribute('data-is-cloned', 'false');
          node.setAttribute('data-slide-index', String(idx));
          node.setAttribute('aria-hidden', 'false');
          node.removeAttribute('data-tbf2-related-ready');
          qsa(node, '[data-tbf2-related-ready]').forEach(function (n) {
            n.removeAttribute('data-tbf2-related-ready');
          });
          /* Clone of aria-hidden+lazy slides often leaves blank imgs — force reload */
          qsa(node, 'img').forEach(function (img, imgIdx) {
            var srcUrl = img.getAttribute('src') || img.currentSrc || '';
            img.loading = imgIdx === 0 && idx === 0 ? 'eager' : 'lazy';
            img.removeAttribute('decoding');
            if (srcUrl) {
              img.setAttribute('src', srcUrl);
              try {
                img.src = srcUrl;
              } catch (eImg) {}
            }
          });
          qsa(node, 'source[srcset], source[srcSet]').forEach(function (source) {
            var ss = source.getAttribute('srcset') || source.getAttribute('srcSet');
            if (ss) {
              source.setAttribute('srcset', ss);
              source.setAttribute('srcSet', ss);
            }
          });
          node.style.width = '';
          node.style.maxWidth = '300px';
          node.style.flex = '0 0 auto';
          node.style.flexShrink = '0';
          track.appendChild(node);
        });

        var viewport =
          carousel.querySelector('.tbf2-r-qcb735') ||
          track.parentElement ||
          carousel;
        carousel.classList.add('tbf2-carousel--related-scroll');
        track.style.display = 'flex';
        track.style.transform = 'none';
        track.style.transition = 'none';
        track.style.willChange = 'auto';
        track.style.gap = 'var(--replo-gap, ' + gapCss + ')';
        track.style.overflow = 'visible';

        function applyRelatedLayout() {
          var desktop = window.matchMedia('(min-width: 1300px)').matches;
          qsa(track, '[data-tbf2-part="slide"]').forEach(function (node) {
            if (desktop) {
              node.style.width = '';
              node.style.maxWidth = '';
              node.style.flex = '1 1 0';
              node.style.flexShrink = '1';
              node.style.minWidth = '0';
            } else {
              node.style.width = '';
              node.style.maxWidth = '300px';
              node.style.flex = '0 0 auto';
              node.style.flexShrink = '0';
              node.style.minWidth = '';
            }
          });
          if (viewport) {
            viewport.classList.add('tbf2-carousel-scrollport');
            viewport.style.display = 'flex';
            viewport.style.overflowX = desktop ? 'hidden' : 'auto';
            viewport.style.overflowY = desktop ? 'visible' : 'hidden';
            viewport.style.scrollBehavior = 'smooth';
            viewport.style.webkitOverflowScrolling = 'touch';
            viewport.style.scrollbarWidth = 'none';
            viewport.style.msOverflowStyle = 'none';
          }
          track.style.justifyContent = desktop ? 'space-between' : '';
          track.style.width = desktop ? '100%' : '';
          qsa(carousel, '[data-direction]').forEach(function (btn) {
            btn.style.display = desktop ? 'none' : '';
            if (desktop) {
              btn.classList.remove('is-edge-hidden');
            }
          });
        }

        applyRelatedLayout();

        function scrollStep(dir) {
          if (!viewport || window.matchMedia('(min-width: 1300px)').matches) return;
          var slide = track.querySelector('[data-tbf2-part="slide"]');
          var amount = (slide ? slide.offsetWidth : 280) + gapPx;
          viewport.scrollBy({ left: dir * amount, behavior: 'smooth' });
        }

        qsa(carousel, '[data-direction="previous"]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            scrollStep(-1);
          });
        });
        qsa(carousel, '[data-direction="next"]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            scrollStep(1);
          });
        });

        var syncRelatedArrows = viewport ? wireScrollEdgeArrows(viewport, carousel) : null;
        window.addEventListener('resize', function () {
          applyRelatedLayout();
          setSpp();
          if (syncRelatedArrows) syncRelatedArrows();
        });
        return;
      }

      // Proven / testimonials: proper infinite transform loop — NO autoslide
      if (isTestimonials) {
        var cloneCount = Math.min(unique.length, unique.length);
        track.innerHTML = '';
        var built = [];
        function cloneSlide(src, cloned, idx) {
          var node = src.cloneNode(true);
          node.setAttribute('data-is-cloned', cloned ? 'true' : 'false');
          node.setAttribute('data-slide-index', String(idx));
          node.setAttribute('aria-hidden', cloned ? 'true' : 'false');
          if (!node.style.width) {
            node.style.width =
              'calc((100% + var(--replo-gap, 0px)) / var(--replo-carousel-slides-per-page, 1) - var(--replo-gap, 0px))';
          }
          node.style.flexShrink = '0';
          track.appendChild(node);
          built.push(node);
          return node;
        }
        for (var c = unique.length - cloneCount; c < unique.length; c++) {
          cloneSlide(unique[c], true, built.length);
        }
        var realStart = built.length;
        unique.forEach(function (src) {
          cloneSlide(src, false, built.length);
        });
        for (var c2 = 0; c2 < cloneCount; c2++) {
          cloneSlide(unique[c2], true, built.length);
        }
        var slides = built;
        var realCount = unique.length;
        var index = realStart;
        var viewport =
          carousel.querySelector('.tbf2-r-sftcjo') ||
          track.parentElement ||
          carousel;
        var animating = false;

        carousel.classList.add('tbf2-carousel--proven-infinite');
        track.style.display = 'flex';
        track.style.overflow = 'visible';
        track.style.gap = 'var(--replo-gap, ' + gapCss + ')';
        track.style.willChange = 'transform';
        track.style.backfaceVisibility = 'hidden';
        if (viewport && viewport !== track) {
          viewport.style.overflow = 'hidden';
          viewport.style.overflowX = 'hidden';
          viewport.style.overflowY = 'hidden';
        }

        qsa(carousel, '[data-direction]').forEach(function (btn) {
          btn.removeAttribute('disabled');
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.cursor = 'pointer';
        });

        function syncActive() {
          slides.forEach(function (slide, idx) {
            var on = idx === index;
            slide.setAttribute('data-is-active', on ? 'true' : 'false');
            slide.setAttribute('aria-hidden', on ? 'false' : 'true');
          });
        }

        function offsetFor(i) {
          var slide = slides[i];
          if (!slide) return 0;
          var left = slide.offsetLeft;
          var vw = (viewport && viewport.clientWidth) || carousel.clientWidth;
          return left - Math.max(0, (vw - slide.offsetWidth) / 2);
        }

        function goTo(i, instant) {
          if (!slides.length) return;
          index = i;
          syncActive();
          var x = -offsetFor(index);
          if (instant) {
            track.style.transitionDuration = '0ms';
            track.style.transitionProperty = 'none';
          } else {
            track.style.transitionDuration = '450ms';
            track.style.transitionProperty = 'transform';
            track.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
          }
          track.style.transform = 'translate3d(' + x + 'px, 0, 0)';
        }

        function normalizeAfterAnim() {
          if (index >= realStart + realCount) {
            goTo(index - realCount, true);
          } else if (index < realStart) {
            goTo(index + realCount, true);
          }
        }

        function step(dir) {
          if (animating) return;
          animating = true;
          goTo(index + dir, false);
          window.setTimeout(function () {
            normalizeAfterAnim();
            animating = false;
          }, 480);
        }

        qsa(carousel, '[data-direction="previous"]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            step(-1);
          });
        });
        qsa(carousel, '[data-direction="next"]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            step(1);
          });
        });

        function onResize() {
          setSpp();
          goTo(index, true);
        }
        window.addEventListener('resize', onResize);

        window.requestAnimationFrame(function () {
          goTo(realStart, true);
        });
        return;
      }

      // Product media gallery (mobile native Replo carousel): infinite, SPP=1, no autoslide
      if (isProductGallery) {
        var gClone = Math.min(2, unique.length);
        track.innerHTML = '';
        var gBuilt = [];
        function gCloneSlide(src, cloned, idx) {
          var node = src.cloneNode(true);
          node.setAttribute('data-is-cloned', cloned ? 'true' : 'false');
          node.setAttribute('data-slide-index', String(idx));
          node.setAttribute('aria-hidden', cloned ? 'true' : 'false');
          node.style.width =
            'calc((100% + var(--replo-gap, 0px)) / var(--replo-carousel-slides-per-page, 1) - var(--replo-gap, 0px))';
          node.style.flexShrink = '0';
          track.appendChild(node);
          gBuilt.push(node);
          return node;
        }
        if (unique.length >= 2) {
          for (var gc = unique.length - gClone; gc < unique.length; gc++) {
            gCloneSlide(unique[gc], true, gBuilt.length);
          }
        }
        var gRealStart = gBuilt.length;
        unique.forEach(function (src) {
          gCloneSlide(src, false, gBuilt.length);
        });
        if (unique.length >= 2) {
          for (var gc2 = 0; gc2 < gClone; gc2++) {
            gCloneSlide(unique[gc2], true, gBuilt.length);
          }
        }
        var gSlides = gBuilt;
        var gRealCount = unique.length;
        var gIndex = gRealStart;
        var gViewport =
          carousel.querySelector('.tbf2-r-14kux2b') ||
          track.parentElement ||
          carousel;
        var gAnimating = false;

        applySpp('1');
        carousel.classList.add('tbf2-carousel--product-media');
        track.style.display = 'flex';
        track.style.overflow = 'visible';
        track.style.gap = 'var(--replo-gap, 0px)';
        track.style.willChange = 'transform';
        if (gViewport && gViewport !== track) {
          gViewport.style.overflow = 'hidden';
          gViewport.style.overflowX = 'clip';
        }

        qsa(carousel, '[data-direction]').forEach(function (btn) {
          btn.removeAttribute('disabled');
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.cursor = 'pointer';
        });

        function gSync() {
          gSlides.forEach(function (slide, idx) {
            var on = idx === gIndex;
            slide.setAttribute('data-is-active', on ? 'true' : 'false');
            slide.setAttribute('aria-hidden', on ? 'false' : 'true');
          });
        }

        function gOffset(i) {
          var slide = gSlides[i];
          return slide ? slide.offsetLeft : 0;
        }

        function gGoTo(i, instant) {
          if (!gSlides.length) return;
          gIndex = i;
          gSync();
          var x = -gOffset(gIndex);
          if (instant) {
            track.style.transitionDuration = '0ms';
            track.style.transitionProperty = 'none';
          } else {
            track.style.transitionDuration = '400ms';
            track.style.transitionProperty = 'transform';
            track.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
          }
          track.style.transform = 'translate3d(' + x + 'px, 0, 0)';
        }

        function gNormalize() {
          if (gRealCount < 2) return;
          if (gIndex >= gRealStart + gRealCount) gGoTo(gIndex - gRealCount, true);
          else if (gIndex < gRealStart) gGoTo(gIndex + gRealCount, true);
        }

        function gStep(dir) {
          if (gAnimating || gRealCount < 2) return;
          gAnimating = true;
          gGoTo(gIndex + dir, false);
          window.setTimeout(function () {
            gNormalize();
            gAnimating = false;
          }, 420);
        }

        qsa(carousel, '[data-direction="previous"]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            gStep(-1);
          });
        });
        qsa(carousel, '[data-direction="next"]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            gStep(1);
          });
        });

        carousel._tbf2GoToSlide = function (sourceIndex) {
          var target = gRealStart + (sourceIndex % gRealCount);
          gGoTo(target, true);
        };

        window.addEventListener('resize', function () {
          setSpp();
          gGoTo(gIndex, true);
        });

        window.requestAnimationFrame(function () {
          gGoTo(gRealStart, true);
        });
        return;
      }

      // Other carousels (legacy transform — no autoplay)
      var slides = unique.slice();
      slides.forEach(function (slide) {
        if (!slide.style.width) {
          slide.style.width =
            'calc((100% + var(--replo-gap, 0px)) / var(--replo-carousel-slides-per-page, 1) - var(--replo-gap, 0px))';
        }
        slide.style.flexShrink = '0';
      });
      var index = 0;
      var realCount = slides.length;
      var viewport =
        track.parentElement ||
        carousel.querySelector('[data-tbf2-part="slides"]') ||
        carousel;
      var animating = false;

      track.style.display = 'flex';
      track.style.overflow = 'visible';
      track.style.gap = 'var(--replo-gap, ' + gapCss + ')';
      track.style.willChange = 'transform';
      if (viewport && viewport !== track) {
        viewport.style.overflow = 'hidden';
        viewport.style.overflowX = 'hidden';
      }

      qsa(carousel, '[data-direction]').forEach(function (btn) {
        btn.removeAttribute('disabled');
        btn.disabled = false;
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
      });

      function syncActive() {
        slides.forEach(function (slide, idx) {
          var on = idx === index;
          slide.setAttribute('data-is-active', on ? 'true' : 'false');
          slide.setAttribute('aria-hidden', on ? 'false' : 'true');
        });
      }

      function offsetFor(i) {
        var slide = slides[i];
        if (!slide) return 0;
        var left = slide.offsetLeft;
        if (position === 'center') {
          var vw = viewport.clientWidth || carousel.clientWidth;
          return left - Math.max(0, (vw - slide.offsetWidth) / 2);
        }
        return left;
      }

      function goTo(i, instant) {
        if (!slides.length) return;
        index = i;
        syncActive();
        var x = -offsetFor(index);
        if (instant) {
          track.style.transitionDuration = '0ms';
          track.style.transitionProperty = 'none';
        } else {
          track.style.transitionDuration = '450ms';
          track.style.transitionProperty = 'transform';
          track.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
        }
        track.style.transform = 'translate3d(' + x + 'px, 0, 0)';
      }

      function step(dir) {
        if (animating) return;
        animating = true;
        var next = index + dir;
        var last = Math.max(realCount, 1) - 1;
        if (next > last) next = 0;
        else if (next < 0) next = last;
        goTo(next, false);
        window.setTimeout(function () {
          animating = false;
        }, 480);
      }

      qsa(carousel, '[data-direction="previous"]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          step(-1);
        });
      });
      qsa(carousel, '[data-direction="next"]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          step(1);
        });
      });

      function onResize() {
        setSpp();
        goTo(index, true);
      }
      window.addEventListener('resize', onResize);

      window.requestAnimationFrame(function () {
        goTo(0, true);
      });
    });
  }

  function getProductJson(root) {
    var cfg = window.tbf2Pdp || {};
    if (cfg.variants && cfg.variants.length) {
      return {
        id: cfg.productId,
        handle: cfg.productHandle,
        options: cfg.options || ['Size', 'Color'],
        variants: cfg.variants
      };
    }
    var el =
      document.getElementById('tbf2-deps-template-product') ||
      document.getElementById('replo-deps-template-product') ||
      (root && root.querySelector('#tbf2-deps-template-product')) ||
      (root && root.querySelector('#replo-deps-template-product'));
    if (!el) return null;
    try {
      var raw = (el.textContent || '').trim();
      if (!raw || raw.charAt(0) === '<') return null;
      var parsed = JSON.parse(raw);
      return parsed.data || parsed;
    } catch (e) {
      console.warn('[tbf2] product deps JSON parse failed', e);
      return null;
    }
  }

  function money(cents) {
    if (window.Shopify && Shopify.formatMoney) {
      return Shopify.formatMoney(cents, (window.theme && theme.moneyFormat) || undefined);
    }
    return '$' + (cents / 100).toFixed(2);
  }

  // Fallback paint when theme has no color.png swatch image
  var SWATCH_FALLBACKS = {
    black: '#1a1a1a',
    white: '#f5f5f5',
    nude: '#e8c4a8',
    beige: '#e8d5c4',
    ivory: '#fffff0',
    cream: '#fffdd0',
    blush: '#de98a0',
    pink: '#f4a6b8',
    mocha: '#a67b5b',
    brown: '#8b5a2b',
    espresso: '#4a3728',
    caramel: '#c68e57',
    taupe: '#b09080',
    champagne: '#f7e7ce',
    sand: '#c2b280',
    almond: '#efdecd',
    latte: '#c3a995',
    honey: '#ebc070',
    cocoa: '#6f4e37',
    grey: '#9ca3af',
    gray: '#9ca3af',
    silver: '#c0c0c0',
    red: '#c41e3a',
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
    yellow: '#eab308',
    orange: '#f97316'
  };

  function swatchPaint(value) {
    var key = String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    var last = key.split(/\s+/).pop() || key;
    if (SWATCH_FALLBACKS[last]) return SWATCH_FALLBACKS[last];
    if (SWATCH_FALLBACKS[key.replace(/\s+/g, '')]) return SWATCH_FALLBACKS[key.replace(/\s+/g, '')];
    return last;
  }

  function syncBundlePickers(colorVal, sizeVal) {
    var pickers = document.querySelectorAll('#bundler-iw .pair-picker');
    if (!pickers.length) return;
    pickers.forEach(function (picker) {
      var selects = picker.querySelectorAll('select');
      var sizeSelect = selects[0];
      var colorSelect = selects[1];
      if (!sizeSelect || !colorSelect) return;

      function pickColor() {
        var opts = Array.prototype.slice.call(colorSelect.options);
        var hit = opts.find(function (o) {
          return o.value === colorVal;
        });
        if (!hit) {
          hit = opts.find(function (o) {
            return String(o.value).toLowerCase() === String(colorVal).toLowerCase();
          });
        }
        if (!hit || !hit.value) return;
        colorSelect.value = hit.value;
        colorSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      var sizeReady =
        sizeSelect.value &&
        sizeSelect.selectedIndex > 0 &&
        !/^select size$/i.test(sizeSelect.value);

      if (!sizeReady) {
        var sizeToUse = sizeVal;
        if (!sizeToUse) {
          var sizeOpts = Array.prototype.slice.call(sizeSelect.options).filter(function (o) {
            return o.value && !/^select size$/i.test(o.value);
          });
          sizeToUse = sizeOpts.length ? sizeOpts[0].value : '';
        }
        if (sizeToUse) {
          sizeSelect.value = sizeToUse;
          sizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        window.setTimeout(pickColor, 0);
      } else {
        pickColor();
      }
    });
  }

  function initVariants(root) {
    if (root.getAttribute('data-tbf2-variants-ready') === '1') return;

    var product = getProductJson(root);
    if (!product || !product.variants || !product.variants.length) {
      console.warn('[tbf2] variants unavailable — swatches not bound');
      return;
    }

    root.setAttribute('data-tbf2-variants-ready', '1');

    function optionName(o) {
      return typeof o === 'string' ? o : o && o.name;
    }
    var optionNames = (product.options || []).map(optionName).filter(Boolean);
    if (!optionNames.length) {
      optionNames = ['Size', 'Color'].filter(function (_, idx) {
        return product.variants.some(function (v) {
          return v['option' + (idx + 1)];
        });
      });
    }

    var selected = {};
    var urlVariantId = null;
    try {
      urlVariantId = new URL(window.location.href).searchParams.get('variant');
    } catch (err) {}
    var current =
      (urlVariantId &&
        product.variants.find(function (v) {
          return String(v.id) === String(urlVariantId);
        })) ||
      product.variants.find(function (v) {
        return v.available;
      }) ||
      product.variants[0];
    optionNames.forEach(function (optName, idx) {
      selected[optName] = current['option' + (idx + 1)];
    });

    var colorName =
      optionNames.find(function (n) {
        return /color|colour|shade|tone/i.test(n);
      }) ||
      (optionNames.length > 1 ? optionNames[1] : optionNames[0]) ||
      null;
    var sizeName =
      optionNames.find(function (n) {
        return /size|cup|band/i.test(n);
      }) ||
      (optionNames[0] !== colorName ? optionNames[0] : null);

    var colorValues = [];
    if (colorName) {
      var colorPos = optionNames.indexOf(colorName) + 1;
      var seen = {};
      product.variants.forEach(function (v) {
        var val = v['option' + colorPos];
        if (val && !seen[val]) {
          seen[val] = 1;
          colorValues.push(val);
        }
      });
    }

    var listbox = root.querySelector('[data-tbf2-option-select]');
    if (listbox && colorValues.length) {
      qsa(listbox, '[role="option"]').forEach(function (opt, idx) {
        var val = (opt.getAttribute('data-tbf2-option-value') || colorValues[idx] || '').trim();
        if (!val) return;
        opt.setAttribute('data-tbf2-option-value', val);
        var disc = opt.querySelector('.tbf2-r-tw2wh8') || opt.firstElementChild;
        if (!disc) return;
        var paint = swatchPaint(val);
        var existingBg = disc.style.getPropertyValue(
          '--replo-attributes-currentoption-swatches-color-color-background-color'
        );
        var existingImg = disc.style.getPropertyValue(
          '--replo-attributes-currentoption-swatches-color-color-background-image'
        );
        var needsFallback =
          !existingImg &&
          (!existingBg ||
            existingBg === 'transparent' ||
            (existingBg.indexOf('#') !== 0 && !SWATCH_FALLBACKS[String(existingBg).toLowerCase()]));
        if (needsFallback || !existingBg) {
          disc.style.setProperty(
            '--replo-attributes-currentoption-swatches-color-color-background-color',
            paint.indexOf('#') === 0 ? paint : swatchPaint(val)
          );
        }
        if (!existingImg) {
          disc.style.backgroundColor = disc.style.getPropertyValue(
            '--replo-attributes-currentoption-swatches-color-color-background-color'
          );
        }
      });
    }

    function findVariant(preferOptName) {
      var exact = product.variants.find(function (v) {
        return optionNames.every(function (optName, idx) {
          return !selected[optName] || v['option' + (idx + 1)] === selected[optName];
        });
      });
      if (exact) return exact;

      if (preferOptName && selected[preferOptName]) {
        var pos = optionNames.indexOf(preferOptName) + 1;
        var val = selected[preferOptName];
        var pool = product.variants.filter(function (v) {
          return v['option' + pos] === val;
        });
        if (sizeName && selected[sizeName]) {
          var sizePos = optionNames.indexOf(sizeName) + 1;
          var withSize = pool.filter(function (v) {
            return v['option' + sizePos] === selected[sizeName];
          });
          if (withSize.length) pool = withSize;
        }
        var hit =
          pool.find(function (v) {
            return v.available;
          }) || pool[0];
        if (hit) {
          optionNames.forEach(function (optName, idx) {
            selected[optName] = hit['option' + (idx + 1)];
          });
        }
        return hit || null;
      }
      return null;
    }

    function updateColorLabel(name) {
      var label = root.querySelector('.tbf2-r-lkrg9v');
      if (label && name) label.textContent = name;
    }

    function syncGalleryToVariant(variant) {
      if (!variant) return;
      var mediaId = null;
      var map = (window.tbf2Pdp && window.tbf2Pdp.variantMedia) || {};
      if (variant.id != null && map[String(variant.id)]) mediaId = map[String(variant.id)];
      if (!mediaId && variant.id != null && map[variant.id]) mediaId = map[variant.id];
      if (!mediaId && variant.featured_media && variant.featured_media.id) {
        mediaId = variant.featured_media.id;
      } else if (
        !mediaId &&
        variant.featured_image &&
        typeof variant.featured_image === 'object' &&
        variant.featured_image.id
      ) {
        mediaId = variant.featured_image.id;
      } else if (!mediaId && window.tbf2Pdp && window.tbf2Pdp.media && variant.featured_image) {
        var want = String(
          typeof variant.featured_image === 'string'
            ? variant.featured_image
            : variant.featured_image.src || ''
        ).split('?')[0];
        var mediaList = window.tbf2Pdp.media;
        var hit =
          mediaList.find(function (m) {
            return m.src && m.src.split('?')[0] === want;
          }) ||
          mediaList.find(function (m) {
            if (!want || !m.src) return false;
            var base = want.split('/').pop().replace(/_\d+x\./, '.').split('.')[0];
            return base && m.src.indexOf(base) !== -1;
          });
        if (hit) mediaId = hit.id;
      }
      if (!mediaId) return;
      qsa(root, '[data-tbf2-gallery]').forEach(function (gal) {
        showGalleryMedia(gal, mediaId);
      });
      // Mobile native Replo media carousel — jump to matching slide by image basename
      var mediaItem =
        (window.tbf2Pdp &&
          window.tbf2Pdp.media &&
          window.tbf2Pdp.media.find(function (m) {
            return String(m.id) === String(mediaId);
          })) ||
        null;
      if (mediaItem) {
        qsa(root, '.tbf2-r-crmaa3 [data-tbf2-carousel]').forEach(function (carousel) {
          if (typeof carousel._tbf2GoToSlide === 'function') {
            var tip = String(mediaItem.src || mediaItem.preview || '')
              .split('?')[0]
              .split('/')
              .pop();
            var realSlides = qsa(carousel, '[data-tbf2-part="slide"][data-is-cloned="false"]');
            if (!realSlides.length) {
              realSlides = qsa(carousel, '[data-tbf2-part="slide"]').filter(function (s) {
                return s.getAttribute('data-is-cloned') !== 'true';
              });
            }
            var idx = realSlides.findIndex(function (slide) {
              var img = slide.querySelector('img');
              return img && tip && (img.src || '').indexOf(tip.split('.')[0]) !== -1;
            });
            if (idx >= 0) carousel._tbf2GoToSlide(idx);
          }
        });
      }
    }

    function applyVariant(variant) {
      if (!variant) return;
      current = variant;
      var buyBox =
        root.querySelector('[data-tbf2-product-container]:not([role="button"])') || root;
      qsa(buyBox, 'form[action*="/cart/add"] [name="id"]').forEach(function (input) {
        input.value = variant.id;
      });
      qsa(root, '[data-tbf2-price]').forEach(function (el) {
        el.textContent = money(variant.price);
      });
      qsa(root, '[data-tbf2-option-select] [role="option"]').forEach(function (opt) {
        var val = opt.getAttribute('data-tbf2-option-value');
        var on = !!(colorName && selected[colorName] === val);
        if (!colorName) {
          on = Object.keys(selected).some(function (k) {
            return selected[k] === val;
          });
        }
        opt.setAttribute('aria-selected', on ? 'true' : 'false');
        opt.classList.toggle('tbf2-r-1fqxyeq', on);
        opt.classList.toggle('r-1fqxyeq', on);
      });
      if (colorName && selected[colorName]) updateColorLabel(selected[colorName]);
      syncGalleryToVariant(variant);
      try {
        document.dispatchEvent(
          new CustomEvent('variant:change', {
            detail: { variant: variant }
          })
        );
      } catch (err3) {}
      try {
        if (window.history && window.history.replaceState && variant.id) {
          var url = new URL(window.location.href);
          url.searchParams.set('variant', String(variant.id));
          window.history.replaceState({}, '', url.toString());
        }
      } catch (err2) {}
    }

    function selectColor(val, optEl) {
      if (!val) return;
      var matchedOpt =
        optionNames.find(function (optName) {
          var p = optionNames.indexOf(optName) + 1;
          return product.variants.some(function (v) {
            return v['option' + p] === val;
          });
        }) || colorName;
      if (!matchedOpt) matchedOpt = colorName;
      if (!matchedOpt) return;

      selected[matchedOpt] = val;
      updateColorLabel(val);
      qsa(root, '[data-tbf2-option-select] [role="option"]').forEach(function (other) {
        var on = other === optEl || other.getAttribute('data-tbf2-option-value') === val;
        other.setAttribute('aria-selected', on ? 'true' : 'false');
        other.classList.toggle('tbf2-r-1fqxyeq', on);
        other.classList.toggle('r-1fqxyeq', on);
      });
      var variant = findVariant(matchedOpt);
      applyVariant(variant);
      syncBundlePickers(val, sizeName ? selected[sizeName] : null);
    }

    // Event delegation — survives re-renders / nested disc clicks
    if (root.getAttribute('data-tbf2-swatch-delegate') !== '1') {
      root.setAttribute('data-tbf2-swatch-delegate', '1');
      root.addEventListener(
        'click',
        function (e) {
          var opt = e.target.closest('[data-tbf2-option-select] [role="option"]');
          if (!opt || !root.contains(opt)) return;
          e.preventDefault();
          e.stopPropagation();
          var val = (opt.getAttribute('data-tbf2-option-value') || '').trim();
          if (!val) {
            var opts = qsa(root, '[data-tbf2-option-select] [role="option"]');
            var idx = opts.indexOf(opt);
            val = colorValues[idx] || '';
          }
          selectColor(val, opt);
        },
        true
      );
    }

    applyVariant(current);
  }

  function safeJson(res) {
    var ct = (res.headers && res.headers.get('content-type')) || '';
    if (!res.ok || ct.indexOf('application/json') === -1) {
      return res.text().then(function (t) {
        throw new Error('Non-JSON cart response: ' + res.status + ' ' + t.slice(0, 80));
      });
    }
    return res.json();
  }

  function cartAddUrl() {
    if (window.routes && window.routes.cart_add_url) {
      var u = window.routes.cart_add_url;
      return u.indexOf('.js') === -1 ? u + '.js' : u;
    }
    if (window.Shopify && Shopify.routes && Shopify.routes.root) {
      return Shopify.routes.root + 'cart/add.js';
    }
    return '/cart/add.js';
  }

  function cartJsUrl() {
    if (window.routes && window.routes.cart_js_url) return window.routes.cart_js_url;
    if (window.Shopify && Shopify.routes && Shopify.routes.root) {
      return Shopify.routes.root + 'cart.js';
    }
    return '/cart.js';
  }

  function initAtc(root) {
    qsa(root, '[data-tbf2-add-product-variant-to-cart]').forEach(function (btn) {
      if (btn.getAttribute('data-tbf2-ready') === '1') return;
      btn.setAttribute('data-tbf2-ready', '1');
      btn.addEventListener('click', function (e) {
        var container = btn.closest('[data-tbf2-product-container]');
        var form =
          (container &&
            (container.querySelector('form[action*="cart/add"]') ||
              container.querySelector('form[data-type="add-to-cart-form"]'))) ||
          root.querySelector('form[action*="cart/add"]') ||
          root.querySelector('form[data-type="add-to-cart-form"]');
        if (!form) return;
        e.preventDefault();
        e.stopPropagation();
        var fd = new FormData(form);
        if (!fd.get('id')) {
          console.warn('[tbf2] ATC missing variant id');
          return;
        }
        fetch(cartAddUrl(), {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: fd,
        })
          .then(safeJson)
          .then(function () {
            document.dispatchEvent(new CustomEvent('cart:refresh'));
            document.dispatchEvent(new CustomEvent('tbf2:cart:added'));
            // Refresh cart JSON the theme expects (avoid HTML /cart page)
            return fetch(cartJsUrl(), { headers: { Accept: 'application/json' } }).then(function (r) {
              if (r.ok) return safeJson(r).catch(function () { return null; });
              return null;
            });
          })
          .catch(function (err) {
            console.warn('[tbf2] ATC failed', err);
          });
      });
    });
  }

  function getThumbsPerRow() {
    var n = parseInt((window.tbf2Pdp && window.tbf2Pdp.thumbsPerRow) || 2, 10);
    if (!n || n < 1) n = 2;
    return n;
  }

  function getThumbsLayout() {
    var layout = (window.tbf2Pdp && window.tbf2Pdp.thumbsLayout) || 'grid';
    return layout === 'scroll' ? 'scroll' : 'grid';
  }

  function desktopLightboxEnabled() {
    return !!(window.tbf2Pdp && window.tbf2Pdp.desktopLightbox !== false);
  }

  function ensureLightbox() {
    var box = document.getElementById('tbf2-lightbox');
    if (box) return box;
    box = document.createElement('div');
    box.id = 'tbf2-lightbox';
    box.className = 'tbf2-lightbox';
    box.setAttribute('hidden', '');
    box.innerHTML =
      '<button type="button" class="tbf2-lightbox__close" aria-label="Close">&times;</button>' +
      '<img class="tbf2-lightbox__img" alt="" />';
    document.body.appendChild(box);
    function close() {
      box.classList.remove('is-open');
      box.setAttribute('hidden', '');
      document.documentElement.style.overflow = '';
    }
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('.tbf2-lightbox__close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) close();
    });
    return box;
  }

  function openLightbox(src, alt) {
    if (!src) return;
    if (!window.matchMedia('(min-width: 641px)').matches) return;
    if (!desktopLightboxEnabled()) return;
    var box = ensureLightbox();
    var img = box.querySelector('.tbf2-lightbox__img');
    if (img) {
      img.src = src;
      img.alt = alt || '';
    }
    box.removeAttribute('hidden');
    box.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  }

  function buildGalleryEl() {
    var media = (window.tbf2Pdp && window.tbf2Pdp.media) || [];
    var perRow = getThumbsPerRow();
    var layout = getThumbsLayout();
    var wrap = document.createElement('div');
    wrap.className = 'tbf2-gallery';
    wrap.setAttribute('data-tbf2-gallery', '');
    wrap.setAttribute('data-thumbs-per-row', String(perRow));
    wrap.setAttribute('data-thumbs-layout', layout);
    if (!desktopLightboxEnabled()) wrap.setAttribute('data-lightbox', 'off');
    wrap.style.setProperty('--tbf2-thumbs-per-row', String(perRow));

    var stage = document.createElement('div');
    stage.className = 'tbf2-gallery__stage';
    stage.setAttribute('data-tbf2-stage', '');

    var thumbs = document.createElement('div');
    thumbs.className = 'tbf2-gallery__thumbs';
    thumbs.setAttribute('data-tbf2-thumbs', '');
    thumbs.setAttribute('role', 'tablist');
    thumbs.setAttribute('aria-label', 'Product media');

    media.forEach(function (m, idx) {
      var slide = document.createElement('div');
      slide.className = 'tbf2-gallery__media' + (idx === 0 ? ' is-active' : '');
      slide.setAttribute('data-media-id', String(m.id));
      if (idx !== 0) slide.setAttribute('hidden', '');
      var img = document.createElement('img');
      img.className = 'tbf2-gallery__image';
      img.src = m.src;
      img.alt = m.alt || '';
      img.loading = idx === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      stage.appendChild(slide);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tbf2-gallery__thumb' + (idx === 0 ? ' is-active' : '');
      btn.setAttribute('data-media-id', String(m.id));
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', m.alt || 'Media ' + (idx + 1));
      var timg = document.createElement('img');
      timg.src = m.preview || m.src;
      timg.alt = '';
      timg.loading = 'lazy';
      btn.appendChild(timg);
      thumbs.appendChild(btn);
    });

    if (media.length > 1) {
      var ARROW_PREV =
        'https://assets.replocdn.com/projects/a2c7c51a-ec22-4e36-a9ea-6f00296360e2/be45b475-4f1b-4923-b904-21d41e0d3793';
      var ARROW_NEXT =
        'https://assets.replocdn.com/projects/a2c7c51a-ec22-4e36-a9ea-6f00296360e2/cd51f7fb-1c6e-499e-befc-190ab7c842e6';
      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'tbf2-gallery__nav tbf2-gallery__nav--prev tbf2-r-h33pie';
      prev.setAttribute('data-tbf2-gallery-prev', '');
      prev.setAttribute('aria-label', 'Previous image');
      prev.innerHTML =
        '<picture><source srcset="' +
        ARROW_PREV +
        '?width=40" media="(max-width: 640px)"><img src="' +
        ARROW_PREV +
        '" alt="" width="48" height="48" loading="lazy"></picture>';
      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'tbf2-gallery__nav tbf2-gallery__nav--next tbf2-r-h33pie';
      next.setAttribute('data-tbf2-gallery-next', '');
      next.setAttribute('aria-label', 'Next image');
      next.innerHTML =
        '<picture><source srcset="' +
        ARROW_NEXT +
        '?width=40" media="(max-width: 640px)"><img src="' +
        ARROW_NEXT +
        '" alt="" width="48" height="48" loading="lazy"></picture>';
      stage.appendChild(prev);
      stage.appendChild(next);
    }

    wrap.appendChild(stage);
    if (media.length) wrap.appendChild(thumbs);
    return wrap;
  }

  function applyThumbsPerRow(gal) {
    if (!gal) return;
    var perRow = getThumbsPerRow();
    var layout = getThumbsLayout();
    gal.setAttribute('data-thumbs-per-row', String(perRow));
    gal.setAttribute('data-thumbs-layout', layout);
    if (!desktopLightboxEnabled()) gal.setAttribute('data-lightbox', 'off');
    else gal.removeAttribute('data-lightbox');
    gal.style.setProperty('--tbf2-thumbs-per-row', String(perRow));
  }

  function showGalleryMedia(gal, id) {
    if (!gal || id == null || id === '') return;
    var want = String(id);
    var thumbs = gal.querySelector('[data-tbf2-thumbs]');
    var mediaNodes = qsa(gal, '.tbf2-gallery__media');
    if (!mediaNodes.length) return;

    mediaNodes.forEach(function (media) {
      var on = String(media.getAttribute('data-media-id')) === want;
      media.classList.toggle('is-active', on);
      if (on) media.removeAttribute('hidden');
      else media.setAttribute('hidden', '');
      var vid = media.querySelector('video');
      if (vid && !on) {
        try {
          vid.pause();
        } catch (err) {}
      }
    });

    if (thumbs) {
      qsa(thumbs, '.tbf2-gallery__thumb').forEach(function (t) {
        var on = String(t.getAttribute('data-media-id')) === want;
        t.classList.toggle('is-active', on);
        if (on && typeof t.scrollIntoView === 'function') {
          try {
            t.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
          } catch (err2) {}
        }
      });
    }

    var allMedia = qsa(gal, '.tbf2-gallery__media');
    var ids = allMedia.map(function (m) {
      return m.getAttribute('data-media-id');
    });
    syncIndexEdgeArrows(gal, ids.indexOf(want), ids.length);
  }

  function stepGallery(gal, dir) {
    if (!gal) return;
    var mediaNodes = qsa(gal, '.tbf2-gallery__media');
    if (mediaNodes.length < 2) return;
    var ids = mediaNodes.map(function (m) {
      return m.getAttribute('data-media-id');
    });
    var active = gal.querySelector('.tbf2-gallery__media.is-active');
    var cur = active ? active.getAttribute('data-media-id') : ids[0];
    var idx = ids.indexOf(cur);
    if (idx < 0) idx = 0;
    var next = idx + dir;
    if (next < 0 || next >= ids.length) return;
    showGalleryMedia(gal, ids[next]);
  }

  function initGalleryThumbs(root) {
    // Delegated clicks — arrows + thumbs always sync, even after remount
    if (root.getAttribute('data-tbf2-gallery-delegate') === '1') {
      qsa(root, '[data-tbf2-gallery]').forEach(function (gal) {
        gal.setAttribute('data-tbf2-ready', '1');
        var active = gal.querySelector('.tbf2-gallery__media.is-active');
        if (active) showGalleryMedia(gal, active.getAttribute('data-media-id'));
      });
      return;
    }
    root.setAttribute('data-tbf2-gallery-delegate', '1');

    root.addEventListener(
      'click',
      function (e) {
        var gal = e.target.closest('[data-tbf2-gallery]');
        if (!gal || !root.contains(gal)) return;

        if (e.target.closest('[data-tbf2-gallery-prev]')) {
          e.preventDefault();
          e.stopPropagation();
          stepGallery(gal, -1);
          return;
        }
        if (e.target.closest('[data-tbf2-gallery-next]')) {
          e.preventDefault();
          e.stopPropagation();
          stepGallery(gal, 1);
          return;
        }

        var thumbs = gal.querySelector('[data-tbf2-thumbs]');
        var thumb = e.target.closest('.tbf2-gallery__thumb[data-media-id]');
        if (thumb && thumbs && thumbs.contains(thumb)) {
          e.preventDefault();
          e.stopPropagation();
          showGalleryMedia(gal, thumb.getAttribute('data-media-id'));
          return;
        }

        // Desktop only: click main image → lightbox popup
        var stage = gal.querySelector('[data-tbf2-stage]');
        if (
          stage &&
          stage.contains(e.target) &&
          !e.target.closest('[data-tbf2-gallery-prev], [data-tbf2-gallery-next]') &&
          desktopLightboxEnabled() &&
          window.matchMedia('(min-width: 641px)').matches
        ) {
          var active = gal.querySelector('.tbf2-gallery__media.is-active img, .tbf2-gallery__media:not([hidden]) img');
          if (active && active.getAttribute('src')) {
            e.preventDefault();
            openLightbox(active.getAttribute('src'), active.getAttribute('alt') || '');
          }
        }
      },
      true
    );

    qsa(root, '[data-tbf2-gallery]').forEach(function (gal) {
      gal.setAttribute('data-tbf2-ready', '1');
      var active = gal.querySelector('.tbf2-gallery__media.is-active');
      if (active) showGalleryMedia(gal, active.getAttribute('data-media-id'));
    });
  }

  function mountCustomGallery(root) {
    // Always custom gallery (main + thumbs + arrows) — matches current design
    root.classList.remove('tbf2-gallery-mobile-native');
    root.classList.add('tbf2-gallery-desktop-custom');

    if (root.classList.contains('tbf2-gallery-ready')) {
      qsa(root, '[data-tbf2-gallery]').forEach(applyThumbsPerRow);
      initGalleryThumbs(root);
      return;
    }

    var slot = root.querySelector('[data-tbf2-gallery-slot]');
    var gallery = slot && slot.querySelector('[data-tbf2-gallery]');
    if (gallery) {
      applyThumbsPerRow(gallery);
    } else {
      gallery = buildGalleryEl();
    }

    var hosts = qsa(root, '.tbf2-r-crmaa3');
    if (!hosts.length) {
      var carousel = root.querySelector('.tbf2-r-crmaa3 [data-tbf2-carousel]');
      if (carousel && carousel.parentElement) hosts = [carousel.parentElement];
    }

    if (hosts.length) {
      hosts.forEach(function (host, i) {
        var node = i === 0 ? gallery : gallery.cloneNode(true);
        if (i > 0) node.removeAttribute('data-tbf2-ready');
        host.setAttribute('data-tbf2-gallery-host', '');
        var carouselEl = host.querySelector('[data-tbf2-carousel]');
        if (carouselEl) {
          carouselEl.classList.add('tbf2-replo-media-carousel');
          if (!host.querySelector('[data-tbf2-gallery]')) {
            // Replace Replo carousel so only one gallery receives clicks
            carouselEl.replaceWith(node);
          }
        } else if (!host.querySelector('[data-tbf2-gallery]')) {
          host.appendChild(node);
        }
      });
      if (slot && slot.parentNode) slot.parentNode.removeChild(slot);
      root.classList.add('tbf2-gallery-ready');
    } else if (slot) {
      // Never leave gallery above the buy box — keep hidden and retry briefly
      slot.style.setProperty('display', 'none', 'important');
      var tries = Number(root.getAttribute('data-tbf2-gallery-tries') || '0');
      if (tries < 12) {
        root.setAttribute('data-tbf2-gallery-tries', String(tries + 1));
        setTimeout(function () {
          root.classList.remove('tbf2-gallery-ready');
          mountCustomGallery(root);
        }, 250);
      }
      return;
    }

    initGalleryThumbs(root);
  }

  function initRealTalk(root) {
    // Prefer Replo-style peek carousel driven by Theme Editor blocks
    var box =
      root.querySelector('[data-tbf2-realtalk]') ||
      root.querySelector('[data-tbf2-id="ead1a598-00ef-44c7-b0cf-ab9855ef250b"]');
    if (!box) return;

    var cfg = (window.tbf2Pdp && window.tbf2Pdp.realTalk) || {};
    var section = box.closest('[data-tbf2-id="ead1a598-00ef-44c7-b0cf-ab9855ef250b"]') || box;
    section.setAttribute('data-tbf2-realtalk', 'true');

    if (cfg.heading) {
      var heading = section.querySelector('p');
      if (heading && /real talk/i.test(heading.textContent || '')) {
        heading.textContent = cfg.heading;
      }
    }

    var rtVideos = root.querySelector('[data-tbf2-rt-videos]');
    if (rtVideos && !rtVideos.querySelector('[data-tbf2-rt-slide]')) {
      // No Real Talk blocks — hide the whole section, no fallback
      rtVideos.hidden = true;
      section.style.setProperty('display', 'none', 'important');
      return;
    }
    var mediaWrap = section.querySelector('.tbf2-r-15g6h3d');
    var host = section.querySelector('.tbf2-r-6coc2');
    if (rtVideos && (mediaWrap || host || section)) {
      var mount = mediaWrap || host || section;
      section.classList.add('tbf2-realtalk--carousel');
      section.classList.remove('tbf2-realtalk--single');
      rtVideos.hidden = false;
      rtVideos.removeAttribute('hidden');
      rtVideos.removeAttribute('data-tbf2-ready');
      if (mediaWrap) {
        Array.prototype.slice.call(mediaWrap.children).forEach(function (ch) {
          if (!ch.hasAttribute('data-tbf2-rt-videos')) ch.style.setProperty('display', 'none', 'important');
        });
      } else if (host && host !== mount) {
        host.style.setProperty('display', 'none', 'important');
      }
      if (rtVideos.parentElement !== mount) mount.appendChild(rtVideos);
      initRtVideosCarousel(rtVideos);
      return;
    }

    // Legacy single-video fallback (section setting / metafield)
    var video = section.querySelector('[data-tbf2-realtalk-video], video');
    var dummy = section.querySelector('[data-tbf2-realtalk-dummy]');
    var playBtn = section.querySelector('.tbf2-r-eioolz, [aria-label="Play"]');
    host = section.querySelector('.tbf2-r-6coc2') || (video && video.parentElement);

    var tpl = document.getElementById('tbf2-realtalk-video-tpl');
    if (tpl && host) {
      var keepDummy = dummy;
      host.innerHTML = '';
      host.appendChild(tpl.content.cloneNode(true));
      video = host.querySelector('video');
      if (keepDummy) {
        host.appendChild(keepDummy);
        keepDummy.hidden = true;
      }
    } else if (cfg.videoUrl && video) {
      if (cfg.posterUrl) video.setAttribute('poster', cfg.posterUrl);
      video.removeAttribute('controls');
      video.setAttribute('playsinline', '');
      video.setAttribute('preload', 'metadata');
      video.innerHTML = '';
      var source = document.createElement('source');
      source.src = cfg.videoUrl;
      source.type = 'video/mp4';
      video.appendChild(source);
      try {
        video.load();
      } catch (e) {}
      if (dummy) dummy.hidden = true;
    } else if (dummy && (!video || !video.querySelector('source'))) {
      if (!cfg.videoUrl) {
        dummy.hidden = false;
        dummy.innerHTML =
          cfg.dummyHtml ||
          '<p>Customer stories coming soon — soft, lightweight confidence after mastectomy.</p>';
      }
    }

    video = section.querySelector('[data-tbf2-realtalk-video], video');
    playBtn = section.querySelector('.tbf2-r-eioolz');
    if (!video) return;

    video.setAttribute('playsinline', '');
    video.style.pointerEvents = 'auto';
    video.style.cursor = 'pointer';

    function setPlaying(on) {
      if (playBtn) {
        playBtn.style.opacity = on ? '0' : '1';
        playBtn.style.pointerEvents = on ? 'none' : 'auto';
      }
    }

    function togglePlay(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (video.paused) {
        video.play().then(function () {
          setPlaying(true);
        }).catch(function () {});
      } else {
        video.pause();
        setPlaying(false);
      }
    }

    if (playBtn && !playBtn.getAttribute('data-tbf2-rt-bound')) {
      playBtn.setAttribute('data-tbf2-rt-bound', '1');
      playBtn.addEventListener('click', togglePlay);
    }
    if (!video.getAttribute('data-tbf2-rt-bound')) {
      video.setAttribute('data-tbf2-rt-bound', '1');
      video.addEventListener('click', togglePlay);
      video.addEventListener('ended', function () {
        setPlaying(false);
      });
    }
  }

  function initRtVideosCarousel(box) {
    if (!box) return;
    if (box.getAttribute('data-tbf2-ready') === '1') return;
    box.setAttribute('data-tbf2-ready', '1');
    var track = box.querySelector('[data-tbf2-rt-track]');
    var prev = box.querySelector('[data-tbf2-rt-prev]');
    var next = box.querySelector('[data-tbf2-rt-next]');
    if (!track) return;

    function slideWidth() {
      var slide = track.querySelector('[data-tbf2-rt-slide]');
      if (!slide) return track.clientWidth * 0.7;
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap) || 12;
      return slide.getBoundingClientRect().width + gap;
    }

    /* Set while an arrow-triggered smooth scroll is still running. */
    var rtScrollAnim = null;

    function syncRtArrows() {
      var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
      var canScroll = maxScroll > 4;
      var atStart = !canScroll || track.scrollLeft <= 4;
      var atEnd = !canScroll || track.scrollLeft >= maxScroll - 4;

      /* Clamp to hard edges — prevent over-scroll bleed.
         Never while an arrow-triggered smooth scroll is in flight: this runs on
         every scroll event, so the first frame of that animation (still within
         4px of the edge) would assign scrollLeft, which cancels the animation
         and snaps straight back. That is what made the arrows look dead on the
         first and last slide. */
      if (!rtScrollAnim) {
        if (atStart && track.scrollLeft !== 0) track.scrollLeft = 0;
        if (atEnd && canScroll) track.scrollLeft = maxScroll + 2;
      }

      function setArrow(btn, hide) {
        if (!btn) return;
        btn.classList.toggle('is-edge-hidden', hide);
        btn.hidden = !!hide;
        if (hide) {
          btn.setAttribute('aria-hidden', 'true');
          btn.tabIndex = -1;
          btn.disabled = true;
          btn.style.setProperty('display', 'none', 'important');
          btn.style.setProperty('visibility', 'hidden', 'important');
          btn.style.setProperty('opacity', '0', 'important');
          btn.style.setProperty('pointer-events', 'none', 'important');
        } else {
          btn.removeAttribute('aria-hidden');
          btn.tabIndex = 0;
          btn.disabled = false;
          btn.removeAttribute('disabled');
          btn.style.setProperty('display', 'inline-flex', 'important');
          btn.style.setProperty('visibility', 'visible', 'important');
          btn.style.setProperty('opacity', '1', 'important');
          btn.style.setProperty('pointer-events', 'auto', 'important');
        }
      }

      setArrow(prev, atStart);
      setArrow(next, atEnd);
    }

    function scrollByDir(dir) {
      var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
      if (dir < 0 && track.scrollLeft <= 4) return;
      if (dir > 0 && track.scrollLeft >= maxScroll - 4) return;
      if (rtScrollAnim) clearTimeout(rtScrollAnim);
      rtScrollAnim = setTimeout(function () {
        rtScrollAnim = null;
        syncRtArrows();
      }, 700);
      track.scrollBy({ left: dir * slideWidth(), behavior: 'smooth' });
      setTimeout(syncRtArrows, 320);
    }

    if (prev) {
      prev.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        scrollByDir(-1);
      });
    }
    if (next) {
      next.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        scrollByDir(1);
      });
    }

    /* Block trackpad/wheel left-overscroll at start and right-overscroll at end */
    track.addEventListener('wheel', function (e) {
      var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
      var atStart = track.scrollLeft <= 2;
      var atEnd = track.scrollLeft >= maxScroll - 2;
      if ((e.deltaX < 0 && atStart) || (e.deltaX > 0 && atEnd)) {
        e.preventDefault();
      }
    }, { passive: false });

    /* Snap back to hard edges after touch/swipe drift */
    track.addEventListener('touchend', function () {
      setTimeout(function () {
        var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
        if (track.scrollLeft < 2) track.scrollLeft = 0;
        if (track.scrollLeft > maxScroll - 2) track.scrollLeft = maxScroll + 2;
        syncRtArrows();
      }, 50);
    }, { passive: true });

    track.addEventListener('scroll', syncRtArrows, { passive: true });
    track.addEventListener('scrollend', function () {
      /* Momentum is done, so an arrow animation is done too — release the guard
         before clamping, otherwise the clamp below is the only one that ever
         runs at an edge. */
      if (rtScrollAnim) {
        clearTimeout(rtScrollAnim);
        rtScrollAnim = null;
      }
      var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
      if (track.scrollLeft < 2) track.scrollLeft = 0;
      if (track.scrollLeft > maxScroll - 2) track.scrollLeft = maxScroll + 2;
      syncRtArrows();
    });
    window.addEventListener('resize', syncRtArrows);
    if (typeof ResizeObserver !== 'undefined') {
      try { new ResizeObserver(syncRtArrows).observe(track); } catch (e2) {}
    }
    qsa(track, 'img, video').forEach(function (m) {
      m.addEventListener('load', syncRtArrows, { once: true });
      m.addEventListener('loadedmetadata', syncRtArrows, { once: true });
    });
    setTimeout(syncRtArrows, 50);
    setTimeout(syncRtArrows, 400);
    setTimeout(syncRtArrows, 1200);
    setTimeout(syncRtArrows, 2500);
    setTimeout(syncRtArrows, 4000);

    function videoReady(vid) {
      if (!vid) return false;
      if (vid.querySelector('source')) return true;
      if (vid.getAttribute('src')) return true;
      if (vid.currentSrc) return true;
      return false;
    }

    function ensureVideo(slide) {
      var media = slide.querySelector('.tbf2-rt-videos__media');
      if (!media) return null;
      var existing = media.querySelector('video');
      if (videoReady(existing)) return existing;
      var tplId = slide.getAttribute('data-tbf2-rt-video-tpl');
      var url = slide.getAttribute('data-tbf2-rt-video-url');
      var posterImg = media.querySelector('.tbf2-rt-videos__poster, img');
      var poster = posterImg && posterImg.getAttribute && posterImg.getAttribute('src');
      if (tplId) {
        var tpl = document.getElementById(tplId);
        var freshVideo = tpl && tpl.content && tpl.content.querySelector('video');
        if (freshVideo) {
          var fresh = freshVideo.cloneNode(true);
          fresh.classList.add('tbf2-rt-videos__video');
          fresh.setAttribute('playsinline', '');
          fresh.setAttribute('webkit-playsinline', '');
          fresh.removeAttribute('controls');
          if (poster && !fresh.getAttribute('poster')) fresh.setAttribute('poster', poster);
          if (existing) existing.replaceWith(fresh);
          else media.insertBefore(fresh, media.firstChild);
          try { fresh.load(); } catch (e1) {}
          return fresh;
        }
      }
      if (url) {
        var vid = existing || document.createElement('video');
        vid.classList.add('tbf2-rt-videos__video');
        vid.setAttribute('playsinline', '');
        vid.setAttribute('webkit-playsinline', '');
        vid.removeAttribute('controls');
        if (poster) vid.setAttribute('poster', poster);
        if (!videoReady(vid)) {
          vid.innerHTML = '';
          var source = document.createElement('source');
          source.src = url;
          source.type = 'video/mp4';
          vid.appendChild(source);
        }
        if (!existing) media.insertBefore(vid, media.firstChild);
        try { vid.load(); } catch (err) {}
        return vid;
      }
      return existing || null;
    }

    function syncMuteBtn(slide) {
      var video = slide.querySelector('video');
      var muteBtn = slide.querySelector('[data-tbf2-rt-mute]');
      if (!muteBtn) return;
      var muted = !video || video.muted;
      muteBtn.classList.toggle('is-muted', muted);
      muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    }

    function setSlidePlaying(slide, on) {
      if (!slide) return;
      slide.classList.toggle('is-playing', !!on);
      var muteBtn = slide.querySelector('[data-tbf2-rt-mute]');
      var poster = slide.querySelector('.tbf2-rt-videos__poster, img.tbf2-rt-videos__poster');
      if (muteBtn) {
        muteBtn.hidden = false;
        muteBtn.style.display = on ? '' : 'none';
        if (on) syncMuteBtn(slide);
      }
      if (poster) poster.style.opacity = on ? '0' : '1';
    }

    function playVideo(slide, video) {
      video.muted = false;
      var start = function () { setSlidePlaying(slide, true); syncMuteBtn(slide); };
      var tryPlay = function () {
        video.play().then(start).catch(function () {
          video.muted = true;
          syncMuteBtn(slide);
          video.play().then(start).catch(function () {});
        });
      };
      /* if video not loaded yet, wait for it */
      if (video.readyState < 2) {
        var onReady = function () {
          video.removeEventListener('canplay', onReady);
          tryPlay();
        };
        video.addEventListener('canplay', onReady);
        if (video.readyState === 0) { try { video.load(); } catch(e) {} }
      } else {
        tryPlay();
      }
    }

    var _toggleLock = false;
    function toggleSlide(slide) {
      if (_toggleLock) return;
      _toggleLock = true;
      setTimeout(function () { _toggleLock = false; }, 300);
      var video = ensureVideo(slide);
      if (!video) return;
      /* check if any OTHER slide was playing before we pause them */
      var anotherWasPlaying = false;
      qsa(box, '[data-tbf2-rt-slide]').forEach(function (other) {
        if (other === slide) return;
        var v = other.querySelector('video');
        if (v && !v.paused) anotherWasPlaying = true;
        if (v) { v.pause(); v.currentTime = 0; }
        setSlidePlaying(other, false);
      });
      var isPlaying = slide.classList.contains('is-playing');
      if (!isPlaying) {
        /* reset to start only when jumping from another video */
        if (anotherWasPlaying) { try { video.currentTime = 0; } catch(e) {} }
        playVideo(slide, video);
      } else {
        video.pause();
        try { video.currentTime = 0; } catch(e) {}
        setSlidePlaying(slide, false);
        var playBtn = slide.querySelector('[data-tbf2-rt-play]');
        if (playBtn) { playBtn.style.opacity = ''; playBtn.style.display = ''; }
      }
    }

    /* single delegated click handler on box */
    box.addEventListener('click', function (e) {
      var target = e.target;

      /* mute button */
      var muteBtn = target.closest('[data-tbf2-rt-mute]');
      if (muteBtn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var slide = muteBtn.closest('[data-tbf2-rt-slide]');
        var vid = slide && (slide.querySelector('video') || ensureVideo(slide));
        if (!vid) return;
        vid.muted = !vid.muted;
        muteBtn.classList.toggle('is-muted', vid.muted);
        muteBtn.setAttribute('aria-label', vid.muted ? 'Unmute' : 'Mute');
        return;
      }

      /* play/pause button */
      var playBtn = target.closest('[data-tbf2-rt-play]');
      if (playBtn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var slide = playBtn.closest('[data-tbf2-rt-slide]');
        if (slide) toggleSlide(slide);
        return;
      }

      /* click on media area (video itself) */
      var media = target.closest('.tbf2-rt-videos__media');
      if (media) {
        e.stopImmediatePropagation();
        var slide = media.closest('[data-tbf2-rt-slide]');
        if (slide) toggleSlide(slide);
      }
    });

    box.addEventListener('ended', function (e) {
      if (e.target.tagName !== 'VIDEO') return;
      var slide = e.target.closest('[data-tbf2-rt-slide]');
      if (slide) setSlidePlaying(slide, false);
    }, true);
  }

  function applySectionVisibility(root) {
    var vis = (window.tbf2Pdp && window.tbf2Pdp.blockVisibility) || {};

    // Theme Editor eye → chunk node IDs
    var map = {
      real_talk: ['ead1a598-00ef-44c7-b0cf-ab9855ef250b'],
      why: ['8314ef9c-3feb-4ae1-a988-7cb4ed2bce9a', '0212d540-0df7-49cc-928b-a855946f712a'],
      purpose: ['952866f3-fdcf-4ca9-80d6-042c9ce6cf72', '80b66a30-4083-4345-8f1c-e886fca3e1e8'],
      /* The Proven section's own node, not its wrapper. In split-section mode the
         wrapper is replicated onto every below-fold section, so keying off it
         would hide FAQ / Related / Policies too. */
      proven: ['4fafbbce-8d45-4faa-a0ee-9ed04c0d9299'],
      faq: ['c4d8d496-8a33-44cc-8fd1-135a300ecf21'],
      how_to: ['414600c9-fc53-4fa0-ba1c-2328088ac1ab'],
      find_fit: ['a7484f4d-1de5-4e51-a022-3bdabffa4170'],
      related: ['35e76b14-5048-448d-99c1-6fa77b7b6a3d'],
      policies: ['3c6ba1ff-769b-4685-bfd5-36860860cf45']
    };

    // All mapped IDs — used so shell climb never hides a parent that also owns another section
    var allIds = [];
    Object.keys(map).forEach(function (k) {
      map[k].forEach(function (id) { allIds.push(id); });
    });

    function ownsOtherSection(parent, keepEl) {
      if (!parent) return false;
      for (var i = 0; i < allIds.length; i++) {
        var other = parent.querySelector('[data-tbf2-id="' + allIds[i] + '"]');
        if (!other) continue;
        if (other === keepEl) continue;
        if (keepEl.contains(other)) continue;
        if (other.contains(keepEl)) continue;
        return true;
      }
      if (parent.querySelector('[data-tbf2-ugc], [data-tbf2-trust], [data-tbf2-htw], [data-tbf2-gallery], [data-tbf2-product-container]')) {
        // shared ancestor with extras / buy box
        var extras = parent.querySelector('[data-tbf2-ugc], [data-tbf2-trust], [data-tbf2-htw], [data-tbf2-gallery], [data-tbf2-product-container]');
        if (extras && !keepEl.contains(extras)) return true;
      }
      return false;
    }

    function sectionShell(el) {
      if (!el) return null;
      var rootW = root.getBoundingClientRect().width || window.innerWidth || 1;
      var node = el;
      var best = el;
      while (node && node !== root) {
        var parent = node.parentElement;
        if (!parent || parent === root) break;
        if (ownsOtherSection(parent, el)) break;
        var pw = parent.getBoundingClientRect().width;
        if (pw >= rootW * 0.88) best = node;
        node = parent;
      }
      return best;
    }

    function setHidden(el, show) {
      if (!el) return;
      // Inline !important beats Replo :not(#\20) stylesheet specificity
      if (show) {
        el.removeAttribute('data-tbf2-section-hidden');
        el.style.removeProperty('display');
      } else {
        el.setAttribute('data-tbf2-section-hidden', 'true');
        el.style.setProperty('display', 'none', 'important');
      }
    }

    Object.keys(map).forEach(function (key) {
      if (vis[key] !== true && vis[key] !== false) return;
      var show = !!vis[key];
      map[key].forEach(function (id) {
        var el = root.querySelector('[data-tbf2-id="' + id + '"]');
        setHidden(el, show);
        if (!show) setHidden(sectionShell(el), false);
        else {
          var shell = sectionShell(el);
          if (shell && shell !== el) setHidden(shell, true);
        }
      });
      if (key === 'real_talk') {
        setHidden(root.querySelector('[data-tbf2-realtalk]'), show);
        setHidden(root.querySelector('[data-tbf2-rt-videos]'), show);
      }
      if (key === 'related') {
        qsa(root, '[id*="Rdkj2"]').forEach(function (carousel) {
          setHidden(carousel, show);
          if (!show) setHidden(sectionShell(carousel), false);
        });
        qsa(root, '.tbf2-carousel--related-scroll').forEach(function (el) {
          setHidden(el, show);
        });
      }
    });

    [['ugc_slider', '[data-tbf2-ugc]'], ['trust_bar', '[data-tbf2-trust]'], ['howto_wear', '[data-tbf2-htw]']].forEach(function (pair) {
      if (vis[pair[0]] !== true && vis[pair[0]] !== false) return;
      qsa(root, pair[1]).forEach(function (el) {
        setHidden(el, !!vis[pair[0]]);
      });
    });
  }

  function applyContentOverrides(root) {
    var o = (window.tbf2Pdp && window.tbf2Pdp.contentOverrides) || {};

    function filled(v) {
      if (v == null) return false;
      if (typeof v === 'string') return v.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().length > 0;
      return !!v;
    }

    function normalizeText(v) {
      return String(v == null ? '' : v)
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
    }

    function sameText(a, b) {
      return normalizeText(a) === normalizeText(b);
    }

    function setTextIn(scope, matcher, value) {
      if (!scope || !filled(value)) return false;
      var nodes = scope.querySelectorAll('p, h1, h2, h3, h4, span');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.closest('button, a[href], [data-tbf2-collapsible] [role="button"]') && !matcher.test('x')) {
          /* still allow matching headings inside buttons when intentional */
        }
        var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (t && matcher.test(t) && t.length < 160) {
          if (sameText(t, value)) return true;
          el.textContent = value;
          return true;
        }
      }
      return false;
    }

    function setFirstMatchingText(scope, matcher, value) {
      return setTextIn(scope, matcher, value);
    }

    function setRichIn(scope, value, minLen) {
      if (!scope || !filled(value)) return false;
      minLen = minLen == null ? 40 : minLen;
      // Prefer the exact Replo RTE text host — never rebuild wrappers
      var candidates = scope.querySelectorAll('.tbf2-rte > span, .tbf2-rte span');
      if (!candidates.length) candidates = scope.querySelectorAll('.tbf2-rte, p');
      for (var i = 0; i < candidates.length; i++) {
        var el = candidates[i];
        var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (t.length > minLen) {
          if (sameText(el.innerHTML, value) || sameText(t, value)) return true;
          el.innerHTML = value;
          return true;
        }
      }
      return false;
    }

    function setCollapsibleBody(item, html) {
      if (!item || !filled(html)) return false;
      var panel = item.querySelector('.tbf2-animated, .replo-animated');
      if (!panel) return false;
      // Content-only: update existing Replo RTE host. No style / markup rebuild.
      var span =
        panel.querySelector('.tbf2-rte > span') ||
        panel.querySelector('.tbf2-rte span') ||
        panel.querySelector('[class*="-rte"] > span') ||
        panel.querySelector('[class*="-rte"] span');
      if (!span) return false;
      if (sameText(span.innerHTML, html) || sameText(span.textContent, html)) return true;
      span.innerHTML = html;
      return true;
    }

    function setCollapsibleTitle(item, title) {
      if (!item || !filled(title)) return false;
      var btn = item.querySelector('[role="button"]');
      if (!btn) return false;
      var target = btn.querySelector('.tbf2-rte > span p, .tbf2-rte p, p, .tbf2-rte span, span, .tbf2-rte') || btn;
      if (target.querySelector && target.querySelector('p')) target = target.querySelector('p');
      if (sameText(target.textContent, title)) return true;
      target.textContent = title;
      return true;
    }

    function setImageIn(scope, url, preferredSelector) {
      if (!scope || !filled(url)) return false;
      var img = preferredSelector ? scope.querySelector(preferredSelector) : null;
      if (!img) img = scope.querySelector('picture img, img');
      if (!img) return false;
      img.src = url;
      img.removeAttribute('srcset');
      var picture = img.closest('picture');
      if (picture) {
        qsa(picture, 'source').forEach(function (s) {
          s.setAttribute('srcSet', url);
          s.setAttribute('srcset', url);
        });
      }
      return true;
    }

    function setLink(scope, href, label) {
      if (!scope) return;
      var a = scope.querySelector('a[href]');
      if (!a) return;
      if (filled(href)) a.setAttribute('href', href);
      if (filled(label)) {
        var labelEl =
          a.querySelector('p, span, .tbf2-rte') ||
          a;
        if (labelEl === a) a.textContent = label;
        else labelEl.textContent = label;
      }
    }

    // Direct-by-id setters for content that isn't unique enough to find by
    // regex/text matching (short repeated labels like point titles).
    function setTextById(id, value) {
      if (!filled(value)) return;
      var el = root.querySelector('[data-tbf2-id="' + id + '"]');
      if (!el) return;
      // Target the RTE span itself (not the first <p>) so titles that render
      // as 2 stacked <p> lines (e.g. "Personalized" / "Fit Help") get fully
      // replaced by one plain-text value instead of leaving a stale 2nd line.
      var target = el.querySelector('.tbf2-rte > span') || el.querySelector('.tbf2-rte') || el;
      if (sameText(target.textContent, value)) return;
      target.textContent = value;
    }

    function setRichById(id, value) {
      if (!filled(value)) return;
      var el = root.querySelector('[data-tbf2-id="' + id + '"]');
      if (!el) return;
      setRichIn(el, value, 0);
    }

    // Replo Why title is 3 stacked lines (Why / Teardrop… / Breast Form?).
    // Each block field maps 1:1 to a line — no merge, no hide.
    function setWhyTitleStack(whyScope, line1, line2, line3) {
      if (!whyScope) return;
      var stack = whyScope.querySelector('[data-tbf2-id="321fead7-6a39-4c40-996e-6c1998506385"]');
      var lines = stack
        ? qsa(stack, '.tbf2-rte')
        : [];
      if (!lines.length) {
        // Fallback by known line ids
        var byId = [
          whyScope.querySelector('[data-tbf2-id="b67c15d2-1fad-497f-81a7-3c0fe95bfb0b"]'),
          whyScope.querySelector('[data-tbf2-id="92362d8a-074b-4f45-8a8a-3a62bda9adf7"]'),
          whyScope.querySelector('[data-tbf2-id="91f7fb1b-4793-4d83-8a1f-a00c9902b172"]')
        ].filter(Boolean);
        lines = byId;
      }
      if (!lines.length) return;

      function setLine(el, value) {
        if (!el || !filled(value)) return;
        var host = el.querySelector('span') || el;
        if (sameText(host.textContent, value)) return;
        host.textContent = value;
      }

      setLine(lines[0], line1);
      setLine(lines[1], line2);
      setLine(lines[2], line3);
    }

    function setPurposeTitleStack(values) {
      var pairs = [
        ['49aecc72-743f-4bee-a382-e580bedd9f1a', values.line1],
        ['028c05c4-3484-47c9-bdd8-f2e725f6531c', values.line2],
        ['20924fdd-2fa7-48d3-b6d8-6b883edc85dd', values.line3],
        ['d14ef494-3ab9-4837-a16c-88a1afdf2f01', values.line4]
      ];
      pairs.forEach(function (pair) {
        setTextById(pair[0], pair[1]);
      });
    }

    // —— Why (text from blocks; image stays on metafield why_inserts_images) ——
    if (o.why) {
      var why =
        root.querySelector('[data-tbf2-id="0212d540-0df7-49cc-928b-a855946f712a"]') ||
        root.querySelector('[data-tbf2-id="8314ef9c-3feb-4ae1-a988-7cb4ed2bce9a"]');
      if (why) {
        if (filled(o.why.eyebrow) || filled(o.why.heading) || filled(o.why.headingLine3)) {
          setWhyTitleStack(why, o.why.eyebrow, o.why.heading, o.why.headingLine3);
        }
        if (filled(o.why.body)) setRichIn(why, o.why.body, 30);
      }
      setTextById('407a326e-6b05-4369-8780-8529ea749fd0', o.why.point1Title);
      setRichById('c0605644-2b90-40df-a3db-5ffa475ff7f9', o.why.point1Body);
      setTextById('483ff71d-19f3-4bd7-bb5b-4c3daa1ba472', o.why.point2Title);
      setRichById('e866c15e-bbaf-479a-8b5c-8987059f5ce6', o.why.point2Body);
      setTextById('9ecf37be-8332-4f8d-b68b-695f148344e0', o.why.point3Title);
      setRichById('81da1763-74f7-480c-97dc-9af440e5181f', o.why.point3Body);
      setTextById('f897fccd-943b-4194-afe1-31ca9ffb1975', o.why.point4Title);
      setRichById('49f27dd6-aa92-4be6-9df1-51706a06a313', o.why.point4Body);
      setTextById('ab5ec034-f88b-47f0-bfff-163ab96959a1', o.why.ctaLabel);
    }

    // —— Purpose (text from blocks; image stays on metafield benefit_section_image) ——
    if (o.purpose) {
      var purpose =
        root.querySelector('[data-tbf2-id="80b66a30-4083-4345-8f1c-e886fca3e1e8"]') ||
        root.querySelector('[data-tbf2-id="952866f3-fdcf-4ca9-80d6-042c9ce6cf72"]');
      if (purpose) {
        setPurposeTitleStack({
          line1: o.purpose.headingLine1,
          line2: o.purpose.headingLine2,
          line3: o.purpose.headingLine3,
          line4: o.purpose.headingLine4
        });
        // Legacy single heading field (older templates) → line 1 only
        if (
          !filled(o.purpose.headingLine1) &&
          !filled(o.purpose.headingLine2) &&
          filled(o.purpose.heading)
        ) {
          setFirstMatchingText(purpose, /Purpose|Raising|Our/i, o.purpose.heading);
        }
        if (filled(o.purpose.body)) setRichIn(purpose, o.purpose.body, 30);
      }
      setTextById('02143302-2e65-4e8a-a781-f91730245165', o.purpose.point1Title);
      setRichById('e283c9cc-7c45-4049-ba85-000fecc17ca9', o.purpose.point1Body);
      setTextById('a0c561fc-7d9d-4b7e-b1df-375177595ab3', o.purpose.point2Title);
      setRichById('6d9adcc7-6e4e-485b-87c5-db548c3d5098', o.purpose.point2Body);
      setTextById('4587da6a-36f3-48e7-9fd4-ed9ffc163e0a', o.purpose.point3Title);
      setRichById('b35ea707-f6c9-4858-81b6-c01dc3d77a4c', o.purpose.point3Body);
      setTextById('000b67ff-8162-4fe4-931e-c1c06f14f30e', o.purpose.point4Title);
      setRichById('1056f2f3-a979-45d3-b527-ac7d26339182', o.purpose.point4Body);
    }

    // —— Proven ——
    if (o.proven) {
      /* Proven's own node first — the wrapper id now repeats on every below-fold
         section, so it would resolve to whichever one the client dragged up top. */
      var proven =
        root.querySelector('[data-tbf2-id="4fafbbce-8d45-4faa-a0ee-9ed04c0d9299"]') ||
        root.querySelector('[data-tbf2-id="be324424-0739-445d-bf83-96dc92edb077"]');
      if (proven) {
        if (filled(o.proven.eyebrow)) {
          setFirstMatchingText(proven, /Trusted|Loved by|67,?000/i, o.proven.eyebrow);
        }
        // 4 stacked heading lines: Proven to / Perform. / Loved by / Thousands.
        setTextById('9b897251-e717-41a2-9a37-635b299f0193', o.proven.headingLine1);
        setTextById('78235add-8efa-4940-ae41-b4b048548d1c', o.proven.headingLine2);
        setTextById('a90672ef-c426-4f02-8b4c-74f0d69f398c', o.proven.headingLine3);
        setTextById('a70b84fe-f152-44f4-8677-b4553fee6828', o.proven.headingLine4);
        if (
          !filled(o.proven.headingLine1) &&
          !filled(o.proven.headingLine2) &&
          filled(o.proven.heading)
        ) {
          setFirstMatchingText(proven, /Proven to|Loved by|Perform/i, o.proven.heading);
        }
        if (filled(o.proven.body)) setRichIn(proven, o.proven.body, 20);
        // No image override here on purpose: the first image in this scope is the
        // carousel's prev/next arrow icon, not a content photo — setting it would
        // replace the arrow with the uploaded photo and break the carousel.
      }
    }

    // —— How to / Product description accordion ——
    if (o.how_to) {
      var howRoot = root.querySelector('[data-tbf2-id="414600c9-fc53-4fa0-ba1c-2328088ac1ab"]');
      if (howRoot) {
        var descItem = howRoot.querySelector('[data-tbf2-id="0984b613-7d02-4c51-b5ca-9731051b28f4"]');
        var howItem = howRoot.querySelector('[data-tbf2-id="1adfe84c-2d9d-4587-a977-1ac6167d27eb"]');
        var fabricItem = howRoot.querySelector('[data-tbf2-id="8fff3e8c-cc9c-406a-8803-888c92c6b34f"]');

        if (descItem) {
          if (filled(o.how_to.descriptionTitle)) setCollapsibleTitle(descItem, o.how_to.descriptionTitle);
          if (filled(o.how_to.descriptionBody)) setCollapsibleBody(descItem, o.how_to.descriptionBody);
        }

        if (howItem) {
          if (filled(o.how_to.howTitle)) setCollapsibleTitle(howItem, o.how_to.howTitle);
          // How to Use step text/images stay on product metafields (how_to_wear_step_*)
        }

        if (fabricItem) {
          if (filled(o.how_to.fabricTitle)) setCollapsibleTitle(fabricItem, o.how_to.fabricTitle);
          if (filled(o.how_to.fabricBody)) setCollapsibleBody(fabricItem, o.how_to.fabricBody);
        }
      }
    }

    // —— Find Your Fit ——
    if (o.find_fit) {
      var fit = root.querySelector('[data-tbf2-id="a7484f4d-1de5-4e51-a022-3bdabffa4170"]');
      if (fit) {
        // 5 stacked heading lines: Find Your / Dream / Inserts / in / 30 Seconds
        setTextById('7ae7bb8e-812b-4fd5-9dab-e15a7f8d27f0', o.find_fit.headingLine1);
        setTextById('91640037-73fe-494b-accc-7ac8f64d4519', o.find_fit.headingLine2);
        setTextById('550e57ee-b401-482a-a25a-a321bbcb2426', o.find_fit.headingLine3);
        setTextById('be58bbe3-56e6-4338-be41-57d1df7b43e7', o.find_fit.headingLine4);
        setTextById('716a0510-7764-418a-b57a-a06c0c4ea31f', o.find_fit.headingLine5);
        if (
          !filled(o.find_fit.headingLine1) &&
          !filled(o.find_fit.headingLine2) &&
          filled(o.find_fit.heading)
        ) {
          setFirstMatchingText(fit, /Find Your|Dream|30 Seconds|Inserts/i, o.find_fit.heading);
        }
        if (filled(o.find_fit.body)) setRichIn(fit, o.find_fit.body, 20);
        // This scope also has a small decorative placeholder icon before the real
        // circular badge photo — target the badge by id, not "first img in scope".
        if (filled(o.find_fit.image)) {
          setImageIn(fit, o.find_fit.image, '[data-tbf2-id="69e89709-ee3b-4de7-81e3-6780f08cb1e5"] img');
        }
        setLink(fit, o.find_fit.buttonLink, o.find_fit.buttonLabel);
      }
    }

    // —— You May Also Like ——
    if (o.related) {
      var relatedHead = root.querySelector('[data-tbf2-id="35e76b14-5048-448d-99c1-6fa77b7b6a3d"]');
      if (relatedHead) {
        if (filled(o.related.headingImage)) setImageIn(relatedHead, o.related.headingImage);
        if (filled(o.related.heading)) {
          /* The headline is its own element now that it is text rather than a
             flat "You may also like" PNG. Target it directly and keep the regex
             as the fallback for a merchant who still uses a heading image. */
          var relatedHeading = relatedHead.querySelector('.tbf2-related-heading h2');
          // innerHTML, not textContent: the setting carries <strong> to mark
          // which words render in Poppins against the script face
          if (relatedHeading) relatedHeading.innerHTML = o.related.heading;
          else setFirstMatchingText(relatedHead, /You May|Also Like/i, o.related.heading);
        }
        if (filled(o.related.body)) setRichIn(relatedHead, o.related.body, 10);
      }

      // First static card → Theme Editor overrides (design unchanged)
      var firstCards = root.querySelectorAll('[data-tbf2-id="aafca7ad-d1fa-442a-9af4-e70924544e86"]');
      if (firstCards.length) {
        function setCardText(card, id, value) {
          if (!filled(value) || !card) return;
          var el = card.querySelector('[data-tbf2-id="' + id + '"]');
          if (!el) return;
          var target = el.querySelector('.tbf2-rte > span') || el.querySelector('.tbf2-rte') || el;
          if (sameText(target.textContent, value)) return;
          target.textContent = value;
        }

        firstCards.forEach(function (card) {
          if (filled(o.related.card1Image)) {
            setImageIn(
              card,
              o.related.card1Image,
              '[data-tbf2-id="7b022511-e3e5-4773-877b-1aa54504a98b"] img, img.tbf2-r-aeznox, picture img, img'
            );
          }
          setCardText(card, 'd0a59da1-9274-4a0a-8536-ed144bf4e467', o.related.card1Title);
          setCardText(card, '106e76c2-f258-4130-a195-3b34b6c43bca', o.related.card1Line1);
          setCardText(card, '16035510-5231-46aa-9ee1-610815400ea1', o.related.card1Line2);
          setCardText(card, 'd9ee8063-45e6-4704-bc2c-748474c7cc6e', o.related.card1Line3);

          if (filled(o.related.card1ButtonLabel)) {
            setCardText(card, '7f14fd43-56a9-4209-ad56-be069f71d79e', o.related.card1ButtonLabel);
            card.setAttribute('data-tbf2-related-override-label', o.related.card1ButtonLabel);
          }

          if (filled(o.related.card1ButtonLink)) {
            var url = o.related.card1ButtonLink;
            card.setAttribute('data-tbf2-related-override-url', url);
            // Prefer explicit SHOP NOW CTA; fall back to any card link
            var cta =
              card.querySelector('[data-tbf2-id="4e4ed007-ddbb-4bd7-9496-c8ed0b5b3498"]') ||
              card.querySelector('a.text, a[role="button"], a[href]');
            if (cta) {
              if (cta.tagName === 'A') cta.setAttribute('href', url);
              cta.setAttribute('data-tbf2-related-cta', '1');
              cta.classList.add('tbf2-related-card__btn');
            }
          }
        });
      }
    }

    // —— Policies / Trust ——
    // Real layout: a small "Hassle-Free" banner sits outside the 3-card
    // section, and the card section has 3 cards (not 2) — target every
    // piece by its own id instead of guessing positions/regex matches.
    if (o.policies) {
      function setTwoLineTitleById(id, line1, line2, legacy) {
        if (!filled(line1) && !filled(line2) && !filled(legacy)) return;
        var el = root.querySelector('[data-tbf2-id="' + id + '"]');
        if (!el) return;
        var span =
          el.querySelector('.tbf2-rte > span') ||
          el.querySelector('.tbf2-rte span') ||
          el.querySelector('span') ||
          el;
        if (filled(line1) || filled(line2)) {
          var html = '';
          if (filled(line1)) html += '<p>' + String(line1).replace(/</g, '&lt;') + '</p>';
          if (filled(line2)) html += '<p>' + String(line2).replace(/</g, '&lt;') + '</p>';
          if (html && !sameText(span.innerHTML, html)) span.innerHTML = html;
          return;
        }
        if (filled(legacy)) {
          if (sameText(span.textContent, legacy)) return;
          span.textContent = legacy;
        }
      }

      // 4 stacked heading lines: Try / with Ease, / Keep / Peace of Mind
      setTextById('b018b127-7450-4280-9b92-7acd3486c115', o.policies.headingLine1);
      setTextById('c1542037-b7bb-4d71-b91e-fe4d7d028380', o.policies.headingLine2);
      setTextById('66c443cb-4a41-497d-9d7a-dc25719b52de', o.policies.headingLine3);
      setTextById('92b4e2cb-75a1-446f-b730-585c4b4fbeb1', o.policies.headingLine4);
      if (
        !filled(o.policies.headingLine1) &&
        !filled(o.policies.headingLine2) &&
        filled(o.policies.heading)
      ) {
        var policiesWrap = root.querySelector('[data-tbf2-id="3c6ba1ff-769b-4685-bfd5-36860860cf45"]');
        if (policiesWrap) setFirstMatchingText(policiesWrap, /Try|Peace of Mind/i, o.policies.heading);
      }

      setTextById('f2354445-bd81-45c1-b3b0-56c2a1440f1c', o.policies.hassleLabel);

      setTwoLineTitleById(
        'b234d177-cf66-4863-8434-4a5eee7255b3',
        o.policies.card1TitleLine1,
        o.policies.card1TitleLine2,
        o.policies.card1Title
      );
      setRichById('091516e9-c6bc-4dac-8e24-425cc21466f4', o.policies.card1Body);
      if (filled(o.policies.card1Image)) {
        setImageIn(root, o.policies.card1Image, '[data-tbf2-id="b1a1953b-8852-42c4-ace8-25aaf66c10b2"] img');
      }

      setTextById('a754b051-8702-4fc6-bde9-b2ee66c1d1b8', o.policies.card2Title);
      setRichById('8228db77-345e-4b4e-8b3c-15c3648a721c', o.policies.card2Body);
      if (filled(o.policies.card2Image)) {
        setImageIn(root, o.policies.card2Image, '[data-tbf2-id="2cc1b51e-e342-4069-9cf5-f2574d6fa14e"] img');
      }

      setTwoLineTitleById(
        '2d2d76c1-7130-459a-a549-467caf643c63',
        o.policies.card3TitleLine1,
        o.policies.card3TitleLine2,
        o.policies.card3Title
      );
      setRichById('7b397a12-50ee-4d00-9412-c528c4dd247c', o.policies.card3Body);
      if (filled(o.policies.card3Image)) {
        setImageIn(root, o.policies.card3Image, '[data-tbf2-id="a426e8b2-3895-47be-97ff-747d8607456a"] img');
      }
    }

    // —— FAQ heading + items ——
    var faqRoot = root.querySelector('[data-tbf2-id="c4d8d496-8a33-44cc-8fd1-135a300ecf21"]');
    if (faqRoot) {
      if (filled(o.faqHeading)) setFirstMatchingText(faqRoot, /^Frequently$/i, o.faqHeading);
      if (filled(o.faqHeadingSecondary)) {
        setFirstMatchingText(faqRoot, /Asked Questions/i, o.faqHeadingSecondary);
      }
      if (o.faqItems && o.faqItems.length) {
        var items = qsa(faqRoot, '[data-tbf2-collapsible]');
        o.faqItems.forEach(function (faq, idx) {
          var item = items[idx];
          if (!item || !faq) return;
          // Eye-closed FAQ block → hide that row only (index-aligned with block order)
          if (faq.enabled === false) {
            item.setAttribute('data-tbf2-section-hidden', 'true');
            return;
          }
          if (filled(faq.question) || filled(faq.answer)) {
            item.setAttribute('data-tbf2-section-hidden', 'false');
          }
          if (filled(faq.question)) setCollapsibleTitle(item, faq.question);
          if (filled(faq.answer)) setCollapsibleBody(item, faq.answer);
        });
      }
    }

    // —— Proven quotes (carousel slides by block order) ——
    if (o.provenQuotes && o.provenQuotes.length) {
      var provenRoot =
        root.querySelector('[data-tbf2-id="4fafbbce-8d45-4faa-a0ee-9ed04c0d9299"]') ||
        root.querySelector('[data-tbf2-id="be324424-0739-445d-bf83-96dc92edb077"]') ||
        root.querySelector('[data-tbf2-proven]');
      if (provenRoot) {
        var pSlides = qsa(provenRoot, '[data-tbf2-part="slide"]').filter(function (s) {
          return s.getAttribute('data-is-cloned') !== 'true';
        });
        if (!pSlides.length) pSlides = qsa(provenRoot, '[data-tbf2-part="slide"]');
        o.provenQuotes.forEach(function (pq, idx) {
          var slide = pSlides[idx];
          if (!slide || !pq) return;
          if (pq.enabled === false) {
            slide.style.setProperty('display', 'none', 'important');
            return;
          }
          slide.style.removeProperty('display');
          var paras = qsa(slide, 'p, .tbf2-rte span').filter(function (el) {
            return (el.textContent || '').replace(/\s+/g, ' ').trim().length > 0;
          });
          if (filled(pq.quote) && paras.length) {
            var quoteEl = paras.sort(function (a, b) {
              return (b.textContent || '').length - (a.textContent || '').length;
            })[0];
            if (quoteEl) quoteEl.innerHTML = pq.quote;
          }
          if (filled(pq.author)) {
            setFirstMatchingText(slide, /^[A-Z][a-z]+ [A-Z]$/, pq.author) ||
              setFirstMatchingText(slide, /^[A-Z][a-z]+ [A-Z][a-z]?$/, pq.author);
          }
          if (filled(pq.role)) {
            var roleCandidates = paras.filter(function (el) {
              var t = (el.textContent || '').trim();
              return t.length > 8 && t.length < 80 && !/[.!?]$/.test(t);
            });
            if (roleCandidates[0] && roleCandidates[0].textContent !== pq.author) {
              roleCandidates[0].textContent = pq.role;
            }
          }
        });
      }
    }

    // Real Talk slides come from Liquid (tbf2-realtalk-videos) — no index patching.
    // Add/delete/reorder blocks re-render the carousel on section:load.
  }

  function hideChunkWhenBlocks(root) {
    if (!(window.tbf2Pdp && window.tbf2Pdp.useBlocks)) return;
    var blocks = root.querySelector('[data-tbf2-blocks]');
    var start =
      root.querySelector('[data-tbf2-realtalk]') ||
      root.querySelector('[data-tbf2-id="ead1a598-00ef-44c7-b0cf-ab9855ef250b"]') ||
      root.querySelector('[data-tbf2-id="8314ef9c-3feb-4ae1-a988-7cb4ed2bce9a"]');
    if (!start) return;

    // Hide start + following siblings until editable blocks container
    var node = start;
    while (node) {
      if (node === blocks) break;
      if (node.getAttribute && node.getAttribute('data-tbf2-blocks') != null) break;
      node.setAttribute('data-tbf2-section-hidden', 'true');
      node.style.setProperty('display', 'none', 'important');
      node = node.nextElementSibling;
    }

    // Also hide any leftover large chunk wrappers that still contain known headings
    // but sit outside the sibling walk (nested trees)
    qsa(root, '[data-tbf2-id]').forEach(function (el) {
      if (el.closest('[data-tbf2-blocks]')) return;
      if (el.closest('[data-tbf2-gallery]')) return;
      if (el.closest('[data-tbf2-product-container]')) return;
      var id = el.getAttribute('data-tbf2-id');
      var hideIds = {
        'ead1a598-00ef-44c7-b0cf-ab9855ef250b': 1,
        '8314ef9c-3feb-4ae1-a988-7cb4ed2bce9a': 1,
        '952866f3-fdcf-4ca9-80d6-042c9ce6cf72': 1,
        'be324424-0739-445d-bf83-96dc92edb077': 1,
        'c4d8d496-8a33-44cc-8fd1-135a300ecf21': 1
      };
      if (hideIds[id]) {
        el.setAttribute('data-tbf2-section-hidden', 'true');
        el.style.setProperty('display', 'none', 'important');
      }
    });
  }

  function placeExtraBlocks(root) {
    var wrap = root.querySelector('[data-tbf2-extra-blocks]');
    if (!wrap) return;
    var ugc = wrap.querySelector('[data-tbf2-ugc]');
    var trust = wrap.querySelector('[data-tbf2-trust]');
    var htw = wrap.querySelector('[data-tbf2-htw]');
    var realtalk = root.querySelector('[data-tbf2-realtalk], [data-tbf2-id="ead1a598-00ef-44c7-b0cf-ab9855ef250b"]');
    var why = root.querySelector('[data-tbf2-id="8314ef9c-3feb-4ae1-a988-7cb4ed2bce9a"]');

    // Climb to a FULL-WIDTH section node (not buy-box / nested column)
    function fullWidthSection(el) {
      if (!el) return null;
      var rootW = root.getBoundingClientRect().width || window.innerWidth;
      var node = el;
      var best = el;
      while (node && node !== root) {
        var parent = node.parentElement;
        if (!parent || parent === root) break;
        var pw = parent.getBoundingClientRect().width;
        if (pw >= rootW * 0.88) best = node;
        node = parent;
      }
      return best;
    }

    function insertBeforeNode(nodes, anchor) {
      if (!anchor || !anchor.parentNode) return;
      var parent = anchor.parentNode;
      nodes.forEach(function (n) {
        if (n) parent.insertBefore(n, anchor);
      });
    }

    var rtSection = fullWidthSection(realtalk);
    var whySection = fullWidthSection(why);
    var howtoSection = fullWidthSection(
      root.querySelector('[data-tbf2-id="414600c9-fc53-4fa0-ba1c-2328088ac1ab"]')
    );
    // Prefer Real Talk slot; fall back so Trust/UGC still appear if RT node is missing
    var stackAnchor = rtSection || howtoSection || whySection;

    // ef23e988 stack: Trust (3 cards) → UGC (Real Talk) → … → How to Wear → Why
    if (stackAnchor) insertBeforeNode([trust, ugc], stackAnchor);
    else {
      if (trust) root.appendChild(trust);
      if (ugc) root.appendChild(ugc);
    }

    if (whySection && htw) insertBeforeNode([htw], whySection);
    else if (htw && stackAnchor && stackAnchor.parentNode) {
      if (stackAnchor.nextSibling) stackAnchor.parentNode.insertBefore(htw, stackAnchor.nextSibling);
      else stackAnchor.parentNode.appendChild(htw);
    }

    [ugc, trust, htw].forEach(function (el) {
      if (!el) return;
      if (el.getAttribute('data-tbf2-section-hidden') === 'true') return;
      el.style.setProperty('width', '100%', 'important');
      el.style.setProperty('max-width', '100%', 'important');
      el.style.setProperty('flex-basis', '100%', 'important');
      el.style.setProperty('align-self', 'stretch', 'important');
      el.style.setProperty('clear', 'both', 'important');
      el.style.setProperty('position', 'relative', 'important');
      el.style.removeProperty('display');
    });

    if (wrap.parentNode && !wrap.children.length) wrap.parentNode.removeChild(wrap);
  }

  function initUgcSlider(root) {
    qsa(root, '[data-tbf2-ugc]').forEach(function (box) {
      if (box.getAttribute('data-tbf2-ready') === '1') return;
      box.setAttribute('data-tbf2-ready', '1');
      var track = box.querySelector('[data-tbf2-ugc-track]');
      if (!track) return;
      var prev = box.querySelector('[data-tbf2-ugc-prev]');
      var next = box.querySelector('[data-tbf2-ugc-next]');
      function step(dir) {
        var slide = track.querySelector('[data-tbf2-ugc-slide]');
        var amount = slide ? slide.getBoundingClientRect().width + 14 : 280;
        track.scrollBy({ left: dir * amount, behavior: 'smooth' });
      }
      if (prev) prev.addEventListener('click', function () { step(-1); });
      if (next) next.addEventListener('click', function () { step(1); });
      qsa(box, '[data-tbf2-ugc-play]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var slide = btn.closest('[data-tbf2-ugc-slide]');
          var video = slide && slide.querySelector('video');
          if (!video) return;
          if (video.paused) {
            qsa(root, '[data-tbf2-ugc] video').forEach(function (v) {
              if (v !== video) v.pause();
            });
            video.play().catch(function () {});
            btn.style.opacity = '0';
          } else {
            video.pause();
            btn.style.opacity = '1';
          }
        });
      });
    });
  }

  function paintBlackBtn(el, hovering) {
    if (!el) return;
    if (hovering) {
      el.style.setProperty('background-color', 'transparent', 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('color', '#000', 'important');
      el.style.setProperty('border', '1px solid #000', 'important');
      el.style.setProperty('border-color', '#000', 'important');
      el.style.setProperty('box-shadow', 'none', 'important');
      el.style.setProperty('transform', 'none', 'important');
      qsa(el, 'p, span, .tbf2-rte, .tbf2-r-e5lq2t, .tbf2-r-laew6o, .tbf2-r-3rugwe').forEach(function (node) {
        node.style.setProperty('color', '#000', 'important');
      });
    } else {
      el.style.setProperty('background-color', '#000', 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('color', '#fff', 'important');
      el.style.setProperty('border', '1px solid #000', 'important');
      el.style.setProperty('border-color', '#000', 'important');
      el.style.setProperty('box-shadow', 'none', 'important');
      qsa(el, 'p, span, .tbf2-rte, .tbf2-r-e5lq2t, .tbf2-r-laew6o, .tbf2-r-3rugwe').forEach(function (node) {
        node.style.setProperty('color', '#fff', 'important');
      });
    }
  }

  function wireBlackBtnHover(el) {
    if (!el || el.getAttribute('data-tbf2-black-hover') === '1') return;
    el.setAttribute('data-tbf2-black-hover', '1');
    el.setAttribute('data-tbf2-black-btn', '1');
    paintBlackBtn(el, false);
    el.addEventListener('mouseenter', function () {
      paintBlackBtn(el, true);
    });
    el.addEventListener('mouseleave', function () {
      paintBlackBtn(el, false);
    });
    el.addEventListener('focus', function () {
      paintBlackBtn(el, true);
    });
    el.addEventListener('blur', function () {
      paintBlackBtn(el, false);
    });
  }

  function isNearBlackBg(el) {
    try {
      var bg = window.getComputedStyle(el).backgroundColor || '';
      var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (!m) return false;
      return +m[1] < 40 && +m[2] < 40 && +m[3] < 40;
    } catch (err) {
      return false;
    }
  }

  function initBlackButtonHovers(root) {
    /* Replo Fit Your Cloudz style: black → transparent + black text.
       Covers Find Your Fit, Why CTA, Proven CTA, and other solid-black page CTAs. */
    qsa(
      root,
      [
        'a.tbf2-r-1wqn76k',
        '[data-tbf2-id="35cb5ef0-e70c-4161-ba4f-5b38a6f19408"]',
        'button.tbf2-r-138u1bb',
        'button.tbf2-r-6o91jw',
        'button.tbf2-r-wnqf1s',
        '[data-tbf2-id="23cf67c7-7abf-439f-bf3c-91eeff5605e2"]',
        '[data-tbf2-id="f03230c6-61bc-42ac-9c45-26de6a8de6dd"]',
        '[data-tbf2-id="e9318fe3-ad59-4dc4-bbd4-fffa60064ecd"]'
      ].join(', ')
    ).forEach(wireBlackBtnHover);

    /* Also catch any other solid-black page CTAs (skip related outline pills / pink shop) */
    qsa(root, '[role="button"], [role="link"], a, button').forEach(function (el) {
      if (el.closest('[data-tbf2-collapsible]')) return;
      if (el.closest('[data-tbf2-option-select]')) return;
      if (el.closest('[data-tbf2-id="35e76b14-5048-448d-99c1-6fa77b7b6a3d"]')) return;
      if (el.closest('[id*="Rdkj2"]')) return;
      if (el.closest('.tbf2-carousel--related-scroll')) return;
      if (el.closest('.tbf2-related-card')) return;
      if (el.closest('[data-tbf2-related-cta]')) return;
      if (el.closest('[data-tbf2-related-outline]')) return;
      if (el.classList.contains('tbf2-related-card__btn')) return;
      if (el.classList.contains('tbf2-r-jl9fpb')) return; /* pink bottom shop */
      if (el.classList.contains('tbf2-rt-videos__nav')) return;
      if (el.classList.contains('tbf2-gallery__nav')) return;
      if (el.hasAttribute('data-direction')) return;
      if (el.getAttribute('data-tbf2-black-hover') === '1') return;
      var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!t || t.length > 80) return;
      if (!/find your fit|feel the difference|join the cloud|shop now|shop teardrop/i.test(t)) return;
      if (!isNearBlackBg(el)) return;
      wireBlackBtnHover(el);
    });
  }

  function boot() {
    /* Split-section mode wins: pdp-buybox still renders its own #tbf2-fullpage
       wrapper, so getElementById() would scope every step to the buy box alone
       and leave Proven / Related / FAQ / Policies with zero JS (dead arrows,
       dead hovers, dead Shop Now clicks). */
    var root = splitRoot() || document.getElementById(ROOT);
    if (!root) return;
    root.classList.add('tbf2-fullpage--ready');

    /* Run each step in isolation. These used to be plain calls, which meant one
       throw took out everything after it — a single failure upstream silently
       killed the Real Talk and Proven carousel arrows. */
    function step(name, fn) {
      try {
        fn(root);
      } catch (e) {
        if (window.console && console.warn) console.warn('[tbf2-pdp] ' + name + ' failed:', e);
      }
    }

    step('placeExtraBlocks', placeExtraBlocks);
    step('mountCustomGallery', mountCustomGallery);
    step('hideChunkWhenBlocks', hideChunkWhenBlocks);
    step('applySectionVisibility', applySectionVisibility);
    step('applyContentOverrides', applyContentOverrides);
    step('initUgcSlider', initUgcSlider);
    step('initRealTalk', initRealTalk);
    step('initCollapsibles', initCollapsibles);
    step('initSizePopup', initSizePopup);
    step('initCarousels', initCarousels);
    step('initRelatedStaticCard', initRelatedStaticCard);
    // Related first so product-page links win over page Shop Now scroll
    step('initRelatedProductLinks', initRelatedProductLinks);
    step('initShopNow', initShopNow);
    step('initBlackButtonHovers', initBlackButtonHovers);
    /* Re-apply after black-btn JS so first card never keeps solid fill */
    step('initRelatedStaticCard', initRelatedStaticCard);
    step('initBottomShopTitle', initBottomShopTitle);
    step('initShopBarSticky', initShopBarSticky);
    step('initVariants', initVariants);
    step('initAtc', initAtc);
  }

  /* Standalone PDP Shop Bar section: pin the bar to the bottom of the viewport
     while its resting place is still below the fold, then let it land there.
     The wrapper keeps the bar's height reserved so nothing jumps on release. */
  function initShopBarSticky(root) {
    var wrap = document.querySelector('[data-pdp-sec="shop-bar"]');
    if (!wrap || wrap.getAttribute('data-tbf2-sticky-ready') === '1') return;
    var bar = wrap.querySelector('[data-tbf2-shop-bar]');
    if (!bar) return;
    wrap.setAttribute('data-tbf2-sticky-ready', '1');

    function sync() {
      var h = bar.offsetHeight || 0;
      if (h) wrap.style.minHeight = h + 'px';
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      var top = wrap.getBoundingClientRect().top;
      /* Stuck while the wrapper's bottom edge has not reached the fold yet. */
      wrap.classList.toggle('is-stuck', top + h > vh + 1);
    }

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    if (typeof ResizeObserver !== 'undefined') {
      try { new ResizeObserver(sync).observe(bar); } catch (e) {}
    }
    /* Fonts / lazy images change the bar height after first paint */
    setTimeout(sync, 50);
    setTimeout(sync, 400);
    setTimeout(sync, 1200);
  }

  function initBottomShopTitle(root) {
    var name =
      (window.tbf2Pdp && window.tbf2Pdp.productTitle) ||
      (document.querySelector('meta[property="og:title"]') &&
        document.querySelector('meta[property="og:title"]').getAttribute('content')) ||
      '';
    name = String(name || '').replace(/\s+/g, ' ').trim();
    if (!name) return;

    /* Desktop bottom bar (.tbf2-r-rjxcfy). The standalone PDP Shop Bar section
       renders a second one, so fill every empty bar, not just the first. */
    qsa(root, '.tbf2-r-rjxcfy .tbf2-r-x8jll4 p, .tbf2-r-rjxcfy .tbf2-r-x8jll4 span').forEach(function (el) {
      if (!(el.textContent || '').trim()) el.textContent = name;
    });

    /* Mobile sticky bar (.r-15ltsq4) — prepend a title div if not already there */
    var mobileBar = root.querySelector('.r-15ltsq4');
    if (mobileBar && !mobileBar.querySelector('[data-tbf2-sticky-title]')) {
      var titleDiv = document.createElement('div');
      titleDiv.setAttribute('data-tbf2-sticky-title', '1');
      titleDiv.textContent = name;
      titleDiv.style.cssText = [
        'display:block',
        'width:100%',
        'font-family:Satoshi,system-ui,sans-serif',
        'font-weight:700',
        'font-size:15px',
        'line-height:1.3',
        'color:#111',
        'padding:10px 0 4px',
        'text-align:center',
        'white-space:nowrap',
        'overflow:hidden',
        'text-overflow:ellipsis'
      ].join(';');
      mobileBar.insertBefore(titleDiv, mobileBar.firstChild);
    }
  }

  ready(function () {
    boot();
    setTimeout(boot, 400);
    document.addEventListener('shopify:section:load', function (e) {
      if (e && e.target && e.target.querySelector && e.target.querySelector('#tbf2-fullpage, [data-tbf2-pdp]')) {
        boot();
      }
    });
    document.addEventListener('shopify:block:select', function () {
      setTimeout(boot, 50);
    });
    document.addEventListener('shopify:block:deselect', function () {
      setTimeout(boot, 50);
    });
  });
})();
