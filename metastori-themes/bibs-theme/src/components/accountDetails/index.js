const fullnameInput = document.querySelector('[data-fullname-input]');
const showChangePassword = document.querySelector('[ data-show-change-password]');
const showMainAddress = document.querySelector('[ data-show-main-address]');
const mainContent = document.querySelector('[data-addresses-main-content]');

if (mainContent) {
  function splitName(fullName) {
    const [firstName, ...lastName] = fullName.trim().split(/\s+/);
    const firstNameInput = document.querySelector('[data-first-name]');
    const lastNameInput = document.querySelector('[data-last-name]');
    if (firstNameInput) firstNameInput.value = firstName;
    if (lastNameInput) lastNameInput.value = lastName.join(' ');
  }

  function toggleElementVisibility(element, isVisible) {
    element.classList.toggle('hidden', !isVisible);
    element.classList.toggle('md:flex', isVisible);
  }

  function showChangePasswordContent() {
    const changePasswordContent = document.querySelector('[data-change-password-content]');
    if (!changePasswordContent) return;

    toggleElementVisibility(mainContent, false);
    toggleElementVisibility(changePasswordContent, true);
  }

  function showMainAddressContent() {
    const changePasswordContent = document.querySelector('[data-change-password-content]');
    if (!changePasswordContent) return;

    toggleElementVisibility(mainContent, true);
    toggleElementVisibility(changePasswordContent, false);
  }

  fullnameInput?.addEventListener('change', (e) => {
    splitName(e.target.value)
  })

  showChangePassword?.addEventListener('click', showChangePasswordContent);
  showMainAddress?.addEventListener('click', showMainAddressContent);
}