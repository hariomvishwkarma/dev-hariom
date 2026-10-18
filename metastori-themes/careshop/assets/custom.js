document.addEventListener("variant:changed", function (event) {
  const variant = event.detail.variant;

  // Remove 'active' class from all elements
  document.querySelectorAll(".metafield-data-spec-main").forEach(el => el.classList.remove("active"));
  
  // Select and activate all elements that match the variant ID
  document.querySelectorAll(".spec-data-" + variant.id).forEach(el => el.classList.add("active"));


let variantPreorder = document.querySelector(".custom-preorder-variant-" + variant.id);

if (variantPreorder) {


  let preorderData = variantPreorder.getAttribute("data");

  let inventoryWrapper = document.querySelector(".product-form__inventory-wrapper .text_container");
  if (inventoryWrapper) {
    inventoryWrapper.innerHTML = `<span class="inventory--low">${preorderData}</span>`;
  }
}




  
});

document.addEventListener("click", function (event) {
  const button = event.target.closest('[data-action="scroll-to-size-chart"]');
  if (!button) return;

  event.preventDefault();

  const sizeChartTab = document.getElementById("product-size-chart-tab");
  if (!sizeChartTab) return;

  const tabId = sizeChartTab.id;
  let scrollDelay = 0;

  const desktopTabButton = document.querySelector('.tabs-nav__item[aria-controls="' + tabId + '"]');
  if (desktopTabButton && desktopTabButton.offsetParent !== null) {
    desktopTabButton.click();
  }

  const accordionToggle = sizeChartTab.querySelector(".collapsible-toggle");
  if (accordionToggle && accordionToggle.offsetParent !== null && accordionToggle.getAttribute("aria-expanded") === "false") {
    accordionToggle.click();
    scrollDelay = 300;
  }

  setTimeout(function () {
    const styles = getComputedStyle(document.documentElement);
    const headerHeight = parseInt(styles.getPropertyValue("--header-height") || "0", 10);
    const stickyHeader = parseInt(styles.getPropertyValue("--enable-sticky-header") || "0", 10);
    const announcementHeight = parseInt(styles.getPropertyValue("--announcement-bar-height") || "0", 10);
    const stickyAnnouncement = parseInt(styles.getPropertyValue("--enable-sticky-announcement-bar") || "0", 10);
    const extraOffset = 32;
    const scrollOffset = headerHeight * stickyHeader + announcementHeight * stickyAnnouncement + extraOffset;
    const top = sizeChartTab.getBoundingClientRect().top + window.pageYOffset - scrollOffset;

    window.scrollTo({ top: top, behavior: "smooth" });
  }, scrollDelay);
});
