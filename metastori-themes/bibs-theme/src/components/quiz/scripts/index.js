import { debounce } from "../../../scripts/utils/debounce";

if (!customElements.get('quiz')) {
  class Quiz extends HTMLElement {
    constructor() {
      super();

      this.totalQuestions = this?.dataset?.totalQuestions;
      if (!this.totalQuestions) return;
      this.totalQuestions = Number(this.totalQuestions);
      if (Number.isNaN(this.totalQuestions))
        throw new Error(`Quiz: invalid totalQuestions "${this.totalQuestions}"`);

      this.stepWrappers = document.querySelectorAll('.quiz__container');
      this.questionWrappers = document.querySelectorAll('.quiz__question');
      this.resultCollectionId = this.getAttribute('data-result-collection');
      if (!this.resultCollectionId)
        throw new Error("Quiz: data-result-collection is required");

      this.stepProgressEl = this.querySelector('.quiz__step-progress');
      if (!this.stepProgressEl)
        throw new Error("Quiz: .quiz__step-progress not found");

      this.progressSteps = [...this.stepProgressEl.children];

      this.onTouchMove = this.onTouchMove.bind(this);
      this.onTouchEnd = this.onTouchEnd.bind(this);

      this.setEventListeners();
    }

    setEventListeners() {
      this.setAnswerListeners();
      this.setNavButtonListeners();
      this.setColorPickerListeners();
    }

    setActiveStep(newStep) {
      this.clearActiveSteps();
      newStep?.classList.add('current-step');
    }

    clearActiveSteps() {
      this.stepWrappers.forEach(step => step.classList.remove('current-step'));
    }

    clearProgressSteps() {
      this.progressSteps.forEach(step => {
        step.classList.remove('active');
      });
    }

    snapToTheNearestColor() {
      this.colors[this.nearestColorIndex - 1].click();
    }

    updateMarkerPosition(x) {
      x = Number(x);
      if (Number.isNaN(x)) return;

      const distanceFromLeft = this.dragType === 'mouse' ?
        this.colorPicker?.closest('.quiz__step-wrapper')?.getBoundingClientRect().left : 0;
      const rect = this.colorPicker.getBoundingClientRect();

      let newX = Math.max(0, Math.min(x - rect.left, rect.width));
      this.marker.style.left = `${newX + rect.left - distanceFromLeft}px`;

      // Find nearest color
      const sectionWidth = rect.width / (this.colors?.length);
      let index = Math.ceil((newX) / sectionWidth);
      this.nearestColorIndex = index;
    }

    getEventNames(pointerType) {
      switch (pointerType) {
        case 'touch':
          return {
            down: 'touchstart',
            move: 'touchmove',
            up: 'touchend'
          };
        default:
          return {
            down: 'mousedown',
            move: 'mousemove',
            up: 'mouseup'
          };
      }
    }

    onTouchMove(e) {
      e.preventDefault();
      const clientX = e.touches ? e.touches[0]?.clientX : e?.clientX;

      if (Math.abs(clientX - this.startX) > this.dragThreshold) {
        this.isDragging = true;
        this.colorStep?.classList.add('is-dragging');
        this.updateMarkerPosition(clientX);
      }
    }

    onTouchEnd(e) {
      this.colorPicker?.removeEventListener(this.dragEvents.move, this.onTouchMove);
      this.colorPicker?.removeEventListener(this.dragEvents.up, this.onTouchEnd);

      if (this.isDragging) {
        this.colorStep?.classList.remove('is-dragging');
        this.snapToTheNearestColor();
      }
    }

    initColorPickerMotion(e) {
      this.startX = e.touches ? e.touches[0]?.clientX : e.clientX;
      this.isDragging = false;

      this.colorPicker?.addEventListener(this.dragEvents.move, this.onTouchMove);
      this.colorPicker?.addEventListener(this.dragEvents.up, this.onTouchEnd);
    }

    setColorPickerListeners() {
      this.colorStep = document.querySelector('.quiz__question--color');
      this.marker = this.colorStep?.querySelector('.mobile-color-marker');
      if (!this.colorStep || !this.marker) return;

      this.colorPicker = this.colorStep.querySelector('.quiz__question__answers');
      this.colors = this.colorPicker?.querySelectorAll(':scope > .quiz__answer');
      this.isDragging = false;
      this.dragThreshold = 5;

      ['mousedown', 'touchstart'].forEach(eventName => {
        this.colorPicker?.addEventListener(eventName, (e) => {
          this.dragEvents = eventName === 'touchstart'
            ? this.getEventNames('touch') : this.getEventNames('mouse');

          this.dragType = eventName === 'touchstart' ? 'touch' : 'mouse';

          this.initColorPickerMotion(e);
        });
      });
    }

    setNavButtonListeners() {
      const continueButtons = document.querySelectorAll('.quiz__button');

      continueButtons.forEach(button => {
        let skipButton = button.classList.contains('quiz__button--skip');
        const currentStepContainer = button.closest('.quiz__container');
        const questionSkipButton = currentStepContainer?.querySelector('.quiz__button--skip');
        let currentStep = currentStepContainer?.dataset?.stepNo;
        if (!currentStep) return;

        currentStep = Number(currentStep);

        button.addEventListener('click', () => {
          if (skipButton) {
            const selectedValueInput = button.closest('.quiz__step-wrapper')?.querySelector('.quiz__selected-value');
            selectedValueInput?.setAttribute('value', '');
          }

          if (!questionSkipButton) {
            const selectedFilterInputs = currentStepContainer?.querySelectorAll('.quiz__selected-value');
            const noFiltersSelected = selectedFilterInputs.length < 1;

            if (noFiltersSelected && currentStep > 0) {
              button.classList.add('show-error');
              return;
            } else {
              button.classList.remove('show-error');
            }
          }
          const nextStepWrapper = currentStep < this.totalQuestions ?
            document.querySelector(`[data-step-no*="${currentStep + 1}"]`) : this.redirectToResult();

          this.currentStep = currentStep + 1;
          this.setAttribute('data-current-step', this.currentStep);

          this.clearProgressSteps();
          this.progressSteps[currentStep]?.classList.add('active');

          if (!nextStepWrapper) return;
          this.setActiveStep(nextStepWrapper);
        })
      });


      const backButton = document.querySelector('.quiz__button--back');

      backButton?.addEventListener('click', () => {
        let currentStep = document.querySelector('.current-step')?.dataset?.stepNo;
        if (!currentStep) return console.error("Quiz: no current-step found");
        currentStep = Number(currentStep);

        if (Number.isNaN(currentStep))
          return console.error("Quiz: invalid stepNo", currentStep);

        this.currentStep = currentStep - 1;
        this.setAttribute('data-current-step', this.currentStep ? this.currentStep : 'intro');

        this.clearProgressSteps();

        if (this.currentStep > 0) this.progressSteps[this.currentStep - 1].classList.add('active');

        if (!currentStep || currentStep == '0') {
          window.location.href = '/';

        } else {
          Number(currentStep);
        }

        const prevStepWrapper = document.querySelector(`[data-step-no*="${currentStep - 1}"]`);
        this.setActiveStep(prevStepWrapper);
      });

      const closeQuizButton = document.querySelector('.quiz__button--close');

      closeQuizButton?.addEventListener('click', () => {
        window.location.href = '/';
      });
    }

    setAnswerListeners() {
      const answers = document.querySelectorAll('.quiz__answer');
      const mobileColorInstruction = document.querySelector('.mobile-color-instruction');

      // Set initial color instruction
      const firstColor = [...answers].find(answer => answer.classList.contains('not-selected-color'));
      if (firstColor) mobileColorInstruction.innerHTML = firstColor.outerHTML;

      answers.forEach(answer => {
        const colorStepContainer = answer.closest('.quiz__question--color');
        const initTextColor = colorStepContainer?.style?.getPropertyValue('--text-color');
        const isColorStep = Boolean(colorStepContainer);
        const isMultipleChoicesAllowed = answer.closest('[data-multiple-choices-allowed]');
        const stepWrapper = answer.closest('.quiz__step-wrapper');
        const thisQuestionAnswers = stepWrapper?.querySelectorAll('.quiz__answer');
        const templateInputAnswer = stepWrapper.querySelector("#quiz__selected-value-template");
        const inputAnswerSelectedValue = templateInputAnswer.content.cloneNode(true)?.querySelector('.quiz__selected-value');
        const answerValue = answer.dataset.filterValue;

        const isSelected = (answer) => answer?.classList.contains('selected');

        answer.addEventListener('click', () => {
          if (isColorStep) handleColorStep.call(this, answer);
          else handleRegularStep(answer);
        })

        function handleColorStep(answer) {
          // If not selected -> select
          if (!isSelected(answer)) {
            clearSelections(thisQuestionAnswers, false);
            answer.classList.add('selected');
            mobileColorInstruction.innerHTML = answer.outerHTML;
            updateUIColor.call(this, answer);
            return;
          }

          // If selected -> handle color toggle
          toggleColorSelection(answer);

          mobileColorInstruction.innerHTML = answer.outerHTML;
        }

        function updateUIColor(answer) {
          colorStepContainer.style.setProperty('--background-color', answer.dataset.bgColor);
          colorStepContainer.style.setProperty('--highlight-color', answer.dataset.highlightColor);
          colorStepContainer.style.setProperty('--text-color', answer.dataset.textColor ? answer.dataset.textColor : initTextColor);
          this.style.setProperty('--text-color', answer.dataset.textColor ? answer.dataset.textColor : initTextColor);
        }

        function toggleColorSelection(answer) {
          if (!inputAnswerSelectedValue.value) {
            inputAnswerSelectedValue.value = answerValue;
            const clonedInput = inputAnswerSelectedValue?.cloneNode(true);
            stepWrapper?.prepend(clonedInput);
            answer.classList.add('selected-color');
            answer.classList.remove('not-selected-color');
          } else {
            if (answer.classList.contains('not-selected-color')) {
              addColorSelection(answer);
            } else {
              inputAnswerSelectedValue.value = '';
              removeColorSelection(answer);
            }
          }
        }

        function addColorSelection(answer) {
          answer.classList.add('selected-color');
          answer.classList.remove('not-selected-color');
        }

        function removeColorSelection(answer) {
          answer.classList.remove('selected-color');
          answer.classList.add('not-selected-color');

          const targetInput = stepWrapper?.querySelector(`[value=${answerValue}]`);
          targetInput?.remove();
        }

        function handleRegularStep(answer) {
          if (isMultipleChoicesAllowed) toggleMultipleChoice(answer);
          else selectSingleAnswer(answer);
        }

        function selectSingleAnswer(answer) {
          if (isSelected(answer)) {
            clearSelections([answer]);
          } else {
            clearSelections(thisQuestionAnswers);
            addSelection(answer);
          }
        }

        function clearSelections(answers, removeInput = true) {
          answers.forEach((answer) => {
            answer.classList.remove("selected");

            if (!removeInput) return;

            const targetInput = stepWrapper?.querySelector(`[value="${answer.dataset.filterValue}"]`);
            targetInput?.remove();
          });
        }

        function addSelection(answer) {
          answer?.classList.add('selected');

          const clonedInput = inputAnswerSelectedValue?.cloneNode(true);
          clonedInput.value = answerValue;
          stepWrapper?.prepend(clonedInput);
        }

        function toggleMultipleChoice(answer) {
          const openToEverything = stepWrapper?.querySelector(`[data-filter-value=""]`);
          const isAlreadySelected = isSelected(answer);

          if (isSelected(openToEverything)) {
            clearSelections([openToEverything]);
          }

          if (isAlreadySelected) clearSelections([answer]);
          if (!isAlreadySelected) {
            if (!answerValue) {
              // if answer value is empty it means they are open to everything
              // Remove all other selected answers and input filters
              clearSelections(thisQuestionAnswers);
            }

            addSelection(answer);
          }
        }
      })
    }

    redirectToResult() {
      const delay = this.dataset.quizDelay ? Number(this.dataset?.quizDelay) : 10000;
      const delayContainer = document.querySelector('.quiz__redirection-view');

      const resultURL = this.getFilterURL();

      delayContainer?.classList.add('active');
      setTimeout(() => {
        window.location.href = resultURL;
      }, delay)
    }

    getFilterURL() {
      let urlString = '/collections/' + this.resultCollectionId + '?sort_by=title-ascending';
      this.questionWrappers.forEach(question => {
        const allSelectedAnswers = question.querySelectorAll('.quiz__selected-value');

        allSelectedAnswers.forEach(selected => {
          const filterName = selected.name;
          const filterValue = selected.value;

          if (filterValue) {
            urlString += `&${filterName}=${filterValue}`
          }
        })
      });

      return urlString + "&quiz_name=" + this.dataset.quizHandle + `&quiz_location=${window.location.pathname}`;
    }
  }

  customElements.define('custom-quiz', Quiz);
}

