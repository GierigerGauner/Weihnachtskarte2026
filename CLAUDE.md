# Projekt: Weihnachtskarte QR (Teaser-App)

Spezifikation (Ursprung): docs/SPEC.md. Aktuelles Konzept: docs/KONZEPT-V2.md (gilt, wo es der Spec widerspricht).

## Regeln
- UI-Texte sind Deutsch in Du-Form und stehen nur in src/core/copy.de.ts, nie direkt in Komponenten.
- Die App teasert nur und macht neugierig. Keine Marken- und Versicherungsnamen (weder Vermittler noch Anbieter),
  keine Beraternamen, keine Details, die ein Beratungsgespräch überflüssig machen. Jeder Betrag ist ein „bis zu“.
  Einzige Ausnahme: der Krankenkassen-Bonus (300 € jährlich, fester Betrag, Entscheidung 11/2026).
- Es gibt zwei Geschenke (Staat/Altersvorsorgedepot, Krankenkasse/Bonus), beide gleichwertig. Krebs-Früherkennung und der
  Zahnzusatz-Ansatz sind raus (Krebs-Geschenk liegt in archive/v2-krebs-geschenk).
- Call to Action: Kaffee oder Tee, ein Termin zwischen den Feiertagen oder im neuen Jahr („Auf einen Kaffee oder Tee im neuen Jahr“).
  Er erscheint erst im Abschluss nach „Zum Schluss“, nie am Ende eines Geschenks. Davor machen Texte nur neugierig
  („erfährst du zum Schluss“), ohne Kaffee, Tee, Termin oder Berater-Button.
  Keine Namen, keine Nummern, kein Rückruf-Formular. Die Berater-Features liegen in archive/v1-prototypen und können später
  zurückkommen. Berater kontaktieren geht nur per WhatsApp ohne feste Nummer (src/core/contact.ts): vorbereitete Nachricht,
  der Kunde wählt seinen Berater selbst. Die Empfehlungsprämie (50 €, Weitersagen per WhatsApp oder Link) steht nur im Abschluss,
  nicht im Kaffee-oder-Tee-Fenster. Der Kunde schickt selbst, wir fragen keine Kontakte ab. wa.me wird erst beim Tippen geöffnet,
  die Seite lädt nichts von dort.
- Es gibt kein Impressum (Entscheidung 11/2026) und keine Adresse in der App. Der Datenschutz-Text steht in src/core/copy.de.ts (`legal`).
  Die Krankenkasse heißt „die Krankenkasse“, nicht „deine“.
- Zulagen werden ausschließlich über src/core/zulagen.ts berechnet (Teaser: maxZulage). Keine Rechnung in Komponenten.
- Keine Third-Party-Skripte, keine Cookies, keine externen Requests. Schriften selbst hosten.
- Animationen nur mit transform und opacity (Ausnahme: Zahlen-Hochzählen). Jede Animation hat einen prefers-reduced-motion-Fallback.
- Tap-Ziele mindestens 48 px, Kontrast mindestens 4,5:1.
- Design: Farben, Schriften, Radien nur aus src/core/theme/tokens.css. Keine Hex-Werte in Komponenten. Rot nie auf Navy, auf Limette Navy statt Weiß.
- Vor jedem Abschluss: npm test, npm run lint.
