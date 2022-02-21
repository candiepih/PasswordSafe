import AESencryption from './utils/AESencryption';
import Storage from './utils/storage';
import { User, PasswordSafe } from './interfaces';
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
