import { Component } from '@theme/component';
import { ThemeEvents, MediaStartedPlayingEvent } from '@theme/events';
import { DialogCloseEvent } from '@theme/dialog';

/**
 * A deferred media element
 * @typedef {Object} Refs
 * @property {HTMLElement} deferredMediaPlayButton - The button to show the deferred media content
 * @property {HTMLElement} toggleMediaButton - The button to toggle the media
 *
 * @extends {Component<Refs>}
 */
class DeferredMedia extends Component {
  /** @type {boolean} */
  isPlaying = false;

  #abortController = new AbortController();
  /** @type {IntersectionObserver | null} */
  #intersectionObserver = null;
  /** @type {{x: number, y: number} | null} */
  #pointerStart = null;
  #pausedByUser = false;

  connectedCallback() {
    super.connectedCallback();
    const signal = this.#abortController.signal;
    // If we're to use deferred media for images, we will need to run this only when it's not an image type media
    document.addEventListener(ThemeEvents.mediaStartedPlaying, this.pauseMedia.bind(this), { signal });
    window.addEventListener(DialogCloseEvent.eventName, this.pauseMedia.bind(this), { signal });

    if (this.hasAttribute('data-toggle-on-click')) {
      this.addEventListener(
        'pointerdown',
        (event) => {
          this.#pointerStart = { x: event.clientX, y: event.clientY };
        },
        { signal }
      );

      this.addEventListener(
        'click',
        (event) => {
          if (!(event.target instanceof Element)) return;

          if (!this.getAttribute('data-media-loaded') && event.target.closest('[ref="deferredMediaPlayButton"]')) {
            return;
          }

          // Let explicit button handlers (e.g. toggleMediaButton on:click) run without double-toggling.
          if (event.target.closest('[ref="toggleMediaButton"]')) {
            return;
          }

          if (event.target.closest('a, button')) {
            return;
          }

          const pointerEnd = event instanceof PointerEvent ? { x: event.clientX, y: event.clientY } : null;
          if (this.#pointerStart && pointerEnd) {
            const distanceX = Math.abs(pointerEnd.x - this.#pointerStart.x);
            const distanceY = Math.abs(pointerEnd.y - this.#pointerStart.y);
            const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            if (totalDistance > 10) return;
          }

          if (!this.getAttribute('data-media-loaded')) {
            this.loadContent(false);
            this.playMedia();
            return;
          }

          this.toggleMedia();
        },
        { signal }
      );
    }

    if (this.hasAttribute('data-autoplay-in-view')) {
      this.#intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
              if (this.#pausedByUser) continue;
              if (!this.getAttribute('data-media-loaded')) {
                this.loadContent(false);
              }
              this.playMedia();
            } else {
              this.pauseMedia();
              this.#pausedByUser = false;
            }
          }
        },
        { threshold: [0.6] }
      );

      this.#intersectionObserver.observe(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#intersectionObserver?.disconnect();
    this.#intersectionObserver = null;
    this.#abortController.abort();
  }

  /**
   * Updates the visual hint for play/pause state
   * @param {boolean} isPlaying - Whether the video is currently playing
   */
  updatePlayPauseHint(isPlaying) {
    const toggleMediaButton = this.refs.toggleMediaButton;
    if (toggleMediaButton instanceof HTMLElement) {
      toggleMediaButton.classList.remove('hidden');
      const playIcon = toggleMediaButton.querySelector('.icon-play');
      if (playIcon) playIcon.classList.toggle('hidden', isPlaying);
      const pauseIcon = toggleMediaButton.querySelector('.icon-pause');
      if (pauseIcon) pauseIcon.classList.toggle('hidden', !isPlaying);
    }
  }

  /**
   * Shows the deferred media content
   */
  showDeferredMedia = () => {
    this.loadContent(true);
    this.isPlaying = true;
    this.updatePlayPauseHint(this.isPlaying);
  };

