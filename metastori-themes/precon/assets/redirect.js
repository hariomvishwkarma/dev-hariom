document.addEventListener('DOMContentLoaded', function () {
	const url = window.location.href;
	const baseUrl = window.location.origin;
	const currentProductHandle = url.includes('/products/') ? url.split('/products/')[1].split('?')[0] : null;
	const isGiftProduct =
		url.includes('/products/') && window.hiddenGifts?.some((handle) => currentProductHandle === handle);
	if (url.includes('/cart') || isGiftProduct) {
		window.location.href = baseUrl;
	}
});
