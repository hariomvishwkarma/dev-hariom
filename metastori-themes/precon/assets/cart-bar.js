if (!customElements.get('cart-bar')) {
	class CartBar extends HTMLElement {
		connectedCallback() {
			document.documentElement.addEventListener('cart:updated', this._onCartUpdated.bind(this));
		}
		get threshold() {
			return parseFloat(this.getAttribute('threshold'));
		}
		get offset() {
			return this.hasAttribute('offset') ? parseFloat(this.getAttribute('offset')) : 0;
		}
		calcProgress(event) {
			const cart = event.detail['cart'];
			let totalPrice = cart['items']
				.filter((item) => item['requires_shipping'])
				.reduce((sum, item) => sum + item['final_line_price'], 0);
			const discountApps = cart['cart_level_discount_applications'] || [];
			for (let i = 0; i < discountApps.length; i++) {
				totalPrice -= discountApps[i]['total_allocated_amount'] || 0;
			}
			if (totalPrice >= this.threshold) {
				return 1;
			}
			return Math.min(parseFloat(totalPrice) / (this.threshold + this.offset), 1);
		}
		_onCartUpdated(event) {
			this.style.setProperty('--progress', this.calcProgress(event));
		}
	}
	window.customElements.define('cart-bar', CartBar);
}
