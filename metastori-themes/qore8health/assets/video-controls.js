if (!customElements.get("video-controls")) {
    customElements.define(
      "video-controls",
      class VideoControls extends HTMLElement {
        constructor() {
          super();
        }
        

        connectedCallback() {
          this.video = this.querySelector("video");
          this.hasVideoClickToggle = this.dataset.videoClick === "false" ? false : true;
          this.isReelsBehavior = this.dataset.behavior === "reels";
          this.iconFlashTimeout = null;
          this.userInitiatedAction = null;
          this.movieTarget = this.querySelector(".wt-video__movie");
          this.productsContainer = this.querySelector(
            ".shoppable-video__products",
          );
          this.controlButton = this.querySelector(
            ".shoppable-video__control-button",
          );
          
          this.togglePlayPause = this.togglePlayPause.bind(this);
          this.toggleVideoIcon = this.toggleVideoIcon.bind(this);

          this.addEventListeners();
          if(this.controlButton && this.video) this.toggleVideoIcon();
        }
        
        addEventListeners() {
          if(this.controlButton) this.controlButton.addEventListener("click", this.togglePlayPause);
          if (this.isReelsBehavior && this.movieTarget) {
            this.movieTarget.addEventListener("click", this.togglePlayPause);
          } else if(this.video && this.hasVideoClickToggle) {
            this.video.addEventListener("click", this.togglePlayPause);
          }
          if(this.controlButton && this.video){
            this.video.addEventListener("play", this.toggleVideoIcon);
            this.video.addEventListener("pause", this.toggleVideoIcon);
          }
        }
        
        removeEventListeners() {
          if(this.controlButton) this.controlButton.removeEventListener("click", this.togglePlayPause);
          if (this.isReelsBehavior && this.movieTarget) {
            this.movieTarget.removeEventListener("click", this.togglePlayPause);
          } else if(this.video && this.hasVideoClickToggle) {
            this.video.removeEventListener("click", this.togglePlayPause);
          }
          if(this.controlButton && this.video){
            this.video.removeEventListener("play", this.toggleVideoIcon);
            this.video.removeEventListener("pause", this.toggleVideoIcon);
          }
          if (this.iconFlashTimeout) {
            clearTimeout(this.iconFlashTimeout);
            this.iconFlashTimeout = null;
          }
        }

        toggleVideoIcon() {
          if (!this.controlButton || !this.video) return;

          if (this.isReelsBehavior) {
            this.updateReelsButtonVisibility();
            return;
          }

          const isPlaying = !this.video.paused;
          this.controlButton.classList.toggle(
            "shoppable-video__control-button--play",
            isPlaying,
          );
          this.controlButton.classList.toggle(
            "shoppable-video__control-button--pause",
            !isPlaying,
          );
        }

        updateReelsButtonVisibility() {
          const isPlaying = !this.video.paused && !this.video.ended;
          const userAction = this.userInitiatedAction;
          this.userInitiatedAction = null;

          clearTimeout(this.iconFlashTimeout);
          this.iconFlashTimeout = null;
          this.controlButton.classList.remove("shoppable-video__control-button--flash");

          if (!isPlaying) {
            this.controlButton.classList.remove("shoppable-video__control-button--play");
            this.controlButton.classList.add("shoppable-video__control-button--pause");
            return;
          }

          if (userAction === "play") {
            this.controlButton.classList.add("shoppable-video__control-button--play");
            this.controlButton.classList.remove("shoppable-video__control-button--pause");
            this.controlButton.classList.add("shoppable-video__control-button--flash");

            this.iconFlashTimeout = setTimeout(() => {
              this.controlButton.classList.remove("shoppable-video__control-button--flash");
              this.iconFlashTimeout = null;
            }, 1000);
            return;
          }

          this.controlButton.classList.add("shoppable-video__control-button--play");
          this.controlButton.classList.remove("shoppable-video__control-button--pause");
        }

        togglePlayPause(e) {
          e.preventDefault();
          e.stopPropagation();
          const videoElement = this.video;      
          
          if (!videoElement) return;

          if (this.isReelsBehavior) {
            this.userInitiatedAction =
              videoElement.paused || videoElement.ended ? "play" : "pause";
          }

          if (videoElement.paused || videoElement.ended) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        }

        disconnectedCallback(){
          this.removeEventListeners();
        }

      },
    );
  }
  