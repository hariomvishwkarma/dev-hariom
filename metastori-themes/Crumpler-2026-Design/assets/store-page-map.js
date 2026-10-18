function promiseTransitionStartFactory(video, transitionTime, resolve, token, context) {
  const promiseTransitionStart = () => {
    if (!video) return;
    if (context.animationToken !== token) {
      video.removeEventListener("timeupdate", promiseTransitionStart);
      return;
    }
    const remainingTime = video.duration - video.currentTime;
    if (remainingTime <= transitionTime / 1000) {
      video.removeEventListener("timeupdate", promiseTransitionStart);
      resolve(remainingTime * 1000);
    }
  };
  video.addEventListener("timeupdate", promiseTransitionStart);
  // Return a cleanup function to remove the event listener
  return () => video.removeEventListener("timeupdate", promiseTransitionStart);
}

class StorePageMap extends HTMLElement {
  debug = true;

  constructor() {
    super();
    this.transitionType = this.getAttribute("transition-type");
    this.loopAnimation = this.querySelector('[slot="loop-animation"]').innerHTML;
    this.startAnimation = this.querySelector('[slot="start-animation"]').innerHTML;
    this.transitionAnimation = this.querySelector('[slot="transition-animation"]').innerHTML;
    this.rendered = false;
    this.storeBlocks = [...this.querySelectorAll('[slot="store"]')];
    this.storeDetailsMedia = [...this.querySelectorAll('[slot="store-details"]')];
    this.detailDuration = parseInt(this.getAttribute("detail-duration")) || 2000;
    this.transitionDuration = parseInt(this.getAttribute("transition-duration")) || 2000;
    this.animationToken = 0; // Initialize the animation token
    this.pendingOperations = []; // To track event listeners and timeouts
  }

