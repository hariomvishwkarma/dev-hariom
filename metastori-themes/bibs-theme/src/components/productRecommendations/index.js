if (!customElements.get('product-recommendations')) {
  class ProductRecommendations extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const handleIntersection = async (entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);

        await this.fetchRecommendations();
      };

      new IntersectionObserver(handleIntersection.bind(this), {
        rootMargin: '0px 0px 400px 0px',
      }).observe(this);
    }

    async fetchRecommendations() {
      try {
        fetch(this.dataset.url)
          .then((response) => response.text())
          .then((text) => {
            const html = document.createElement('div');
            html.innerHTML = text;
            const recommendations = html.querySelector('product-recommendations');

            if (recommendations && recommendations.innerHTML.trim().length) {
              this.innerHTML = recommendations.innerHTML;

              const event = new CustomEvent('related-products:loaded', { detail: { wrapperElement: this } });
              document.dispatchEvent(event);
            }
            if(!html.querySelector('.product-card')) {
              this.dataset.url = this.dataset.url
                .replace('intent=complementary', '')  
                this.fetchRecommendations();
              return 
            }
          })
          .catch((e) => {
            console.error(e);
            this.remove();
          });
      } catch (error) {
        console.log(error);
        this.classList.add('hidden');
      }
    }
  }

  customElements.define('product-recommendations', ProductRecommendations);
}
