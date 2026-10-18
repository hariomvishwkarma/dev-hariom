let featuredCollections = document.querySelectorAll('.section-featured-collection');
featuredCollections.forEach((featuredCollection) => {
  let collectionButton = featuredCollection.querySelector(".featured_collection_btn");
  let collectionTabButtons = featuredCollection.querySelectorAll('[id^="Collection-tab-button"]');
  let collectionContents = featuredCollection.querySelectorAll('[id^="Collection-tab-content"]');
  collectionTabButtons.forEach((button) => {
    let blockID = button.id.replace('Collection-tab-button-', '');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (collectionButton) collectionButton.href = button.dataset.collectionUrl;
      collectionTabButtons.forEach((collectionTabButton) => {
        if (collectionTabButton.id !== `Collection-tab-button-${blockID}`) {
          collectionTabButton.classList.remove('active');
        } else {
          collectionTabButton.classList.add('active');
        }
      });

      collectionContents.forEach((collection) => {
        if (collection.id !== `Collection-tab-content-${blockID}`) {
          collection.classList.add('!hidden');
        } else {
          collection.classList.remove('!hidden');
        }
      });
    });
  });
});
