// Ensure this script runs only when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {

  // Function to initialize a single before-after slider
  function initializeBeforeAfterSlider(sliderSection) {
    const sliderContainer = sliderSection.querySelector('.before-after-slider-container');
    const afterImageWrapper = sliderContainer.querySelector('.before-after-slider__after-image');
    const handle = sliderContainer.querySelector('.before-after-slider__handle');

    // If any required elements are missing, or slider is disabled, exit
    if (!afterImageWrapper || !handle || !sliderContainer) {
        return;
    }

    // Get the data attribute for enabling/disabling the slider
    const enableSlider = sliderSection.getAttribute('data-enable-slider') === 'true' || sliderSection.getAttribute('data-enable-slider') === 'True';


    // If the slider is not enabled (checkbox in theme editor is unchecked),
    // set after image to 50% and hide the handle, then return.
    if (!enableSlider) {
        afterImageWrapper.style.width = '50%';
        handle.style.display = 'none';
        return;
    }

    let isDragging = false;

    // Set initial position of handle and after image
    function setInitialPosition() {
        const initialPosition = sliderContainer.offsetWidth / 2; // Center
        afterImageWrapper.style.width = initialPosition + 'px';
        handle.style.left = initialPosition + 'px';
    }

    // Set initial position when the page loads
    setInitialPosition();

    // Event listeners for dragging
    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false }); // Add passive: false for touchmove preventDefault

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // Recalculate position on window resize
    window.addEventListener('resize', () => {
        if (!isDragging) { // Only reset if not currently dragging
            setInitialPosition();
        }
    });

    function startDrag(e) {
      if (e.cancelable) e.preventDefault(); // Prevent default touch behavior like scrolling
      isDragging = true;
      sliderContainer.classList.add('is-dragging'); // Add class for potential drag styles (e.g., cursor)
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag, { passive: false });
    }

    function endDrag() {
      isDragging = false;
      sliderContainer.classList.remove('is-dragging');
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
    }

    function drag(e) {
      if (!isDragging) return;

      let clientX;
      if (e.touches) {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      const containerRect = sliderContainer.getBoundingClientRect();
      let newPosition = clientX - containerRect.left; // Position relative to container

      // Clamp the position to be within the container bounds
      if (newPosition < 0) {
        newPosition = 0;
      } else if (newPosition > containerRect.width) {
        newPosition = containerRect.width;
      }

      afterImageWrapper.style.width = newPosition + 'px';
      handle.style.left = newPosition + 'px';
    }
  }

  // Find all instances of this section on the page and initialize them
  const sliderSections = document.querySelectorAll('[data-section-id][data-enable-slider]');
  sliderSections.forEach(section => {
    initializeBeforeAfterSlider(section);
  });
});