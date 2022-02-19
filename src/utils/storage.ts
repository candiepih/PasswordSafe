/**
 * @class Storage
 * Storage class for storing and retrieving data
 * @author Alex Steve
 * @property {chrome.storage.SyncStorageArea} _storageKey - The key to use for the storage
 */
class Storage {
  private _storageKey: chrome.storage.SyncStorageArea;

  constructor() {
    this._storageKey = chrome.storage.sync;
  }

  /**
   * @method save
   * @description Sets a value in storage
   * @param {String} key The key to set
   * @param {String} value The value to set
   * @returns The value stored at the key or undefined if the key does not exist
   */
  public async save(key: string, value: unknown): Promise<unknown> {
    const savePromise = await this._storageKey.set({ [key]: value });
    return savePromise;
  }

  /**
   * @method get
   * @description Gets a value from storage
   * @param {String} key The key to get
   * @returns The value stored at the key or undefined if the key does not exist
   */
  public async get(key: string): Promise<unknown> {
    const result: object = await this._storageKey.get(key);
    return Object.values(result)[0];
  }
}
export default Storage;
