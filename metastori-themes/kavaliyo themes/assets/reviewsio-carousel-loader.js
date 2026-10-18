(function () {
  if (window.__reviewsioCarouselLoaderLoaded) {
    return;
  }

  window.__reviewsioCarouselLoaderLoaded = true;

  var WIDGET_ID = 'reviewsio-carousel-widget';
  var SCRIPT_URL = 'https://widget.reviews.io/carousel-inline-iframeless/dist.js?_t=2026022712';
  var STYLESHEETS = [
    'https://assets.reviews.io/css/widgets/carousel-widget.css?_t=2026022712',
    'https://assets.reviews.io/iconfont/reviewsio-icons/style.css?_t=2026022712'
  ];

  var loadPromise = null;

  function loadStylesheet(href) {
    if (document.querySelector('link[href="' + href + '"]')) {
      return;
    }

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    if (window.carouselInlineWidget) {
      return Promise.resolve();
    }

    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) {
      return new Promise(function (resolve, reject) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
      });
    }

    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function ensureAssets() {
    if (!loadPromise) {
      STYLESHEETS.forEach(loadStylesheet);
      loadPromise = loadScript(SCRIPT_URL);
    }

    return loadPromise;
  }

  function initCarousel(widget) {
    if (!widget || widget.dataset.reviewsioCarouselMounted === 'true') {
      return;
    }

    widget.dataset.reviewsioCarouselMounted = 'true';

    ensureAssets()
      .then(function () {
        if (!window.carouselInlineWidget) {
          widget.dataset.reviewsioCarouselMounted = 'false';
          return;
        }

        new window.carouselInlineWidget(WIDGET_ID, {
          store: 'kavalio',
          sku: '',
          lang: 'de',
          carousel_type: 'default',
          styles_carousel: 'CarouselWidget--sideHeader--withcards',
          options: {
            general: {
              review_type: 'company, product',
              min_reviews: '1',
              max_reviews: '20',
              address_format: 'CITY, COUNTRY',
              enable_auto_scroll: 10000,
              enable_pause_button: false,
              enable_sorting: false
            },
            header: {
              enable_overall_stars: true,
              rating_decimal_places: 2
            },
            reviews: {
              enable_customer_name: true,
              enable_customer_location: true,
              enable_verified_badge: true,
              enable_subscriber_badge: true,
              enable_recommends_badge: false,
              enable_photos: true,
              enable_videos: true,
              enable_review_date: true,
              disable_same_customer: true,
              min_review_percent: 4,
              third_party_source: true,
              hide_empty_reviews: true,
              enable_product_name: true,
              tags: '',
              branch: '',
              enable_branch_name: false
            },
            popups: {
              enable_review_popups: false,
              enable_helpful_buttons: false,
              enable_helpful_count: false,
              enable_share_buttons: false
            }
          },
          translations: {
            verified_customer: 'Verifizierter Kunde',
            'Be the first to write a review': 'Schreibe als Erste/r eine Bewertung zu diesem Produkt',
            'What would you rate this product?': 'Wie würdest Du dieses Produkt bewerten?'
            
          },
          styles: {
            '--base-font-size': '16px',
            '--base-maxwidth': '100%',
            '--reviewsio-logo-style': 'var(--logo-normal)',
            '--common-star-color': '#59C5B4',
            '--common-star-disabled-color': 'rgba(0,0,0,0.25)',
            '--medium-star-size': '22px',
            '--small-star-size': '19px',
            '--x-small-star-size': '16px',
            '--x-small-star-display': 'inline-flex',
            '--header-order': '1',
            '--header-width': '280px',
            '--header-bg-start-color': '#59C5B4',
            '--header-bg-end-color': '#59C5B4',
            '--header-gradient-direction': '135deg',
            '--header-padding': '1.5em',
            '--header-border-width': '0px',
            '--header-border-color': 'rgba(0,0,0,0.1)',
            '--header-border-radius': '10px',
            '--header-shadow-size': '10px',
            '--header-shadow-color': 'rgba(0, 0, 0, 0.05)',
            '--header-star-color': '#000000',
            '--header-disabled-star-color': 'inherit',
            '--header-heading-text-color': '#000000',
            '--header-heading-font-size': 'inherit',
            '--header-heading-font-weight': 'inherit',
            '--header-heading-line-height': 'inherit',
            '--header-heading-text-transform': 'inherit',
            '--header-subheading-text-color': '#000000',
            '--header-subheading-font-size': 'inherit',
            '--header-subheading-font-weight': '300',
            '--header-subheading-line-height': 'inherit',
            '--header-subheading-text-transform': 'inherit',
            '--item-maximum-columns': '5',
            '--item-background-start-color': '#ffffff',
            '--item-background-end-color': '#ffffff',
            '--item-gradient-direction': '135deg',
            '--item-padding': '1.5em',
            '--item-border-width': '0px',
            '--item-border-color': 'rgba(0,0,0,0.1)',
            '--item-border-radius': '10px',
            '--item-shadow-size': '10px',
            '--item-shadow-color': 'rgba(0,0,0,0.05)',
            '--heading-text-color': '#0E1311',
            '--heading-text-font-weight': '600',
            '--heading-text-font-family': 'inherit',
            '--heading-text-line-height': '1.4',
            '--heading-text-letter-spacing': '0',
            '--heading-text-transform': 'none',
            '--body-text-color': '#0E1311',
            '--body-text-font-weight': '400',
            '--body-text-font-family': 'inherit',
            '--body-text-line-height': '1.4',
            '--body-text-letter-spacing': '0',
            '--body-text-transform': 'none',
            '--scroll-button-icon-color': '#0E1311',
            '--scroll-button-icon-size': '24px',
            '--scroll-button-bg-color': 'transparent',
            '--scroll-button-border-width': '0px',
            '--scroll-button-border-color': 'rgba(0,0,0,0.1)',
            '--scroll-button-border-radius': '16px',
            '--scroll-button-shadow-size': '0px',
            '--scroll-button-shadow-color': 'rgba(0,0,0,0.1)',
            '--scroll-button-horizontal-position': '3px',
            '--scroll-button-vertical-position': '0px',
            '--badge-icon-color': '#59C5B4',
            '--badge-icon-font-size': '15px',
            '--badge-text-color': '#0E1311',
            '--badge-text-font-size': 'inherit',
            '--badge-text-letter-spacing': 'inherit',
            '--badge-text-transform': 'inherit',
            '--author-font-size': 'inherit',
            '--author-font-weight': 'inherit',
            '--author-text-transform': 'inherit',
            '--photo-video-thumbnail-size': '60px',
            '--photo-video-thumbnail-border-radius': '10px',
            '--popup-backdrop-color': 'rgba(0,0,0,0.75)',
            '--popup-color': '#ffffff',
            '--popup-star-color': 'inherit',
            '--popup-disabled-star-color': 'inherit',
            '--popup-heading-text-color': 'inherit',
            '--popup-body-text-color': 'inherit',
            '--popup-badge-icon-color': 'inherit',
            '--popup-badge-icon-font-size': '19px',
            '--popup-badge-text-color': 'inherit',
            '--popup-badge-text-font-size': '14px',
            '--popup-border-width': '0px',
            '--popup-border-color': 'rgba(0,0,0,0.1)',
            '--popup-border-radius': '10px',
            '--popup-shadow-size': '0px',
            '--popup-shadow-color': 'rgba(0,0,0,0.1)',
            '--popup-icon-color': '#0E1311',
            '--tooltip-bg-color': '#0E1311',
            '--tooltip-text-color': '#ffffff'
          }
        });
      })
      .catch(function () {
        widget.dataset.reviewsioCarouselMounted = 'false';
      });
  }

  function observe(widget) {
    if (!('IntersectionObserver' in window)) {
      initCarousel(widget);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.disconnect();
          initCarousel(widget);
        }
      });
    }, { rootMargin: '700px 0px' });

    observer.observe(widget);
  }

  function init() {
    var widget = document.querySelector('[data-reviewsio-carousel]');
    if (widget) {
      observe(widget);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
