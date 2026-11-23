import { useSyncExternalStore } from 'react';
import { getParams } from './params';

/**
 * Cookielos, ohne personenbezogene Daten (Spec Abschnitt 4).
 * Adapter `console` (Review-Modus, Debug-Overlay). Der `beacon`-Adapter folgt mit dem Live-Endpunkt.
 */
export type TrackEvent =
  | 'view_landing' | 'step_view' | 'input' | 'result_view' | 'cta_open' | 'cta_click'
  | 'share_click' | 'share_complete' | 'gift_open' | 'complete' | 'reset';

export interface LoggedEvent {
  event: TrackEvent;
  ts: number;
  session: string;
  variant: string;
  src: string;
  ref: string;
  props: Record<string, string | number | boolean>;
}

const sessionId = Math.random().toString(36).slice(2, 10); // nur im Speicher
let variant = '-';
let log: LoggedEvent[] = [];
const listeners = new Set<() => void>();

export function setTrackingVariant(v: string) {
  variant = v;
}

export function track(event: TrackEvent, props: LoggedEvent['props'] = {}) {
  const p = getParams();
  const entry: LoggedEvent = {
    event, ts: Date.now(), session: sessionId, variant,
    src: p.src ?? '-', ref: p.ref ?? '-', props,
  };
  log = [...log.slice(-199), entry];
  if (import.meta.env.DEV) console.debug('[track]', entry);
  listeners.forEach((l) => l());
}

export function useEventLog(): LoggedEvent[] {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => log, () => log,
  );
}

export function clearEventLog() {
  log = [];
  listeners.forEach((l) => l());
}
