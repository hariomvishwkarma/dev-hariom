import { createPopper } from '@popperjs/core';

const triggerEls = Array.from(document.querySelectorAll('[data-popover-target]'));

if (triggerEls.length) {

// default options
const Default = {
  placement: 'bottom',
  triggerType: 'hover',
  offset: 10,
};

class Popover {
  constructor(targetEl, triggerEl, options) {
    this.targetEl = targetEl;
    this.triggerEl = triggerEl;
    this.closeButtonEl = this.targetEl.querySelector('[data-popover-close]');
    this.options = options || Default;
    this.popperInstance = this.createPopperInstance();

    this.visible = false;
    this.init();
  }

  init() {
    if (this.triggerEl) {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    const this1 = this;
    const { showEvents, hideEvents } = this.getTriggerEvents();

    showEvents.forEach(function (ev) {
      this1.triggerEl.addEventListener(ev, function () {
        this1.show();
      });
      this1.targetEl.addEventListener(ev, function () {
        this1.show();
      });
    });
    hideEvents.forEach(function (ev) {
      this1.triggerEl.addEventListener(ev, function () {
        setTimeout(function () {
          if (!this1.targetEl.matches(':hover')) {
            this1.hide();
          }
        }, 100);
      });
      this1.targetEl.addEventListener(ev, function () {
        setTimeout(function () {
          if (!this1.triggerEl.matches(':hover')) {
            this1.hide();
          }
        }, 100);
      });
      if (this1.closeButtonEl) {
        this1.closeButtonEl.addEventListener('click', function () {
          setTimeout(function () {
            this1.hide();
          }, 100);
        });
      }
    });
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

  getTriggerEvents() {
    switch (this.options.triggerType) {
      case 'hover':
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur'],
        };
      case 'click':
        return {
          showEvents: ['click', 'focus'],
          hideEvents: ['focusout', 'blur'],
        };
      case 'none':
        return {
          showEvents: [],
          hideEvents: [],
        };
      default:
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur'],
        };
    }
  }

  setupClickOutsideListener() {
    const this2 = this;
    this.clickOutsideEventListener = function (ev) {
      this2.handleClickOutside(ev, this2.targetEl);
    };
    document.body.addEventListener('click', this.clickOutsideEventListener, true);
  }

  removeClickOutsideListener() {
    document.body.removeEventListener('click', this.clickOutsideEventListener, true);
  }

  handleClickOutside(ev, targetEl) {
    var clickedEl = ev.target;
    if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this.triggerEl.contains(clickedEl) && this.isVisible()) {
      this.hide();
    }
  }

  isVisible() {
    return this.visible;
  }

  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.targetEl.classList.remove('hidden');
    // Enable the event listeners
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

    this.setupClickOutsideListener();
    this.popperInstance.update();
    this.visible = true;
  }

  hide() {
    this.targetEl.classList.add('hidden');
    // Disable the event listeners
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

    this.removeClickOutsideListener();
    this.visible = false;
  }
}

triggerEls.forEach((triggerEl) => {
  const popoverId = triggerEl.dataset.popoverTarget;
  const popoverEl = document.querySelector(`[data-popover-id="${popoverId}"`);

  if (popoverEl) {
    const triggerType = popoverEl.dataset.trigger || Default.triggerType;
    const placement = popoverEl.dataset.placement || Default.placement;
    const offset = popoverEl.dataset.offset || Default.offset;

    new Popover(popoverEl, triggerEl, {
      placement: placement,
      offset: parseInt(offset),
      triggerType: triggerType,
    });
  }
});
}
