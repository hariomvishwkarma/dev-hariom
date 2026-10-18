// Define the custom element
class IdleText extends HTMLElement {
  constructor() {
    super();
    this.idleTime = this.getAttribute("data-idle-time");
    this.text = this.textContent;
    this.configureIdleTimer();
    this.listenForInteraction();
  }
  hideText() {
    this.displayed = false;
    this.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 1000,
      easing: "ease-in-out",
      fill: "forwards",
    }).onfinish = () => {
      this.style.display = "none";
    };
  }
  configureIdleTimer() {
    this.idleTimer = setTimeout(() => {
      this.style.display = "block";
      this.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 1000,
        easing: "ease-in-out",
        fill: "forwards",
      }).onfinish = () => {
        this.displayed = true;
      };
    }, this.idleTime * 1000);
  }
  listenForInteraction() {
    const interactionEvents = ["click", "mousemove", "keydown", "scroll", "touchstart"];
    interactionEvents.forEach((event) => {
      document.addEventListener(event, () => {
        clearTimeout(this.idleTimer);
        this.configureIdleTimer();
        if (this.displayed) {
          this.hideText();
        }
      });
    });
  }
}
customElements.define("idle-text", IdleText);
