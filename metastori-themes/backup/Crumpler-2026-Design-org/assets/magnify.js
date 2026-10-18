// create a container and set the full-size image as its background
function createOverlay(image) {
  const newSrc = image.src.replace(/width=\d+/, 'width=1440');
  const overlayImage = document.createElement('img');
  overlayImage.setAttribute('src', `${newSrc}`);
  overlay = document.createElement('div');
  prepareOverlay(overlay, overlayImage);

  image.style.opacity = '50%';
  //toggleLoadingSpinner(image);

  overlayImage.onload = () => {
    //toggleLoadingSpinner(image);
    image.parentElement.insertBefore(overlay, image);
    image.style.opacity = '100%';
  };

  return overlay;
}

function prepareOverlay(container, image) {
  container.setAttribute('class', 'image-magnify-full-size');
  container.setAttribute('aria-hidden', 'true');
  container.style.backgroundImage = `url('${image.src}')`;
  container.style.backgroundColor = 'var(--gradient-background)';
}

function toggleLoadingSpinner(image) {
  const loadingSpinner = image.parentElement.parentElement.querySelector(`.loading__spinner`);
  loadingSpinner.classList.toggle('hidden');
}

function moveWithHover(image, event, zoomRatio) {
  // calculate mouse position
  const ratio = image.height / image.width;
  const container = event.target.getBoundingClientRect();
  const xPosition = event.clientX - container.left;
  const yPosition = event.clientY - container.top;
  const xPercent = `${xPosition / (image.clientWidth / 100)}%`;
  const yPercent = `${yPosition / ((image.clientWidth * ratio) / 100)}%`;

  // determine what to show in the frame
  overlay.style.backgroundPosition = `${xPercent} ${yPercent}`;
  overlay.style.backgroundSize = `${image.width * zoomRatio}px`;
}

function magnify(image, zoomRatio) {
  const overlay = createOverlay(image);
  overlay.onclick = () => overlay.remove();
  overlay.onmousemove = (event) => moveWithHover(image, event, zoomRatio);
  overlay.onmouseleave = () => overlay.remove();
}

// function enableZoomOnHover(zoomRatio) {
//   const images = document.querySelectorAll('.image-magnify-hover');
//   images.forEach((image) => {
//     image.onclick = (event) => {
      
//     };
//   });
// }

// enableZoomOnHover(2);

if(window.innerWidth > 990){
  document.addEventListener('click', function(event) {
    const magnifyEl = event.target.closest('.img-magnify-hover');

    if (magnifyEl) {
      magnify(magnifyEl, 2);
      moveWithHover(magnifyEl, event, 2);
    }
  });
}

