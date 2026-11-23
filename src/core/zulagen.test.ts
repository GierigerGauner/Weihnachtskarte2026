import { describe, expect, it } from 'vitest';
import { berechne, berechneJahr, maxZulage, MAX_RATE_MONAT, type Eingabe } from './zulagen';

const cases: Array<[string, number, number, number, number, number]> = [
  // Beschreibung, Eigenbeitrag/Jahr, Kinder, Grund, Kinder, Zulage/Jahr
  ['5 €/Monat, unter Mindestbeitrag', 60, 0, 0, 0, 0],
  ['10 €/Monat', 120, 0, 60, 0, 60],
  ['200 € im Jahr', 200, 0, 100, 0, 100],
  ['30 €/Monat', 360, 0, 180, 0, 180],
  ['50 €/Monat', 600, 0, 240, 0, 240],
  ['1.000 € im Jahr', 1000, 0, 340, 0, 340],
  ['100 €/Monat', 1200, 0, 390, 0, 390],
  ['100 €/Monat, 2 Kinder', 1200, 2, 390, 600, 990],
  ['150 €/Monat', 1800, 0, 540, 0, 540],
  ['150 €/Monat, 2 Kinder', 1800, 2, 540, 600, 1140],
  ['2.400 € über dem Förderdeckel', 2400, 0, 540, 0, 540],
  ['30 €/Monat, 2 Kinder (konservativ)', 360, 2, 180, 360, 540],
];

describe('berechneJahr', () => {
  it.each(cases)('%s', (_n, beitrag, kinder, grund, kind, gesamt) => {
    const r = berechneJahr(beitrag, kinder, 'konservativ');
    expect(r.grundzulage).toBe(grund);
    expect(r.kinderzulage).toBe(kind);
    expect(r.grundzulage + r.kinderzulage).toBe(gesamt);
  });

  it('Modell je-kind zahlt unabhängig vom Eigenbeitrag 300 € je Kind', () => {
    expect(berechneJahr(360, 2, 'je-kind').kinderzulage).toBe(600);
  });
});

describe('berechne', () => {
  const basis: Eingabe = { profil: 'angestellt', kinder: 0, monatsrate: 100 };

  it('Beispiel der Quelle: 100 €, 2 Kinder → 990 € und Vertrag wächst auf 2.190 €', () => {
    const r = berechne({ ...basis, kinder: 2 });
    expect(r.jaehrlicheZulage).toBe(990);
    expect(r.depotEinzahlungJahr).toBe(2190);
  });

  it('Einmal-Bonus nur bei Profil unter25 und nicht in der jährlichen Zulage', () => {
    expect(berechne({ ...basis, profil: 'unter25' }).einmaligBonus).toBe(200);
    expect(berechne({ ...basis, profil: 'unter25' }).jaehrlicheZulage).toBe(390);
    expect(berechne({ ...basis, profil: 'angestellt' }).einmaligBonus).toBe(0);
    expect(berechne({ ...basis, profil: 'selbststaendig' }).einmaligBonus).toBe(0);
  });

  it('maxErreicht erst bei 150 €', () => {
    expect(berechne({ ...basis, monatsrate: 150 }).maxErreicht).toBe(true);
    expect(berechne({ ...basis, monatsrate: 140 }).maxErreicht).toBe(false);
  });

  it('Zulage ist monoton steigend in der Rate und liefert ganzzahlige Posten', () => {
    let letzte = -1;
    for (let rate = 10; rate <= MAX_RATE_MONAT; rate += 10) {
      const r = berechne({ ...basis, kinder: 3, monatsrate: rate });
      expect(r.jaehrlicheZulage).toBeGreaterThanOrEqual(letzte);
      expect(Number.isInteger(r.grundzulage)).toBe(true);
      expect(Number.isInteger(r.kinderzulage)).toBe(true);
      letzte = r.jaehrlicheZulage;
    }
  });

  it('zulageBeiPlus10 ist die Zulage bei Rate + 10 €, bei 150 € ohne Zuwachs', () => {
    expect(berechne({ ...basis, monatsrate: 50 }).zulageBeiPlus10).toBe(berechne({ ...basis, monatsrate: 60 }).jaehrlicheZulage);
    const max = berechne({ ...basis, monatsrate: 150 });
    expect(max.zulageBeiPlus10).toBe(max.jaehrlicheZulage);
  });

  it('Förderquote = Zulage / Eigenbeitrag', () => {
    expect(berechne({ ...basis, monatsrate: 150 }).foerderquote).toBeCloseTo(0.3);
  });
});

describe('maxZulage (Teaser „bis zu“)', () => {
  it('ohne Kinder 540 €, mit 2 Kindern 1.140 € (Tabelle der Spec)', () => {
    expect(maxZulage('angestellt', 0).jaehrlicheZulage).toBe(540);
    expect(maxZulage('angestellt', 2).jaehrlicheZulage).toBe(1140);
  });

  it('300 € je Kind, bis 4 Kinder', () => {
    for (let k = 0; k <= 4; k++) expect(maxZulage('angestellt', k).kinderzulage).toBe(300 * k);
  });

  it('Beamte bekommen dieselbe Förderung wie Angestellte, ohne Einmal-Bonus', () => {
    for (let k = 0; k <= 4; k++) {
      expect(maxZulage('beamter', k).jaehrlicheZulage).toBe(maxZulage('angestellt', k).jaehrlicheZulage);
    }
    expect(maxZulage('beamter', 2).einmaligBonus).toBe(0);
  });

  it('unter 25: Einmal-Bonus 200 € zusätzlich', () => {
    expect(maxZulage('unter25', 1).einmaligBonus).toBe(200);
    expect(maxZulage('unter25', 1).jaehrlicheZulage).toBe(840);
  });
});
