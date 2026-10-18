if (!customElements.get('faq-section')) {
  class FaqSection extends HTMLElement {
    constructor() {
      super();

      let _this = this;

      this.searchTerm = '';

      this.datasetUrl = this.dataset.url;
      this.searchWrapper = this.querySelector('#FAQ-search-wrapper');
      this.faqsWrapper = this.querySelector('#FAQs-wrapper');
      this.faqsEmptyWrapper = this.querySelector('#FAQs-empty-wrapper');
      if (this.searchWrapper) this.searchInput = this.searchWrapper.querySelector('input');
      this.fieldsetType = this.querySelector('fieldset#Fieldset-type');
      this.fieldsetType.addEventListener('change', this.onFaqTypeChange.bind(this));

      this.fieldsetQuestions = this.querySelector('fieldset#Fieldset-questions');
      this.fieldsetQuestions.addEventListener('change', this.onFaqQuestionChange.bind(this));

      const popularFaqsWrapper = this.querySelector('.popular-faqs');
      if (popularFaqsWrapper) {
        this.popularFaqs = Array.from(popularFaqsWrapper.querySelectorAll('.popular-faq'));

        this.popularFaqs.forEach((faq) => {
          faq.addEventListener('click', (e) => this.onPopularFaqClick(e, faq, _this));
        });
      }

      if (this.searchInput) this.searchInput.addEventListener('input', (event) => this.onSearch(event, _this));

      this.init();
    }

    init() {
      this.getSelectedFaqTypeFromURL();
      if (!this.selectedFaqType) return;

      this.updateURL();
      this.renderQuestionsBytype();
      this.selectFirstQuestion();

      this.onFaqQuestionChange();
    }

    getQuery() {
      return this.searchInput.value
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-$/, '')
        .replace(/^-/, '');
    }

    onSearch(e, _this) {
      e.preventDefault();
      const newSearchTerm = _this.getQuery();

      _this.searchTerm = newSearchTerm;

      _this.renderQuestionsBySearch();
    }

    renderQuestionsBySearch() {
      const questionsWrapper = this.querySelector('.faq-questions');
      if (questionsWrapper) {
        const questions = Array.from(questionsWrapper.querySelectorAll('.faq-question'));

        if (!this.searchTerm.length) {
          return this.renderQuestionsBytype(), this.selectFirstQuestion(), this.onFaqQuestionChange();
        }

        questions.forEach((question) => {
          const questionIdentifier = question.dataset.handle || question.value;
          const input = question.querySelector('input');
          if (questionIdentifier) {
            if (questionIdentifier.includes(this.searchTerm)) {
              question.classList.remove('hidden');
              if (input) input.checked = true;
            } else {
              question.classList.add('hidden');
              if (input) input.checked = false;
            }
          }
        });
        this.onFaqQuestionChange();
        this.selectFirstQuestion();
      }
    }

    onPopularFaqClick(e, faq, _this) {
      e.preventDefault();
      _this.getSelectedFaqType(faq.dataset.type);
      if (!_this.selectedFaqType) return;

      _this.updateURL();
      _this.renderQuestionsBytype();

      const selectEl = _this.fieldsetQuestions.querySelector('select');
      if (selectEl) {
        const option = selectEl.querySelector(`option[value="${faq.dataset.handle}"]`);
        if (option) option.selected = true;
      }

      const questionInput = _this.fieldsetQuestions.querySelector(`input[value="${faq.dataset.handle}"]`);
      if (questionInput) {
        questionInput.checked = true;
      }

      _this.onFaqQuestionChange();
    }

    onFaqTypeChange() {
      this.getSelectedFaqType();
      if (!this.selectedFaqType) return;

      this.updateURL();
      this.renderQuestionsBytype();
      this.selectFirstQuestion();

      this.onFaqQuestionChange();
    }

    onFaqQuestionChange(e) {
      const questionsWrapper = this.querySelector('.faq-questions');
      if (!questionsWrapper) return;
      if (e) {
        if (e.target.nodeName === 'SELECT') {
          const activeQuestionInput = questionsWrapper.querySelector(`input[value="${e.target.value}"]`);
          if (activeQuestionInput) activeQuestionInput.checked = true;
        } else {
          const selectEl = questionsWrapper.querySelector('select');
          selectEl.value = e.target.value;
        }
      }

      let activeQuestionHandle = null;
      const activeQuestionInput = questionsWrapper.querySelector('input:checked');
      if (activeQuestionInput) {
        const activeQuestion = activeQuestionInput.closest('.faq-question');
        if (activeQuestion) {
          if (activeQuestion.classList.contains('hidden')) activeQuestionInput.checked = false;
          activeQuestionHandle = activeQuestion.dataset.handle;
        }
      }

      if (activeQuestionHandle) {
        if (this.faqsWrapper) this.faqsWrapper.classList.remove('!hidden');
        if (this.faqsEmptyWrapper) this.faqsEmptyWrapper.classList.add('!hidden');
      } else {
        if (this.faqsWrapper) this.faqsWrapper.classList.add('!hidden');
        if (this.faqsEmptyWrapper) this.faqsEmptyWrapper.classList.remove('!hidden');
      }

      const answersWrapper = this.querySelector('.faq-answers');
      if (answersWrapper) {
        const answers = Array.from(answersWrapper.querySelectorAll('.faq-answer'));
        answers.forEach((answer) => {
          const answerHandle = answer.dataset.handle;
          if (activeQuestionHandle && answerHandle === activeQuestionHandle) {
            answer.classList.remove('hidden');
          } else {
            answer.classList.add('hidden');
          }
        });
      }
    }

    getSelectedFaqTypeFromURL() {
      const activeType = new URLSearchParams(window.location.search).get('faq_type');
      if (activeType) {
        this.selectedFaqType = activeType;
        const checkedInput = this.fieldsetType.querySelector(`input[value="${activeType}"]`);
        if (checkedInput) checkedInput.checked = true;
      } else {
        const firstInput = this.fieldsetType.querySelector('input');
        firstInput.checked = true;
        this.selectedFaqType = firstInput.value;
      }
      return this.selectedFaqType;
    }

    getSelectedFaqType(type = null) {
      if (type) {
        const firstInput = this.fieldsetType.querySelector(`input[value="${type}"]`);
        firstInput.checked = true;
        this.selectedFaqType = type;
      } else {
        const checkedInput = this.fieldsetType.querySelector('input:checked');
        if (checkedInput) this.selectedFaqType = checkedInput.value;
        if (!this.selectedFaqType) {
          const firstInput = this.fieldsetType.querySelector('input');
          firstInput.checked = true;
          this.selectedFaqType = firstInput.value;
        }
      }
      return this.selectedFaqType;
    }

    updateURL() {
      window.history.replaceState({}, '', `${this.datasetUrl}?faq_type=${this.selectedFaqType}`);
    }

    renderQuestionsBytype() {
      const questionsWrapper = this.querySelector('.faq-questions');
      if (questionsWrapper) {
        const questions = Array.from(questionsWrapper.querySelectorAll('.faq-question'));
        questions.forEach((question) => {
          if (question.dataset.type.includes(this.selectedFaqType)) {
            question.classList.remove('hidden');
          } else {
            question.classList.add('hidden');
          }
        });
      }
    }

    selectFirstQuestion() {
      const questionsWrapper = this.querySelector('.faq-questions');
      if (!questionsWrapper) return;

      const options = Array.from(questionsWrapper.querySelectorAll('option.faq-question:not(.hidden)'));
      if (options.length > 0) {
        options[0].selected = true;
      }
      const questions = questionsWrapper.querySelectorAll('div.faq-question:not(.hidden)');
      if (questions.length > 0) {
        const input = questions[0].querySelector('input');
        input.checked = true;
      }
    }
  }
  customElements.define('faq-section', FaqSection);
}
