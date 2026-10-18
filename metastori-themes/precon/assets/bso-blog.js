class ContentDrawer extends HTMLElement {
  constructor() {
    super();
    this.toolbarElement = this.querySelector('.shortcodetoolbar');
    this.popoverElement = document.getElementById('tableofcontents-popup');
    this.button = this.toolbarElement.querySelector('.shortcodetoolbar__item');
    this.closeBtn = this.popoverElement.querySelector('[data-action="close-popup"]');
    this.pageOverlay = document.querySelector('.pageoverlay');
  }

  connectedCallback() {
    const isVisible = this.popoverElement.getAttribute('aria-hidden') === 'false';
    this.button.setAttribute('aria-expanded', isVisible);
    this.button.addEventListener('click', () => {
      const isVisible = this.popoverElement.getAttribute('aria-hidden') === 'false';
      this.popoverElement.setAttribute('aria-hidden', isVisible);
      this.button.setAttribute('aria-expanded', isVisible);
      if (this.pageOverlay) {
        this.pageOverlay.classList.toggle('is-visible', !isVisible);
      }
    });

    this.closeBtn.addEventListener('click', () => {
      this.popoverElement.setAttribute('aria-hidden', 'true');
      this.button.setAttribute('aria-expanded', 'false');
      if (this.pageOverlay) {
        this.pageOverlay.classList.remove('is-visible');
      }
    });
  }
}
customElements.define('content-drawer', ContentDrawer);
class TableOfContents extends HTMLElement {
  constructor() {
    super();
    this.summarys = document.querySelectorAll('.tableofcontents');
    this.summarys = Array.prototype.slice.call(this.summarys);
    this.content = document.querySelector('.article__body');
    this.anchorMap = new Map();
    this.anchors = [];
    this.links = [];
    this.popoverElement = document.getElementById('tableofcontents-popup');
    this.pageOverlay = document.querySelector('.pageoverlay');
    this.activeClass = 'active-link';
    this.announcement_bar = document.querySelector('.top-bar');
    this.headerHeight = this.getHeaderHeight();
  }

  getHeaderHeight() {
    const header = document.querySelector('header');
    const announcementBar = document.querySelector('.top-bar');
    const headerHeight = header ? header.offsetHeight : 0;
    const announcementHeight = announcementBar ? announcementBar.offsetHeight : 0;
    return headerHeight + announcementHeight;
  }

  connectedCallback() {
    const anchors = this.content.querySelectorAll('.anchor');
    anchors.forEach((anchor) => {
      this.anchorMap.set(anchor, []);
      this.anchors.push(anchor);
    });

    this.summarys.forEach((summary) => {
      const links = summary.querySelectorAll('.toc--content-link');
      links.forEach((link) => {
        this.links.push(link);
        const anchor = this.content.querySelector(new URL(link.href).hash);
        if (anchor) this.anchorMap.get(anchor).push(link);
        link.addEventListener('click', (e) => {
          e.preventDefault();
          let aElement = e.target;
          if (aElement.nodeName !== 'A') {
            aElement = e.target.closest('a');
          }
          const targetId = aElement.getAttribute('href').substring(1);
          const target = document.getElementById(targetId);
          const targetPosition = target.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = targetPosition - this.headerHeight;
          if (target) {
            target.scrollIntoView({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
          // Remove active class from all links
          this.links.forEach(l => l.classList.remove(this.activeClass));
          // Add active class to the clicked link
          aElement.classList.add(this.activeClass);
          let parentElement = aElement.parentElement;
          while (parentElement && !parentElement.classList.contains('popup')) {
            parentElement = parentElement.parentElement;
          }

          if (parentElement) {
            this.popoverElement.setAttribute('aria-hidden', 'true');
            this.pageOverlay.classList.remove('is-visible');
          } 
        });
      });
    });
  }
}
customElements.define('table-of-content', TableOfContents);
class TocCollapsible extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.shortcodetoolbar = document.querySelector('.shortcodetoolbar');
    this.lastScrollY = null;
    this.handleScroll = this.handleScroll.bind(this);
  }

  connectedCallback() {
    this.toggleBtn = this.querySelector(".toggle");
    this.content = this.querySelector(".toggle-content");
    this.toggleLabel = this.querySelector(".toggle-label");

    if (!this.toggleBtn || !this.content || !this.toggleLabel) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    // Get initial state from aria-expanded
    const expandedAttr = isMobile
    ? this.toggleBtn.getAttribute("aria-expanded-mobile")
    : this.toggleBtn.getAttribute("aria-expanded");

    this.isOpen = expandedAttr === "true";

    // Override if on mobile and NOT below banner (force closed)
    if (isMobile && !this.classList.contains('toc-below-banner')) {
      this.isOpen = false;
      this.toggleBtn.setAttribute("aria-expanded", "false");
    }

    this.labelOpen = this.toggleLabel.getAttribute("toggle-label-open") || "Show";
    this.labelClose = this.toggleLabel.getAttribute("toggle-label-close") || "Hide";

    // Set initial display and label
    if (this.isOpen) {
      this.content.style.display = "block";
      this.toggleLabel.textContent = this.labelClose;
    } else {
      this.content.style.display = "none";
      this.toggleLabel.textContent = this.labelOpen;
    }
    
    this.toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (this.isOpen) {
        this.slideUp(this.content);
        this.toggleLabel.textContent = this.labelOpen;
        this.toggleBtn.setAttribute("aria-expanded", "false");
      } else {
        this.slideDown(this.content);
        this.toggleLabel.textContent = this.labelClose;
        this.toggleBtn.setAttribute("aria-expanded", "true");
      }

      this.isOpen = !this.isOpen;
    });

    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll();

    if (isMobile && !this.classList.contains('toc-below-banner')) {
      const links = this.querySelectorAll(".toc--content-link");
      links.forEach(link => {
        link.addEventListener("click", () => {
          if (this.isOpen) {
            this.slideUp(this.content);
            this.toggleLabel.textContent = this.labelOpen;
            this.toggleBtn.setAttribute("aria-expanded", "false");
            this.isOpen = false;
          }
        });
      });
    }
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  slideDown(element, duration = 300) {
    element.style.display = "block";
    element.style.height = "0px";
    const fullHeight = element.scrollHeight;
    let start = null;

    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const height = Math.min((progress / duration) * fullHeight, fullHeight);
      element.style.height = height + "px";

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.height = "";
      }
    }
    requestAnimationFrame(animate);
  }

  slideUp(element, duration = 300) {
    const fullHeight = element.scrollHeight;
    let start = null;

    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const height = Math.max(fullHeight - (progress / duration) * fullHeight, 0);
      element.style.height = height + "px";

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = "none";
        element.style.height = "";
      }
    }
    requestAnimationFrame(animate);
  }

  handleScroll() {
    if (!this.closest('.shortcodetoolbar')) return;
    const currentScrollY = window.scrollY;
    const pageContent = document.querySelector(".page-content");
    const pageContentTop = pageContent?.offsetTop || 0;

    if (currentScrollY >= pageContentTop) {
      this.shortcodetoolbar.classList.remove("fixed");
    } else if ( currentScrollY < pageContentTop) {
      this.shortcodetoolbar.classList.add("fixed");
    }
  }
}
customElements.define('toc-collapsible', TocCollapsible);