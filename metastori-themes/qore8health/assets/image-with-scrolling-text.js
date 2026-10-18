if (!customElements.get("image-with-scrolling-text")) {
  customElements.define(
    "image-with-scrolling-text",
    class Storytelling extends HTMLElement {
      constructor() {
        super();
        this.images = this.querySelectorAll(".image-wrapper > *");
        this.items = this.querySelectorAll(".wt-image-with-scrolling-text__text > div");
        this.onScroll = this.onScroll.bind(this);
        this.onResize = this.onResize.bind(this);
        this.textObserver = null;
        this.scrollMode = null;
        this.wasLargeScreen = null;
      }

      connectedCallback() {
        this.init();
      }

      isLargeScreen() {
        return window.matchMedia("(min-width: 1601px)").matches;
      }

      getTextContainer() {
        return this.querySelector(".wt-image-with-scrolling-text__text");
      }

      getSection() {
        return this.querySelector(".wt-image-with-scrolling-text");
      }

      setupObserver() {
        if (this.textObserver) {
          this.textObserver.disconnect();
        }

        const isLarge = this.isLargeScreen();
        const root = isLarge ? this.getTextContainer() : null;

        this.textObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const index = Array.from(this.items).indexOf(entry.target);

                this.images.forEach((img) => {
                  img.style.opacity = "0";
                });

                if (this.images[index]) {
                  this.images[index].style.opacity = "1";
                }
              }
            });
          },
          {
            root,
            rootMargin: isLarge ? "-45% 0px -45% 0px" : "-50% 0px -40% 0px",
            threshold: 0,
          },
        );

        this.items.forEach((block) => this.textObserver.observe(block));
      }

      setupScrollListeners() {
        const textContainer = this.getTextContainer();

        if (this.scrollMode === "internal") {
          textContainer?.removeEventListener("scroll", this.onScroll);
        } else if (this.scrollMode === "window") {
          window.removeEventListener("scroll", this.onScroll);
        }

        if (this.isLargeScreen()) {
          textContainer?.addEventListener("scroll", this.onScroll, { passive: true });
          this.scrollMode = "internal";
        } else {
          window.addEventListener("scroll", this.onScroll, { passive: true });
          this.scrollMode = "window";
        }
      }

      onScroll() {
        const isLarge = this.isLargeScreen();
        const imageContainer = this.querySelector(".wt-image-with-scrolling-text__image");
        const imageRect = imageContainer?.getBoundingClientRect();

        if (!isLarge && imageRect) {
          if (imageRect.top < 0 || imageRect.bottom > window.innerHeight) {
            return;
          }
        }

        const textContainer = this.getTextContainer();
        const viewportHeight = isLarge
          ? textContainer?.clientHeight || window.innerHeight
          : window.innerHeight;
        const centerY = isLarge
          ? (textContainer?.getBoundingClientRect().top || 0) + viewportHeight / 2
          : window.innerHeight / 2;

        this.items.forEach((item) => {
          const rect = item.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distanceFromCenter = Math.abs(elementCenter - centerY);
          const maxDistance = viewportHeight / 2;
          const opacity = 1 - Math.min(distanceFromCenter / maxDistance, 1);

          item.style.opacity = opacity;
        });
      }

      getImageDisplayHeight(img, colWidth) {
        if (!(img instanceof HTMLImageElement) || !img.naturalWidth || !img.naturalHeight) {
          return 0;
        }

        return colWidth * (img.naturalHeight / img.naturalWidth);
      }

      setFixedSectionHeight() {
        const section = this.getSection();
        const imageCol = this.querySelector(".wt-image-with-scrolling-text__image");

        if (!section || !imageCol) return;

        const colWidth = imageCol.offsetWidth || section.offsetWidth / 2;

        const applyHeight = (height) => {
          const paddedHeight = Math.round(height * 0.60);
          section.style.setProperty("--section-fixed-height", paddedHeight + "px");
          this.applyTextMargins();
        };

        const measureHeight = () => {
          let maxHeight = 0;

          this.images.forEach((img) => {
            maxHeight = Math.max(maxHeight, this.getImageDisplayHeight(img, colWidth));
          });

          if (maxHeight > 0) {
            applyHeight(maxHeight);
          }
        };

        const pendingImages = Array.from(this.images).filter(
          (img) =>
            img instanceof HTMLImageElement &&
            (!img.complete || !img.naturalWidth || !img.naturalHeight),
        );

        if (pendingImages.length === 0) {
          measureHeight();
          return;
        }

        let loadedCount = 0;

        pendingImages.forEach((img) => {
          img.addEventListener(
            "load",
            () => {
              loadedCount += 1;
              if (loadedCount === pendingImages.length) {
                measureHeight();
              }
            },
            { once: true },
          );
        });

        measureHeight();
      }

      applyTextMargins() {
        if (!this.outer || this.inners.length === 0) return;

        if (this.isLargeScreen()) {
          this.outer.style.marginTop = "0";
          this.outer.style.marginBottom = "0";
          return;
        }

        const firstHeight = this.inners[0].offsetHeight;
        const lastHeight = this.inners[this.inners.length - 1].offsetHeight;
        const vh = window.innerHeight;

        this.outer.style.marginTop = vh / 2 - firstHeight / 2 + "px";
        this.outer.style.marginBottom = vh / 2 - lastHeight / 2 + "px";
      }

      onResize() {
        if (!this.outer || this.inners.length === 0) return;

        const isLarge = this.isLargeScreen();

        if (isLarge !== this.wasLargeScreen) {
          this.setupObserver();
          this.setupScrollListeners();
          this.wasLargeScreen = isLarge;
        }

        if (isLarge) {
          this.setFixedSectionHeight();
          return;
        }

        this.getSection()?.style.removeProperty("--section-fixed-height");

        const firstHeight = this.inners[0].offsetHeight;
        const lastHeight = this.inners[this.inners.length - 1].offsetHeight;
        const vh = window.innerHeight;

        this.outer.style.marginTop = vh / 2 - firstHeight / 2 + "px";
        this.outer.style.marginBottom = vh / 2 - lastHeight / 2 + "px";
      }

      init() {
        this.outer = this.getTextContainer();
        this.inners = this.querySelectorAll(".wt-image-with-scrolling-text__text > div");
        this.wasLargeScreen = this.isLargeScreen();

        this.setupObserver();
        this.setupScrollListeners();
        this.onScroll();
        window.addEventListener("resize", this.onResize);
        this.onResize();
      }

      disconnectedCallback() {
        window.removeEventListener("resize", this.onResize);

        const textContainer = this.getTextContainer();

        if (this.scrollMode === "internal") {
          textContainer?.removeEventListener("scroll", this.onScroll);
        } else if (this.scrollMode === "window") {
          window.removeEventListener("scroll", this.onScroll);
        }

        this.textObserver?.disconnect();
      }
    },
  );
}
