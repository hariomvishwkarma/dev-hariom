/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 91:
/***/ (function() {


//Function: run 3D AR product
const globalShopify = window.Shopify;
class ProductModel extends HTMLElement {
    modelViewerUI;
    constructor() {
        super();
        const poster = this.querySelector('.xb-product-model__poster');
        if (!poster) {
            return;
        }
        poster.addEventListener('click', this.loadContent.bind(this));
    }
    loadContent() {
        if (!this.getAttribute('loaded')) {
            // console.log(this);
            const content = document.createElement('div');
            const currentTemplateEl = this.querySelector('template');
            // console.log(currentTemplateEl);
            if (!!currentTemplateEl) {
                const firstEl = currentTemplateEl.content.firstElementChild;
                // console.log(firstEl);
                if (!!firstEl) {
                    content.appendChild(firstEl.cloneNode(true));
                }
            }
            this.setAttribute('loaded', 'true');
            const viewerEl = content.querySelector('model-viewer');
            // console.log(viewerEl);
            if (viewerEl) {
                const deferredElement = this.appendChild(viewerEl);
                deferredElement.focus();
            }
        }
        globalShopify.loadFeatures([
            {
                name: 'model-viewer-ui',
                version: '1.0',
                onLoad: this.setupModelViewerUI.bind(this),
            },
        ]);
    }
    setupModelViewerUI(errors) {
        if (errors) {
            return;
        }
        this.modelViewerUI = new globalShopify.ModelViewerUI(this.querySelector('model-viewer'));
    }
}
window.customElements.define('xo-product-model', ProductModel);
window.ProductModel = {
    loadShopifyXR() {
        globalShopify.loadFeatures([
            {
                name: 'shopify-xr',
                version: '1.0',
                onLoad: this.setupShopifyXR.bind(this),
            },
        ]);
    },
    setupShopifyXR(errors) {
        if (errors) {
            return;
        }
        if (!window.ShopifyXR) {
            document.addEventListener('shopify_xr_initialized', () => this.setupShopifyXR());
            return;
        }
        const scriptDataEls = document.querySelectorAll('[id^="xo-3d-product-json-"]');
        scriptDataEls.forEach(modelJSON => {
            const data = modelJSON.textContent ?? '{}';
            window.ShopifyXR.addModels(JSON.parse(data));
            modelJSON.remove();
        });
        window.ShopifyXR.setupXRElements();
    },
};
window.addEventListener('DOMContentLoaded', () => {
    if (window.ProductModel) {
        window.ProductModel.loadShopifyXR();
    }
});


/***/ }),

/***/ 152:
/***/ (function() {


//@ts-ignore
const COMPONENT_NAME = 'xo-transform-pill';
class TransformListPill extends HTMLElement {
    title_box = null;
    data_box = null;
    list_title = [];
    constructor() {
        super();
    }
    connectedCallback() {
        this.title_box = this.querySelector('xo-transform-pill-title');
        this.data_box = this.querySelector('xo-transform-pill-data');
        if (this.title_box) {
            this.list_title = Array.from(this.title_box.querySelectorAll('li'));
        }
        if (this.list_title.length) {
            this.createElement();
        }
    }
    createElement() {
        const resultDataTitle = document.createElement('div');
        resultDataTitle.className = 'xo-transform-pill__group';
        for (let i = 0; i < this.list_title.length; i++) {
            const pillEl = document.createElement('a');
            const pillInner = this.list_title[i].innerHTML;
            pillEl.className = 'xo-transform-pill__link';
            pillEl.href = '/search?q=' + pillInner;
            pillEl.innerHTML = pillInner;
            resultDataTitle.appendChild(pillEl);
        }
        if (this.data_box) {
            this.data_box.innerHTML = '';
            this.data_box.appendChild(resultDataTitle);
        }
    }
    disconnectedCallback() {
    }
}
customElements.define(COMPONENT_NAME, TransformListPill);


/***/ }),

/***/ 326:
/***/ (function() {


// Detect if the device is mobile
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const triggers = document.querySelectorAll(".collection-list-5__trigger");
const images = document.querySelectorAll(".collection-list-5__image-container");
let tapTimeout = null;
// Function to update active classes
const updateActiveClass = (index) => {
    triggers.forEach(trigger => trigger.classList.remove("xo-active"));
    images.forEach(image => image.classList.remove("xo-active", "zoom-in"));
    const activeTrigger = triggers[index];
    const activeImage = images[index];
    if (activeTrigger)
        activeTrigger.classList.add("xo-active");
    if (activeImage)
        activeImage.classList.add("xo-active", "zoom-in");
};
// Add event listeners for each trigger based on device type
triggers.forEach((trigger, index) => {
    if (isMobile) {
        // Double-tap handling for mobile
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            if (tapTimeout) {
                clearTimeout(tapTimeout);
                tapTimeout = null;
                window.location.href = trigger.getAttribute("data-collection-link") || "#";
            }
            else {
                tapTimeout = setTimeout(() => {
                    updateActiveClass(index);
                    tapTimeout = null;
                }, 300);
            }
        });
    }
    else {
        // Hover for desktop
        trigger.addEventListener("mouseenter", () => updateActiveClass(index));
    }
});


/***/ }),

/***/ 390:
/***/ (function() {


const COMPONENT_NAME1 = 'xo-transform-list';
class TransformList extends HTMLElement {
    title_box = null;
    content_box = null;
    data_box = null;
    list_title = [];
    list_content = [];
    constructor() {
        super();
    }
    connectedCallback() {
        this.title_box = this.querySelector('xo-transform-list-title');
        this.content_box = this.querySelector('xo-transform-list-content');
        this.data_box = this.querySelector('xo-transform-list-data');
        if (this.title_box) {
            this.list_title = Array.from(this.title_box.querySelectorAll('li'));
        }
        if (this.content_box) {
            this.list_content = Array.from(this.content_box.querySelectorAll('li'));
        }
        if (this.list_title.length && this.list_content.length) {
            this.createTable();
        }
    }
    createTable() {
        const resultDataTitle = document.createElement('table');
        for (let i = 0; i < this.list_title.length; i++) {
            const itemTr = document.createElement('tr');
            const titleTd = document.createElement('td');
            const contentTd = document.createElement('td');
            titleTd.innerHTML = this.list_title[i].innerHTML;
            contentTd.innerHTML = this.list_content[i].innerHTML;
            itemTr.appendChild(titleTd);
            itemTr.appendChild(contentTd);
            resultDataTitle.appendChild(itemTr);
        }
        if (this.data_box) {
            this.data_box.innerHTML = '';
            this.data_box.appendChild(resultDataTitle);
        }
    }
    disconnectedCallback() {
    }
}
customElements.define(COMPONENT_NAME1, TransformList);


/***/ }),

/***/ 439:
/***/ (function() {


document.addEventListener('DOMContentLoaded', function () {
    let form = document.getElementById('ContactFooter');
    let emailInput = document.querySelector("input[name='contact[email]']");
    let errorMessage = document.getElementById('footer__form-message');
    let btnSubmit = document.getElementById('Subscribe');
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailInput && errorMessage && btnSubmit && form) {
        // Kiểm tra khi nhập
        emailInput.addEventListener('input', function () {
            let emailValue = emailInput.value.trim();
            if (!emailPattern.test(emailValue)) {
                errorMessage.style.display = 'flex';
                btnSubmit.disabled = true;
            }
            else {
                errorMessage.style.display = 'none';
                btnSubmit.disabled = false;
            }
        });
        // Kiểm tra khi submit
        form.addEventListener('submit', function (event) {
            let emailValue = emailInput.value.trim();
            if (!emailPattern.test(emailValue)) {
                event.preventDefault();
                errorMessage.style.display = 'flex';
                btnSubmit.disabled = true;
            }
        });
    }
    const sectionFooterEl = document.querySelector('.section-footer');
    const sectionHeaderEl = document.querySelector('.section-header');
    if (sectionFooterEl && sectionHeaderEl) {
        sectionFooterEl.insertAdjacentHTML('beforebegin', "<xo-sticky-hidden xo-name='sticky-cart'></xo-sticky-hidden>");
        if (sectionFooterEl.offsetHeight > window.innerHeight - sectionHeaderEl.offsetHeight) {
            const footerEl = sectionFooterEl.querySelector('.footer');
            if (footerEl) {
                footerEl.classList.remove('footer--fixed');
            }
        }
    }
});


/***/ }),

/***/ 446:
/***/ (function() {


const toggleTrigger = document.querySelector('.product-specification-10__toggle-trigger');
const toggleContent = document.querySelector('.product-specification-10__toggle-content');
const tabTrigger = toggleContent?.querySelectorAll('.product-specification-10__tab-trigger') || [];
const productTitle = toggleTrigger?.querySelector('.product-specification-10__product-title');
const icon = toggleTrigger?.querySelector('.product-specification-10__icon');
function handleActive() {
    if (!toggleContent || !icon)
        return;
    toggleContent.classList.toggle('active');
    icon.classList.toggle('active');
}
function clearActive() {
    if (!toggleContent || !icon)
        return;
    toggleContent.classList.remove('active');
    icon.classList.remove('active');
}
function replaceContent() {
    if (!toggleContent || !productTitle)
        return;
    tabTrigger.forEach((option) => {
        option.addEventListener('click', () => {
            let selectedOption = option.innerText.trim();
            productTitle.innerText = selectedOption;
            clearActive();
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (!toggleTrigger)
        return;
    toggleTrigger.addEventListener('click', () => {
        handleActive();
        replaceContent();
    });
});


/***/ }),

/***/ 549:
/***/ (function() {


const ANNOUNCEMENT_BAR_ID = 'xo-announcement-bar';
const SECTION_ATTR_CLASS = 'xo-section';
const BUUTON_ID = 'xo-announcement-bar__button';
const announcementBarEl = document.querySelector(`#${ANNOUNCEMENT_BAR_ID}`);
const sectionAttrEl = announcementBarEl?.querySelector(`.${SECTION_ATTR_CLASS}`);
const buttonEl = document.querySelector(`#${BUUTON_ID}`);
if (announcementBarEl && buttonEl && sectionAttrEl) {
    buttonEl.addEventListener('click', () => {
        announcementBarEl.style.height = '0';
        sectionAttrEl.style.display = 'none';
    });
    window.addEventListener('load', () => {
        announcementBarEl.style.height = '100%';
        sectionAttrEl.style.display = 'block';
    });
    window.onload = function () {
        announcementBarEl.style.height = '100%';
        sectionAttrEl.style.display = 'block';
    };
}


/***/ }),

/***/ 812:
/***/ (function() {


const SELECTORS = {
    PRICE: '.xo-price__item',
    COMPARE_AT_PRICE: '.xo-price__item.xo-price__item--del',
    BUTTON_ADD: '.shopify-payment-button__add',
    BUTTON_ADD_TEXT: '.xo-btn__text'
};
function updatePrice(targetProductId, price) {
    const priceEls = document.querySelectorAll(`xo-product[xo-product-id="${targetProductId}"] ${SELECTORS.PRICE}`);
    priceEls.forEach(priceEl => {
        priceEl.innerHTML = price;
    });
}
function updateCompareAtPrice(targetProductId, price) {
    const compareAtPriceEls = document.querySelectorAll(`xo-product[xo-product-id="${targetProductId}"] ${SELECTORS.COMPARE_AT_PRICE}`);
    compareAtPriceEls.forEach(compareAtPriceEl => {
        compareAtPriceEl.innerHTML = price;
    });
}
function soldOutMessage(targetProductId, message) {
    const buttonEls = document.querySelectorAll(`xo-product[xo-product-id="${targetProductId}"] ${SELECTORS.BUTTON_ADD}`);
    buttonEls.forEach(buttonEl => {
        const btnTextEl = buttonEl.querySelector(SELECTORS.BUTTON_ADD_TEXT);
        if (btnTextEl) {
            btnTextEl.innerHTML = message;
        }
        buttonEl.style.pointerEvents = 'none';
    });
}
// @ts-ignore
window.Xotiny = window.Xotiny || {};
// @ts-ignore
window.Xotiny.updatePrice = updatePrice;
// @ts-ignore
window.Xotiny.updateCompareAtPrice = updateCompareAtPrice;
// @ts-ignore
window.Xotiny.soldOutMessage = soldOutMessage;


/***/ }),

/***/ 878:
/***/ (function() {


var lastScrollTop = 0;
const sideActionEl = document.querySelector('.side-actions');
window.addEventListener("scroll", function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        sideActionEl?.classList.add('side-actions--hidden');
    }
    else {
        sideActionEl?.classList.remove('side-actions--hidden');
    }
    lastScrollTop = st;
}, false);


/***/ }),

/***/ 903:
/***/ (function() {


function hiddenThumbnails() {
    const thumbnailEl = document.querySelector('.product-info-media-carousel__content');
    const slideEls = document.querySelectorAll('.product-info-media-carousel__thumb-slide').length;
    if (thumbnailEl) {
        if (slideEls == 1) {
            thumbnailEl.classList.add('product-info-media-carousel__content--hidden');
        }
    }
}
document.addEventListener('load', function () {
    hiddenThumbnails();
});
document.addEventListener('change', function () {
    hiddenThumbnails();
});


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

;// ../../packages/utils/src/attrBoolean/index.ts
const attrBoolean = {
    get: (element, attr) => {
        if (element.getAttribute(attr) === 'false') {
            return false;
        }
        return element.hasAttribute(attr);
    },
    set: (element, attr, value) => {
        if (value) {
            element.setAttribute(attr, '');
        }
        else {
            element.removeAttribute(attr);
        }
    },
};

;// ../../packages/utils/src/clamp/index.ts
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

;// ../../packages/utils/src/typeOf/index.ts
function typeOf_typeOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
function primitive(value) {
    return value === null || (typeof value !== 'function' && typeof value !== 'object');
}
typeOf_typeOf.primitive = primitive;

;// ../../packages/utils/src/cloneDeep/index.ts

function cloneDeep_cloneDeep(value) {
    if (typeOf(value) === 'array') {
        return value.map((item) => cloneDeep_cloneDeep(item));
    }
    else if (typeOf(value) === 'object') {
        const result = {};
        for (const key in value) {
            result[key] = cloneDeep_cloneDeep(value[key]);
        }
        return result;
    }
    else {
        return value;
    }
}

;// ../../packages/utils/src/fastLoop/each.ts
function each(array, callback) {
    if (array.length === 0) {
        return;
    }
    for (let i = 0; i < array.length; i++) {
        callback(array[i], i, array);
    }
}

;// ../../packages/utils/src/objectKeys/index.ts
const objectKeys = (obj) => {
    return Object.keys(obj);
};

;// ../../packages/utils/src/componentDefine/index.ts


function componentDefine(components, options) {
    each(objectKeys(components), (name) => {
        if (!customElements.get(name)) {
            customElements.define(name, components[name], options);
        }
    });
}

;// ../../packages/utils/src/delay/index.ts
function delay(ms = 0) {
    return new Promise((resolve) => {
        const timeId = window.setTimeout(() => {
            const clear = () => window.clearTimeout(timeId);
            resolve(clear);
            clearTimeout(timeId);
        }, ms);
    });
}

;// ../../packages/utils/src/easings/index.ts
const easings = {
    linear: (t) => t,
    ease: (t) => 0.5 * (1 - Math.cos(Math.PI * t)),
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - --t * t * t * t,
    easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => 1 + --t * t * t * t * t,
    easeInOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),
    easeOutBounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return n1 * t * t;
        }
        if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        }
        if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        }
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
    easeInBounce: (t) => 1 - easings.easeOutBounce(1 - t),
    easeOutBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
    },
    easeInBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
    },
    easeInOut: (t) => (t < 0.5 ? easings.easeInBack(t * 2) / 2 : easings.easeOutBack(t * 2 - 1) / 2 + 0.5),
    easeInElastic: (t) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * c4);
    },
    easeOutElastic: (t) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    easeInExpo: (t) => (t === 0 ? 0 : 2 ** (10 * t - 10)),
    easeOutExpo: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
    spring: (t) => 1 - Math.cos(t * 4.5 * Math.PI) * Math.exp(-t * 6),
    decay: (t) => 1 - Math.exp(-t * 6),
};

;// ../../packages/utils/src/equal/index.ts

function equal_equal(object1, object2) {
    if (typeOf.primitive(object1) || typeOf.primitive(object1) || object1 == null || object2 == null) {
        return object1 === object2;
    }
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        if (typeof val1 === 'object' && typeof val2 === 'object') {
            if (!equal_equal(val1, val2)) {
                return false;
            }
        }
        else if (val1 !== val2) {
            return false;
        }
    }
    return true;
}

;// ../../packages/utils/src/fastLoop/filter.ts
function filter_filter(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
}

;// ../../packages/utils/src/fastLoop/reduce.ts
function reduce(array, callback, initialValue) {
    let accumulator = initialValue;
    for (let i = 0; i < array.length; i++) {
        accumulator = callback(accumulator, array[i], i, array);
    }
    return accumulator;
}

;// ../../packages/utils/src/fastLoop/index.ts






;// ../../packages/utils/src/frameManager/index.ts

class FrameManager {
    frameId;
    keepAliveFrameId;
    lastTimestamp;
    frames;
    keepAliveFrames;
    defaultTimestep;
    constructor() {
        this.frameId = null;
        this.keepAliveFrameId = null;
        this.lastTimestamp = null;
        this.frames = [];
        this.keepAliveFrames = [];
        this.defaultTimestep = (1 / 60) * 1000;
    }
    handleFrameLoop = (timestamp) => {
        if (this.lastTimestamp) {
            const delta = timestamp - this.lastTimestamp;
            each(this.keepAliveFrames, (frame) => frame.call(this, { delta, timestamp }));
        }
        this.lastTimestamp = timestamp;
        if (this.keepAliveFrameId) {
            cancelAnimationFrame(this.keepAliveFrameId);
        }
        this.keepAliveFrameId = requestAnimationFrame(this.handleFrameLoop);
    };
    handleFrame = (timestamp) => {
        each(this.frames, (frame) => frame.call(this, { delta: this.defaultTimestep, timestamp }));
    };
    getFrames = () => this.frames;
    add = (frame, keepAlive = false) => {
        this.cancelFrame();
        if (!this.frames.includes(frame)) {
            this.frames.push(frame);
        }
        if (keepAlive && !this.keepAliveFrames.includes(frame)) {
            this.keepAliveFrames.push(frame);
        }
        this.start();
        return this;
    };
    start = () => {
        this.frameId = requestAnimationFrame(this.handleFrame);
        this.keepAliveFrameId = requestAnimationFrame(this.handleFrameLoop);
    };
    cancelFrame = () => {
        if (this.frameId != null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        if (this.keepAliveFrameId != null) {
            cancelAnimationFrame(this.keepAliveFrameId);
            this.keepAliveFrameId = null;
        }
    };
    stopFrame = (frames, frame) => {
        const taskIndex = frames.indexOf(frame);
        if (taskIndex !== -1) {
            frames.splice(taskIndex, 1);
        }
        if (frames.length === 0) {
            this.cancelFrame();
            this.lastTimestamp = null;
        }
    };
    remove = (frame) => {
        this.stopFrame(this.frames, frame);
        this.stopFrame(this.keepAliveFrames, frame);
        return this;
    };
    clear = () => {
        this.frames = [];
        this.keepAliveFrames = [];
        this.cancelFrame();
        this.lastTimestamp = null;
        return this;
    };
}
const frameManager = new FrameManager();

;// ../../packages/utils/src/fastLoop/map.ts
function map(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i, array));
    }
    return result;
}

