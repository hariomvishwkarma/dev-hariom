const LOCAL_STORAGE_WISHLIST_KEY = 'shopify-wishlist';
const LOCAL_STORAGE_DELIMITER = ',';
const BUTTON_ACTIVE_CLASS = 'active';
const GRID_LOADED_CLASS = 'loaded';
const CUSTOMER_LOGGED_IN = window.customer?.isLoggedIn;
const CUSTOMER_ID = window.customer?.id;
const ALL_WISHLIST_URL = CUSTOMER_ID ? `http://netlify.blacklemon.dk/.netlify/functions/getCustomerWishlistProducts?store=${window.shop.domain}&customerId=${CUSTOMER_ID}` : '';
const UPDATE_WISHLIST_URL = CUSTOMER_ID ? `http://netlify.blacklemon.dk/.netlify/functions/updateCustomerWishlist?store=${window.shop.domain}&customerId=${CUSTOMER_ID}` : '';
const selectors = {
  button: '[button-wishlist]',
  buttonNotInitialized: '[button-wishlist]:not([data-initialized])',
  grid: '[grid-wishlist]',
  wishlistEmpty: '.wishlist__empty',
  wishlistWrapper: '.wishlist__grid--wrapper',
  wishlistContent: '.wishlist__grid',
  wishlistText: '.wishlist__text',
  productCard: '.section-product-card .product-card',
  productCardImageWrapper: '.product-card-image-wrapper',
  sharedWishlist: '[shared-wishlist]',
  sharedWishlistGrid: '.shared-wishlist__grid',
  sharedWishlistEmpty: '.shared-wishlist__empty',
};

document.addEventListener('DOMContentLoaded', () => {
  initButtons();
  initSharedWishlist();
  initGrid();
  if (CUSTOMER_LOGGED_IN) {
    updateMergedWishlist();
  }
});

document.addEventListener('product-grid:replaced', () => {
  initButtons();
});

document.addEventListener('related-products:loaded', () => {
  initButtons();
});

document.addEventListener('subscription-productList:updated', () => {
  initButtons();
});

document.addEventListener('shopify-wishlist:updated', async (event) => {
  // if (CUSTOMER_LOGGED_IN) {
  //   updateMergedWishlist();
  // }
  console.log('[Wishlist] Updated ✅', event.detail.wishlist);
  initGrid();
});

document.addEventListener('shopify-wishlist:init-product-grid', (event) => {
  document.querySelector('#open-share-wishlist-button')?.addEventListener('click', () => {
    const wishlistShareDisclosure = document.querySelector('.disclosure.wishlist_share_disclosure details');
    if (wishlistShareDisclosure) {
      wishlistShareDisclosure.focus();
      wishlistShareDisclosure.open = true;
      wishlistShareDisclosure.scrollIntoView();
    }
  });
});

document.addEventListener('shopify-wishlist:init-buttons', (event) => { });

const getProductIdfromHandle = async (handle) => {
  try {
    const res = await fetch(`${window.routes.root_url}/products/${handle}.json`);
    const data = await res.json();
    const productId = data.product.id;
    return `gid://shopify/Product/${productId}`;
  } catch (error) {
    return console.error('[Wishlist] Failed to fetch product id', error);
  }
};

const updateMergedWishlist = async () => {
  // merge localstorage and customer metafield
  // add missing products to customer metafield and localstorage

  const localStorageWishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY) || false;
  let localWishlist = [];
  if (localStorageWishlist) {
    if (localStorageWishlist.includes(LOCAL_STORAGE_DELIMITER)) {
      localWishlist = localStorageWishlist.split(LOCAL_STORAGE_DELIMITER);
    } else {
      localWishlist = localStorageWishlist.split();
    }
  }
  const livewishlist = (await fetchWishlist()) || [];
  const mergedWishlist = [...new Set([...localWishlist, ...livewishlist])];

  if (mergedWishlist) {
    mergedWishlist.forEach(async (handle) => {
      const liveWishlistActive = livewishlist.includes(handle);
      const localWishlistActive = localWishlist.includes(handle);

      if (!liveWishlistActive) {
        const gid = await getProductIdfromHandle(handle);
        await updateWishlistFromFetch(gid);
      }

      if (!localWishlistActive) {
        updateWishlistOnLocal(localWishlist, handle);
        let wishlist = await getWishlist();
        reInitButtons(handle, wishlist);
      }
    });
  }
};

