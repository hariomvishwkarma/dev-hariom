;(function() {

	function init() {

		window.dataLayer = window.dataLayer || [];

		if(!("gtag" in window)) {
			window.gtag = function(){window.dataLayer.push(arguments);};
		}

		window.gtag("js", new Date());
		window.gtag("config", "");

		const Conversion = (function() {

			if(("Shopify" in window)
			 	&& typeof(window.Shopify) === "object"
				&& ("checkout" in window.Shopify)
				&& typeof(window.Shopify.checkout) === "object") {

				return {
					value : window.Shopify.checkout.total_price || 0.0,
					currency : window.Shopify.checkout.currency || "",
					transaction_id : window.Shopify.checkout.order_id || ""
				}

			}

			if(/(?:#|^|\/|&)codisto-simulate-conversion(?:\W|=|$)/.test(document.location.hash)) {

				const TestConversion = (function() {

					try {

						const match = document.location.hash.match(/codisto-simulate-conversion=([^&]*)/);
						if(match
							&& match[1]) {

							const TestConversion = JSON.parse(decodeURIComponent(match[1]));
							if(!("value" in TestConversion)) {
								TestConversion.value = 1;
							}
							if(!("currency" in TestConversion)) {
								TestConversion.currency = "USD";
							}
							if(!("transaction_id" in TestConversion)) {
								TestConversion.transaction_id = "#test1";
							}

							return TestConversion;

						}

					} catch(e) {

					}

					return {
						value : 1,
						currency : "USD",
						transaction_id : "#test1"
					};

				})();

				return TestConversion;

			}

			return null;

		})();

		if(Conversion) {

			window.gtag("event", "conversion", {
				'send_to' : "",
				'value' : Conversion.value,
				'currency' : Conversion.currency,
				'transaction_id' : Conversion.transaction_id
			});

		}

	}

	function load() {

		if(!("run" in load)) {

			if(!("dataLayer" in window)) {

				let hasScript = false;

				for(let i = 0; i < document.scripts.length; i++) {

					if(/^https:\/\/www.googletagmanager.com\/gtag\/js/.test(document.scripts[i].src)) {
						hasScript = true;
					}

				}

				if(!hasScript) {

					const script = document.createElement("script");
					script.setAttribute("async", "");
					script.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=");
					script.addEventListener("load", init);
					document.head.appendChild(script);

				} else {

					init();

				}

			} else {

				init();

			}

			load.run = true;

		}

	}

	if(document.readyState == "loading") {

		document.addEventListener("readystatechange", load);

	} else {

		load();

	}

})();
