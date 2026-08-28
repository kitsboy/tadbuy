import { useState, useEffect } from 'react';

/**
 * Internal Tadbuy namespacing prefix for all localStorage keys.
 * All keys should start with this to avoid collisions with other apps
 * hosted on the same origin (e.g., giveabit.io, satohash.giveabit.io).
 */
export const TADBUY_LS_PREFIX = 'tadbuy:';

function prefixed(key: string): string {
  return key.startsWith(TADBUY_LS_PREFIX) ? key : TADBUY_LS_PREFIX + key;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const fullKey = prefixed(key);
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(fullKey);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to save "${fullKey}":`, error);
    }
  };

  return [storedValue, setValue];
}
