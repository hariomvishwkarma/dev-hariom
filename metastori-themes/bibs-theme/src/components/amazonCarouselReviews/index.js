window.addEventListener('load', () => {
  const currentURL = window.location.href;
  if (!currentURL.includes('/products/')) return;

  let reviewsObject = [];

  if (typeof reputonAmazonProductReviewsData !== 'undefined' && reputonAmazonProductReviewsData !== null) {
    reviewsObject = reputonAmazonProductReviewsData.reviews;
    if (!reviewsObject) return;
    // Remove "number out of 5 stars" from headline
    reviewsObject = reviewsObject.map((review) => ({
      ...review,
      headline: review.headline.replace(/^\d+\.\d+ out of 5 stars\s*/, ''),
    }));
  }

  let carouselSwiperWrapper;
  updateReviews();

  function updateReviews() {
    const shopifySectionContainer = document.querySelector('[id*="shopify-block-amazon_reviews_carousel_widget_block_product"]');
    const sectionWrapper = document.querySelector('.reputon-amazon-reviews-widget[data-type="carousel"]');
    carouselSwiperWrapper = document.querySelector('.reputon-carousel-holder .swiper-wrapper');

    if (!carouselSwiperWrapper) {
      setTimeout(updateReviews, 300);
      return;
    }

    let reviewsSwiperWrapper;

    sectionWrapper?.classList.add('container-fluid--desktop', 'section-wrapper-amazon-carousel-reviews');

    reviewsSwiperWrapper = carouselSwiperWrapper?.children;
    if (reviewsObject.length && reviewsSwiperWrapper?.length) {
      for (let index = 0; index < reviewsSwiperWrapper?.length; index++) {
        updateCarouselSlider(index, reviewsSwiperWrapper[index]);
      }
    }

    if (amazonReviewsHeading) {
      const reviewsHeadingContainer = document.createElement('div');
      reviewsHeadingContainer.classList.add('container-fluid--mobile');

      const reviewsHeading = document.createElement('h2');
      reviewsHeading.classList.add('amazon-section-heading');
      reviewsHeading.innerText = amazonReviewsHeading;

      reviewsHeadingContainer.append(reviewsHeading);
      sectionWrapper.prepend(reviewsHeadingContainer);
    }

    if (amazonReviewsColorScheme) {
      const colorSchemeClass = 'color-' + amazonReviewsColorScheme;
      shopifySectionContainer?.classList.add(colorSchemeClass);
    }

    const lineDivider = document.createElement('hr');
    lineDivider.classList.add('border-borders');
    const containerFluid = document.createElement('div');
    containerFluid.classList.add('container-fluid');
    containerFluid.append(lineDivider);
    shopifySectionContainer?.prepend(containerFluid);

    const containerFluidBottom = containerFluid.cloneNode(true);
    shopifySectionContainer?.append(containerFluidBottom);

    const emptyDivider = document.createElement('div');
    emptyDivider.classList.add('amazon-section-empty-divider');
    shopifySectionContainer?.append(emptyDivider);
  }

  function updateCarouselSlider(index, nodeToUpdate) {
    if (
      !reviewsObject[index] ||
      nodeToUpdate.querySelector('.amazon-product-review-headline') ||
      nodeToUpdate.querySelector('.amazon-product-review-author-img-wrapper')
    ) return;

    let reviewHeadline = document.createElement('div');

    reviewHeadline.classList.add('amazon-product-review-headline');
    reviewHeadline.innerHTML = reviewsObject[index].headline;

    const reviewHeaderElement = nodeToUpdate?.querySelector('.reputon-review-header');
    if (reviewHeaderElement && reviewHeadline) reviewHeaderElement.after(reviewHeadline);

    const athorImageWrapper = document.createElement('div');
    athorImageWrapper.classList.add('amazon-product-review-author-img-wrapper');
    const authorImage = document.createElement('img');
    authorImage.classList.add('amazon-product-review-author-img');
    authorImage.setAttribute('src', reviewsObject[index].profilePhotoUrl);
    athorImageWrapper.append(authorImage);

    const reviewAuthorNameElement = nodeToUpdate?.querySelector('.reputon-name');
    reviewAuthorNameElement?.before(athorImageWrapper);

    const headers = nodeToUpdate.querySelectorAll('.amazon-product-review-headline');
    const suthorImages = nodeToUpdate.querySelectorAll('.mazon-product-review-author-img');
    if (headers.length > 1) {
      headers.pop();
      suthorImages.pop();
      headers.forEach((header, index) => {
        header.remove();
        authorImage[index];
      });
    }
  }

  function mutationCallback(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.classList.contains('swiper-slide')) {
            const index = node.dataset.swiperSlideIndex;
            updateCarouselSlider(index, node);
          }
        }
      }
    }
  }

  const observer = new MutationObserver(mutationCallback);

  const config = {
    childList: true,
    subtree: false,
  };

  if (carouselSwiperWrapper) observer.observe(carouselSwiperWrapper, config);
});
