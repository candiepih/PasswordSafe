const navButtons: Element[] = [...document.getElementsByClassName('holder').item(0).children];
const generateContainer: HTMLElement = document.querySelector('.generate');
const available: HTMLElement = document.querySelector('.available');
const firstTime: HTMLElement = document.querySelector('.first-time');
const submitKeyInput: HTMLInputElement = document.querySelector('#send-key');
const defaultData: HTMLElement = document.querySelector('.default');

// Check if it's firt time user
const port = chrome.runtime.connect({ name: 'popup' });
port.postMessage( { action: 'checkUser' } );
port.onMessage.addListener((msg) => {
  if (msg.isNew) {
    firstTime.classList.remove('hide');
  } else {
    firstTime.classList.add('hide');
    defaultData.classList.remove('hide');
  }
});

const sendKey = (): void => {
  const secretInput: HTMLInputElement = document.querySelector('input[type="secret"]');
  const secret: string = secretInput.value;
  if (secret) {
    // send message
    if (secretInput.classList.contains('error')) {
      secretInput.classList.remove('error');
    }
    port.postMessage({ action: 'sendKey', key: secret });
  } else {
    secretInput.classList.add('error');
  }
}
submitKeyInput.addEventListener('click', sendKey);

/**
 * @method toggleContainers
 * @description toggles the visibility available containers
 * @returns {void}
 */
const toggleContainers = (): void => {
  if (generateContainer.style.display === 'block') {
    generateContainer.style.display = 'none';
    available.style.display = 'block';
  } else {
    generateContainer.style.display = 'block';
    available.style.display = 'none';
  }
};

/**
 * @method toggleNavButtons
 * @description toggle active class on click
 * @param {number} index
 * @returns {void}
 */
const toggleClasses = (target: HTMLElement): void => {
    if (!target.classList.contains('holder')) {
      target.classList.add('active');
      toggleContainers();
      navButtons.forEach((el: Element) => {
        if (el !== target) {
          el.classList.remove('active');
        }
      });
    }
};


// Event Listeners
navButtons.forEach((item: Element) => {
  item.addEventListener('click', (e: Event): void => toggleClasses(<HTMLElement>e.target));
});