  connectedCallback() {
    if (this.rendered) return;
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
      case "store-map":
        this.storeMap = newValue;
        this.transitionToStore(this.storeMap);
        break;
    }
  }
  render() {
    this.innerHTML = `
      <div id="start" class="store-page__map__animation">
        ${this.startAnimation}
      </div>
      <div id="loop" class="store-page__map__animation">
        ${this.loopAnimation}
      </div>
      <div id="transition" class="store-page__map__animation">
        ${this.transitionAnimation}
      </div>
      ${this.storeBlocks
        .map(
          (block) => `
            <div id="${block.dataset.blockId}" class="store-page__map__animation" style="display: none; opacity: 0; z-index: 0;">
              ${block.innerHTML}
            </div>
          `,
        )
        .join("")}
      <div class="store-page__map__details">
        ${this.storeDetailsMedia
          .map(
            (media) => `
            <div class="store-page__map__details__media" id="details-${media.dataset.blockId}" style="${media.getAttribute('style')}">
               <div class="popupContent">
                ${media.innerHTML}
                 <button class="store-page__map-close-button">CLOSE X</button>
               </div>
            </div>
          `,
          )
          .join("")}
      </div>
    `;
    setTimeout(() => {
      this.onRender();
      this.didRender();
    },0);
  }

  viewDetails(storeId) {
    this.details = storeId;
    const mediaNeeded = this.detailsMedia.get(storeId);
    if (!mediaNeeded) return;
    mediaNeeded.classList.add("store-page__map__details__media--visible");
  }

  hideDetails(storeId) {
    this.details = null;
    const mediaNeeded = this.detailsMedia.get(storeId);
    if (!mediaNeeded) return;
    mediaNeeded.classList.remove("store-page__map__details__media--visible");
  }

  getDetails(storeId) {
    return this.detailsMedia.get(storeId);
  }

  toggleDetails(storeId) {
    const mediaNeeded = this.detailsMedia.get(storeId);
    if (this.details !== storeId) {
      if (this.details) this.hideDetails(this.details);
      this.viewDetails(storeId);
    } else {
      this.hideDetails(storeId);
    }
  }

  didRender() {
    this.rendered = true;
  }

  async onRender() {
    this.animations = new Map([
      ["start", this.querySelector("#start video")],
      ["loop", this.querySelector("#loop video")],
      ["transition", this.querySelector("#transition video")],
      ...this.storeBlocks.map((block) => [
        block.dataset.blockId,
        this.querySelector(`#${block.dataset.blockId}`),
      ]),
    ]);
    this.detailsMedia = new Map([
      ...this.storeDetailsMedia.map((media) => [
        media.dataset.blockId,
        this.querySelector(`#details-${media.dataset.blockId}`),
      ]),
    ]);
    this.runAnimation("start", "immediately", false, false, this.animationToken);
    setTimeout(
      () => this.runAnimation("loop", "sequential", true, false, this.animationToken),
      0,
    );
  }

  addPendingOperation(cleanupFn) {
    this.pendingOperations.push(cleanupFn);
  }

  runMapAnimation(oldAnimation, nextAnimationContainer, type, loop, fade, token) {
    const fadeTime = this.transitionDuration;
    const oldAnimationContainer = oldAnimation?.parentElement;
    oldAnimationContainer.style.zIndex = 2;
    nextAnimationContainer.style.zIndex = 1;
    nextAnimationContainer.style.opacity = 1;

    const remainingTime = oldAnimation.duration - oldAnimation.currentTime;

    const startTransition = () => {
      if (this.animationToken !== token) return;
      // Set loop opacity to 0
      this.animations.get("loop").parentElement.style.opacity = 0;
      nextAnimationContainer.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: fadeTime,
      });
      oldAnimationContainer
        .animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: fadeTime,
        })
        .onfinish = () => {
          if (this.animationToken !== token) return;
          oldAnimationContainer.style.display = "none";
          nextAnimationContainer.style.display = "block";
          nextAnimationContainer.style.opacity = 1;
          nextAnimationContainer.style.zIndex = 99;
          oldAnimationContainer.style.zIndex = 0;
          oldAnimation.pause();
        };
      this.currentAnimation = nextAnimationContainer;
    };

    if (remainingTime <= fadeTime / 1000) {
      startTransition();
      return;
    } else {
      return new Promise((resolve) => {
        const cleanup = promiseTransitionStartFactory(
          oldAnimation,
          fadeTime,
          resolve,
          token,
          this,
        );
        this.addPendingOperation(cleanup);
      }).then(() => {
        if (this.animationToken !== token) return;
        startTransition();
      });
    }
  }

  transitionOutFromMap(oldAnimation, nextAnimation, type, loop, fade, token) {
    if (this.animationToken !== token) return;
    const oldAnimationContainer = oldAnimation;
    const nextAnimationContainer = nextAnimation.parentElement;

    oldAnimationContainer.style.opacity = 0;
    oldAnimationContainer.style.zIndex = 0;

    nextAnimationContainer.style.zIndex = 1;
    nextAnimationContainer.style.opacity = 1;

    this.currentAnimation = nextAnimation;
    nextAnimation.play().catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Error playing video:", error);
      }
    });
  }

  async runAnimation(animation, type, loop = false, fade = false, token) {
    if (this.animationToken !== token) return;
    let oldAnimation = this.currentAnimation;
    const nextAnimation = this.animations.get(animation);

    // Remove visibility classes from old animation
    if (oldAnimation && oldAnimation.tagName === "VIDEO") {
      oldAnimation.parentElement.classList.remove(
        "store-page__map__animation--visible",
      );
    } else if (oldAnimation) {
      oldAnimation.classList.remove("store-page__map__animation--visible");
    }

    // Add visibility classes to new animation
    if (nextAnimation.tagName === "VIDEO") {
      nextAnimation.parentElement.classList.add("store-page__map__animation--visible");
    } else {
      nextAnimation.classList.add("store-page__map__animation--visible");
    }

    // If transitioning to a store map, ensure that only the current store is visible
    if (animation.startsWith("store_")) {
      // Hide all other store maps
      this.animations.forEach((anim, key) => {
        if (key.startsWith("store_") && key !== animation) {
          const container = anim.tagName === "VIDEO" ? anim.parentElement : anim;
          container.style.display = "none";
          container.style.opacity = 0;
          container.style.zIndex = 0;
          container.classList.remove("store-page__map__animation--visible");
        }
      });
    }

    if (nextAnimation.tagName !== "VIDEO") {
      await this.runMapAnimation(
        oldAnimation,
        nextAnimation,
        type,
        loop,
        fade,
        token,
      );
      return;
    }
    if (!oldAnimation || oldAnimation.tagName !== "VIDEO") {
      if (oldAnimation) {
        this.transitionOutFromMap(
          oldAnimation,
          nextAnimation,
          type,
          loop,
          fade,
          token,
        );
      }
      oldAnimation = document.createElement("video");
      oldAnimation.loop = false;
      oldAnimation.currentTime = 0;
    }

    nextAnimation.loop = loop;

    switch (type) {
      case "immediately":
        return this.switchAnimations(
          oldAnimation,
          nextAnimation,
          fade ? 1000 : 0,
          token,
        );
      case "sequential":
        oldAnimation.loop = false;
        if (!fade) {
          return new Promise((resolve) => {
            const onEnded = async () => {
              oldAnimation.removeEventListener("ended", onEnded);
              if (this.animationToken !== token) return;
              await this.switchAnimations(
                oldAnimation,
                nextAnimation,
                fade ? 1000 : 0,
                token,
              );
              resolve();
            };
            oldAnimation.addEventListener("ended", onEnded);
            this.addPendingOperation(() => oldAnimation.removeEventListener("ended", onEnded));
          });
        } else {
          const fadeTime = this.transitionDuration;
          return new Promise((resolve) => {
            const cleanup = promiseTransitionStartFactory(
              oldAnimation,
              fadeTime,
              resolve,
              token,
              this,
            );
            this.addPendingOperation(cleanup);
          }).then((fadeTime) => {
            if (this.animationToken !== token) return;
            return this.switchAnimations(
              oldAnimation,
              nextAnimation,
              fadeTime,
              token,
            );
          });
        }
        break;
    }
  }

  switchAnimations(oldAnimation, nextAnimation, fade = 0, token) {
    if (!nextAnimation || this.animationToken !== token) return;

    return new Promise((resolve) => {
      const oldAnimationContainer = oldAnimation?.parentElement;
      const nextAnimationContainer = nextAnimation.parentElement;

      // Pause old animation before playing the new one
      if (oldAnimation) {
        oldAnimation.pause();
      }

      nextAnimation.currentTime = 0;
      nextAnimationContainer.style.display = "block";

      const playPromise = nextAnimation.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error playing video:", error);
          }
        });
      }

      [...this.animations
        .values()]
        .forEach((video) => (video.parentElement.style.zIndex = 0));
      if (fade) {
        nextAnimationContainer.style.zIndex = 1;
        nextAnimationContainer.style.opacity = 1;
        const animation = nextAnimationContainer.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          {
            duration: fade,
          },
        );

        const timeoutId = setTimeout(() => {
          if (this.animationToken !== token) return;
          if (oldAnimationContainer) oldAnimationContainer.style.opacity = 0;
          this.currentAnimation = nextAnimation;
          resolve();
        }, fade);
        this.addPendingOperation(() => clearTimeout(timeoutId));
      } else {
        nextAnimationContainer.style.zIndex = 1;
        if (oldAnimationContainer) oldAnimationContainer.style.opacity = 0;
        nextAnimationContainer.style.opacity = 1;
        this.currentAnimation = nextAnimation;
        const remainingTime =
          nextAnimation.duration - nextAnimation.currentTime;
        const timeoutId = setTimeout(() => {
          if (this.animationToken !== token) return;
          resolve(remainingTime * 1000);
        }, remainingTime * 1000);
        this.addPendingOperation(() => clearTimeout(timeoutId));
      }
    });
  }

  async cancelTransitionToStore(storeId) {
    // Increment the animation token to cancel any pending actions
    this.animationToken += 1;
    this.isAnimating = false;
    this.isAnimatingToStore = null;
    // Clean up any pending operations
    this.pendingOperations.forEach((cleanup) => cleanup());
    this.pendingOperations = [];

    // Reset styles on all store maps
    this.animations.forEach((anim, key) => {
      if (key.startsWith("store_")) {
        const container = anim.tagName === "VIDEO" ? anim.parentElement : anim;
        container.style.display = "none";
        container.style.opacity = 0;
        container.style.zIndex = 0;
        container.classList.remove("store-page__map__animation--visible");
      }
    });

    this.debugMsg(`Transition to ${storeId} cancelled`);
  }

  async transitionToStore(storeId) {
    this.debugMsg(`----- Start transition to ${storeId} -----`);
    this.debugMsg(`(check) isAnimating: ${this.isAnimating}`);
    if (this.isAnimating) {
      await this.cancelTransitionToStore(this.isAnimatingToStore);
    }

    this.isAnimating = true;
    this.isAnimatingToStore = storeId;
    this.animationToken += 1;
    const token = this.animationToken;

    const isLoop = this.currentAnimation?.parentElement?.id === "loop";
    if (!isLoop && this.currentAnimation?.parentElement?.id) {
      const currentStoreId = this.currentAnimation?.parentElement.id;
      if (this.details === currentStoreId) {
        this.debugMsg(`Hide details of ${currentStoreId}`);
        this.hideDetails(currentStoreId);
      }
    }

    this.debugMsg(`transitionToStore: ${storeId} - transition phase started`);
    this.runAnimation("transition", "immediately", false, false, token)
      .then(() => {
        if (this.animationToken !== token) return;
        this.debugMsg(`transitionToStore: ${storeId} - transition phase ended`);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error during transition phase:", error);
        }
      });

    let targetStoreId = storeId;
    if (this.queue && this.queue !== storeId) {
      targetStoreId = this.queue;
      this.queue = null;
    }

    this.debugMsg(
      `transitionToStore: ${targetStoreId} - transition to store started`,
    );
    await this.runAnimation(
      targetStoreId,
      this.transitionType,
      false,
      true,
      token,
    );
    if (this.animationToken !== token) return;
    this.debugMsg(
      `transitionToStore: ${targetStoreId} - transition to store ended`,
    );
    this.isAnimating = false;

    if (this.queue) {
      this.debugMsg(`Run queued transition to ${this.queue}`);
      this.transitionToStore(this.queue);
      this.queue = null;
    }
    this.debugMsg(`----- End transition to ${storeId} -----`);
  }

  forceTransitionToLoopAnimation() {
    this.animationToken += 1;
    this.debugMsg("Force transition to loop animation");
    if (this.isAnimating) {
      this.cancelTransitionToStore(this.isAnimatingToStore);
    }
    this.runAnimation("loop", "immediately", true, true, this.animationToken);
  };
    

  debugMsg(...msg) {
    const now = new Date();
    if (this.debug)
      console.log(
        `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [Store Page Map] `,
        ...msg,
      );
  }
}
customElements.define("store-page-map", StorePageMap);

