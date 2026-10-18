/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/helpers/format-money.js":
/*!****************************************!*\
  !*** ./src/js/helpers/format-money.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formatMoney": () => (/* binding */ formatMoney)
/* harmony export */ });
var formatMoney = function formatMoney(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }

  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
      formatString = format || '${{amount}}';

  function defaultTo(value, defaultValue) {
    return value == null || value !== value ? defaultValue : value;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultTo(precision, 2);
    thousands = defaultTo(thousands, ',');
    decimal = defaultTo(decimal, '.');

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);
    var parts = number.split('.'),
        dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        centsAmount = parts[1] ? decimal + parts[1] : '';
    return dollarsAmount + centsAmount;
  }

  var value = '';

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;

    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;

    case 'amount_with_space_separator':
      value = formatWithDelimiters(cents, 2, ' ', '.');
      break;

    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, ',', '.');
      break;

    case 'amount_no_decimals_with_space_separator':
      value = formatWithDelimiters(cents, 0, ' ');
      break;

    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
  }

  if (formatString.indexOf('with_comma_separator') !== -1) {
    return formatString.replace(placeholderRegex, value);
  } else {
    return formatString.replace(placeholderRegex, value);
  }
};

/***/ }),

/***/ "./src/js/modules/ed-quantity-change-observer.js":
/*!*******************************************************!*\
  !*** ./src/js/modules/ed-quantity-change-observer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_format_money__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/format-money */ "./src/js/helpers/format-money.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var QuantityChangeObserver = /*#__PURE__*/function (_HTMLElement) {
  _inherits(QuantityChangeObserver, _HTMLElement);

  var _super = _createSuper(QuantityChangeObserver);

  function QuantityChangeObserver() {
    var _this;

    _classCallCheck(this, QuantityChangeObserver);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_", void 0);

    return _this;
  }

  _createClass(QuantityChangeObserver, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this._attachSelectors();

      this._attachListeners(); // initial value


      this.currentQuantity = 1;

      try {
        this.currentSinglePrice = document.querySelector('[data-ed-price]').dataset.edPrice;
        this.currentComparePrice = document.querySelector('[data-ed-compare-price]').dataset.edComparePrice;
        this.convertPrices();
      } catch (e) {}
    }
  }, {
    key: "_attachSelectors",
    value: function _attachSelectors() {
      this.productInfoContainer = document.querySelector('.product__info');
    }
  }, {
    key: "_attachListeners",
    value: function _attachListeners() {
      document.addEventListener('variant:changed', this.onVariantChange.bind(this));
      document.addEventListener('ed:qty:change', this.onQuantityChange.bind(this));
      document.addEventListener('ed:qty:discount:change', this.onQuantityDiscountsChange.bind(this));
    }
  }, {
    key: "onVariantChange",
    value: function onVariantChange(e) {
      var newVariant = e.detail.variant;
      this.currentVariant = newVariant;
      this.currentSinglePrice = newVariant.price;
      this.currentComparePrice = newVariant.compare_at_price ? newVariant.compare_at_price : newVariant.price;
      this.convertPrices();
      this.updatePrices();

      if (document.querySelector('.ed-quantity-discounts')) {
        this.renderPrices();
      }
    }
  }, {
    key: "onQuantityChange",
    value: function onQuantityChange(e) {
      this.currentQuantity = e.detail.value;
      this.convertPrices();
      this.updatePrices();
    }
  }, {
    key: "updatePrices",
    value: function updatePrices() {
      this.priceContainer = this.productInfoContainer.querySelector('.price.price--large');
      this.comparePriceContainer = this.productInfoContainer.querySelector('.price.price--compare');
      this.savingsContainer = this.productInfoContainer.querySelector('.ed-save-amount');
      var finalPrice = this.calculatePrice(this.currentSinglePrice, this.currentQuantity);
      var finalComparePrice = this.calculateComparePrice(this.currentComparePrice, this.currentQuantity);
      var finalSavings = this.calculateSavings(this.currentSinglePrice, this.currentComparePrice, this.currentQuantity);

      if (this.priceContainer) {
        this.priceContainer.innerHTML = finalPrice;
      }

      if (this.comparePriceContainer) {
        this.comparePriceContainer.innerHTML = finalComparePrice;
      }

      if (this.savingsContainer) {
        this.savingsContainer.innerHTML = finalSavings;
      } // HANDLE NO COMPARE PRICE


      if (!this.currentComparePrice || this.currentComparePrice - this.currentSinglePrice <= 0) {
        if (this.savingsContainer) {
          this.savingsContainer.parentElement.style.display = 'none';
        }
      }
    }
  }, {
    key: "calculateSavings",
    value: function calculateSavings(price, comparePrice, quantity) {
      comparePrice = parseFloat(comparePrice) * quantity;
      price = parseFloat(price) * quantity;

      if (this.qtyDiscountValue) {
        price = price * (1 - parseFloat(this.qtyDiscountValue) / 100);
      }

      var savings = comparePrice - price;
      return (0,_helpers_format_money__WEBPACK_IMPORTED_MODULE_0__.formatMoney)(savings, window.elbDevCustom.moneyFormat);
    }
  }, {
    key: "calculatePrice",
    value: function calculatePrice(price, quantity) {
      var finalPrice = parseFloat(quantity) * parseFloat(price);

      if (this.qtyDiscountValue) {
        finalPrice = finalPrice * (1 - parseFloat(this.qtyDiscountValue) / 100);
      }

      return (0,_helpers_format_money__WEBPACK_IMPORTED_MODULE_0__.formatMoney)(finalPrice, window.elbDevCustom.moneyFormat);
    }
  }, {
    key: "calculateComparePrice",
    value: function calculateComparePrice(price, quantity) {
      var finalPrice = parseFloat(quantity) * parseFloat(price);
      return (0,_helpers_format_money__WEBPACK_IMPORTED_MODULE_0__.formatMoney)(finalPrice, window.elbDevCustom.moneyFormat);
    }
  }, {
    key: "onQuantityDiscountsChange",
    value: function onQuantityDiscountsChange(e) {
      this.currentQuantity = e.detail.value;
      this.qtyDiscountType = e.detail.discountType;
      this.qtyDiscountValue = e.detail.discountValue;

      if (!this.qtyDiscountValue) {
        console.log('xxx');
      }

      this.updatePrices();
      this.renderPrices();
    }
  }, {
    key: "renderPrices",
    value:
    /*** only used for Quantity Discount section ***/
    function renderPrices() {
      var productPrices = document.querySelector("[data-product-price-list]");

      if (!productPrices) {
        return;
      }

      productPrices.innerHTML = "";
      console.log('price', this.currentComparePrice, this.currentSinglePrice, this.qtyDiscountValue);

      if (this.currentComparePrice > this.currentSinglePrice || this.qtyDiscountValue) {
        var comparePrice;

        if (!this.currentComparePrice) {
          comparePrice = this.currentSinglePrice;
        } else {
          comparePrice = this.currentComparePrice;
        }

        productPrices.innerHTML += "<span class=\"price price--highlight price--large\"><span class=\"visually-hidden\">".concat(window.themeVariables.strings.productSalePrice, "</span>").concat(this.calculatePrice(this.currentSinglePrice, this.currentQuantity), "</span>");
        productPrices.innerHTML += "<span class=\"price price--compare\"><span class=\"visually-hidden\">".concat(window.themeVariables.strings.productRegularPrice, "</span>").concat(this.calculateComparePrice(comparePrice, this.currentQuantity), "</span>"); // save label

        var savings = this.calculateSavings(this.currentSinglePrice, comparePrice, this.currentQuantity);

        if (savings !== 0) {
          document.querySelectorAll('[data-product-label-list]').forEach(function (element) {
            return element.remove();
          }); // remove all saving elements

          var saveLabel = this.createSaveLabel(this.calculateSavings(this.currentSinglePrice, comparePrice, this.currentQuantity));
          var priceList = productPrices;
          priceList.parentNode.insertBefore(saveLabel, priceList.nextSibling);
        }
      } else {
        productPrices.innerHTML += "<span class=\"price ".concat(this.priceClass, "\"><span class=\"visually-hidden\">").concat(window.themeVariables.strings.productSalePrice, "</span>").concat(this.calculatePrice(this.currentSinglePrice, this.currentQuantity), "</span>");
      }
    }
  }, {
    key: "createSaveLabel",
    value: function createSaveLabel(savings) {
      var saveLabel = document.createElement('div');
      saveLabel.className = 'product-meta__label-list label-list';
      saveLabel.dataset.productLabelList = '';
      saveLabel.innerHTML = '<span class="label label--highlight">(Du sparst <span class="ed-save-amount">' + savings + '</span>)</span>';
      return saveLabel;
    }
  }, {
    key: "convertPrices",
    value: function convertPrices() {
      this.currentComparePrice = parseFloat(this.currentComparePrice);
      this.currentSinglePrice = parseFloat(this.currentSinglePrice);
    }
  }]);

  return QuantityChangeObserver;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

