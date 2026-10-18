class SellingPlans extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('change', this.onSellingPlanChange);
    }

    onSellingPlanChange(event) {
        this.updateOptions();

        if (event.target.closest('.c-radio') && event.target.closest('.c-radio').querySelector('.loading-overlay__spinner')) {
            event.target.closest('.c-radio').querySelector('.loading-overlay__spinner').classList.remove('hidden');
        }

        this.updateSellingPlanInput();
        this.updateURL();
        this.renderProductInfo(event);
    }

    updateOptions() {
        this.sellingPlan = Array.from(this.querySelectorAll('select'), (select) => select.value);
        this.purchaseType = Array.from(this.querySelectorAll('input')).find((radio) => radio.checked).value;
        if (this.purchaseType == 'Subscribe & Save') {
            this.subscription = true;
        } else {
            this.subscription = false;
        }


        if (this.dataset.variant) {
            this.isVariant = true;
        }

        if (this.subscription) {
            if (this.isVariant) {
                this.url = `${this.dataset.url}&selling_plan=${this.sellingPlan[0]}&`;
                this.url = `${this.dataset.url}&selling_plan=${this.sellingPlan[0]}&`;
            } else {
                this.url = `${this.dataset.url}?selling_plan=${this.sellingPlan[0]}&`;
                this.url = `${this.dataset.url}?selling_plan=${this.sellingPlan[0]}&`;
            }
        } else {
            if (this.isVariant) {
                this.url = `${this.dataset.url}&`
            } else {
                this.url = `${this.dataset.url}?`
            }
        }
    }

    updateURL() {
        if (!this.sellingPlan || this.dataset.updateUrl === 'false') return;
        window.history.replaceState({}, '', `${this.url}`);
    }

    updateSellingPlanInput() {
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}`);
        productForms.forEach((productForm) => {
            const input = productForm.querySelector('input[name="selling_plan"]');
            if (input) {
                if (this.subscription) {
                    input.value = this.sellingPlan[0];
                } else {
                    input.value = null;
                }
                input.dispatchEvent(new Event('change', { bubbles: true }));

            }
        });
    }

    removeErrorMessage() {
        const section = this.closest('section');
        if (!section) return;

        const productForm = section.querySelector('product-form');
        if (productForm) productForm.handleErrorMessage();
    }

    renderProductInfo(event) {


        fetch(`${this.url}section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
            .then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html')
                const destination = document.getElementById(`price-${this.dataset.section}`);
                const destinationSellingPlan = document.getElementById(`selling-plan-${this.dataset.section}`);

                const productForm = document.getElementById(`product-form-${this.dataset.section}`);
                console.log('productForm', productForm);

                if (!html.querySelector('.subscription-with-variants')) {
                    const source = html.getElementById(`price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
                    if (source && destination) destination.innerHTML = source.innerHTML;
                    const price = document.getElementById(`price-${this.dataset.section}`);
                    if (document.getElementById(`add-to-cart-price-${this.dataset.section}`)) {
                        document.getElementById(`add-to-cart-price-${this.dataset.section}`).innerHTML = price.querySelector('.price-inline').innerHTML;
                    }

                    if (document.getElementById(`product-form-${this.dataset.section}`)) {
                        const productFormSource = html.getElementById(`product-form-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);

                        console.log('productFormSource', productFormSource)
                        console.log(this.dataset.section)
                        console.log(document.getElementById(`product-form-${this.dataset.section}`));
                      
                        
                        console.log(this.dataset.section)
                        console.log(document.getElementById(`product-form-${this.dataset.section}`));

                        document.getElementById(`product-form-${this.dataset.section}`).innerHTML = productFormSource.innerHTML;
                    }
                    if (price) price.classList.remove('visibility-hidden');
                }

                const sourceSellingPlan = html.getElementById(`selling-plan-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
                if (sourceSellingPlan && destinationSellingPlan) destinationSellingPlan.outerHTML = sourceSellingPlan.outerHTML;

                this.toggleAddButton(false, window.variantStrings.soldOut);

                if (event.target.closest('.c-radio') && event.target.closest('.c-radio').querySelector('.loading-overlay__spinner')) {
                    event.target.closest('.c-radio').querySelector('.loading-overlay__spinner').classList.add('hidden');
                }
            })
            .catch((e) => {
                console.error(e);
            });;
    }

    toggleAddButton(disable = true, text, modifyClass = true) {
        const productForm = document.getElementById(`product-form-${this.dataset.section}`);
        if (!productForm) return;
        const addButton = productForm.querySelector('[name="add"]');
        const addButtonText = productForm.querySelector('[name="add"] > span');
        if (!addButton) return;

        if (disable) {
            addButton.setAttribute('disabled', 'disabled');
            if (text) addButtonText.textContent = text;
        } else {
            addButton.removeAttribute('disabled');
            addButtonText.textContent = window.variantStrings.addToCart;
        }

        if (!modifyClass) return;
    }

    setUnavailable() {
        const button = document.getElementById(`product-form-${this.dataset.section}`);
        const addButton = button.querySelector('[name="add"]');
        const addButtonText = button.querySelector('[name="add"] > span');
        const price = document.getElementById(`price-${this.dataset.section}`);
        if (!addButton) return;
        addButtonText.textContent = window.variantStrings.unavailable;
        if (price) price.classList.add('visibility-hidden');
    }
}

customElements.define('selling-plans', SellingPlans);


class SellingPlanToggle extends HTMLElement {
    constructor() {
        super();
        console.log('SellingPlanToggle init');
        this.addEventListener('change', this.onSellingPlanChange);
    }

    onSellingPlanChange(event) {
        console.log('this', this)
        this.updateOptions();
        this.updateSellingPlanInput();
    }

    updateOptions() {
        this.sellingPlan = Array.from(this.querySelectorAll('select'), (select) => select.value);
    }

    updateSellingPlanInput() {
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}`);
        console.log('productForms', productForms)
        productForms.forEach((productForm) => {
            const input = productForm.querySelector('input[name="selling_plan"]');
            input.value = this.sellingPlan[0];
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }
}

customElements.define('selling-plan-toggle', SellingPlanToggle);