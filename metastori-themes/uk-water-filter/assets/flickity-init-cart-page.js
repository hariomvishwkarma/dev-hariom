window.addEventListener("load", () => {
  const maxWaitTime = 30000;
  const checkInterval = 1000;

  const intervalId = setInterval(() => {
    const elements = document.querySelectorAll('.recommended-products-carousel');

    if (elements.length > 0) {
      clearInterval(intervalId);
      clearTimeout(timeoutId);  

      elements.forEach(elem => {
        if (window.screen.width > 1250) {
          new Flickity(elem, {
            autoPlay: 2000, // Time between slides in milliseconds
            accessibility: true,
            cellAlign: 'left',
            cellSelector: '.productgrid--item',
            groupCells: false, // Scroll one cell at a time (not grouped)
            pageDots: false,
            contain: true,
            wrapAround: true, // Allows infinite scrolling
            arrowShape: 'M65.29 11.99L27.28 50L65.3 87.99L70.25 83.06L37.19 50L70.26 16.94L65.29 11.99Z',
            pauseAutoPlayOnHover: true, // Optional: autoplay continues on hover
            selectedAttraction: 0.01, // Smooth movement
            friction: 0.15 // Smooth movement
          });
        } else {
          new Flickity(elem, {
            prevNextButtons: false,
            groupCells: true,
            adaptiveHeight: false,
            wrapAround: true,
            pageDots: false
          });
        }
      });
    }
  }, checkInterval);

  const timeoutId = setTimeout(() => {
    clearInterval(intervalId); // Stop checking after 30 seconds
    console.warn("Flickity carousel elements not found within 30 seconds.");
  }, maxWaitTime);
});


// window.addEventListener("load", (event) => {
//   const elements = document.querySelectorAll('.recommended-products-carousel');

//   elements.forEach(elem => {
//     if (window.screen.width > 1250) {
//       new Flickity( elem, {
//         prevNextButtons: false,
//         groupCells: true,
//         adaptiveHeight: false,
//         cellAlign: 'left'
//       });
//     } else {
//       new Flickity( elem, {
//         prevNextButtons: false,
//         groupCells: true,
//         adaptiveHeight: false,
//         wrapAround: true
//       });
//     }
//   })

// })