class DropdownMenu extends HTMLElement {
  constructor() {
    super();

    this.classes = {
      hover: 'is-hover',
      active: 'is-active',
      animate: 'show-from-bottom',
    };
    this.selectors = {
      header: 'shopify-section-header',
      background: '.header-background',
      topMenuItem: '.header__menu-item--top',
      menus: 'dropdown-menu, mega-menu',
      wrapper: '.list-menu',
      childAnimate: '.list-menu-dropdown > .list-menu'
    };
    this.timeout;

    this.addEventListener('focusin', this.handleMouseover.bind(this));
    this.addEventListener('mouseenter', this.handleMouseover.bind(this));
  }

  handleMouseover() {
    if (this.classList.contains(this.classes.active)) return;

    this.bindEvent();
    this.removeClasses();
    this.addClasses();
    this.resetBackground();
    this.animateMenu();
  }

  handleMouseleave() {
    if (!this.header) return;

    this.reset();
    this.resetBackground();

    this.header.classList.remove(this.classes.hover);
    this.wrapper.removeEventListener('mouseleave', this.onHeaderMouseLeaveEvent);
  }

  bindEvent() {
    this.onHeaderMouseLeaveEvent = this.onHeaderMouseLeaveEvent || this.handleMouseleave.bind(this);

    this.header = this.header || document.getElementById(this.selectors.header);

    this.wrapper = this.closest(this.selectors.wrapper)
    this.wrapper.addEventListener('mouseleave', this.onHeaderMouseLeaveEvent);
  }

  addClasses() {
    const isTopLevel = this.querySelector(this.selectors.topMenuItem);

    let delay = 0;
    if (isTopLevel && !this.isHover()) {
      delay = 150;

      if (this.closest('.header--top-center') || this.closest('.header--top-left')) {
        delay = 200;
      }
    }
    this.timeout = setTimeout(() => {
      if (this.isHover()) {
        this.classList.add(this.classes.active);
      }
    }, delay);

    this.header.classList.add(this.classes.hover);
  }

  removeClasses() {
    const menus = this.header.querySelectorAll(this.selectors.menus);

    menus.forEach((menu) => {
      let found = false;
      const childMenus = menu.querySelectorAll('dropdown-menu');
      childMenus.forEach((element) => {
        if (element === this) {
          found = true;
          return;
        }
      });

      if (!found) menu.reset();
    });
  }

  isHover() {
    return this.header.classList.contains(this.classes.hover);
  }

  reset() {
    this.classList.remove(this.classes.active);

    const childAnimate =  this.querySelector(this.selectors.childAnimate);
    if (childAnimate) childAnimate.classList.remove(this.classes.animate);

    clearTimeout(this.timeout);
  }

  resetBackground() {
    const background = this.header.querySelector(this.selectors.background);
    background.classList.remove(this.classes.active);
  }

  animateMenu() {
    const childAnimate =  this.querySelector(this.selectors.childAnimate);
    if (childAnimate) {
      setTimeout(() => {
        childAnimate.classList.add(this.classes.animate);
      }, 150);
    }
  }

  close() {
    this.handleMouseleave();
  }
}
customElements.define('dropdown-menu', DropdownMenu);

class MegaMenu extends HTMLElement {
  constructor() {
    super();

    this.classes = {
      hover: 'is-hover',
      active: 'is-active',
      animate: 'show-from-bottom',
    };
    this.selectors = {
      header: 'shopify-section-header',
      background: '.header-background',
      dropdown: '.list-menu-dropdown',
      menus: 'dropdown-menu, mega-menu',
      wrapper: '.list-menu',
      childAnimate: '.mega-menu__item, .mega-menu__promo'
    };
    this.timeout = [];

    this.addEventListener('focusin', this.handleMouseover.bind(this));
    this.addEventListener('mouseenter', this.handleMouseover.bind(this));
  }

  handleMouseover() {
    if (this.classList.contains(this.classes.active)) return;
    
    this.bindEvent();
    this.removeClasses();
    this.addClasses();
    this.showSublist();
  }

  handleMouseleave() {
    if (!this.header) return;

    this.reset();
    this.resetBackground();

    this.header.classList.remove(this.classes.hover);
    this.wrapper.removeEventListener('mouseleave', this.onHeaderMouseLeaveEvent);
  }

  bindEvent() {
    this.onHeaderMouseLeaveEvent = this.onHeaderMouseLeaveEvent || this.handleMouseleave.bind(this);
    
    this.header = this.header || document.getElementById(this.selectors.header);

    this.wrapper = this.closest(this.selectors.wrapper)
    this.wrapper.addEventListener('mouseleave', this.onHeaderMouseLeaveEvent);
  }

  showSublist() {
    const dropdown = this.querySelector(this.selectors.dropdown);
    const background = this.header.querySelector(this.selectors.background);
    background.style.height = this.header.clientHeight + dropdown.clientHeight + 'px';
    background.classList.add(this.classes.active);
  }

  addClasses() {
    this.classList.add(this.classes.active);

    const childAnimate = this.querySelectorAll(this.selectors.childAnimate);
    const delay = childAnimate.length > 5 ? 75 : 150;
    childAnimate.forEach((element, index) => {
      const timeout = setTimeout(() => {
        element.classList.add(this.classes.animate);
      }, (delay * index) + 100);
      
      this.timeout.push(timeout);
    });
    
    this.header.classList.add(this.classes.hover);
  }

  removeClasses() {
    const menus = this.header.querySelectorAll(this.selectors.menus);
    menus.forEach((menu) => {
      menu.reset();
    });
  }

  reset() {
    this.classList.remove(this.classes.active);

    const childAnimate = this.querySelectorAll(this.selectors.childAnimate);
    childAnimate.forEach((element) => {
      element.classList.remove(this.classes.animate);
    });
    this.timeout.forEach((timeout) => {
      clearTimeout(timeout);
    });
  }

  resetBackground() {
    const background = this.header.querySelector(this.selectors.background);
    background.classList.remove(this.classes.active);
  }

  close() {
    this.handleMouseleave();
  }
}
customElements.define('mega-menu', MegaMenu);

// These menus only ever close on mouseleave, so following a link leaves the
// panel behind: it stays over the page while the next one loads, and a
// same-page anchor or a back/forward cache restore never clears it at all.
function closeOpenMenus() {
  document.querySelectorAll('dropdown-menu.is-active, mega-menu.is-active').forEach((menu) => {
    if (typeof menu.close === 'function') menu.close();
  });
}

// A link only leaves the menu behind if it actually takes the customer
// somewhere in this tab.
function isNavigatingMenuLink(link) {
  if (link.hasAttribute('download')) return false;
  if (link.target && link.target !== '' && link.target !== '_self') return false;

  const href = link.getAttribute('href');
  if (!href || href === '#' || href.toLowerCase().indexOf('javascript:') === 0) return false;

  return true;
}

document.addEventListener('click', (event) => {
  if (event.defaultPrevented) return;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const target = event.target instanceof Element ? event.target : null;
  const link = target && target.closest('a[href]');
  if (!link || !link.closest('dropdown-menu, mega-menu')) return;
  if (!isNavigatingMenuLink(link)) return;

  // Clicking the link focuses it, and focusin is what opens these menus, so
  // this has to run after that — click already fires last.
  closeOpenMenus();
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) closeOpenMenus();
});
