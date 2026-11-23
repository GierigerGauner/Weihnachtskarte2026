export const NBSP = ' ';

/** „1.140 €“ mit Tausenderpunkt und geschütztem Leerzeichen. */
export function eur(n: number): string {
  return `${Math.round(n).toLocaleString('de-DE')}${NBSP}€`;
}

export const START_DATUM = '2027-01-01';

/** Tage bis zum Start, gerechnet in der Zeitzone Europe/Berlin. */
export function tageBisStart(now: Date = new Date()): number {
  const heute = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(now); // YYYY-MM-DD
  const ms = Date.parse(`${START_DATUM}T00:00:00Z`) - Date.parse(`${heute}T00:00:00Z`);
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function vibrate(ms: number) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* nicht verfügbar */
  }
}
