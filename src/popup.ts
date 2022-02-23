import { Url, RetrievePasswordResponse, PassswordFilter, PassswordFilterKeys } from "./interfaces";
import generatePassword from "./utils/generatePassword";


const navButtons: Element[] = [...document.getElementsByClassName('holder').item(0).children];
const generateContainer: HTMLElement = document.querySelector('.generate');
const available: HTMLElement = document.querySelector('.available');
const firstTime: HTMLElement = document.querySelector('.first-time');
const submitKeyInput: HTMLInputElement = document.querySelector('#send-key');
const defaultData: HTMLElement = document.querySelector('.default');

// HANDLE LISTENING FOR MESSAGES FROM BACKGROUND SCRIPT
const port = chrome.runtime.connect({ name: 'popup' });
// Check if it's firt time user
port.postMessage( { action: 'checkUser' } );
port.onMessage.addListener((msg) => {
  if (msg.isNew !== undefined) {
    if (msg.isNew) {
      firstTime.classList.remove('hide');
      submitKeyInput.addEventListener('click', registerUser);
    } else {
      firstTime.classList.add('hide');
      defaultData.classList.remove('hide');
      
      // Retrieve and display saved sites
      constructAvailableSitesHTML(msg.sites);
      if (msg.sites.length > 0) {
        attachSitesInteractionListeners();
      }
    }
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
      const name = site.url;
      // replace(/^www\./, '');
      return `<div class="item-card">
            <div class="logo">
              <h1>${name[0]}</h1>
            </div>
            <div class="details">
              <div class="container">
                <p class="name">${name}</p>
                <div class="password-cont">
                  <p class="password icons">${'&#11044;'.repeat(site.passLength)}</p>
                  <img src="./icons/eye.svg" alt="" height="20px" class="view">
                  <img src="./icons/copy.svg" alt="" height="20px" class="copy">
                  <img src="./icons/delete.svg" alt="delete" height="20px" class="delete">
                </div>
              </div>
            </div>
          </div>`;
    }).join('');
    cardsContainer.innerHTML = html;
  }
}

/**
 * @method attachSitesInteractionListeners
 * @description attaches listeners to the saved sites. ie copy, view
 * @returns {void}
 */
const attachSitesInteractionListeners = (): void => {
  const viewIcons: Array<Element> = [...document.querySelectorAll('.view')];
  const copyIcons: Array<Element> = [...document.querySelectorAll('.copy')];
  const deleteIcons: Array<Element> = [...document.querySelectorAll('.delete')];

  viewIcons.forEach((el: HTMLElement) => {
    el.addEventListener('click', (e: Event) => viewPassword(e.target as HTMLElement));
  });

  copyIcons.forEach((el: HTMLElement) => {
    el.addEventListener('click', (e: Event) => copyPassword(e.target as HTMLElement));
  });

  deleteIcons.forEach((el: HTMLElement) => {
    el.addEventListener('click', (e: Event) => deletePassword(e.target as HTMLElement));
  });
}

/**
 * @method retrieveDecryptedPassword
 * @description retrieves decrypted password of certain url from storage
 * @param {string} url
 * @returns {Promise<RetrievePasswordResponse>}
 */
const retrieveDecryptedPassword = async (url: string): Promise<unknown> => {
  const retrievePasswordPromise = new Promise((resolve, reject) => {
    const newPort = chrome.runtime.connect({ name: 'popup' });
    newPort.postMessage({ action: 'viewPassword', url });
    newPort.onMessage.addListener((msg) => {
      if (msg.password === undefined) {
        reject(msg);
      } else {
        resolve(msg);
      }
      newPort.disconnect();
    });
  });
  return retrievePasswordPromise;
}

/**
 * @method copyPassword
 * @description copies password to clipboard
 * @param {HTMLElement} target copy icon clicked
 * @returns {void}
 */
const copyPassword = (target: HTMLElement): void => {
  const parentNode: HTMLElement = target.parentElement.parentElement;
  const urlNode: HTMLElement = parentNode.querySelector('.name');
  const url = urlNode.innerText;

  retrieveDecryptedPassword(url).then((msg: RetrievePasswordResponse) => {
    const password = msg.password;
    navigator.clipboard.writeText(password);
    // wait for 50ms before displaying alert message
    setTimeout(() => {
      alert('Password copied to clipboard');
    }, 50);
  }).catch((err: Error) => {
    console.log(err);
  });
}

