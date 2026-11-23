import { useSyncExternalStore } from 'react';

/** Zustand des Datenschutz-Fensters. Der Footer steht auf jeder Seite, das Fenster liegt einmal im Phone-Frame. */
let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const openDatenschutz = () => { open = true; emit(); };
export const closeDatenschutz = () => { open = false; emit(); };

export function useDatenschutzOpen(): boolean {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => open, () => open,
  );
}
