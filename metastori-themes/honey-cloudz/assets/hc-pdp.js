/**
 * HC-PDP PDP — custom interactions for renamed Replo skin.
 * Collapsibles work like theme accordion (height toggle).
 * Chart popup uses product metafield insert_diagram_popups.
 * Carousel uses transform (does not break Replo flex layout).
 */
(function () {
  'use strict';

  /* Every pdp-* section tags this file in, so the same src can appear many times
     on one page. Run once. */
  if (window.__hcPdpBooted) return;
  window.__hcPdpBooted = true;

  var ROOT = 'hc-pdp-fullpage';

  /* Split-section mode: the one-piece #hc-pdp-fullpage wrapper is gone and each
     part of the PDP renders as its own Shopify section. Widen the scope to
     <body> so the existing root.querySelector(...) calls still find the markup. */
  function splitRoot() {
    return document.querySelector('[data-pdp-sec][data-pdp-preset="inserts"]')
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
    var prevBtns = qsa(carousel, '[data-direction="previous"], [data-hc-pdp-gallery-prev], [data-hc-pdp-rt-prev]');
    var nextBtns = qsa(carousel, '[data-direction="next"], [data-hc-pdp-gallery-next], [data-hc-pdp-rt-next]');
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
      '[data-direction="previous"], .hc-pdp-gallery__nav--prev, [data-hc-pdp-gallery-prev]'
    ).forEach(function (btn) {
      setHidden(btn, atStart);
    });
    qsa(
      host,
      '[data-direction="next"], .hc-pdp-gallery__nav--next, [data-hc-pdp-gallery-next]'
    ).forEach(function (btn) {
      setHidden(btn, atEnd);
    });
  }

  function initCollapsibles(root) {
    var items = qsa(root, '[data-hc-pdp-collapsible]');
    var durationMs = 300;
    var FAQ_ARROW_RIGHT =
      'https://assets.replocdn.com/projects/a2c7c51a-ec22-4e36-a9ea-6f00296360e2/b8841636-2636-4c73-ac94-db12e1167639';
    var FAQ_ARROW_DOWN =
      'https://assets.replocdn.com/projects/a2c7c51a-ec22-4e36-a9ea-6f00296360e2/89a72fba-452d-471a-b93d-bd4fa1472c5c';
    var HOWTO_ARROW_DOWN =
      'https://assets.replocdn.com/projects/a2c7c51a-ec22-4e36-a9ea-6f00296360e2/3d86fcec-4cc8-479b-a970-dc2daef939a7';

    function findPanel(item) {
      return (
        item.querySelector(':scope > .hc-pdp-animated') ||
        item.querySelector(':scope > .replo-animated') ||
        item.querySelector('.hc-pdp-animated') ||
        item.querySelector('.replo-animated')
      );
    }

    function findTrigger(item) {
      return item.querySelector(':scope > [role="button"]') || item.querySelector('[role="button"]');
    }

    function isFaqItem(item) {
      return (
        !!item.closest('[data-hc-pdp-id="ae18e143-f607-4fc0-acea-287fb1b00428"]') ||
        !!item.closest('[data-hc-pdp-faq-section]') ||
        !!item.closest('[data-hc-pdp-block="faq"]') ||
        !!item.closest('[data-hc-pdp-faq]')
      );
    }

    function setArrowSrc(trigger, url) {
      if (!trigger || !url) return;
      qsa(trigger, 'img').forEach(function (img) {
        img.setAttribute('src', url);
        img.removeAttribute('srcset');
        img.setAttribute('alt', 'arrow');
        img.classList.add('hc-pdp-faq-arrow');
      });
      qsa(trigger, 'source').forEach(function (el) {
        el.setAttribute('srcset', url + '?width=40');
        el.setAttribute('srcSet', url + '?width=40');
      });
      qsa(trigger, 'picture').forEach(function (el) {
        el.classList.add('hc-pdp-faq-arrow');
      });
    }

    function normalizeHowToArrow(trigger) {
      setArrowSrc(trigger, HOWTO_ARROW_DOWN);
    }

    /* closed = ↓ (0deg), open = ↑ (180deg) — inline !important beats Replo CSS */
    function setHowToArrowDir(trigger, open) {
      if (!trigger) return;
      normalizeHowToArrow(trigger);
      var deg = open ? '180deg' : '0deg';
      qsa(trigger, 'picture, .hc-pdp-faq-arrow').forEach(function (el) {
        if (el.tagName === 'IMG' && el.closest('picture')) return;
        el.style.setProperty('transform', 'rotate(' + deg + ')', 'important');
        el.style.setProperty('transform-origin', 'center center', 'important');
        el.style.setProperty('transition', 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 'important');
      });
      qsa(trigger, 'picture img').forEach(function (img) {
        img.style.setProperty('transform', 'none', 'important');
      });
    }

    items.forEach(function (item) {
      if (item.getAttribute('data-hc-pdp-ready') === '1') return;
      item.setAttribute('data-hc-pdp-ready', '1');

      var trigger = findTrigger(item);
      var panel = findPanel(item);
      if (!trigger || !panel) return;

      var inFaq = isFaqItem(item);
      if (inFaq) {
        item.setAttribute('data-hc-pdp-arrow', 'faq');
        setArrowSrc(trigger, item.getAttribute('data-state') === 'open' ? FAQ_ARROW_DOWN : FAQ_ARROW_RIGHT);
      } else {
        item.setAttribute('data-hc-pdp-arrow', 'up');
        setHowToArrowDir(trigger, item.getAttribute('data-state') === 'open');
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
        else setHowToArrowDir(trigger, open);

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
            qsa(parent, ':scope > [data-hc-pdp-collapsible]').forEach(function (sib) {
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
                else setHowToArrowDir(sibTrigger, false);
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
    var el = document.getElementById('hc-pdp-size-modal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'hc-pdp-size-modal';
    el.className = 'hc-pdp-size-modal';
    el.hidden = true;
    el.innerHTML =
      '<div class="hc-pdp-size-modal__overlay ReactModal__Overlay" data-hc-pdp-close>' +
      '<div class="hc-pdp-size-modal__box ReactModal__Content" role="dialog" aria-modal="true" aria-label="Size chart" data-hc-pdp-modal-box>' +
      '<button type="button" class="hc-pdp-size-modal__x" data-hc-pdp-close aria-label="Close">&times;</button>' +
      '<div class="hc-pdp-size-modal__top">' +
        '<img class="hc-pdp-size-modal__top-logo" src="" alt="Logo" />' +
        '<div class="hc-pdp-size-modal__top-heading">' +
          '<img class="hc-pdp-size-modal__top-icon" src="" alt="" />' +
          '<div class="hc-pdp-size-modal__top-title"></div>' +
        '</div>' +
        '<div class="hc-pdp-size-modal__top-subtitle"></div>' +
        '<div class="hc-pdp-size-modal__top-content"></div>' +
      '</div>' +
      '<div class="hc-pdp-size-modal__body"></div></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target.closest('.hc-pdp-size-modal__x')) {
        closeModal(el);
        return;
      }
      if (e.target.closest('[data-hc-pdp-modal-box]')) return;
      if (e.target.closest('.hc-pdp-size-modal__overlay')) closeModal(el);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !el.hidden) closeModal(el);
    });
    return el;
  }

  function openModal(el) {
    el.hidden = false;
    el.classList.remove('is-closing');
    document.documentElement.classList.add('hc-pdp-modal-open', 'replo-modal-after-open');
    document.body.classList.add('replo-modal-after-open');
    var overlay = el.querySelector('.hc-pdp-size-modal__overlay');
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
    el = el || document.getElementById('hc-pdp-size-modal');
    if (!el) return;
    var overlay = el.querySelector('.hc-pdp-size-modal__overlay');
    if (overlay) overlay.classList.remove('ReactModal__Overlay--after-open');
    el.classList.add('is-closing');
    setTimeout(function () {
      el.hidden = true;
      el.classList.remove('is-closing');
      document.documentElement.classList.remove('hc-pdp-modal-open', 'replo-modal-after-open');
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
          // Remove images, keep only text/html above/below the diagram.
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
    var triggers = qsa(root, '[data-hc-pdp-size-trigger]');

    if (!triggers.length) {
      qsa(root, 'button, a, [role="button"]').forEach(function (el) {
        if (el.closest('[data-hc-pdp-collapsible]')) return;
        if (el.closest('[data-hc-pdp-option-select]')) return;
        if (el.closest('fieldset')) return;
        if (el.closest('modal-opener')) return;
        var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (/^view size guide$/i.test(t)) {
          el.setAttribute('data-hc-pdp-size-trigger', 'guide');
          triggers.push(el);
        } else if (/^check insert dimensions$/i.test(t)) {
          el.setAttribute('data-hc-pdp-size-trigger', 'dims');
          triggers.push(el);
        }
      });
    }

    triggers = triggers.filter(function (el, i, arr) {
      return arr.indexOf(el) === i;
    });

    triggers.forEach(function (el) {
      if (el.getAttribute('data-hc-pdp-ready') === '1') return;
      el.setAttribute('data-hc-pdp-ready', '1');
      el.style.cursor = 'pointer';
      // Bind whole row (icon + label) like Replo hit area
      var row = el.parentElement;
      var bindEl = row && row.querySelector('picture, img') ? row : el;
      if (bindEl !== el) {
        bindEl.style.cursor = 'pointer';
        if (bindEl.getAttribute('data-hc-pdp-ready') === '1') return;
        bindEl.setAttribute('data-hc-pdp-ready', '1');
        bindEl.setAttribute(
          'data-hc-pdp-size-trigger',
          el.getAttribute('data-hc-pdp-size-trigger') || 'guide'
        );
      }
      bindEl.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var modal = ensureModal();
        var body = modal.querySelector('.hc-pdp-size-modal__body');
        var topTitleEl = modal.querySelector('.hc-pdp-size-modal__top-title');
        var topSubtitleEl = modal.querySelector('.hc-pdp-size-modal__top-subtitle');
        var topContentEl = modal.querySelector('.hc-pdp-size-modal__top-content');
        var topIconEl = modal.querySelector('.hc-pdp-size-modal__top-icon');
        var topLogoEl = modal.querySelector('.hc-pdp-size-modal__top-logo');
        var kind =
          bindEl.getAttribute('data-hc-pdp-size-trigger') ||
          el.getAttribute('data-hc-pdp-size-trigger');
        var cfg = window.hcPdp || {};
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
          popupTitle   = (cfg.guidePopupTitle || '').trim();
          popupSubtitle = '';
          popupDesc    = (cfg.guidePopupDescription || '').trim();
          iconSrc      = ICON_GUIDE;
          modal.classList.add('hc-pdp-size-modal--guide');
        } else {
          popupTitle   = (cfg.dimsPopupTitle || '').trim();
          popupSubtitle = (cfg.dimsPopupSubtitle || '').trim();
          popupDesc    = (cfg.dimsPopupDescription || '').trim();
          iconSrc      = ICON_DIMS;
          modal.classList.remove('hc-pdp-size-modal--guide');
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
            '" class="hc-pdp-size-modal__img" />'
          : '<p class="hc-pdp-size-modal__empty">Chart metafield is empty for this product.</p>';
        openModal(modal);
      });
    });
  }

  function productUrlFromHandle(handle) {
    var rootPath = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';
    return rootPath.replace(/\/?$/, '/') + 'products/' + encodeURIComponent(handle);
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
      qsa(el, 'p, span, .hc-pdp-rte, .hc-pdp-r-hee34').forEach(function (node) {
        node.style.setProperty('color', '#000', 'important');
      });
    } else {
      el.style.setProperty('background-color', '#000', 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('color', '#fff', 'important');
      el.style.setProperty('border', '1px solid #000', 'important');
      el.style.setProperty('border-color', '#000', 'important');
      el.style.setProperty('box-shadow', 'none', 'important');
      qsa(el, 'p, span, .hc-pdp-rte, .hc-pdp-r-hee34').forEach(function (node) {
        node.style.setProperty('color', '#fff', 'important');
      });
    }
  }

  function paintBlackNavHover(el, hovering) {
    if (!el) return;
    if (hovering) {
      el.style.setProperty('background', '#fff', 'important');
      el.style.setProperty('background-color', '#fff', 'important');
      el.style.setProperty('border-color', '#333', 'important');
      el.style.setProperty('color', '#333', 'important');
      qsa(el, 'img').forEach(function (img) {
        img.style.setProperty('filter', 'invert(1)', 'important');
      });
    } else {
      el.style.setProperty('background', '#333', 'important');
      el.style.setProperty('background-color', '#333', 'important');
      el.style.setProperty('border-color', '#333', 'important');
      el.style.setProperty('color', '#fff', 'important');
      qsa(el, 'img').forEach(function (img) {
        img.style.removeProperty('filter');
      });
    }
  }

  function wireBlackBtnHover(el) {
    if (!el || el.getAttribute('data-hc-pdp-black-hover') === '1') return;
    el.setAttribute('data-hc-pdp-black-hover', '1');
    el.setAttribute('data-hc-pdp-black-btn', '1');
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

  function wireBlackNavHover(el) {
    if (!el || el.getAttribute('data-hc-pdp-nav-hover') === '1') return;
    el.setAttribute('data-hc-pdp-nav-hover', '1');
    el.addEventListener('mouseenter', function () {
      paintBlackNavHover(el, true);
    });
    el.addEventListener('mouseleave', function () {
      paintBlackNavHover(el, false);
    });
  }

  function isNearBlackBg(el) {
    try {
      var bg = window.getComputedStyle(el).backgroundColor || '';
      var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (!m) return false;
      var r = +m[1];
      var g = +m[2];
      var b = +m[3];
      return r < 40 && g < 40 && b < 40;
    } catch (err) {
      return false;
    }
  }

  function initBlackButtonHovers(root) {
    /* Replo Fit Your Cloudz style: black → transparent + black text.
       Covers Find Your Fit, Why CTAs, and other solid-black page CTAs. */
    qsa(
      root,
      [
        'a.hc-pdp-r-6lsuhs',
        '[data-hc-pdp-id="f1e85414-9798-4e22-95dc-ff311ebd93bf"]',
        'button.hc-pdp-r-1vgn8t2',
        'button.hc-pdp-r-1foczz6',
        '[data-hc-pdp-id="b3987bc1-3821-4404-a790-f72f46c0a420"]',
        '[data-hc-pdp-id="1eb9f8fc-3eec-47eb-b47c-9a2268af185e"]'
      ].join(', ')
    ).forEach(wireBlackBtnHover);

    /* Also catch other solid-black page CTAs — skip related outline pills */
    qsa(root, '[role="button"], [role="link"], a, button').forEach(function (el) {
      if (el.closest('[data-hc-pdp-collapsible]')) return;
      if (el.closest('[data-hc-pdp-option-select]')) return;
      if (el.closest('.hc-pdp-related-card')) return;
      if (el.closest('[data-hc-pdp-related-cta]')) return;
      if (el.classList.contains('hc-pdp-related-card__btn')) return;
      if (el.getAttribute('data-hc-pdp-related-cta') === '1') return;
      if (el.classList.contains('hc-pdp-gallery__thumb')) return;
      if (el.hasAttribute('data-direction')) return;
      if (el.classList.contains('hc-pdp-gallery__nav')) return;
      if (el.classList.contains('hc-pdp-rt-videos__nav')) return;
      if (el.getAttribute('data-hc-pdp-black-hover') === '1') return;
      var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!t || t.length > 80) return;
      if (!/find your fit|feel the difference|shop now|view product|buy now/i.test(t)) return;
      if (!isNearBlackBg(el)) return;
      wireBlackBtnHover(el);
    });

    // Circular black nav arrows
    qsa(
      root,
      '[data-direction], .hc-pdp-gallery__nav, .hc-pdp-rt-videos__nav'
    ).forEach(wireBlackNavHover);
  }

  function initRelatedProductLinks(root) {
    // Related cards: role=button + product handle → PDP (card + CTA) — keep Replo button design
    qsa(root, '[data-hc-pdp-product-container][data-hc-pdp-product-handle][role="button"]').forEach(function (el) {
      if (el.getAttribute('data-hc-pdp-related-ready') === '1') return;
      var handle = (el.getAttribute('data-hc-pdp-product-handle') || '').trim();
      if (!handle) return;

      el.setAttribute('data-hc-pdp-related-ready', '1');
      el.classList.add('hc-pdp-related-card');
      el.style.cursor = 'pointer';

      var url = productUrlFromHandle(handle);

      var img = el.querySelector('img');
      if (img) img.classList.add('hc-pdp-related-card__img');

      var ctas = [];
      qsa(el, 'a, button, [role="button"]').forEach(function (node) {
        if (node === el) return;
        var label = (node.textContent || '').replace(/\s+/g, ' ').trim();
        if (/^(shop now|out of stock|sold out|view product|buy now)$/i.test(label)) {
          ctas.push(node);
        }
      });
      if (!ctas.length) {
        var guess = el.querySelector('a.text, button.text, [role="button"].text');
        if (guess && guess !== el) ctas.push(guess);
      }

      ctas.forEach(function (cta) {
        // Transparent → black hover via CSS only (opposite of page black CTAs)
        cta.classList.add('hc-pdp-related-card__btn');
        cta.setAttribute('data-hc-pdp-related-cta', '1');
        cta.removeAttribute('data-hc-pdp-black-btn');
        cta.removeAttribute('data-hc-pdp-black-hover');
        if (cta.tagName === 'A') {
          cta.setAttribute('href', url);
        } else {
          cta.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = url;
          });
        }
        qsa(cta, '.hc-pdp-animate-spinner, .replo-animate-spinner').forEach(function (sp) {
          sp.style.display = 'none';
        });
      });

      function go(e) {
        if (e.target.closest('a[href]')) return;
        if (e.target.closest('[data-hc-pdp-related-cta]')) return;
        if (e.target.closest('[data-hc-pdp-add-product-variant-to-cart]')) return;
        if (e.target.closest('form')) return;
        if (e.target.closest('[data-hc-pdp-option-select]')) return;
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
    if (/^shop now$/i.test(t)) return true;
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
    '.hc-pdp-breadcrumbs-inline',
    '[data-hc-pdp-id="27680eb7-c226-4a26-a9df-271c669d1c66"]',
    '[data-hc-pdp-id="6c6603d7-ea44-49ee-9cd5-789c90913e29"]',
    '[data-hc-pdp-id="2ecedb7c-b6c2-40d2-8e06-1df65493081f"]',
    /* Split-section mode: the buy box is its own section, so its wrapper is
       the product info block even when the ids above moved or were renamed. */
    '[data-pdp-sec="buybox"]',
    '[data-hc-pdp-product-container]:not([role="button"])',
    '[data-hc-pdp-product-container]',
    '#cst_main_product',
    '[id^="MainProduct-"]',
    '[id^="ProductInfo-"]'
  ];

  /* pdp-wrap-open stamps data-hc-pdp-product-container on every above-fold section
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
     alone is not enough here: the PDP Why section's "Button text" setting and the
     why_inserts_title_name metafield both feed this label, so a renamed button
     stopped scrolling anywhere. Ids survive any copy change. */
  var WHY_CTA_IDS = [
    'b3987bc1-3821-4404-a790-f72f46c0a420',
    '1eb9f8fc-3eec-47eb-b47c-9a2268af185e'
  ];

  function isWhyCta(el) {
    return WHY_CTA_IDS.indexOf(el.getAttribute('data-hc-pdp-id') || '') !== -1;
  }

  function initShopNow(root) {
    // Why / Proven / Shop CTAs → scroll to product title (top), related cards keep product URLs
    qsa(root, '[role="button"], [role="link"], button, a').forEach(function (el) {
      if (el.closest('[data-hc-pdp-collapsible]')) return;
      if (el.closest('[data-hc-pdp-option-select]')) return;
      // Related product cards / CTAs → product URL (not main ATC)
      if (el.closest('[data-hc-pdp-product-container][role="button"]')) return;
      if (el.closest('[data-hc-pdp-related-cta]')) return;
      if (el.closest('.hc-pdp-related-card')) return;
      if (el.getAttribute('data-hc-pdp-related-cta') === '1') return;
      // Keep real links (Find Your Fit, Home, policy, etc.)
      if (el.tagName === 'A') {
        var href = (el.getAttribute('href') || '').trim();
        if (href && href !== '#' && href.toLowerCase().indexOf('javascript:') !== 0) return;
      }
      var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!isWhyCta(el) && !isPageShopCtaLabel(t)) return;
      if (el.getAttribute('data-hc-pdp-ready') === '1') return;
      el.setAttribute('data-hc-pdp-ready', '1');
      el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToProductTitle(root, el);
        if (/^shop now$/i.test(t)) {
          var atc = root.querySelector(
            '[data-hc-pdp-product-container]:not([role="button"]) [data-hc-pdp-add-product-variant-to-cart], [data-hc-pdp-add-product-variant-to-cart]'
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
    qsa(root, '[data-hc-pdp-carousel]').forEach(function (carousel) {
      if (carousel.getAttribute('data-hc-pdp-ready') === '1') return;

      var track =
        carousel.querySelector('[data-hc-pdp-part="slide-track"]') ||
        carousel.querySelector('[data-hc-pdp-part-id="slide-track"]');
      if (!track) {
        var firstSlide = carousel.querySelector('[data-hc-pdp-part="slide"]');
        track = firstSlide && firstSlide.parentElement;
      }
      if (!track) return;

      carousel.setAttribute('data-hc-pdp-ready', '1');

      var gapSource =
        carousel.querySelector('.hc-pdp-r-sftcjo, .hc-pdp-r-qcb735, [style*="--replo-gap"]') ||
        carousel;
      var gapPx = parseGapPx(gapSource, 40);
      var gapCss = gapPx + 'px';
      carousel.style.setProperty('--replo-gap', gapCss);
      track.style.setProperty('--replo-gap', gapCss);
      if (gapSource !== carousel) gapSource.style.setProperty('--replo-gap', gapCss);

      var isTestimonials =
        !!carousel.closest('[data-hc-pdp-id="588021af-101d-45e5-a4d3-ad0750d59ea1"]') ||
        (carousel.id && carousel.id.indexOf('Rccj2') !== -1) ||
        (track.getAttribute('data-hc-pdp-root-id') || '').indexOf('Rbscj2') !== -1;
      var isRelated =
        !!carousel.querySelector('.hc-pdp-r-qcb735') ||
        (carousel.id && carousel.id.indexOf('Rdkj2') !== -1) ||
        !!carousel.querySelector('[data-hc-pdp-product-container][role="button"]');
      var isProductGallery = !!carousel.closest('.hc-pdp-r-14jhwbc, [data-hc-pdp-gallery-host]');
      var isRealTalk =
        !!(carousel.id && String(carousel.id).indexOf('Rhsetb2') !== -1) ||
        !!carousel.closest('[data-hc-pdp-id="de309f63-85ad-4c6d-ae9f-1c0e4182d41b"]');
      // Custom block-driven RT carousel replaced this Replo track — skip
      if (isRealTalk && (carousel.getAttribute('data-hc-pdp-rt-replaced') === '1' || root.querySelector('[data-hc-pdp-rt-videos]:not([hidden])'))) {
        return;
      }
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
        if (isTestimonials) {
          // Keep slides-per-page stable so card spacing/gap stays the same on large widths
          var spp = '1';
          if (window.matchMedia('(min-width: 768px)').matches) spp = '2';
          else if (window.matchMedia('(min-width: 550px)').matches) spp = '1.5';
          applySpp(spp);
          // Tight gap: 16px desktop/tablet, 12px mobile (40px looked too wide)
          gapPx = window.matchMedia('(max-width: 640px)').matches ? 12 : 16;
          gapCss = gapPx + 'px';
          carousel.style.setProperty('--replo-gap', gapCss);
          carousel.style.setProperty('--hc-pdp-gap', gapCss);
          track.style.setProperty('--replo-gap', gapCss);
          track.style.setProperty('--hc-pdp-gap', gapCss);
          track.style.gap = gapCss;
          track.style.columnGap = gapCss;
          if (gapSource && gapSource !== carousel && gapSource !== track) {
            gapSource.style.setProperty('--replo-gap', gapCss);
            gapSource.style.setProperty('--hc-pdp-gap', gapCss);
            // Don't set columnGap on viewport — only the track should space slides
          }
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
        } else if (isRealTalk) {
          // Peek cards like Replo mobile / desktop
          if (window.matchMedia('(max-width: 640px)').matches) applySpp('1.35');
          else if (window.matchMedia('(max-width: 1024px)').matches) applySpp('2.2');
          else applySpp('3.2');
          gapPx = window.matchMedia('(max-width: 640px)').matches ? 12 : 16;
          gapCss = gapPx + 'px';
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
          return n.getAttribute && n.getAttribute('data-hc-pdp-part') === 'slide';
        });
      if (allSlides.length < 2) allSlides = qsa(carousel, '[data-hc-pdp-part="slide"]');
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
          node.removeAttribute('data-hc-pdp-related-ready');
          qsa(node, '[data-hc-pdp-related-ready]').forEach(function (n) {
            n.removeAttribute('data-hc-pdp-related-ready');
          });
          node.style.width = '';
          node.style.maxWidth = '300px';
          node.style.flex = '0 0 auto';
          node.style.flexShrink = '0';
          track.appendChild(node);
        });

        var viewport =
          carousel.querySelector('.hc-pdp-r-qcb735') ||
          track.parentElement ||
          carousel;
        carousel.classList.add('hc-pdp-carousel--related-scroll');
        track.style.display = 'flex';
        track.style.transform = 'none';
        track.style.transition = 'none';
        track.style.willChange = 'auto';
        track.style.gap = 'var(--replo-gap, ' + gapCss + ')';
        track.style.overflow = 'visible';

        function applyRelatedLayout() {
          var desktop = window.matchMedia('(min-width: 1300px)').matches;
          qsa(track, '[data-hc-pdp-part="slide"]').forEach(function (node) {
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
            viewport.classList.add('hc-pdp-carousel-scrollport');
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
          var slide = track.querySelector('[data-hc-pdp-part="slide"]');
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

      // Real Talk. Real Results — overflow scroll peek cards (Replo parity, no transform fight)
      if (isRealTalk) {
        track.innerHTML = '';
        unique.forEach(function (src, idx) {
          var node = src.cloneNode(true);
          node.setAttribute('data-is-cloned', 'false');
          node.setAttribute('data-slide-index', String(idx));
          node.setAttribute('aria-hidden', 'false');
          node.style.flex = '0 0 auto';
          node.style.flexShrink = '0';
          node.style.width = '';
          node.style.maxWidth = '';
          // Fill empty <video> from sibling poster <img> (Replo runtime used to do this)
          qsa(node, 'video').forEach(function (vid) {
            var poster = vid.getAttribute('poster');
            if (!poster) {
              var img = vid.parentElement && vid.parentElement.querySelector('img');
              if (img && img.getAttribute('src')) {
                vid.setAttribute('poster', img.getAttribute('src'));
              }
            }
          });
          track.appendChild(node);
        });

        carousel.classList.add('hc-pdp-carousel--realtalk-scroll');
        track.style.display = 'flex';
        track.style.transform = 'none';
        track.style.transition = 'none';
        track.style.willChange = 'auto';
        track.style.gap = 'var(--replo-gap, ' + gapCss + ')';
        track.style.overflowX = 'auto';
        track.style.overflowY = 'hidden';
        track.style.scrollBehavior = 'smooth';
        track.style.webkitOverflowScrolling = 'touch';
        track.style.scrollbarWidth = 'none';
        track.style.msOverflowStyle = 'none';
        track.style.scrollSnapType = 'x mandatory';

        qsa(track, '[data-hc-pdp-part="slide"]').forEach(function (slide) {
          slide.style.scrollSnapAlign = 'start';
        });

        qsa(carousel, '[data-direction]').forEach(function (btn) {
          btn.removeAttribute('disabled');
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.cursor = 'pointer';
        });

        function rtScrollStep(dir) {
          var slide = track.querySelector('[data-hc-pdp-part="slide"]');
          var amount = (slide ? slide.getBoundingClientRect().width : 220) + gapPx;
          track.scrollBy({ left: dir * amount, behavior: 'smooth' });
        }

        qsa(carousel, '[data-direction="previous"]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            rtScrollStep(-1);
          });
        });
        qsa(carousel, '[data-direction="next"]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            rtScrollStep(1);
          });
        });

        wireScrollEdgeArrows(track, carousel);
        window.addEventListener('resize', setSpp);
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
          carousel.querySelector('.hc-pdp-r-gmkp01') ||
          carousel.querySelector('.hc-pdp-r-sftcjo') ||
          track.parentElement ||
          carousel;
        var animating = false;

        carousel.classList.add('hc-pdp-carousel--proven-infinite');
        track.style.display = 'flex';
        track.style.overflow = 'visible';
        track.style.gap = gapCss;
        track.style.columnGap = gapCss;
        track.style.setProperty('--replo-gap', gapCss);
        track.style.setProperty('--hc-pdp-gap', gapCss);
        track.style.willChange = 'transform';
        track.style.backfaceVisibility = 'hidden';
        if (viewport && viewport !== track) {
          viewport.style.overflow = 'hidden';
          viewport.style.overflowX = 'hidden';
          viewport.style.overflowY = 'hidden';
          viewport.style.setProperty('--replo-gap', gapCss);
          viewport.style.setProperty('--hc-pdp-gap', gapCss);
          viewport.style.columnGap = '0';
          viewport.style.rowGap = '0';
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
          carousel.querySelector('.hc-pdp-r-14kux2b') ||
          track.parentElement ||
          carousel;
        var gAnimating = false;

        applySpp('1');
        carousel.classList.add('hc-pdp-carousel--product-media');
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

        carousel._hcPdpGoToSlide = function (sourceIndex) {
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
        carousel.querySelector('[data-hc-pdp-part="slides"]') ||
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
    var cfg = window.hcPdp || {};
    if (cfg.variants && cfg.variants.length) {
      return {
        id: cfg.productId,
        handle: cfg.productHandle,
        options: cfg.options || ['Size', 'Color'],
        variants: cfg.variants
      };
    }
    var el =
      document.getElementById('hc-pdp-deps-template-product') ||
      document.getElementById('replo-deps-template-product') ||
      (root && root.querySelector('#hc-pdp-deps-template-product')) ||
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
    if (root.getAttribute('data-hc-pdp-variants-ready') === '1') return;

    var product = getProductJson(root);
    if (!product || !product.variants || !product.variants.length) {
      console.warn('[tbf2] variants unavailable — swatches not bound');
      return;
    }

    root.setAttribute('data-hc-pdp-variants-ready', '1');

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

    var listbox = root.querySelector('[data-hc-pdp-option-select]');
    if (listbox && colorValues.length) {
      qsa(listbox, '[role="option"]').forEach(function (opt, idx) {
        var val = (opt.getAttribute('data-hc-pdp-option-value') || colorValues[idx] || '').trim();
        if (!val) return;
        opt.setAttribute('data-hc-pdp-option-value', val);
        var disc =
          opt.querySelector('.hc-pdp-r-108lgjk') ||
          opt.querySelector('.hc-pdp-r-tw2wh8') ||
          opt.firstElementChild;
        if (!disc) return;
        var paint = swatchPaint(val);
        var existingBg =
          disc.style.getPropertyValue(
            '--hc-pdp-attributes-currentoption-swatches-color-color-background-color'
          ) ||
          disc.style.getPropertyValue(
            '--replo-attributes-currentoption-swatches-color-color-background-color'
          );
        var existingImg =
          disc.style.getPropertyValue(
            '--hc-pdp-attributes-currentoption-swatches-color-color-background-image'
          ) ||
          disc.style.getPropertyValue(
            '--replo-attributes-currentoption-swatches-color-color-background-image'
          );
        var needsFallback =
          !existingImg &&
          (!existingBg ||
            existingBg === 'transparent' ||
            (existingBg.indexOf('#') !== 0 && !SWATCH_FALLBACKS[String(existingBg).toLowerCase()]));
        if (needsFallback || !existingBg) {
          var colorVal = paint.indexOf('#') === 0 ? paint : swatchPaint(val);
          disc.style.setProperty(
            '--hc-pdp-attributes-currentoption-swatches-color-color-background-color',
            colorVal
          );
          disc.style.setProperty(
            '--replo-attributes-currentoption-swatches-color-color-background-color',
            colorVal
          );
        }
        if (!existingImg) {
          var resolved =
            disc.style.getPropertyValue(
              '--hc-pdp-attributes-currentoption-swatches-color-color-background-color'
            ) ||
            disc.style.getPropertyValue(
              '--replo-attributes-currentoption-swatches-color-color-background-color'
            );
          disc.style.backgroundColor = resolved;
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
      var label = root.querySelector('.hc-pdp-r-lkrg9v');
      if (label && name) label.textContent = name;
    }

    function syncGalleryToVariant(variant) {
      if (!variant) return;
      var mediaId = null;
      var map = (window.hcPdp && window.hcPdp.variantMedia) || {};
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
      } else if (!mediaId && window.hcPdp && window.hcPdp.media && variant.featured_image) {
        var want = String(
          typeof variant.featured_image === 'string'
            ? variant.featured_image
            : variant.featured_image.src || ''
        ).split('?')[0];
        var mediaList = window.hcPdp.media;
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
      qsa(root, '[data-hc-pdp-gallery]').forEach(function (gal) {
        showGalleryMedia(gal, mediaId);
      });
      // Mobile native Replo media carousel — jump to matching slide by image basename
      var mediaItem =
        (window.hcPdp &&
          window.hcPdp.media &&
          window.hcPdp.media.find(function (m) {
            return String(m.id) === String(mediaId);
          })) ||
        null;
      if (mediaItem) {
        qsa(root, '.hc-pdp-r-14jhwbc [data-hc-pdp-carousel], [data-hc-pdp-gallery-host] [data-hc-pdp-carousel]').forEach(function (carousel) {
          if (typeof carousel._hcPdpGoToSlide === 'function') {
            var tip = String(mediaItem.src || mediaItem.preview || '')
              .split('?')[0]
              .split('/')
              .pop();
            var realSlides = qsa(carousel, '[data-hc-pdp-part="slide"][data-is-cloned="false"]');
            if (!realSlides.length) {
              realSlides = qsa(carousel, '[data-hc-pdp-part="slide"]').filter(function (s) {
                return s.getAttribute('data-is-cloned') !== 'true';
              });
            }
            var idx = realSlides.findIndex(function (slide) {
              var img = slide.querySelector('img');
              return img && tip && (img.src || '').indexOf(tip.split('.')[0]) !== -1;
            });
            if (idx >= 0) carousel._hcPdpGoToSlide(idx);
          }
        });
      }
    }

    function applyVariant(variant) {
      if (!variant) return;
      current = variant;
      var buyBox =
        root.querySelector('[data-hc-pdp-product-container]:not([role="button"])') || root;
      qsa(buyBox, 'form[action*="/cart/add"] [name="id"]').forEach(function (input) {
        input.value = variant.id;
      });
      qsa(root, '[data-hc-pdp-price]').forEach(function (el) {
        el.textContent = money(variant.price);
      });
      qsa(root, '[data-hc-pdp-option-select] [role="option"]').forEach(function (opt) {
        var val = opt.getAttribute('data-hc-pdp-option-value');
        var on = !!(colorName && selected[colorName] === val);
        if (!colorName) {
          on = Object.keys(selected).some(function (k) {
            return selected[k] === val;
          });
        }
        opt.setAttribute('aria-selected', on ? 'true' : 'false');
        opt.classList.toggle('hc-pdp-r-15mi41y', on);
        opt.classList.toggle('hc-pdp-r-1fqxyeq', on);
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
      qsa(root, '[data-hc-pdp-option-select] [role="option"]').forEach(function (other) {
        var on = other === optEl || other.getAttribute('data-hc-pdp-option-value') === val;
        other.setAttribute('aria-selected', on ? 'true' : 'false');
        other.classList.toggle('hc-pdp-r-15mi41y', on);
        other.classList.toggle('hc-pdp-r-1fqxyeq', on);
        other.classList.toggle('r-1fqxyeq', on);
      });
      var variant = findVariant(matchedOpt);
      applyVariant(variant);
      syncBundlePickers(val, sizeName ? selected[sizeName] : null);
    }

    // Event delegation — survives re-renders / nested disc clicks
    if (root.getAttribute('data-hc-pdp-swatch-delegate') !== '1') {
      root.setAttribute('data-hc-pdp-swatch-delegate', '1');
      root.addEventListener(
        'click',
        function (e) {
          var opt = e.target.closest('[data-hc-pdp-option-select] [role="option"]');
          if (!opt || !root.contains(opt)) return;
          e.preventDefault();
          e.stopPropagation();
          var val = (opt.getAttribute('data-hc-pdp-option-value') || '').trim();
          if (!val) {
            var opts = qsa(root, '[data-hc-pdp-option-select] [role="option"]');
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
    qsa(root, '[data-hc-pdp-add-product-variant-to-cart]').forEach(function (btn) {
      if (btn.getAttribute('data-hc-pdp-ready') === '1') return;
      btn.setAttribute('data-hc-pdp-ready', '1');
      btn.addEventListener('click', function (e) {
        var container = btn.closest('[data-hc-pdp-product-container]');
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
    var n = parseInt((window.hcPdp && window.hcPdp.thumbsPerRow) || 2, 10);
    if (!n || n < 1) n = 2;
    return n;
  }

  function getThumbsLayout() {
    var layout = (window.hcPdp && window.hcPdp.thumbsLayout) || 'grid';
    return layout === 'scroll' ? 'scroll' : 'grid';
  }

  function desktopLightboxEnabled() {
    return !!(window.hcPdp && window.hcPdp.desktopLightbox !== false);
  }

  function ensureLightbox() {
    var box = document.getElementById('hc-pdp-lightbox');
    if (box) return box;
    box = document.createElement('div');
    box.id = 'hc-pdp-lightbox';
    box.className = 'hc-pdp-lightbox';
    box.setAttribute('hidden', '');
    box.innerHTML =
      '<button type="button" class="hc-pdp-lightbox__close" aria-label="Close">&times;</button>' +
      '<img class="hc-pdp-lightbox__img" alt="" />';
    document.body.appendChild(box);
    function close() {
      box.classList.remove('is-open');
      box.setAttribute('hidden', '');
      document.documentElement.style.overflow = '';
    }
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('.hc-pdp-lightbox__close')) close();
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
    var img = box.querySelector('.hc-pdp-lightbox__img');
    if (img) {
      img.src = src;
      img.alt = alt || '';
    }
    box.removeAttribute('hidden');
    box.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  }

  function buildGalleryEl() {
    var media = (window.hcPdp && window.hcPdp.media) || [];
    var perRow = getThumbsPerRow();
    var layout = getThumbsLayout();
    var wrap = document.createElement('div');
    wrap.className = 'hc-pdp-gallery';
    wrap.setAttribute('data-hc-pdp-gallery', '');
    wrap.setAttribute('data-thumbs-per-row', String(perRow));
    wrap.setAttribute('data-thumbs-layout', layout);
    if (!desktopLightboxEnabled()) wrap.setAttribute('data-lightbox', 'off');
    wrap.style.setProperty('--hc-pdp-thumbs-per-row', String(perRow));

    var stage = document.createElement('div');
    stage.className = 'hc-pdp-gallery__stage';
    stage.setAttribute('data-hc-pdp-stage', '');

    var thumbs = document.createElement('div');
    thumbs.className = 'hc-pdp-gallery__thumbs';
    thumbs.setAttribute('data-hc-pdp-thumbs', '');
    thumbs.setAttribute('role', 'tablist');
    thumbs.setAttribute('aria-label', 'Product media');

    media.forEach(function (m, idx) {
      var slide = document.createElement('div');
      slide.className = 'hc-pdp-gallery__media' + (idx === 0 ? ' is-active' : '');
      slide.setAttribute('data-media-id', String(m.id));
      if (idx !== 0) slide.setAttribute('hidden', '');
      var img = document.createElement('img');
      img.className = 'hc-pdp-gallery__image';
      img.src = m.src;
      img.alt = m.alt || '';
      img.loading = idx === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      stage.appendChild(slide);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hc-pdp-gallery__thumb' + (idx === 0 ? ' is-active' : '');
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
      prev.className = 'hc-pdp-gallery__nav hc-pdp-gallery__nav--prev hc-pdp-r-h33pie';
      prev.setAttribute('data-hc-pdp-gallery-prev', '');
      prev.setAttribute('aria-label', 'Previous image');
      prev.innerHTML =
        '<picture><source srcset="' +
        ARROW_PREV +
        '?width=40" media="(max-width: 640px)"><img src="' +
        ARROW_PREV +
        '" alt="" width="48" height="48" loading="lazy"></picture>';
      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'hc-pdp-gallery__nav hc-pdp-gallery__nav--next hc-pdp-r-h33pie';
      next.setAttribute('data-hc-pdp-gallery-next', '');
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
    gal.style.setProperty('--hc-pdp-thumbs-per-row', String(perRow));
  }

  function showGalleryMedia(gal, id) {
    if (!gal || id == null || id === '') return;
    var want = String(id);
    var thumbs = gal.querySelector('[data-hc-pdp-thumbs]');
    var mediaNodes = qsa(gal, '.hc-pdp-gallery__media');
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
      qsa(thumbs, '.hc-pdp-gallery__thumb').forEach(function (t) {
        var on = String(t.getAttribute('data-media-id')) === want;
        t.classList.toggle('is-active', on);
        if (on && typeof t.scrollIntoView === 'function') {
          try {
            t.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
          } catch (err2) {}
        }
      });
    }

    var mediaNodes = qsa(gal, '.hc-pdp-gallery__media');
    var ids = mediaNodes.map(function (m) {
      return m.getAttribute('data-media-id');
    });
    syncIndexEdgeArrows(gal, ids.indexOf(want), ids.length);
  }

  function stepGallery(gal, dir) {
    if (!gal) return;
    var mediaNodes = qsa(gal, '.hc-pdp-gallery__media');
    if (mediaNodes.length < 2) return;
    var ids = mediaNodes.map(function (m) {
      return m.getAttribute('data-media-id');
    });
    var active = gal.querySelector('.hc-pdp-gallery__media.is-active');
    var cur = active ? active.getAttribute('data-media-id') : ids[0];
    var idx = ids.indexOf(cur);
    if (idx < 0) idx = 0;
    var next = idx + dir;
    if (next < 0 || next >= ids.length) return;
    showGalleryMedia(gal, ids[next]);
  }

  function initGalleryThumbs(root) {
    // Delegated clicks — arrows + thumbs always sync, even after remount
    if (root.getAttribute('data-hc-pdp-gallery-delegate') === '1') {
      qsa(root, '[data-hc-pdp-gallery]').forEach(function (gal) {
        gal.setAttribute('data-hc-pdp-ready', '1');
        var active = gal.querySelector('.hc-pdp-gallery__media.is-active');
        if (active) showGalleryMedia(gal, active.getAttribute('data-media-id'));
      });
      return;
    }
    root.setAttribute('data-hc-pdp-gallery-delegate', '1');

    root.addEventListener(
      'click',
      function (e) {
        var gal = e.target.closest('[data-hc-pdp-gallery]');
        if (!gal || !root.contains(gal)) return;

        if (e.target.closest('[data-hc-pdp-gallery-prev]')) {
          e.preventDefault();
          e.stopPropagation();
          stepGallery(gal, -1);
          return;
        }
        if (e.target.closest('[data-hc-pdp-gallery-next]')) {
          e.preventDefault();
          e.stopPropagation();
          stepGallery(gal, 1);
          return;
        }

        var thumbs = gal.querySelector('[data-hc-pdp-thumbs]');
        var thumb = e.target.closest('.hc-pdp-gallery__thumb[data-media-id]');
        if (thumb && thumbs && thumbs.contains(thumb)) {
          e.preventDefault();
          e.stopPropagation();
          showGalleryMedia(gal, thumb.getAttribute('data-media-id'));
          return;
        }

        // Desktop only: click main image → lightbox popup
        var stage = gal.querySelector('[data-hc-pdp-stage]');
        if (
          stage &&
          stage.contains(e.target) &&
          !e.target.closest('[data-hc-pdp-gallery-prev], [data-hc-pdp-gallery-next]') &&
          desktopLightboxEnabled() &&
          window.matchMedia('(min-width: 641px)').matches
        ) {
          var active = gal.querySelector('.hc-pdp-gallery__media.is-active img, .hc-pdp-gallery__media:not([hidden]) img');
          if (active && active.getAttribute('src')) {
            e.preventDefault();
            openLightbox(active.getAttribute('src'), active.getAttribute('alt') || '');
          }
        }
      },
      true
    );

    qsa(root, '[data-hc-pdp-gallery]').forEach(function (gal) {
      gal.setAttribute('data-hc-pdp-ready', '1');
      var active = gal.querySelector('.hc-pdp-gallery__media.is-active');
      if (active) showGalleryMedia(gal, active.getAttribute('data-media-id'));
    });
  }

  function mountCustomGallery(root) {
    // Always custom gallery (main + thumbs + arrows) — matches current design
    root.classList.remove('hc-pdp-gallery-mobile-native');
    root.classList.add('hc-pdp-gallery-desktop-custom');

    if (root.classList.contains('hc-pdp-gallery-ready')) {
      qsa(root, '[data-hc-pdp-gallery]').forEach(applyThumbsPerRow);
      initGalleryThumbs(root);
      return;
    }

    var slot = root.querySelector('[data-hc-pdp-gallery-slot]');
    var gallery = slot && slot.querySelector('[data-hc-pdp-gallery]');
    if (gallery) {
      applyThumbsPerRow(gallery);
    } else {
      gallery = buildGalleryEl();
    }

    // ef23e988 media host is .hc-pdp-r-14jhwbc (NOT teardrop .hc-pdp-r-crmaa3)
    var hosts = qsa(root, '.hc-pdp-r-14jhwbc');
    if (!hosts.length) {
      var buy = root.querySelector('[data-hc-pdp-product-container]');
      var carousels = buy
        ? qsa(buy, '[data-hc-pdp-carousel]')
        : qsa(root, '[data-hc-pdp-carousel]');
      // Prefer the first carousel that looks like product media (has pictures/images)
      carousels.forEach(function (c) {
        if (hosts.length) return;
        if (c.querySelector('picture, img, video')) {
          hosts = [c.parentElement || c];
        }
      });
    }
    if (!hosts.length) {
      var carousel = root.querySelector('.hc-pdp-r-14jhwbc [data-hc-pdp-carousel], [data-hc-pdp-product-container] [data-hc-pdp-carousel]');
      if (carousel && carousel.parentElement) hosts = [carousel.parentElement];
    }

    if (hosts.length) {
      hosts.forEach(function (host, i) {
        var node = i === 0 ? gallery : gallery.cloneNode(true);
        if (i > 0) node.removeAttribute('data-hc-pdp-ready');
        host.setAttribute('data-hc-pdp-gallery-host', '');
        var carouselEl = host.querySelector('[data-hc-pdp-carousel]');
        if (carouselEl) {
          carouselEl.classList.add('hc-pdp-replo-media-carousel');
          if (!host.querySelector('[data-hc-pdp-gallery]')) {
            carouselEl.replaceWith(node);
          }
        } else if (!host.querySelector('[data-hc-pdp-gallery]')) {
          host.appendChild(node);
        }
      });
      if (slot && slot.parentNode) slot.parentNode.removeChild(slot);
      root.classList.add('hc-pdp-gallery-ready');
    } else if (slot) {
      // Never leave gallery above the buy box — keep hidden and retry briefly
      slot.style.setProperty('display', 'none', 'important');
      var tries = Number(root.getAttribute('data-hc-pdp-gallery-tries') || '0');
      if (tries < 12) {
        root.setAttribute('data-hc-pdp-gallery-tries', String(tries + 1));
        setTimeout(function () {
          root.classList.remove('hc-pdp-gallery-ready');
          mountCustomGallery(root);
        }, 250);
      }
      return;
    }

    initGalleryThumbs(root);
  }

  function initRealTalk(root) {
    var headingBox =
      root.querySelector('[data-hc-pdp-realtalk]') ||
      root.querySelector('[data-hc-pdp-id="de309f63-85ad-4c6d-ae9f-1c0e4182d41b"]');
    var reploCarousel =
      root.querySelector('[id*="Rhsetb2"]') ||
      root.querySelector('.hc-pdp-r-gvz8lp[data-hc-pdp-carousel]');
    var rtVideos = root.querySelector('[data-hc-pdp-rt-videos]');
    if (!headingBox && !reploCarousel && !rtVideos) return;

    var cfg = (window.hcPdp && window.hcPdp.realTalk) || {};
    if (headingBox) {
      headingBox.setAttribute('data-hc-pdp-realtalk', 'true');
      if (cfg.heading) {
        var heading = headingBox.querySelector('p');
        if (heading && /real talk/i.test(heading.textContent || '')) {
          heading.textContent = cfg.heading;
        }
      }
    }

    if (rtVideos && !rtVideos.querySelector('[data-hc-pdp-rt-slide]')) {
      // No Real Talk blocks — hide the whole section, no fallback
      rtVideos.hidden = true;
      if (reploCarousel) reploCarousel.style.setProperty('display', 'none', 'important');
      if (headingBox) headingBox.style.setProperty('display', 'none', 'important');
      return;
    }

    // Mount Teardrop-style peek carousel (blocks → Liquid slides)
    if (rtVideos) {
      rtVideos.hidden = false;
      rtVideos.removeAttribute('hidden');
      rtVideos.removeAttribute('data-hc-pdp-ready');
      if (reploCarousel) {
        reploCarousel.style.setProperty('display', 'none', 'important');
        reploCarousel.setAttribute('data-hc-pdp-rt-replaced', '1');
        if (rtVideos.parentElement !== reploCarousel.parentElement) {
          reploCarousel.insertAdjacentElement('afterend', rtVideos);
        }
      } else if (headingBox && headingBox.parentElement && rtVideos.parentElement !== headingBox.parentElement) {
        headingBox.parentElement.appendChild(rtVideos);
      }
      if (headingBox) headingBox.classList.add('hc-pdp-realtalk--carousel');
      initRtVideosCarousel(rtVideos);
      return;
    }

    // Legacy single-video fallback
    var box = headingBox;
    if (!box) return;
    var video = box.querySelector('[data-hc-pdp-realtalk-video], video');
    var dummy = box.querySelector('[data-hc-pdp-realtalk-dummy]');
    var playBtn = box.querySelector('.hc-pdp-r-eioolz, [aria-label="Play"]');
    var host = box.querySelector('.hc-pdp-r-6coc2') || (video && video.parentElement);
    var tpl = document.getElementById('hc-pdp-realtalk-video-tpl');
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
    }

    video = box.querySelector('[data-hc-pdp-realtalk-video], video');
    playBtn = box.querySelector('.hc-pdp-r-eioolz');
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
        video.play().then(function () { setPlaying(true); }).catch(function () {
          video.muted = true;
          video.play().then(function () { setPlaying(true); }).catch(function () {});
        });
      } else {
        video.pause();
        setPlaying(false);
      }
    }
    if (playBtn && playBtn.getAttribute('data-hc-pdp-rt-bound') !== '1') {
      playBtn.setAttribute('data-hc-pdp-rt-bound', '1');
      playBtn.addEventListener('click', togglePlay);
    }
    if (video.getAttribute('data-hc-pdp-rt-bound') !== '1') {
      video.setAttribute('data-hc-pdp-rt-bound', '1');
      video.addEventListener('click', togglePlay);
    }
  }

  function initRtVideosCarousel(box) {
    if (!box) return;
    if (box.getAttribute('data-hc-pdp-ready') === '1') return;
    box.setAttribute('data-hc-pdp-ready', '1');
    var track = box.querySelector('[data-hc-pdp-rt-track]');
    var prev = box.querySelector('[data-hc-pdp-rt-prev]');
    var next = box.querySelector('[data-hc-pdp-rt-next]');
    if (!track) return;

    function slideWidth() {
      var slide = track.querySelector('[data-hc-pdp-rt-slide]');
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
        btn.classList.toggle('is-edge-hidden', !!hide);
        btn.hidden = !!hide;
        if (hide) {
          btn.setAttribute('aria-hidden', 'true');
          btn.tabIndex = -1;
          btn.disabled = true;
          /* Inline !important — beat any Replo/opacity:1 leftovers */
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

      /* Hide left at start, hide right at end */
      setArrow(prev, atStart);
      setArrow(next, atEnd);
    }

    function scrollByDir(dir) {
      /* Block left scroll if already at start, right if at end */
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

    /* Snap back to hard edges after any touch/swipe drift */
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
      /* Hard-clamp after momentum finishes */
      var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
      if (track.scrollLeft < 2) track.scrollLeft = 0;
      if (track.scrollLeft > maxScroll - 2) track.scrollLeft = maxScroll + 2;
      syncRtArrows();
    });
    window.addEventListener('resize', syncRtArrows);
    if (typeof ResizeObserver !== 'undefined') {
      try { new ResizeObserver(syncRtArrows).observe(track); } catch (errRo) {}
    }
    if (typeof MutationObserver !== 'undefined') {
      try {
        new MutationObserver(syncRtArrows).observe(track, { childList: true, subtree: true, attributes: true });
      } catch (errMo) {}
    }
    qsa(track, 'img, video, source').forEach(function (m) {
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
      var media = slide.querySelector('.hc-pdp-rt-videos__media');
      if (!media) return null;
      var existing = media.querySelector('video');
      if (videoReady(existing)) return existing;
      var tplId = slide.getAttribute('data-hc-pdp-rt-video-tpl');
      var url = slide.getAttribute('data-hc-pdp-rt-video-url');
      var posterImg = media.querySelector('.hc-pdp-rt-videos__poster, img');
      var poster = posterImg && posterImg.getAttribute && posterImg.getAttribute('src');
      if (tplId) {
        var tpl = document.getElementById(tplId);
        var freshVideo = tpl && tpl.content && tpl.content.querySelector('video');
        if (freshVideo) {
          var fresh = freshVideo.cloneNode(true);
          fresh.classList.add('hc-pdp-rt-videos__video');
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
        vid.classList.add('hc-pdp-rt-videos__video');
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
      var muteBtn = slide.querySelector('[data-hc-pdp-rt-mute]');
      if (!muteBtn) return;
      var muted = !video || video.muted;
      muteBtn.classList.toggle('is-muted', muted);
      muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    }

    function setSlidePlaying(slide, on) {
      if (!slide) return;
      slide.classList.toggle('is-playing', !!on);
      var muteBtn = slide.querySelector('[data-hc-pdp-rt-mute]');
      var poster = slide.querySelector('.hc-pdp-rt-videos__poster');
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
        /* also load if not started */
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
      qsa(box, '[data-hc-pdp-rt-slide]').forEach(function (other) {
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
        var playBtn = slide.querySelector('[data-hc-pdp-rt-play]');
        if (playBtn) { playBtn.style.opacity = ''; playBtn.style.display = ''; }
      }
    }

    /* single delegated click handler on box */
    box.addEventListener('click', function (e) {
      var target = e.target;

      /* mute button — check first, most specific */
      var muteBtn = target.closest('[data-hc-pdp-rt-mute]');
      if (muteBtn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var slide = muteBtn.closest('[data-hc-pdp-rt-slide]');
        var vid = slide && (slide.querySelector('video') || ensureVideo(slide));
        if (!vid) return;
        vid.muted = !vid.muted;
        muteBtn.classList.toggle('is-muted', vid.muted);
        muteBtn.setAttribute('aria-label', vid.muted ? 'Unmute' : 'Mute');
        return;
      }

      /* play/pause button */
      var playBtn = target.closest('[data-hc-pdp-rt-play]');
      if (playBtn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var slide = playBtn.closest('[data-hc-pdp-rt-slide]');
        if (slide) toggleSlide(slide);
        return;
      }

      /* click on media area (video itself) — no button involved */
      var media = target.closest('.hc-pdp-rt-videos__media');
      if (media) {
        e.stopImmediatePropagation();
        var slide = media.closest('[data-hc-pdp-rt-slide]');
        if (slide) toggleSlide(slide);
      }
    });

    /* reset play/pause state when video finishes */
    box.addEventListener('ended', function (e) {
      if (e.target.tagName !== 'VIDEO') return;
      var slide = e.target.closest('[data-hc-pdp-rt-slide]');
      if (slide) setSlidePlaying(slide, false);
    }, true);
  }

  function applySectionVisibility(root) {
    var vis = (window.hcPdp && window.hcPdp.blockVisibility) || {};

    // Theme Editor eye → chunk node IDs
    var map = {
      real_talk: ['de309f63-85ad-4c6d-ae9f-1c0e4182d41b', '3e936b23-b30c-4b61-b0d7-2d9be54809e6', 'a767389e-c179-4b34-84c8-069d34bcb86f'],
      why: ['5f3410af-202f-4c0e-8d53-c1a33e14f225', '8424e330-4b64-44e3-b665-0479b5030287'],
      purpose: ['a76b33d5-74ac-4866-a171-9d1dc6e125a6', '80f29049-bc80-43a0-988c-87ff34463520'],
      /* Wrapper id dropped: in split-section mode it is replicated onto every
         below-fold section, so hiding Proven would hide the rest with it. */
      proven: ['588021af-101d-45e5-a4d3-ad0750d59ea1'],
      faq: ['ae18e143-f607-4fc0-acea-287fb1b00428', 'a622ebf6-e1a2-423d-bddb-d974d62245f3'],
      how_to: ['c633906d-a056-4191-9135-c1a2eb926003', '8581824b-8564-499b-abcd-e420b1b58a79'],
      find_fit: ['41f137fc-253e-4194-b150-bbb1d99546ae', 'd3134f3c-c3c8-4f38-8b27-cd3351d4236d'],
      related: [],
      policies: ['fbd586ad-fab9-41b7-a58d-9983a8fa0828', 'd04fcf9b-865f-4c94-89f4-46775a7fccbf']
    };

    // All mapped IDs — used so shell climb never hides a parent that also owns another section
    var allIds = [];
    Object.keys(map).forEach(function (k) {
      map[k].forEach(function (id) { allIds.push(id); });
    });

    function ownsOtherSection(parent, keepEl) {
      if (!parent) return false;
      for (var i = 0; i < allIds.length; i++) {
        var other = parent.querySelector('[data-hc-pdp-id="' + allIds[i] + '"]');
        if (!other) continue;
        if (other === keepEl) continue;
        if (keepEl.contains(other)) continue;
        if (other.contains(keepEl)) continue;
        return true;
      }
      if (parent.querySelector('[data-hc-pdp-ugc], [data-hc-pdp-trust], [data-hc-pdp-htw], [data-hc-pdp-gallery], [data-hc-pdp-product-container]')) {
        // shared ancestor with extras / buy box
        var extras = parent.querySelector('[data-hc-pdp-ugc], [data-hc-pdp-trust], [data-hc-pdp-htw], [data-hc-pdp-gallery], [data-hc-pdp-product-container]');
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
        el.removeAttribute('data-hc-pdp-section-hidden');
        el.style.removeProperty('display');
      } else {
        el.setAttribute('data-hc-pdp-section-hidden', 'true');
        el.style.setProperty('display', 'none', 'important');
      }
    }

    Object.keys(map).forEach(function (key) {
      if (vis[key] !== true && vis[key] !== false) return;
      var show = !!vis[key];
      map[key].forEach(function (id) {
        var el = root.querySelector('[data-hc-pdp-id="' + id + '"]');
        setHidden(el, show);
        if (!show) setHidden(sectionShell(el), false);
        else {
          var shell = sectionShell(el);
          if (shell && shell !== el) setHidden(shell, true);
        }
      });
      if (key === 'real_talk') {
        setHidden(root.querySelector('[data-hc-pdp-realtalk]'), show);
        setHidden(root.querySelector('[data-hc-pdp-rt-videos]'), show);
        qsa(root, '[id*="Rhsetb2"], .hc-pdp-r-gvz8lp[data-hc-pdp-carousel]').forEach(function (el) {
          setHidden(el, show);
        });
      }
      if (key === 'related') {
        qsa(root, '[id*="Rdkj2"]').forEach(function (carousel) {
          setHidden(carousel, show);
          if (!show) setHidden(sectionShell(carousel), false);
        });
        qsa(root, '.hc-pdp-carousel--related-scroll').forEach(function (el) {
          setHidden(el, show);
        });
      }
    });

    [
      ['ugc_slider', '[data-hc-pdp-ugc]'],
      ['trust_bar', '[data-hc-pdp-id="1eee178e-51ad-4d05-bdc0-23dbdcb90131"], [data-hc-pdp-trust-scroller]'],
      ['howto_wear', '[data-hc-pdp-id="e387518a-87c9-49d7-a30b-b3ba03e8bca4"]']
    ].forEach(function (pair) {
      if (vis[pair[0]] !== true && vis[pair[0]] !== false) return;
      qsa(root, pair[1]).forEach(function (el) {
        setHidden(el, !!vis[pair[0]]);
      });
    });
  }

  function mountTrustScroller(root) {
    /* Only the buy-box copy gets slotted in where the Replo marquee sat. The
       standalone PDP Trust Bar section already owns its place in the section
       order — moving it would drag the whole bar back up into the buy box. */
    var scroller = null;
    qsa(root, '[data-hc-pdp-trust-scroller]').forEach(function (el) {
      if (scroller || el.closest('[data-pdp-sec="trust"]')) return;
      scroller = el;
    });
    if (!scroller) return;
    var replo =
      root.querySelector('[data-hc-pdp-id="1eee178e-51ad-4d05-bdc0-23dbdcb90131"]') ||
      root.querySelector('[data-hc-pdp-marquee-root="true"]');
    if (replo && replo.parentNode) {
      replo.style.setProperty('display', 'none', 'important');
      if (scroller.parentNode !== replo.parentNode || scroller.previousElementSibling !== replo) {
        replo.parentNode.insertBefore(scroller, replo);
      }
    }
    scroller.style.setProperty('display', 'block', 'important');
    scroller.style.setProperty('width', '100%', 'important');
  }

  function applyContentOverrides(root) {
    var o = (window.hcPdp && window.hcPdp.contentOverrides) || {};

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
        if (el.closest('button, a[href], [data-hc-pdp-collapsible] [role="button"]') && !matcher.test('x')) {
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
      var candidates = scope.querySelectorAll('.hc-pdp-rte > span, .hc-pdp-rte span');
      if (!candidates.length) candidates = scope.querySelectorAll('.hc-pdp-rte, p');
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
      var panel = item.querySelector('.hc-pdp-animated, .replo-animated');
      if (!panel) return false;
      // Content-only: update existing Replo RTE host. No style / markup rebuild.
      var span =
        panel.querySelector('.hc-pdp-rte > span') ||
        panel.querySelector('.hc-pdp-rte span') ||
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
      var target = btn.querySelector('.hc-pdp-rte > span p, .hc-pdp-rte p, p, .hc-pdp-rte span, span, .hc-pdp-rte') || btn;
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
          a.querySelector('p, span, .hc-pdp-rte') ||
          a;
        if (labelEl === a) a.textContent = label;
        else labelEl.textContent = label;
      }
    }

    // Direct-by-id setters for content that isn't unique enough to find by
    // regex/text matching (short repeated labels like point titles).
    function setTextById(id, value) {
      if (!filled(value)) return;
      var el = root.querySelector('[data-hc-pdp-id="' + id + '"]');
      if (!el) return;
      // Target the RTE span itself (not the first <p>) so titles that render
      // as 2 stacked <p> lines (e.g. "Personalized" / "Fit Help") get fully
      // replaced by one plain-text value instead of leaving a stale 2nd line.
      var target = el.querySelector('.hc-pdp-rte > span') || el.querySelector('.hc-pdp-rte') || el;
      if (sameText(target.textContent, value)) return;
      target.textContent = value;
    }

    function setRichById(id, value) {
      if (!filled(value)) return;
      var el = root.querySelector('[data-hc-pdp-id="' + id + '"]');
      if (!el) return;
      setRichIn(el, value, 0);
    }

    // Same as above but updates every matching element — some strips (trust
    // bar) render the same id twice for a seamless marquee scroll loop.
    function setTextByIdAll(id, value) {
      if (!filled(value)) return;
      qsa(root, '[data-hc-pdp-id="' + id + '"]').forEach(function (el) {
        var target = el.querySelector('.hc-pdp-rte > span') || el.querySelector('.hc-pdp-rte') || el;
        if (sameText(target.textContent, value)) return;
        target.textContent = value;
      });
    }

    function setImageByIdAll(id, url) {
      if (!filled(url)) return;
      qsa(root, '[data-hc-pdp-id="' + id + '"]').forEach(function (picture) {
        setImageIn(picture, url);
      });
    }

    // —— Why ——
    // Triangle design: title/body/points/image come from product metafields.
    // Why block is visibility-only (no contentOverrides to apply).
    if (o.why && !o.why.metafieldDriven) {
      var why =
        root.querySelector('[data-hc-pdp-id="8424e330-4b64-44e3-b665-0479b5030287"]') ||
        root.querySelector('[data-hc-pdp-id="5f3410af-202f-4c0e-8d53-c1a33e14f225"]');
      if (why) {
        if (filled(o.why.eyebrow)) setFirstMatchingText(why, /^Why$/i, o.why.eyebrow);
        if (filled(o.why.heading)) {
          setFirstMatchingText(why, /Teardrop|Breast Form|Mastectomy|Triangle|Inserts/i, o.why.heading);
        }
        if (filled(o.why.body)) setRichIn(why, o.why.body, 30);
      }
    }

    // —— Purpose (text from blocks; image stays on metafield benefit_section_image) ——
    if (o.purpose) {
      var purpose =
        root.querySelector('[data-hc-pdp-id="80f29049-bc80-43a0-988c-87ff34463520"]') ||
        root.querySelector('[data-hc-pdp-id="a76b33d5-74ac-4866-a171-9d1dc6e125a6"]');
      if (purpose) {
        // 4 stacked heading lines: Our / Purpose: / Raising / the Bar
        setTextById('22e38203-13cf-4478-923d-f28e7fa268f0', o.purpose.headingLine1);
        setTextById('7117d9a2-9f5c-4006-8507-e0f760cee5e2', o.purpose.headingLine2);
        setTextById('1572a98c-2c1a-4d30-aa3b-4a68a061976e', o.purpose.headingLine3);
        setTextById('03e7b238-a09a-4d08-a68e-0729e4b4c06c', o.purpose.headingLine4);
        if (
          !filled(o.purpose.headingLine1) &&
          !filled(o.purpose.headingLine2) &&
          filled(o.purpose.heading)
        ) {
          setFirstMatchingText(purpose, /Purpose|Raising|Our/i, o.purpose.heading);
        }
        if (filled(o.purpose.body)) setRichIn(purpose, o.purpose.body, 30);
      }
      setTextById('fe9e6b1d-bfd5-40f6-af26-0f19c542c104', o.purpose.point1Title);
      setRichById('6b7f885e-ffce-4368-b1b1-b5f395d3d205', o.purpose.point1Body);
      setTextById('29b46e1b-bc24-46c7-bb4f-faf36f2b1878', o.purpose.point2Title);
      setRichById('d8240b34-3df7-4d98-abcb-9caffe7b7c6f', o.purpose.point2Body);
      setTextById('6b15ae21-0c16-48b1-abcc-d42767c8439c', o.purpose.point3Title);
      setRichById('f257dce6-9de2-417b-97af-56a9079bfcff', o.purpose.point3Body);
      setTextById('8c4647c9-b5a6-470e-8a73-a8530dc2c9ee', o.purpose.point4Title);
      setRichById('c7b34268-cbdf-48b1-8814-c90c3cce7a34', o.purpose.point4Body);
    }

    // —— Proven ——
    if (o.proven) {
      var proven = root.querySelector('[data-hc-pdp-id="588021af-101d-45e5-a4d3-ad0750d59ea1"]');
      if (proven) {
        if (filled(o.proven.eyebrow)) {
          setFirstMatchingText(proven, /Trusted|Loved by|67,?000/i, o.proven.eyebrow);
        }
        if (filled(o.proven.heading)) {
          /* The headline is its own element now that it is text rather than
             artwork. Target it directly: the eyebrow above it also matches
             /Loved by/ and comes first in the DOM, so the regex fallback would
             overwrite the eyebrow and leave the headline untouched. */
          var provenHeading = proven.querySelector('.hc-pdp-proven-heading h2');
          // innerHTML, not textContent: the setting carries <strong> to mark
          // which words render in Poppins against the script face
          if (provenHeading) provenHeading.innerHTML = o.proven.heading;
          else setFirstMatchingText(proven, /Proven to|Loved by|Perform/i, o.proven.heading);
        }
        if (filled(o.proven.body)) setRichIn(proven, o.proven.body, 20);
        // No image override here on purpose: the first image in this scope is the
        // carousel's prev/next arrow icon, not a content photo — setting it would
        // replace the arrow with the uploaded photo and break the carousel.
      }
    }

    // —— How to / Product description accordion ——
    if (o.how_to) {
      var howRoot = root.querySelector('[data-hc-pdp-id="c633906d-a056-4191-9135-c1a2eb926003"]');
      if (howRoot) {
        var descItem = howRoot.querySelector('[data-hc-pdp-id="8581824b-8564-499b-abcd-e420b1b58a79"]');
        var howItem = howRoot.querySelector('[data-hc-pdp-id="b7b1ba33-7982-48f2-aec5-79f794acd118"]');
        var fabricItem = howRoot.querySelector('[data-hc-pdp-id="2e093e4c-751b-43d1-83ad-dcc529796d1e"]');

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
      var fit = root.querySelector('[data-hc-pdp-id="41f137fc-253e-4194-b150-bbb1d99546ae"]');
      if (fit) {
        // 5 stacked heading lines: Find Your / Dream / Inserts / in / 30 Seconds
        setTextById('d3134f3c-c3c8-4f38-8b27-cd3351d4236d', o.find_fit.headingLine1);
        setTextById('41cbe3f7-81e1-4fc5-96e1-42a404073146', o.find_fit.headingLine2);
        setTextById('afd03cd7-f9a9-4e43-b033-fbf4fed2a6cb', o.find_fit.headingLine3);
        setTextById('307282ac-81d5-43f1-af3b-0a69d210a373', o.find_fit.headingLine4);
        setTextById('9493bf0b-e740-4849-aa0e-8890008f6322', o.find_fit.headingLine5);
        if (
          !filled(o.find_fit.headingLine1) &&
          !filled(o.find_fit.headingLine2) &&
          filled(o.find_fit.heading)
        ) {
          setFirstMatchingText(fit, /Find Your|Dream|30 Seconds|Inserts/i, o.find_fit.heading);
        }
        if (filled(o.find_fit.body)) setRichIn(fit, o.find_fit.body, 20);
        if (filled(o.find_fit.image)) setImageIn(fit, o.find_fit.image);
        setLink(fit, o.find_fit.buttonLink, o.find_fit.buttonLabel);
      }
    }

    // —— You May Also Like ——
    if (o.related) {
      var relatedHead = root.querySelector('[data-hc-pdp-id="815e8679-0293-491e-a210-4b633e3e2067"]');
      if (relatedHead) {
        if (filled(o.related.headingImage)) setImageIn(relatedHead, o.related.headingImage);
        if (filled(o.related.heading)) {
          // Text headline now, not artwork — see the Proven note above
          var relatedHeading = relatedHead.querySelector('.hc-pdp-related-heading h2');
          if (relatedHeading) relatedHeading.innerHTML = o.related.heading;
          else setFirstMatchingText(relatedHead, /You May|Also Like/i, o.related.heading);
        }
        if (filled(o.related.body)) setRichIn(relatedHead, o.related.body, 10);
      }
    }

    // —— Policies / Trust ——
    // Real layout: a small "Hassle-Free" banner sits outside the 3-card
    // section, and the card section has 3 cards (not 2) — target every
    // piece by its own id instead of guessing positions/regex matches.
    if (o.policies) {
      function setTwoLineTitleById(id, line1, line2, legacy) {
        if (!filled(line1) && !filled(line2) && !filled(legacy)) return;
        var el = root.querySelector('[data-hc-pdp-id="' + id + '"]');
        if (!el) return;
        var span =
          el.querySelector('.hc-pdp-rte > span') ||
          el.querySelector('.hc-pdp-rte span') ||
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
      setTextById('bca6c03e-6482-49da-b08c-2b8c283591a5', o.policies.headingLine1);
      setTextById('43512ec0-fd1e-44c1-8518-fe8a3aa1addf', o.policies.headingLine2);
      setTextById('a4cb6b4d-4bda-4c77-945d-b78abe430645', o.policies.headingLine3);
      setTextById('8e5b9d15-ae75-4991-9a18-cfbf26d2d72a', o.policies.headingLine4);
      if (
        !filled(o.policies.headingLine1) &&
        !filled(o.policies.headingLine2) &&
        filled(o.policies.heading)
      ) {
        var policiesWrap = root.querySelector('[data-hc-pdp-id="63b3444f-4847-445f-adc1-ff9a7043e004"]');
        if (policiesWrap) setFirstMatchingText(policiesWrap, /Try|Peace of Mind/i, o.policies.heading);
      }

      setTextById('209d1417-b567-4a68-871f-c19e25242de2', o.policies.hassleLabel);

      setTwoLineTitleById(
        '73cc8030-2119-412a-b814-49c0701a5d0f',
        o.policies.card1TitleLine1,
        o.policies.card1TitleLine2,
        o.policies.card1Title
      );
      setRichById('d43a0d91-73fa-4620-ba75-e9fe429c4581', o.policies.card1Body);
      if (filled(o.policies.card1Image)) {
        setImageIn(root, o.policies.card1Image, '[data-hc-pdp-id="82ef31da-2bf9-4be2-bea2-464b505a0cc5"] img');
      }

      setTextById('06fda975-b433-4433-9c1c-d433095dc138', o.policies.card2Title);
      setRichById('e6da6126-42d5-4179-ac29-55fed302e244', o.policies.card2Body);
      if (filled(o.policies.card2Image)) {
        setImageIn(root, o.policies.card2Image, '[data-hc-pdp-id="c97b016d-68be-4b97-9302-27e945b15c19"] img');
      }

      setTwoLineTitleById(
        '738c6792-abd0-4e03-ada7-c11d5060a27b',
        o.policies.card3TitleLine1,
        o.policies.card3TitleLine2,
        o.policies.card3Title
      );
      setRichById('8882ae55-3346-4117-b5d7-468b105d6866', o.policies.card3Body);
      if (filled(o.policies.card3Image)) {
        setImageIn(root, o.policies.card3Image, '[data-hc-pdp-id="bd4a3466-b898-447b-9ecb-da057cc39f10"] img');
      }
    }

    // —— Trust bar ——
    // Homepage-scroller design is rendered in Liquid (data-hc-pdp-trust-scroller).
    // Skip legacy Replo marquee id-patching when that scroller is present.
    if (o.trustBar && !o.trustBar.useScroller && !root.querySelector('[data-hc-pdp-trust-scroller]')) {
      var trustPairs = [
        ['cddbaf2f-3d6d-41a3-8134-d0434703fa7c', 'd1b3285c-da49-4dc9-909b-4a1b5e1e1e34', o.trustBar.item1Label, o.trustBar.item1Image],
        ['7e1ad6d5-c05b-4ced-aed9-6e31d2aa20e3', '089451a0-249b-4577-9f04-a1be56963ba9', o.trustBar.item2Label, o.trustBar.item2Image],
        ['419650a1-4629-472f-9624-b74b31e0cbcb', 'd430a977-7130-4d69-86e2-b68f1f3335c0', o.trustBar.item3Label, o.trustBar.item3Image],
        ['9fadff7f-5ce6-4463-8fb2-38d5825a3862', '10e8aa17-82b3-4442-b4af-3aca19a5aaf7', o.trustBar.item4Label, o.trustBar.item4Image],
        ['4865f83d-db7b-465c-96b5-ef5354d1c167', '9e9813d7-3bb6-403e-83d1-8700f401074e', o.trustBar.item5Label, o.trustBar.item5Image]
      ];
      trustPairs.forEach(function (pair) {
        setTextByIdAll(pair[0], pair[2]);
        setImageByIdAll(pair[1], pair[3]);
      });
    }

    // —— How to Wear (subtext from block; steps stay on product metafields) ——
    if (o.howtoWear) {
      setTextById('58a519af-f19e-4778-a072-6936970bebbb', o.howtoWear.subtext);
    }

    // —— FAQ heading + items ——
    var faqRoot = root.querySelector('[data-hc-pdp-id="ae18e143-f607-4fc0-acea-287fb1b00428"]');
    if (faqRoot) {
      if (filled(o.faqHeading)) setFirstMatchingText(faqRoot, /^Frequently$/i, o.faqHeading);
      if (filled(o.faqHeadingSecondary)) {
        setFirstMatchingText(faqRoot, /Asked Questions/i, o.faqHeadingSecondary);
      }
      if (o.faqItems && o.faqItems.length) {
        var items = qsa(faqRoot, '[data-hc-pdp-collapsible]');
        o.faqItems.forEach(function (faq, idx) {
          var item = items[idx];
          if (!item || !faq) return;
          // Eye-closed FAQ block → hide that row only (index-aligned with block order)
          if (faq.enabled === false) {
            item.setAttribute('data-hc-pdp-section-hidden', 'true');
            return;
          }
          if (filled(faq.question) || filled(faq.answer)) {
            item.setAttribute('data-hc-pdp-section-hidden', 'false');
          }
          if (filled(faq.question)) setCollapsibleTitle(item, faq.question);
          if (filled(faq.answer)) setCollapsibleBody(item, faq.answer);
        });
      }
    }

    // —— Proven quotes (carousel slides by block order) ——
    if (o.provenQuotes && o.provenQuotes.length) {
      var provenRoot =
        root.querySelector('[data-hc-pdp-id="588021af-101d-45e5-a4d3-ad0750d59ea1"]') ||
        root.querySelector('[data-hc-pdp-proven-section]');
      if (provenRoot) {
        var pSlides = qsa(provenRoot, '[data-hc-pdp-part="slide"]').filter(function (s) {
          return s.getAttribute('data-is-cloned') !== 'true';
        });
        if (!pSlides.length) pSlides = qsa(provenRoot, '[data-hc-pdp-part="slide"]');
        o.provenQuotes.forEach(function (pq, idx) {
          var slide = pSlides[idx];
          if (!slide || !pq) return;
          if (pq.enabled === false) {
            slide.style.setProperty('display', 'none', 'important');
            return;
          }
          slide.style.removeProperty('display');
          var paras = qsa(slide, 'p, .hc-pdp-rte span').filter(function (el) {
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

    // Real Talk slides come from Liquid (hc-pdp-realtalk-videos) — no slot-index patching.
  }

  // Real Talk carousel — click-to-play. Only for legacy Replo track (not block-driven).
  function wireRealTalkCarousel(root) {
    if (root.querySelector('[data-hc-pdp-rt-videos]:not([hidden])')) return;
    var rtHost =
      root.querySelector('[data-hc-pdp-realtalk]') ||
      root.querySelector('[data-hc-pdp-id="de309f63-85ad-4c6d-ae9f-1c0e4182d41b"]');
    if (!rtHost || rtHost.getAttribute('data-hc-pdp-rt-wired') === '1') return;
    rtHost.setAttribute('data-hc-pdp-rt-wired', '1');

    function setPlaying(slide, on) {
      var playBtn = slide.querySelector('[aria-label="Play"]');
      var wrap = playBtn && playBtn.closest('[role="button"]');
      var target = wrap || playBtn;
      if (target) {
        target.style.opacity = on ? '0' : '1';
        target.style.pointerEvents = on ? 'none' : 'auto';
      }
    }

    function loadVideo(slide, video) {
      if (video.querySelector('source')) return video;
      var tplId = slide.getAttribute('data-hc-pdp-rt-video-tpl');
      var url = slide.getAttribute('data-hc-pdp-rt-video-url');
      if (tplId) {
        var tpl = document.getElementById(tplId);
        var freshVideo = tpl && tpl.content && tpl.content.querySelector('video');
        if (freshVideo) {
          var fresh = freshVideo.cloneNode(true);
          fresh.style.cssText = video.style.cssText;
          var poster = video.getAttribute('poster');
          if (poster && !fresh.getAttribute('poster')) fresh.setAttribute('poster', poster);
          video.replaceWith(fresh);
          return fresh;
        }
      } else if (url) {
        var source = document.createElement('source');
        source.src = url;
        source.type = 'video/mp4';
        video.appendChild(source);
        try {
          video.load();
        } catch (e) {}
        return video;
      }
      return null;
    }

    function playSlide(slide) {
      var video = slide.querySelector('video');
      if (!video) return;
      video = loadVideo(slide, video);
      if (!video) return;
      qsa(rtHost, 'video').forEach(function (v) {
        if (v !== video && !v.paused) v.pause();
      });
      video.setAttribute('playsinline', '');
      video.muted = false;
      var p = video.play();
      if (p && p.then) {
        p.then(function () {
          setPlaying(slide, true);
        }).catch(function () {
          video.muted = true;
          video.play().then(function () {
            setPlaying(slide, true);
          }).catch(function () {});
        });
      } else {
        setPlaying(slide, true);
      }
      video.addEventListener('pause', function () {
        setPlaying(slide, false);
      });
      video.addEventListener('ended', function () {
        setPlaying(slide, false);
      });
    }

    rtHost.addEventListener('click', function (e) {
      var slide = e.target.closest('[data-hc-pdp-part="slide"]');
      if (!slide) return;
      if (e.target.closest('[aria-label="Play"]')) {
        e.preventDefault();
        playSlide(slide);
        return;
      }
      if (e.target.closest('[aria-label="Mute"]')) {
        var video = slide.querySelector('video');
        if (video) {
          e.preventDefault();
          video.muted = !video.muted;
        }
      }
    });
  }

  function hideChunkWhenBlocks(root) {
    if (!(window.hcPdp && window.hcPdp.useBlocks)) return;
    var blocks = root.querySelector('[data-hc-pdp-blocks]');
    var start =
      root.querySelector('[data-hc-pdp-realtalk]') ||
      root.querySelector('[data-hc-pdp-id="de309f63-85ad-4c6d-ae9f-1c0e4182d41b"]') ||
      root.querySelector('[data-hc-pdp-id="5f3410af-202f-4c0e-8d53-c1a33e14f225"]');
    if (!start) return;

    // Hide start + following siblings until editable blocks container
    var node = start;
    while (node) {
      if (node === blocks) break;
      if (node.getAttribute && node.getAttribute('data-hc-pdp-blocks') != null) break;
      node.setAttribute('data-hc-pdp-section-hidden', 'true');
      node.style.setProperty('display', 'none', 'important');
      node = node.nextElementSibling;
    }

    // Also hide any leftover large chunk wrappers that still contain known headings
    // but sit outside the sibling walk (nested trees)
    qsa(root, '[data-hc-pdp-id]').forEach(function (el) {
      if (el.closest('[data-hc-pdp-blocks]')) return;
      if (el.closest('[data-hc-pdp-gallery]')) return;
      if (el.closest('[data-hc-pdp-product-container]')) return;
      var id = el.getAttribute('data-hc-pdp-id');
      var hideIds = {
        'de309f63-85ad-4c6d-ae9f-1c0e4182d41b': 1,
        '5f3410af-202f-4c0e-8d53-c1a33e14f225': 1,
        'a76b33d5-74ac-4866-a171-9d1dc6e125a6': 1,
        '588021af-101d-45e5-a4d3-ad0750d59ea1': 1,
        'ae18e143-f607-4fc0-acea-287fb1b00428': 1
      };
      if (hideIds[id]) {
        el.setAttribute('data-hc-pdp-section-hidden', 'true');
        el.style.setProperty('display', 'none', 'important');
      }
    });
  }

  function placeExtraBlocks(root) {
    var wrap = root.querySelector('[data-hc-pdp-extra-blocks]');
    if (!wrap) return;
    var ugc = wrap.querySelector('[data-hc-pdp-ugc]');
    var trust = wrap.querySelector('[data-hc-pdp-trust]');
    var htw = wrap.querySelector('[data-hc-pdp-htw]');
    var realtalk = root.querySelector('[data-hc-pdp-realtalk], [data-hc-pdp-id="de309f63-85ad-4c6d-ae9f-1c0e4182d41b"]');
    var why = root.querySelector('[data-hc-pdp-why-section], [data-hc-pdp-id="5f3410af-202f-4c0e-8d53-c1a33e14f225"]');

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
      root.querySelector('[data-hc-pdp-id="c633906d-a056-4191-9135-c1a2eb926003"]')
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
      if (el.getAttribute('data-hc-pdp-section-hidden') === 'true') return;
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
    qsa(root, '[data-hc-pdp-ugc]').forEach(function (box) {
      if (box.getAttribute('data-hc-pdp-ready') === '1') return;
      box.setAttribute('data-hc-pdp-ready', '1');
      var track = box.querySelector('[data-hc-pdp-ugc-track]');
      if (!track) return;
      var prev = box.querySelector('[data-hc-pdp-ugc-prev]');
      var next = box.querySelector('[data-hc-pdp-ugc-next]');
      function step(dir) {
        var slide = track.querySelector('[data-hc-pdp-ugc-slide]');
        var amount = slide ? slide.getBoundingClientRect().width + 14 : 280;
        track.scrollBy({ left: dir * amount, behavior: 'smooth' });
      }
      if (prev) prev.addEventListener('click', function () { step(-1); });
      if (next) next.addEventListener('click', function () { step(1); });
      qsa(box, '[data-hc-pdp-ugc-play]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var slide = btn.closest('[data-hc-pdp-ugc-slide]');
          var video = slide && slide.querySelector('video');
          if (!video) return;
          if (video.paused) {
            qsa(root, '[data-hc-pdp-ugc] video').forEach(function (v) {
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

  function boot() {
    /* Split-section mode wins: pdp-buybox still renders its own #hc-pdp-fullpage
       wrapper, so getElementById() would scope every step to the buy box alone
       and leave Proven / Related / FAQ / Policies with zero JS (dead arrows,
       dead hovers, dead Shop Now clicks). */
    var root = splitRoot() || document.getElementById(ROOT);
    if (!root) return;
    root.classList.add('hc-pdp-fullpage--ready');

    /* Run each step in isolation. These used to be plain calls, which meant one
       throw took out everything after it — a single failure upstream silently
       killed the Real Talk and Proven carousel arrows. */
    function step(name, fn) {
      try {
        fn(root);
      } catch (e) {
        if (window.console && console.warn) console.warn('[hc-pdp] ' + name + ' failed:', e);
      }
    }

    step('placeExtraBlocks', placeExtraBlocks);
    step('mountTrustScroller', mountTrustScroller);
    step('mountCustomGallery', mountCustomGallery);
    step('hideChunkWhenBlocks', hideChunkWhenBlocks);
    step('applySectionVisibility', applySectionVisibility);
    step('applyContentOverrides', applyContentOverrides);
    step('initUgcSlider', initUgcSlider);
    step('initRealTalk', initRealTalk);
    step('initCollapsibles', initCollapsibles);
    step('initSizePopup', initSizePopup);
    step('initCarousels', initCarousels);
    step('wireRealTalkCarousel', wireRealTalkCarousel);
    // Related first so product-page links win over page Shop Now scroll
    step('initRelatedProductLinks', initRelatedProductLinks);
    step('initShopNow', initShopNow);
    step('initBlackButtonHovers', initBlackButtonHovers);
    step('initVariants', initVariants);
    step('initAtc', initAtc);
  }

  ready(function () {
    boot();
    setTimeout(boot, 400);
    document.addEventListener('shopify:section:load', function (e) {
      if (e && e.target && e.target.querySelector && e.target.querySelector('#hc-pdp-fullpage, [data-hc-pdp-pdp]')) {
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