customElements.define('ed-quantity-change-observer', QuantityChangeObserver);

/***/ }),

/***/ "./src/js/modules/ed-quantity-discounts.js":
/*!*************************************************!*\
  !*** ./src/js/modules/ed-quantity-discounts.js ***!
  \*************************************************/
/***/ (() => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var QuantityDiscounts = /*#__PURE__*/function (_HTMLElement) {
  _inherits(QuantityDiscounts, _HTMLElement);

  var _super = _createSuper(QuantityDiscounts);

  function QuantityDiscounts() {
    _classCallCheck(this, QuantityDiscounts);

    return _super.apply(this, arguments);
  }

  _createClass(QuantityDiscounts, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this._attachSelectors();

      this._attachListeners();
    }
  }, {
    key: "_attachSelectors",
    value: function _attachSelectors() {
      this.quantityInput = this.querySelector('input');
      this.quantityItems = this.querySelectorAll('.quantity-item');
    }
  }, {
    key: "_attachListeners",
    value: function _attachListeners() {
      var _this = this;

      this.quantityItems.forEach(function (item) {
        item.addEventListener('click', _this.onQuantityItemClick.bind(_this));

        if (item.dataset.preselect === "true") {
          _this.applyPreSelect(item);
        }
      });
    }
  }, {
    key: "onQuantityItemClick",
    value: function onQuantityItemClick(e) {
      var _this2 = this;

      this.quantityItems.forEach(function (item) {
        item.classList.remove('selected');

        if (e.target === item) {
          item.classList.add('selected');
          _this2.quantityInput.value = item.dataset.qty;
          document.dispatchEvent(new CustomEvent('ed:qty:discount:change', {
            detail: {
              value: item.dataset.qty,
              discountType: item.dataset.discountType,
              discountValue: item.dataset.discountValue
            }
          }));
        }
      });
    }
  }, {
    key: "applyPreSelect",
    value: function applyPreSelect(element) {
      var _this3 = this;

      this.quantityItems.forEach(function (item) {
        item.classList.remove('selected');

        if (element === item) {
          item.classList.add('selected');
          _this3.quantityInput.value = item.dataset.qty;
          setTimeout(function () {
            document.dispatchEvent(new CustomEvent('ed:qty:discount:change', {
              detail: {
                value: item.dataset.qty,
                discountType: item.dataset.discountType,
                discountValue: item.dataset.discountValue
              }
            }));
          }.bind(_this3));
        }
      });
    }
  }]);

  return QuantityDiscounts;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