const fetchProductCardHTML = async (handle) => {
  const productTileTemplateUrl = `/products/${handle}?view=card`;
  let pageURL = window.location.href;

  try {
    const res = await fetch(productTileTemplateUrl);
    const res_2 = await res.text();
    const text = res_2;
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(text, 'text/html');
    if (pageURL.includes('account')) {
      const productImageLink = htmlDocument.documentElement.querySelector(selectors.productCardImageWrapper);
      if (productImageLink) return productImageLink.outerHTML;
    } else {
      const productCard = htmlDocument.documentElement.querySelector(selectors.productCard);
      if (productCard) return productCard.outerHTML;
    }
  } catch (err) {
    return console.error(`[Wishlist] Failed to load content for handle: ${handle}`, err);
  }
};

const setupGrid = async (grid) => {
  const wishlist = await getWishlist();
  const requests = wishlist.map(fetchProductCardHTML);
  const responses = await Promise.all(requests);

  const wishlistWrapper = document.querySelector(selectors.wishlistWrapper);
  const wishlistGrid = document.querySelector(selectors.wishlistContent);
  const wishlistEmpty = document.querySelector(selectors.wishlistEmpty);
  const wishlistText = document.querySelector(selectors.wishlistText);

  document.querySelectorAll('.wishlist-promo-blocks .promo-block-card')?.forEach((promoblock) => {
    const promoIndex = promoblock.dataset.index - 1;
    if (responses.length > promoIndex) responses.splice(promoIndex, 0, promoblock.outerHTML);
  });

  const wishlistProductCards = responses.join('');

  if (wishlistProductCards) {
    if (wishlistEmpty) {
      wishlistEmpty.classList.add('hidden');
      wishlistEmpty.classList.remove('flex');
    }
    if (wishlistWrapper) wishlistWrapper.classList.remove('hidden');
    if (wishlistText) wishlistText.classList.remove('hidden');
    if (wishlistGrid) wishlistGrid.innerHTML = wishlistProductCards;
  } else {
    if (wishlistEmpty) {
      wishlistEmpty.classList.remove('hidden');
      wishlistEmpty.classList.add('flex');
    }
    if (wishlistWrapper) wishlistWrapper.classList.add('hidden');
    if (wishlistText) wishlistText.classList.add('hidden');
    if (wishlistGrid) wishlistGrid.innerHTML = '';
  }
  grid.classList.add(GRID_LOADED_CLASS);
  initButtons();

  const event = new CustomEvent('shopify-wishlist:init-product-grid', {
    detail: { wishlist: wishlist },
  });
  document.dispatchEvent(event);
};

const setupButtons = async (buttons, reInit = false, wishlist = []) => {
  buttons.forEach(async (button) => {
    button.setAttribute('data-initialized', '');
    const productHandle = button.dataset.productHandle || false;
    if (!productHandle) {
      return console.error('[Wishlist] Missing `data-product-handle` attribute. Failed to update the wishlist.');
    }

    const wishlistActive = wishlist.includes(productHandle);
    button.classList.toggle(BUTTON_ACTIVE_CLASS, wishlistActive);

    if (!reInit) {
      button.addEventListener('click', async (e) => {
        await mainUpdateWishlist(productHandle, e);
      });
    }
  });
};

const initGrid = () => {
  const grid = document.querySelector(selectors.grid) || false;
  if (grid) {
    setupGrid(grid);
  }
};

const initSharedWishlist = () => {
  const sharedWishlist = document.querySelector(selectors.sharedWishlist);
  if (sharedWishlist) {
    setupSharedWishlist(sharedWishlist);
  }
};

const setupSharedWishlist = async () => {
  const sharedWishlist = await getSharedWishlist();
  if (sharedWishlist.length < 1) {
    onNoSharedWishlist(false);
    return;
  }
  const requests = sharedWishlist.map(fetchProductCardHTML);
  const responses = await Promise.all(requests);
  const wishlistProductCards = responses.join('');

  const sharedWishlistWrapper = document.querySelector(selectors.sharedWishlist);
  const sharedWishlistGrid = document.querySelector(selectors.sharedWishlistGrid);

  if (wishlistProductCards) {
    if (sharedWishlistWrapper) sharedWishlistWrapper.classList.remove('hidden');
    if (sharedWishlistGrid) sharedWishlistGrid.innerHTML = wishlistProductCards;
    initButtons();
  } else {
    onNoSharedWishlist();
  }
};

const onNoSharedWishlist = (hasWishlist = true) => {
  const sharedWishlistWrapper = document.querySelector(selectors.sharedWishlist);
  const sharedWishlistGrid = document.querySelector(selectors.sharedWishlistGrid);
  const sharedWishlistEmpty = document.querySelector(selectors.sharedWishlistEmpty);

  if (sharedWishlistGrid) sharedWishlistGrid.innerHTML = '';
  if (sharedWishlistWrapper) {
    if (hasWishlist) {
      if (sharedWishlistEmpty) sharedWishlistEmpty.classList.remove('hidden');
      sharedWishlistWrapper.classList.remove('hidden');
    } else {
      sharedWishlistWrapper.classList.add('hidden');
      sharedWishlistWrapper.remove();
    }
  }
};

