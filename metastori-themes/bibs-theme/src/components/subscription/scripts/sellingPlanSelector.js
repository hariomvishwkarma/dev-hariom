if (!customElements.get('selling-plan-selector')) {
  const hiddenClass = 'shopify_subscriptions_app_block--hidden';
  const disabledClass = 'shopify_subscriptions_app_block--disabled';

  class SellingPlanSelector extends HTMLElement {
    constructor() {
      super();
    }

    async connectedCallback() {
      this.listenToOpenQuickAddModal();

      if (this.openQuickAddModal) {
        this.enableCartAddPerformanceObserver();
        this.hideShopifyWidget();
        return;
      }

      this.enableVariantPerformanceObserver();

      this.appendSellingPlanInputs();
      this.listenToVariantChange();

      if (!(this.regularPriceElement && this.salePriceElement)) {
        this.updatePrice = this.updateWidgetPrice;
        this.showInWidgetPriceElements();
        return;
      }
      this.updatePrice = this.updateThemePrice;
      this.updatePrice();
    }

    replaceContent(sectionContent) {
      if (sectionContent) this.innerHTML = sectionContent.innerHTML;
    }

    get inWidgetPriceElements() {
      return this.shopifySection.querySelectorAll('.shopify_subscriptions_in_widget_price');
    }

    showInWidgetPriceElements() {
      this.inWidgetPriceElements.forEach((inWidgetPriceElement) => inWidgetPriceElement.classList.remove(hiddenClass));
    }

    get shopifySection() {
      return this.closest('.section-product-form') || this.closest('.section-main-product-quick-view');
    }

    get variantSelector() {
      return this.shopifySection.querySelector('variant-selector');
    }

    get currentVariant() {
      if (this.variantSelector) return this.variantSelector.currentVariant;
    }

    get variantIdInput() {
      const variantIdInputEl = this.addToCartForms[0]?.querySelector(`input[name^="id"]`) || this.addToCartForms[0]?.querySelector(`select[name^="id"]`) || this.addToCartForms[1].querySelector(`input[name^="id"]`) || this.addToCartForms[1].querySelector(`select[name^="id"]`);
      return variantIdInputEl;
    }

    get priceElement() {
      return this.shopifySection.querySelector('.price');
    }

    get comparedAtPrice() {
      return this.shopifySection.querySelector('.price__sale');
    }

    get visibleSellingPlanForm() {
      if (this.variantIdInput?.value) return this.shopifySection.querySelector(`section[data-variant-id^="${this.variantIdInput.value}"]`);
    }

    get appBlockLabels() {
      if (!this.visibleSellingPlanForm) return;
      const fieldset = this.visibleSellingPlanForm.querySelector('fieldset');
      if (fieldset) return fieldset.querySelectorAll('.shopify_subscriptions_app_block_label');
    }

    get isVariantAvailable() {
      return this.selectedPurchaseOption.getAttributeNames().includes('disabled');
    }

    get sellingPlanInput() {
      return this.shopifySection.querySelector('.selected-selling-plan-id');
    }

    get addToCartForms() {
      return this.shopifySection.querySelectorAll('[action*="/cart/add"]');
    }

    appendSellingPlanInputs() {
      this.addToCartForms.forEach((addToCartForm) => {
        if (this.sellingPlanInput) addToCartForm.appendChild(this.sellingPlanInput.cloneNode());
      });
    }

    showSellingPlanForm(sellingPlanFormForSelectedVariant) {
      sellingPlanFormForSelectedVariant?.classList?.remove(hiddenClass);
      this.currentVariant?.available ? sellingPlanFormForSelectedVariant?.classList?.remove(disabledClass) : sellingPlanFormForSelectedVariant?.classList?.add(disabledClass);
    }

    hideSellingPlanForms(sellingPlanFormsForUnselectedVariants) {
      sellingPlanFormsForUnselectedVariants.forEach((element) => {
        element.classList.add(hiddenClass);
      });
    }

    handleSellingPlanFormVisibility() {
      const sellingPlanFormForSelectedVariant = this.shopifySection.querySelector(`section[data-variant-id="${this.variantIdInput.value}"]`);
      const sellingPlanFormsForUnselectedVariants = this.shopifySection.querySelectorAll(`.shopify_subscriptions_app_block:not([data-variant-id="${this.variantIdInput.value}"])`);
      this.showSellingPlanForm(sellingPlanFormForSelectedVariant);
      this.hideSellingPlanForms(sellingPlanFormsForUnselectedVariants);
    }

    handleVariantChange() {
      this.handleSellingPlanFormVisibility();
      this.listenToPurchaseTypeChange();
    }

    listenToVariantChange() {
      this.handleVariantChange();
      this.listenToAddToCartForms();
      if (this.variantIdInput.tagName === 'INPUT') {
        const variantIdObserver = new MutationObserver((mutationList) => {
          mutationList.forEach((mutationRecord) => {
            this.handleVariantChange(mutationRecord.target.value);
          });
        });

        variantIdObserver.observe(this.variantIdInput, {
          attributes: true,
        });
      }
    }

    listenToAddToCartForms() {
      this.addToCartForms.forEach((addToCartForm) => {
        addToCartForm.addEventListener('change', () => {
          this.handleVariantChange();
        });
      });
    }

    get salesBadge() {
      return this.shopifySection.querySelector('.badge.price__badge-sale');
    }

    get subscriptionsBadge() {
      return this.shopifySection.querySelector('.price__badge--subscription') ?? this.cloneSalesBadge();
    }

    cloneSalesBadge() {
      const subscriptionsBadgeText = document.getElementById('subscriptions_badge_text').innerHTML;
      const salesBadgeClone = this.salesBadge.cloneNode(true);
      salesBadgeClone.classList.add('price__badge--subscription');
      salesBadgeClone.innerHTML = subscriptionsBadgeText;
      this.salesBadge.parentNode.appendChild(salesBadgeClone);
      return salesBadgeClone;
    }

    showHideSubsSalesBadge(badge) {
      this.subscriptionsBadge.style.display = badge === 'subscription' ? 'inline-block' : 'none';
      this.salesBadge.style.display = badge === 'sale' ? 'inline-block' : 'none';
    }

    get regularPriceElement() {
      return this.shopifySection.querySelector('.price__regular');
    }

    get salePriceElement() {
      return this.shopifySection.querySelector('.price__sale');
    }

    get salePriceValue() {
      return this.salePriceElement.querySelector('.price-item--sale');
    }

    get regularPriceValue() {
      return this.salePriceElement.querySelector('.price-item--regular');
    }

    get sellingPlanAllocationPrice() {
      if (!this.selectedPurchaseOption) return null;
      return document.getElementById(`${this.selectedPurchaseOption.dataset.sellingPlanGroupId}_allocation_price`);
    }

    get selectedPurchaseOptionPrice() {
      return this.selectedPurchaseOption.dataset.variantPrice;
    }

    get selectedPurchaseOptionComparedAtPrice() {
      return this.selectedPurchaseOption.dataset.variantCompareAtPrice;
    }

    get price() {
      return this.sellingPlanAllocationPrices.price ?? null;
    }

    updateThemePrice() {
      if (!this.selectedPurchaseOption) return;
      const sellingPlanAdjustment = this.selectedPurchaseOption.dataset.sellingPlanAdjustment;

      if (!this.selectedPurchaseOptionComparedAtPrice || this.selectedPurchaseOptionComparedAtPrice === this.selectedPurchaseOptionPrice) {
        this.showRegularPrice();
        this.hideSalePrice();
        this.priceElement.classList.remove('price--on-sale');
      } else {
        this.showSalePrice();
        this.hideRegularPrice();
        this.priceElement.classList.add('price--on-sale');
      }

      if (this.salesBadge) {
        this.setBadgeValue(sellingPlanAdjustment);
      }
    }

    updateWidgetPrice() {
      if (this.sellingPlanAllocationPrice) {
        this.sellingPlanAllocationPrice.innerHTML = this.selectedPurchaseOptionPrice;
      }
    }

    hideSalePrice() {
      this.salePriceElement.style.display = 'none';
    }

    hideRegularPrice() {
      this.regularPriceElement.style.display = 'none';
    }

    showRegularPrice() {
      this.regularPriceElement.style.display = 'block';
      this.shopifySection.querySelector('.price__sale').style.display = 'none';
    }

    showSalePrice() {
      this.salePriceElement.style.display = 'block';
      this.regularPriceValue.innerHTML = this.selectedPurchaseOptionComparedAtPrice;
      this.salePriceValue.innerHTML = this.selectedPurchaseOptionPrice;
    }

    setBadgeValue(sellingPlanAdjustment) {
      if ((!this.selectedPurchaseOptionComparedAtPrice && !sellingPlanAdjustment) || this.isVariantAvailable) {
        this.showHideSubsSalesBadge('none');
      } else if ((sellingPlanAdjustment === '0' || !sellingPlanAdjustment) && this.selectedPurchaseOptionComparedAtPrice && this.selectedPurchaseOptionComparedAtPrice !== this.selectedPurchaseOptionPrice) {
        this.showHideSubsSalesBadge('sale');
      } else {
        this.showHideSubsSalesBadge('subscription');
      }
    }

    get sellingPlanInputs() {
      return this.shopifySection.querySelectorAll('.selected-selling-plan-id');
    }

    updateSellingPlanInputsValues() {
      this.sellingPlanInputs.forEach((sellingPlanInput) => {
        sellingPlanInput.value = this.sellingPlanInputValue;
      });
      if (this.sellingPlanInputValue) {
        const productList = this.activeBlockLabel.querySelector('.shopify_subscriptions_purchase_option_products_list');
        const productSlides = productList.querySelectorAll('.swiper-slide');

        productSlides.forEach((productSlide) => {
          const qtyInput = productSlide.querySelector('.quantity__input');
          if (qtyInput)
            qtyInput.addEventListener('change', () => {
              this.addProductVariantToCart(productSlide);
            });
          this.updateSelectedVariant(productSlide);
          const isTrigger = productSlide.classList.contains('product-card-quickadd');
          if (productSlide && isTrigger) {
            if (productSlide.dataset.initClickEvent) return;
            productSlide.addEventListener('click', (e) => onAddProductVariantToCart(e), false);
            productSlide.dataset.initClickEvent = true;
            const _this = this;
            function onAddProductVariantToCart(e) {
              const qtyInput = productSlide.querySelector('.quantity__input');
              if (productSlide.classList.contains('swiper-slide--added')) {
                if (!e.target.classList.contains('quantity__button') && !e.target.classList.contains('quantity__input') && !e.target.classList.contains('quantity__input-wrapper') && !e.target.classList.contains('quantity-input')) {
                  qtyInput.value = 0;
                }
              } else {
                qtyInput.value = 1;
              }

              _this.addProductVariantToCart(productSlide);
            }
          }
        });
      }
    }

    get sellingPlanInputValue() {
      return this.selectedPurchaseOption?.dataset.sellingPlanId ?? null;
    }

    get selectedPurchaseType() {
      if (this.visibleSellingPlanForm) return this.visibleSellingPlanForm.querySelector('input[type="radio"]:checked');
    }

    set selectedPurchaseType(selectedPurchaseType) {
      this._selectedPurchaseType = selectedPurchaseType;
    }

    get selectedPurchaseTypeIsSubscription() {
      if (this.selectedPurchaseType) return this.selectedPurchaseType.dataset.isSubscription === 'true' ? true : false;
      return false;
    }

    get selectedPurchaseOption() {
      return this.activeBlockLabel?.querySelector('select.purchase_option_selector option:checked');
    }

    set selectedPurchaseOption(selectedPurchaseOption) {
      this._selectedPurchaseOption = selectedPurchaseOption;
    }

    updateSelectedVariant(productSlide) {
      if (!this.variantIdInput) return;
      const jsonElement = productSlide.querySelector('[type="application/json"]');
      if (!jsonElement) return;
      const variantData = JSON.parse(jsonElement.textContent);

      const selectedVariant = this.getSelectedVariantForEachSlide(variantData);
      if (selectedVariant) {
        const sellingPlanAllocations = selectedVariant.selling_plan_allocations.map((allocation) => {
          return allocation.selling_plan_id;
        });

        if (sellingPlanAllocations.length > 0) {
          const sellingPlanAllocation = sellingPlanAllocations.find((allocation) => {
            return allocation == this.sellingPlanInputValue;
          });
          if (!sellingPlanAllocation) {
            productSlide.classList.add('!hidden');
          } else {
            productSlide.classList.remove('!hidden');
          }
        } else {
          productSlide.classList.add('!hidden');
        }

        productSlide.dataset.connectedVariantId = selectedVariant.id;
      } else {
        productSlide.classList.add('!hidden');
      }
    }

    getSelectedVariantForEachSlide(variantData) {
      const currentVariant = variantData.find((variant) => {
        const findings = !variant.options
          .map((option, index) => {
            return this.variantSelector.options[index] === option;
          })
          .includes(false);
        if (findings) return variant;
      });
      return currentVariant;
    }

    addProductVariantToCart(slide) {
      const selectedVariant = slide.dataset.connectedVariantId;
      const variantIdInput = document.createElement('input');
      const qtyInput = slide.querySelector('.quantity__input');
      variantIdInput.type = 'hidden';
      variantIdInput.name = `id[]`;
      variantIdInput.classList.add('shopify_subscriptions_variant_id');
      variantIdInput.value = selectedVariant;

      if (qtyInput.value > 0) {
        slide.classList.add('swiper-slide--added');
      } else {
        slide.classList.remove('swiper-slide--added');
      }

      if (this.addToCartForms.length > 0) {
        this.addToCartForms.forEach((addToCartForm) => {
          const mainVariant = addToCartForm.querySelector(`input[name="id[]"][required]`)?.value;
          const existingInput = addToCartForm.querySelectorAll(`input[name="id[]"].shopify_subscriptions_variant_id[value="${selectedVariant}"]`);
          //remove old qty
          existingInput?.forEach((input) => input.remove());
          //add new qty
          let qtyToAdd = qtyInput.value;
          if (mainVariant == selectedVariant) qtyToAdd = qtyToAdd - 1;
          if (qtyInput.value > 0) {
            for (let i = 0; i < qtyToAdd; i++) {
              addToCartForm.append(variantIdInput.cloneNode());
            }
          }
        });
      }
    }

    resetProductVariantInCart() {
      this.addToCartForms.forEach((addToCartForm) => {
        const variantIdInputs = addToCartForm.querySelectorAll(`input[name="id[]"].shopify_subscriptions_variant_id`);
        variantIdInputs.forEach((variantIdInput) => {
          variantIdInput.remove();
        });
      });
    }

    handlePurchaseTypeChange() {
      this.updateActiveBlockLabel(this.selectedPurchaseType);

      this.selectFirstPurchaseOption();
    }

    handlePurchaseOptionSelectorChange(purchaseOptionSelector) {
      this.selectedPurchaseOption = purchaseOptionSelector.querySelector('option:checked');
      this.updateSaveLabel();
      this.updateSellingPlanInputsValues();
      this.updatePrice();
    }

    selectFirstPurchaseOption() {
      const purchaseOptionSelector = this.activeBlockLabel.querySelector('select.purchase_option_selector');
      const firstPurchaseOption = purchaseOptionSelector.querySelector('option');

      if (firstPurchaseOption) {
        firstPurchaseOption.selected = true;
        this.selectedPurchaseOption = firstPurchaseOption;

        this.updateSaveLabel();
        this.updatePrice();
      }

      if (!purchaseOptionSelector.dataset.initChangeEvent) {
        purchaseOptionSelector.addEventListener('change', onPurchaseOptionSelectorChange, false);
        purchaseOptionSelector.dataset.initChangeEvent = true;
      }
      const _this = this;
      function onPurchaseOptionSelectorChange(e) {
        _this.handlePurchaseOptionSelectorChange(e.target);
      }
    }

    updateSaveLabel() {
      const saveLabel = this.activeBlockLabel.querySelector('.shopify_subscriptions_purchase_option_save_label');
      if (saveLabel) saveLabel.textContent = this.selectedPurchaseOption.dataset.sellingPlanAdjustmentValue;
    }

    toggleQuantityInput() {
      if (this.addToCartForms.length > 0) {
        this.addToCartForms.forEach((addToCartForm) => {
          const quantityInput = addToCartForm.querySelector('quantity-input');
          if (quantityInput) {
            const quantityInputEl = quantityInput.querySelector('[name="quantity"]');
            if (this.selectedPurchaseTypeIsSubscription) {
              quantityInput.classList.add('hidden');
              quantityInputEl.disabled = true;
            } else {
              quantityInput.classList.remove('hidden');
              quantityInputEl.disabled = false;
            }
          }
        });
      }
    }

    updateActiveBlockLabel(activeOption) {
      this.toggleQuantityInput();

      this.resetProductVariantInCart();

      if (!this.appBlockLabels) return;
      this.appBlockLabels.forEach((blockLabel) => {
        this.activeBlockLabel = activeOption.closest('.shopify_subscriptions_app_block_label');
        this.isSubscription = this.activeBlockLabel.querySelector('[data-is-subscription]')?.dataset.isSubscription;

        if (this.isSubscription == 'true') {
          const productList = this.activeBlockLabel?.querySelector('.shopify_subscriptions_purchase_option_products_list');
          const productSlides = productList?.querySelectorAll('.swiper-slide');

          productSlides.forEach((productSlide) => {
            this.addProductVariantToCart(productSlide);
          });
        }

        if (blockLabel === this.activeBlockLabel) {
          blockLabel.classList.add('active');
        } else {
          blockLabel.classList.remove('active');
        }
      });
      this.updateSellingPlanInputsValues();
    }

    listenToPurchaseTypeChange() {
      if (this.selectedPurchaseType) {
        this.updateActiveBlockLabel(this.selectedPurchaseType);
      }
      if (!this.visibleSellingPlanForm) return;
      const purchaseTypes = this.visibleSellingPlanForm.querySelectorAll('input[type="radio"]');
      purchaseTypes.forEach((purchaseType) => {
        if (purchaseType.dataset.initChangeEvent) return;
        purchaseType.addEventListener('change', onPurchaseTypeChange, false);
        purchaseType.dataset.initChangeEvent = true;
      });
      const _this = this;

      function onPurchaseTypeChange() {
        _this.handlePurchaseTypeChange();
      }
    }

    get shopifyBlocks() {
      return this.openQuickAddModal?.querySelectorAll('.shopify-block');
    }

    get shopifyAppBlock() {
      return this.querySelector('.shopify-app-block');
    }

    hideShopifyWidget() {
      this.shopifyBlocks?.forEach((element) => {
        element.classList.add(hiddenClass);
      });
    }

    get quickAddModals() {
      return Array.from(document.querySelectorAll('.quick-add-modal__content-info'));
    }

    get openQuickAddModal() {
      return this.quickAddModals.find((quickAddModal) => quickAddModal.hasChildNodes());
    }

    get errorMessageElements() {
      return this.openQuickAddModal?.querySelectorAll('.product-form__error-message');
    }

    get quickAddErrorMessage() {
      return document.querySelector('#shopify_subscriptions_app_block_error_message');
    }

    toggleQuickAddErrorMessage() {
      this.errorMessageElements?.forEach((errorMessageElement) => {
        this.quickAddErrorMessage.classList.remove(hiddenClass);
        errorMessageElement.replaceWith(this.quickAddErrorMessage);
      });
    }

    enableVariantPerformanceObserver() {
      const variantPerformanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.initiatorType !== 'fetch') return;

          const url = new URL(entry.name);
          // When the variant changes, the price is updated via a fetch request - update the price to reflect the selected selling plan price
          if (url.search.includes('variant') || url.search.includes('variants')) {
            this.updatePrice();
          }
          // When clicking "Add to cart", update the selling-plans-only error message for the quick add modal
          if (url.pathname.includes('/cart/add')) this.toggleQuickAddErrorMessage();
        });

        variantPerformanceObserver.observe({ entryTypes: ['resource'] });
      });
    }

    enableCartAddPerformanceObserver() {
      const cartAddperformanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.initiatorType !== 'fetch') return;
          const url = new URL(entry.name);
          if (url.pathname.includes('/cart/add')) this.toggleQuickAddErrorMessage();
        });
      });

      cartAddperformanceObserver.observe({ entryTypes: ['resource'] });
    }

    listenToOpenQuickAddModal() {
      const quickAddModalObserver = new MutationObserver((mutationList) => {
        mutationList.forEach(() => {
          this.hideShopifyWidget();
        });
      });

      this.quickAddModals.forEach((quickAddModal) => {
        quickAddModalObserver.observe(quickAddModal, {
          childList: true,
        });
      });
    }
  }

  customElements.define('selling-plan-selector', SellingPlanSelector);
}