  /**
   * Loads the content
   * @param {boolean} [focus] - Whether to focus the content
   */
  loadContent(focus = true) {
    if (this.getAttribute('data-media-loaded')) return;

    this.dispatchEvent(new MediaStartedPlayingEvent(this));

    const content = this.querySelector('template')?.content.firstElementChild?.cloneNode(true);

    if (!content) return;

    this.setAttribute('data-media-loaded', 'true');
    this.appendChild(content);

    if (focus && content instanceof HTMLElement) {
      content.focus();
    }

    this.refs.deferredMediaPlayButton?.classList.add('deferred-media__playing');

    if (content instanceof HTMLVideoElement && content.getAttribute('autoplay')) {
      // force autoplay for safari
      content.play();
    }
  }

  /**
   * Toggle play/pause state of the media
   */
  toggleMedia() {
    if (this.isPlaying) {
      this.pauseMedia();
      this.#pausedByUser = true;
    } else {
      this.#pausedByUser = false;
      this.playMedia();
    }
  }

  playMedia() {
    /** @type {HTMLIFrameElement | null} */
    const iframe = this.querySelector('iframe[data-video-type]');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        iframe.dataset.videoType === 'youtube'
          ? '{"event":"command","func":"playVideo","args":""}'
          : '{"method":"play"}',
        '*'
      );
    } else {
      this.querySelector('video')?.play();
    }
    this.isPlaying = true;
    this.updatePlayPauseHint(this.isPlaying);
  }

  /**
   * Pauses the media
   */
  pauseMedia() {
    /** @type {HTMLIFrameElement | null} */
    const iframe = this.querySelector('iframe[data-video-type]');

    if (iframe) {
      iframe.contentWindow?.postMessage(
        iframe.dataset.videoType === 'youtube'
          ? '{"event":"command","func":"' + 'pauseVideo' + '","args":""}'
          : '{"method":"pause"}',
        '*'
      );
    } else {
      this.querySelector('video')?.pause();
    }
    this.isPlaying = false;

    // If we've already revealed the deferred media, we should toggle the play/pause hint
    if (this.getAttribute('data-media-loaded')) {
      this.updatePlayPauseHint(this.isPlaying);
    }
  }
}

if (!customElements.get('deferred-media')) {
  customElements.define('deferred-media', DeferredMedia);
}

/**
 * A product model
 */
class ProductModel extends DeferredMedia {
  #abortController = new AbortController();

  loadContent() {
    super.loadContent();

    Shopify.loadFeatures([
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: this.setupModelViewerUI.bind(this),
      },
    ]);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#abortController.abort();
  }

  pauseMedia() {
    super.pauseMedia();
    this.modelViewerUI?.pause();
  }

  playMedia() {
    super.playMedia();
    this.modelViewerUI?.play();
  }

  /**
   * @param {Error[]} errors
   */
  async setupModelViewerUI(errors) {
    if (errors) return;

    if (!Shopify.ModelViewerUI) {
      await this.#waitForModelViewerUI();
    }

    if (!Shopify.ModelViewerUI) return;

    const element = this.querySelector('model-viewer');
    if (!element) return;

    const signal = this.#abortController.signal;

    this.modelViewerUI = new Shopify.ModelViewerUI(element);
    if (!this.modelViewerUI) return;

    this.playMedia();

    // Track pointer events to detect taps
    let pointerStartX = 0;
    let pointerStartY = 0;

    element.addEventListener(
      'pointerdown',
      (/** @type {PointerEvent} */ event) => {
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
      },
      { signal }
    );

    element.addEventListener(
      'click',
      (/** @type {PointerEvent} */ event) => {
        const distanceX = Math.abs(event.clientX - pointerStartX);
        const distanceY = Math.abs(event.clientY - pointerStartY);
        const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Try to ensure that this is a tap, not a drag.
        if (totalDistance < 10) {
          // When the model is paused, it has its own button overlay for playing the model again.
          // If we're receiving a click event, it means the model is playing, all we can do is pause it.
          this.pauseMedia();
        }
      },
      { signal }
    );
  }

  /**
   * Waits for Shopify.ModelViewerUI to be defined.
   * This seems to be necessary for Safari since Shopify.ModelViewerUI is always undefined on the first try.
   * @returns {Promise<void>}
   */
  async #waitForModelViewerUI() {
    const maxAttempts = 10;
    const interval = 50;

    for (let i = 0; i < maxAttempts; i++) {
      if (Shopify.ModelViewerUI) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}

if (!customElements.get('product-model')) {
  customElements.define('product-model', ProductModel);
}
