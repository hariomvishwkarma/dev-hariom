document.addEventListener('DOMContentLoaded', () => {
  const currentURL = window.location.href;
  if (currentURL.includes('/search?')) {
    getTotalSearchResultCount();
    const queryString = window.location.search;
    if (queryString.includes('type=articles')) {
      const el = document.querySelector('.main-search-section');
      if (el) el.setAttribute('data-article-search', true);
    }
  }
});

async function getTotalSearchResultCount() {
  const searchPageInformation = document.querySelector('#search-page-information');
  if (searchPageInformation) {
    const paginationLength = searchPageInformation.dataset.searchPaginationLength;
    let totalProducts = 0;
    let totalArticlesAndPages = 0;
    let fetchedHTML = '';
    for (let i = 0; i < paginationLength; i += 1) {
      let pageNumber = i + 1;
      fetchedHTML = await fetchHTML(pageNumber);
      const articlesAndPagesOnThisLoad = fetchedHTML.querySelectorAll('#ProductGridContainer .listing-item') ? fetchedHTML.querySelectorAll('#ProductGridContainer .listing-item').length : 0;
      const productsOnThisLoad = fetchedHTML.querySelectorAll('#ProductGridContainer .product-card') ? fetchedHTML.querySelectorAll('#ProductGridContainer .product-card').length : 0;
      totalProducts = totalProducts + productsOnThisLoad;
      totalArticlesAndPages = totalArticlesAndPages + articlesAndPagesOnThisLoad;
    }
    const resultCountProducts = document.querySelector('.results-count-products');
    const resultCountArticlesAndPages = document.querySelector('.results-count-articles-and-pages');
    if (resultCountProducts) resultCountProducts.innerHTML = '(' + totalProducts + ')';
    if (resultCountArticlesAndPages) resultCountArticlesAndPages.innerHTML = '(' + totalArticlesAndPages + ')';
  }
}

async function fetchHTML(i) {
  const currentURL = window.location.href;
  const newUrl = currentURL + '&page=' + i;
  let html = '';
  await fetch(newUrl)
    .then((response) => response.text())
    .then((responseText) => {
      const parser = new DOMParser();
      html = parser.parseFromString(responseText, 'text/html');
    });
  return html;
}
