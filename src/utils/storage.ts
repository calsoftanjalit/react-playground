type StorageType = 'localStorage' | 'sessionStorage';

interface StorageOptions {
  storage?: StorageType;
}

/**
 * Get a value from storage with safe JSON parsing
 * @template T - The type of the value
 * @param key - Storage key
 * @param options - Storage options (default: localStorage)
 * @returns The parsed value or null if not found or parsing fails
 */
export function getFromStorage<T>(
  key: string,
  options?: StorageOptions
): T | null {
  try {
    const storage = getStorageInstance(options?.storage);
    const item = storage.getItem(key);

    if (!item) {
      return null;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to retrieve "${key}" from storage:`, error);
    return null;
  }
}

/**
 * Set a value in storage with JSON serialization
 * @template T - The type of the value
 * @param key - Storage key
 * @param value - The value to store
 * @param options - Storage options (default: localStorage)
 * @returns true if successful, false otherwise
 */
export function setInStorage<T>(
  key: string,
  value: T,
  options?: StorageOptions
): boolean {
  try {
    const storage = getStorageInstance(options?.storage);
    const serialized = JSON.stringify(value);
    storage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to store "${key}" in storage:`, error);
    return false;
  }
}

/**
 * Remove a specific key from storage
 * @param key - Storage key
 * @param options - Storage options (default: localStorage)
 * @returns true if successful, false otherwise
 */
export function removeFromStorage(
  key: string,
  options?: StorageOptions
): boolean {
  try {
    const storage = getStorageInstance(options?.storage);
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove "${key}" from storage:`, error);
    return false;
  }
}

/**
 * Clear all items from storage
 * @param options - Storage options (default: localStorage)
 * @returns true if successful, false otherwise
 */
export function clearStorage(options?: StorageOptions): boolean {
  try {
    const storage = getStorageInstance(options?.storage);
    storage.clear();
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
}

/**
 * Get the appropriate storage instance
 * @param storageType - Type of storage to use
 * @returns Storage instance (localStorage by default)
 */
function getStorageInstance(
  storageType?: StorageType
): Storage {
  if (storageType === 'sessionStorage') {
    return sessionStorage;
  }
  return localStorage;
}
