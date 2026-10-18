(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var content = document.querySelector('.blog__content');
    var nav = document.getElementById('toc-nav');
    var sidebar = document.getElementById('toc-container');

    if (!content || !nav) return;

    var headings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'));

    if (headings.length === 0) {
      if (sidebar) sidebar.style.display = 'none';
      return;
    }

    // Auto-assign IDs to headings that don't have one
    var slugCount = {};
    headings.forEach(function (h) {
      if (!h.id) {
        var slug = h.textContent.trim().toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        slugCount[slug] = (slugCount[slug] || 0) + 1;
        h.id = slugCount[slug] > 1 ? slug + '-' + slugCount[slug] : slug;
      }
    });

    // Build TOC links
    var fragment = document.createDocumentFragment();
    headings.forEach(function (h) {
      if (!h.id || !h.textContent.trim()) return;
      var level = parseInt(h.tagName.charAt(1), 10);
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      a.dataset.level = level;
      a.dataset.id = h.id;
      fragment.appendChild(a);
    });
    nav.appendChild(fragment);

    // Smooth scroll on click
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link || !link.dataset.id) return;
      e.preventDefault();
      var target = document.getElementById(link.dataset.id);
      if (target) {
        var offset = 96; // adjust to match your sticky header height
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });

    // Highlight active section on scroll
    var allLinks = Array.from(nav.querySelectorAll('a'));
    function onScroll() {
      var scrollY = window.scrollY;
      var offset = 120;
      var current = null;
      headings.forEach(function (h) {
        if (h.getBoundingClientRect().top + window.scrollY - offset <= scrollY) {
          current = h.id;
        }
      });
      allLinks.forEach(function (a) {
        a.classList.toggle('toc-active', a.dataset.id === current);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
})();
