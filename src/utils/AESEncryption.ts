import { AES, enc, SHA256 } from 'crypto-ts';

/**
 * Encrypts a string using AES-256-CBC
 * @class AESEncryption
 * @param {string} key - The key to use for encryption
 */
class AESEncryption {
  constructor(private key: string) {
    this.key = SHA256(key).toString();
  }

  /**
   * @method encrypt
   * Encrypts a string using AES-256-CBC
   * @param {String} text The text to encrypt
   * @returns The encrypted text
   * @throws Error if the text is not a string
   */
  encrypt(text: string): string {
    if (typeof text === 'object') {
      text = JSON.stringify(text);
    } else if (typeof text !== 'string') {
      throw new Error('The text to encrypt must be a string or an object');
    }
    const cipherText: string = AES.encrypt(text, this.key).toString();
    return cipherText;
  }

  /**
   * @method decrypt
   * @description Decrypts a string using AES-256-CBC
   * @param {String} text The text to decrypt
   * @returns The decrypted text
   * @throws Error if the text is not a string
   */
  decrypt(text: string): string {
    if (typeof text !== 'string') {
      throw new Error('The text to decrypt must be a string');
    }
    const plainText: string = AES.decrypt(text, this.key).toString(enc.Utf8);
    return plainText;
  }
}

export default AESEncryption;
