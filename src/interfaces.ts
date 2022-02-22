// Urls interface
export interface Url {
  url: string;
  password: string;
  iv: string;
  passLength: number;
}

// User interface
export interface User {
  details: {
    email: string,
    key: string,
  },
  sites: Array<Url>;
}

// PasswordSafe interface
export interface PasswordSafe {
  users: Array<User>;
}

// Password filters
export interface PassswordFilter {
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
}

export type PassswordFilterKeys = keyof PassswordFilter;
