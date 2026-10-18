if (!customElements.get('media-gallery')) {
  customElements.define('media-gallery', class MediaGallery extends HTMLElement {
    constructor() {
      super();

      this.elements = {
        liveRegion: this.querySelector('[id^="GalleryStatus"]'),
        viewer: this.querySelector('[id^="GalleryViewer"]'),
        thumbnails: this.querySelector('[id^="GalleryThumbnails"]')
      }
      this.mql = window.matchMedia('(min-width: 750px)');
      if (!this.elements.thumbnails) return;

      this.elements.viewer.addEventListener('slideChanged', (event) => {
        clearTimeout(this.slideChangedTimeout);
        this.slideChangedTimeout = setTimeout(() => this.onSlideChanged(event), 500);
      });
      this.elements.thumbnails.querySelectorAll('[data-target]').forEach((mediaToSwitch) => {
        mediaToSwitch.querySelector('button').addEventListener('click', this.setActiveMedia.bind(this, mediaToSwitch.dataset.target, false, true));
      });
      if (this.dataset.desktopLayout === 'thumbnail_slider' && this.mql.matches) this.removeListSemantic();
    }

    onSlideChanged(event) {
      if (event.detail.currentElement == undefined) return;

      const thumbnail = this.elements.thumbnails.querySelector(`[data-target="${ event.detail.currentElement.dataset.mediaId }"]`);
      this.setActiveThumbnail(thumbnail);
    }

    setActiveMedia(mediaId, prepend, scrollIntoView = true, event) {
      const activeMedia = this.elements.viewer.querySelector(`[data-media-id="${ mediaId }"]`);
      if (!activeMedia) return;
      this.cancelThumbnailReveal?.();
      // Arrow controls also dispatch synthetic thumbnail clicks. Keep their
      // existing deferred scrolling; only direct user selection jumps instantly.
      const instantThumbnail = event?.type === 'click' && event.isTrusted && !this.mql.matches;
      clearTimeout(this.mediaScrollTimeout);
      if (instantThumbnail) {
        clearTimeout(this.slideChangedTimeout);
        activeMedia.classList.add('mobile-thumbnail-selected');
        const image = activeMedia.querySelector('.product__modal-opener--image img');
        if (image) image.loading = 'eager';
      }
      this.elements.viewer.querySelectorAll('[data-media-id]').forEach((element) => {
        element.classList.remove('is-active');
      });
      activeMedia.classList.add('is-active');

      if (prepend) {
        activeMedia.parentElement.prepend(activeMedia);
        if (this.elements.thumbnails) {
          const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${ mediaId }"]`);
          activeThumbnail.parentElement.prepend(activeThumbnail);
        }
        if (this.elements.viewer.slider) this.elements.viewer.resetPages();
      }

      this.preventStickyHeader();
      const scrollToMedia = () => {
        if (this.elements.thumbnails) {
          if (instantThumbnail) {
            // Explicitly override smooth scrolling for direct mobile selection.
            const slider = activeMedia.parentElement;
            const previousBehavior = slider.style.scrollBehavior;
            slider.style.scrollBehavior = 'auto';
            slider.scrollTo({ left: activeMedia.offsetLeft, behavior: 'instant' });
            slider.style.scrollBehavior = previousBehavior;
          } else {
            activeMedia.parentElement.scrollTo({ left: activeMedia.offsetLeft });
          }
        }
        if ((!this.elements.thumbnails || this.dataset.desktopLayout === 'stacked') && scrollIntoView) {
          activeMedia.scrollIntoView({behavior: 'smooth'});
        }
      };
      if (instantThumbnail) scrollToMedia();
      else this.mediaScrollTimeout = window.setTimeout(scrollToMedia);
      if (instantThumbnail) this.revealThumbnailMedia(activeMedia);
      this.playActiveMedia(activeMedia);

      if (!this.elements.thumbnails) return;
      const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${ mediaId }"]`);
      this.setActiveThumbnail(activeThumbnail);
      this.announceLiveRegion(activeMedia, activeThumbnail.dataset.mediaPosition);
    }

    revealThumbnailMedia(activeMedia) {
      const image = activeMedia.querySelector('.product__modal-opener--image img');
      const surface = image?.closest('.product__media');
      if (!surface) return;

      let animation;
      const reveal = () => {
        if (!activeMedia.classList.contains('is-active') || this.mql.matches ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        // Animate the selected surface, independently of scrolling and the
        // legacy image reveal. Cold images start only when their pixels arrive.
        animation = surface.animate([
          { opacity: 0.35, transform: 'scale(1.04)' },
          { opacity: 1, transform: 'scale(1)' }
        ], { duration: 250, easing: 'ease-out' });
      };
      this.cancelThumbnailReveal = () => {
        image.removeEventListener('load', reveal);
        animation?.cancel();
      };
      if (image.complete && image.naturalWidth) reveal();
      else image.addEventListener('load', reveal, { once: true });
    }

    setActiveThumbnail(thumbnail) {
      if (!this.elements.thumbnails || !thumbnail) return;

      this.elements.thumbnails.querySelectorAll('[id^="Slide-"]').forEach((element) => {
        element.classList.remove('is-active');
        element.querySelector('button').removeAttribute('aria-current');
      });
      thumbnail.classList.add('is-active');
      thumbnail.querySelector('button').setAttribute('aria-current', true);

      if (this.elements.thumbnails.isSlideVisible(thumbnail, 10)) return;

      this.elements.thumbnails.slider.scrollTo({ left: thumbnail.offsetLeft });
    }

    announceLiveRegion(activeItem, position) {
      const image = activeItem.querySelector('.product__modal-opener--image img');
      if (!image) return;
      image.onload = () => {
        this.elements.liveRegion.setAttribute('aria-hidden', false);
        this.elements.liveRegion.innerHTML = window.accessibilityStrings.imageAvailable.replace(
          '[index]',
          position
        );
        setTimeout(() => {
          this.elements.liveRegion.setAttribute('aria-hidden', true);
        }, 2000);
      };
      image.src = image.src;
    }

    playActiveMedia(activeItem) {
      window.pauseAllMedia();
      const deferredMedia = activeItem.querySelector('.deferred-media');
      if (deferredMedia) deferredMedia.loadContent(false);
    }

    preventStickyHeader() {
      this.stickyHeader = this.stickyHeader || document.querySelector('sticky-header');
      if (!this.stickyHeader) return;
      this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'));
    }

    removeListSemantic() {
      if (!this.elements.viewer.slider) return;
      this.elements.viewer.slider.setAttribute('role', 'presentation');
      this.elements.viewer.sliderItems.forEach(slide => slide.setAttribute('role', 'presentation'));
    }
  });
}