customElements.define('ed-quantity-discounts', QuantityDiscounts);

/***/ }),

/***/ "./src/js/modules/ed-video-component.js":
/*!**********************************************!*\
  !*** ./src/js/modules/ed-video-component.js ***!
  \**********************************************/
/***/ (() => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

class EdVideoThumbnail extends HTMLElement {
  constructor() {
    super();

    // SELECTORS
    this.popUp = document.querySelector('.video-popup-container');
    this.popUpVideo = this.popUp.querySelector('.video-container'); // Video container inside popup
    this.openButton = this.querySelector('.btn-open');
    this.closeButton = this.popUp.querySelector('.btn-close');
    this.playButton = this.querySelector('.play-btn');

    // ENABLE EXTERNAL POPUP ELEMENT
    if (this.popUp) {
      document.querySelector('ed-video-popup').setAttribute('enabled', '');
    }

    // SETUP EVENT LISTENERS
    this._attachListeners();
  }

  get videoSrc() {
    return this.getAttribute('video-src') || "";
  }

  _attachListeners() {
    document.addEventListener('keydown', this.closeOnEsc.bind(this));
    this.openButton.addEventListener('click', this.openPopup.bind(this));
    this.playButton.addEventListener('click', this.openPopup.bind(this));
    // this.popUp.addEventListener('click', this.closePopup.bind(this)); // Click outside
    this.closeButton.addEventListener('click', this.closePopup.bind(this));
  }

  openPopup(e) {
    e.stopPropagation();
    this.createVideo();
    this.popUp.classList.add('open');
    document.documentElement.classList.add('ed-video-popup-open');
  }

  closePopup(e) {
    e.stopPropagation();
    this.popUpVideo.innerHTML = ''; // Remove video when closing
    this.popUp.classList.remove('open');
    document.documentElement.classList.remove('ed-video-popup-open');
  }

  closeOnEsc(e) {
    if (e.key === 'Escape') {
      this.popUpVideo.innerHTML = '';
      document.documentElement.classList.remove('ed-video-popup-open');
      this.popUp.classList.remove('open');
    }
  }

  createVideo() {
    this.popUpVideo.innerHTML = ''; // Clear existing content

    const videoUrl = this.videoSrc.trim();
    
    if (this.isYouTubeUrl(videoUrl)) {
      // Create YouTube iframe
      const iframe = document.createElement('iframe');
      iframe.src = this.getYouTubeEmbedUrl(videoUrl);
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.allowFullscreen = true;
      iframe.allow = 'autoplay; encrypted-media';
      this.popUpVideo.appendChild(iframe);
    } else {
      // Create HTML5 video element
      const video = document.createElement('video');
      video.src = videoUrl;
      video.autoplay = true;
      video.controls = true;
      this.popUpVideo.appendChild(video);
    }
  }

  isYouTubeUrl(url) {
    return url.includes('youtube.com/watch?v=') || url.includes('youtu.be/');
  }

  getYouTubeEmbedUrl(url) {
    let videoId;
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = new URL(url).searchParams.get('v');
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
}

customElements.define('ed-video-thumbnail', EdVideoThumbnail);

class EdVideoPopup extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define('ed-video-popup', EdVideoPopup);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/*!**************************!*\
  !*** ./src/js/custom.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_ed_video_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/ed-video-component */ "./src/js/modules/ed-video-component.js");
/* harmony import */ var _modules_ed_video_component__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_modules_ed_video_component__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _modules_ed_quantity_discounts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/ed-quantity-discounts */ "./src/js/modules/ed-quantity-discounts.js");
/* harmony import */ var _modules_ed_quantity_discounts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_modules_ed_quantity_discounts__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _modules_ed_quantity_change_observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/ed-quantity-change-observer */ "./src/js/modules/ed-quantity-change-observer.js");
/*
DO NOT TOUCH THIS FILE OUTSIDE OF /src DIRECTORY
this file gets compiled ./assets/custom.js - make sure to import every module here.
*/



})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************!*\
  !*** ./src/scss/custom.scss ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;