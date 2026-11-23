import { useSyncExternalStore } from 'react';

let current: { id: number; text: string } | null = null;
let nextId = 1;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;

export function toast(text: string) {
  current = { id: nextId++, text };
  listeners.forEach((l) => l());
  clearTimeout(timer);
  timer = setTimeout(() => {
    current = null;
    listeners.forEach((l) => l());
  }, 2000);
}

export function useToast() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => current, () => current,
  );
}
