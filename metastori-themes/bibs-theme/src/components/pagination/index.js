import { initButtons } from '../../sections/wishlist/scripts/wishlist';
import openDrawers from '../drawer';

if (!customElements.get('load-more-items')) {
  class LoadMoreItems extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      if (!this.button) return;
      this.button.addEventListener('click', this.onButtonClick.bind(this));
    }

    get button() {
      return this.querySelector('button');
    }

    onButtonClick(event) {
      event.preventDefault();
      const nextPage = this.button.dataset.nextPage;
      this.updatePageContents(nextPage);
    }

    updatePageContents(targetUrl) {
      if (targetUrl) {
        const loadMoreWrapper = this.closest('.load-more-wrapper');
        const loadMoreGrid = loadMoreWrapper?.querySelector('.load-more-grid');

        const loading = loadMoreWrapper.querySelector('[data-loading]');
        if (loading) {
          loading.classList.remove('hidden');
          loading.firstElementChild.classList.add('!items-end');
        }

        fetch(targetUrl)
          .then((response) => response.text())
          .then((html) => {
            const parser = new DOMParser();
            const fetchedPage = parser.parseFromString(html, 'text/html');
            const productGridContainer = fetchedPage.querySelector('.load-more-wrapper');

            const newCards = productGridContainer.querySelectorAll('product-card, .listing-item');
            if (!newCards.length > 0) return;

            if (loadMoreGrid) {
              newCards.forEach((newCard) => {
                loadMoreGrid.appendChild(newCard);
              });
            }

            const fetchedButton = productGridContainer.querySelector('#load-more-items');
            if (fetchedButton) {
              this.button.dataset.nextPage = fetchedButton.dataset.nextPage;
            } else {
              this.button.classList.add('hidden');
            }

            initButtons();
            openDrawers();

            const event = new CustomEvent('more-loaded', {});
            document.dispatchEvent(event);

            if (loading) {
              loading.classList.add('hidden');
              loading.firstElementChild.classList.remove('!items-end');
            }
          })
          .catch(function (err) {
            console.log('Failed to fetch page: ', err);
          });
      }
    }
  }
  customElements.define('load-more-items', LoadMoreItems);
}
