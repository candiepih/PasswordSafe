interface PassswordFilter {
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
}

const pattern = {
  lower: 'a-z',
  upper: 'A-Z',
  number: '0-9',
  symbol: '!"\\#\\$\%\\&\'()\\*\\+,-.\\/:;<=>\\?@\\[\\]\\^_\'\\|'
};

const getRegularExpression = (match: string): RegExp => {
  const strPattern = `[${match}]`;
  const pattern = new RegExp(strPattern);
  return pattern;
}

const getRandomByte = (): number => {
  // regular expression
  const holder = new Uint8Array(1);
  window.crypto.getRandomValues(holder);
  return holder[0];
};

const generatePassword = (filter: PassswordFilter, length: number) => {
  // const filters = Object.keys(filter).filter(key => filter[key]);
  // const regex: RegExp = getRegularExpression(filterChars.join(''));
  // const arr = Array.from({ length }, () => {
  //   while (true) {
  //     const randomByte = getRandomByte();
  //     const char = String.fromCharCode(randomByte);
  //     if (regex.test(char)) {
  //       return char;
  //     }
  //   }
  // });
  // return arr.join('');
}


export default generatePassword;
