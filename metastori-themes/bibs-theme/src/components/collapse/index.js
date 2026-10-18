import { getHeaderHeight } from '../../scripts/utils/getHeaderHeight';

class Collapse {
  constructor(collapseEl, collapses) {
    this.collapses = collapses;
    this.detailsEl = collapseEl;
    this.triggerEl = collapseEl.querySelector('summary');
    this.backdrop = collapseEl.getAttribute('data-backdrop') === 'true' ? true : false;

    if (!this.triggerEl || !this.detailsEl) return;

    this.linkMenu = this.triggerEl.querySelector('.link--menu');
    this.targetEl = this.triggerEl.nextElementSibling;
    if (!this.targetEl) return;

    this.backdropClasses = 'bg-white bg-opacity-50 fixed inset-0 z-5';
    this.init();
  }

  init() {
    this.detailsEl.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.detailsEl.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.detailsEl.addEventListener('focusout', this.onFocusOut.bind(this));
  }

  onMouseEnter() {
    this.closeAll();
    if (this.linkMenu) this.linkMenu.classList.add('active');
    this.detailsEl.setAttribute('open', '');
    if (this.backdrop) {
      this.createBackdrop();
    }
  }

  onMouseLeave() {
    if (this.linkMenu) this.linkMenu.classList.remove('active');
    this.detailsEl.removeAttribute('open');
    if (this.backdrop) {
      this.destroyBackdropEl();
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.detailsEl.contains(document.activeElement)) this.onMouseLeave();
    });
  }

  closeAll() {
    this.collapses.forEach((collapse) => {
      const linkMenu = collapse.querySelector('.link--menu');
      if (linkMenu) {
        linkMenu.classList.remove('active');
        collapse.removeAttribute('open');
        if (this.backdrop) {
          this.destroyBackdropEl();
        }
      }
    });
  }

  createBackdrop() {
    const backdropEl = document.createElement('div');
    backdropEl.setAttribute('collapse-backdrop', '');
    backdropEl.classList.add(...this.backdropClasses.split(' '));
    if (!document.body.querySelector(`[collapse-backdrop]`)) {
      document.body.append(backdropEl);
    }
  }

  destroyBackdropEl() {
    const backdropEl = document.querySelector(`[collapse-backdrop]`);
    if (backdropEl) {
      backdropEl.remove();
    }
  }
}

class MenuCollapse extends Collapse {
  constructor(collapseEl, collapses) {
    super(collapseEl, collapses);

    this.menuParentEl = this.detailsEl.querySelector('div');
    this.headerHeight = getHeaderHeight();

    this.menuParentEl.style.top = this.headerHeight.headerHeight + 'px';

    this.backdropClasses = 'bg-black bg-opacity-0 md:bg-opacity-50 fixed inset-0 z-10';

    this.initLinkedMenuEvents();
  }

  initLinkedMenuEvents() {
    const menuLinkList = this.detailsEl.querySelector('[data-menu-list] [data-expanded-children]');
    if (!menuLinkList) return;
    const menuLinks = menuLinkList.querySelectorAll(':scope > [data-menu-link]');
    menuLinks.forEach((menuLink) => {
      const linkedMenu = menuLink.querySelector('[data-menu-link]');
      const menuLinkDestination = menuLinkList.parentElement.parentElement.querySelector('[data-menu-link-destination]');
      if (linkedMenu) {
        menuLink.addEventListener('mouseenter', () => {
          this.openLinkedMenu(linkedMenu, menuLinkDestination);
        });
      } else {
        menuLink.addEventListener('mouseenter', () => {
          this.closeLinkedMenu(menuLinkDestination);
        });
      }
    });
  }

  openLinkedMenu(linkedMenu, menuLinkDestination) {
    if (linkedMenu) {
      menuLinkDestination.querySelector('[data-menu]').innerHTML = linkedMenu.innerHTML;
    }

    menuLinkDestination.querySelector('.hidden')?.classList.remove('hidden');
    menuLinkDestination.classList.add('active');
    menuLinkDestination.classList.remove('!hidden');
  }

  closeLinkedMenu(menuLinkDestination) {
    menuLinkDestination.classList.remove('active');
    menuLinkDestination.classList.add('!hidden');
  }

  onMouseEnter() {
    this.closeAll();
    this.linkMenu.classList.add('active');
    this.detailsEl.setAttribute('open', '');
    if (this.backdrop) {
      this.createBackdrop();
    }
    if (!this.menuParentEl.querySelector('[data-expanded-children]')) {
      this.openLinkedMenu(this.detailsEl.querySelector('[data-destination-content]'), this.detailsEl.querySelector('[data-menu-link-destination]'));
    }
  }

  onMouseLeave() {
    this.linkMenu.classList.remove('active');
    this.detailsEl.removeAttribute('open');
    if (this.backdrop) {
      this.destroyBackdropEl();
    }
    this.closeLinkedMenu(this.detailsEl.querySelector('[data-menu-link-destination]'));
  }
}

const collapses = Array.from(document.querySelectorAll('[data-collapse]'));
collapses.forEach((collapse) => {
  new Collapse(collapse, collapses);
});

const menuCollapses = Array.from(document.querySelectorAll('[data-menu-collapse]'));
menuCollapses.forEach((collapse) => {
  new MenuCollapse(collapse, menuCollapses);
});
