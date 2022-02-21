import { Url, PassswordFilter } from "./interfaces";
import generatePassword from "./utils/generatePassword";


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
    submitKeyInput.addEventListener('click', registerUser);
  } else {
    firstTime.classList.add('hide');
    defaultData.classList.remove('hide');
    // Retrieve and display saved sites
    constructAvailableSitesHTML(msg.sites);
  }
});

/**
 * @method sendKey
 * @description sends key to the storage if new user
 * @returns {void}
 */
const registerUser = (): void => {
  const secretInput: HTMLInputElement = document.querySelector('input[type="secret"]');
  const secret: string = secretInput.value;
  if (secret) {
    // send message
    if (secretInput.classList.contains('error')) {
      secretInput.classList.remove('error');
    }
    port.postMessage({ action: 'registerUser', key: secret });
  } else {
    secretInput.classList.add('error');
    console.log(generatePassword({
      lower: true,
      upper: true,
      symbol: false,
      number: false
    }, 12));
  }
}

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

/**
 * @method constructAvailableSitesHTML
 * @description constructs the saved sites available html
 * @param {Array<Url>} sites
 * @returns {void}
 */
const constructAvailableSitesHTML = (sites: Array<Url>): void => {
  const cardsContainer = available.querySelector('#cards-container');
  if (sites.length === 0) {
    cardsContainer.innerHTML = '<p class="no-sites">You haven\'t saved passwords yet.<br>Save to view them here.</p>';
  } else {
    const html = sites.map((site: Url) => {
      const name = new URL(site.url).hostname.replace(/^www\./, '');
      return `<div class="item-card">
            <div class="logo">
              <h1>${name[0]}</h1>
            </div>
            <div class="details">
              <div class="container">
                <p class="name">${name}</p>
                <div class="password-cont">
                  <p class="password">${'&#11044;'.repeat(site.passLength)}</p>
                  <img src="./icons/eye.svg" alt="" height="20px" class="view">
                  <img src="./icons/copy.svg" alt="" height="20px" class="copy">
                </div>
              </div>
            </div>
          </div>`;
    }).join('');
    cardsContainer.innerHTML = html;
  }
}

// navigation buttons listeners
navButtons.forEach((item: Element) => {
  item.addEventListener('click', (e: Event): void => toggleClasses(<HTMLElement>e.target));
});
