/* Knowledge Base sidebar enhancement (progressive — the page works without it).
 *
 * 1. Active category: marks the sidebar item matching the current URL as active
 *    and expands it (works on category AND article pages).
 * 2. Scrollspy: as the reader scrolls a category page, highlights the sidebar
 *    link for the section (category intro or a subcategory) currently in view.
 *
 * Uses a throttled scroll listener (rAF) rather than IntersectionObserver so it
 * behaves consistently across browsers/embedded webviews. The accordion
 * open/close itself stays pure CSS (checkbox hack); this script only toggles
 * classes and the `checked` state, so nothing breaks if JS is off.
 */
(function () {
  'use strict';

  var nav = document.querySelector('.kb-sidebar__nav');
  if (!nav) return;

  var here = window.location.pathname.replace(/\/$/, '');

  // --- 1. Active category by current path -------------------------------
  nav.querySelectorAll('.kb-nav__item').forEach(function (item) {
    var link = item.querySelector(':scope > .kb-nav__link');
    if (!link) return;
    if (link.pathname.replace(/\/$/, '') === here) {
      item.classList.add('is-active');
      var toggle = item.querySelector(':scope > .kb-nav__toggle');
      if (toggle) toggle.checked = true; // expand its subcategories
    }
  });

  // --- 2. Scrollspy over the content sections ---------------------------
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('.kb-content section[id]')
  );
  if (!sections.length) return;

  var sublinks = Array.prototype.slice.call(nav.querySelectorAll('.kb-nav__sublink'));

  // section id -> the sidebar sublink pointing at it (null for the top category)
  function linkForId(id) {
    for (var i = 0; i < sublinks.length; i++) {
      var hash = decodeURIComponent((sublinks[i].hash || '').replace(/^#/, ''));
      if (hash === id) return sublinks[i];
    }
    return null;
  }

  // distance below the viewport top at which a section becomes "current" —
  // clears the theme's sticky header/announcement bar (read from the same CSS
  // vars the theme sets), so the highlight flips where anchors actually land.
  function stickyOffset() {
    var s = getComputedStyle(document.documentElement);
    var headerH = parseInt(s.getPropertyValue('--header-height'), 10) || 0;
    var headerOn = parseInt(s.getPropertyValue('--enable-sticky-header'), 10) || 0;
    var barH = parseInt(s.getPropertyValue('--announcement-bar-height'), 10) || 0;
    var barOn = parseInt(s.getPropertyValue('--enable-sticky-announcement-bar'), 10) || 0;
    return headerH * headerOn + barH * barOn + 24;
  }

  function currentSection() {
    var offset = stickyOffset();
    var best = null;
    var bestTop = -Infinity;
    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].getBoundingClientRect().top;
      if (top <= offset && top > bestTop) {
        bestTop = top;
        best = sections[i];
      }
    }
    return best; // null while the reader is above the first section
  }

  var lastId = null;

  function refresh() {
    var sec = currentSection();
    var id = sec ? sec.id : null;
    if (id === lastId) return;
    lastId = id;

    sublinks.forEach(function (l) { l.classList.remove('is-current'); });
    if (!id) return;
    var target = linkForId(id);
    if (target) target.classList.add('is-current');
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      refresh();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  refresh();
})();
