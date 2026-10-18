window.addEventListener("load", (event) => {
  const elem = document.querySelector('.review-carousel');

  new Flickity( elem, {
    wrapAround: true,
    autoPlay: 6000,
    prevNextButtons: false,
    adaptiveHeight: false,
  });

  const resizeImgWrappers = () => {
    if (window.innerWidth > 1250) {
      const carouselCellHeight = document.querySelector('.carousel-cell').offsetHeight
      const carouselImgWrappers = document.querySelectorAll('.review.carousel-cell > .img__wrapper')

      carouselImgWrappers.forEach(wrapper => {
        wrapper.style.height = `${carouselCellHeight}px`
      })
    }
  }

  resizeImgWrappers()


  addEventListener("resize", (event) => {
    resizeImgWrappers()
  }) 
});