;// ../../packages/utils/src/namingConvention/index.ts
function snakeToCamel(value) {
    return value.replace(/([_]\w)/g, (g) => g[1].toUpperCase());
}
function snakeToPascal(value) {
    // eslint-disable-next-line no-useless-escape
    return value.replace(/(\-\w|\_\w)/g, (g) => g[1].toUpperCase()).replace(/^(\w)/, (g) => g[0].toUpperCase());
}
function camelToSnake(value) {
    return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
function camelToPascal(value) {
    return value.replace(/^(\w)/, (g) => g[0].toUpperCase());
}
function pascalToSnake(value) {
    return camelToSnake(value).replace(/^_/g, '');
}
function pascalToCamel(value) {
    return value.replace(/^(\w)/, (g) => g[0].toLowerCase());
}
function kebabToCamel(value) {
    return value.replace(/([-]\w)/g, (g) => g[1].toUpperCase());
}
function kebabToPascal(value) {
    return value.replace(/([-]\w)/g, (g) => g[1].toUpperCase()).replace(/^(\w)/, (g) => g[0].toUpperCase());
}
function camelToKebab(value) {
    return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
function pascalToKebab(value) {
    return camelToKebab(value).replace(/^-/g, '');
}
const namingConvention = {
    snakeToCamel,
    snakeToPascal,
    camelToSnake,
    camelToPascal,
    pascalToSnake,
    pascalToCamel,
    kebabToCamel,
    kebabToPascal,
    camelToKebab,
    pascalToKebab,
};

;// ../../packages/utils/src/objectParse/index.ts
function objectParse(value) {
    const val = value.trim();
    if (/^{|\[/g.test(val)) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            const fn = new Function(`return ${val}`);
            const obj = fn();
            return JSON.parse(JSON.stringify(obj));
        }
        catch {
            if (/^\[/g.test(val)) {
                return [];
            }
            return {};
        }
    }
    else {
        return {};
    }
}

;// ../../packages/utils/src/getAttrs/index.ts



function getValue(value, type) {
    switch (type) {
        case 'string':
            return value;
        case 'number':
            return Number(value);
        case 'string | number': {
            const number = Number(value);
            return isNaN(number) ? value : number;
        }
        case 'boolean':
            return value === 'true' || value === '';
        case 'object':
            return objectParse(value);
        case 'array':
            return objectParse(value);
        default:
            return value;
    }
}
/**
 * @description Get attributes from HTMLElement
 * @example
 * ```html
 * <div class="element" name="Foo" age="20" first-name="Bar"></div>
 * ```
 * @example
 * ```ts
 * import { getAttrs } from 'getAttrs';
 * const element = document.createElement('.element');
 * interface ElementAttrs {
 *   name: string;
 *   age: number;
 *   // Chú ý thuộc tính snake sẽ chuyển sang camel
 *   firstName: string;
 * }
 * const attrs = getAttrs(element, {
 *   // Các kiểu dữ liệu của các trường sẽ được convert sang
 *   types: {
 *     name: 'string',
 *     age: 'number',
 *     firstName: 'string'
 *   },
 *   // Các attr sẽ được lấy
 *   pick: ['name', 'age', 'firstName']
 * });
 * ```
 */
function getAttrs(el, { pick, types, camelCase = true, propTransformer } = {}) {
    let result = {};
    if (el == null) {
        return result;
    }
    const attrs = Array.from(el.attributes);
    if (pick == null) {
        pick = map(attrs, (attr) => attr.name);
    }
    for (const attr of attrs) {
        let name = camelCase ? namingConvention.kebabToCamel(attr.name) : attr.name;
        const type = types?.[name];
        if (attr.value != null && pick?.includes(name)) {
            if (typeof propTransformer === 'function') {
                name = propTransformer(name);
            }
            if (!!types && type != null) {
                result = { ...result, [name]: getValue(attr.value, type) };
            }
            else {
                result = { ...result, [name]: attr.value };
            }
        }
    }
    return result;
}

;// ../../packages/utils/src/interpolate/index.ts

function interpolate({ inputRange, outputRange, value, easing = (value) => value, reverseEasing = false, extrapolate = 'extend' }) {
    const sortedRanges = map(inputRange, (_, i) => ({ input: inputRange[i], output: outputRange[i] })).sort((a, b) => a.input - b.input);
    const sortedInputRange = map(sortedRanges, ({ input }) => input);
    const sortedOutputRange = map(sortedRanges, ({ output }) => output);
    if (value <= sortedInputRange[0]) {
        return sortedOutputRange[0];
    }
    if (value >= sortedInputRange[sortedInputRange.length - 1]) {
        return sortedOutputRange[sortedOutputRange.length - 1];
    }
    let i = 0;
    for (const inputValue of sortedInputRange) {
        if (inputValue < value) {
            i++;
        }
    }
    const j = i - 1;
    let ratio = (value - sortedInputRange[j]) / (sortedInputRange[i] - sortedInputRange[j]);
    if (typeof easing === 'function') {
        if (reverseEasing) {
            ratio = 1 - easing(1 - ratio);
        }
        else {
            ratio = easing(ratio);
        }
    }
    if (extrapolate === 'clamp') {
        ratio = Math.max(Math.min(ratio, 1), 0);
    }
    return sortedOutputRange[j] * (1 - ratio) + sortedOutputRange[i] * ratio;
}

;// ../../packages/utils/src/DOMLoaded/index.ts
function DOMLoaded(callback) {
    if (/comp|inter/.test(document.readyState)) {
        callback();
    }
    else if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', callback);
    }
    else {
        // @ts-ignore
        document.attachEvent('onreadystatechange', () => {
            if (document.readyState === 'complete') {
                callback();
            }
        });
    }
}

;// ../../packages/utils/src/isMobile/index.ts

const isMobile = {
    android: !!navigator.userAgent.match(/Android/i),
    blackBerry: !!navigator.userAgent.match(/BlackBerry/i),
    ipad: !!navigator.userAgent.match(/iPad/i),
    iOS: !!navigator.userAgent.match(/iPhone|iPad|iPod/i),
    opera: !!navigator.userAgent.match(/Opera Mini/i),
    windows: !!navigator.userAgent.match(/Windows Phone/i),
    amazonePhone: !!navigator.userAgent.match(/(?:SD4930UR|\\bSilk(?:.+)Mobile\\b)/i),
    amazoneTablet: !!navigator.userAgent.match(/Silk/i),
    any: !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|Windows Phone|(?:SD4930UR|\bSilk(?:.+)Mobile\b)|Silk/i),
};
DOMLoaded(() => {
    const htmlEl = document.documentElement;
    if (isMobile.any) {
        htmlEl.classList.add('is-mobile');
    }
    else {
        htmlEl.classList.add('is-desktop');
    }
});

;// ../../packages/utils/src/objectValues/index.ts
const objectValues = (obj) => {
    return Object.values(obj);
};

;// ../../packages/utils/src/offset/index.ts
function getWindow(el) {
    return (el.nodeType === 9 && el.defaultView);
}
function offset(el) {
    const doc = el?.ownerDocument;
    const docElem = doc.documentElement;
    const win = getWindow(doc);
    let box = { top: 0, left: 0 };
    if (!doc) {
        return {
            top: 0,
            left: 0,
        };
    }
    if (typeof el.getBoundingClientRect !== typeof undefined) {
        box = el.getBoundingClientRect();
    }
    return {
        top: box.top + win.scrollY - docElem.clientTop,
        left: box.left + win.scrollX - docElem.clientLeft,
    };
}

;// ../../packages/utils/src/panGesture/index.ts

class PanGesture {
    dx;
    dy;
    vx = 0;
    vy = 0;
    isStart = false;
    startX = 0;
    startX2 = 0;
    startY = 0;
    startY2 = 0;
    options;
    constructor(options) {
        this.options = options;
        this.dx = options.dx || 0;
        this.dy = options.dy || 0;
        options.element.addEventListener('mousedown', this.handleMouseDown);
        if (isMobile.any) {
            options.element.addEventListener('touchstart', this.handleMouseDown);
        }
    }
    handleMouseDown = (event) => {
        const { onStart } = this.options;
        if (event.type === 'touchstart' && event.touches.length > 1) {
            return;
        }
        if (event.type === 'mousedown' && event.button !== 0) {
            return;
        }
        const target = event.target;
        if (!isMobile.any && (target.closest('a') || target.closest('img'))) {
            event.preventDefault();
        }
        this.isStart = true;
        if (event.type === 'touchstart') {
            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
            this.startX2 = event.touches[0].clientX;
            this.startY2 = event.touches[0].clientY;
        }
        else {
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.startX2 = event.clientX;
            this.startY2 = event.clientY;
        }
        onStart?.(event);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('touchmove', this.handleMouseMove, { passive: false });
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('touchend', this.handleMouseUp);
    };
    handleMouseMove = (event) => {
        const { onMove } = this.options;
        if (event.type === 'touchmove' && event.touches.length > 1) {
            return;
        }
        if (event.type === 'mousemove' && event.button !== 0) {
            return;
        }
        if (!isMobile.any) {
            event.preventDefault();
        }
        if (!this.isStart) {
            return;
        }
        let currentX;
        let currentY;
        if (event.type === 'touchmove') {
            currentX = event.touches[0].clientX;
            currentY = event.touches[0].clientY;
        }
        else {
            currentX = event.clientX;
            currentY = event.clientY;
        }
        const dx = currentX - this.startX;
        const dy = currentY - this.startY;
        this.startX = currentX;
        this.startY = currentY;
        this.dx += dx;
        this.dy += dy;
        this.vx = dx;
        this.vy = dy;
        onMove?.({
            dx: this.dx,
            dy: this.dy,
            vx: this.vx,
            vy: this.vy,
            isHorizontalSwipe: Math.abs(currentX - this.startX2) > Math.abs(currentY - this.startY2),
        }, event);
    };
    handleEnd = (event, gestureState) => {
        const { onEnd } = this.options;
        if (!this.isStart) {
            return;
        }
        this.isStart = false;
        if (!!gestureState) {
            this.dx = gestureState.dx;
            this.dy = gestureState.dy;
            this.vx = gestureState.vx;
            this.vy = gestureState.vy;
        }
        onEnd?.({
            dx: this.dx,
            dy: this.dy,
            vx: this.vx,
            vy: this.vy,
        }, event);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchmove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('touchend', this.handleMouseUp);
    };
    handleMouseUp = (event) => {
        if (!isMobile.any) {
            event.preventDefault();
        }
        this.handleEnd(event);
    };
    setValue = ({ dx, dy }) => {
        if (dx != null) {
            this.dx = dx;
        }
        if (dy != null) {
            this.dy = dy;
        }
    };
    destroy = () => {
        this.options.element.removeEventListener('mousedown', this.handleMouseDown);
        this.options.element.removeEventListener('touchstart', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchmove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('touchend', this.handleMouseUp);
    };
}
function panGesture(options) {
    return new PanGesture(options);
}

;// ../../packages/utils/src/queryString/index.ts
function parse(value, isObject = false) {
    const result = isObject ? {} : [];
    const params = new URLSearchParams(value);
    for (const pair of params.entries()) {
        if (isObject) {
            const [key, value] = pair;
            result[key] = value;
        }
        else {
            result.push([pair[0], pair[1]]);
        }
    }
    return result;
}
function stringify(value) {
    const params = new URLSearchParams(value);
    return params
        .toString()
        .replace(/&/g, '&\n')
        .replace(/\w.*=&?$/gm, '')
        .replace(/\n+/g, '')
        .replace(/&$/g, '');
}
const queryString = {
    parse,
    stringify,
};

;// ../../packages/utils/src/storage/index.ts
function createStore() {
    let checked = false;
    const storageAvailable = () => {
        if (!checked) {
            checked = true;
            const item = '@xoLocalStorageCheck';
            try {
                window.localStorage.setItem(item, item);
                window.localStorage.removeItem(item);
                return true;
            }
            catch {
                return false;
            }
        }
        return true;
    };
    const createStorage = () => {
        if (storageAvailable()) {
            return window.localStorage;
        }
        return {
            getItem() {
                return null;
            },
            setItem() { },
            removeItem() { },
            clear() { },
            key() {
                return null;
            },
            length: 0,
        };
    };
    const storage = createStorage();
    return storage;
}
const storage_storage = createStore();

;// ../../packages/utils/src/throwError/index.ts
function throwError(message, example) {
    if (!window.xbEditor?.designMode) {
        throw new Error(`${message}\n\n${example ? `Example:\n${example}` : ''}`);
    }
    else {
        console.warn(`${message}\n\n${example ? `Example:\n${example}` : ''}`);
    }
}

;// ../../packages/utils/src/XOStore/implement.ts




class XOStore {
    _store;
    _prevStore;
    _options;
    _listeners;
    _storageRegisters;
    _useDeepEquals;
    constructor(options = {}) {
        this._store = {};
        this._prevStore = {};
        this._listeners = {};
        this._storageRegisters = {};
        this._options = {
            logger: options.logger || false,
            loggerCollapsed: options.loggerCollapsed || false,
            storagePrefix: options.storagePrefix ? `${options.storagePrefix}/` : '',
        };
        this._useDeepEquals = {};
    }
    static logger(actionName, nextState, stateName, collapsed = false, prevStore, nextStore) {
        const date = new Date();
        const hour = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const stateNameAssign = stateName;
        const space = stateNameAssign.length < 9
            ? Array(9 - stateNameAssign.length)
                .fill(' ')
                .join('')
            : '';
        // eslint-disable-next-line no-console
        console[collapsed ? 'groupCollapsed' : 'group'](`%c XOStore: ${actionName}`, 'color: #614eff', `@${hour}`);
        if (prevStore) {
            // eslint-disable-next-line no-console
            console.log('%c Prev Store ', 'color: #999; font-weight: 600', prevStore);
        }
        // eslint-disable-next-line no-console
        console.log(`%c ${stateNameAssign}  ${space}`, 'color: #44b0e2; font-weight: 600', nextState);
        if (nextStore) {
            // eslint-disable-next-line no-console
            console.log('%c Next Store ', 'color: #7ac143; font-weight: 600', nextStore);
        }
        // eslint-disable-next-line no-console
        console.groupEnd();
    }
    _handleListeners = (stateName) => {
        if (this._listeners[stateName]) {
            const next = this.get(stateName);
            for (let i = 0; i < this._listeners[stateName].length; i++) {
                const { equal, listener } = this._listeners[stateName][i];
                if (!equal) {
                    listener(next);
                }
                else {
                    const prev = cloneDeep(this._prevStore[stateName]);
                    if (!equal(prev, next)) {
                        listener(next);
                    }
                }
            }
        }
    };
    _getState = (stateName, initialState) => {
        const { storagePrefix } = this._options;
        const stateStr = storage.getItem(`${storagePrefix}${stateName}`);
        if (stateStr != null && stateStr !== undefined && this._storageRegisters[stateName]) {
            return JSON.parse(stateStr);
        }
        return initialState;
    };
    _setStorage = (stateName, state) => {
        if (!!stateName && state !== undefined && this._storageRegisters[stateName]) {
            const { storagePrefix } = this._options;
            const stateStr = JSON.stringify(state);
            storage.setItem(`${storagePrefix}${stateName}`, stateStr);
        }
    };
    _set = (stateName, nextState) => {
        const { logger, loggerCollapsed } = this._options;
        const cond = this._useDeepEquals[stateName] ? !equal(this._store[stateName], nextState) : this._store[stateName] !== nextState;
        if (cond) {
            this._prevStore[stateName] = cloneDeep(this._store[stateName]);
            this._store[stateName] = nextState;
            this._setStorage(stateName, nextState);
            this._handleListeners(stateName);
            if (logger) {
                return (actionName) => {
                    XOStore.logger(actionName, nextState, stateName, loggerCollapsed, this._prevStore, this._store);
                };
            }
        }
        return () => { };
    };
    get(stateName) {
        if (stateName) {
            return this._store[stateName];
        }
        return this._store;
    }
    create = (stateName, { initialState, useStorage, useDeepEqual }) => {
        const { logger, loggerCollapsed, storagePrefix } = this._options;
        if (!this._store[stateName]) {
            this._storageRegisters[stateName] = useStorage;
            if (!this._getState(stateName, initialState)) {
                this._setStorage(stateName, initialState);
            }
            this._store[stateName] = this._getState(stateName, initialState);
            if (!useStorage) {
                storage.removeItem(`${storagePrefix}${stateName}`);
            }
            this._handleListeners(stateName);
            if (logger) {
                XOStore.logger('@store/initialState', initialState, stateName, loggerCollapsed);
            }
        }
        if (!this._useDeepEquals[stateName]) {
            this._useDeepEquals[stateName] = !!useDeepEqual;
        }
    };
    set(stateName, state) {
        if (typeof state === 'function') {
            const callback = state;
            const prevState = this._store[stateName];
            return this._set(stateName, callback(prevState));
        }
        return this._set(stateName, state);
    }
    subscribe(stateName, listener, equal) {
        this._listeners[stateName] = this._listeners[stateName] || [];
        this._listeners[stateName].push({
            listener,
            equal,
        });
        // Kiểm tra xem trong store đã tồn tại stateName chưa
        if (Object.keys(this._store).includes(stateName)) {
            // Nếu subscribe được gọi sau khi create hoặc set thì vẫn lấy được giá trị ngay
            const next = this.get(stateName);
            const prev = cloneDeep(this._prevStore[stateName]);
            if (!equal) {
                listener(next);
            }
            else {
                if (!equal(prev, next)) {
                    listener(next);
                }
            }
        }
        return () => {
            this._listeners[stateName] = filter(this._listeners[stateName], ({ listener: _listener }) => _listener !== listener);
        };
    }
}

;// ../../packages/utils/src/XOStore/index.ts



;// ../../packages/utils/src/wrapAroundRange/index.ts
function wrapAroundRange(value, min, max) {
    let range = max - min + 1;
    let result = (((value - min) % range) + range) % range;
    return result;
}

;// ../../packages/utils/src/Component/Component.ts



class XoComponent extends HTMLElement {
    constructor() {
        super();
    }
    $attributeObserver$ = null;
    static defaultProps = {};
    static propTypes = {};
    static observedProps = [];
    props = {};
    state = {};
    _setProps = () => {
        const propTypes = this.__proto__.constructor.propTypes;
        const defaultProps = this.__proto__.constructor.defaultProps;
        const props = getAttrs(this, {
            pick: Object.keys(propTypes),
            types: propTypes,
        });
        this.props = {
            ...defaultProps,
            ...props,
        };
    };
    setState(state) {
        const prevState = this.state;
        const isObject = typeof state === 'object' && !Array.isArray(state) && state !== null;
        if (isObject) {
            this.state = {
                ...this.state,
                ...state,
            };
        }
        else if (typeof state === 'function') {
            this.state = {
                ...this.state,
                ...state(prevState),
            };
        }
        this.stateUpdate(prevState);
    }
    setProps(prop) {
        const prevProps = this.props;
        const isObject = typeof prop === 'object' && !Array.isArray(prop) && prop !== null;
        if (isObject) {
            this.props = {
                ...this.props,
                ...prop,
            };
        }
        else if (typeof prop === 'function') {
            this.props = {
                ...this.props,
                ...prop(prevProps),
            };
        }
        Object.entries(this.props).forEach(([key, value]) => {
            const attrName = key.includes('-') ? key : namingConvention.camelToKebab(key);
            if (typeof value === 'boolean') {
                attrBoolean.set(this, attrName, value);
            }
            else if (value == null) {
                this.removeAttribute(attrName);
            }
            else {
                this.setAttribute(attrName, typeof value === 'string' ? value : JSON.stringify(value));
            }
        });
    }
    handlePropUpdate = () => {
        const observedProps = this.__proto__.constructor.observedProps;
        if (!observedProps || !observedProps.length) {
            return;
        }
        this.$attributeObserver$ = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const attrName = mutation.attributeName;
                if (attrName && mutation.type === 'attributes') {
                    const propName = namingConvention.kebabToCamel(attrName);
                    const prevProp = mutation.oldValue;
                    const nextProp = this.getAttribute(attrName);
                    if (observedProps.includes(propName) && prevProp !== nextProp) {
                        this._setProps();
                        this.propUpdate({ name: propName, prevProp, nextProp });
                    }
                }
            });
        });
        this.$attributeObserver$.observe(this, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: observedProps.map((key) => namingConvention.camelToKebab(key)),
        });
    };
    // @ts-ignore
    connectedCallback() {
        this._setProps();
        this.setProps({});
        this.mount();
        this.handlePropUpdate();
    }
    // @ts-ignore
    disconnectedCallback() {
        this.$attributeObserver$?.disconnect();
        this.unmount();
    }
    emit(type, eventInitDict) {
        const event = new CustomEvent(type, eventInitDict);
        this.dispatchEvent(event);
        return event;
    }
    // @ts-ignore
    stateUpdate(prevState) { }
    // @ts-ignore
    propUpdate({ name, prevProp, nextProp }) { }
    mount() { }
    unmount() { }
}

;// ../../packages/utils/src/Component/customElements.ts
function customElements_customElements(name, options) {
    return (target) => {
        if (!window.customElements.get(name)) {
            window.customElements.define(name, target, options);
        }
    };
}

;// ../../packages/utils/src/Component/index.ts



;// ../../packages/utils/src/getRootRoute/index.ts
function getRootRoute(value) {
    const root = window.Shopify?.routes?.root;
    if (root && value && !value.includes(':') && !value.startsWith(root.replace(/\/$/g, '')) && value.startsWith('/') && !value.startsWith('//')) {
        return `${root}${value.replace(/^\//g, '')}`;
    }
    return value;
}

;// ../../packages/utils/src/index.ts





















































;// ../../packages/plugins/src/xbHref/index.ts


function xbHref() {
    if (!window.xbEditor?.designMode) {
        window.addEventListener('click', (event) => {
            const targetEl = event.target;
            const anchorEl = targetEl.closest('[xb-href]');
            const href = anchorEl?.getAttribute('xb-href');
            if (href) {
                event.preventDefault();
                const isBlank = anchorEl.getAttribute('xb-target') === '_blank' || event.ctrlKey || event.metaKey;
                if (isBlank) {
                    window.open(getRootRoute(href), '_blank');
                }
                else {
                    window.location.href = getRootRoute(href);
                }
            }
        });
    }
}
xbHref();

;// ../../packages/plugins/src/parallaxScroll/lerp.ts
const lerp = (p1, p2, t) => {
    return p1 + (p2 - p1) * t;
};

;// ../../packages/plugins/src/parallaxScroll/item.ts


const EMPTY = '===empty===';
const DEFAULT_FPS = 60;
const DT_FPS = 1000 / DEFAULT_FPS;
const MIN = 0;
const MAX = 100;
const UNIT_PATTERN = /(px|%|vh|vw|em|rem|pt|cm|mm|in|pc|ex|ch|vmin|vmax|lh|rlh|vb|vi|svw|svh|lvw|lvh|dvw|dvh|deg)/g;
class ParallaxScrollItem {
    el;
    cloneEl;
    options;
    contextOptions;
    currentValue;
    targetValue;
    constructor(el, options, contextOptions) {
        this.el = el;
        this.cloneEl = this.el.cloneNode();
        this.options = options;
        this.contextOptions = contextOptions;
        this.currentValue = 0;
        this.targetValue = 0;
        frameManager.add(this.handleFrameSyncUpdate, true);
    }
    getInputRange() {
        const { keyframes } = this.options;
        return reduce(objectKeys(keyframes), (arr, item) => {
            const val = Number(item.replace('%', ''));
            if (isNaN(val)) {
                return arr;
            }
            return [...arr, val];
        }, []).sort((a, b) => a - b);
    }
    getKeyframesByProp(prop) {
        const { keyframes } = this.options;
        const inputRange = this.getInputRange();
        if (Math.max(...inputRange) > 100) {
            throwError('Max value of input range must be less than 100%');
        }
        let prevVal = null;
        return reduce(inputRange, (arr, item) => {
            const key = `${item}%`;
            const val = keyframes[key][prop];
            if (val != null) {
                arr.push(String(val));
            }
            prevVal = arr[arr.length - 1];
            if (val == null && prevVal != null) {
                arr.push(prevVal);
            }
            return arr;
        }, []);
    }
    getDefaultUnit(prop) {
        switch (prop) {
            case 'x':
            case 'y':
            case 'width':
            case 'height':
            case 'backgroundPositionY':
            case 'blur':
            case 'borderRadius':
                return 'px';
            case 'rotate':
            case 'rotateX':
            case 'rotateY':
            case 'skew':
            case 'skewX':
            case 'skewY':
            case 'hueRotate':
                return 'deg';
            case 'backgroundSizeX':
            case 'backgroundSizeY':
            case 'grayscale':
                return '%';
            case 'scale':
            case 'scaleX':
            case 'scaleY':
            case 'opacity':
            case 'videoTime':
            case 'brightness':
            case 'contrast':
            default:
                return '';
        }
    }
    interpolate(value, prop) {
        const outputRange = this.getKeyframesByProp(prop);
        const unit = String(outputRange[0]).replace(/[0-9.,-]/g, '');
        const outputRangeNumber = outputRange.map((item) => Number(String(item).replace(UNIT_PATTERN, '')));
        if (outputRange.length === 0) {
            return EMPTY;
        }
        const result = interpolate({ value, inputRange: this.getInputRange(), outputRange: outputRangeNumber });
        return `${result}${unit || this.getDefaultUnit(prop)}`;
    }
    setStyles(el, value) {
        const { setStyles } = this.contextOptions;
        const x = this.interpolate(value, 'x');
        const y = this.interpolate(value, 'y');
        const rotate = this.interpolate(value, 'rotate');
        const rotateX = this.interpolate(value, 'rotateX');
        const rotateY = this.interpolate(value, 'rotateY');
        const scale = this.interpolate(value, 'scale');
        const scaleX = this.interpolate(value, 'scaleX');
        const scaleY = this.interpolate(value, 'scaleY');
        const skew = this.interpolate(value, 'skew');
        const skewX = this.interpolate(value, 'skewX');
        const skewY = this.interpolate(value, 'skewY');
        const opacity = this.interpolate(value, 'opacity');
        const borderRadius = this.interpolate(value, 'borderRadius');
        const width = this.interpolate(value, 'width');
        const height = this.interpolate(value, 'height');
        const brightness = this.interpolate(value, 'brightness');
        const contrast = this.interpolate(value, 'contrast');
        const hueRotate = this.interpolate(value, 'hueRotate');
        const blur = this.interpolate(value, 'blur');
        const grayscale = this.interpolate(value, 'grayscale');
        const backgroundPositionY = this.interpolate(value, 'backgroundPositionY');
        const backgroundSizeX = this.interpolate(value, 'backgroundSizeX');
        const backgroundSizeY = this.interpolate(value, 'backgroundSizeY');
        const videoTime = this.interpolate(value, 'videoTime');
        const groupImg = this.interpolate(value, 'groupImg');
        const filterArr = [];
        el.style.transform = filter_filter([
            `translateX(${x})`,
            `translateY(${y})`,
            `rotate(${rotate})`,
            `rotateX(${rotateX})`,
            `rotateY(${rotateY})`,
            `scale(${scale})`,
            `scaleX(${scaleX})`,
            `scaleY(${scaleY})`,
            `skew(${skew})`,
            `skewX(${skewX})`,
            `skewY(${skewY})`,
        ], (item) => !!item && !item.includes(EMPTY)).join(' ');
        if (width !== EMPTY) {
            el.style.width = `${width}`;
        }
        if (height !== EMPTY) {
            el.style.height = `${height}`;
        }
        if (opacity !== EMPTY) {
            el.style.opacity = `${opacity}`;
        }
        if (borderRadius !== EMPTY) {
            el.style.borderRadius = `${borderRadius}`;
        }
        if (brightness !== EMPTY) {
            filterArr.push(`brightness(${brightness})`);
        }
        if (contrast !== EMPTY) {
            filterArr.push(`contrast(${contrast})`);
        }
        if (hueRotate !== EMPTY) {
            filterArr.push(`hue-rotate(${hueRotate})`);
        }
        if (blur !== EMPTY) {
            filterArr.push(`blur(${blur})`);
        }
        if (grayscale !== EMPTY) {
            filterArr.push(`grayscale(${grayscale})`);
        }
        if (filterArr.length > 0) {
            el.style.filter = filterArr.join(' ');
        }
        if (backgroundPositionY !== EMPTY) {
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            if (isMobile.iOS) {
                el.style.backgroundPosition = `50% calc(${backgroundPositionY} * -1)`;
            }
            else {
                el.style.backgroundAttachment = 'fixed';
                el.style.backgroundPosition = `50% ${backgroundPositionY}`;
            }
        }
        if (backgroundSizeX !== EMPTY && backgroundSizeY === EMPTY) {
            el.style.backgroundSize = `${backgroundSizeX} 100%`;
        }
        if (backgroundSizeX === EMPTY && backgroundSizeY !== EMPTY) {
            el.style.backgroundSize = `100% ${backgroundSizeY}`;
        }
        if (backgroundSizeX !== EMPTY && backgroundSizeY !== EMPTY) {
            el.style.backgroundSize = `${backgroundSizeX} ${backgroundSizeY}`;
        }
        if (videoTime !== EMPTY) {
            const videoEl = el.querySelector('video');
            if (videoEl && videoEl.duration) {
                const currentTime = interpolate({
                    value: Number(videoTime.replace(UNIT_PATTERN, '')),
                    inputRange: [0, 100],
                    outputRange: [0, videoEl.duration],
                });
                videoEl.currentTime = currentTime;
            }
        }
        if (groupImg !== EMPTY) {
            if (window.getComputedStyle(el).position === 'static') {
                el.style.position = 'relative';
            }
            const imageEls = Array.from(el.querySelectorAll('img'));
            const currentIndex = Math.floor(interpolate({
                value: Number(groupImg.replace(UNIT_PATTERN, '')),
                inputRange: [0, 100],
                outputRange: [0, imageEls.length - 1],
            }));
            each(imageEls, (imageEl, index) => {
                imageEl.style.opacity = index === currentIndex ? '1' : '0';
            });
        }
        if (setStyles) {
            setStyles({
                element: el,
                createValue: (prop) => this.interpolate(value, prop),
                EMPTY,
            });
        }
    }
    handleFrameSyncUpdate = ({ delta }) => {
        const { lerpEase } = this.contextOptions;
        const diff = Math.abs(this.targetValue - this.currentValue);
        // Don't update if difference is too low
        if (diff < 0.001) {
            return;
        }
        let slowDownFactor = delta / DT_FPS;
        const slowDownFactorRounded = Math.round(slowDownFactor);
        if (slowDownFactorRounded >= 1) {
            slowDownFactor = slowDownFactorRounded;
        }
        const value = lerp(this.currentValue, this.targetValue, lerpEase * slowDownFactor);
        this.setStyles(this.el, value);
        this.currentValue = value;
    };
    handleParallax() {
        const start = window.scrollY - this.getFrom();
        const end = this.getTo() - this.getFrom();
        const value = clamp((start / end) * 100, MIN, MAX);
        if (value >= MIN && value <= MAX) {
            this.targetValue = value;
        }
    }
    getFrom() {
        const { from } = this.options;
        if (typeof from === 'function') {
            return from();
        }
        return from;
    }
    getTo() {
        const { to } = this.options;
        if (typeof to === 'function') {
            return to();
        }
        return to;
    }
    destroy = () => {
        if (this.el) {
            const { style } = this.cloneEl;
            this.el.removeAttribute('style');
            each(Array.from(style), (prop) => {
                const val = style[prop];
                this.el.style[prop] = val;
            });
            frameManager.remove(this.handleFrameSyncUpdate);
        }
    };
    init() {
        this.handleParallax();
    }
    getElement = () => {
        return this.el;
    };
}

