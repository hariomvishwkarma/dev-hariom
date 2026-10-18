const dismisses = Array.from(document.querySelectorAll('[data-dismiss-target]'));

class Dismiss {
  constructor(dismissEl) {
    this.dismissEl = dismissEl;
    this.target = dismissEl.dataset.dismissTarget;
    this.targetEl = document.getElementById(this.target);
    this.init();
  }

  init() {
    if (this.targetEl) {
      this.checkTargetDismissState();
      this.setupEventListeners();
    } else {
      this.checkTargetDismissState;
    }
  }

  setupEventListeners() {
    const this1 = this;
    this1.dismissEl.addEventListener('click', function () {
      this1.targetEl.classList.add('hidden');
      sessionStorage.setItem(this1.target, 'hidden');
    });
  }

  checkTargetDismissState() {
    const dismissState = sessionStorage.getItem(this.target);
    if (!dismissState) {
      this.targetEl.classList.remove('hidden');
    }if(dismissState){
      this.targetEl.classList.add('hidden');
    }
  }
}

dismisses.forEach((dismiss) => {
  if (dismiss) {
    new Dismiss(dismiss);
  }
});
