import AESencryption from './utils/AESencryption';
import Storage from './utils/storage';
import { User, PasswordSafe, Url } from './interfaces';
// globals

const chromeStorage: Storage = new Storage();
let userEmail = "";

chrome.storage.sync.remove('PasswordSafe');
// chromeStorage.get('PasswordSafe').then((result: PasswordSafe) => {
//   console.log(result);
// });


// Retrieve user email from chrome storage
chrome.identity.getProfileUserInfo((userInfo) => {
  userEmail = userInfo.email.toString();
});

// Listen to messages from the popup and content scripts
chrome.runtime.onConnect.addListener((port) => {
  switch (port.name) {
    case 'popup':
      popupActions(port);
      break;
    case 'content':
      contentActions(port);
      break;
    default:
      throw new Error("Port name doesn't match");
  }
});

/**
 * @method popupActions
 * @description handles popup actions
 * @param {Port} port
 * @returns {void}
 */
const popupActions = (port: chrome.runtime.Port): void => {
  port.onMessage.addListener((msg) => {
    switch (msg.action) {
      case 'checkUser':
        checkUser(port);
        break;
      case 'registerUser':
        registerUser(port, msg.key);
        break;
      default:
        throw new Error("Action doesn't match");
    }
  });
}

/**
 * @method checkUser
 * @description checks if user object exists in storage
 * @param {Port} port
 * @returns {void}
 */
const checkUser = (port: chrome.runtime.Port): void => {
  console.log("checking user");
  chromeStorage.get('PasswordSafe').then((result: PasswordSafe) => {
    if (result === undefined) {
      port.postMessage({ isNew: true });
      console.log('new user');
    } else {
      const user: User = result.users.find((user: User) => user.details.email === userEmail);
      if (user) {
        port.postMessage({ isNew: false, key: user.details.key, sites: user.sites });
      } else {
        port.postMessage({ isNew: true });
      }
    }
  });
}

/**
 * @method registerUser
 * @description registers user and saves key to the storage
 * @param {Port} port
 * @param {string} key
 * @returns {void}
 */
const registerUser = (port: chrome.runtime.Port, secret_key: string): void => {
  const key = AESencryption.encryptSecretKey(secret_key);

  chromeStorage.get('PasswordSafe').then(async (result: PasswordSafe) => {
    const user: User = {
      details: {
        email: userEmail,
        key: key,
      },
      sites: []
    };

    if (result === undefined) {
      await chromeStorage.save('PasswordSafe', { users: [user] });
    } else {
      await chromeStorage.save('PasswordSafe', { users: [...result.users, user] });
    }
    port.postMessage({ isNew: false, key: key, sites: [] });
  });
}

const contentActions = (port: chrome.runtime.Port): void => {
  port.onMessage.addListener((msg) => {
    switch (msg.action) {
      case 'getSavedPassword':
        getSavedPassword(port, msg.url);
        break;
      case 'savePassword':
        console.log("about to save password");
        savePassword(port, msg.url, msg.password);
        break;
      case 'checkUser':
        checkUser(port);
        break;
      default:
        throw new Error("Action doesn't match");
    }
  });
}

const getSavedPassword = (port: chrome.runtime.Port, url: string): void => {
  chromeStorage.get('PasswordSafe').then((result: PasswordSafe) => {
    if (result !== undefined) {
      const user: User = result.users.find((user: User) => user.details.email === userEmail);
      const site: Url = user.sites.find((site: Url) => site.url === url);
      if (site) {
        const aes = new AESencryption(user.details.key, site.iv);
        const password = aes.decrypt(site.password);
        port.postMessage({ password });
      } else {
        port.postMessage({ password: null });
      }
    } else {
      port.postMessage({ password: null });
    }
  });
}

const savePassword = (port: chrome.runtime.Port, url: string, password: string): void => {
  console.log("saving password");
  chromeStorage.get('PasswordSafe').then((result: PasswordSafe) => {
    if (result !== undefined) {
      const user: User = result.users.find((user: User) => user.details.email === userEmail);
      const aes = new AESencryption(user.details.key);
      const site: Url = {
        url,
        password: aes.encrypt(password),
        iv: aes.iv,
        passLength: password.length
      };

      user.sites.push(site);
      chromeStorage.save('PasswordSafe', { users: result.users });
      console.log(result.users);
    }
  });
}
