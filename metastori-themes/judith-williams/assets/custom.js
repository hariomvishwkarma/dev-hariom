const check_data_view = setInterval(() => {
  if(window.innerWidth <= 767){
  	const grid = document.querySelector('.new-grid.product-grid.collection-grid');
    if (grid) {
      grid.setAttribute('data-view', 'list');
    }
    document.querySelectorAll('.grid-view-btn').forEach(function (btn) {
      btn.classList.remove('is-active');
    });
    document.querySelector('.grid-view-btn[data-view="list"]').classList.add('is-active');

    const gridBtn = document.querySelector('.single_view.grid-view-btn');
    if (gridBtn && window.innerWidth <= 767) {
      gridBtn.click();
    }
  }
}, 300);

document
  .querySelectorAll(".product-block--tab .collapsible-content__inner p")
  .forEach(function (p) {
    if (p.textContent.trim() === "") {
      p.innerHTML = "<br>";
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth < 767) {
    $(".show_more_btn").click(function () {
      $(this).closest(".show_more_filter").toggleClass("active_btn");
      $(this).closest(".collapsible-content").addClass("see_more_active");
      $(this).closest(".collapsible-content").css("height", "auto");
    });
    $(".show_less_btn").click(function () {
      $(this).closest(".show_more_filter").toggleClass("active_btn");
      $(this).closest(".collapsible-content").removeClass("see_more_active");
    });
  }

  // const widget_show_time = parseInt(document.body.getAttribute('widget_show_time'));

  // setTimeout(function() {
  //     const hiddenElement = document.querySelector('#shopify-chat');
  //         hiddenElement.style.display = 'block'; // Show the element
  // }, widget_show_time*1000);

  const productAtcBtns = document.querySelectorAll(".product_atc_btn");

  if (productAtcBtns.length > 0) {
    productAtcBtns.forEach((button) => {
      button.addEventListener("click", function () {
        const this_ = this; // Store reference to 'this'
        this_.classList.add("active");
        const variantId = this_.getAttribute("variant_id");

        const gridProduct = this_.closest(".grid-product");
        console.log("gridProduct "+gridProduct);
        
        if (gridProduct) {
          const quickAddBtn = gridProduct.querySelector(
            ".grid-product__actions .quick-add-btn"
          );
          if (quickAddBtn) {
            quickAddBtn.click();
            setTimeout(function () {
              this_.classList.remove("active");
            }, 1000);
          }
        }
      });
    });
  }

  // Footer payment icon id change
  const paymentIcons = document.querySelectorAll(
    ".footer__block--payment_icons .payment-icons svg"
  );

  paymentIcons.forEach((svg) => {
    const titleElement = svg.querySelector("title");

    if (titleElement) {
      const currentId = titleElement.getAttribute("id");
      const newId = currentId + "-footer";

      titleElement.setAttribute("id", newId);

      if (
        svg.hasAttribute("aria-labelledby") &&
        svg.getAttribute("aria-labelledby") === currentId
      ) {
        svg.setAttribute("aria-labelledby", newId);
      }
    }
  });

  const ids = {};
  document.querySelectorAll("[id]").forEach((element) => {
    const id = element.id;
    ids[id] = (ids[id] || 0) + 1;
  });
  const duplicates = Object.keys(ids).filter((id) => ids[id] > 1);
  console.log("Duplicate IDs:", duplicates);


  const intervalId = setInterval(() => {
    const sourceFrame = document.querySelector('#embeddedMessagingConversationButton');
    const targetFrame = document.querySelector('#embeddedMessagingSiteContextFrame');

    if (sourceFrame && targetFrame) {
      console.log('yes');
      const title = sourceFrame.getAttribute('title');
      const ariaLabel = sourceFrame.getAttribute('aria-label');
      console.log('title '+ title);
      console.log('ariaLabel '+ ariaLabel);

      if (title) targetFrame.setAttribute('title', title);
      if (ariaLabel) targetFrame.setAttribute('aria-label', ariaLabel);

      clearInterval(intervalId); // Stop once done
    }
  }, 500); // check every 500ms

  setTimeout(()=>{
  	clearInterval(check_data_view);
  },1500);


});
