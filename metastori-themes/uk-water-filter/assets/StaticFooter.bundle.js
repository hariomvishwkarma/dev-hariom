(window["wpJsonpPaskit"] = window["wpJsonpPaskit"] || []).push([[26],{

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Accordion; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Accordion = /*#__PURE__*/function () {
  function Accordion($el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Accordion);

    this.$el = $el;
    this.options = jquery__WEBPACK_IMPORTED_MODULE_0___default.a.extend({}, {
      activeClass: 'accordion--active',
      autoCollapse: false,
      content: '[data-accordion-content]',
      eligibleClass: 'has-accordion'
    }, options);
  }

  _createClass(Accordion, [{
    key: "toggle",
    value: function toggle($block) {
      var open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (open || !$block.hasClass(this.options.activeClass)) {
        if (this.options.autoCollapse) this.closeOpen();

        this._open($block);
      } else {
        this._close($block);
      }
    }
  }, {
    key: "closeOpen",
    value: function closeOpen() {
      var _this = this;

      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this.$el.find(".".concat(this.options.activeClass))).each(function (i, block) {
        var $block = jquery__WEBPACK_IMPORTED_MODULE_0___default()(block);

        if ($block.hasClass(_this.options.activeClass)) {
          _this._close($block);
        }
      });
    }
  }, {
    key: "openAll",
    value: function openAll() {
      var _this2 = this;

      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this.$el.find(".".concat(this.options.eligibleClass))).each(function (i, block) {
        _this2._open(jquery__WEBPACK_IMPORTED_MODULE_0___default()(block), 0);
      });
    }
  }, {
    key: "_open",
    value: function _open($block) {
      $block.addClass(this.options.activeClass);
    }
  }, {
    key: "_close",
    value: function _close($block) {
      $block.removeClass(this.options.activeClass);
    }
  }]);

  return Accordion;
}();



/***/ }),

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

var eventHandlers = [];
var previousBreakpoint = null;

function getBreakpoints() {
  return window.getComputedStyle(document.documentElement, ':before').getPropertyValue('content').replace(/"/g, '').split(',');
}

function getBreakpoint() {
  return window.getComputedStyle(document.documentElement, ':after').getPropertyValue('content').replace(/"/g, '');
}

jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).on('resize', function (event) {
  var currentBreakpoint = getBreakpoint();

  if (previousBreakpoint !== currentBreakpoint) {
    eventHandlers.forEach(function (eventHandler) {
      eventHandler(event, {
        previous: previousBreakpoint,
        current: currentBreakpoint
      });
    });
  }

  previousBreakpoint = currentBreakpoint;
});

function isLessThanBreakpoint(breakpoint) {
  var inclusive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var breakpoints = getBreakpoints();
  var currentBreakpoint = getBreakpoint();
  var comparison = breakpoints.indexOf(currentBreakpoint) - breakpoints.indexOf(breakpoint);
  return inclusive ? comparison <= 0 : comparison < 0;
}

function isGreaterThanBreakpoint(breakpoint) {
  var inclusive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var breakpoints = getBreakpoints();
  var currentBreakpoint = getBreakpoint();
  var comparison = breakpoints.indexOf(currentBreakpoint) - breakpoints.indexOf(breakpoint);
  return inclusive ? comparison >= 0 : comparison > 0;
}

function isBreakpoint() {
  var currentBreakpoint = getBreakpoint();

  for (var _len = arguments.length, breakpoints = new Array(_len), _key = 0; _key < _len; _key++) {
    breakpoints[_key] = arguments[_key];
  }

  return breakpoints.some(function (breakpoint) {
    return breakpoint === currentBreakpoint;
  });
}

function onBreakpointChange(eventHandler) {
  if (eventHandlers.indexOf(eventHandler) === -1) {
    eventHandlers.push(eventHandler);
  }
}

function offBreakpointChange(eventHandler) {
  var index = eventHandlers.indexOf(eventHandler);

  if (index !== -1) {
    eventHandlers.splice(index, 1);
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  isLessThanBreakpoint: isLessThanBreakpoint,
  isGreaterThanBreakpoint: isGreaterThanBreakpoint,
  isBreakpoint: isBreakpoint,
  onBreakpointChange: onBreakpointChange,
  offBreakpointChange: offBreakpointChange
});

/***/ }),

