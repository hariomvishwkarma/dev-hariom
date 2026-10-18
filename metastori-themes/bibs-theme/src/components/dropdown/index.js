import { createPopper } from '@popperjs/core';

if (!customElements.get('c-dropdown')) {
  class Dropdown extends HTMLElement {
    constructor() {
      super();
      // default options
      this.options = {
        triggerType: this.dataset.triggerType || 'click',
        placement: this.dataset.dropdownPlacement,
        delay: this.dataset.dropdownDelay || 0,
        offset: this.dataset.dropdownOffset || 0,
      };
      this.visible = false;

      this.init();

      this.popperInstance = this.createPopperInstance();

      this.setupEventListeners();
    }

    init() {
      this.triggerEl = this.querySelector('[data-dropdown-toggle]');
      if (!this.triggerEl) return;
      this.targetEl = this.querySelector('[data-dropdown-content]');
    }

    setupEventListeners() {
      const this1 = this;
      const { showEvents, hideEvents } = this.getTriggerEvents();

      if (this.options.triggerType === 'click') {
        showEvents.forEach((event) => {
          this1.triggerEl.addEventListener(event, (e) => {
            this1.toggle(e);
          });
        });
      }
      if (this.options.triggerType === 'hover') {
        showEvents.forEach((event) => {
          this1.triggerEl.addEventListener(event, () => {
            if (event === 'click') {
              this1.toggle();
            } else {
              setTimeout(() => {
                this1.open();
              }, this1.options.delay);
            }
          });
          this1.triggerEl.addEventListener(event, () => {
            this1.open();
          });
        });
        hideEvents.forEach((event) => {
          this1.triggerEl.addEventListener(event, () => {
            setTimeout(() => {
              if (!this1.targetEl.matches(':hover')) {
                this1.close();
              }
            }, this1.options.delay);
          });
          this1.targetEl.addEventListener(event, () => {
            setTimeout(() => {
              if (!this1.triggerEl.matches(':hover')) {
                this1.close();
              }
            }, this1.options.delay);
          });
        });
      }
    }

    createPopperInstance() {
      return createPopper(this.triggerEl, this.targetEl, {
        placement: this.options.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, this.options.offset],
            },
          },
        ],
      });
    }

    toggle(e) {
      e.preventDefault();
      if (this.isVisible()) {
        this.close();
      } else {
        this.open();
      }
    }

    isVisible() {
      return this.visible;
    }

    open() {
      this.targetEl.classList.remove('hidden');

      this.clickOutsideEventListener = (ev) => {
        this.handleClickOutside(ev, this.targetEl);
      };

      this.popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          {
            name: 'eventListeners',
            enabled: true,
          },
        ],
      }));

      document.addEventListener('click', this.clickOutsideEventListener);

      this.popperInstance.update();
      this.visible = true;
    }

    close() {
      this.targetEl.classList.add('hidden');

      this.popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          {
            name: 'eventListeners',
            enabled: false,
          },
        ],
      }));

      this.visible = false;
      document.removeEventListener('click', this.clickOutsideEventListener);
    }

    handleClickOutside(e, targetEl) {
      const clickedEl = e.target;
      if (this.isVisible()) {
        if (clickedEl !== targetEl && !targetEl.contains(clickedEl)) {
          if (!this.triggerEl.contains(clickedEl)) {
            this.close();
          }
        }
      }
    }

    getTriggerEvents() {
      switch (this.options.triggerType) {
        case 'hover':
          return {
            showEvents: ['mouseenter', 'click'],
            hideEvents: ['mouseleave'],
          };
        case 'click':
          return {
            showEvents: ['click'],
            hideEvents: [],
          };
        case 'none':
          return {
            showEvents: [],
            hideEvents: [],
          };
        default:
          return {
            showEvents: ['click'],
            hideEvents: [],
          };
      }
    }
  }
  customElements.define('c-dropdown', Dropdown);
}
