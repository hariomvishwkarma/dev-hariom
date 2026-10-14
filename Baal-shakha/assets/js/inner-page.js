/**
 * Inner Page Functionality
 * Handles bookmark functionality and page interactions
 */

class InnerPage {
  constructor() {
    this.bookmarkBtn = document.getElementById('bookmark-btn');
    this.bookmarkKey = 'shakha-bookmarks';
    this.init();
  }

  init() {
    if (!this.bookmarkBtn) return;

    // Set initial bookmark state
    this.updateBookmarkButton();

    // Add click handler
    this.bookmarkBtn.addEventListener('click', () => this.toggleBookmark());
  }

  getPageTitle() {
    return document.querySelector('.shakha-inner-hero__title')?.textContent || 'Page';
  }

  getPageUrl() {
    return window.location.pathname;
  }

  toggleBookmark() {
    const bookmarks = this.getBookmarks();
    const pageUrl = this.getPageUrl();

    if (bookmarks.some(b => b.url === pageUrl)) {
      // Remove bookmark
      const filtered = bookmarks.filter(b => b.url !== pageUrl);
      this.saveBookmarks(filtered);
    } else {
      // Add bookmark
      bookmarks.push({
        title: this.getPageTitle(),
        url: pageUrl,
        timestamp: new Date().toISOString()
      });
      this.saveBookmarks(bookmarks);
    }

    this.updateBookmarkButton();
  }

  updateBookmarkButton() {
    const bookmarks = this.getBookmarks();
    const pageUrl = this.getPageUrl();
    const isBookmarked = bookmarks.some(b => b.url === pageUrl);

    if (isBookmarked) {
      this.bookmarkBtn.classList.add('bookmarked');
      this.bookmarkBtn.textContent = '🔖 बुकमार्क किया गया';
    } else {
      this.bookmarkBtn.classList.remove('bookmarked');
      this.bookmarkBtn.textContent = '🔖 बुकमार्क';
    }
  }

  getBookmarks() {
    try {
      const bookmarks = localStorage.getItem(this.bookmarkKey);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (e) {
      console.error('Error reading bookmarks:', e);
      return [];
    }
  }

  saveBookmarks(bookmarks) {
    try {
      localStorage.setItem(this.bookmarkKey, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Error saving bookmarks:', e);
    }
  }
}

// Share functionality
function setupShareButton() {
  const shareBtn = document.querySelector('[data-share]');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    const title = document.querySelector('.shakha-inner-hero__title')?.textContent;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Baal Shakha',
          url: url
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('लिंक कॉपी किया गया!');
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  });
}

// Print functionality
function setupPrintButton() {
  const printBtn = document.querySelector('[data-print]');
  if (!printBtn) return;

  printBtn.addEventListener('click', () => {
    window.print();
  });
}

// Scroll to top functionality
function setupScrollToTop() {
  const scrollBtn = document.querySelector('[data-scroll-top]');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.style.display = 'flex';
    } else {
      scrollBtn.style.display = 'none';
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new InnerPage();
  setupShareButton();
  setupPrintButton();
  setupScrollToTop();
});