if (!customElements.get('custom-result-quiz')) {
  class QuizResult extends HTMLElement {

    constructor() {
      super();
      this.buildUI();
    }

    handleHeaderPositioning() {
      const header = document.querySelector('.shopify-section-group-header-group.section-header');
      document.body.prepend(header);
    }

    buildUI() {
      const container = document.createElement('div');

      const body = document.body;
      const resultDescription = this.querySelector('.quiz-result__description');
      const bgColor = this.dataset.bgColor;
      const secondaryBgColor = this.dataset.secondaryBgColor;
      const highlight = this.dataset.highlightColor
      const productMatchingName = this.dataset.matchProdName;

      if (bgColor) body.style.setProperty('--result-bg-color', bgColor);
      if (secondaryBgColor) container.style.setProperty('--result-secondary-bg-color', secondaryBgColor);
      if (highlight) container.style.setProperty('--highlight', highlight);

      while (body.firstChild) container.appendChild(body.firstChild);

      body.appendChild(container);
      body.classList.remove('quiz-result-container');
      container.classList.add('quiz-result-container');
      if (productMatchingName && resultDescription) {
        resultDescription.innerHTML = resultDescription.innerText.replace('{{ product_name }}', productMatchingName);
      }

      const filter = document.querySelector('#FilteringAndSorting .drawer-filter-button');
      const shopAllText = this.dataset.shopAllText;
      const shopAll = document.createElement('a');
      shopAll.href = '/collections/all';
      shopAll.innerHTML = shopAllText;
      shopAll.classList.add('quiz-result__shop-all-btn');
      filter?.replaceWith(shopAll);

      const shareButton = this.querySelector('.quiz-result__share-btn');
      const originalText = shareButton?.innerHTML;
      const copiedMessageTemplate = this.querySelector('.copied-result-link-message');
      const url = window.location.href;
      shareButton?.addEventListener('click', () => {
        navigator.clipboard.writeText(url)
          .then(() => {
            shareButton.innerHTML = copiedMessageTemplate?.innerHTML;

            setTimeout(() => {
              shareButton.innerHTML = originalText;
            }, 1000)
          })
      });

      const addToCartBtn = this.querySelector('[data-add-to-cart]');
      const matchProductQuickViewBtn = this.querySelector('.product-quickview-button');
      addToCartBtn?.addEventListener('click', () => {
        matchProductQuickViewBtn.click();
      })

      const shopCollectionTitle = this.querySelector('#shop-collection')?.cloneNode(true);
      shopCollectionTitle.id = 'shop-collection-filter';
      const filterAndSortContainer = document.querySelector('.filter-and-sorting-container');
      filterAndSortContainer?.prepend(shopCollectionTitle);

      this.filterColors = this.dataset.matchFilterColors?.trim()?.split(' ');
      this.filterColors = new URL(url).searchParams.getAll("filter.p.m.accentuate.color");
      let selector = '.result-quiz-product-cp > product-card';
      selector = selector + this.filterColors?.map(color => `:not(.${color}-color)`).join('');
      let matchingCP = this.querySelectorAll(selector);

      matchingCP.forEach(cp => cp.remove());

      this.productPreviewCPContainer = this.querySelector('.result-quiz-product-cp');
      this.productPreviewConnectedProducts = [...this.productPreviewCPContainer?.querySelectorAll('product-card')];

      matchingCP = this.productPreviewConnectedProducts?.splice(4);
      matchingCP.forEach(cp => cp.remove());

      if (this.productPreviewConnectedProducts) {
        window.addEventListener('load', debounce(this.setEqualHeight.bind(this), 150));
        window.addEventListener('resize', debounce(this.setEqualHeight.bind(this), 150));
      }

      this.handleHeaderPositioning();
    }

    setEqualHeight() {
      let maxHeight = 0;
      this.productPreviewCPContainer.style.height = ``;

      this.productPreviewConnectedProducts.forEach(item => {
        const itemHeight = item.offsetHeight;
        if (itemHeight > maxHeight) {
          maxHeight = itemHeight;
        }
      });

      this.productPreviewCPContainer.style.height = `${maxHeight}px`;
    }
  }

  customElements.define('custom-result-quiz', QuizResult);
}

