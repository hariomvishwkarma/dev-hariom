if (!customElements.get("c-slider")) {
  class Carousel extends HTMLElement {
    constructor() {
      super();
      this._items = [];
      this._activeItem = null;
      this._indicators = [];
      this._intervalDuration = 5000;
      this._intervalInstance = null;
      this._options = {
        defaultPosition: 0,
        indicators: {
          items: [],
          activeClasses: "bg-black/30 ring-white/50",
          inactiveClasses: "bg-white/50 hover:bg-white ring-black/30",
        },
        onNext: function () {},
        onPrev: function () {},
        onChange: function () {},
      };
    }

    connectedCallback() {
      this._initItems();
      this._initOptions();
      this._initIndicators();

      this.slideTo(this._options.defaultPosition);

      this._options.onChange(this);

      // check for controls
      const carouselNextEl = this.querySelector("[data-carousel-next]");
      const carouselPrevEl = this.querySelector("[data-carousel-prev]");
      if (carouselNextEl) {
        carouselNextEl.addEventListener("click", () => {
          this.next();
        });
      }
      if (carouselPrevEl) {
        carouselPrevEl.addEventListener("click", () => {
          this.prev();
        });
      }
    }

    _initOptions() {
      const interval = this.getAttribute("data-carousel-interval");
      const slide = this.getAttribute("data-carousel") === "slide";

      if (interval) {
        this._intervalDuration = parseInt(interval);
      }

      this._options.defaultPosition =
        parseInt(this.getAttribute("data-carousel-default-position")) || 0;

      const indicators = Array.from(
        this.querySelectorAll("[data-carousel-slide-to]"),
      );
      this._options.indicators.items = indicators.map((el) => ({
        position: parseInt(el.getAttribute("data-carousel-slide-to")),
        el,
      }));

      if (slide) {
        this.cycle();
      }
    }

    _initItems() {
      const itemEls = Array.from(this.querySelectorAll("[data-carousel-item]"));
      this._items = itemEls.map((el, position) => ({
        position,
        el,
      }));
    }

    _initIndicators() {
      const { indicators } = this._options;

      if (indicators.items.length) {
        indicators.items.forEach((indicator) => {
          indicator.el.addEventListener("click", () => {
            this.slideTo(indicator.position);
          });
        });
      }
    }

    slideTo(position) {
      const nextItem = this._items[position];

      const rotationItems = {
        left:
          nextItem.position === 0
            ? this._items[this._items.length - 1]
            : this._items[nextItem.position - 1],
        middle: nextItem,
        right:
          nextItem.position === this._items.length - 1
            ? this._items[0]
            : this._items[nextItem.position + 1],
      };

      this._rotate(rotationItems);
      this._setActiveItem(nextItem);

      if (this._intervalInstance) {
        this.pause();
        this.cycle();
      }

      this._options.onChange(this);
    }

    next() {
      const activeItem = this._getActiveItem();
      const nextItem =
        activeItem.position === this._items.length - 1
          ? this._items[0]
          : this._items[activeItem.position + 1];
      this.slideTo(nextItem.position);
      this._options.onNext(this);
    }

    prev() {
      const activeItem = this._getActiveItem();
      const prevItem =
        activeItem.position === 0
          ? this._items[this._items.length - 1]
          : this._items[activeItem.position - 1];
      this.slideTo(prevItem.position);
      this._options.onPrev(this);
    }

    cycle() {
      if (this._intervalInstance) {
        return;
      }

      this._intervalInstance = setInterval(() => {
        this.next();
      }, this._intervalDuration);
    }

    pause() {
      clearInterval(this._intervalInstance);
      this._intervalInstance = null;
    }

    _getActiveItem() {
      return this._activeItem;
    }

    _setActiveItem(item) {
      var _a, _b;
      this._activeItem = item;

      if (this._options.indicators.items) {
        this._options.indicators.items.forEach((indicator) => {
          if (indicator.position === this._getActiveItem().position) {
            (_a = indicator.el.classList).add.apply(
              _a,
              this._options.indicators.activeClasses.split(" "),
            );
            (_b = indicator.el.classList).remove.apply(
              _b,
              this._options.indicators.inactiveClasses.split(" "),
            );
          } else {
            (_a = indicator.el.classList).remove.apply(
              _a,
              this._options.indicators.activeClasses.split(" "),
            );
            (_b = indicator.el.classList).add.apply(
              _b,
              this._options.indicators.inactiveClasses.split(" "),
            );
          }
        });
      }
    }

    _rotate(rotationItems) {
      this._items.map((item) => {
        item.el.classList.add("hidden");
      });

      // left item (previously active)
      rotationItems.left.el.classList.remove(
        "-translate-x-full",
        "translate-x-full",
        "translate-x-0",
        "hidden",
        "z-20",
      );
      rotationItems.left.el.classList.add("-translate-x-full", "z-10");
      // currently active item
      rotationItems.middle.el.classList.remove(
        "-translate-x-full",
        "translate-x-full",
        "translate-x-0",
        "hidden",
        "z-10",
      );
      rotationItems.middle.el.classList.add("translate-x-0", "z-20");
      // right item (upcoming active)
      rotationItems.right.el.classList.remove(
        "-translate-x-full",
        "translate-x-full",
        "translate-x-0",
        "hidden",
        "z-20",
      );
      rotationItems.right.el.classList.add("translate-x-full", "z-10");
    }
  }

  customElements.define("c-slider", Carousel);
}
