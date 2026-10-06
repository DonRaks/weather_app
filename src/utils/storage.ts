/**
 * Storage Utilities
 *
 * Provides SSR-safe wrappers around the Web Storage API (localStorage)
 * with robust error handling, schema serialization, and default fallbacks.
 */

/**
 * Safely reads and deserializes a JSON value from localStorage.
 *
 * @template T
 * @param {string} key - The localStorage item key.
 * @param {T} fallback - The default fallback value returned if retrieval or parsing fails.
 * @returns {T} The parsed object or the fallback value.
 */
export function getStoredJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to read ${key} from storage:`, e);
    return fallback;
  }
}

/**
 * Safely serializes and persists a value to localStorage.
 *
 * @template T
 * @param {string} key - The localStorage item key.
 * @param {T} data - The data to serialize and store.
 * @returns {void}
 */
export function setStoredJSON<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to write ${key} to storage:`, e);
  }
}
