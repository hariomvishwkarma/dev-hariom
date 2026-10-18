class NotifySoldOut extends HTMLElement {
	connectedCallback() {
		this.addEventListener('click', this.init);
	}

	async init() {
		const successMessage = this.querySelector('#notify__success');
		const notifyButton = this.querySelector('#notify-button');
		const errorMessage = this.querySelector('#notify__error');
		const isLoggedIn = window.customer?.isLoggedIn === true;

		if (notifyButton && isLoggedIn) {
			const variantId = this.dataset.variant_id;
			const newsletterEl = this.querySelector('#Subscribe-newsletter');
			const newsletter = newsletterEl ? newsletterEl.checked : false;

			try {
				const domain = window.shop.domain || null;
				const response = await fetch(`https://api-bibs.netlify.app/.netlify/functions/backInStock?store=${domain}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: window.customer.email,
						variantId: variantId,
						newsletter: newsletter
					})
				});

				if (response.status === 200 || response.status === 201) {
					if (successMessage) {
						successMessage.classList.add('block');
						successMessage.classList.remove('hidden');
					}
					if (errorMessage) {
						errorMessage.classList.add('hidden');
						errorMessage.classList.remove('block');
					}
				}
			} catch (error) {
				console.log('🚀 ~ error:', error);

				if (successMessage) {
					successMessage.classList.add('hidden');
					successMessage.classList.remove('block');
				}
				if (errorMessage) {
					errorMessage.classList.add('block');
					errorMessage.classList.remove('hidden');
				}

				return null;
			}
		}
	}
}

customElements.define("notify-sold-out", NotifySoldOut);