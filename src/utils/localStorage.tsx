type StorageValue = string | number | boolean | object | null;

export function setLocalStorageItem<T extends StorageValue>(key: string, value: T): void {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error setting localStorage item '${key}':`, error);
  }
}

export function getLocalStorageItem<T extends StorageValue>(key: string, defaultValue: T): T {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Error getting localStorage item '${key}':`, error);
    return defaultValue;
  }
}

export function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage item '${key}':`, error);
  }
}