/***/ 7:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ Forms_Forms; });

// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(0);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);

// CONCATENATED MODULE: ./source/scripts/helpers/Quantity.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Quantity = /*#__PURE__*/function () {
  function Quantity(el) {
    _classCallCheck(this, Quantity);

    this.$el = $(el);
    this.$inputParent = this.$el.find('.form-field--qty-input');
    this.$input = this.$el.find('[data-quantity-input]');
    this.$selectParent = this.$el.find('.form-field--qty-select');
    this.$select = this.$el.find('[data-quantity-select]');
    this._watchSelect = this._watchSelect.bind(this);
    this._watchInput = this._watchInput.bind(this);
    this.$select.on('change.quantity', this._watchSelect);
    this.$input.on('change.quantity', this._watchInput);
  }

  _createClass(Quantity, [{
    key: "unload",
    value: function unload() {
      this.$el.off('.quantity');
    }
  }, {
    key: "_validateValue",
    value: function _validateValue(event) {
      var baseValue = parseInt(event.currentTarget.value, 10);
      return isNaN(baseValue) ? 1 : baseValue;
    }
  }, {
    key: "_watchSelect",
    value: function _watchSelect(event) {
      var value = this._validateValue(event); // Update input to match select


      this.$input.val(value).trigger('change'); // Switch to quantity input when 10 or more

      if (value >= 10) {
        this.$inputParent.removeClass('hidden').addClass('visible');
        this.$input.focus().removeAttr('tabindex').select();
        this.$selectParent.removeClass('visible').addClass('hidden');
        this.$select.attr('tabindex', '-1');
      }
    }
  }, {
    key: "_watchInput",
    value: function _watchInput(event) {
      this.$input.val(this._validateValue(event));
    }
  }]);

  return Quantity;
}();


// CONCATENATED MODULE: ./source/scripts/Forms.js
function Forms_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Forms_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Forms_createClass(Constructor, protoProps, staticProps) { if (protoProps) Forms_defineProperties(Constructor.prototype, protoProps); if (staticProps) Forms_defineProperties(Constructor, staticProps); return Constructor; }




var Forms_Forms = /*#__PURE__*/function () {
  function Forms(el) {
    var _this = this;

    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.form-field-input';

    Forms_classCallCheck(this, Forms);

    this.$el = jquery_default()(el);
    this.filledClass = 'form-field-filled';
    this.fieldSelector = selector;
    this.quantityItems = [];
    this.$quantityWrapper = this.$el.find('[data-quantity-wrapper]');
    this._toggleFilled = this._toggleFilled.bind(this);
    this.$el.on('focus.forms', this.fieldSelector, this._toggleFilled);
    this.$el.on('blur.forms', this.fieldSelector, this._toggleFilled);

    this._checkFilled();

    if (this.$quantityWrapper.length) {
      this.$quantityWrapper.each(function (i, el) {
        _this.quantityItems.push(new Quantity(el));
      });
    }
  }

  Forms_createClass(Forms, [{
    key: "unload",
    value: function unload() {
      this.$el.off('.forms');
      this.quantityItems.forEach(function (quantityItem) {
        quantityItem.unload();
      });
    }
  }, {
    key: "_checkFilled",
    value: function _checkFilled() {
      var _this2 = this;

      this.$el.find(this.fieldSelector).each(function (i, el) {
        if (jquery_default()(el).hasClass(_this2.filledClass)) return;

        _this2._toggleFilled(null, el);
      });
    }
  }, {
    key: "_toggleFilled",
    value: function _toggleFilled() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var target = event ? event.currentTarget : el;
      var $target = jquery_default()(target);
      var value = target.value;
      var isFilled = value.length > 0;

      try {
        isFilled = isFilled || $target.is(':-webkit-autofill');
        $target.toggleClass(this.filledClass, isFilled);
      } catch (e) {
        $target.toggleClass(this.filledClass, isFilled);
      }
    }
  }]);

  return Forms;
}();



