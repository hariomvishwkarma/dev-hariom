import { debounce } from '../../../scripts/utils/debounce';

// create a container and set the full-size image as its background
function createOverlay(image) {
  const overlayImage = document.createElement('img');
  overlayImage.setAttribute('src', `${image.src}`);
  overlay = document.createElement('div');
  prepareOverlay(overlay, overlayImage);

  image.style.opacity = '50%';

  overlayImage.onload = () => {
    image.insertAdjacentElement('afterend', overlay);
    image.style.opacity = '100%';
  };

  return overlay;
}

function prepareOverlay(container, image) {
  container.setAttribute('class', 'image-magnify-full-size');
  container.setAttribute('aria-hidden', 'true');
  container.style.backgroundImage = `url('${image.src}')`;
}

function moveWithHover(image, event, zoomRatio) {
  // calculate mouse position
  const ratio = image.height / image.width;
  const container = event.target.getBoundingClientRect();
  const xPosition = event.clientX - container.left - 10;
  const yPosition = event.clientY - container.top - 10;
  const xPercent = `${xPosition / (image.clientWidth / 100)}%`;
  const yPercent = `${yPosition / ((image.clientWidth * ratio) / 100)}%`;

  // determine what to show in the frame
  overlay.style.backgroundPosition = `${xPercent} ${yPercent}`;
  overlay.style.backgroundSize = `${image.width * zoomRatio}px`;
}

function magnify(image, zoomRatio) {
  const overlay = createOverlay(image);
  overlay.onclick = debounce(() => {
    overlay.remove();
  }, 200);
  overlay.onmousemove = (event) => moveWithHover(image, event, zoomRatio);
  overlay.onmouseleave = debounce(() => {
    overlay.remove();
  }, 200);
}

function enableZoomOnHover(zoomRatio) {
  const images = document.querySelectorAll('.image-magnify-hover');
  images.forEach((image) => {
    image.onmouseover = (event) => {
      if (!event.relatedTarget) return;
      magnify(image, zoomRatio);
      moveWithHover(image, event, zoomRatio);
    };
  });
}

function enableZoomOnClick(zoomRatio) {
  const images = document.querySelectorAll('.image-magnify-click');
  images.forEach((image) => {
    image.onclick = (event) => {
      magnify(image, zoomRatio);
      moveWithHover(image, event, zoomRatio);
    };
  });
}

enableZoomOnHover(2);
enableZoomOnClick(2);
