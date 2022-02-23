# PasswordSafe

A web extension for storing and retrieve users passwords. For instance when you are registering to a particular website it will suggest a strong password you can  use and store it so that it can be used to login to the website.

## Features

* Store and retrieve passwords
* Generate strong passwords with custom length and characters
* Sync passwords in storage so that you can use the same password on multiple devices
* Encrypt passwords using [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption algorithm and store them in a securely
* Autofill passwords for a website that you had already stored it's passwords.

## Installation

The extension isn't yet available in the Chrome store.

You can install it using the following steps:-

* Clone this repository
* Open google chrome and go to chrome://extensions
* Enable Developer mode
* Click on the "Load unpacked extension" button
* Select the folder named `dist` from the root of the cloned repository and click on the "Load" button
* After installing click the extension icon and pin to the toolbar as below

![step2](https://user-images.githubusercontent.com/44834632/155344471-915f55d7-a8e9-46dc-991f-d16d943d9e57.png)

* Now passwordSafe icon should appear at the toolbar.

## Usage

* If you are installing password safe for the first time, you will need to add a security key to start using it. Click the password safe icon and a popup should appear as below:-

![step3](https://user-images.githubusercontent.com/44834632/155346554-39a3f99b-b85d-4431-917e-2e5093cee2be.png)

* Serity key can be anything you want. ie. a phrase, a number, etc. Your will have to remember this key as it's used to encrypt and decrypt your passwords.
* After adding key a window similar to image below should appear.

![step4](https://user-images.githubusercontent.com/44834632/155349132-43da07f2-41d8-40ec-8b24-1815ece6901a.png)

* After visiting a site and registering password safe will try to generate a random password and prompt you if you wish to auto fill it.


![step6](https://user-images.githubusercontent.com/44834632/155349508-b9df2c3b-2242-4186-bec8-35121924524d.png)

register form reference https://stackoverflow.com

* Password will be saved and any time you login to the website password safe will retrieve the password for you and prompt to autofill it.

![step8](https://user-images.githubusercontent.com/44834632/155349753-b8c9fa3a-6517-40ac-9cf8-ccf9c5a1140a.png)

login page reference https://stackoverflow.com

* Any saved password should appear now on the popup window as shown below. Here you can view it, copy, or delete it. If you choose to delete, copy it because it will be deleted from storage and you will have to remember it for later use.

![step7](https://user-images.githubusercontent.com/44834632/155350501-73ed0a95-b810-46b6-85b2-bde1058468f8.png)

* You can generate random passwords and copy them to clipboard with password safe.

![step5](https://user-images.githubusercontent.com/44834632/155350704-49f2a8c9-6417-4d0b-9618-d64a585783b2.png)

## Author

Alex Steve @candiepih
