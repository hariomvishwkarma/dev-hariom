import { getHeaderHeight } from '../../scripts/utils/getHeaderHeight.js';

if (!customElements.get('c-drawer')) {
  class Drawer extends HTMLElement {
    constructor() {
      super();

      // default options
      this.default = {
        placement: this.dataset.placement || 'right',
        backdrop: this.dataset.backdrop === 'true' ? true : false,
        backdropClasses: this.dataset.backdropClasses || 'bg-black bg-opacity-30 fixed inset-0 z-40 cursor-pointer',
      };

      this.init();

      this.drawerTrigger?.addEventListener('click', () => {
        this.open();
      });

      // click event for close button
      this.drawerClose?.forEach((drawerClose) => {
        drawerClose.addEventListener('click', () => {
          this.close();
        });
      });
    }

    init() {
      // get drawer element
      this.drawerId = this.dataset.componentId;
      this.drawerTrigger = document.querySelector('[data-drawer-target =' + this.drawerId + ']');
      this.drawerElement = this.querySelector('#' + this.drawerId);
      if (!this.drawerElement) return;

      this.drawerClose = this.querySelectorAll('[data-drawer-close]');

      const drawerTarget = this.drawerTrigger?.dataset.drawerTarget;
      if (drawerTarget == 'Header-search-drawer') {
        this.isHeaderSearchDrawer = true;
      } else {
        this.isHeaderSearchDrawer = false;
      }

      // this.close();
    }

    open(toggle = true, noOverFlowHidden = false) {
      if (this.visible && toggle) {
        this.close();
        return;
      }
      this.drawerElement.classList.add('translate-none');
      this.drawerElement.classList.remove(this.getPlacementClasses(this.default.placement).inactive);

      if (this.dataset.componentId != 'cart-drawer' && this.dataset.componentId != 'Header-search-drawer' && this.dataset.componentId != 'Mobile-menu-drawer' && this.dataset.componentId != 'mobile-menu-drawer') {
        document.querySelector('main').style.zIndex = '32';
      } else {
        document.querySelector('main').style.zIndex = '';
      }

      if (this.default.backdrop) {
        this.createBackdrop();
      }

      if (this.isHeaderSearchDrawer) {
        this.drawerElement.querySelector('input[type="search"').focus();
      }

      if (!noOverFlowHidden) document.body.classList.add('overflow-hidden');
      const event = new Event('drawer-opened');
      this.dispatchEvent(event);

      this.visible = true;
      this.setAttribute('data-drawer-open', true);
    }

    close() {
      this.drawerElement.classList.remove('translate-none');
      this.drawerElement.classList.add(this.getPlacementClasses(this.default.placement).inactive);
      document.querySelector('main').style.zIndex = 'unset';
      document.body.classList.remove('overflow-hidden');

      if (this.default.backdrop) {
        this.destroyBackdropEl();
      }
      this.visible = false;
      this.removeAttribute('data-drawer-open');
    }

    createBackdrop() {
      if (!this.visible) {
        const backdropEl = document.createElement('div');
        backdropEl.setAttribute('drawer-backdrop', this.drawerId);
        backdropEl.classList.add(...this.default.backdropClasses.split(' '));
        if (!this.querySelector(`[drawer-backdrop]`)) {
          this.append(backdropEl);
        }

        backdropEl.addEventListener('click', () => {
          this.close();
        });
      }
    }

    destroyBackdropEl() {
      if (this.visible && this.drawerId) {
        this.querySelector(`[drawer-backdrop="${this.drawerId}"]`).remove();
      }
    }

    getPlacementClasses(placement) {
      switch (placement) {
        case 'left':
          return {
            base: 'top-0 left-0 h-screen',
            inactive: '-translate-x-full',
          };
        case 'top':
          return {
            base: 'top-0 left-0 right-0 w-full',
            inactive: '-translate-y-full',
          };
        case 'bottom':
          return {
            base: 'bottom-0 left-0 right-0 w-full',
            inactive: 'translate-y-full',
          };
        default:
          return {
            base: 'top-0 right-0 h-screen',
            inactive: 'translate-x-full',
          };
      }
    }
  }
  customElements.define('c-drawer', Drawer);

  class HeaderDrawer extends Drawer {
    constructor() {
      super();

      this.menuDrawerCloseButtons = this.querySelectorAll('.menu-drawer__close-button');

      this.openMenuButton = this.querySelector('[data-drawer-target=Mobile-menu-drawer]');

      this.openMenuButton.addEventListener('click', () => this.openMenuDrawer(this.openMenuButton));

      this.menuDrawerCloseButtons.forEach((menuDrawerCloseButton) => {
        menuDrawerCloseButton.addEventListener('click', () => this.closeMenuDrawer(menuDrawerCloseButton));
      });

      this.headerHeight = getHeaderHeight();
      this.drawerElement.style.height = 'calc(100vh - ' + (this.headerHeight.headerHeight + this.headerHeight.announcementBarHeight) + 'px)';
    }

    closeMenuDrawer(button) {
      button.closest('details').removeAttribute('open');
    }

    openMenuDrawer() {
      this.headerHeight = getHeaderHeight();
      this.drawerElement.style.top = this.headerHeight.headerBottomPosition + 'px';
    }
  }
  customElements.define('header-drawer', HeaderDrawer);
}

// give possibility to open drawer from any element

function openDrawers() {
  const buttons = document.querySelectorAll('[data-open-drawer]');
  for (const button of buttons) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (button.dataset.openDrawer) {
        const drawer = document.querySelector('[data-component-id=' + button.dataset.openDrawer + ']');
        if (drawer) drawer.open();
      }
    });
  }
}

openDrawers();
export default openDrawers;