;// ../../packages/plugins/src/parallaxScroll/parallaxScroll.ts

class ParallaxScroll {
    options;
    items;
    static defaultOptions = {
        targetElement: window,
        setStyles: undefined,
        lerpEase: 0.08,
    };
    constructor(options) {
        this.options = {
            ...ParallaxScroll.defaultOptions,
            ...options,
        };
        this.items = [];
    }
    handlerScroll = () => {
        for (const instance of this.items) {
            instance.init();
        }
    };
    add = (el, options) => {
        this.items.push(new ParallaxScrollItem(el, options, this.options));
        return this;
    };
    remove = (el) => {
        const item = this.items.find((item) => item.getElement() === el);
        this.items = this.items.filter((item) => item.getElement() !== el);
        if (item) {
            item.destroy();
        }
    };
    run = () => {
        const { targetElement } = this.options;
        this.handlerScroll();
        targetElement.removeEventListener('scroll', this.handlerScroll, false);
        targetElement.addEventListener('scroll', this.handlerScroll, false);
    };
    destroy = () => {
        const { targetElement } = this.options;
        targetElement.removeEventListener('scroll', this.handlerScroll, false);
        for (const instance of this.items) {
            instance.destroy();
        }
    };
}

;// ../../packages/plugins/src/parallaxScroll/index.ts




function parallaxScroll(options = {}) {
    return new ParallaxScroll(options);
}
window.xoParallaxScroll = parallaxScroll;


;// ../../packages/plugins/src/pageSpeed/utils.ts
const SSR_PAGE_PATTERN = /\/(checkout|cart)/g;
const hrefValid = (href) => {
    const url = new URL(href);
    return (url.origin === location.origin &&
        ['http:', 'https:'].includes(url.protocol) &&
        !(url.protocol === 'http:' && location.protocol === 'https:') &&
        !(url.hash && url.pathname + url.search === location.pathname + location.search));
};
const SSRNavigate = (href) => {
    document.body.classList.add('xo-navigate-smooth');
    window.location.href = href;
};
const isAnchor = (el) => {
    return !!el.closest('a[href]');
};

;// ../../packages/plugins/src/pageSpeed/index.ts


class PageSpeed {
    linksLoaded = new Set();
    domparser = new DOMParser();
    pages = new Map();
    controllers = new Map();
    options;
    lastTouchTimestamp = 0;
    timeId = -1;
    static defaultOptions = {
        root: document.querySelector('#xo-main-content') || document.body,
        use: 'SSR',
    };
    constructor(options) {
        this.options = {
            ...PageSpeed.defaultOptions,
            ...options,
        };
        this.init();
    }
    getHtml = async (el) => {
        const { use } = this.options;
        const { href } = el;
        if (!this.linksLoaded.has(href)) {
            this.linksLoaded.add(href);
            this.controllers.set(href, new AbortController());
            const { signal } = this.controllers.get(href);
            if (!this.pages.has(href)) {
                if (use === 'SSR') {
                    const linkEl = document.createElement('link');
                    linkEl.rel = 'prefetch';
                    linkEl.href = href;
                    // @ts-ignore
                    linkEl.fetchPriority = 'high';
                    linkEl.as = 'document';
                    attrBoolean.set(linkEl, 'xo-prefetch', true);
                    linkEl.onload = () => {
                        attrBoolean.set(el, 'xo-prefetched', true);
                    };
                    document.head.appendChild(linkEl);
                }
                else {
                    try {
                        const res = await fetch(href, { signal });
                        const htmlText = await res.text();
                        const doc = this.domparser.parseFromString(htmlText, 'text/html');
                        this.pages.set(href, doc);
                    }
                    catch {
                        this.linksLoaded.delete(href);
                    }
                }
            }
        }
    };
    cancelRequest = (href) => {
        const { use } = this.options;
        if (this.controllers.has(href)) {
            if (use === 'SSR') {
                const linkEl = document.querySelector(`link[xo-prefetch][href="${href}"]`);
                if (linkEl) {
                    linkEl.remove();
                }
            }
            else {
                this.controllers.get(href).abort();
            }
            this.linksLoaded.delete(href);
        }
    };
    navigate = (href) => {
        if (SSR_PAGE_PATTERN.test(href)) {
            SSRNavigate(href);
        }
        else if (hrefValid(href)) {
            const { root } = this.options;
            if (this.pages.has(href) && root) {
                const rootSelector = `#${root.id}`;
                const nextRoot = this.pages.get(href).querySelector(rootSelector);
                if (nextRoot) {
                    root.innerHTML = nextRoot.innerHTML;
                    window.history.pushState(null, '', href);
                    window.scrollTo(0, 0);
                    this.update();
                }
            }
            else {
                SSRNavigate(href);
            }
        }
    };
    handleWindowClick = async (event) => {
        const { use } = this.options;
        const anchorEl = event.target.closest('a');
        if (!anchorEl) {
            return;
        }
        if (use === 'CSR') {
            if (isAnchor(anchorEl)) {
                event.preventDefault();
                this.navigate(anchorEl.href);
            }
        }
    };
    handleMouseOver = (event) => {
        if (performance.now() - this.lastTouchTimestamp < 1100) {
            return;
        }
        const anchorEl = event.target.closest('a');
        if (anchorEl && hrefValid(anchorEl.href)) {
            this.timeId = window.setTimeout(() => {
                this.timeId = -1;
                this.getHtml(anchorEl);
            }, 80);
        }
    };
    handleTouchStart = (event) => {
        this.lastTouchTimestamp = Date.now();
        const anchorEl = event.target.closest('a');
        if (anchorEl && hrefValid(anchorEl.href)) {
            anchorEl.addEventListener('touchcancel', this.handleCancel, { passive: true });
            anchorEl.addEventListener('touchend', this.handleCancel, { passive: true });
            this.getHtml(anchorEl);
        }
    };
    handleCancel = (event) => {
        const anchorEl = event.target.closest('a');
        if (anchorEl && hrefValid(anchorEl.href) && !attrBoolean.get(anchorEl, 'xo-prefetched')) {
            if (this.timeId !== -1) {
                clearTimeout(this.timeId);
                this.timeId = -1;
            }
            else {
                this.cancelRequest(anchorEl.href);
            }
        }
    };
    handlePopState = async (event) => {
        const { use } = this.options;
        if (use === 'CSR') {
            event.preventDefault();
            this.navigate(window.location.href);
        }
    };
    update = () => {
        this.destroy();
        this.init();
    };
    init = () => {
        if (!window.Shopify.designMode) {
            if (!document.body.classList.contains('xo-navigate-smooth')) {
                document.body.classList.add('xo-using-page-speed');
            }
            document.addEventListener('mouseover', this.handleMouseOver, { capture: true, passive: true });
            document.addEventListener('mouseout', this.handleCancel, { passive: true });
            document.addEventListener('touchstart', this.handleTouchStart, { capture: true, passive: true });
            window.addEventListener('click', this.handleWindowClick);
            window.addEventListener('popstate', this.handlePopState);
        }
    };
    destroy = () => {
        clearTimeout(this.timeId);
        document.removeEventListener('mouseover', this.handleMouseOver);
        document.removeEventListener('mouseout', this.handleCancel);
        document.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('click', this.handleWindowClick);
        window.removeEventListener('popstate', this.handlePopState);
    };
}
function pageSpeed(options) {
    return new PageSpeed(options);
}

;// ../../packages/plugins/src/index.ts





// EXTERNAL MODULE: ./src/groups/features/side-actions/side-actions.script-global.ts
var side_actions_script_global = __webpack_require__(878);
// EXTERNAL MODULE: ./src/groups/footers/footer/footer.script-global.ts
var footer_script_global = __webpack_require__(439);
// EXTERNAL MODULE: ./src/groups/headers/announcement-bar/announcement-bar.script-global.ts
var announcement_bar_script_global = __webpack_require__(549);
;// ./src/groups/headers/header/header-menu.script-global.ts

