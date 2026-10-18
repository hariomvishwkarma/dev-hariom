const formEle = document.querySelector('[data-validation-required]');

if (formEle) {

// form inputs
const emailInput = formEle.querySelector('#email');
const passInput = formEle.querySelector('[type="password"]');
const confirmPassInput = formEle.querySelector('#password_confirmation');
const nameInput = formEle.querySelector('#first_name');
const surnameInput = formEle.querySelector('#last_name');
const phoneInput = formEle.querySelector('#tel');
const contactNameInput = formEle.querySelector('#contact_name');
const contactEmailInput = formEle.querySelector('#contact_email');
const contactSubjectInput = formEle.querySelector('#contact_subject');
const contactBodyText = formEle.querySelector('#contact_body');
let forgotPassEmailInput;

// form buttons
const loginButton = formEle.querySelector('#submit-login');
const registerButton = formEle.querySelector('#submit-register');
const contactButton = formEle.querySelector('#submit-contact');
const resetPassButton = formEle.querySelector('#submit-reset-password');
const passEyeButtons = formEle.querySelectorAll('.password-icon');

// form errors
const errorSection = formEle.querySelector('.contact-form--errors');

const showForgotPassButton = formEle.querySelector('[data-toggle-forgot-password]');

function isFieldEmpty(element) {
  return element.value.trim() === '';
}

function isPassword(element) {
  return element.type === 'password';
}

function isEmail(element) {
  return element.type === 'email';
}

function isPhone(element) {
  return element.type === 'tel';
}

function isEmailValid(element) {
  if (element.type !== 'email') return;
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return element.value.match(regex);
}

function isPasswordValid(element) {
  const regex = /^(?=.*\d).{8,}$/;
  return regex.test(element.value);
}

function isPhoneValid(element) {
  const regex = /^(\+45\s?)?(\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/;
  return regex.test(element.value);
}

function showPasswordRequirements(show) {
  const passwordRequirements = document.querySelector('[data-password-requirements]');
  if (!passwordRequirements) return;

  if (show) {
    passwordRequirements.style.display = 'block';
  } else {
    passwordRequirements.style.display = 'none';
  }
}

function validationIcon(element, icon) {
  const validIcon = element.closest('[data-auth-input]')?.querySelector('.input-icon-success');
  const invalidIcon = element.closest('[data-auth-input]')?.querySelector('.input-icon-invalid');

  if (icon === 'hidden') {
    if (validIcon) validIcon.classList.add('hidden');
    if (invalidIcon) invalidIcon.classList.add('hidden');
  } else if (icon === 'invalid') {
    if (invalidIcon) invalidIcon.classList.remove('hidden');
    if (validIcon) validIcon.classList.add('hidden');
  } else {
    if (validIcon) validIcon.classList.remove('hidden');
    if (invalidIcon) invalidIcon.classList.add('hidden');
  }
}

function makeErrorField(input, inputError, isError) {
  if (isError) {
    input.classList.add('shadow-error', 'shadow-[0_1px_0_0]');
    if (inputError) {
      inputError.classList.add('max-h-10');
      inputError.classList.remove('max-h-0');
    }

    if (errorSection) {
      const errorID = input.id;
      errorSection.querySelector("[data-error-for='" + errorID + "']")?.classList.remove('hidden');
      errorSection.querySelector("[data-error-for='" + errorID + "']")?.classList.add('block');
    }
  } else {
    input.classList.remove('shadow-error', 'shadow-[0_1px_0_0]');
    if (inputError) {
      inputError.classList.remove('max-h-10');
      inputError.classList.add('max-h-0');
    }
    if (errorSection) {
      const errorID = input.id;
      errorSection.querySelector("[data-error-for='" + errorID + "']")?.classList.add('hidden');
      errorSection.querySelector("[data-error-for='" + errorID + "']")?.classList.remove('block');
    }
  }
}

function handleInputError() {
  const input = this;
  const inputError = input.closest('[data-auth-input]')?.querySelector('[data-error-text]');

  const fieldIsEmpty = isFieldEmpty(input);

  if (fieldIsEmpty) validationIcon(input, 'hidden');

  if (isPassword(input) && !isPasswordValid(input)) {
    makeErrorField(input, inputError, true);
    showPasswordRequirements(false);
  } else if (isPassword(input) && isPasswordValid(input)) {
    makeErrorField(input, inputError, false);
    showPasswordRequirements(true);
  } else if (!fieldIsEmpty && ((isEmail(input) && !isEmailValid(input)) || (isPhone(input) && !isPhoneValid(input)))) {
    makeErrorField(input, inputError, true);
    validationIcon(input, 'invalid');
  } else if (fieldIsEmpty) {
    makeErrorField(input, inputError, true);
  } else {
    makeErrorField(input, inputError, false);
    validationIcon(input);
  }
}

function handleSubmitButton(button) {
  if (!button) return;

  let allInputsFilled;

  if (button.id === 'submit-forgot-password') {
    allInputsFilled = isEmailValid(forgotPassEmailInput);
  } else if (registerButton) {
    allInputsFilled = isEmailValid(emailInput) && !isFieldEmpty(nameInput) && !isFieldEmpty(surnameInput) && isPhoneValid(phoneInput) && isPasswordValid(passInput);
  } else if (loginButton) {
    allInputsFilled = passInput ? !isFieldEmpty(emailInput) && !isFieldEmpty(passInput) : !isFieldEmpty(emailInput);
  } else if (contactButton) {
    allInputsFilled = !isFieldEmpty(contactNameInput) && isEmailValid(contactEmailInput) && !isFieldEmpty(contactSubjectInput) && !isFieldEmpty(contactBodyText);
  } else if (resetPassButton) {
    allInputsFilled = !isFieldEmpty(confirmPassInput) && !isFieldEmpty(passInput);
  } else {
    return;
  }

  if (allInputsFilled) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', 'disabled');
  }
}

function validateForgotPass() {
  const forgotPassForm = document.getElementById('recover-password-form');
  const forgotPasswordButton = forgotPassForm?.querySelector('#submit-forgot-password');
  forgotPassEmailInput = forgotPassForm?.querySelector('#customer_email');

  // Event listeners for enabling/disabling forgotPasswordForm
  handleSubmitButton(forgotPasswordButton);
  window.addEventListener('input', () => handleSubmitButton(forgotPasswordButton));

  // Input error event listeners
  const inputs = [forgotPassEmailInput];
  if (forgotPassEmailInput?.value) handleInputError.call(forgotPassEmailInput);
  inputs.forEach((input) => input?.addEventListener('blur', handleInputError));
}

function showPasswordIcon() {
  const passIcon = document.querySelector('.password-icon');
  const passInput = document.getElementById('password');

  if (!passIcon || !passInput) return;
  const isPasswordEmpty = isFieldEmpty(passInput);

  if (isPasswordEmpty) {
    passIcon.classList.add('hidden');
  } else {
    passIcon.classList.remove('hidden');
  }
}

function showPassword() {
  const passButton = this;
  const passInput = passButton.closest('[data-auth-input]')?.querySelector('[name*="password"]');
  if (passInput) passInput.type = 'text';
}

function hidePassword() {
  const passButton = this;
  const passInput = passButton.closest('[data-auth-input]')?.querySelector('[name*="password"]');
  if (passInput) passInput.type = 'password';
}

// Event listeners for enabling/disabling loginForm
if (loginButton) {
  window.addEventListener('load', () => {
    handleSubmitButton(loginButton);
  });

  emailInput?.addEventListener('input', () => {
    handleSubmitButton(loginButton);
  });

  passInput?.addEventListener('input', () => {
    handleSubmitButton(loginButton);
  });
}

// Event listeners for enabling/disabling registerForm
if (registerButton && emailInput && nameInput && surnameInput && phoneInput && passInput) {
  const registerInputs = [emailInput, nameInput, surnameInput, phoneInput, passInput];

  window.addEventListener('load', () => {
    handleSubmitButton(registerButton);
  });

  registerInputs.forEach((input) => {
    input.addEventListener('input', () => {
      handleSubmitButton(registerButton);
    });
  });
}

// Event listeners for enabling/disabling contactForm
if (contactButton) {
  window.addEventListener('load', () => handleSubmitButton(contactButton));
  contactNameInput?.addEventListener('input', () => {
    handleSubmitButton(contactButton);
  });
  contactEmailInput?.addEventListener('input', () => {
    handleSubmitButton(contactButton);
  });
  contactBodyText?.addEventListener('input', () => {
    handleSubmitButton(contactButton);
  });
  contactSubjectInput?.addEventListener('change', () => {
    handleSubmitButton(contactButton);
  });
}

// Event listeners for enabling/disabling resetPasswordForm
if (resetPassButton) {
  window.addEventListener('load', () => handleSubmitButton(resetPassButton));
  passInput?.addEventListener('input', () => handleSubmitButton(resetPassButton));
  confirmPassInput?.addEventListener('input', () => handleSubmitButton(resetPassButton));
}

// Event listeners for enabling/disabling forgotPasswordForm
showForgotPassButton?.addEventListener('click', validateForgotPass);

// Password icon event listeners
passEyeButtons?.forEach((passButton) => passButton.addEventListener('mousedown', showPassword));
passEyeButtons?.forEach((passButton) => passButton.addEventListener('mouseup', hidePassword));
passEyeButtons?.forEach((passButton) => passButton.addEventListener('touchstart', showPassword));
passEyeButtons?.forEach((passButton) => passButton.addEventListener('touchend', hidePassword));
passInput?.addEventListener('input', showPasswordIcon);

// Input error event listeners
if (registerButton) {
  const inputs = [emailInput, nameInput, surnameInput, phoneInput, passInput];
  inputs.forEach((input) => input?.addEventListener('blur', handleInputError));
}

if (contactButton) {
  const inputs = [contactNameInput, contactEmailInput, contactBodyText, contactSubjectInput];
  inputs.forEach((input) => input?.addEventListener('blur', handleInputError));
}
}
