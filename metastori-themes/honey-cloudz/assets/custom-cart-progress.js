/**
 * Custom Cart — free shipping progress (smooth, no jitter).
 */
class CustomCartProgress {
  constructor(root) {
    this.root = root || document.querySelector('[data-custom-progress]');
    if (!this.root) return;

    this.fill = this.root.querySelector('[data-custom-progress-fill]');
    this.message = this.root.querySelector('[data-custom-progress-message]');
    this.track = this.root.querySelector('.custom-cart__progress-track');
    this.config = window.CustomCartUtils?.getConfig()?.progress || {};
    this._lastPercent = parseInt(this.root.dataset.percent, 10) || 0;

    this.syncFromRoot();
  }

  syncFromRoot() {
    if (!this.root) return;
    const percent = Math.min(100, Math.max(0, parseInt(this.root.dataset.percent, 10) || 0));
    this.applyPercent(percent, { animate: false });
  }

  applyPercent(value, { animate = true } = {}) {
    if (!this.root) return;

    if (!animate && this.fill) {
      this.fill.style.transition = 'none';
    }

    this.root.style.setProperty('--custom-cart-progress-percent', `${value}%`);

    if (this.fill) {
      this.fill.style.width = `${value}%`;
    }

    if (!animate && this.fill) {
      requestAnimationFrame(() => {
        if (this.fill) this.fill.style.transition = '';
      });
    }

    if (this.track) {
      this.track.setAttribute('aria-valuenow', value);
    }

    const remaining = parseInt(this.root.dataset.remaining, 10);
    const isComplete = value >= 100 || (Number.isFinite(remaining) && remaining <= 0);
    this.root.classList.toggle('custom-cart__progress--complete', isComplete);

    this.root.dataset.percent = value;
    this._lastPercent = value;
  }

  formatMoney(cents) {
    return window.CustomCartUtils.formatMoney(cents);
  }

  buildProgressMessage(remainingCents, complete) {
    if (complete) {
      return this.config.successMessage || '🐝 Yay, FREE shipping on us—perk for being part of the hive!';
    }
    const template = this.config.message || "You're [amount] away from unlocking FREE shipping (after discounts are applied!)";
    return template.replace('[amount]', this.formatMoney(Math.max(0, remainingCents)));
  }

  setPercent(percent, { animate = true, force = false } = {}) {
    const value = Math.min(100, Math.max(0, Math.round(percent)));
    if (!force && this._lastPercent === value) return;
    this.applyPercent(value, { animate });
  }

  updateFromDiscountedTotal(cartTotalCents) {
    if (!this.root) return;

    const threshold = parseInt(this.root.dataset.threshold, 10) || 0;
    if (!threshold) return;

    const total = Math.max(0, parseInt(cartTotalCents, 10) || 0);
    const remaining = threshold - total;
    const percent = Math.min(100, Math.max(0, Math.round((total * 100) / threshold)));
    const complete = remaining <= 0;

    this.root.dataset.total = String(total);
    this.root.dataset.remaining = String(remaining);

    if (this.message) {
      this.message.textContent = this.buildProgressMessage(remaining, complete);
    }

    this.root.classList.toggle('custom-cart__progress--complete', complete);
    this.setPercent(percent, { animate: true, force: true });
  }

  updateFromElement(el) {
    if (!el || !this.root) return;

    const percent = Math.min(100, Math.max(0, parseInt(el.dataset.percent, 10) || 0));
    const remaining = parseInt(el.dataset.remaining, 10) || 0;
    const complete = remaining <= 0 || percent >= 100;
    const previous = this._lastPercent ?? percent;
    const shouldAnimate = Math.abs(previous - percent) > 0 && Math.abs(previous - percent) < 80;

    this.root.dataset.remaining = String(remaining);
    this.root.dataset.total = el.dataset.total || '';
    this.root.dataset.threshold = el.dataset.threshold || '';
    this.root.dataset.percent = String(percent);

    if (el.style.cssText) {
      this.root.style.cssText = el.style.cssText;
    }

    this.root.classList.toggle('custom-cart__progress--complete', complete);
    this.setPercent(percent, { animate: shouldAnimate, force: true });

    const msgEl = el.querySelector('[data-custom-progress-message]');
    if (msgEl && this.message && this.message.textContent !== msgEl.textContent.trim()) {
      this.message.textContent = msgEl.textContent.trim();
    }
  }

  static init() {
    const root = document.querySelector('[data-custom-progress]');
    if (!root) return null;

    if (!window.__customCartProgressInstance) {
      window.__customCartProgressInstance = new CustomCartProgress(root);
    } else {
      const instance = window.__customCartProgressInstance;
      instance.root = root;
      instance.fill = root.querySelector('[data-custom-progress-fill]');
      instance.message = root.querySelector('[data-custom-progress-message]');
      instance.track = root.querySelector('.custom-cart__progress-track');
      instance.config = window.CustomCartUtils?.getConfig()?.progress || {};
    }

    return window.__customCartProgressInstance;
  }
}

window.CustomCartProgress = CustomCartProgress;

document.addEventListener('saw:cart-checked', (event) => {
  window.CustomCartUtils?.dedupeCartDrawerChrome?.(document.querySelector('[data-custom-cart]'));
  window.CustomCartUtils?.updateSavingsFromSaw?.(event.detail);

  const footer = document.querySelector('[data-custom-checkout]');
  if (footer) {
    footer.classList.toggle('is-saw-discounted', Boolean(window.saw_discount));
  }

  const cents = window.saw_discounted_total_cents;
  if (cents == null || Number.isNaN(cents)) return;

  const instance = CustomCartProgress.init();
  instance?.updateFromDiscountedTotal(cents);
});

document.addEventListener('cartdrawer:opened', () => {
  window.CustomCartUtils?.refreshWholesaleDiscount?.();
});
