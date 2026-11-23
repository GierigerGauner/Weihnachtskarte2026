import { useSyncExternalStore } from 'react';

/** Weißer Lichtblitz über dem ganzen Frame: verdeckt den Wechsel zwischen zwei Screens beim Auspacken. */
let n = 0;
const listeners = new Set<() => void>();

export function triggerFlash() {
  n += 1;
  listeners.forEach((l) => l());
}

export function useFlash() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => n, () => n,
  );
}
