const passwordField: HTMLInputElement = <HTMLInputElement>document.querySelector('input[type="password"]');
let modalGenerate: HTMLDivElement;
const loginTerms: Array<string> = ['login', 'submit', 'signin'];
const registerTerms: Array<string> = ['register', 'signup', 'submit', 'apply'];
// page types enum
enum PageType {
  LOGIN,
  REGISTER
}

/**
 * @method determineModalToDisplay
 * @description - hacky way to determine whether it's login or register page
 * @param {HTMLInputElement} passwordField - The password field
 * @returns {void}
 */
const determineModalToDisplay = (): PageType => {
  // Search for buttons or input
  const buttons: HTMLElement[] = [];
  buttons.push(document.querySelector('button'));
  buttons.push(document.querySelector('button[type="submit"]'));
  buttons.push(document.querySelector('input[type="submit"]'));
  buttons.push(document.querySelector('input[type="button"]'));

  buttons.forEach((e: HTMLInputElement | HTMLButtonElement) => {
    if (e !== null) {
      let buttonText = "";
      if (e.tagName === 'BUTTON') {
        buttonText = e.innerText.toLowerCase().trim().replace(/ /g, "");
      } else if (e.tagName === 'INPUT') {
        buttonText = e.value.toLowerCase().trim().replace(/ /g, "");
      }
      if (loginTerms.includes(buttonText)) {
        return PageType.LOGIN;
      } else if (registerTerms.includes(buttonText)) {
        return PageType.REGISTER;
      }
    }
  });
  return null;
}

/**
 * @method autoFillPasswordInput
 * @description - auto fill password input
 * @param {HTMLInputElement} passwordField - The password field
 * @returns {void}
 */
const autoFillPasswordInput = (passwordField: HTMLInputElement): void => {
  const passwordText: HTMLSpanElement = <HTMLSpanElement>document.querySelector(".chrome-ext-suggested");
  passwordField.value = passwordText.innerText;
}

/**
 * @method showModal
 * @description - display password generation UI modal
 * @param {HTMLInputElement} passwordField - The password field
 * @returns {void}
 */
const showModal = (passwordField: HTMLInputElement): void => {
  if (modalGenerate === undefined) {
    modalGenerate = <HTMLDivElement>document.querySelector('.chrome-ext-generate');
    modalGenerate.style.width = `${passwordField.offsetWidth}px`;
    const hoverDiv: HTMLDivElement = <HTMLDivElement>document.querySelector('.chrome-ext-info');
    hoverDiv.addEventListener('click', () => autoFillPasswordInput(passwordField));
  }
  if (passwordField.value.length < 1) {
    modalGenerate.classList.remove('hide');
  }
};

/**
 * @method hideModal
 * @description - hide password generation UI modal
 * @returns {void}
 */
const hideModal = (): void => {
  if (modalGenerate !== undefined) {
    setTimeout(() => {
      modalGenerate.classList.add('hide');
    }, 100);
  }
};

/**
 * @method detectInputChange
 * @description - detect input value change
 * @param {HTMLInputElement} passwordField - The password field
 * @returns {void}
 */
const detectInputChange = (passwordField: HTMLInputElement): void => {
  setInterval(() => {
    if (passwordField.value.length > 0 && modalGenerate !== undefined) {
      if (!modalGenerate.classList.contains('hide')) {
        hideModal();
      }
    }
  }, 200);
  
}

// Operations to perform when input field detected
if (passwordField !== null) {
  fetch(chrome.runtime.getURL('modal.html')).then(response => response.text()).then(html => {
    passwordField.insertAdjacentHTML('afterend', html);
  });
  passwordField.addEventListener('focus', (event: Event) => showModal(<HTMLInputElement>event.target));
  passwordField.addEventListener('blur', () => hideModal());
  detectInputChange(passwordField);
}