/**
 * @method viewPassword
 * @description display the real password in a modal
 * @param {HTMLElement} target view icon clicked
 * @returns {void}
 */
const viewPassword = (target: HTMLElement): void => {
  const parentNode: HTMLElement = target.parentElement.parentElement;
  const urlNode: HTMLElement = parentNode.querySelector('.name');
  const passwordField: HTMLElement = parentNode.querySelector('.password');
  const url = urlNode.innerText;

  retrieveDecryptedPassword(url).then((msg: RetrievePasswordResponse) => {
    if (passwordField.classList.contains('icons')) {
      passwordField.classList.remove('icons');
      passwordField.innerText = msg.password;
    } else {
      passwordField.classList.add('icons');
      passwordField.innerHTML = '&#11044;'.repeat(msg.passLength);
    }
  });
}

/**
 * @method deletePassword
 * @description deletes password of site from storage
 * @param {HTMLElement} target delete icon clicked
 * @returns {void}
 */
const deletePassword = (target: HTMLElement): void => {
  const parentNode: HTMLElement = target.parentElement.parentElement;
  const urlNode: HTMLElement = parentNode.querySelector('.name');
  const url = urlNode.innerText;

  if (confirm(`Are your sure you want to delete password of ${url}?`)) {
    const deletePort = chrome.runtime.connect({ name: 'popup' });
    deletePort.postMessage({ action: 'deletePassword', url });
    deletePort.onMessage.addListener((msg) => {
      if (msg.deleted !== undefined && msg.deleted) {
        constructAvailableSitesHTML(msg.sites);
      }
      deletePort.disconnect();
    });
  }
}

// Popup navigation buttons switching listeners
navButtons.forEach((item: Element) => {
  item.addEventListener('click', (e: Event): void => toggleClasses(<HTMLElement>e.target));
});


// GENERATING OF PASSWORDS
const checkboxes: Array<Element> = [...document.querySelectorAll('input[type="checkbox"]')];
const generatePasswordButton: Element = document.querySelector('#generate-password');
const passwordValueContainer: HTMLParagraphElement = document.querySelector('#password-value');
const passwordLength: HTMLInputElement = document.querySelector('#password-length');
const passwordLengthLabel: HTMLLabelElement = document.querySelector('#password-length-label');

generatePasswordButton.addEventListener('click', () => generateRandomPassword());
passwordLength.addEventListener('change', (e: Event) => changePasswordLengthLabelValue(e.target as HTMLInputElement));

const filters: PassswordFilter = {
  lower: true,
  upper: true,
  number: true,
  symbol: true,
};

// Listen for input checkbox value change and update password
checkboxes.forEach((item: Element) => {
  item.addEventListener('change', (e: Event) => {
    const target = <HTMLInputElement>e.target;
    filters[target.name as PassswordFilterKeys] = target.checked;
    passwordValueContainer.innerText = generatePassword(filters, parseInt(passwordLength.value));
  });
});

// initialize with random password
passwordValueContainer.innerText = generatePassword(filters, parseInt(passwordLength.value));

/**
 * @method changePasswordLengthLabelValue
 * @description changes the value of the label for password length
 * @param {HTMLInputElement} target
 * @returns {void}
 */
const changePasswordLengthLabelValue = (target: HTMLInputElement): void => {
  passwordLengthLabel.innerText = target.value;
  passwordValueContainer.innerText = generatePassword(filters, parseInt(target.value));
}

/**
 * @method generateRandomPassword
 * @description generates a random password and displays it in the password value container
 * @returns {void}
 */
const generateRandomPassword = (): void => {
  checkboxes.forEach((el: HTMLInputElement) => {
    filters[el.name as PassswordFilterKeys] = el.checked;
  });
  if (Object.values(filters).every((el: boolean) => el === false)) {
    alert('Please select at least one filter');
    return;
  }
  passwordValueContainer.innerText = generatePassword(filters, parseInt(passwordLength.value));
};
