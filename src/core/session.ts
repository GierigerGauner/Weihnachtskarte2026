import { useCallback, useEffect, useRef, useState } from 'react';

const PREFIX = 'tw:';

export function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeSession<T>(key: string, value: T) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignorieren */
  }
}

/** useState, der in sessionStorage gespiegelt wird (Reload behält den Zustand). */
export function usePersisted<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(() => readSession(key, initial));
  const ref = useRef(value);
  ref.current = value;
  useEffect(() => writeSession(key, value), [key, value]);
  const reset = useCallback(() => setValue(initial), [initial]);
  return [value, setValue, reset];
}

/** Löscht den Zustand aller Varianten (Reset im Review-Modus). */
export function clearAllSession() {
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignorieren */
  }
}
