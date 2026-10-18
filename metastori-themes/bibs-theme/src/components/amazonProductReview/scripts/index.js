if (!customElements.get('amazon-reviews')) {
  class AmazonReviews extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      if (this.reviewsNumber == 0 || !this.reviewScript) {
        this.classList.add('hidden');
        return;
      }

      this.displayStars();

      this.initPlaceReviewCount();
    }

    get amazonStarProductRating() {
      return this.querySelector('.reputon_amazon_reviews_widget');
    }

    get reviewsCountElement() {
      return this.amazonStarProductRating?.querySelector('.reputon_ratings_count');
    }

    get starsContainer() {
      return this.amazonStarProductRating?.querySelector('.reputon_stars_container');
    }

    get reviewScript() {
      return this.amazonStarProductRating?.querySelector('script');
    }

    get template() {
      return this.amazonStarProductRating?.querySelector('template');
    }

    get templateContent() {
      return this.template?.content.cloneNode(true);
    }

    get fullStar() {
      return this.templateContent?.querySelector('.icon-star')?.outerHTML;
    }

    get halfStar() {
      return this.templateContent?.querySelector('.icon-half-star')?.outerHTML;
    }

    get emptyStar() {
      return this.templateContent?.querySelector('.icon-empty-star')?.outerHTML;
    }

    get reviewsData() {
      if (this.reviewScript) return JSON.parse(this.reviewScript.textContent);
    }

    get reviewsNumber() {
      if (this.reviewsData) return this.reviewsData.reviewsNumber;
    }

    get rating() {
      if (this.reviewsData) return this.reviewsData.rating;
    }

    initPlaceReviewCount() {
      if (this.reviewsNumber && this.reviewsCountElement) {
        this.reviewsCountElement.textContent = '(' + this.reviewsNumber + ')';
      }
    }

    displayStars() {
      if (this.starsContainer) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
          if (i <= Math.floor(this.rating)) {
            // Full star
            stars += this.fullStar;
          } else if (i === Math.ceil(this.rating) && this.rating % 1 !== 0) {
            // Half star
            stars += this.halfStar;
          } else {
            // Empty star
            stars += this.emptyStar;
          }
        }
        this.starsContainer.innerHTML = stars;
      }
    }
  }
  customElements.define('amazon-reviews', AmazonReviews);
}
