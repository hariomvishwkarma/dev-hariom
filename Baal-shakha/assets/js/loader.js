class ThemeLoader extends HTMLElement {
  connectedCallback() {
    const startTime = new Date().getTime() / 1000;
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 2;
      this.classList.add('active');
    }, 10);

    window.addEventListener('load', () => {
      const elapsed = (new Date().getTime() / 1000) - startTime;

      const finishAnimation = () => {
        this.classList.add('animate-top');
        const ageVerificationPopup = document.querySelector('[data-popup-type="age-verification"]');
        if (!ageVerificationPopup || !ageVerificationPopup.classList.contains('active')) {
          document.body.classList.remove('overflow-hidden');
        }
      };

      if (elapsed >= 1.5) {
        finishAnimation();
      } else {
        setTimeout(finishAnimation, (1.5 - elapsed) * 1000);
      }
    });
  }
}

if (!window.customElements.get('theme-loader')) {
  window.customElements.define('theme-loader', ThemeLoader);
}
