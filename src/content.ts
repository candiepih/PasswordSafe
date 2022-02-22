import generatePassword from "./utils/generatePassword";

const passwordField: HTMLInputElement = <HTMLInputElement>document.querySelector('input[type="password"]');
let modalGenerate: HTMLDivElement;
const loginTerms: Array<string> = ['login', 'submit', 'signin'];
const registerTerms: Array<string> = ['register', 'signup', 'submit', 'apply'];

let passwordSuggestedText: HTMLSpanElement;
const port = chrome.runtime.connect({ name: 'content' });
const siteDomain = new URL(window.location.href).hostname;
console.log(siteDomain);
let savedPassword = "";

// page types enum
enum PageType {
  LOGIN,
  REGISTER
}

// inputs that will determine whether it's login or register page
const buttons: HTMLElement[] = [];
buttons.push(document.querySelector('button'));
buttons.push(document.querySelector('button[type="submit"]'));
buttons.push(document.querySelector('input[type="submit"]'));
buttons.push(document.querySelector('input[type="button"]'));

/**
 * @method determineModalToDisplay
 * @description - hacky way to determine whether it's login or register page
 * @param {HTMLInputElement} passwordField - The password field
 * @returns {void}
 */
const determineModalToDisplay = (): PageType => {
  // Search for buttons or input
  const availableButton: Array<HTMLElement> = buttons.filter(button => button !== null);
  const f = availableButton.map((button: HTMLInputElement | HTMLButtonElement) => {
    let buttonText = "";
      if (button.tagName === 'BUTTON') {
        buttonText = button.innerText.toLowerCase().trim().replace(/ /g, "");
      } else if (button.tagName === 'INPUT') {
        buttonText = button.value.toLowerCase().trim().replace(/ /g, "");
      }
      if (buttonText.length > 0 || buttonText !== '') {
        if (loginTerms.includes(buttonText)) {
          return PageType.LOGIN;
        } else if (registerTerms.includes(buttonText)) {
          return PageType.REGISTER;
        }
      }
  });
  return f.filter(f => f !== undefined)[0];
}

const pageType: PageType = determineModalToDisplay();

/**
 * @method autoFillSuggestedPassword
 * @description - auto fill password input
 * @param {HTMLInputElement} passwordField - The password field
 * @returns {void}
 */
const autoFillSuggestedPassword = (passwordField: HTMLInputElement): void => {
  const passwordText: HTMLSpanElement = <HTMLSpanElement>document.querySelector(".chrome-ext-suggested");
  passwordField.value = passwordText.innerText;
  savePasswordToStorage(passwordField.value);
}

/**
 * @method autoFillSavedPassword
 * @description - auto fill password that is saved to storage for the current page
 * @param {HTMLInputElement} passwordField - The password field
 * @returns {void}
 */
const autoFillSavedPassword = (passwordField: HTMLInputElement): void => {
  passwordField.value = savedPassword;
}

const savePasswordToStorage = (password: string): void => {
  // get url current page
  const url: string = siteDomain;
  port.postMessage({ action: 'savePassword', url, password });
}

/**
 * @method showModal
 * @description - display password generation or autofill modal
 * @param {HTMLInputElement} passwordField - The password field
 * @returns {void}
 */
const showModal = (passwordField: HTMLInputElement): void => {
  if (modalGenerate === undefined) {
    const hoverDiv: Array<Element> = [...document.querySelectorAll('.chrome-ext-info')];
    if (pageType === PageType.LOGIN) {
      modalGenerate = <HTMLDivElement>document.querySelector('.chrome-ext-generate');
      hoverDiv[0].addEventListener('click', () => autoFillSuggestedPassword(passwordField));
      passwordSuggestedText = <HTMLSpanElement>document.querySelector(".chrome-ext-suggested");
    } else if (pageType === PageType.REGISTER && savedPassword) {
      modalGenerate = <HTMLDivElement>document.querySelector('.chrome-ext-autofill');
      hoverDiv[1].addEventListener('click', () => autoFillSavedPassword(passwordField));
      const passHolder: HTMLSpanElement = document.querySelector('.saved-pass-field');
      passHolder.innerHTML = `${'&#11044; '.repeat(savedPassword.length)}`;
    } else {
      return;
    }
    modalGenerate.style.width = `${passwordField.offsetWidth}px`;
  }
  if (passwordField.value.length < 1) {
    modalGenerate.classList.remove('hide');
  }

  // fill suggested password field with a random password
  if (pageType === PageType.LOGIN && passwordSuggestedText !== undefined) {
    passwordSuggestedText.innerText = generatePassword({
      upper: true,
      lower: true,
      number: true,
      symbol: true
    }, 12);
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
port.postMessage({ action: 'checkUser' });
port.postMessage({ action: 'getSavedPassword', url: siteDomain });
port.onMessage.addListener((response) => {
  if (response.isNew !== undefined) {
    if (passwordField !== null && !response.isNew) {
      initPageContent();
    }
  } else if (response.password !== undefined) {
    savedPassword = response.password;
  }
});

/**
 * @method initPageContent
 * @description - initialize page content
 * @returns {void}
 */
const initPageContent = (): void => {
  fetch(chrome.runtime.getURL('content.html')).then(response => response.text()).then(html => {
    passwordField.insertAdjacentHTML('afterend', html);
  });
  passwordField.addEventListener('focus', (event: Event) => showModal(<HTMLInputElement>event.target));
  passwordField.addEventListener('blur', () => hideModal());
  detectInputChange(passwordField);
}
