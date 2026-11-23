import { useSyncExternalStore } from 'react';

/**
 * Parameter beim ersten Aufruf in sessionStorage ablegen. Es gibt keine Berater-Parameter mehr:
 * Die Seite ist neutral, der Kunde meldet sich bei dem Berater, von dem er die Karte hat.
 * - src: Herkunft (`karte`, `share`, `review`)
 * - ref: `share`, wenn der Aufruf von einem Kunden weitergeleitet wurde
 */
export const PARAM_KEYS = ['src', 'ref'] as const;
export type ParamKey = (typeof PARAM_KEYS)[number];
export type Params = Partial<Record<ParamKey, string>>;

const STORE = 'tw:params';
const listeners = new Set<() => void>();

function readUrl(): Params {
  const out: Params = {};
  if (typeof location === 'undefined') return out;
  const q = new URLSearchParams(location.search);
  for (const k of PARAM_KEYS) {
    const v = q.get(k);
    if (v) out[k] = v.slice(0, 40);
  }
  return out;
}

function readStored(): Params {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) ?? '{}') as Params;
  } catch {
    return {};
  }
}

function persist(p: Params) {
  try {
    sessionStorage.setItem(STORE, JSON.stringify(p));
  } catch {
    /* privater Modus: Zustand bleibt im Speicher */
  }
}

/**
 * Ein neuer Link (andere Parameter als beim letzten Aufruf) startet die App frisch.
 * Ein Reload mit demselben Link behält den Zustand.
 */
function resetOnNewEntry(fromUrl: Params) {
  try {
    const sig = JSON.stringify(fromUrl);
    if (sessionStorage.getItem('tw:entry') !== sig) {
      sessionStorage.removeItem('tw:app');
      sessionStorage.setItem('tw:entry', sig);
    }
  } catch {
    /* ignorieren */
  }
}

function init(): Params {
  const fromUrl = readUrl();
  if (Object.keys(fromUrl).length > 0) {
    resetOnNewEntry(fromUrl);
    persist(fromUrl);
    return fromUrl;
  }
  return readStored();
}

let state: Params = init();

export function getParams(): Params {
  return state;
}

export function clearParams() {
  state = {};
  persist(state);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useParams(): Params {
  return useSyncExternalStore(subscribe, getParams, getParams);
}

export function isReceiver(p: Params): boolean {
  return p.ref === 'share';
}
