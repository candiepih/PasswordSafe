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

// Response from background script `getSavedPassword` method
export interface RetrievePasswordResponse {
  password: string;
  url?: string;
  passLength?: number
}

export type PassswordFilterKeys = keyof PassswordFilter;