const getSharedWishlist = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedWishlist = urlParams.get('wishlist') || false;
    if (sharedWishlist) {
      const sharedWishlistArray = sharedWishlist.split(LOCAL_STORAGE_DELIMITER);
      return sharedWishlistArray;
    }
    return [];
  } catch (error) {
    console.error('[Wishlist] Failed to fetch shared wishlist', error);
    return [];
  }
};

export const initButtons = async () => {
  const wishlist = await getWishlist();
  const buttons = document.querySelectorAll(selectors.buttonNotInitialized) || [];
  if (buttons.length) {
    setupButtons(buttons, false, wishlist);
  } else {
    return;
  }
  const event = new CustomEvent('shopify-wishlist:init-buttons', {
    detail: { wishlist: wishlist },
  });
  document.dispatchEvent(event);
};

const reInitButtons = async (handle, updatedWishlist) => {
  let buttons;
  buttons = document.querySelectorAll(`[data-product-handle="${handle}"]`) || [];
  if (buttons.length) {
    setupButtons(buttons, true, updatedWishlist);
  } else {
    return;
  }
};

const fetchWishlist = async () => {
  if (!CUSTOMER_LOGGED_IN) return [];
  try {
    const res = await fetch(ALL_WISHLIST_URL);
    const data = await res.json();
    const products = data.metafield.value;
    return products;
  } catch (error) {
    console.error('[Wishlist] Failed to fetch wishlist', error);
    return [];
  }
};

const getWishlist = async () => {
  const wishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
  return wishlist ? wishlist.split(LOCAL_STORAGE_DELIMITER) : [];
};

const updateWishlistFromFetch = async (gid) => {
  try {
    const res = await fetch(UPDATE_WISHLIST_URL, {
      method: 'POST',
      body: gid,
    });
    const data = await res.json();
    const products = data.metafield.value;
    return products;
  } catch (error) {
    console.error('[Wishlist] Failed to update wishlist', error);
    return [];
  }
};

const updateWishlistOnLocal = (wishlist = [], handle) => {
  if (handle) {
    const index = wishlist.indexOf(handle);
    if (index === -1) {
      wishlist.push(handle);
    } else {
      wishlist.splice(index, 1);
    }
  }

  const wishlistString = wishlist.join(LOCAL_STORAGE_DELIMITER);

  if (wishlist.length) {
    localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, wishlistString);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_WISHLIST_KEY);
  }
};

const mainUpdateWishlist = async (handle, e) => {
  let wishlist = await getWishlist();
  const wasInWishlist = wishlist.includes(handle);
  const wishListButton = e.target;

  const wishListButtonIsInProductCard = wishListButton.closest('.product-card');

  if (wasInWishlist && wishListButtonIsInProductCard) {
    const wishListButtonParent = wishListButton.parentElement;
    const wishlistConfirmation = wishListButtonParent.querySelector('.remove-wishlist-confirmation');

    if (wishlistConfirmation) {
      wishlistConfirmation.classList.remove('-translate-y-full');

      const removeWishlistButton = wishlistConfirmation.querySelector('.remove-wishlist-confirmation--confirm');
      removeWishlistButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await updateWishlist(wishlist, handle);
        wishlistConfirmation.classList.add('-translate-y-full');
      });

      const cancelWishlistButton = wishlistConfirmation.querySelector('.remove-wishlist-confirmation--cancel');
      cancelWishlistButton.addEventListener('click', (e) => {
        e.preventDefault();
        wishlistConfirmation.classList.add('-translate-y-full');
      });

      setupClickOutsideListener(wishlistConfirmation);
    }
  } else {
    await updateWishlist(wishlist, handle);
  }
};

const setupClickOutsideListener = (wishlistConfirmation) => {
  const clickOutsideEventListener = (e) => {
    const clickedEl = e.target;
    if (clickedEl !== wishlistConfirmation && !wishlistConfirmation.contains(clickedEl)) {
      wishlistConfirmation.classList.add('-translate-y-full');
      document.body.removeEventListener('click', clickOutsideEventListener, true);
    }
  };

  document.body.addEventListener('click', clickOutsideEventListener, true);
};

const updateWishlist = async (wishlist, handle) => {
  updateWishlistOnLocal(wishlist, handle);
  reInitButtons(handle, wishlist);

  if (CUSTOMER_LOGGED_IN) {
    const gid = await getProductIdfromHandle(handle);
    await updateWishlistFromFetch(gid);
    wishlist = await getWishlist();
  }
  const event = new CustomEvent('shopify-wishlist:updated', {
    detail: { wishlist: wishlist },
  });
  document.dispatchEvent(event);
};
