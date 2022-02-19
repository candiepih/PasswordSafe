import { AES, enc, SHA256 } from 'crypto-ts';
import * as crypto from "crypto";

/**
 * Encrypts a string using AES-256-CBC
 * @class AESEncryption
 * @param {string} key - The key to use for encryption
 */
class AESencryption {
  /**
   * @method encrypt
   * Encrypts a string using AES-256-CBC
   * @param {String} text The text to encrypt
   * @returns The encrypted text
   * @throws Error if the text is not a string
   */
  public static encrypt(text: string, key: string): string {
    if (typeof text === 'object') {
      text = JSON.stringify(text);
    } else if (typeof text !== 'string') {
      throw new Error('The text to encrypt must be a string or an object');
    }
    const cipherText: string = AES.encrypt(text, key).toString();
    return cipherText;
  }

  /**
   * @method decrypt
   * @description Decrypts a string using AES-256-CBC
   * @param {String} text The text to decrypt
   * @returns The decrypted text
   * @throws Error if the text is not a string
   */
  public static decrypt(text: string, key: string): string {
    if (typeof text !== 'string') {
      throw new Error('The text to decrypt must be a string');
    }
    const plainText: string = AES.decrypt(text, key).toString(enc.Utf8);
    return plainText;
  }

  /**
   * @method generateKey
   * @description Generates a key for encryption
   * @returns {string} The generated key
   * @throws Error if the key is not a string
   */
  public static encryptSecretKey(key: string): string {
    const encKey = crypto.createHash('sha256').update(key).digest('hex');
    return encKey;
  }
}

export default AESencryption;
