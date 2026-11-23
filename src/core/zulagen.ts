/**
 * Zulagen-Logik (Spec Abschnitt 3). Reine Funktionen, alle Konstanten an einer Stelle,
 * damit Compliance sie prüfen kann. Keine Rechnung in Komponenten.
 */
export const STAND = '2026-11';
export const GRUNDZULAGE = { grenze1: 360, satz1: 0.5, grenze2: 1800, satz2: 0.25 } as const;
export const KINDERZULAGE_MAX_PRO_KIND = 300;
export const BONUS_EINSTEIGER = 200; // einmalig, Vertrag vor dem 25. Geburtstag
export const MIN_EIGENBEITRAG_JAHR = 120; // vor Livegang gegen Gesetzestext prüfen
export const MAX_RATE_MONAT = 150; // = 1.800 € / 12
export const MIN_RATE_MONAT = 10;
export const GRUNDZULAGE_MAX = 540;

/**
 * 'konservativ': Eigenbeiträge zählen nur einmal, Kinderzulage = min(300 × Kinder, Eigenbeitrag).
 * 'je-kind': Kinderzulage = 300 × Kinder, sobald Eigenbeitrag vorhanden.
 * Vor dem Livegang gegen den Gesetzestext prüfen, die Seite darf nie mehr versprechen als zusteht.
 */
export type KinderzulageModell = 'konservativ' | 'je-kind';
export const KINDERZULAGE_MODELL: KinderzulageModell = 'konservativ';

/** Beamte werden wie Angestellte gerechnet (gleiche Zulagen). Vor Livegang gegen den Gesetzestext prüfen. */
export type Profil = 'angestellt' | 'beamter' | 'selbststaendig' | 'unter25';
export interface Eingabe {
  profil: Profil;
  kinder: number;
  monatsrate: number;
}

export interface Ergebnis {
  eigenbeitragJahr: number;
  grundzulage: number;
  kinderzulage: number;
  jaehrlicheZulage: number; // grundzulage + kinderzulage
  einmaligBonus: number; // 200 bei 'unter25', sonst 0 (nicht in jaehrlicheZulage)
  depotEinzahlungJahr: number; // eigenbeitragJahr + jaehrlicheZulage
  foerderquote: number; // jaehrlicheZulage / eigenbeitragJahr
  maxErreicht: boolean; // grundzulage === 540
  /** Jährliche Zulage, wenn die Rate um 10 € steigt (Nudge: Differenz zur aktuellen Zulage ist der Mehrwert). */
  zulageBeiPlus10: number;
}

export function berechneJahr(
  eigenbeitragJahr: number,
  kinder: number,
  modell: KinderzulageModell = KINDERZULAGE_MODELL,
): { grundzulage: number; kinderzulage: number } {
  if (eigenbeitragJahr < MIN_EIGENBEITRAG_JAHR) return { grundzulage: 0, kinderzulage: 0 };
  const b = Math.min(eigenbeitragJahr, GRUNDZULAGE.grenze2); // vor der Rechnung kappen
  const g = GRUNDZULAGE;
  const grundzulage = Math.round(
    Math.min(b, g.grenze1) * g.satz1 + Math.max(0, b - g.grenze1) * g.satz2,
  );
  const k = Math.max(0, Math.floor(kinder));
  const kinderRoh = KINDERZULAGE_MAX_PRO_KIND * k;
  const kinderzulage = Math.round(modell === 'konservativ' ? Math.min(kinderRoh, b) : kinderRoh);
  return { grundzulage, kinderzulage };
}

export function berechne(e: Eingabe): Ergebnis {
  const eigenbeitragJahr = e.monatsrate * 12;
  const { grundzulage, kinderzulage } = berechneJahr(eigenbeitragJahr, e.kinder);
  const jaehrlicheZulage = grundzulage + kinderzulage;
  const plus = berechneJahr(Math.min(e.monatsrate + 10, MAX_RATE_MONAT) * 12, e.kinder);
  return {
    eigenbeitragJahr,
    grundzulage,
    kinderzulage,
    jaehrlicheZulage,
    einmaligBonus: e.profil === 'unter25' ? BONUS_EINSTEIGER : 0,
    depotEinzahlungJahr: eigenbeitragJahr + jaehrlicheZulage,
    foerderquote: eigenbeitragJahr > 0 ? jaehrlicheZulage / eigenbeitragJahr : 0,
    maxErreicht: grundzulage === GRUNDZULAGE_MAX,
    zulageBeiPlus10: plus.grundzulage + plus.kinderzulage,
  };
}

/**
 * Teaser-Wert „bis zu“: Förderung bei 150 € im Monat (Höchstförderung).
 * Die Rate wird dem Kunden nicht abgefragt, siehe docs/KONZEPT-V2.md.
 */
export function maxZulage(profil: Profil, kinder: number): Ergebnis {
  return berechne({ profil, kinder, monatsrate: MAX_RATE_MONAT });
}
