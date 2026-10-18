(() => {
  const isFeatured = (el) => el?.closest?.('.featured-collection--root');

  const currentTranslatePx = (carousel, container) => {
    const raw = String(carousel.style.getPropertyValue('--slide-pos') || carousel.container_destination || '0').trim();
    if (raw.includes('%')) {
      return ((parseFloat(raw) || 0) / 100) * (container?.offsetWidth || 0);
    }
    return parseFloat(raw) || 0;
  };

  const maxShiftPxFor = (carousel) => {
    const wrapper = carousel.querySelector('.card-carousel--wrapper');
    const container = carousel.container || carousel.querySelector('.card-carousel--container');
    const last = container?.lastElementChild;
    if (!wrapper || !container || !last || !container.offsetWidth) return 0;

    const padRight = parseFloat(getComputedStyle(last).paddingRight) || 0;
    return Math.max(0, Math.round(last.offsetLeft + last.offsetWidth - padRight - wrapper.clientWidth));
  };

  const maxShiftPercentFor = (carousel) => {
    const container = carousel.container || carousel.querySelector('.card-carousel--container');
    if (!container?.offsetWidth) return 0;
    return (maxShiftPxFor(carousel) / container.offsetWidth) * 100;
  };

  const destPercent = (value, container) => {
    const dest = String(value || '0').trim();
    if (dest.includes('%')) return Math.abs(parseFloat(dest)) || 0;
    if (!container?.offsetWidth) return 0;
    return ((Math.abs(parseFloat(dest)) || 0) / container.offsetWidth) * 100;
  };

  const clampToLastCard = (carousel) => {
    if (!isFeatured(carousel)) return;
    if (carousel.loaded_size === 'small') return;

    const container = carousel.container || carousel.querySelector('.card-carousel--container');
    const maxPercent = maxShiftPercentFor(carousel);
    const singleSlide = carousel.active_slide_count === 1;

    // Single-slide rows (e.g. ≤3 related products) must stay at 0 — no end clamp.
    if (singleSlide) {
      if (carousel.is_last_slide && maxPercent > 0) {
        carousel.container_destination = '0px';
        carousel.style.setProperty('--slide-pos', '0px');
      }
      return;
    }

    if (carousel.is_last_slide && maxPercent > 0) {
      carousel.container_destination = `-${maxPercent}%`;
      carousel.style.setProperty('--slide-pos', `-${maxPercent}%`);
      return;
    }

    if (destPercent(carousel.container_destination, container) > maxPercent) {
      carousel.container_destination = `-${maxPercent}%`;
      carousel.style.setProperty('--slide-pos', `-${maxPercent}%`);
    }
  };

  const patch = () => {
    const CardCarousel = customElements.get('card-carousel');
    if (!CardCarousel || CardCarousel.prototype.__fcolEndClamp) return;
    CardCarousel.prototype.__fcolEndClamp = true;

    const origUpdate = CardCarousel.prototype.updateContainerDestination;
    CardCarousel.prototype.updateContainerDestination = function () {
      origUpdate.call(this);
      clampToLastCard(this);
    };

    const origDragBegin = CardCarousel.prototype.dragBegin;
    CardCarousel.prototype.dragBegin = function () {
      if (!isFeatured(this) || this.loaded_size === 'small') {
        origDragBegin.call(this);
        return;
      }

      const container = this.container || this.querySelector('.card-carousel--container');
      this.current_transform_pixels = currentTranslatePx(this, container);
      this.setAttribute('data-dragging', true);
      this.ticking = false;
      const maxShift = maxShiftPxFor(this);

      window.on(`mousemove.${this.section_id} touchmove.${this.section_id}`, (event) => {
        if (event.touches?.length > 1 || this.ticking || !this.slide_pause) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          if (!this.slide_pause) {
            this.ticking = false;
            return;
          }
          const pageX = event.type === 'touchmove' ? event.targetTouches[0].pageX : event.pageX;
          let next = this.current_transform_pixels - this.drag_start + pageX;
          if (next > 0) {
            this.style.setProperty('--slide-pos', `${next / 4}px`);
          } else if (next < -maxShift) {
            const extra = -next - maxShift;
            this.style.setProperty('--slide-pos', `-${maxShift + extra / 4}px`);
          } else {
            this.style.setProperty('--slide-pos', `${next}px`);
          }
          this.ticking = false;
        });
      }, { passive: true });
    };
  };

  if (customElements.get('card-carousel')) {
    patch();
  } else {
    customElements.whenDefined('card-carousel').then(patch);
  }

  document.addEventListener('shopify:section:load', (event) => {
    event.target.querySelectorAll?.('.featured-collection--root card-carousel').forEach((el) => {
      if (typeof el.updateContainerDestination === 'function') el.updateContainerDestination();
    });
  });
})();