function updateSubMenuPos() {
    const menuLastItem = Array.from(document.querySelectorAll('.xo-menu-horizontal__sub-menu--third'));
    if (menuLastItem != null) {
        menuLastItem.forEach((item) => {
            const itemPos = offset(item);
            const itemWidth = item.getBoundingClientRect().width;
            const windowWidth = window.innerWidth;
            if ((itemPos.left + itemWidth) > windowWidth) {
                item.classList.add('xo-menu-horizontal__sub-menu--left');
            }
            else {
                item.classList.remove('xo-menu-horizontal__sub-menu--left');
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', updateSubMenuPos);
window.addEventListener('resize', updateSubMenuPos);

;// ./src/groups/popups/popup-age-verification/popup-age-verification.script-global.ts

class XoPopupAgeVerification extends HTMLElement {
    show;
    modal;
    submitButton;
    verification;
    cookieConsentName;
    ageVerificationName;
    initial;
    static get observedAttributes() {
        return ["xo-observed"];
    }
    connectedCallback() {
        this.show = false;
        this.initial = false;
        this.cookieConsentName = "is_xo_cookie_consent";
        this.ageVerificationName = "is_xo_age_verrification";
        this.modal = this?.querySelector("xo-modal");
        this.submitButton = this.modal?.querySelector(".xo-popup-age-verification__button-submit");
        this.verification = !!this.getCookie(this.cookieConsentName) ? !!this.getCookie(this.cookieConsentName) : Boolean(storage_storage.getItem(this.ageVerificationName));
        this.popup = this.popup.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.init();
        this.initial = true;
    }
    disconnectedCallback() {
        this.destroy();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && name === "xo-observed" && this.initial) {
            this.destroy();
            this.init();
        }
    }
    async openPopup(name, timeDelay) {
        await delay(timeDelay);
        window.xoModal.open(name);
        const now = Math.floor(Date.now() / 1000) + "";
        storage_storage.setItem("xo-popup-age-notification", now);
        this.show = true;
    }
    scrollPercent = () => {
        const modal = this?.querySelector("xo-modal");
        const showScrollDepth = this?.getAttribute("xo-scroll");
        const name = modal?.getAttribute("xo-name");
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        if (this.show) {
            return;
        }
        if (showScrollDepth === "none") {
            this.openPopup(name, 0);
        }
        else {
            const depth = Number(this?.getAttribute("xo-scroll") ?? 0);
            if (scrollPercentRounded >= depth) {
                this.openPopup(name, 0);
            }
        }
    };
    setCookie(value, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = this.ageVerificationName + "=" + value + ";" + expires + ";path=/";
    }
    deleteCookie() {
        const d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = this.ageVerificationName + "=;" + expires + ";path=/";
    }
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2)
            return parts?.pop()?.split(";").shift();
    }
    handleSubmit = () => {
        if (!!this.getCookie(this.cookieConsentName)) {
            this.deleteCookie();
            this.setCookie(1, 30);
        }
        else {
            storage_storage.setItem(this.ageVerificationName, "true");
        }
        const name = this.modal?.getAttribute("xo-name");
        window.xoModal.close(name);
    };
    popup = () => {
        const modal = this?.querySelector("xo-modal");
        const isShow = this?.getAttribute("xo-show");
        const whenToShow = this?.getAttribute("xo-when");
        const timeDelay = Number(this?.getAttribute("xo-delay") ?? 0);
        const name = modal?.getAttribute("xo-name");
        if (!isShow && !name) {
            return;
        }
        if (whenToShow === "immediately") {
            this.openPopup(name, timeDelay);
        }
        else {
            this.scrollPercent();
            window.addEventListener("scroll", this.scrollPercent);
        }
        this.submitButton?.addEventListener("click", this.handleSubmit);
        if (!name) {
            return;
        }
    };
    shouldShowPopup(frequency) {
        const popupOptions = {
            once: Infinity,
            every_hour: 1 * 60 * 60,
            every_12_hour: 12 * 60 * 60,
            every_day: 24 * 60 * 60,
            every_3_day: 3 * 24 * 60 * 60,
            every_week: 7 * 24 * 60 * 60,
            every_2_weeks: 14 * 24 * 60 * 60,
            no_limit: 0,
        };
        const lastShown = storage_storage.getItem("xo-popup-age-notification");
        const now = Math.floor(Date.now() / 1000);
        const interval = popupOptions[frequency];
        if (interval === 0) {
            return true;
        }
        if (!lastShown) {
            return true;
        }
        return now - parseInt(lastShown) >= interval;
    }
    init() {
        if (this.verification) {
            return;
        }
        const frequency = this.getAttribute("xo-frequency");
        if (this.shouldShowPopup(frequency)) {
            window.addEventListener("load", this.popup);
        }
        // window.addEventListener("load", this.popup)
    }
    destroy() {
        window.removeEventListener("load", this.popup);
        this.submitButton?.removeEventListener("click", this.handleSubmit);
    }
}
if (!window.customElements.get("xo-popup-age-verification") && !window.Shopify.designMode) {
    window.customElements.define("xo-popup-age-verification", XoPopupAgeVerification);
}

;// ./src/groups/popups/popup-cookie-consent/popup-cookie-consent.script-global.ts

class XoPopupCookieConsent extends HTMLElement {
    show;
    modal;
    submitButton;
    COOKIE_NAME;
    initial;
    static get observedAttributes() {
        return ["xo-observed"];
    }
    connectedCallback() {
        this.show = false;
        this.initial = false;
        this.COOKIE_NAME = "is_xo_cookie_consent";
        this.getCookie = this.getCookie.bind(this);
        this.popup = this.popup.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.modal = this?.querySelector("xo-modal");
        this.submitButton = this.modal?.querySelector(".xo-cookie-consent__button-submit");
        this.init();
        this.initial = true;
    }
    disconnectedCallback() {
        this.destroy();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && name === "xo-observed" && this.initial) {
            this.destroy();
            this.init();
        }
    }
    async openPopup(name, timeDelay) {
        await delay(timeDelay);
        window.xoModal.open(name);
        this.show = true;
    }
    scrollPercent = () => {
        const modal = this?.querySelector("xo-modal");
        const showScrollDepth = this?.getAttribute("xo-scroll");
        const name = modal?.getAttribute("xo-name");
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        if (this.show) {
            return;
        }
        if (showScrollDepth === "none") {
            this.openPopup(name, 0);
        }
        else {
            const depth = Number(this?.getAttribute("xo-scroll") ?? 0);
            if (scrollPercentRounded >= depth) {
                this.openPopup(name, 0);
            }
        }
    };
    setCookie(value, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = this.COOKIE_NAME + "=" + value + ";" + expires + ";path=/";
    }
    deleteCookie() {
        const d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = this.COOKIE_NAME + "=;" + expires + ";path=/";
    }
    getCookie() {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${this.COOKIE_NAME}=`);
        if (parts.length === 2)
            return parts?.pop()?.split(";").shift();
    }
    acceptCookieConsent() {
        this.deleteCookie();
        this.setCookie(1, 30);
    }
    handleSubmit = () => {
        this.acceptCookieConsent();
        const name = this.modal?.getAttribute("xo-name");
        window.xoModal.close(name);
    };
    popup = () => {
        const modal = this?.querySelector("xo-modal");
        const isShow = this?.getAttribute("xo-show");
        const whenToShow = this?.getAttribute("xo-when");
        const timeDelay = Number(this?.getAttribute("xo-delay") ?? 0);
        const name = modal?.getAttribute("xo-name");
        if (!isShow && !name) {
            return;
        }
        if (whenToShow === "immediately") {
            this.openPopup(name, timeDelay);
        }
        else {
            this.scrollPercent();
            window.addEventListener("scroll", this.scrollPercent);
        }
        this.submitButton?.addEventListener("click", this.handleSubmit);
        if (!name) {
            return;
        }
    };
    init() {
        if (!this.getCookie()) {
            window.addEventListener("load", this.popup);
        }
    }
    destroy() {
        window.removeEventListener("load", this.popup);
        this.submitButton?.removeEventListener("click", this.handleSubmit);
    }
}
if (!window.customElements.get("xo-cookie-consent") && !window.Shopify.designMode) {
    window.customElements.define("xo-cookie-consent", XoPopupCookieConsent);
}

;// ./src/groups/popups/popup-countdown-promo/popup-countdown-promo.script-global.ts

class XoPopupCountdown extends HTMLElement {
    show;
    initial;
    static get observedAttributes() {
        return ["xo-observed"];
    }
    connectedCallback() {
        this.show = false;
        this.initial = false;
        this.popup = this.popup.bind(this);
        this.scrollPercent = this.scrollPercent.bind(this);
        this.init();
        this.initial = true;
    }
    disconnectedCallback() {
        this.destroy();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && name === "xo-observed" && this.initial) {
            this.destroy();
            this.init();
        }
    }
    async openPopup(name, timeDelay) {
        await delay(timeDelay);
        window.xoModal.open(name);
        const now = Math.floor(Date.now() / 1000) + "";
        storage_storage.setItem("xo-popup-countdown-promo", now);
        this.show = true;
    }
    scrollPercent = () => {
        const modal = this?.querySelector("xo-modal");
        const showScrollDepth = this?.getAttribute("xo-scroll");
        const name = modal?.getAttribute("xo-name");
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        if (this.show) {
            return;
        }
        if (showScrollDepth === "none") {
            this.openPopup(name, 0);
        }
        else {
            const depth = Number(this?.getAttribute("xo-scroll") ?? 0);
            if (scrollPercentRounded >= depth) {
                this.openPopup(name, 0);
            }
        }
    };
    popup = () => {
        const modal = this?.querySelector("xo-modal");
        const isShow = this?.getAttribute("xo-show");
        const whenToShow = this?.getAttribute("xo-when");
        const timeDelay = Number(this?.getAttribute("xo-delay") ?? 0);
        const name = modal?.getAttribute("xo-name");
        if (!isShow && !name) {
            return;
        }
        if (whenToShow === "immediately") {
            this.openPopup(name, timeDelay);
        }
        else {
            this.scrollPercent();
            window.addEventListener("scroll", this.scrollPercent);
        }
    };
    shouldShowPopup(frequency) {
        const popupOptions = {
            once: Infinity,
            every_hour: 1 * 60 * 60,
            every_12_hour: 12 * 60 * 60,
            every_day: 24 * 60 * 60,
            every_3_day: 3 * 24 * 60 * 60,
            every_week: 7 * 24 * 60 * 60,
            every_2_weeks: 14 * 24 * 60 * 60,
            no_limit: 0,
        };
        const lastShown = storage_storage.getItem("xo-popup-countdown-promo");
        const now = Math.floor(Date.now() / 1000);
        const interval = popupOptions[frequency];
        if (interval === 0) {
            return true;
        }
        if (!lastShown) {
            return true;
        }
        return now - parseInt(lastShown) >= interval;
    }
    init() {
        const frequency = this.getAttribute("xo-frequency");
        if (this.shouldShowPopup(frequency)) {
            window.addEventListener("load", this.popup);
        }
    }
    destroy() {
        window.removeEventListener("load", this.popup);
        window.removeEventListener("scroll", this.scrollPercent);
    }
}
if (!window.customElements.get("xo-popup-countdown") && !window.Shopify.designMode) {
    window.customElements.define("xo-popup-countdown", XoPopupCountdown);
}

;// ./src/groups/popups/popup-product-quickview/popup-product-quickview.script-global.ts

class XoPopupProductQuickview extends HTMLElement {
    show;
    initial;
    static get observedAttributes() {
        return ["xo-observed"];
    }
    connectedCallback() {
        this.show = false;
        this.initial = false;
        this.popup = this.popup.bind(this);
        this.scrollPercent = this.scrollPercent.bind(this);
        this.init();
        this.initial = true;
    }
    disconnectedCallback() {
        this.destroy();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && name === "xo-observed" && this.initial) {
            this.destroy();
            this.init();
        }
    }
    async openPopup(name, timeDelay) {
        await delay(timeDelay);
        window.xoModal.open(name);
        const now = Math.floor(Date.now() / 1000) + "";
        storage_storage.setItem("xo-popup-product-quickview", now);
        this.show = true;
    }
    scrollPercent = () => {
        // const toast = this.querySelector('xo-toast[xo-name^="xo-popup-"]');
        // const name = toast?.getAttribute("xo-name") as string;
        const modal = this?.querySelector("xo-modal");
        const name = modal?.getAttribute("xo-name");
        const showScrollDepth = this?.getAttribute("xo-scroll");
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        if (this.show) {
            return;
        }
        if (showScrollDepth === "none") {
            this.openPopup(name, 0);
        }
        else {
            const depth = Number(this?.getAttribute("xo-scroll") ?? 0);
            if (scrollPercentRounded >= depth) {
                this.openPopup(name, 0);
            }
        }
    };
    popup = () => {
        // const toast = this.querySelector('xo-toast[xo-name^="xo-popup-"]');
        // const name = toast?.getAttribute("xo-name") as string;
        const modal = this?.querySelector("xo-modal");
        const name = modal?.getAttribute("xo-name");
        const isShow = this?.getAttribute("xo-show");
        const whenToShow = this?.getAttribute("xo-when");
        const timeDelay = Number(this?.getAttribute("xo-delay") ?? 0);
        if (!isShow && !name) {
            return;
        }
        if (whenToShow === "immediately") {
            this.openPopup(name, timeDelay);
        }
        else {
            this.scrollPercent();
            window.addEventListener("scroll", this.scrollPercent);
        }
    };
    shouldShowPopup(frequency) {
        const popupOptions = {
            once: Infinity,
            every_hour: 1 * 60 * 60,
            every_12_hour: 12 * 60 * 60,
            every_day: 24 * 60 * 60,
            every_3_day: 3 * 24 * 60 * 60,
            every_week: 7 * 24 * 60 * 60,
            every_2_weeks: 14 * 24 * 60 * 60,
            no_limit: 0,
        };
        const lastShown = storage_storage.getItem("xo-popup-product-quickview");
        const now = Math.floor(Date.now() / 1000);
        const interval = popupOptions[frequency];
        if (interval === 0) {
            return true;
        }
        if (!lastShown) {
            return true;
        }
        return now - parseInt(lastShown) >= interval;
    }
    init() {
        const frequency = this.getAttribute("xo-frequency");
        if (this.shouldShowPopup(frequency)) {
            window.addEventListener("load", this.popup);
        }
    }
    destroy() {
        window.removeEventListener("load", this.popup);
        window.removeEventListener("scroll", this.scrollPercent);
    }
}
if (!window.customElements.get("xo-popup-product-quickview") && !window.Shopify.designMode) {
    window.customElements.define("xo-popup-product-quickview", XoPopupProductQuickview);
}

;// ./src/groups/popups/popup-promo/popup-promo.script-global.ts

class XoPopupPromo extends HTMLElement {
    show;
    initial;
    static get observedAttributes() {
        return ["xo-observed"];
    }
    connectedCallback() {
        this.show = false;
        this.initial = false;
        this.popup = this.popup.bind(this);
        this.scrollPercent = this.scrollPercent.bind(this);
        this.init();
        this.initial = true;
    }
    disconnectedCallback() {
        this.destroy();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && name === "xo-observed" && this.initial) {
            this.destroy();
            this.init();
        }
    }
    async openPopup(name, timeDelay) {
        await delay(timeDelay);
        window.xoModal.open(name);
        const now = Math.floor(Date.now() / 1000) + "";
        storage_storage.setItem("xo-popup-promo", now);
        this.show = true;
    }
    scrollPercent = () => {
        const modal = this?.querySelector("xo-modal");
        const showScrollDepth = this?.getAttribute("xo-scroll");
        const name = modal?.getAttribute("xo-name");
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        if (this.show) {
            return;
        }
        if (showScrollDepth === "none") {
            this.openPopup(name, 0);
        }
        else {
            const depth = Number(this?.getAttribute("xo-scroll") ?? 0);
            if (scrollPercentRounded >= depth) {
                this.openPopup(name, 0);
            }
        }
    };
    popup = () => {
        const modal = this?.querySelector("xo-modal");
        const isShow = this?.getAttribute("xo-show");
        const whenToShow = this?.getAttribute("xo-when");
        const timeDelay = Number(this?.getAttribute("xo-delay") ?? 0);
        const name = modal?.getAttribute("xo-name");
        if (!isShow && !name) {
            return;
        }
        if (whenToShow === "immediately") {
            this.openPopup(name, timeDelay);
        }
        else {
            this.scrollPercent();
            window.addEventListener("scroll", this.scrollPercent);
        }
    };
    shouldShowPopup(frequency) {
        const popupOptions = {
            once: Infinity,
            every_hour: 1 * 60 * 60,
            every_12_hour: 12 * 60 * 60,
            every_day: 24 * 60 * 60,
            every_3_day: 3 * 24 * 60 * 60,
            every_week: 7 * 24 * 60 * 60,
            every_2_weeks: 14 * 24 * 60 * 60,
            no_limit: 0,
        };
        const lastShown = storage_storage.getItem("xo-popup-promo");
        const now = Math.floor(Date.now() / 1000);
        const interval = popupOptions[frequency];
        if (interval === 0) {
            return true;
        }
        if (!lastShown) {
            return true;
        }
        return now - parseInt(lastShown) >= interval;
    }
    init() {
        const frequency = this.getAttribute("xo-frequency");
        if (this.shouldShowPopup(frequency)) {
            window.addEventListener("load", this.popup);
        }
    }
    destroy() {
        window.removeEventListener("load", this.popup);
        window.removeEventListener("scroll", this.scrollPercent);
    }
}
if (!window.customElements.get("xo-popup-promo") && !window.Shopify.designMode) {
    window.customElements.define("xo-popup-promo", XoPopupPromo);
}

;// ./src/groups/popups/popup-sale-notification/popup-sale-notification.script-global.ts

class XoPopupSaleNotification extends HTMLElement {
    show;
    start;
    initial;
    static get observedAttributes() {
        return ["xo-observed"];
    }
    connectedCallback() {
        this.show = false;
        this.initial = false;
        this.popup = this.popup.bind(this);
        this.handleFrame = this.handleFrame.bind(this);
        this.init();
        this.start = Date.now();
        this.initial = true;
    }
    disconnectedCallback() {
        this.destroy();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && name === "xo-observed" && this.initial) {
            this.destroy();
            this.init();
        }
    }
    getRandomIndex(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }
    replaceContent = () => {
        const time = this.querySelector(".xo-popup-sale-notification__minute");
        const customer = this.querySelector(".xo-popup-sale-notification__customer-name");
        const imageURL = this.querySelector(".xo-popup-sale-notification__image");
        const image = this.querySelector(".xo-popup-sale-notification__image img");
        const productName = this.querySelector(".xo-popup-sale-notification__product-title");
        const customerList = this.getAttribute("xo-customer") ?? "";
        const productList = this.querySelector(".xo-popup-sale-notification__product-list")?.textContent?.trim() ?? "";
        if (!!customer) {
            const index = this.getRandomIndex(0, customerList.split(",").length - 1);
            const list = customerList.split(", ");
            customer.textContent = list[index];
        }
        if (!!time) {
            time.textContent = this.getRandomIndex(1, 60).toString();
        }
        if (!!image && !!productName && !!imageURL) {
            const data = JSON.parse(productList);
            const length = data.length;
            if (!length) {
                return;
            }
            const index = this.getRandomIndex(0, length - 1);
            const src = data[index]?.featured_image?.src ?? data[index]?.featured_image ?? "https://cdn.shopify.com/s/files/1/0677/7900/2622/files/Product-placeholder.svg?v=1717753235";
            const url = data[index]?.handle;
            image.src = src;
            image.srcset = src;
            if (!!data?.[index]?.title) {
                productName.textContent = data[index].title;
                productName.setAttribute("href", `products/${url}`);
                imageURL.setAttribute("href", `products/${url}`);
            }
        }
    };
    handleFrame() {
        const toast = this.querySelector('xo-toast[xo-name^="xo-popup-"]');
        const name = toast?.getAttribute("xo-name");
        const ellapsed = Date.now() - (this.start ?? 0);
        const duration = Number(this?.getAttribute("xo-duration") ?? 3000);
        const delay = Number(this?.getAttribute("xo-delay") ?? 3000);
        if (ellapsed > duration) {
            if (name) {
                window.xoToast.remove(name);
            }
            this.replaceContent();
        }
        if (ellapsed > duration + delay) {
            if (name) {
                window.xoToast.push({ name: name });
            }
            this.start = Date.now();
        }
    }
    popup = () => {
        const isShow = this?.getAttribute("xo-show") === "true";
        if (!isShow) {
            return;
        }
        frameManager.add(this.handleFrame, true);
    };
    init() {
        window.addEventListener("load", this.popup);
    }
    destroy() {
        window.removeEventListener("load", this.popup);
        frameManager.remove(this.handleFrame);
    }
}
if (!window.customElements.get("xo-popup-sale-notification") && !window.Shopify.designMode) {
    window.customElements.define("xo-popup-sale-notification", XoPopupSaleNotification);
}

;// ./src/groups/popups/popup-sign-up/popup-sign-up.script-global.ts

function hiddenModal() {
    const toastEls = document.querySelectorAll('xo-toast[xo-name^="xo-popup-"]');
    const modalEls = document.querySelectorAll('xo-modal[xo-name^="xo-popup-"]');
    modalEls.forEach((el) => {
        const name = el.getAttribute("xo-name");
        if (name) {
            window.xoModal.close(name);
        }
    });
    toastEls.forEach((el) => {
        const name = el.getAttribute("xo-name");
        if (name) {
            window.xoToast.remove(name);
        }
    });
}
class XoPopup extends HTMLElement {
    show;
    initial;
    static get observedAttributes() {
        return ["xo-observed"];
    }
    connectedCallback() {
        this.show = false;
        this.initial = false;
        this.popup = this.popup.bind(this);
        this.scrollPercent = this.scrollPercent.bind(this);
        this.init();
        this.initial = true;
    }
    disconnectedCallback() {
        this.destroy();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && name === "xo-observed" && this.initial) {
            this.destroy();
            this.init();
        }
    }
    async openPopup(name, timeDelay) {
        await delay(timeDelay);
        window.xoModal.open(name);
        const now = Math.floor(Date.now() / 1000) + "";
        storage_storage.setItem("xo-popup-sign-up", now);
        this.show = true;
    }
    scrollPercent = () => {
        const modal = this?.querySelector("xo-modal");
        const showScrollDepth = this?.getAttribute("xo-scroll");
        const name = modal?.getAttribute("xo-name");
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        if (this.show) {
            return;
        }
        if (showScrollDepth === "none") {
            this.openPopup(name, 0);
        }
        else {
            const depth = Number(this?.getAttribute("xo-scroll") ?? 0);
            if (scrollPercentRounded >= depth) {
                this.openPopup(name, 0);
            }
        }
    };
    popup = () => {
        const modal = this?.querySelector("xo-modal");
        const isShow = this?.getAttribute("xo-show");
        const whenToShow = this?.getAttribute("xo-when");
        const timeDelay = Number(this?.getAttribute("xo-delay") ?? 0);
        const name = modal?.getAttribute("xo-name");
        if (!isShow && !name) {
            return;
        }
        if (whenToShow === "immediately") {
            this.openPopup(name, timeDelay);
        }
        else {
            this.scrollPercent();
            window.addEventListener("scroll", this.scrollPercent);
        }
    };
    shouldShowPopup(frequency) {
        const popupOptions = {
            once: Infinity,
            every_hour: 1 * 60 * 60,
            every_12_hour: 12 * 60 * 60,
            every_day: 24 * 60 * 60,
            every_3_day: 3 * 24 * 60 * 60,
            every_week: 7 * 24 * 60 * 60,
            every_2_weeks: 14 * 24 * 60 * 60,
            no_limit: 0,
        };
        const lastShown = storage_storage.getItem("xo-popup-sign-up");
        const now = Math.floor(Date.now() / 1000);
        const interval = popupOptions[frequency];
        if (interval === 0) {
            return true;
        }
        if (!lastShown) {
            return true;
        }
        return now - parseInt(lastShown) >= interval;
    }
    init() {
        const frequency = this.getAttribute("xo-frequency");
        if (this.shouldShowPopup(frequency)) {
            window.addEventListener("load", this.popup);
        }
    }
    destroy() {
        window.removeEventListener("load", this.popup);
        window.removeEventListener("scroll", this.scrollPercent);
    }
}
if (!window.customElements.get("xo-popup-sign-up") && !window.Shopify.designMode) {
    window.customElements.define("xo-popup-sign-up", XoPopup);
}
if (window.Shopify.designMode) {
    document.addEventListener("shopify:section:select", async (event) => {
        hiddenModal();
        const el = event.target;
        const toast = el.querySelector('xo-toast[xo-name^="xo-popup-"]');
        const modal = el.querySelector('xo-modal[xo-name^="xo-popup-"]');
        if (!!modal) {
            const name = modal?.getAttribute("xo-name");
            if (name) {
                await delay(200);
                window.xoModal.open(name);
            }
        }
        if (!!toast) {
            const name = toast?.getAttribute("xo-name");
            if (name) {
                await delay(200);
                window.xoToast.push({ name: name });
            }
        }
    });
    document.addEventListener("shopify:section:deselect", (event) => {
        hiddenModal();
        const el = event.target;
        const toast = el.querySelector('xo-toast[xo-name^="xo-popup-"]');
        const modal = el.querySelector('xo-modal[xo-name^="xo-popup-"]');
        if (!!modal) {
            const name = modal?.getAttribute("xo-name");
            if (name) {
                window.xoModal.close(name);
            }
        }
        if (!!toast) {
            const name = toast?.getAttribute("xo-name");
            if (name) {
                window.xoToast.remove(name);
            }
        }
    });
    document.addEventListener("shopify:section:load", async (event) => {
        hiddenModal();
        const el = event.target;
        const toast = el.querySelector('xo-toast[xo-name^="xo-popup-"]');
        const modal = el.querySelector('xo-modal[xo-name^="xo-popup-"]');
        if (!!modal) {
            const name = modal?.getAttribute("xo-name");
            if (name) {
                await delay(200);
                window.xoModal.open(name);
            }
        }
        if (!!toast) {
            const name = toast?.getAttribute("xo-name");
            if (name) {
                await delay(200);
                window.xoToast.push({ name: name });
            }
        }
    });
}

// EXTERNAL MODULE: ./src/pages/product/snippets/product-info-media-carousel/product-info-media-carousel.script-global.ts
var product_info_media_carousel_script_global = __webpack_require__(903);
;// ./src/pages/product/snippets/product-info-media-tabs/product-info-media-tabs.script-global.ts

const triggerScrollEl = document.querySelector('.product-info-media-tabs__trigger');
const triggerListScrollEl = triggerScrollEl?.querySelector('.product-info-media-tabs__trigger-list');
let startScrollLeft = 0;
if (triggerListScrollEl) {
    if (!isMobile.any) {
        const pan = panGesture({
            element: triggerListScrollEl,
            onStart: () => {
                startScrollLeft = triggerListScrollEl.scrollLeft;
            },
            onMove: ({ dx }) => {
                triggerListScrollEl.scrollTo({
                    left: startScrollLeft - dx,
                });
            },
            onEnd: () => {
                pan.setValue({ dx: 0 });
            },
        });
    }
}

;// ./src/pages/search_filters/main-collection/section-main-collection.script-global.ts
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

const ACTIVE = 'xo-active';
const COLUMN_LEFT_CLASS = 'xo-main-collection__left';
const COLUMN_RIGHT_CLASS = 'xo-main-collection__right';
const FILTER_GRID_CLASS = 'filter-content__grid--vertical';
const BUTTON_TEXT_CLASS = 'xo-main-collection__toggle-text';
function viewTransition(fn) {
    return function (...params) {
        // @ts-ignore
        if (document.startViewTransition) {
            // @ts-ignore
            document.startViewTransition(() => {
                fn(...params);
            });
        }
        else {
            fn(...params);
        }
    };
}
let ShowHideButton = class ShowHideButton extends XoComponent {
    storageKeyMobile = 'currentColumnMobile';
    storageKeyDesktop = 'currentColumnDesktop';
    static propTypes = {
        xoActive: 'boolean',
        xoColumnDesktop: 'number',
        xoColumnMobile: 'number',
    };
    static observedProps = ['xoActive'];
    state = {
        isActive: true,
        columnMobile: this.getInitialColumnMobile(),
        columnDesktop: this.getInitialColumnDesktop()
    };
    getInitialColumnMobile() {
        const savedColumnMobile = storage_storage.getItem(this.storageKeyMobile);
        return savedColumnMobile ? Number(savedColumnMobile) : 2;
    }
    getInitialColumnDesktop() {
        const savedColumnDesktop = storage_storage.getItem(this.storageKeyDesktop);
        return savedColumnDesktop ? Number(savedColumnDesktop) : 3;
    }
    saveColumnToStorage(columnMobile, columnDesktop) {
        storage_storage.setItem(this.storageKeyMobile, columnMobile.toString());
        storage_storage.setItem(this.storageKeyDesktop, columnDesktop.toString());
    }
    handleClick = () => {
        this.setState({ isActive: !this.state.isActive });
    };
    mount() {
        this.addEventListener('click', viewTransition(this.handleClick));
        window.addEventListener('beforeunload', () => {
            storage_storage.removeItem(this.storageKeyMobile);
            storage_storage.removeItem(this.storageKeyDesktop);
        });
    }
    updateSidebar() {
        const { isActive } = this.state;
        const columnLeft = document.querySelector(`.${COLUMN_LEFT_CLASS}`);
        const columnRight = document.querySelector(`.${COLUMN_RIGHT_CLASS}`);
        if (columnLeft && columnRight) {
            if (isActive !== true) {
                columnLeft.classList.add(ACTIVE);
                columnRight.classList.add(ACTIVE);
                columnRight.style.setProperty('--lg', "12");
                columnRight.style.setProperty('--md', "12");
            }
            else {
                columnLeft.classList.remove(ACTIVE);
                columnRight.classList.remove(ACTIVE);
                columnRight.style.setProperty('--lg', "9");
                columnRight.style.setProperty('--md', "8");
            }
        }
    }
    updateButtonText() {
        const { isActive } = this.state;
        const buttonEl = document.querySelector(`.${BUTTON_TEXT_CLASS}`);
        if (buttonEl) {
            if (isActive === true) {
                buttonEl.textContent = 'Hide filter';
            }
            else {
                buttonEl.textContent = 'Show filter';
            }
        }
    }
    updateGrid() {
        const { isActive } = this.state;
        const { xoColumnDesktop } = this.props;
        const { xoColumnMobile } = this.props;
        const filterGrid = document.querySelector(`.${FILTER_GRID_CLASS}`);
        if (filterGrid) {
            if (isActive === true) {
                filterGrid.style.setProperty('--md', `${xoColumnMobile}`);
                filterGrid.style.setProperty('--lg', `${xoColumnDesktop}`);
                this.saveColumnToStorage(xoColumnMobile, xoColumnDesktop);
            }
            else {
                filterGrid.style.setProperty('--md', `${xoColumnMobile + 1}`);
                filterGrid.style.setProperty('--lg', `${xoColumnDesktop + 1}`);
                this.saveColumnToStorage(xoColumnMobile + 1, xoColumnDesktop + 1);
            }
        }
    }
    stateUpdate() {
        const { isActive } = this.state;
        this.updateSidebar();
        this.updateButtonText();
        this.updateGrid();
        this.setProps({ xoActive: isActive });
    }
    unmount() {
        this.removeEventListener('click', this.handleClick);
    }
};
ShowHideButton = __decorate([
    customElements_customElements('xo-show-hide-button')
], ShowHideButton);

const filterContent = document.querySelector('xo-filters-content');
if (filterContent) {
    filterContent.handleContent((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const storageColumnMobile = storage_storage.getItem('currentColumnMobile');
        const storageColumnDesktop = storage_storage.getItem('currentColumnDesktop');
        const gridEl = doc.querySelector('.filter-content__grid--vertical');
        if (gridEl) {
            if (storageColumnMobile && storageColumnDesktop) {
                gridEl.style.setProperty('--md', storageColumnMobile);
                gridEl.style.setProperty('--lg', storageColumnDesktop);
            }
            else {
                gridEl.style.setProperty('--md', '2');
                gridEl.style.setProperty('--lg', '3');
            }
        }
        return doc.body.innerHTML;
    });
}

;// ./src/snippets/cart-free-shipping/cart-free-shipping.script-global.ts
var cart_free_shipping_script_global_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let CartFreeShippingCustom = class CartFreeShippingCustom extends XoComponent {
    constructor() {
        super();
        this.updateCartUI();
    }
    updateCartUI() {
        const settings = window.shopSettings;
        const translations = window.translations;
        fetch('/cart.js')
            .then((response) => response.json())
            .then((cart) => {
            const cartTotal = cart.total_price / 100;
            const { freeShippingThreshold, currencyActive, currencyRate, showCurrencyCode } = settings;
            const { freeShippingNotice, freeShippingProgress } = translations;
            // Tính toán giá trị còn lại
            const convertedThreshold = Math.round(freeShippingThreshold * currencyRate);
            const remainingAmount = Math.max(0, convertedThreshold - cartTotal);
            const progressPercent = (cartTotal / convertedThreshold) * 100;
            let level = '1';
            if (progressPercent > 30 && progressPercent <= 60) {
                // console.log("Level 2");
                level = '2';
            }
            else if (progressPercent > 60 && progressPercent < 100) {
                // console.log("Level 3");
                level = '3';
            }
            else if (progressPercent == 100) {
                // console.log("Level 4");
                level = '4';
            }
            let formattedRemainingAmount = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currencyActive,
            }).format(remainingAmount);
            //Kiểm tra currency code có đang enabled ko ( xem settings currency code trong store)
            if (showCurrencyCode) {
                formattedRemainingAmount = formattedRemainingAmount + " " + currencyActive;
            }
            const textEl = this.querySelector(".xo-cart-free-shipping__text");
            const progressBar = this.querySelector(".xo-cart-free-shipping__progress");
            if (textEl && progressBar) {
                if (cartTotal >= convertedThreshold) {
                    textEl.innerHTML = freeShippingNotice;
                }
                else {
                    textEl.innerHTML = freeShippingProgress.replace(/\{\{.*?\}\}/g, formattedRemainingAmount); // Dùng regex để thay đổi giá trị cho {{ monney }}
                }
                progressBar.style.setProperty("--progress", `${Math.min(100, progressPercent)}%`);
                progressBar.classList.add(`xo-cart-free-shipping__progress--level-${level}`);
            }
        })
            .catch((error) => console.error("Error fetching cart:", error));
    }
    mount() {
        this.updateCartUI();
        // Cập nhật UI khi cart thay đổi
        const originalFetch = window.fetch.bind(window);
        window.fetch = (...args) => {
            return originalFetch(...args).then((response) => {
                const url = typeof args[0] === "string"
                    ? args[0]
                    : args[0] instanceof Request
                        ? args[0].url
                        : "";
                if (url &&
                    (url.includes("/cart/add") || url.includes("/cart/change")) &&
                    response.ok) {
                    this.updateCartUI();
                }
                return response;
            });
        };
    }
    unmount() { }
    stateUpdate() { }
};
CartFreeShippingCustom = cart_free_shipping_script_global_decorate([
    customElements_customElements('xo-cart-free-shipping-custom')
], CartFreeShippingCustom);


// EXTERNAL MODULE: ./src/snippets/collection-list-5/collection-list-5.script-global.ts
var collection_list_5_script_global = __webpack_require__(326);
;// ./src/snippets/currency-select/currency-select.ts

const COMPONENT_NAME = 'xo-currency-select';
class CurrencySelect extends HTMLElement {
    inputEls = [];
    formEl = null;
    constructor() {
        super();
        this.inputEls = Array.from(this.querySelectorAll('.xo-currency-select__content .xo-currency-select__input'));
        this.formEl = this.querySelector('.xo-currency-select__form');
    }
    handleChange = () => {
        this.formEl?.submit();
    };
    connectedCallback() {
        each(this.inputEls, (inputEl) => {
            inputEl.addEventListener('input', this.handleChange);
        });
    }
    disconnectedCallback() {
        each(this.inputEls, (inputEl) => {
            inputEl.removeEventListener('input', this.handleChange);
        });
    }
}
componentDefine({
    [COMPONENT_NAME]: CurrencySelect,
});

;// ./src/snippets/feature-product-4/feature-product-4.script-global.ts

const sceneEl = document.querySelector('.feature-product-4__scene');
const wrapperEl = sceneEl?.querySelector('.feature-product-4__wrapper');
const itemEls = sceneEl?.querySelectorAll('.feature-product-4__item');
const itemMobileEls = document.querySelectorAll('.feature-product-4__head--mobile .feature-product-4__item');
if (sceneEl && itemEls && wrapperEl) {
    const initialIndex = 0;
    const initialItem = itemEls[initialIndex];
    const initialItemMobile = itemMobileEls[initialIndex];
    if (initialItem) {
        initialItem.classList.add('feature-product-4__item--modifier');
        initialItemMobile.classList.add('feature-product-4__item--modifier');
        wrapperEl.style.transform = `translateX(0px)`;
    }
    sceneEl.addEventListener('xo:scroll-scene:change', (event) => {
        const customEvent = event;
        const { activeIndex } = customEvent.detail;
        const activeItemEl = itemEls[activeIndex];
        const { left } = offset(activeItemEl);
        const { left: wrapLeft } = offset(wrapperEl);
        wrapperEl.style.transform = `translateX(-${left - wrapLeft}px)`;
        itemEls.forEach((itemEl, index) => {
            if (index === activeIndex) {
                itemEl.classList.add('feature-product-4__item--modifier');
            }
            else {
                itemEl.classList.remove('feature-product-4__item--modifier');
            }
        });
    });
    document.addEventListener('click', (event) => {
        const target = event.target;
        const currentEl = target.closest('.feature-product-4__head--mobile .feature-product-4__heading');
        if (currentEl) {
            const itemEls = document.querySelectorAll('.feature-product-4__head--mobile .feature-product-4__item');
            const activeIndex = currentEl.getAttribute('data-index');
            itemEls.forEach((itemEl, index) => {
                if (index === Number(activeIndex)) {
                    itemEl.classList.add('feature-product-4__item--modifier');
                }
                else {
                    itemEl.classList.remove('feature-product-4__item--modifier');
                }
            });
            // @ts-ignore
            sceneEl.setActive(Number(activeIndex));
        }
    });
}

;// ./src/snippets/language-select/language-select.ts

const language_select_COMPONENT_NAME = 'xo-language-select';
class LanguageSelect extends HTMLElement {
    inputEls = [];
    formEl = null;
    constructor() {
        super();
        this.inputEls = Array.from(this.querySelectorAll('.xo-language-select__content .xo-language-select__input'));
        this.formEl = this.querySelector('.xo-language-select__form');
    }
    handleChange = () => {
        this.formEl?.submit();
    };
    connectedCallback() {
        each(this.inputEls, (inputEl) => {
            inputEl.addEventListener('input', this.handleChange);
        });
    }
    disconnectedCallback() {
        each(this.inputEls, (inputEl) => {
            inputEl.removeEventListener('input', this.handleChange);
        });
    }
}
componentDefine({
    [language_select_COMPONENT_NAME]: LanguageSelect,
});

;// ./src/snippets/menu-horizontal/menu-horizontal.script-global.ts

function init() {
    const menuEl = document.querySelector('.xo-menu-horizontal--click');
    const linkEls = Array.from(menuEl?.querySelectorAll('.xo-menu-horizontal__link') ?? []);
    each(linkEls, (linkEl) => {
        const itemEl = linkEl.parentElement;
        const hasChildMenu = !!itemEl.querySelector('.xo-menu-horizontal__sub-menu') || !!itemEl.querySelector('.xo-menu-horizontal__mega-menu')?.innerHTML.trim();
        if (hasChildMenu) {
            linkEl.addEventListener('click', (event) => {
                event.preventDefault();
                const currentItemEl = linkEl.parentElement;
                const itemParentEl = currentItemEl?.parentElement?.closest('.xo-menu-horizontal__item--click');
                each(linkEls, (linkEl) => {
                    const itemEl = linkEl.parentElement;
                    if (itemEl?.classList.contains('xo-menu-horizontal__item--click') && itemEl !== currentItemEl) {
                        itemEl?.classList.remove('xo-menu-horizontal__item--open');
                    }
                });
                if (currentItemEl?.classList.contains('xo-menu-horizontal__item--click')) {
                    currentItemEl?.classList.toggle('xo-menu-horizontal__item--open');
                }
                itemParentEl?.classList.add('xo-menu-horizontal__item--open');
            });
        }
    });
    const handleWindowClick = (event) => {
        if (!menuEl?.contains(event.target)) {
            each(linkEls, (linkEl) => {
                const itemEl = linkEl.parentElement;
                itemEl?.classList.remove('xo-menu-horizontal__item--open');
            });
        }
    };
    window.addEventListener('click', handleWindowClick);
}
init();
if (window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', (event) => {
        const el = event.target;
        const hasMenu = !!el.querySelector('.xo-menu-horizontal');
        if (hasMenu) {
            init();
        }
    });
}

;// ../../node_modules/.pnpm/@shopify+theme-predictive-search@4.1.1/node_modules/@shopify/theme-predictive-search/src/validate.js
function validateQuery(query) {
  var error;

  if (query === null || query === undefined) {
    error = new TypeError("'query' is missing");
    error.type = "argument";
    throw error;
  }

  if (typeof query !== "string") {
    error = new TypeError("'query' is not a string");
    error.type = "argument";
    throw error;
  }
}

;// ../../node_modules/.pnpm/@shopify+theme-predictive-search@4.1.1/node_modules/@shopify/theme-predictive-search/src/utilities/CustomError.js
function GenericError() {
  var error = Error.call(this);

  error.name = "Server error";
  error.message = "Something went wrong on the server";
  error.status = 500;

  return error;
}

function NotFoundError(status) {
  var error = Error.call(this);

  error.name = "Not found";
  error.message = "Not found";
  error.status = status;

  return error;
}

function ServerError() {
  var error = Error.call(this);

  error.name = "Server error";
  error.message = "Something went wrong on the server";
  error.status = 500;

  return error;
}

function ContentTypeError(status) {
  var error = Error.call(this);

  error.name = "Content-Type error";
  error.message = "Content-Type was not provided or is of wrong type";
  error.status = status;

  return error;
}

function JsonParseError(status) {
  var error = Error.call(this);

  error.name = "JSON parse error";
  error.message = "JSON syntax error";
  error.status = status;

  return error;
}

function ThrottledError(status, name, message, retryAfter) {
  var error = Error.call(this);

  error.name = name;
  error.message = message;
  error.status = status;
  error.retryAfter = retryAfter;

  return error;
}

function InvalidParameterError(status, name, message) {
  var error = Error.call(this);

  error.name = name;
  error.message = message;
  error.status = status;

  return error;
}

function ExpectationFailedError(status, name, message) {
  var error = Error.call(this);

  error.name = name;
  error.message = message;
  error.status = status;

  return error;
}

;// ../../node_modules/.pnpm/@shopify+theme-predictive-search@4.1.1/node_modules/@shopify/theme-predictive-search/src/request.js


function request(searchPath, configParams, query, onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  var route = searchPath + '/suggest.json';

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      var contentType = xhr.getResponseHeader("Content-Type");

      if (xhr.status >= 500) {
        onError(new ServerError());

        return;
      }

      if (xhr.status === 404) {
        onError(new NotFoundError(xhr.status));

        return;
      }

      if (
        typeof contentType !== "string" ||
        contentType.toLowerCase().match("application/json") === null
      ) {
        onError(new ContentTypeError(xhr.status));

        return;
      }

      if (xhr.status === 417) {
        try {
          var invalidParameterJson = JSON.parse(xhr.responseText);

          onError(
            new InvalidParameterError(
              xhr.status,
              invalidParameterJson.message,
              invalidParameterJson.description
            )
          );
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      if (xhr.status === 422) {
        try {
          var expectationFailedJson = JSON.parse(xhr.responseText);

          onError(
            new ExpectationFailedError(
              xhr.status,
              expectationFailedJson.message,
              expectationFailedJson.description
            )
          );
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      if (xhr.status === 429) {
        try {
          var throttledJson = JSON.parse(xhr.responseText);

          onError(
            new ThrottledError(
              xhr.status,
              throttledJson.message,
              throttledJson.description,
              xhr.getResponseHeader("Retry-After")
            )
          );
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      if (xhr.status === 200) {
        try {
          var res = JSON.parse(xhr.responseText);
          res.query = query;
          onSuccess(res);
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      try {
        var genericErrorJson = JSON.parse(xhr.responseText);
        onError(
          new GenericError(
            xhr.status,
            genericErrorJson.message,
            genericErrorJson.description
          )
        );
      } catch (error) {
        onError(new JsonParseError(xhr.status));
      }

      return;
    }
  };

  xhr.open(
    "get",
    route + "?q=" + encodeURIComponent(query) + "&" + configParams
  );

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send();
}
;// ../../node_modules/.pnpm/@shopify+theme-predictive-search@4.1.1/node_modules/@shopify/theme-predictive-search/src/utilities/debounce.js
function debounce(func, wait) {
  var timeout = null;
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      func.apply(context, args);
    }, wait || 0);
  };
}

;// ../../node_modules/.pnpm/@shopify+theme-predictive-search@4.1.1/node_modules/@shopify/theme-predictive-search/src/utilities/Dispatcher.js
function Dispatcher() {
  this.events = {};
}

Dispatcher.prototype.on = function(eventName, callback) {
  var event = this.events[eventName];
  if (!event) {
    event = new DispatcherEvent(eventName);
    this.events[eventName] = event;
  }
  event.registerCallback(callback);
};

Dispatcher.prototype.off = function(eventName, callback) {
  var event = this.events[eventName];
  if (event && event.callbacks.indexOf(callback) > -1) {
    event.unregisterCallback(callback);
    if (event.callbacks.length === 0) {
      delete this.events[eventName];
    }
  }
};

Dispatcher.prototype.dispatch = function(eventName, payload) {
  var event = this.events[eventName];
  if (event) {
    event.fire(payload);
  }
};

function DispatcherEvent(eventName) {
  this.eventName = eventName;
  this.callbacks = [];
}

DispatcherEvent.prototype.registerCallback = function(callback) {
  this.callbacks.push(callback);
};

DispatcherEvent.prototype.unregisterCallback = function(callback) {
  var index = this.callbacks.indexOf(callback);
  if (index > -1) {
    this.callbacks.splice(index, 1);
  }
};

DispatcherEvent.prototype.fire = function(payload) {
  var callbacks = this.callbacks.slice(0);
  callbacks.forEach(function(callback) {
    callback(payload);
  });
};

;// ../../node_modules/.pnpm/@shopify+theme-predictive-search@4.1.1/node_modules/@shopify/theme-predictive-search/src/utilities/Cache.js
function Cache(config) {
  this._store = {};
  this._keys = [];
  if (config && config.bucketSize) {
    this.bucketSize = config.bucketSize;
  } else {
    this.bucketSize = 20;
  }
}

Cache.prototype.set = function(key, value) {
  if (this.count() >= this.bucketSize) {
    var deleteKey = this._keys.splice(0, 1);
    this.delete(deleteKey);
  }

  this._keys.push(key);
  this._store[key] = value;

  return this._store;
};

Cache.prototype.get = function(key) {
  return this._store[key];
};

Cache.prototype.has = function(key) {
  return Boolean(this._store[key]);
};

Cache.prototype.count = function() {
  return Object.keys(this._store).length;
};

Cache.prototype.delete = function(key) {
  var exists = Boolean(this._store[key]);
  delete this._store[key];
  return exists && !this._store[key];
};

;// ../../node_modules/.pnpm/@shopify+theme-predictive-search@4.1.1/node_modules/@shopify/theme-predictive-search/src/utilities/objectToQueryParams.js
function objectToQueryParams(obj, parentKey) {
  var output = "";
  parentKey = parentKey || null;

  Object.keys(obj).forEach(function (key) {
    var outputKey = key + "=";
    if (parentKey) {
      outputKey = parentKey + "[" + key + "]";
    }

    switch (trueTypeOf(obj[key])) {
      case "object":
        output += objectToQueryParams(obj[key], parentKey ? outputKey : key);
        break;
      case "array":
        output += outputKey + "=" + obj[key].join(",") + "&";
        break;
      default:
        if (parentKey) {
          outputKey += "=";
        }
        output += outputKey + encodeURIComponent(obj[key]) + "&";
        break;
    }
  });

  return output;
}

function trueTypeOf(obj) {
  return Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();
}
;// ../../node_modules/.pnpm/@shopify+theme-predictive-search@4.1.1/node_modules/@shopify/theme-predictive-search/src/theme-predictive-search.js




var DEBOUNCE_RATE = 10;
var requestDebounced = debounce(request, DEBOUNCE_RATE);

function PredictiveSearch(config) {
  if (!config) {
    throw new TypeError("No config object was specified");
  }

  var configParameters = config;

  this._retryAfter = null;
  this._currentQuery = null;

  this.dispatcher = new Dispatcher();
  this.cache = new Cache({ bucketSize: 40 });

  this.searchPath = configParameters.search_path || "/search";

  if(configParameters.search_path) {
    delete configParameters['search_path'];
  }

  this.configParams = objectToQueryParams(configParameters);
}

PredictiveSearch.SEARCH_PATH = "/search";

PredictiveSearch.TYPES = {
  PRODUCT: "product",
  PAGE: "page",
  ARTICLE: "article",
  COLLECTION: "collection"
};

PredictiveSearch.FIELDS = {
  AUTHOR: "author",
  BODY: "body",
  PRODUCT_TYPE: "product_type",
  TAG: "tag",
  TITLE: "title",
  VARIANTS_BARCODE: "variants.barcode",
  VARIANTS_SKU: "variants.sku",
  VARIANTS_TITLE: "variants.title",
  VENDOR: "vendor"
};

PredictiveSearch.UNAVAILABLE_PRODUCTS = {
  SHOW: "show",
  HIDE: "hide",
  LAST: "last"
};

PredictiveSearch.prototype.query = function query(query) {
  try {
    validateQuery(query);
  } catch (error) {
    this.dispatcher.dispatch("error", error);
    return;
  }

  if (query === "") {
    return this;
  }

  this._currentQuery = normalizeQuery(query);
  var cacheResult = this.cache.get(this._currentQuery);
  if (cacheResult) {
    this.dispatcher.dispatch("success", cacheResult);
    return this;
  }

  requestDebounced(
    this.searchPath,
    this.configParams,
    query,
    function(result) {
      this.cache.set(normalizeQuery(result.query), result);
      if (normalizeQuery(result.query) === this._currentQuery) {
        this._retryAfter = null;
        this.dispatcher.dispatch("success", result);
      }
    }.bind(this),
    function(error) {
      if (error.retryAfter) {
        this._retryAfter = error.retryAfter;
      }
      this.dispatcher.dispatch("error", error);
    }.bind(this)
  );

  return this;
};

PredictiveSearch.prototype.on = function on(eventName, callback) {
  this.dispatcher.on(eventName, callback);

  return this;
};

PredictiveSearch.prototype.off = function on(eventName, callback) {
  this.dispatcher.off(eventName, callback);

  return this;
};

function normalizeQuery(query) {
  if (typeof query !== "string") {
    return null;
  }

  return query
    .trim()
    .replace(" ", "-")
    .toLowerCase();
}

;// ../../node_modules/.pnpm/@shopify+theme-predictive-search-component@4.1.1_@shopify+theme-predictive-search@4.1.1/node_modules/@shopify/theme-predictive-search-component/src/theme-predictive-search-component.js


var DEFAULT_PREDICTIVE_SEARCH_API_CONFIG = {
  search_path: PredictiveSearch.SEARCH_PATH,
  resources: {
    type: [PredictiveSearch.TYPES.PRODUCT],
    options: {
      unavailable_products: PredictiveSearch.UNAVAILABLE_PRODUCTS.LAST,
      fields: [
        PredictiveSearch.FIELDS.TITLE,
        PredictiveSearch.FIELDS.VENDOR,
        PredictiveSearch.FIELDS.PRODUCT_TYPE,
        PredictiveSearch.FIELDS.VARIANTS_TITLE
      ]
    }
  }
};

function PredictiveSearchComponent(config) {
  // validate config
  if (
    !config ||
    !config.selectors ||
    !config.selectors.input ||
    !isString(config.selectors.input) ||
    !config.selectors.result ||
    !isString(config.selectors.result) ||
    !config.resultTemplateFct ||
    !isFunction(config.resultTemplateFct) ||
    !config.numberOfResultsTemplateFct ||
    !isFunction(config.numberOfResultsTemplateFct) ||
    !config.loadingResultsMessageTemplateFct ||
    !isFunction(config.loadingResultsMessageTemplateFct)
  ) {
    var error = new TypeError("PredictiveSearchComponent config is not valid");
    error.type = "argument";
    throw error;
  }

  // Find nodes
  this.nodes = findNodes(config.selectors);

  // Validate nodes
  if (!isValidNodes(this.nodes)) {
    // eslint-disable-next-line no-console
    console.warn("Could not find valid nodes");
    return;
  }

  // Store the keyword that was used for the search
  this._searchKeyword = "";

  // Assign result template
  this.resultTemplateFct = config.resultTemplateFct;

  // Assign number of results template
  this.numberOfResultsTemplateFct = config.numberOfResultsTemplateFct;

  // Assign loading state template function
  this.loadingResultsMessageTemplateFct =
    config.loadingResultsMessageTemplateFct;

  // Assign number of search results
  this.numberOfResults = config.numberOfResults || 4;

  // Set classes
  this.classes = {
    visibleVariant: config.visibleVariant ?
      config.visibleVariant :
      "predictive-search-wrapper--visible",
    itemSelected: config.itemSelectedClass ?
      config.itemSelectedClass :
      "predictive-search-item--selected",
    clearButtonVisible: config.clearButtonVisibleClass ?
      config.clearButtonVisibleClass :
      "predictive-search__clear-button--visible"
  };

  this.selectors = {
    searchResult: config.searchResult ?
      config.searchResult :
      "[data-search-result]"
  };

  // Assign callbacks
  this.callbacks = assignCallbacks(config);

  // Add input attributes
  addInputAttributes(this.nodes.input);

  // Add input event listeners
  this._addInputEventListeners();

  // Add body listener
  this._addBodyEventListener();

  // Add accessibility announcer
  this._addAccessibilityAnnouncer();

  // Display the reset button if the input is not empty
  this._toggleClearButtonVisibility();

  // Instantiate Predictive Search API
  this.predictiveSearch = new PredictiveSearch(
    config.PredictiveSearchAPIConfig ?
    config.PredictiveSearchAPIConfig :
    DEFAULT_PREDICTIVE_SEARCH_API_CONFIG
  );

  // Add predictive search success event listener
  this.predictiveSearch.on(
    "success",
    this._handlePredictiveSearchSuccess.bind(this)
  );

  // Add predictive search error event listener
  this.predictiveSearch.on(
    "error",
    this._handlePredictiveSearchError.bind(this)
  );
}

/**
 * Private methods
 */
function findNodes(selectors) {
  return {
    input: document.querySelector(selectors.input),
    reset: document.querySelector(selectors.reset),
    result: document.querySelector(selectors.result)
  };
}

function isValidNodes(nodes) {
  if (
    !nodes ||
    !nodes.input ||
    !nodes.result ||
    nodes.input.tagName !== "INPUT"
  ) {
    return false;
  }

  return true;
}

function assignCallbacks(config) {
  return {
    onBodyMousedown: config.onBodyMousedown,
    onBeforeOpen: config.onBeforeOpen,
    onOpen: config.onOpen,
    onBeforeClose: config.onBeforeClose,
    onClose: config.onClose,
    onInputFocus: config.onInputFocus,
    onInputKeyup: config.onInputKeyup,
    onInputBlur: config.onInputBlur,
    onInputReset: config.onInputReset,
    onBeforeDestroy: config.onBeforeDestroy,
    onDestroy: config.onDestroy
  };
}

function addInputAttributes(input) {
  input.setAttribute("autocorrect", "off");
  input.setAttribute("autocomplete", "off");
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("spellcheck", "false");
}

function removeInputAttributes(input) {
  input.removeAttribute("autocorrect", "off");
  input.removeAttribute("autocomplete", "off");
  input.removeAttribute("autocapitalize", "off");
  input.removeAttribute("spellcheck", "false");
}

/**
 * Public variables
 */
PredictiveSearchComponent.prototype.isResultVisible = false;
PredictiveSearchComponent.prototype.results = {};

/**
 * "Private" variables
 */
PredictiveSearchComponent.prototype._latencyTimer = null;
PredictiveSearchComponent.prototype._resultNodeClicked = false;

/**
 * "Private" instance methods
 */
PredictiveSearchComponent.prototype._addInputEventListeners = function () {
  var input = this.nodes.input;
  var reset = this.nodes.reset;

  if (!input) {
    return;
  }

  this._handleInputFocus = this._handleInputFocus.bind(this);
  this._handleInputBlur = this._handleInputBlur.bind(this);
  this._handleInputKeyup = this._handleInputKeyup.bind(this);
  this._handleInputKeydown = this._handleInputKeydown.bind(this);

  input.addEventListener("focus", this._handleInputFocus);
  input.addEventListener("blur", this._handleInputBlur);
  input.addEventListener("keyup", this._handleInputKeyup);
  input.addEventListener("keydown", this._handleInputKeydown);

  if (reset) {
    this._handleInputReset = this._handleInputReset.bind(this);
    reset.addEventListener("click", this._handleInputReset);
  }
};

PredictiveSearchComponent.prototype._removeInputEventListeners = function () {
  var input = this.nodes.input;

  input.removeEventListener("focus", this._handleInputFocus);
  input.removeEventListener("blur", this._handleInputBlur);
  input.removeEventListener("keyup", this._handleInputKeyup);
  input.removeEventListener("keydown", this._handleInputKeydown);
};

PredictiveSearchComponent.prototype._addBodyEventListener = function () {
  this._handleBodyMousedown = this._handleBodyMousedown.bind(this);

  document
    .querySelector("body")
    .addEventListener("mousedown", this._handleBodyMousedown);
};

PredictiveSearchComponent.prototype._removeBodyEventListener = function () {
  document
    .querySelector("body")
    .removeEventListener("mousedown", this._handleBodyMousedown);
};

PredictiveSearchComponent.prototype._removeClearButtonEventListener = function () {
  var reset = this.nodes.reset;

  if (!reset) {
    return;
  }

  reset.removeEventListener("click", this._handleInputReset);
};

/**
 * Event handlers
 */
PredictiveSearchComponent.prototype._handleBodyMousedown = function (evt) {
  if (this.isResultVisible && this.nodes !== null) {
    if (
      evt.target.isEqualNode(this.nodes.input) ||
      this.nodes.input.contains(evt.target) ||
      evt.target.isEqualNode(this.nodes.result) ||
      this.nodes.result.contains(evt.target)
    ) {
      this._resultNodeClicked = true;
    } else {
      if (isFunction(this.callbacks.onBodyMousedown)) {
        var returnedValue = this.callbacks.onBodyMousedown(this.nodes);
        if (isBoolean(returnedValue) && returnedValue) {
          this.close();
        }
      } else {
        this.close();
      }
    }
  }
};

PredictiveSearchComponent.prototype._handleInputFocus = function (evt) {
  if (isFunction(this.callbacks.onInputFocus)) {
    var returnedValue = this.callbacks.onInputFocus(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  if (evt.target.value.length > 0) {
    this._search();
  }

  return true;
};

PredictiveSearchComponent.prototype._handleInputBlur = function () {
  // This has to be done async, to wait for the focus to be on the next
  // element and avoid closing the results.
  // Example: Going from the input to the reset button.
  setTimeout(
    function () {
      if (isFunction(this.callbacks.onInputBlur)) {
        var returnedValue = this.callbacks.onInputBlur(this.nodes);
        if (isBoolean(returnedValue) && !returnedValue) {
          return false;
        }
      }

      if (document.activeElement.isEqualNode(this.nodes.reset)) {
        return false;
      }

      if (this._resultNodeClicked) {
        this._resultNodeClicked = false;
        return false;
      }

      this.close();
    }.bind(this)
  );

  return true;
};

PredictiveSearchComponent.prototype._addAccessibilityAnnouncer = function () {
  this._accessibilityAnnouncerDiv = window.document.createElement("div");

  this._accessibilityAnnouncerDiv.setAttribute(
    "style",
    "position: absolute !important; overflow: hidden; clip: rect(0 0 0 0); height: 1px; width: 1px; margin: -1px; padding: 0; border: 0;"
  );

  this._accessibilityAnnouncerDiv.setAttribute("data-search-announcer", "");
  this._accessibilityAnnouncerDiv.setAttribute("aria-live", "polite");
  this._accessibilityAnnouncerDiv.setAttribute("aria-atomic", "true");

  this.nodes.result.parentElement.appendChild(this._accessibilityAnnouncerDiv);
};

PredictiveSearchComponent.prototype._removeAccessibilityAnnouncer = function () {
  this.nodes.result.parentElement.removeChild(this._accessibilityAnnouncerDiv);
};

PredictiveSearchComponent.prototype._updateAccessibilityAttributesAfterSelectingElement = function (
  previousSelectedElement,
  currentSelectedElement
) {
  // Update the active descendant on the search input
  this.nodes.input.setAttribute(
    "aria-activedescendant",
    currentSelectedElement.id
  );

  // Unmark the previousSelected elemented as selected
  if (previousSelectedElement) {
    previousSelectedElement.removeAttribute("aria-selected");
  }

  // Mark the element as selected
  currentSelectedElement.setAttribute("aria-selected", true);
};

PredictiveSearchComponent.prototype._clearAriaActiveDescendant = function () {
  this.nodes.input.setAttribute("aria-activedescendant", "");
};

PredictiveSearchComponent.prototype._announceNumberOfResultsFound = function (
  results
) {
  var currentAnnouncedMessage = this._accessibilityAnnouncerDiv.innerHTML;
  var newMessage = this.numberOfResultsTemplateFct(results);

  // If the messages are the same, they won't get announced
  // add white space so it gets announced
  if (currentAnnouncedMessage === newMessage) {
    newMessage = newMessage + "&nbsp;";
  }

  this._accessibilityAnnouncerDiv.innerHTML = newMessage;
};

PredictiveSearchComponent.prototype._announceLoadingState = function () {
  this._accessibilityAnnouncerDiv.innerHTML = this.loadingResultsMessageTemplateFct();
};

PredictiveSearchComponent.prototype._handleInputKeyup = function (evt) {
  var UP_ARROW_KEY_CODE = 38;
  var DOWN_ARROW_KEY_CODE = 40;
  var RETURN_KEY_CODE = 13;
  var ESCAPE_KEY_CODE = 27;
  var BACKSPACE = 8;

  if (isFunction(this.callbacks.onInputKeyup)) {
    var returnedValue = this.callbacks.onInputKeyup(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  this._toggleClearButtonVisibility();

  if (this.isResultVisible && this.nodes !== null) {
    if (evt.keyCode === UP_ARROW_KEY_CODE) {
      this._navigateOption(evt, "UP");
      return true;
    }

    if (evt.keyCode === DOWN_ARROW_KEY_CODE) {
      this._navigateOption(evt, "DOWN");
      return true;
    }

    if (evt.keyCode === RETURN_KEY_CODE) {
      this._selectOption();
      return true;
    }

    if (evt.keyCode === ESCAPE_KEY_CODE) {
      this.close();
    }
  }

  if (BACKSPACE === 8 && evt.target.value.length <= 0) {
    this.close();
    this._setKeyword("");
  } else if (evt.target.value.length > 0) {
    this._search();
  }

  return true;
};

PredictiveSearchComponent.prototype._handleInputKeydown = function (evt) {
  var RETURN_KEY_CODE = 13;
  var UP_ARROW_KEY_CODE = 38;
  var DOWN_ARROW_KEY_CODE = 40;

  // Prevent the form default submission if there is a selected option
  if (evt.keyCode === RETURN_KEY_CODE && this._getSelectedOption() != null) {
    evt.preventDefault();
  }

  // Prevent the cursor from moving in the input when using the up and down arrow keys
  if (
    evt.keyCode === UP_ARROW_KEY_CODE ||
    evt.keyCode === DOWN_ARROW_KEY_CODE
  ) {
    evt.preventDefault();
  }
};

PredictiveSearchComponent.prototype._handleInputReset = function (evt) {
  evt.preventDefault();

  if (isFunction(this.callbacks.onInputReset)) {
    var returnedValue = this.callbacks.onInputReset(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  this.nodes.input.value = "";
  this.nodes.input.focus();
  this._toggleClearButtonVisibility();
  this.close();

  return true;
};

PredictiveSearchComponent.prototype._navigateOption = function (evt, direction) {
  var currentOption = this._getSelectedOption();

  if (!currentOption) {
    var firstOption = this.nodes.result.querySelector(
      this.selectors.searchResult
    );
    firstOption.classList.add(this.classes.itemSelected);
    this._updateAccessibilityAttributesAfterSelectingElement(null, firstOption);
  } else {
    if (direction === "DOWN") {
      var nextOption = currentOption.nextElementSibling;
      if (nextOption) {
        currentOption.classList.remove(this.classes.itemSelected);
        nextOption.classList.add(this.classes.itemSelected);
        this._updateAccessibilityAttributesAfterSelectingElement(
          currentOption,
          nextOption
        );
      }
    } else {
      var previousOption = currentOption.previousElementSibling;
      if (previousOption) {
        currentOption.classList.remove(this.classes.itemSelected);
        previousOption.classList.add(this.classes.itemSelected);
        this._updateAccessibilityAttributesAfterSelectingElement(
          currentOption,
          previousOption
        );
      }
    }
  }
};

PredictiveSearchComponent.prototype._getSelectedOption = function () {
  return this.nodes.result.querySelector("." + this.classes.itemSelected);
};

PredictiveSearchComponent.prototype._selectOption = function () {
  var selectedOption = this._getSelectedOption();

  if (selectedOption) {
    selectedOption.querySelector("a, button").click();
  }
};

PredictiveSearchComponent.prototype._search = function () {
  var newSearchKeyword = this.nodes.input.value;

  if (this._searchKeyword === newSearchKeyword) {
    return;
  }

  clearTimeout(this._latencyTimer);
  this._latencyTimer = setTimeout(
    function () {
      this.results.isLoading = true;

      // Annonuce that we're loading the results
      this._announceLoadingState();

      this.nodes.result.classList.add(this.classes.visibleVariant);
      // NOTE: We could benifit in using DOMPurify.
      // https://github.com/cure53/DOMPurify
      this.nodes.result.innerHTML = this.resultTemplateFct(this.results);
    }.bind(this),
    500
  );

  this.predictiveSearch.query(newSearchKeyword);
  this._setKeyword(newSearchKeyword);
};

PredictiveSearchComponent.prototype._handlePredictiveSearchSuccess = function (
  json
) {
  clearTimeout(this._latencyTimer);
  this.results = json.resources.results;

  this.results.isLoading = false;
  this.results.products = this.results.products.slice(0, this.numberOfResults);
  this.results.canLoadMore =
    this.numberOfResults <= this.results.products.length;
  this.results.searchQuery = this.nodes.input.value;

  if (this.results.products.length > 0 || this.results.searchQuery) {
    this.nodes.result.innerHTML = this.resultTemplateFct(this.results);
    this._announceNumberOfResultsFound(this.results);
    this.open();
  } else {
    this.nodes.result.innerHTML = "";

    this._closeOnNoResults();
  }
};

PredictiveSearchComponent.prototype._handlePredictiveSearchError = function () {
  clearTimeout(this._latencyTimer);
  this.nodes.result.innerHTML = "";

  this._closeOnNoResults();
};

PredictiveSearchComponent.prototype._closeOnNoResults = function () {
  if (this.nodes) {
    this.nodes.result.classList.remove(this.classes.visibleVariant);
  }

  this.isResultVisible = false;
};

PredictiveSearchComponent.prototype._setKeyword = function (keyword) {
  this._searchKeyword = keyword;
};

PredictiveSearchComponent.prototype._toggleClearButtonVisibility = function () {
  if (!this.nodes.reset) {
    return;
  }

  if (this.nodes.input.value.length > 0) {
    this.nodes.reset.classList.add(this.classes.clearButtonVisible);
  } else {
    this.nodes.reset.classList.remove(this.classes.clearButtonVisible);
  }
};

/**
 * Public methods
 */
PredictiveSearchComponent.prototype.open = function () {
  if (this.isResultVisible) {
    return;
  }

  if (isFunction(this.callbacks.onBeforeOpen)) {
    var returnedValue = this.callbacks.onBeforeOpen(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  this.nodes.result.classList.add(this.classes.visibleVariant);
  this.nodes.input.setAttribute("aria-expanded", true);
  this.isResultVisible = true;

  if (isFunction(this.callbacks.onOpen)) {
    return this.callbacks.onOpen(this.nodes) || true;
  }

  return true;
};

PredictiveSearchComponent.prototype.close = function () {
  if (!this.isResultVisible) {
    return true;
  }

  if (isFunction(this.callbacks.onBeforeClose)) {
    var returnedValue = this.callbacks.onBeforeClose(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  if (this.nodes) {
    this.nodes.result.classList.remove(this.classes.visibleVariant);
  }

  this.nodes.input.setAttribute("aria-expanded", false);
  this._clearAriaActiveDescendant();
  this._setKeyword("");

  if (isFunction(this.callbacks.onClose)) {
    this.callbacks.onClose(this.nodes);
  }

  this.isResultVisible = false;
  this.results = {};

  return true;
};

PredictiveSearchComponent.prototype.destroy = function () {
  this.close();

  if (isFunction(this.callbacks.onBeforeDestroy)) {
    var returnedValue = this.callbacks.onBeforeDestroy(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  this.nodes.result.classList.remove(this.classes.visibleVariant);
  removeInputAttributes(this.nodes.input);
  this._removeInputEventListeners();
  this._removeBodyEventListener();
  this._removeAccessibilityAnnouncer();
  this._removeClearButtonEventListener();

  if (isFunction(this.callbacks.onDestroy)) {
    this.callbacks.onDestroy(this.nodes);
  }

  return true;
};

PredictiveSearchComponent.prototype.clearAndClose = function () {
  this.nodes.input.value = "";
  this.close();
};

/**
 * Utilities
 */
function getTypeOf(value) {
  return Object.prototype.toString.call(value);
}

function isString(value) {
  return getTypeOf(value) === "[object String]";
}

function isBoolean(value) {
  return getTypeOf(value) === "[object Boolean]";
}

function isFunction(value) {
  return getTypeOf(value) === "[object Function]";
}

/* harmony default export */ var theme_predictive_search_component = (PredictiveSearchComponent);
;// ./src/snippets/predictive-search/predictive-search.ts
// @ts-ignore


// declare let searchFilter: string;
function getLocales() {
    const containerEl = document.querySelector('.xo-predictive-search');
    const locales = containerEl?.dataset.locales;
    if (!locales) {
        throw new Error('Missing data-locales attribute');
    }
    return objectParse(locales);
}
function getCollectionCol(data) {
    if (data?.products.length > 0 || data?.articles.length > 0) {
        return `--xs: 12; --md: 6; --lg: 6`;
    }
    else {
        return `--xs: 12; --md: 12; --lg: 12`;
    }
}
function getPageCol(data) {
    if (data?.products.length > 0 || data?.articles.length > 0) {
        return `--xs: 12; --md: 6; --lg: 6`;
    }
    else {
        return `--xs: 12; --md: 12; --lg: 12`;
    }
}
function getProductCol(data) {
    if (data?.pages.length > 0 || data?.collections.length > 0) {
        if (data?.products.length > 0) {
            return `--xs: 12; --md: 6; --lg: 6`;
        }
        return `--xs: 12; --md: 12; --lg: 12`;
    }
    else {
        return `--xs: 12; --md: 12; --lg: 12`;
    }
}
function getArticleCol(data) {
    if (data?.pages.length > 0 || data?.collections.length > 0) {
        if (data?.articles.length > 0) {
            return `--xs: 12; --md: 6; --lg: 6`;
        }
        return `--xs: 12; --md: 12; --lg: 12`;
    }
    else {
        return `--xs: 12; --md: 12; --lg: 12`;
    }
}
function Page({ url, title }) {
    return `
    <a href="${url}" data-search-result class='xo-predictive-search__item'>
      <span>${title}</span>
    </a>
  `;
}
function Collection({ url, title }) {
    return `
    <a href="${url}" data-search-result class='xo-predictive-search__item'>
      <span>${title}</span>
    </a>
  `;
}
function Product({ url, image, title }) {
    if (image) {
        return `
      <a href="${url}" data-search-result class='xo-predictive-search__item'>
        <div class='xo-predictive-search__item-image'>
          <img src="${image}" alt="${title}"/>
        </div>
        <span class='xo-predictive-search__product-title'>${title}</span>
      </a>
    `;
    }
    else {
        return `
    <a href="${url}" data-search-result class='xo-predictive-search__item'>
      <div class='xo-predictive-search__item-image'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 525.5 525.5"><path d="M439.9 310.8c-.2.2-.1.5.1.7l13.2 8.7c.1.1.2.1.3.1.2 0 .3-.1.4-.2.2-.2.1-.5-.1-.7l-13.2-8.7c-.3-.2-.6-.1-.7.1z"/><path d="M463.4 235c1.1-9.4-1-18.6-5.1-21.6-1.7-1.2-3.6-1.3-5.4-.3l-.3.3-6.1-9.8-.1-.1-.8-8.1c-.2-1.9-1.7-3.3-3.6-3.3h-33c-1.6-33-14-75.8-44-75.9h-.1c-7.8 0-14.9 3.1-21.1 9.3-12.5 12.5-21 38.1-22.3 66.5h-20.7v-2.5c0-1.5-1.2-2.7-2.7-2.7h-3.8c-1.5 0-2.7 1.2-2.7 2.7v2.5H288c-1.9 0-3.4 1.4-3.6 3.3l-.8 8.4-5.9 9.5c-.1-.1-.3-.3-.5-.3-.8-.2-2.2-.3-3.6.8-.4.3-.7.6-1.1 1.1-8.5 9.5-6.5 32.6-.8 51.2h-34.5c.1-2.1.2-4.6.4-7.3.6-10.3 1.3-23.1.1-30.3-1.7-10.1-8.9-21.5-13.3-26.6-3.9-4.5-9.3-10.8-11.1-12.9 6.2-4 9.6-9.6 10.1-16.6v-.6c.3-3-.4-7.1-2.8-9.7-1.5-1.7-3.4-2.5-5.7-2.5h-39.6c-.3-11.5-6.3-23-19.3-23-4.3 0-8.2 1.7-11.4 4.5l-.2-.1c0 .1-.1.2-.1.4-4.5 4.2-7.4 10.8-7.6 18.3h-34.9c-2.3 0-4.3.8-5.7 2.5-2.3 2.6-3.1 6.7-2.8 9.7v.6c.5 7 3.9 12.6 10.1 16.6-1.9 2.2-7.3 8.4-11.1 12.9-5.4 6.3-11.9 17.3-13.3 26.6-2 12.9-.8 23 .2 32 .9 7.8 1.7 14.6.3 21.6-.8 1.7-1.7 3.6-2.4 5.6-3.2 8.4-4.4 18.9-3.6 23.5.7 3.9 4.3 6.7 8.9 8.3H62.8c-.6 0-1 .4-1 1V389c0 .6.4 1 1 1h59.7c.2.4.4.8.5 1.2 1.1 2.4 2.2 5 3.5 8.2.1.2.2.5.3.7 2.3 5.2 7.5 8.8 13.5 8.8h171.3c6 0 11.2-3.6 13.5-8.8v-.1l.3-.6c1.3-3.2 2.5-5.9 3.5-8.3.2-.4.4-.8.5-1.2H442c.9 0 1.7-.5 2.1-1.3.4-.8.3-1.7-.2-2.4l-8.4-10.8c-3-3.8-7.4-6-12.3-6h-53v-30.5c0-.3-.1-.5-.3-.7 6.3-.4 13.3-1.6 21-4 7.8-2.4 14.7-5.7 20.9-9.5H452c1.7 0 3.4-.7 4.5-2s1.7-3 1.5-4.7l-4.2-42.4c0-.1-.1-.3-.1-.4 5.8-13.2 9.3-27.2 9.7-40.5.1.4.1.3 0 .3zm-9.4-20.2c1.1-.6 2.2-.6 3.2.2 1.9 1.4 3.5 5 4.2 9.7-1.5-1.6-3.8-2-5.7-2.3l-1.5-.3c-1.4-.3-2.2-1-2.5-2.1-.3-1 0-2.2.7-3.3l1 1.6c.2.3.5.5.8.5.2 0 .4 0 .5-.2.5-.3.6-.9.3-1.4l-1.4-2.2c.2-.1.3-.1.4-.2zm-2.8 0c-1.5 1.7-2 3.8-1.5 5.7.5 1.8 1.9 3 4 3.5.5.1 1.1.2 1.6.3 3.1.6 5.1 1.1 5.5 3.8.1.5.5.8.9.8.1 3-.2 6.4-.9 9.8-1.9 8.8-4.6 17.3-8.2 25.5l-5.7-56.1 4.3 6.7zm-50.1-7.5h8.3l3.1 27.6c.1.5-.1.9-.4 1.2-.3.3-.7.5-1.2.5h-11.4c-.5 0-.9-.2-1.2-.5s-.4-.8-.4-1.2l3.2-27.6zm10.2-.4l-.1-.7c-.1-.5-.5-.9-1-.9h-10.1c-.5 0-.9.4-1 .9l-.1.7v-7.7h2.3v.6c0 1.3 1.1 2.4 2.4 2.4h3.2c1.3 0 2.4-1.1 2.4-2.4v-.6h2v7.7zm-49.2-14.7V140c1 .3 2 .5 3.1.5s2.1-.2 3.1-.5v52.2h-6.2zm-32.6 0c1.2-26.6 8.8-50.1 19.9-61.3 2.6-2.6 5.4-4.5 8.4-5.7-1.3 1.6-2.1 3.6-2.1 5.9 0 3.4 1.8 6.3 4.5 8 0 .1-.1.2-.1.4v52.7h-30.6zm-8.2 15.2h8.3l3.1 27.6c.1.5-.1.9-.4 1.2s-.7.5-1.2.5h-11.4c-.5 0-.9-.2-1.2-.5s-.4-.8-.4-1.2l3.2-27.6zm10.2-.4l-.1-.7c-.1-.5-.5-.9-1-.9h-10.1c-.5 0-.9.4-1 .9l-.1.7v-7.7h2.1v.5c0 1.3 1.1 2.4 2.4 2.4h3c1.3 0 2.4-1.1 2.4-2.4v-.6h2.3v7.8zm33.6-83.2c.6 0 1.2 0 1.7.1 3.3.8 5.8 3.7 5.8 7.2 0 4.1-3.3 7.4-7.4 7.4s-7.4-3.3-7.4-7.4c0-3.5 2.4-6.4 5.7-7.2.5-.1 1-.1 1.6-.1zm5 15.3c2.7-1.7 4.4-4.6 4.4-8 0-2.3-.8-4.3-2.1-6 17.4 6.6 27.3 36.7 28.7 67.1h-31v-52.7c.1-.2.1-.3 0-.4zm-24.8-12c5.8-5.8 12.5-8.8 19.7-8.8h.1c31 .1 42.2 48.8 42.2 81.5 0 .2-.2.4-.4.4h-3.2c-.2 0-.4-.2-.4-.4 0-2.1 0-4.1-.1-6.2.1-.1.1-.3.1-.5s-.1-.4-.2-.5c-1.5-34.5-14-68.8-36.1-70.8-.6-.1-1.3-.2-2-.2s-1.4.1-2 .2c-5.5.5-10.6 3.1-15.2 7.6-12.6 12.5-20.7 40.1-20.7 70.3 0 .2-.2.4-.4.4h-3c-.2 0-.4-.2-.4-.4.1-30.8 8.7-59.3 22-72.6zM299 208h-5.3l1.7-13.5h1.8L299 208zm-5.4-16v-2.3c0-.4.3-.7.7-.7h3.8c.4 0 .7.3.7.7v2.5h-5.4c.2-.1.2-.1.2-.2zm-7.1 3.7c.1-.8.8-1.5 1.6-1.5h5.3l-1.9 14.7c0 .3.1.6.2.8.2.2.5.3.8.3h7.6c.3 0 .6-.1.8-.3.2-.2.3-.5.2-.8l-1.9-14.7h22.3c0 1-.1 2-.1 3.1h-3.1c-.6 0-1 .4-1 1v11.8c0 .6.4 1 1 1 .2 0 .4-.1.6-.2l-2.7 23.9c-.1 1 .2 2 .9 2.8.7.8 1.6 1.2 2.7 1.2h11.4c1 0 2-.4 2.7-1.2.7-.8 1-1.8.9-2.8l-2.7-23.9c.2.1.3.2.6.2.6 0 1-.4 1-1v-11.8c0-.6-.4-1-1-1H329.4c0-1 0-2.1.1-3.1h71.9c0 1 .1 2 .1 3h-3.3c-.6 0-1 .4-1 1V210c0 .6.4 1 1 1 .2 0 .4-.1.6-.2l-2.7 23.9c-.1 1 .2 2 .9 2.8.7.8 1.6 1.2 2.7 1.2h11.4c1 0 2-.4 2.7-1.2.7-.8 1-1.8.9-2.8l-2.7-23.9c.2.1.3.2.6.2.6 0 1-.4 1-1v-11.8c0-.6-.4-1-1-1h-3c0-1 0-2-.1-3.1h32.9c.8 0 1.5.6 1.6 1.5l7.3 72.1c-11.7 24.7-30.6 45-52.5 55.3h-66.3c0-.4-.1-.9-.1-1.3-.5-4.8-.9-9.5-1.3-14.1h81.6c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H331c-.6-7.5-1.1-14.8-1.1-22v-15.1c0-1.8-1.5-3.3-3.3-3.3h-22.2v-5.7c0-.6-.4-1-1-1h-17.2c-.6 0-1 .4-1 1v5.7h-5.5l6.8-70.5zm75.6 134.2V325h6.1v5.1c-2.1.1-4.1 0-6.1-.2zm-18.6-4.9h16.6v4.6c-5.7-.7-11.3-2.2-16.6-4.6zm26.7 0h23.6c-7.9 3.1-15.8 4.8-23.6 5.1V325zm-10.1 44.6h-25.3c.1-1.2.1-2.5.1-3.8v-6.2c1.1-1.1 2.1-2.3 3.1-3.6.2-.2.2-.5.2-.8l-1.8-11.2c-.1-.4-.4-.7-.8-.8-.4-.1-.8.1-1 .5-.1.2-.3.5-.4.7-.4-5-.8-9.9-1.2-14.8 5.8 3.7 14.8 7.8 27.3 8.8 0 .1-.1.2-.1.3v30.9zm-81.5 6.8h.7v9.6h-.7v-9.6zm-2 16.3h-10.9v-16.3h4.5v8.9c0 .6.4 1 1 1s1-.4 1-1v-8.9h4.5v16.3zm-101.2 1h10.9v8.7l-5.5 4.4-5.5-4.4v-8.7zm-2-7.8h-.7v-9.6h.7v9.6zm2 1v-10.6h4.5v8.9c0 .6.4 1 1 1s1-.4 1-1v-8.9h4.5v15.3h-10.9v-4.7zm0-30.7h10.9v18.2h-4.5v-1c0-.6-.4-1-1-1s-1 .4-1 1v1h-4.5v-18.2zm12.9 20.2h.7v9.6h-.7v-9.6zm-.4 27.3c.2-.2.4-.5.4-.8v-9.2h1.3c.6 0 1-.4 1-1s-.4-1-1-1h-1.3v-3.8h1.7c.6 0 1-.4 1-1v-11.6c0-.6-.4-1-1-1h-1.7v-4.1c.2.2.4.3.7.3h74.4c.1 0 .2 0 .3-.1v3.8H262c-.6 0-1 .4-1 1v11.6c0 .6.4 1 1 1h1.7v4.8h-1.3c-.6 0-1 .4-1 1s.4 1 1 1h1.3v8.2c0 .3.1.6.4.8l4.3 3.4h-84.8l4.3-3.3zm75.8-17.8h-.7v-9.6h.7v9.6zm2 16.6v-7.7h10.9v7.7l-5.5 4.4-5.4-4.4zm6.5-28.1v-1c0-.6-.4-1-1-1s-1 .4-1 1v1h-4.5v-18.2h10.9v18.2h-4.4zm6.4-18.2h2.8c.6 0 1-.4 1-1s-.4-1-1-1h-20.6c-.6 0-1 .4-1 1s.4 1 1 1h2.8v12.5c-.1 0-.2-.1-.3-.1H189c-.3 0-.6.1-.7.3v-12.8h2.8c.6 0 1-.4 1-1s-.4-1-1-1h-20.6c-.6 0-1 .4-1 1s.4 1 1 1h2.8v12.6c-.1-.1-.3-.1-.5-.1h-37.2c-6.2 0-11.2-5-11.2-11.2v-88c0-.7.6-1.3 1.3-1.3h51.7c2 3.3 6.8 9.6 17.9 17.6l-1.1 1.4c-.2.2-.2.5-.2.7 0 .3.2.5.4.7l4 3.1-.6.8c-.3.4-.3 1.1.2 1.4.2.1.4.2.6.2.3 0 .6-.1.8-.4l.6-.8 4 3.1c.2.1.4.2.6.2.3 0 .6-.1.8-.4l1.1-1.4 4.7 3.6c-.1.1-.2.1-.3.2-.8 1.1-1.2 2.5-1 3.8.2 1.4.9 2.6 2 3.5l48.7 37.3c.9.7 2 1.1 3.2 1.1h.7c1.4-.2 2.6-.9 3.5-2 .2-.2.2-.5.2-.7 21.9 14.6 38.4 24.9 51.4 24.9 1.5 0 3-.2 4.5-.5-2.1 1.9-4.8 3-7.6 3h-37.7v-12.3zM152.6 197v5h-6.5v-5h6.5zm-6.5 6h6.5v3.2h-6.5V203zm7.5 5.2c.6 0 1-.4 1-1V197h6.2v10.2c0 .6.4 1 1 1h2.9c.2 10.1 1.1 18.1 3 24.4h-18.9c1.7-7.8 2.6-16.3 2.2-24.4h2.6zm9.2-2V203h6.5v3.2h-6.5zm6.6-4.2h-6.5v-5h6.5v5zm-1 32.6c.5 1.6 1.1 3 1.8 4.3.2.3.5.6.9.6.2 0 .3 0 .4-.1.5-.2.7-.8.4-1.3-.5-1-1-2.2-1.4-3.4H208v8.6h-25.4c-.3 0-.5.2-.5.5s.2.5.5.5H208v4h-27.1c-.7-.3-3.4-2.6-4.2-3.5-.4-.4-1-.5-1.4-.1-.4.4-.5 1-.1 1.4.4.4 1.3 1.3 2.4 2.2h-34c.6-1.3 1.2-2.6 1.7-4h19.4c.3 0 .5-.2.5-.5s-.2-.5-.5-.5h-19c1-2.7 1.9-5.6 2.6-8.6h20.1zm30.6 25.5h-4.6l1.5-9.5h1.6l1.5 9.5zm-55.4-17h-34.9v-8.6h37.6c-.8 3.1-1.7 6-2.7 8.6zm-34.9 1h34.5c-.6 1.4-1.2 2.8-1.8 4h-32.7v-4zm4.3 6.1h27.3c-.7 1.3-1.5 2.5-2.3 3.6-.3.4-.2 1.1.2 1.4.2.1.4.2.6.2.3 0 .6-.1.8-.4 1-1.4 2-3 2.9-4.8h51.3l-1.7 10.8c0 .3 0 .6.2.8.2.2.5.4.8.4h6.9c.3 0 .6-.1.8-.4.2-.2.3-.5.2-.8l-1.7-10.8h4.8v16h-11.9c-2.5-2.7-3.6-4.5-3.7-4.6-.2-.4-.7-.6-1.1-.4l-10.7 3.1c-.3.1-.5.2-.6.5-.1.2-.2.5-.1.8l.2.6h-8.8v-5.7c0-.6-.4-1-1-1h-17.2c-.6 0-1 .4-1 1v5.7h-22.6c-1.8 0-3.3 1.5-3.3 3.3v15.1c0 5.5-.3 11-.7 16.6h-2.7c-5.4-.4-6.1-2.8-6.1-4.9v-46.1zm207.4 18v85.3c-11.3.5-26.1-9.9-43.2-21.8-.3-.2-.6-.4-.9-.7 1.7-2.3 1.3-5.5-1-7.3l-48.6-37.3c-1.1-.8-2.5-1.2-3.9-1-1.4.2-2.6.9-3.5 2 0 0-.1.1-.1.2l-4.7-3.6 1-1.3c.2-.2.2-.5.2-.7 0-.3-.2-.5-.4-.7l-4-3.1.6-.8c.3-.4.3-1.1-.2-1.4-.4-.3-1.1-.3-1.4.2l-.6.8-4-3.1c-.4-.3-1.1-.3-1.4.2l-1.1 1.4c-3.8-2.5-6.8-5-9-7.2h126.2zm-18.3-2h-15.2v-4.7h15.2v4.7zm25.5 85c-1.4.9-3 1.5-4.6 1.9-.5.1-1 .2-1.6.2v-85.2h4.8c.7 0 1.3.6 1.3 1.3v81.7c0 .1.1.1.1.1zm2.5-29.3c.8 8.1 1.6 16.5 2.2 25.1-.9 1.1-1.8 2-2.7 2.8v-33.2c.1 1.8.3 3.5.5 5.3zm-68.2 15.2c1.7 1.1 3.3 2.2 4.9 3.3-.2.1-.4.2-.5.3-.5.7-1.3 1.1-2.1 1.2-.8.1-1.7-.1-2.4-.6l-2.2-1.7c.2 0 .5-.1.6-.4l1.7-2.1zm-3.3 1c-.2.2-.2.5-.2.7l-7.8-6c.2 0 .5-.1.6-.4l2.4-3.1 6.9-9 2.7-3.5 7.4 5.7-12 15.6zm-80.1-72.2l8.9-2.6c1.3 1.9 5.7 7.7 14.7 13.6l-5.6 7.3c-12.6-9.1-16.8-15.9-18-18.3zm18.4 21.1l3.2 2.5-.5.6-3.2-2.5.5-.6zm4.8 3.7l3.2 2.5-.5.6-3.2-2.5.5-.6zm-3.6-5.3l5.6-7.3 8.1 6.2-5.6 7.3-8.1-6.2zm14.9-2.7l-3.2-2.5.4-.5 3.2 2.5-.4.5zm-4.8-3.7l-3.2-2.5.4-.5 3.2 2.5-.4.5zm5.2 6.5l10.3 7.9-5.7 7.4-10.3-7.9 5.7-7.4zm11.5 6.3l-4.1-3.2.1-.1c.5-.7 1.3-1.1 2.1-1.2.9-.1 1.7.1 2.4.6l1.6 1.2-2.1 2.7zm-12.4 7.7c.1-.1.1-.2.2-.3l4.1 3.2-2.2 2.8-1.5-1.2c-.7-.5-1.1-1.3-1.2-2.1s.1-1.7.6-2.4zm13.4-5.7l2.7-3.5 7.4 5.7-9.6 12.5-2.8 3.6-7.4-5.7 9.7-12.6zm26.7 33.5l-24-18.4 5.7-7.4 24 18.4-5.7 7.4zm6.9-9l-24-18.4 2.1-2.7 24 18.4-2.1 2.7zm-32.1-7.8l24 18.4-1.7 2.3c-.2.2-.2.5-.2.7l-24.2-18.6 2.1-2.8zm44.7 13.3l2 1.5c1.4 1.1 1.7 3.1.6 4.5v.1c-1.5-1.1-3.1-2.2-4.7-3.3l2.1-2.8zm-121.7-57.6v-4.7h15.2v4.7h-15.2zm112.7 69.3l5.7-7.4c2.5 1.7 4.9 3.4 7.3 5.1 19.5 13.7 34.9 24.4 47.3 21.8 4.1-.9 7.6-3.2 10.6-7l.3-.3c.2-.3.4-.5.6-.8l1.3 8.2c-15 19.2-35.7 5.5-73.1-19.6zm15.1-77.8c-5-7.8-7.1-17.4-7.3-25.5.2.4.5.6.9.6.1 0 .2 0 .4-.1.5-.2.8-.8.6-1.3-.8-2 1.6-4.1 4.1-6.4 2.4-2.2 4.8-4.4 4.7-6.9-.1-1.3-.8-2.5-2.2-3.6l3.8-6.1-5 49.3zm-1.5-42.8l-1.4 2.2c-.3.5-.1 1.1.3 1.4.2.1.3.2.5.2.3 0 .7-.2.8-.5l1.3-2.1c.8.7 1.2 1.3 1.2 2 .1 1.6-2 3.5-4.1 5.3-1.8 1.6-3.8 3.4-4.5 5.4.2-5.4 1.3-9.8 2.9-12.2.1-.2.2-.3.3-.5.3-.3.5-.6.8-.8.7-.4 1.3-.5 1.9-.4zm-7.7 17.7c0 1 .1 2 .2 3.1.8 9.6 4 18.5 8.8 25.1l-.5 5.4H274c-3.6-11.1-5.6-23.5-5-33.6zm-46.1-29.3c4.3 5 11.2 15.9 12.8 25.6 1.2 7 .4 20.2-.1 29.9-.2 2.7-.3 5.2-.4 7.3h-29v-16h2.8c.6 0 1-.4 1-1v-15.6c0-.6-.4-1-1-1h-39.2c-1.9-6.1-2.9-14.3-3.1-24.4h3.6c.6 0 1-.4 1-1V197h2.8c16.7 0 29.1-2.3 37.4-6.9 1.7 1.9 7.4 8.5 11.4 13.2zm-10-40.3c1.7 1.8 2.2 4.8 1.9 6.8v.5c-1 12.7-15.2 19.1-42.4 19.1h-28.1c-27.1 0-41.4-6.4-42.4-19.1v-.5c-.2-2.1.3-5 1.9-6.8.5-.6 1.1-1 1.8-1.3H211c.7.3 1.3.7 1.9 1.3zm-39.6-3.3h-6c.7-2.7 2.1-9.2 1.2-15.2 3.3 4.1 4.7 9.8 4.8 15.2zm-7.5-18c2.3 6.5.1 15.6-.6 18h-18.4c-.6-2.3-2.7-10.7-.8-17.2 2.8-2.5 6.2-3.9 10-3.9 4.1-.1 7.3 1.1 9.8 3.1zm-22.4 3.6c-.7 5.8.7 11.8 1.3 14.4h-6c.2-5.7 1.9-10.7 4.7-14.4zm-48.1 27c0-.2 0-.5-.1-.7-.2-2.5.4-6.1 2.3-8.2 1.1-1.2 2.5-1.8 4.3-1.8h2c-.2.2-.5.4-.7.6-1.9 2.1-2.4 5.3-2.2 7.6v.5c1 13.3 15.6 20 43.4 20h28.1c27.7 0 42.3-6.7 43.4-20v-.5c.2-2.3-.3-5.6-2.2-7.6-.2-.2-.4-.4-.7-.6h2c1.7 0 3.2.6 4.3 1.8 1.9 2.1 2.5 5.7 2.3 8.2 0 .2 0 .4-.1.7-1.1 15-17 22.7-47.3 22.7h-31.6c-30.2 0-46.1-7.6-47.2-22.7zm-14.1 88.1c-1-8.8-2.2-18.9-.2-31.5 1.5-9.5 8.5-20.6 12.8-25.6 4-4.7 9.7-11.3 11.4-13.2 8.2 4.6 20.7 6.9 37.4 6.9h1.6v10.2c0 .6.4 1 1 1h3.8c.4 8.1-.5 16.6-2.2 24.4h-39c-.6 0-1 .4-1 1v15.6c0 .6.4 1 1 1h3.3v37H79.5c3-7.4 6.8-12.6 6.9-12.7.3-.4.2-1.1-.2-1.4-.4-.3-1.1-.2-1.4.2-.1.1-1.1 1.6-2.5 3.9.3-5.4-.4-10.8-1.1-16.8zM75.4 311c-.7-4.1.4-14 3.3-21.8H111v7.1c0 4.2 2.7 6.5 8 6.9h2.7c-.4 5.4-.9 10.9-1.5 16.5H94.6c-12.1-.1-18.4-4.6-19.2-8.7zm-11.6 77.1v-66.5H120c-1.4 14.1-2.9 28.7-2.8 44.1 0 10.7 1.8 16 4.5 22.3H63.8zm55.3-22.3c0-15.3 1.4-29.8 2.8-43.9.2-1.8.3-3.5.5-5.2v40.8c0 3.2 1.2 6.2 3.1 8.5v26.2c-.2-.5-.5-1.1-.7-1.6-3.5-8-5.6-12.8-5.7-24.8zm9.5 33.7c-.1-.2-.2-.5-.3-.7-.5-1.4-.8-2.9-.8-4.5v-26.5c2.2 1.8 5.1 2.8 8.1 2.8h37.2c.2 0 .3-.1.5-.1v3.9h-1.7c-.6 0-1 .4-1 1V387c0 .6.4 1 1 1h1.7v3.8H172c-.6 0-1 .4-1 1s.4 1 1 1h1.3v9.2c0 .3.1.6.4.8l4.3 3.4h-37.7c-5.2-.1-9.7-3.2-11.7-7.7zm183 7.6H274l4.3-3.4c.2-.2.4-.5.4-.8v-8.2h1.3c.6 0 1-.4 1-1s-.4-1-1-1h-1.3v-4.8h1.7c.6 0 1-.4 1-1v-11.6c0-.6-.4-1-1-1h-1.7v-3.7h37.7c3 0 5.8-1 8.1-2.8v26.5c0 1.6-.3 3.1-.8 4.5l-.3.6c-2 4.6-6.5 7.7-11.8 7.7zm14.9-15v-26.2c.3-.4.6-.7.8-1.1 0-.1 0-.1.1-.2 1.9-.8 3.7-1.8 5.5-3.2v4.4c0 12-2.2 16.8-5.7 24.8-.3.5-.5 1-.7 1.5zm107.4-15.3l8.4 10.8c.1.1.1.3 0 .3 0 .1-.1.2-.3.2H330.4c2.2-5.1 3.7-9.5 4.2-16.5h88.8c4 0 7.9 1.9 10.5 5.2zm-65.7-37.7v30.5h-6.1V338.5c1.1.1 2.2.1 3.4.1 1 0 2 0 3-.1-.2.2-.3.4-.3.6zm22.1-6.5c-29.7 9.2-48.8.6-57.8-5.5-.1-.7-.1-1.4-.2-2h6.4c9.1 4.8 19 7.2 29.2 7.2h.9c.1 0 .2.1.3.1.1 0 .2 0 .3-.1 9.8-.2 19.9-2.6 29.7-7.3 27.3-12.8 49.4-39.8 59.9-72.2-3 13.8-8.9 27.6-16.9 39.7-9.1 13.8-25.5 32-51.8 40.1zm65.8-14c.1 1.2-.2 2.3-1 3.1-.8.9-1.9 1.3-3 1.3H415c13.4-8.9 22.8-20.2 29-29.5 3.1-4.6 5.8-9.5 8.2-14.5l3.9 39.6z"/><path d="M322.1 233.3h6.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5h-5.9l2.2-21.3c0-.3-.2-.5-.4-.5-.3 0-.5.2-.5.4l-2.2 21.9c0 .1 0 .3.1.4-.1 0 0 .1.2.1zm79.7.8h8.3c.3 0 .5-.2.5-.5s-.2-.5-.5-.5h-7.8l2.1-22.1c0-.3-.2-.5-.5-.5s-.5.2-.5.5l-2.2 22.6c0 .1 0 .3.1.4.2 0 .4.1.5.1zm-232.3 8.6c.3.1.7.1 1 .1 1.2 0 2.5-.5 3.3-1.4 1-1 1.4-2.3 1.1-3.6-.1-.5-.7-.9-1.2-.8-.5.1-.9.7-.8 1.2.2.8-.3 1.5-.5 1.8-.6.6-1.6.9-2.5.7-.5-.1-1.1.2-1.2.8-.1.5.3 1.1.8 1.2z"/><path d="M171.4 243.4c-.5 0-1 .4-1 1s.4 1 1 1h.2c2.6 0 5-2 5.5-4.5.1-.5-.2-1.1-.8-1.2-.5-.1-1.1.2-1.2.8-.3 1.7-2 3-3.7 2.9zm-32.3 15.8c.3 0 .7 0 1-.1.5-.1.9-.6.8-1.2-.1-.5-.6-.9-1.2-.8-.9.2-1.8-.1-2.5-.7-.3-.3-.7-.9-.5-1.8.1-.5-.2-1.1-.8-1.2-.5-.1-1.1.2-1.2.8-.3 1.3.1 2.6 1.1 3.6.8.9 2 1.4 3.3 1.4z"/><path d="M138 261.9h.2c.6 0 1-.5 1-1 0-.6-.5-1-1-1-1.7.1-3.4-1.3-3.7-2.9-.1-.5-.6-.9-1.2-.8-.5.1-.9.6-.8 1.2.5 2.5 2.9 4.5 5.5 4.5z"/><path d="M131 264.5c.1 0 .2 0 .4-.1 1.2-.4 2.2-1.1 3-2 .4-.4.3-1-.1-1.4-.4-.4-1-.3-1.4.1-.6.7-1.3 1.2-2.2 1.5-.5.2-.8.8-.6 1.3.1.3.5.6.9.6zm33.7 99.2h-26.1c-4.3 0-7.9-3.5-7.9-7.9v-82c0-.3-.2-.5-.5-.5s-.5.2-.5.5v82c0 4.9 4 8.9 8.9 8.9h26.1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm91.6 0h-60.6c-.3 0-.5.2-.5.5s.2.5.5.5h60.6c.3 0 .5-.2.5-.5s-.3-.5-.5-.5z"/></svg>
      </div>
      <span class='xo-predictive-search__product-title'>${title}</span>
    </a>
  `;
    }
}
function Article({ url, image, title }) {
    return `
    <a href="${url}" data-search-result class='xo-predictive-search__item'>
      <div class='xo-predictive-search__item-image'>
        <img src="${image}" alt="${title}"/>
      </div>
      <span class='xo-predictive-search__article-title'>${title}</span>
    </a>
  `;
}
function ProductList(data) {
    const hasData = data?.products.length > 0;
    if (!hasData) {
        return '';
    }
    return `
    <div style="${getProductCol(data)}">
      <h6 class='xo-predictive-search__heading'>${getLocales().products}</h6>
      <div class='xo-predictive-search__item-list xo-predictive-search__item-list--product'>
        ${data.products.map(Product).join('')}
      </div>
    </div>
  `;
}
function ArticleList(data) {
    const hasData = data?.articles.length > 0;
    if (!hasData) {
        return '';
    }
    return `
    <div style="${getArticleCol(data)}">
    <h6 class='xo-predictive-search__heading'>${getLocales().articles}</h6>
      <div class='xo-predictive-search__item-list xo-predictive-search__item-list--article'>
        ${data.articles.map(Article).join('')}
      </div>
    </div>
  `;
}
function CollectionList(data) {
    const hasData = data?.collections.length > 0;
    if (!hasData) {
        return '';
    }
    return `
    <div style="${getCollectionCol(data)}">
      <h6 class='xo-predictive-search__heading'>${getLocales().collections}</h6>
      <div class='xo-predictive-search__item-list xo-predictive-search__item-list--collection'>
        ${data.collections.map(Collection).join('')}
      </div>
    </div>
  `;
}
function PageList(data) {
    const hasData = data?.pages.length > 0;
    if (!hasData) {
        return '';
    }
    return `
    <div style="${getPageCol(data)}">
      <h6 class='xo-predictive-search__heading'>${getLocales().pages}</h6>
      <div class='xo-predictive-search__item-list'>
        ${data.pages.map(Page).join('')}
      </div>
    </div>
  `;
}
const iconCartEmpty = `
  <svg xmlns="http://www.w3.org/2000/svg" width="142" height="144" viewBox="0 0 142 144" fill="none">
    <path opacity="0.1" d="M70.9994 77.7202C68.8642 77.7202 67.1333 75.99 67.1323 73.8551C67.1323 73.745 67.0864 62.7274 64.1275 51.9627C60.515 38.8202 54.4654 32.1562 46.1463 32.1562C38.7131 32.1562 35.3857 36.5808 35.3857 40.966C35.3857 46.9627 41.3456 53.417 54.4306 53.417C56.5663 53.417 58.2978 55.1485 58.2978 57.2842C58.2978 59.4199 56.5663 61.1514 54.4306 61.1514C37.5668 61.1514 27.6514 51.7732 27.6514 40.966C27.6514 32.7446 34.0041 24.4219 46.1463 24.4219C54.5799 24.4219 65.846 28.8689 71.6236 50.0536C74.8298 61.8091 74.8666 73.3668 74.8666 73.853C74.8666 75.9888 73.1352 77.7202 70.9994 77.7202Z" fill="#135AB2"/>
    <path opacity="0.1" d="M83.4268 61.1547C81.291 61.1547 79.5596 59.4232 79.5596 57.2875C79.5596 55.1518 81.291 53.4203 83.4268 53.4203C101.923 53.4203 108.652 43.9055 108.652 36.8956C108.652 29.8031 102.504 23.875 91.7113 23.875C89.5756 23.875 87.8441 22.1435 87.8441 20.0078C87.8441 17.8721 89.5756 16.1406 91.7113 16.1406C109.315 16.1406 116.387 27.843 116.387 36.8956C116.387 49.8274 104.308 61.1547 83.4268 61.1547Z" fill="#135AB2"/>
    <path d="M88.1137 21.3398C90.26 14.2578 86.2587 6.77673 79.1767 4.63043C72.0946 2.48414 64.6136 6.48537 62.4673 13.5674C60.321 20.6495 64.3222 28.1305 71.4043 30.2768C78.4863 32.4231 85.9674 28.4219 88.1137 21.3398Z" fill="#135AB2"/>
    <path opacity="0.83" d="M75.281 11.2578C72.3653 11.2578 69.9932 14.0343 69.9932 17.447C69.9932 20.8597 72.3653 23.6361 75.281 23.6361C78.1967 23.6361 80.5689 20.8597 80.5689 17.447C80.5689 14.0343 78.1968 11.2578 75.281 11.2578ZM75.281 20.2703C74.2391 20.2703 73.3589 18.9774 73.3589 17.4469C73.3589 15.9164 74.2391 14.6234 75.281 14.6234C76.3229 14.6234 77.2033 15.9164 77.2033 17.4469C77.2033 18.9774 76.323 20.2703 75.281 20.2703Z" fill="white"/>
    <path d="M75.2812 14.6235C76.3232 14.6235 77.2035 15.9165 77.2035 17.447C77.2035 18.9775 76.3232 20.2705 75.2812 20.2705V23.6361C78.1969 23.6361 80.5692 20.8597 80.5692 17.447C80.5692 14.0343 78.1969 11.2578 75.2812 11.2578V14.6235Z" fill="white"/>
    <path opacity="0.7" d="M71 100.313V93.2424L90.711 74.1328H141.5L116.289 100.313H71Z" fill="#135AB2"/>
    <path opacity="0.4" d="M25.7109 100.312V140C25.7109 142.209 27.5018 144 29.7109 144H112.289C114.498 144 116.289 142.209 116.289 140V100.312H25.7109Z" fill="#135AB2"/>
    <path opacity="0.4" d="M71 144H112.289C114.498 144 116.289 142.209 116.289 140V100.312H71V144Z" fill="#135AB2"/>
    <path opacity="0.3" d="M71 100.313V93.2424L51.8708 74.6969C51.4976 74.3351 50.9983 74.1328 50.4786 74.1328H5.20256C3.43888 74.1328 2.53855 76.2497 3.76194 77.5201L25.7109 100.313H71Z" fill="#135AB2"/>
  </svg>
`;
const searchEmpty = 'No result found';
function Root(data) {
    const hasData = data?.products.length > 0 || data?.articles.length > 0 || data?.pages.length > 0 || data?.collections.length > 0;
    if (!hasData) {
        return `
      <div class="xo-predictive-search__inner xo-predictive-search__inner--empty">
        <xo-container>
          <div class="xo-predictive-search__inner-content">
            <div class="xo-predictive-search__empty">
              ${iconCartEmpty}
              <div class="xo-predictive-search__empty-text">
                <p>${searchEmpty}</p>
              </div>
            </div>
          </div>
        </xo-container>
      </div>
    `;
    }
    return `
    <div class="xo-predictive-search__inner">
      <xo-container class="xo-predictive-search__inner-container">
        <div class="xo-predictive-search__inner-content">
          <xo-grid class="xo-predictive-search__inner-content-grid">
            ${CollectionList(data)}
            ${PageList(data)}
            ${ProductList(data)}
            ${ArticleList(data)}
          </xo-grid>
        </div>
      </xo-container>
    </div>
  `;
}
const predictiveSearch = new theme_predictive_search_component({
    selectors: {
        input: '[data-predictive-search-input="header"]',
        reset: '[data-predictive-search-reset="header"]',
        result: '[data-predictive-search-result="header"]',
    },
    PredictiveSearchAPIConfig: {
        search_path: '/search',
        resources: {
            type: ['product', 'article', 'page', 'collection'],
            options: {
                unavailable_products: 'last',
                fields: ['title', 'vendor', 'product_type', 'variants.title'],
            },
        },
    },
    resultTemplateFct: Root,
    // (a11y) Function to return the number of results that you will display.
    // This will be announced to the user via an aria-live.
    numberOfResultsTemplateFct: (data) => {
        if (data.products.length === 1) {
            return 'one result found';
        }
        return '[results_count] results found'.replace('[results_count]', `${data.products.length}`);
    },
    // (a11y) Return a string that indicates that we're loading results.
    // This will be announced to the user via an aria-live.
    loadingResultsMessageTemplateFct: () => {
        return 'loading';
    },
    onInputFocus: (nodes) => {
        if (nodes.input.value) {
            predictiveSearch.open();
        }
    },
    onInputKeyup: () => {
        return true; // This will allow the event callback to execute
    },
    onInputBlur: () => {
        return false; // This will prevent the event callback to execute
    },
    // onInputClear: (nodes) => {},s
    // onBeforeKill: (nodes) => {},
    // onBeforeOpen: (nodes) => {},
    // onOpen: (nodes) => {},
    // onBeforeClose: (nodes) => {},
    // onClose: (nodes) => {},
    // onDestroy: (nodes) => {},
});

// EXTERNAL MODULE: ./src/snippets/product-specification-10/product-specification-10.script-global.ts
var product_specification_10_script_global = __webpack_require__(446);
;// ./src/snippets/share/share.ts

const share_COMPONENT_NAME = 'xo-copy';
const TOAST_NAME = 'share-copy';
class Copy extends HTMLElement {
    static defaultOptions = {
        xoUrl: '',
    };
    get options() {
        const options = getAttrs(this, {
            pick: ['xoUrl'],
            types: {
                xoUrl: 'string',
            },
        });
        return {
            ...Copy.defaultOptions,
            ...options,
        };
    }
    handleClick = async () => {
        try {
            const { options } = this;
            const { xoUrl } = options;
            await navigator.clipboard.writeText(xoUrl);
            // @ts-ignore
            xoToast({ name: TOAST_NAME });
        }
        catch (err) {
            console.error(err);
        }
    };
    connectedCallback() {
        this.addEventListener('click', this.handleClick);
    }
    disconnectedCallback() {
        this.removeEventListener('click', this.handleClick);
    }
}
componentDefine({
    [share_COMPONENT_NAME]: Copy,
});

;// ./src/snippets/testimonial-box-9/constants.ts
const TESTIMONIAL = 'xo-testimonial';
const TESTIMONIAL_CONTENT = 'xo-testimonial-content';
const TESTIMONIAL_SLIDE = 'xo-testimonial-content-slide';
const TESTIMONIAL_ITEM = 'xo-testimonial-item';
const TESTIMONIAL_NEXT = 'xo-testimonial-next';
const TESTIMONIAL_PREV = 'xo-testimonial-prev';

;// ./src/snippets/testimonial-box-9/testimonial-content.ts
var testimonial_content_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


let TestimonialContent = class TestimonialContent extends XoComponent {
    static propTypes = {
        xoPlacement: 'string',
    };
    static defaultProps = {};
    setPlacement(value) {
        this.setProps({ xoPlacement: value });
    }
    getContentMeasure() {
        return {
            width: this.offsetWidth,
            height: this.offsetHeight,
            top: this.offsetTop,
            left: this.offsetLeft,
        };
    }
    mount() { }
    unmount() { }
};
TestimonialContent = testimonial_content_decorate([
    customElements_customElements(TESTIMONIAL_CONTENT)
], TestimonialContent);


;// ./src/snippets/testimonial-box-9/testimonial-item.ts
var testimonial_item_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


let TestimonialItem = class TestimonialItem extends XoComponent {
    static propTypes = {
        xoIndex: 'number',
        xoActive: 'boolean',
    };
    static defaultProps = {};
    setActive(value) {
        this.setProps({ xoActive: value });
    }
    getIndex() {
        return this.props.xoIndex;
    }
    getMeasure() {
        const targetEl = this.querySelector('xo-parallax-scroll') ?? this;
        const parentEl = this.closest(TESTIMONIAL);
        const { top: parentTop } = offset(parentEl);
        const { top } = offset(targetEl);
        return {
            width: this.offsetWidth,
            height: this.offsetHeight,
            top: top - parentTop,
            left: this.offsetLeft,
        };
    }
    mount() { }
    unmount() { }
};
TestimonialItem = testimonial_item_decorate([
    customElements_customElements(TESTIMONIAL_ITEM)
], TestimonialItem);


;// ./src/snippets/testimonial-box-9/testimonial.ts
var testimonial_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


let Testimonial = class Testimonial extends XoComponent {
    static propTypes = {
        xoAutoplay: 'boolean',
        xoAutoplaySpeed: 'number',
        xoAnimated: 'boolean',
        xoDuration: 'number',
        xoActiveIndex: 'number',
    };
    static defaultProps = {
        xoAutoplay: false,
        xoAutoplaySpeed: 1000,
        xoAnimated: false,
        xoDuration: 300,
        xoActiveIndex: 0,
    };
    itemEls = Array.from(this.querySelectorAll(TESTIMONIAL_ITEM));
    contentEl = this.querySelector(TESTIMONIAL_CONTENT);
    slide1El = this.querySelector(`${TESTIMONIAL_SLIDE}:nth-child(1)`);
    slide2El = this.querySelector(`${TESTIMONIAL_SLIDE}:nth-child(2)`);
    nextEl = this.querySelector(TESTIMONIAL_NEXT);
    prevEl = this.querySelector(TESTIMONIAL_PREV);
    mutationObserver = null;
    timeId = -1;
    state = {
        activeIndex: undefined,
    };
    goTo = (step) => {
        this.setState((prevState) => {
            if (prevState.activeIndex == null) {
                return {
                    activeIndex: 0,
                };
            }
            return {
                activeIndex: wrapAroundRange(prevState.activeIndex + step, 0, this.itemEls.length - 1),
            };
        });
    };
    increment = () => {
        this.goTo(1);
    };
    decrement = () => {
        this.goTo(-1);
    };
    autoplay = () => {
        this.goTo(1);
    };
    setMeasureVars = (measure) => {
        if (!this.contentEl) {
            return;
        }
        this.contentEl.style.setProperty('--top', `${measure.top}`);
        this.contentEl.style.setProperty('--left', `${measure.left}`);
        this.contentEl.style.setProperty('--width', `${measure.width}`);
        this.contentEl.style.setProperty('--height', `${measure.height}`);
    };
    setPlacement(measureContent, measure) {
        const { width, height } = measureContent;
        const innerWidth = this.offsetWidth;
        if (!this.contentEl) {
            return;
        }
        if (measure.left + width > innerWidth && measure.top - height < 0) {
            this.contentEl.setPlacement('bottom-left');
        }
        else if (measure.left + width > innerWidth) {
            this.contentEl.setPlacement('top-left');
        }
        else if (measure.top - height < 0) {
            this.contentEl.setPlacement('bottom-right');
        }
        else {
            this.contentEl.setPlacement('top-right');
        }
    }
    handleAnimate = (currentEl) => {
        if (!this.contentEl || !this.slide1El || !this.slide2El) {
            return;
        }
        const { xoDuration } = this.props;
        const { activeIndex } = this.state;
        const content = currentEl.querySelector('template')?.innerHTML ?? '';
        this.contentEl.style.height = `${this.slide1El.offsetHeight}px`;
        if (activeIndex == null) {
            this.slide1El.innerHTML = content;
            this.slide2El.innerHTML = content;
        }
        else {
            this.setProps({ xoAnimated: true });
            this.slide2El.innerHTML = content;
            this.contentEl.style.height = `${this.slide2El.offsetHeight}px`;
            this.timeId = window.setTimeout(() => {
                this.slide1El.innerHTML = content;
                this.setProps({ xoAnimated: false });
                this.contentEl.style.removeProperty('height');
            }, xoDuration);
        }
    };
    handleItemActive = (currentEl) => {
        this.itemEls.forEach((el) => el.setActive(false));
        currentEl.setActive(true);
    };
    updateUI = (currentEl, contentEl) => {
        const measure = currentEl.getMeasure();
        const measureContent = contentEl.getContentMeasure();
        this.setMeasureVars(measure);
        this.handleAnimate(currentEl);
        this.handleItemActive(currentEl);
        this.setPlacement(measureContent, measure);
    };
    handleClick = (event) => {
        const target = event.target;
        const currentEl = target.closest(TESTIMONIAL_ITEM);
        if (currentEl) {
            this.setState({
                activeIndex: currentEl.getIndex(),
            });
        }
    };
    mount() {
        const { xoAutoplay, xoAutoplaySpeed, xoDuration, xoActiveIndex } = this.props;
        const prvEl = this.querySelector(`${TESTIMONIAL_ITEM} xo-parallax-scroll`);
        if (xoActiveIndex != null) {
            this.setState({ activeIndex: xoActiveIndex });
        }
        this.style.setProperty('--duration', `${xoDuration}`);
        this.addEventListener('click', this.handleClick);
        this.nextEl?.addEventListener('click', this.increment);
        this.prevEl?.addEventListener('click', this.decrement);
        if (xoAutoplay) {
            this.timeId = window.setInterval(this.autoplay, xoAutoplaySpeed);
        }
        if (prvEl) {
            this.mutationObserver = new MutationObserver(() => {
                const currentEl = this.itemEls[this.state.activeIndex ?? 0];
                const measure = currentEl.getMeasure();
                this.setMeasureVars(measure);
            });
            this.mutationObserver.observe(prvEl, { attributes: true, attributeFilter: ['style'] });
        }
        window.addEventListener('resize', () => {
            const currentEl = this.itemEls[this.state.activeIndex ?? 0];
            const contentEl = this.querySelector(TESTIMONIAL_CONTENT);
            if (contentEl) {
                this.updateUI(currentEl, contentEl);
            }
        });
    }
    stateUpdate(prevState) {
        if (prevState.activeIndex !== this.state.activeIndex) {
            const currentEl = this.itemEls[this.state.activeIndex ?? 0];
            const contentEl = this.contentEl;
            if (currentEl && contentEl) {
                this.updateUI(currentEl, contentEl);
            }
        }
    }
    unmount() {
        this.removeEventListener('click', this.handleClick);
        this.nextEl?.removeEventListener('click', this.increment);
        this.prevEl?.removeEventListener('click', this.decrement);
        window.clearTimeout(this.timeId);
    }
};
Testimonial = testimonial_decorate([
    customElements_customElements(TESTIMONIAL)
], Testimonial);


// EXTERNAL MODULE: ./src/snippets/transform-list/transform-list.script-global.ts
var transform_list_script_global = __webpack_require__(390);
// EXTERNAL MODULE: ./src/snippets/transform-pill/transform-pill.script-global.ts
var transform_pill_script_global = __webpack_require__(152);
;// ./src/snippets/video/video.ts
var video_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

//@ts-ignore
let XoVideoCustom = class XoVideoCustom extends XoComponent {
    posterEl = null;
    btnEl = null;
    handleClick = () => {
        if (this.posterEl) {
            this.posterEl.style.setProperty('display', 'none');
        }
        if (this.btnEl) {
            this.btnEl.style.setProperty('display', 'none');
        }
    };
    mount() {
        this.posterEl = this.querySelector('.xo-video__poster');
        this.btnEl = this.querySelector('.xo-video__button');
        if (this.btnEl) {
            this.btnEl.addEventListener('click', this.handleClick);
        }
    }
    unmount() {
        if (this.btnEl) {
            this.btnEl.removeEventListener('click', this.handleClick);
        }
    }
};
XoVideoCustom = video_decorate([
    customElements_customElements('xo-video-custom')
], XoVideoCustom);


;// ./src/pages/addresses/snippets/address-form/address-form.ts

const address_form_COMPONENT_NAME = 'xo-address-form';
const EDIT_ADDRESS_PREFIX = 'edit-address-';
const CREATE_ADDRESS = 'create-address';
const CREATE_ADDRESS_ID = 'new';
const PARENT_SELECTOR = '.js-address-province';
class AddressForm extends HTMLElement {
    unsubscribe = () => { };
    addressId = '';
    selectCountryEl = null;
    connectedCallback() {
        // @ts-ignore
        this.unsubscribe = xoStore.subscribe('xo-modal', ({ data }) => {
            const modalData = objectValues(data).find((item) => item.isOpen);
            if (modalData && modalData.isOpen) {
                if (modalData.options.xoName?.includes(EDIT_ADDRESS_PREFIX)) {
                    this.addressId = modalData.options.xoName.replace(EDIT_ADDRESS_PREFIX, '');
                    this.bindCountry();
                }
                else if (modalData.options.xoName === CREATE_ADDRESS) {
                    this.addressId = CREATE_ADDRESS_ID;
                    this.bindCountry();
                }
            }
        });
    }
    bindCountry = () => {
        this.selectCountryEl = document.querySelector(`select[name="address[country]"][data-country-id="${this.addressId}"]`);
        const countryDataDefault = this.selectCountryEl?.getAttribute('data-default');
        const countryOptionEl = this.selectCountryEl?.querySelector(`option[value="${countryDataDefault}"]`);
        if (countryOptionEl) {
            countryOptionEl.setAttribute('selected', 'selected');
            const provinces = this.getProvinces(countryOptionEl);
            this.renderProvinces(provinces);
        }
        const selectProvinceEl = document.querySelector(`select[name="address[province]"][data-province-id="${this.addressId}"]`);
        const provinceDataDefault = selectProvinceEl?.getAttribute('data-default');
        const provinceOptionEl = selectProvinceEl?.querySelector(`option[value="${provinceDataDefault}"]`);
        if (provinceOptionEl) {
            provinceOptionEl.setAttribute('selected', 'selected');
        }
        this.selectCountryEl?.addEventListener('change', this.handleCountryChange);
    };
    getProvinces = (optionEl) => {
        const provinces = objectParse(optionEl.getAttribute('data-provinces') ?? '[]');
        return provinces;
    };
    handleCountryChange = (event) => {
        const targetEl = event.target;
        const optionEl = targetEl.querySelector(`option[value="${targetEl.value}"]`);
        if (optionEl) {
            const provinces = this.getProvinces(optionEl);
            this.renderProvinces(provinces);
        }
    };
    renderProvinces = (provinces) => {
        const selectProvinceEl = document.querySelector(`select[name="address[province]"][data-province-id="${this.addressId}"]`);
        if (selectProvinceEl) {
            selectProvinceEl.innerHTML = provinces.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
            const parentEl = selectProvinceEl.closest(PARENT_SELECTOR);
            const isShow = provinces.length > 0;
            if (parentEl) {
                if (isShow) {
                    parentEl.classList.remove('hide');
                }
                else {
                    parentEl.classList.add('hide');
                }
            }
        }
    };
    disconnectedCallback() {
        this.unsubscribe();
        this.selectCountryEl?.removeEventListener('change', this.handleCountryChange);
    }
}
componentDefine({
    [address_form_COMPONENT_NAME]: AddressForm,
});

// EXTERNAL MODULE: ./src/pages/product/main-product/main-product.ts
var main_product = __webpack_require__(91);
;// ./src/pages/product/snippets/pickup-availability-list/pickup-availability-list.ts

const pickup_availability_list_COMPONENT_NAME = 'xo-product-pickup-availability-custom-content';
class ProductPickupAvailabilityCustomContentUI extends HTMLElement {
    connectedCallback() {
        const id = this.getAttribute('xo-id');
        const templateEl = document.querySelector('#pickup-custom-content-template');
        const contentEl = templateEl?.content.querySelector(`[xo-content-id="${id}"]`);
        if (contentEl) {
            const content = contentEl.innerHTML;
            if (this.innerHTML !== content) {
                this.innerHTML = content;
            }
        }
    }
}
componentDefine({
    [pickup_availability_list_COMPONENT_NAME]: ProductPickupAvailabilityCustomContentUI,
});

;// ./src/pages/product/snippets/product-recommendations/product-recommendations.script.ts

const product_recommendations_script_COMPONENT_NAME = 'xo-product-recommendations';
class ProductRecommendations extends HTMLElement {
    get options() {
        const options = getAttrs(this, {
            pick: ['xoUrl'],
            types: {
                xoUrl: 'string',
            },
        });
        return options;
    }
    handleIntersection = async (entries, observer) => {
        try {
            if (!entries[0].isIntersecting) {
                return;
            }
            observer.unobserve(this);
            const { xoUrl } = this.options;
            const res = await fetch(xoUrl);
            const text = await res.text();
            const html = document.createElement('div');
            html.innerHTML = text;
            const recommendations = html.querySelector(product_recommendations_script_COMPONENT_NAME);
            if (recommendations && recommendations.innerHTML.trim().length) {
                this.innerHTML = recommendations.innerHTML;
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    connectedCallback() {
        new IntersectionObserver(this.handleIntersection, { rootMargin: '0px 0px 400px 0px' }).observe(this);
    }
}
componentDefine({
    [product_recommendations_script_COMPONENT_NAME]: ProductRecommendations,
});

// EXTERNAL MODULE: ./src/update-product.ts
var update_product = __webpack_require__(812);
;// ./src/main.ts

// Import all sections ts files











;



// Snippets ts

























// Product

// Import SCSS
// import 'basehtml/src/styles/main.scss';

// @ts-ignore
if (window.settings?.quick_link) {
    pageSpeed();
}
console.log('%c Futurer theme by Xotiny ', 'background:#243b90;color: #fff', 'Learn more at https:/xotiny.com/');

/******/ })()
;