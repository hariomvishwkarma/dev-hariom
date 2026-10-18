const elementIsVisibleInViewport = (element) => {
  if (element.offsetWidth || element.offsetHeight || element.getClientRects().length) {
    return true;
  } else {
    return false;
  }
};

export { elementIsVisibleInViewport };
