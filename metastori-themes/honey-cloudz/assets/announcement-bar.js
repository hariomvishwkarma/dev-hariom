class AnnouncementBar extends HTMLElement {
  constructor() {
    super();

    if (this.dataset.blockCount == 1) {
      return;
    }

    if (theme.config.mqlSmall || this.dataset.compact == 'true') {
      this.initSlider();
    }
    else {
      this.handleMarquee();
    }

    document.addEventListener('matchSmall', () => {
      this.unload();
      this.initSlider();
    });

    document.addEventListener('unmatchSmall', () => {
      this.unload();

      if (this.dataset.compact === 'true') {
        this.initSlider();
      }
      else {
        this.handleMarquee();
      }
    });
  }

  unload() {
    if (this.flickity && typeof this.flickity.destroy === 'function') {
      this.flickity.destroy();
      this.resetProgressbar();
      this.removeListeners();
    }
  }

  initSlider() {
    this.isPaused = false;
    this.forcePaused = false;
    this.duration = parseInt(this.dataset.autorotateSpeed);
    this.interval = 10;

    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');
    this.playButton = this.querySelector('button[name="play"]');

    setTimeout(() => {
      this.flickity = new Flickity(this.querySelector('.announcement-slider'), {
        accessibility: false,
        rightToLeft: theme.config.rtl,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: true,
        setGallerySize: false,
      });

      this.flickity.on('change', () => {
        !this.isPaused && this.startProgressbar();
      });
    });

    this.onButtonClick = this.onButtonClick.bind(this);
    this.prevButton && this.prevButton.addEventListener('click', this.onButtonClick);
    this.nextButton && this.nextButton.addEventListener('click', this.onButtonClick);
    this.playButton && this.playButton.addEventListener('click', this.onButtonClick);
    this.addEventListener('slider:paused', this.onSliderPaused);
    
    this.startProgressbar();
    new IntersectionObserver(this.handleIntersection.bind(this)).observe(this);

    if (this.dataset.autorotate !== 'true') {
      this.setForcePaused(true);
    }
  }

  removeListeners() {
    this.prevButton && this.prevButton.removeEventListener('click', this.onButtonClick);
    this.nextButton && this.nextButton.removeEventListener('click', this.onButtonClick);
    this.playButton && this.playButton.removeEventListener('click', this.onButtonClick);
    this.removeEventListener('slider:paused', this.onSliderPaused);
  }

  onSliderPaused(event) {
    this.setAttribute('data-paused', event.detail.paused);
  }

  onButtonClick(event) {
    event.preventDefault();
    const target = event.currentTarget;
    
    if (target.name === 'next') {
      this.flickity && this.flickity.next();
    }
    else if (target.name === 'previous') {
      this.flickity && this.flickity.previous();
    }
    else {
      this.setForcePaused(!this.forcePaused);
    }
  }

  setForcePaused(paused) {
    this.forcePaused = paused;
    this.setPaused(paused);
  }

  setPaused(paused) {
    this.isPaused = paused;

    const event = new CustomEvent('slider:paused', {
      detail: {
        paused: paused
      }
    });
    this.dispatchEvent(event);
  }

  resetProgressbar() {
    this.style.setProperty('--progress-width', '0%');
    clearTimeout(this.tick);
  }

  startProgressbar() {
    this.resetProgressbar();
    this.setForcePaused(false);
    this.percentTime = 0;
    this.tick = window.setInterval(this.increase.bind(this), this.interval);
  }

  increase() {
    if (!this.isPaused) {
      this.step = (this.duration * 1000) / this.interval;
      this.percentTime += 100 / this.step;
      this.style.setProperty('--progress-width', `${this.percentTime}%`);

      if (this.percentTime >= 100) {
        this.flickity && this.flickity.next();
        this.startProgressbar();
      }
    }
  }

  handleIntersection(entries, _observer) {
    if (entries[0].isIntersecting) {
      !this.forcePaused && this.setPaused(false);
    }
    else {
      this.setPaused(true);
    }
  }

  handleMarquee() {
    setTimeout(() => {
      this.marqueeAnimation();
      
      // pause when out of view
      const observer = new IntersectionObserver((entries, _observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isAnimated && this.classList.remove('marquee--paused');
          } else {
            this.isAnimated && this.classList.add('marquee--paused');
          }
        });
      }, {rootMargin: '0px 0px 50px 0px'});

      observer.observe(this);
    });

    window.addEventListener('resize', this.marqueeAnimation.bind(this));
  }

  marqueeAnimation() {
    const text = this.querySelector('.announcement-slider');
    const width = text.scrollWidth;

    if (width > this.clientWidth) {
      if (!this.isAnimated) {
        const config = {
          moveTime: 2, // 100px going to move for
          space: 100, // 100px
        };

        for (let index = 0; index < 2; index++) {
          const clone = text.cloneNode(true);
          this.appendChild(clone);
        }
        
        this.classList.add('marquee');
        this.style.setProperty('--duration', `${(width / config.space) * config.moveTime}s`);
        this.isAnimated = true;
      }
    }
    else if (this.isAnimated) {
      for (let index = 0; index < 2; index++) {
        this.removeChild(this.lastElementChild);
      }
      this.classList.remove('marquee');
      this.isAnimated = false;
    }
  }
}
customElements.define('announcement-bar', AnnouncementBar);