/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ StaticFooter_StaticFooter; });

// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(0);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);

// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-cross-border/dist/index.es.js

/*!
 * @pixelunion/shopify-cross-border v1.0.4
 * (c) 2020 
 */

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var EventHandler_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var EventHandler =
/** @class */
function () {
  function EventHandler() {
    this.events = [];
  }

  EventHandler.prototype.register = function (el, event, listener) {
    if (!el || !event || !listener) return null;
    this.events.push({
      el: el,
      event: event,
      listener: listener
    });
    el.addEventListener(event, listener);
    return {
      el: el,
      event: event,
      listener: listener
    };
  };

  EventHandler.prototype.unregister = function (_a) {
    var el = _a.el,
        event = _a.event,
        listener = _a.listener;
    if (!el || !event || !listener) return null;
    this.events = this.events.filter(function (e) {
      return el !== e.el || event !== e.event || listener !== e.listener;
    });
    el.removeEventListener(event, listener);
    return {
      el: el,
      event: event,
      listener: listener
    };
  };

  EventHandler.prototype.unregisterAll = function () {
    this.events.forEach(function (_a) {
      var el = _a.el,
          event = _a.event,
          listener = _a.listener;
      return el.removeEventListener(event, listener);
    });
    this.events = [];
  };

  return EventHandler;
}();

exports["default"] = EventHandler;
});

var Events = unwrapExports(EventHandler_1);

var selectors = {
  disclosureList: '[data-disclosure-list]',
  disclosureToggle: '[data-disclosure-toggle]',
  disclosureInput: '[data-disclosure-input]',
  disclosureOptions: '[data-disclosure-option]'
};
var classes = {
  listVisible: 'disclosure-list--visible',
  alternateDrop: 'disclosure-list--alternate-drop'
};

