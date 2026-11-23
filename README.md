# Weihnachtskarte QR – Teaser-App

Eine Seite hinter dem QR-Code der Weihnachtskarte: Baum, zwei Geschenke (Staat und Krankenkasse). Konzept: `docs/KONZEPT-V2.md`. Frühere Prototypen (A, B, C, Berater-Features): `archive/`.

```bash
npm install
npm run dev      # http://localhost:5173/, im WLAN auch am Handy über die „Network“-Adresse
npm test         # Zulagen-Logik
npm run lint     # TypeScript strict
npm run build
```

Links: `/?src=karte`, Empfänger-Ansicht `/?ref=share`, `&debug=1` zeigt Event-Log und Reset. Auf der Startseite setzt „Zurücksetzen“ (oben rechts) die App zurück, etwa für die nächste Vorführung.

## Deployment (Cloudflare Pages)

Build-Befehl `npm run build`, Ausgabeordner `dist`, Node 20 oder neuer. `public/_headers` setzt Sicherheits-Header (strenge CSP, keine externen Quellen) und Caching für `/assets/*`. Unbekannte Pfade landen per Router auf `/`. `robots.txt` und `noindex` halten die Seite aus Suchmaschinen.
