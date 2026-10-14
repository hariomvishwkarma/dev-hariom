/**
 * Baal Shakha - Search Functionality
 * Handles live search across content with data-search-tag attributes
 */

class ShakhaSearch {
  constructor() {
    this.searchInputDesktop = document.getElementById('shakha-search-input');
    this.searchOverlay = document.getElementById('shakha-search-overlay');
    this.searchTrigger = document.getElementById('shakha-search-trigger');
    this.closeButton = this.searchOverlay?.querySelector('.shakha-search-overlay__close');
    this.searchItems = document.querySelectorAll('[data-search-tag]');
    this.searchableElements = [
      ...document.querySelectorAll('.shakha-vibhag-card'),
      ...document.querySelectorAll('.shakha-small-card'),
      ...document.querySelectorAll('.shakha-content-card'),
      ...document.querySelectorAll('.shakha-card'),
      ...document.querySelectorAll('.shakha-panel-card')
    ];

    this.init();
  }

  init() {
    // Skip if search overlay doesn't exist
    if (!this.searchOverlay || !this.searchInputDesktop) return;

    // Open overlay when clicking the search trigger (hidden section) or header search button
    if (this.searchTrigger) {
      this.searchTrigger.addEventListener('click', () => this.openOverlay());
    }

    const headerSearchBtn = document.getElementById('shakha-header-search-btn');
    if (headerSearchBtn) {
      headerSearchBtn.addEventListener('click', () => this.openOverlay());
    }

    // Close overlay when clicking the close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.closeOverlay());
    }

    // Close overlay when clicking outside the content
    this.searchOverlay.addEventListener('click', (e) => {
      if (e.target === this.searchOverlay) {
        this.closeOverlay();
      }
    });

    // Handle search input
    this.searchInputDesktop.addEventListener('input', (e) => this.handleSearch(e.target.value));

    // Close overlay on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.searchOverlay.classList.contains('active')) {
        this.closeOverlay();
      }
    });

    // Handle suggestion items
    const suggestionItems = this.searchOverlay.querySelectorAll('.shakha-search-overlay__suggestion-item');
    suggestionItems.forEach(item => {
      item.addEventListener('click', () => {
        const searchTag = item.getAttribute('data-tag');
        this.searchInputDesktop.value = searchTag;
        this.handleSearch(searchTag);
      });
    });
  }

  openOverlay() {
    this.searchOverlay.classList.add('active');
    this.searchInputDesktop.focus();
    document.body.style.overflow = 'hidden';
  }

  closeOverlay() {
    this.searchOverlay.classList.remove('active');
    this.searchInputDesktop.value = '';
    this.handleSearch('');
    document.body.style.overflow = '';
  }

  handleSearch(query) {
    const normalizedQuery = this.normalizeText(query);

    if (!normalizedQuery) {
      // Show all items if search is empty
      this.searchableElements.forEach(el => {
        el.style.display = '';
        el.classList.remove('search-highlight');
      });
      return;
    }

    this.searchableElements.forEach(el => {
      const tagText = el.getAttribute('data-search-tag') || '';
      const titleText = el.querySelector('h3')?.textContent || '';
      const descText = el.querySelector('p')?.textContent || '';
      
      const fullText = this.normalizeText(
        `${titleText} ${descText} ${tagText}`
      );

      if (fullText.includes(normalizedQuery)) {
        el.style.display = '';
        el.classList.add('search-highlight');
      } else {
        el.style.display = 'none';
        el.classList.remove('search-highlight');
      }
    });

    // Scroll to first result
    const firstVisible = this.searchableElements.find(el => el.style.display !== 'none');
    if (firstVisible) {
      setTimeout(() => {
        firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  normalizeText(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[ं॑ॎॉ]/g, ''); // Remove common Hindi diacritics
  }
}

// Mobile Navigation Active State
class MobileNavigation {
  constructor() {
    this.navItems = document.querySelectorAll('.shakha-mobile-nav__item');
    this.init();
  }

  init() {
    if (!this.navItems.length) return;

    // Add click handlers to update active state
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        this.updateActive(item);
      });
    });

    // Update active state based on current page
    this.updateActiveFromCurrentPage();
  }

  updateActive(clickedItem) {
    this.navItems.forEach(item => {
      item.classList.remove('shakha-mobile-nav__item--active');
    });
    clickedItem.classList.add('shakha-mobile-nav__item--active');
  }

  updateActiveFromCurrentPage() {
    const currentPath = window.location.pathname;
    
    this.navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (currentPath.includes(href) || 
          (currentPath === '/' && href === '/')) {
        item.classList.add('shakha-mobile-nav__item--active');
      } else {
        item.classList.remove('shakha-mobile-nav__item--active');
      }
    });
  }
}

// Add highlight styles dynamically
function addSearchHighlightStyles() {
  if (document.getElementById('search-highlight-styles')) return;

  const style = document.createElement('style');
  style.id = 'search-highlight-styles';
  style.textContent = `
    .search-highlight {
      animation: pulse-highlight 0.6s ease;
    }
    
    @keyframes pulse-highlight {
      0% {
        box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  addSearchHighlightStyles();
  new ShakhaSearch();
  new MobileNavigation();
});

// Keyboard shortcut for search (Ctrl/Cmd + K)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.getElementById('shakha-search-input') || 
                       document.getElementById('shakha-search-input-mobile');
    if (searchInput) {
      searchInput.focus();
    }
  }
});