var Disclosure = /*#__PURE__*/function () {
  function Disclosure(el) {
    _classCallCheck(this, Disclosure);

    this.el = el;
    this.events = new Events();
    this.cache = {};

    this._cacheSelectors();

    this._connectOptions();

    this._connectToggle();

    this._onFocusOut();
  }

  _createClass(Disclosure, [{
    key: "_cacheSelectors",
    value: function _cacheSelectors() {
      this.cache = {
        disclosureList: this.el.querySelector(selectors.disclosureList),
        disclosureToggle: this.el.querySelector(selectors.disclosureToggle),
        disclosureInput: this.el.querySelector(selectors.disclosureInput),
        disclosureOptions: this.el.querySelectorAll(selectors.disclosureOptions)
      };
    }
  }, {
    key: "_connectToggle",
    value: function _connectToggle() {
      var _this = this;

      this.events.register(this.cache.disclosureToggle, 'click', function (e) {
        var ariaExpanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
        e.currentTarget.setAttribute('aria-expanded', !ariaExpanded);

        _this.cache.disclosureList.classList.remove(classes.alternateDrop);

        _this.cache.disclosureList.classList.toggle(classes.listVisible);

        window.requestAnimationFrame(function () {
          var _this$cache$disclosur = _this.cache.disclosureList.getBoundingClientRect(),
              left = _this$cache$disclosur.left,
              width = _this$cache$disclosur.width;

          var _window = window,
              innerWidth = _window.innerWidth;
          var gutter = 30;

          if (left + width + gutter > innerWidth) {
            _this.cache.disclosureList.classList.add(classes.alternateDrop);
          }
        });
      });
    }
  }, {
    key: "_connectOptions",
    value: function _connectOptions() {
      var _this2 = this;

      var options = this.cache.disclosureOptions;

      for (var i = 0; i < options.length; i++) {
        var option = options[i];
        this.events.register(option, 'click', function (e) {
          return _this2._submitForm(e.currentTarget.dataset.value);
        });
      }
    }
  }, {
    key: "_onFocusOut",
    value: function _onFocusOut() {
      var _this3 = this;

      this.events.register(this.cache.disclosureToggle, 'focusout', function (e) {
        var disclosureLostFocus = !_this3.el.contains(e.relatedTarget);

        if (disclosureLostFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.cache.disclosureList, 'focusout', function (e) {
        var childInFocus = e.currentTarget.contains(e.relatedTarget);

        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);

        if (isVisible && !childInFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.el, 'keyup', function (e) {
        if (e.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        if (e.key !== 'Escape' || e.key !== 'Esc') return;

        _this3._hideList();

        _this3.cache.disclosureToggle.focus();
      });
      this.events.register(document.body, 'click', function (e) {
        var isOption = _this3.el.contains(e.target);

        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);

        if (isVisible && !isOption) {
          _this3._hideList();
        }
      });
    }
  }, {
    key: "_submitForm",
    value: function _submitForm(value) {
      this.cache.disclosureInput.value = value;
      this.el.closest('form').submit();
    }
  }, {
    key: "_hideList",
    value: function _hideList() {
      this.cache.disclosureList.classList.remove(classes.listVisible);
      this.cache.disclosureToggle.setAttribute('aria-expanded', false);
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();
    }
  }]);

  return Disclosure;
}();

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function closest(s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}

/* harmony default export */ var index_es = (Disclosure);

// EXTERNAL MODULE: ./source/scripts/Accordion.js
var Accordion = __webpack_require__(16);

// EXTERNAL MODULE: ./source/scripts/Forms.js + 1 modules
var Forms = __webpack_require__(7);

// EXTERNAL MODULE: ./source/scripts/Layout.js
var Layout = __webpack_require__(6);

// CONCATENATED MODULE: ./source/scripts/sections/StaticFooter.js
function StaticFooter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticFooter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticFooter_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticFooter_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticFooter_defineProperties(Constructor, staticProps); return Constructor; }







var StaticFooter_StaticFooter = /*#__PURE__*/function () {
  function StaticFooter(section) {
    StaticFooter_classCallCheck(this, StaticFooter);

    this.$el = jquery_default()(section.el);
    this.el = section.el;
    this.currencyDisclosureEl = this.el.querySelector('[data-disclosure-currency]');
    this.localeDisclosureEl = this.el.querySelector('[data-disclosure-locale]');
    this.disclosures = [];
    this.Accordion = new Accordion["a" /* default */](this.$el);
    this.forms = new Forms["a" /* default */](this.$el);

    if (this.currencyDisclosureEl) {
      this.disclosures.push(new index_es(this.currencyDisclosureEl));
    }

    if (this.localeDisclosureEl) {
      this.disclosures.push(new index_es(this.localeDisclosureEl));
    } // Handle Accordion interaction when window size changes


    this.layoutHandler = this.onBreakpointChange.bind(this);
    Layout["a" /* default */].onBreakpointChange(this.layoutHandler);

    this._bindEvents();
  }

  StaticFooter_createClass(StaticFooter, [{
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this = this;

      this.$el.on('click.footer', '[data-accordion-trigger]', function (event) {
        event.preventDefault();

        _this._toggleAccordion(jquery_default()(event.currentTarget).parent());
      });
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.$el.off('.footer');
      this.forms.unload();
      this.disclosures.forEach(function (disclosure) {
        return disclosure.unload();
      });
      delete this.Accordion;
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(block) {
      var $block = jquery_default()(block.el);
      if ($block.hasClass('has-accordion')) this._toggleAccordion($block, true);
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(block) {
      var $block = jquery_default()(block.el);
      if ($block.hasClass('has-accordion')) this._toggleAccordion($block, false);
    }
  }, {
    key: "_toggleAccordion",
    value: function _toggleAccordion($block) {
      if (Layout["a" /* default */].isGreaterThanBreakpoint('M')) return;
      this.Accordion.toggle($block);
    }
  }, {
    key: "onBreakpointChange",
    value: function onBreakpointChange(event, breakpoints) {
      if (Layout["a" /* default */].isGreaterThanBreakpoint('M')) {
        this.Accordion.openAll();
      } else if (breakpoints.previous === 'L' && !Layout["a" /* default */].isGreaterThanBreakpoint('M')) {
        this.Accordion.closeOpen();
      }
    }
  }]);

  return StaticFooter;
}();



/***/ })

}]);
//# sourceMappingURL=StaticFooter.bundle.js.map?1585847753798