(() => {
  const MQ = window.matchMedia('(min-width: 768px)');
  const MIN_VISIBLE = 3;

  const getVisibleCount = (root) => {
    const section = root.closest('.main-product--root');
    if (!section) return MIN_VISIBLE;
    const n = parseInt(
      getComputedStyle(section).getPropertyValue('--desktop-thumbnail-visible-count'),
      10
    );
    return Number.isFinite(n) && n >= MIN_VISIBLE ? n : MIN_VISIBLE;
  };

  const scrollStep = (wrapper) => {
    const thumb = wrapper.querySelector('.product-media--thumb');
    if (!thumb) return 80;
    const gap = parseFloat(getComputedStyle(wrapper).gap) || 0;
    return thumb.offsetHeight + gap;
  };

  const isScrollable = (wrapper) => wrapper.scrollHeight > wrapper.clientHeight + 1;

  const getThumbHeight = (wrapper, root) => {
    const section = root.closest('.main-product--root');
    const custom = section && parseFloat(getComputedStyle(section).getPropertyValue('--desktop-thumbnail-height'));
    if (custom > 0) return custom;

    const thumb = wrapper.querySelector('.product-media--thumb');
    return thumb ? thumb.offsetHeight : 0;
  };

  const setViewportHeight = (wrapper, root) => {
    if (!MQ.matches) {
      wrapper.style.maxHeight = '';
      return;
    }

    const visible = getVisibleCount(root);
    const thumbs = wrapper.querySelectorAll('.product-media--thumb');
    if (thumbs.length <= visible) {
      wrapper.style.maxHeight = '';
      return;
    }

    const gap = parseFloat(getComputedStyle(wrapper).gap) || 0;
    const thumbH = getThumbHeight(wrapper, root);
    let height = 0;

    if (thumbH > 0) {
      height = thumbH * visible + gap * (visible - 1);
    } else {
      for (let i = 0; i < visible; i += 1) {
        height += thumbs[i].offsetHeight;
        if (i < visible - 1) height += gap;
      }
    }

    if (height > 0) {
      wrapper.style.maxHeight = `${height}px`;
    }
  };

  const update = (wrapper, prev, next) => {
    if (!MQ.matches) return;

    if (!isScrollable(wrapper)) {
      prev.setAttribute('aria-disabled', 'true');
      next.setAttribute('aria-disabled', 'true');
      return;
    }

    const max = wrapper.scrollHeight - wrapper.clientHeight;
    const top = wrapper.scrollTop;
    prev.setAttribute('aria-disabled', top <= 1 ? 'true' : 'false');
    next.setAttribute('aria-disabled', top >= max - 1 ? 'true' : 'false');
  };

  const clearDesktopStyles = (wrapper) => {
    if (wrapper) wrapper.style.maxHeight = '';
  };

  const init = (root) => {
    const wrapper = root.querySelector('.product-media--thumbs-wrapper');
    const prev = root.querySelector('.product-media--thumbs-arrow--prev');
    const next = root.querySelector('.product-media--thumbs-arrow--next');
    if (!wrapper || !prev || !next) return;

    if (!MQ.matches) {
      clearDesktopStyles(wrapper);
      return;
    }

    if (root.dataset.thumbsArrowsInit === 'true') return;
    root.dataset.thumbsArrowsInit = 'true';

    const refresh = () => {
      setViewportHeight(wrapper, root);
      update(wrapper, prev, next);
    };

    prev.addEventListener('click', () => {
      wrapper.scrollBy({ top: -scrollStep(wrapper), behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
      wrapper.scrollBy({ top: scrollStep(wrapper), behavior: 'smooth' });
    });

    wrapper.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);
    window.addEventListener('load', refresh);
    MQ.addEventListener('change', () => {
      if (!MQ.matches) {
        clearDesktopStyles(wrapper);
        return;
      }
      refresh();
    });

    wrapper.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true });
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }

    refresh();
    requestAnimationFrame(refresh);
  };

  const scan = () => {
    document
      .querySelectorAll('product-thumbs-element[data-desktop-arrows="true"]')
      .forEach((root) => {
        const wrapper = root.querySelector('.product-media--thumbs-wrapper');
        if (!MQ.matches) {
          clearDesktopStyles(wrapper);
          return;
        }
        init(root);
      });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }

  MQ.addEventListener('change', scan);
  document.addEventListener('shopify:section:load', scan);
})();
