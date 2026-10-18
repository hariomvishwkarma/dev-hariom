(function () {
  var ROOT_SELECTOR = "product-unavailable-element";
  var INPUT_SELECTOR = ".product-unavailable--input";
  var BUTTON_SELECTOR = ".product-unavailable--submit";
  var HIDDEN_INPUT_SELECTOR = ".product-unavailable-form--input";
  var FEEDBACK_HASH = "#feedback-bar--product-form";

  function isValidEmail(value) {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value || "");
  }

  function getRoot(node) {
    return node && node.closest ? node.closest(ROOT_SELECTOR) : null;
  }

  function getForm(root) {
    if (!root) return null;
    var formId = root.getAttribute("data-form-id");
    return formId ? document.getElementById(formId) : null;
  }

  function getHiddenEmailInput(root) {
    var form = getForm(root);
    return form ? form.querySelector(HIDDEN_INPUT_SELECTOR) : null;
  }

  function updateButtonState(root, value) {
    var button = root ? root.querySelector(BUTTON_SELECTOR) : null;
    if (!button) return;

    if (isValidEmail(value)) {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", "disabled");
    }
  }

  function syncInitialState(root) {
    if (!root) return;

    var initialAvailable = root.getAttribute("data-initial-available");
    if (initialAvailable === "true") {
      root.setAttribute("aria-hidden", "true");
    } else if (initialAvailable === "false") {
      root.setAttribute("aria-hidden", "false");
    }

    var visibleInput = root.querySelector(INPUT_SELECTOR);
    var hiddenInput = getHiddenEmailInput(root);
    if (visibleInput && hiddenInput) {
      hiddenInput.value = visibleInput.value;
      updateButtonState(root, visibleInput.value);
    }
  }

  async function submitUnavailableForm(root) {
    var form = getForm(root);
    var visibleInput = root ? root.querySelector(INPUT_SELECTOR) : null;
    var hiddenInput = getHiddenEmailInput(root);
    var button = root ? root.querySelector(BUTTON_SELECTOR) : null;

    if (!form || !visibleInput || !hiddenInput || !button) return;

    hiddenInput.value = visibleInput.value;
    button.setAttribute("disabled", "disabled");
    root.setAttribute("aria-busy", "true");

    try {
      var formData = new FormData(form);
      formData.set("contact[email]", visibleInput.value);

      var action = (form.getAttribute("action") || "/contact").split("#")[0];
      var response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      });

      if (!response.ok) {
        throw new Error("Unavailable form submit failed");
      }

      root.setAttribute("aria-busy", "false");
      visibleInput.value = "";
      hiddenInput.value = "";
      window.location.hash = FEEDBACK_HASH;

      if (typeof window.trigger === "function") {
        window.trigger("theme:feedback:load", { async: "product-form" });
      }
    } catch (error) {
      root.setAttribute("aria-busy", "false");
      updateButtonState(root, visibleInput.value);
    }
  }

  function init(context) {
    var scope = context || document;
    var roots = scope.querySelectorAll(ROOT_SELECTOR);
    roots.forEach(syncInitialState);
  }

  document.addEventListener(
    "input",
    function (event) {
      var input = event.target.closest ? event.target.closest(INPUT_SELECTOR) : null;
      if (!input) return;

      var root = getRoot(input);
      var hiddenInput = getHiddenEmailInput(root);
      if (hiddenInput) {
        hiddenInput.value = input.value;
      }

      updateButtonState(root, input.value);
    },
    true
  );

  document.addEventListener(
    "click",
    function (event) {
      var button = event.target.closest ? event.target.closest(BUTTON_SELECTOR) : null;
      if (!button) return;

      var root = getRoot(button);
      if (!root) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();

      submitUnavailableForm(root);
    },
    true
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init(document);
    });
  } else {
    init(document);
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (node.matches && node.matches(ROOT_SELECTOR)) {
          syncInitialState(node);
          return;
        }
        if (node.querySelectorAll) {
          init(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
