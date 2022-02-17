// injecting modal
const form: HTMLFormElement = <HTMLFormElement>document.querySelector('form');
const passwordField: HTMLInputElement = <HTMLInputElement>form.querySelector('input[type="password"]');
let modalGenerate: HTMLDivElement;

const showModal = (target: HTMLInputElement) => {
  // handle show UI modal
  if (modalGenerate === undefined) {
    modalGenerate = <HTMLDivElement>document.querySelector('.chrome-ext-generate');
  }
  modalGenerate.classList.remove('modal-hide');
};

const hideModal = (target: HTMLInputElement) => {
  //handle closing UI modal
  if (modalGenerate !== undefined) {
    modalGenerate.classList.add('modal-hide');
  }
};

if (passwordField !== null) {
  fetch(chrome.runtime.getURL('modal.html')).then(response => response.text()).then(html => {
    passwordField.insertAdjacentHTML('beforebegin', html);
  });
  passwordField.addEventListener('focus', (event: Event) => showModal(<HTMLInputElement>event.target));
  passwordField.addEventListener('blur', (event: Event) => hideModal(<HTMLInputElement>event.target));
}
