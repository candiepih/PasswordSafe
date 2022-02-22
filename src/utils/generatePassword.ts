import { PassswordFilter, PassswordFilterKeys } from "../interfaces";

const pattern = {
  lower: 'a-z',
  upper: 'A-Z',
  number: '0-9',
  symbol: '!"\\#\\$\%\\&\'()\\*\\+,-.\\/:;<=>\\?@\\[\\]\\^_\'\\|'
};

/**
 * @method getRegularExpression
 * @description generates a regular expression from the pattern
 * @param {string} pattern string of characters to be filtered
 * @returns {RegExp} regular expression
 */
const getRegularExpression = (match: string): RegExp => {
  const strPattern = `[${match}]`;
  const pattern = new RegExp(strPattern);
  return pattern;
}

/**
 * @method getRandomByte
 * @description generates a random byte
 * @returns {number} random byte
 */
const getRandomByte = (): number => {
  const holder = new Uint8Array(1);
  window.crypto.getRandomValues(holder);
  return holder[0];
};

/**
 * @method generatePassword
 * @description generates a password from the filters
 * @param {PassswordFilter} filter object of upper,lower,number,symbol booleans
 * @param {number} length expected length of password
 * @returns {string} generated password
 */
const generatePassword = (filter: PassswordFilter, length: number) => {
  const filteredKeys = Object.keys(filter).filter((key: PassswordFilterKeys) => filter[key]);
  const filteredPatterns = filteredKeys.map((key: PassswordFilterKeys) => pattern[key]);
  const regex: RegExp = getRegularExpression(filteredPatterns.join(''));
  const arr = Array.from({ length }, () => {
    while (true) {
      const randomByte = getRandomByte();
      const char = String.fromCharCode(randomByte);
      if (regex.test(char)) {
        return char;
      }
    }
  });
  return arr.join('');
}


export default generatePassword;
