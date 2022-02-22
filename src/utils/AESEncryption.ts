import { Buffer } from 'buffer';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const encryptionType = 'aes-256-cbc';
const encryptionEncoding = 'hex';
const bufferEncryption = 'utf8';
const keyLength = 32;
// iv length 16 but we will use only 8 bytes due to the fact that
// we are converting to hex which takes twice as many bytes needed
const ivLength = 8;

/**
 * Encrypts a string using AES-256-CBC
 * @class AESEncryption
 * @param {string} key - The key to use for encryption
 * @param {string} iv - The initialization vector to use for encryption
 * @author Alex Steve
 * @example
 * const aes = new AESEncryption('mySecretKey');
 * const encrypted = aes.encrypt('mySecretMessage');
 * const decrypted = aes.decrypt(encrypted);
 */
class AESencryption {
  private _iv: string;
  private _key: string;

  constructor(key: string, iv?: string) {
    if (!key || typeof key !== 'string') {
      throw new Error('The key must be a string');
    }
    this._key = key;
    this._iv = (iv === undefined ? this.generateRandomIV() : iv);
  }

  /**
   * @getter iv
   * @description Gets the initialization vector
   * @returns {string} The initialization vector
   */
  get iv(): string {
    return this._iv;
  }

  /**
   * @method generateRandomIV
   * @description Generates a random (Initialization Vector)IV for encryption
   * @returns {string} The generated IV
   */
  private generateRandomIV(): string {
    const iv = randomBytes(ivLength).toString(encryptionEncoding);
    return iv;
  }

  /**
   * @method encrypt
   * Encrypts a string using AES-256-CBC encryption
   * @param {String} text The text to encrypt
   * @returns The encrypted text
   * @throws Error if the text is not a string
   */
  public encrypt(text: string): string {
    if (typeof text === 'object') {
      text = JSON.stringify(text);
    } else if (typeof text !== 'string') {
      throw new Error('The text to encrypt must be a string or an object');
    }
    const key = Buffer.from(this._key, bufferEncryption);
    const iv = Buffer.from(this._iv, bufferEncryption);
    const cipher = createCipheriv(encryptionType, key, iv);
    let encrypted = cipher.update(text, bufferEncryption, encryptionEncoding);
    encrypted += cipher.final(encryptionEncoding);
    return encrypted;
  }

  /**
   * @method decrypt
   * @description Decrypts a string using AES-256-CBC encryption
   * @param {String} text The text to decrypt
   * @returns The decrypted text
   * @throws Error if the text is not a string
   */
  public decrypt(text: string): string {
    if (typeof text !== 'string') {
      throw new Error('The text to decrypt must be a string');
    }
    const buff = Buffer.from(text, encryptionEncoding);
    const key = Buffer.from(this._key, bufferEncryption);
    const iv = Buffer.from(this._iv, bufferEncryption);
    const decipher = createDecipheriv(encryptionType, key, iv);
    const deciphered = decipher.update(buff) + decipher.final(bufferEncryption);
    return deciphered;
  }

  /**
   * @method encryptSecretKey
   * @description Generates a key for encryption
   * @returns {string} The generated key
   * @throws Error if the key is not a string
   */
  public static encryptSecretKey(key: string): string {
    const encKey = createHash('sha256').update(key).digest('hex').substring(0, keyLength);
    return encKey;
  }
}

export default AESencryption;
