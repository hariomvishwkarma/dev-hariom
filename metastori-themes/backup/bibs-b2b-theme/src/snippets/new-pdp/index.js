class VariantTabs extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    const tabButtons = this.querySelectorAll('.variant-tab');
    const quickOrderList = this.closest('quick-order-list');

    if (!quickOrderList || !tabButtons.length) return;

    // Simple tab switching
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-tab-target');

        // Remove active from all tabs
        tabButtons.forEach(tab => tab.classList.remove('variant-tab--active'));
        quickOrderList.querySelectorAll('.variant-tab-content').forEach(content => {
          content.classList.remove('variant-tab-content--active');
        });

        // Add active to clicked tab
        button.classList.add('variant-tab--active');
        const targetContent = quickOrderList.querySelector(`#${targetId}`);
        if (targetContent) {
          targetContent.classList.add('variant-tab-content--active');
        }

        // Update quick order list inputs
        if (quickOrderList.defineInputsAndQuickOrderTable) {
          quickOrderList.defineInputsAndQuickOrderTable();
        }
      });
    });
  }
}

// Define the custom element
if (!customElements.get('variant-tabs')) {
  customElements.define('variant-tabs', VariantTabs);
}

class DescriptionTabs extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    const tabButtons = this.querySelectorAll('.description-button');
    const descriptionTabList = this.closest('description-wrapper');

    // Simple tab switching
    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-tab-target');

        // Remove active from all tabs
        tabButtons.forEach(tab => tab.classList.remove('description-tab--active'));
        descriptionTabList.querySelectorAll('.description-tab-content').forEach(content => {
          content.classList.remove('description-tab-content--active');
        });

        // Add active to clicked tab
        button.classList.add('description-tab--active');
        const targetContent = descriptionTabList.querySelector(`#${targetId}`);
        if (targetContent) {
          targetContent.classList.add('description-tab-content--active');
        }
      });
    });
  }
}

// Define the custom element
if (!customElements.get('description-tabs')) {
  customElements.define('description-tabs', DescriptionTabs);
}