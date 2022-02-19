import AESencryption from './utils/AESencryption';
import Storage from './utils/storage';

// globals
const chromeStorage: Storage = new Storage();
let userEmail = "";

// chrome.storage.sync.remove('PasswordSafe');
// chromeStorage.get('PasswordSafe').then((result: PasswordSafe) => {
//   console.log(result);
// });

// user interface
interface User {
  email: string;
  key: string;
  sites: Array<string>;
}

interface PasswordSafe {
  users: Array<User>;
}

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
      case 'sendKey':
        sendKey(port, msg.key);
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
      const user: User = result.users.find((user: User) => user.email === userEmail);
      if (user) {
        port.postMessage({ isNew: false });
      } else {
        port.postMessage({ isNew: true });
      }
    }
  });
}

/**
 * @method sendKey
 * @description saves key to the storage and replies to the port
 * @param {Port} port
 * @param {string} key
 * @returns {void}
 */
const sendKey = (port: chrome.runtime.Port, key: string): void => {
  // console.log(AESencryption.encryptSecretKey("sending key"));
  chromeStorage.get('PasswordSafe').then(async (result: PasswordSafe) => {
    const user: User = {
      email: userEmail,
      key: AESencryption.encryptSecretKey(key),
      sites: []
    };

    if (result === undefined) {
      await chromeStorage.save('PasswordSafe', { users: [user] });
    } else {
      await chromeStorage.save('PasswordSafe', { users: [...result.users, user] });
    }
    port.postMessage({ isNew: false });
  });
}
