/**
 * Alle UI-Texte (Deutsch, Du-Form). Compliance kann diese Datei ohne Code-Kenntnisse prüfen.
 * Teaser-Regeln: keine Marken- und Versicherungsnamen, keine Berater-Namen, keine Details,
 * die den Beratungstermin überflüssig machen. Beträge sind ein „bis zu“, einzige Ausnahme
 * ist der Krankenkassen-Bonus (fester Betrag, Entscheidung 11/2026, siehe docs/KONZEPT-V2.md).
 */
import { eur } from './format';

export const legal = {
  datenschutz: 'Datenschutz',
  datenschutzIntro: 'Kurz gesagt: Diese Seite setzt keine Cookies, nutzt kein Tracking und speichert nichts über dich.',
  datenschutzSections: [
    {
      title: 'Verantwortlich',
      body: 'Verantwortlich ist der Absender der Weihnachtskarte, bei dem du die Karte erhalten hast. Wende dich bei Fragen zum Datenschutz direkt an ihn.',
    },
    {
      title: 'Was auf deinem Gerät passiert',
      body: 'Die Seite läuft in deinem Browser. Deine Eingaben, etwa Alter oder Einkommen, werden nicht gesendet und nicht gespeichert. Damit die Seite nach einem Neuladen am selben Punkt weitermacht, merkt sich dein Browser den Stand, bis du den Tab schließt. Dabei wird nichts an uns übertragen. Es gibt keine Cookies und keine Werbe- oder Analyse-Dienste.',
    },
    {
      title: 'Hosting',
      body: 'Die Seite liegt bei Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA. Beim Aufruf verarbeitet Cloudflare technisch notwendige Verbindungsdaten wie deine IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse und Angaben zu deinem Browser, um die Seite auszuliefern und vor Missbrauch zu schützen. Rechtsgrundlage ist das berechtigte Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Cloudflare ist unter dem EU-US Data Privacy Framework zertifiziert.',
    },
    {
      title: 'Schriften und Inhalte',
      body: 'Alle Schriften und Bilder liegen auf demselben Server. Es werden keine Inhalte von anderen Anbietern nachgeladen.',
    },
    {
      title: 'WhatsApp',
      body: 'Wenn du eine Nachricht per WhatsApp weitersagst oder an deinen Berater schickst, öffnet sich WhatsApp mit einem vorbereiteten Text. Erst dann wird eine Verbindung zu WhatsApp aufgebaut. Du siehst den Text vorher und entscheidest selbst, ob und an wen du ihn schickst. Wir erhalten die Nachricht nicht und fragen keine Kontakte ab. Für WhatsApp gilt dessen eigene Datenschutzerklärung.',
    },
    {
      title: 'Deine Rechte',
      body: 'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren.',
    },
  ],
  disclaimerAv:
    'Beispielrechnung nach dem Altersvorsorgereformgesetz, Stand 11/2026. Die Zulage setzt eigene Beiträge voraus, für die Höchstförderung sind 150 € im Monat nötig. Ob und wie sich ein bestehender Vertrag übertragen lässt, hängt vom Vertrag ab. Keine Anlageberatung, keine Rendite- oder Steuerberechnung. Ob und wie sich das Depot für Wohneigentum nutzen lässt, klärst du im Gespräch.',
  disclaimerKk:
    'Der Bonus gilt für gesetzlich Versicherte, die die Voraussetzungen erfüllen. Er wird nicht automatisch ausgezahlt und muss jedes Jahr neu angefordert werden. Höhe und Bedingungen können sich ändern.',
};

export const common = {
  back: 'Zurück',
  next: 'Weiter',
  close: 'Schließen',
  yes: 'Ja',
  no: 'Nein',
  countdown: (n: number) => (n > 0 ? `Noch ${n} ${n === 1 ? 'Tag' : 'Tage'} bis zum Start` : 'Jetzt am Start'),
  advisorCta: 'Auf einen Kaffee oder Tee im neuen Jahr',
  backToGifts: 'Zurück zu den Geschenken',
  progress: (cur: number, total: number) => `Schritt ${cur} von ${total}`,
  copied: 'Link kopiert',
};

/** Countdown-Chip, erscheint erst bei der Enthüllung des Altersvorsorge-Geschenks. */
export const tageLabel = (n: number) => common.countdown(n);

export type GiftId = 'av' | 'kk';

export const intro = {
  headline: ['Für dich liegen ', 'zwei', ' Geschenke unterm Baum'] as const,
  sub: 'Pack sie in deiner Reihenfolge aus.',
  subReceiver: 'Jemand hat an dich gedacht. Pack die Geschenke in deiner Reihenfolge aus.',
  hint: 'Tippe auf ein Geschenk',
  opened: (n: number) => `${n} von 2 ausgepackt`,
  next: 'Zum Schluss',
  reset: 'Zurücksetzen',
  resetDone: 'App zurückgesetzt',
  gifts: {
    av: { label: 'Vom Staat', sub: 'Geschenk 1' },
    kk: { label: 'Von der Krankenkasse', sub: 'Geschenk 2' },
  } satisfies Record<GiftId, { label: string; sub: string }>,
};

export const wrapped = {
  av: { title: ['Das Geschenk ', 'vom Staat', ' liegt bereit'] as const },
  kk: { title: ['Das Geschenk ', 'von der Krankenkasse', ' liegt bereit'] as const },
  sub: 'Tippe, um es zu öffnen.',
  hint: 'Tippe auf das Geschenk',
};

/* Geschenk 1: Altersvorsorgedepot */
export const av = {
  steps: 5,
  profil: {
    title: ['Wer packt ', 'hier', ' aus?'] as const,
    angestellt: { label: 'Angestellt', sub: 'Festanstellung, Teilzeit, Minijob' },
    beamter: { label: 'Beamtin oder Beamter', sub: 'Im Staatsdienst, auch auf Widerruf' },
    selbststaendig: { label: 'Selbstständig', sub: 'Gewerbe, freie Arbeit, Versorgungswerk' },
    unter25: { label: 'Unter 25', sub: 'Ausbildung, Studium, Berufseinstieg' },
    note: 'Wer unter 25 ist, wählt „Unter 25“.',
  },
  kinder: {
    title: ['Gibt es ', 'Kinder', ', oder sind welche geplant?'] as const,
    hint: 'Auch geplante Kinder zählen mit.',
    none: 'Keine Kinder',
    count: (n: number) => (n === 1 ? '1 Kind' : `${n} Kinder`),
  },
  riester: {
    title: ['Hast du schon einen ', 'Riester-Vertrag', '?'] as const,
    sub: 'Also einen bestehenden Vertrag mit staatlicher Zulage.',
    yes: 'Ja, habe ich',
    no: 'Nein, keinen',
  },
  home: {
    q1: {
      title: ['Träumst du von den ', 'eigenen vier Wänden', '?'] as const,
      sub: 'Du hast noch kein Eigenheim, möchtest aber irgendwann eins.',
      yes: 'Ja, das wäre mein Traum',
      no: 'Nein, eher nicht',
    },
    q2: {
      title: ['Zahlst du gerade ein ', 'Eigenheim', ' ab?'] as const,
      sub: 'Du hast bereits eine laufende Finanzierung.',
      yes: 'Ja, es läuft noch',
      no: 'Nein',
    },
    q3: {
      title: ['Gehört dir schon ein ', 'abbezahltes', ' Eigenheim?'] as const,
      sub: 'Vielleicht steht in ein paar Jahren eine Sanierung an.',
      yes: 'Ja, es ist abbezahlt',
      no: 'Nein',
    },
  },
  result: {
    title: ['Das legt der ', 'Staat', ' für dich dazu'] as const,
    upTo: 'bis zu',
    perYear: 'pro Jahr',
    needs: 'Voraussetzung: eigene Beiträge. Für die Höchstförderung sind 150 € im Monat nötig.',
    grund: (n: number) => `Grundzulage: bis zu ${eur(n)}`,
    kinder: (n: number, je: number) => `Kinderzulage: ${eur(je)} pro Kind (${n} ${n === 1 ? 'Kind' : 'Kinder'})`,
    bonus: (n: number) => `Berufseinsteigerbonus: ${eur(n)} einmalig`,
    home: {
      traum: 'Das kann dir helfen, schneller in die eigenen vier Wände zu kommen.',
      finanzierung: 'Das kann dir helfen, dein Eigenheim schneller abzubezahlen.',
      sanierung: 'Das kann dir helfen, für die nächste Sanierung vorzusorgen.',
      altersvorsorge: 'Das kann dir helfen, dir deine Altersvorsorge aufzubauen.',
    },
    tease: 'Wie das genau geht, erfährst du zum Schluss.',
    riester: {
      title: 'Dein Riester-Guthaben kann mit umziehen',
      body: 'Das bisher angesparte Vertragsguthaben lässt sich förderunschädlich mitübertragen.',
      tease: 'Wie das geht, erfährst du zum Schluss.',
    },
    startLabel: 'Der Start',
  },
  question: {
    traum: 'Wie komme ich mit Hilfe vom Staat schneller zu meinem Eigenheim?',
    finanzierung: 'Wie zahle ich mein Eigenheim mit staatlicher Hilfe schneller ab?',
    sanierung: 'Wie lege ich schon jetzt mit Förderung für die nächste Sanierung zurück?',
    altersvorsorge: 'Wie baue ich mir mit staatlicher Förderung meine Altersvorsorge auf?',
    riester: 'Wie nehme ich mein Riester-Guthaben förderunschädlich mit?',
  },
};

/* Geschenk 2: Krankenkassen-Bonus */
export const kk = {
  steps: 5,
  /** Fester Betrag, nicht „bis zu“ (Entscheidung 11/2026). */
  perYear: 300,
  gkv: {
    title: ['Bist du ', 'gesetzlich', ' versichert?'] as const,
    sub: 'Dieses Geschenk kommt von einer Krankenkasse.',
    yes: 'Ja',
    no: 'Nein',
    noTitle: 'Dieses Geschenk ist für gesetzlich Versicherte',
    noBody: 'Dein Berater schaut gern, was es für dich gibt. Oder du hast dich verklickt: Dann geht es hier weiter.',
    changeMind: 'Doch, ich bin gesetzlich versichert',
  },
  /** Die zwei Nachweise, die für den Bonus nötig sind. */
  nachweise: ['Zahnvorsorge', 'Sport'],
  q: [
    {
      title: ['Warst du dieses Jahr ', 'zum Glück', ' nur zur Vorsorge beim Arzt?'] as const,
      sub: 'Also zum Check, nicht wegen etwas Ernstem.',
      yes: 'Ja, zum Glück',
      no: 'Nicht ganz',
    },
    {
      title: ['Gehst du jedes Jahr zur ', 'Zahnvorsorge', '?'] as const,
      sub: 'Zur Zahngesundheitsuntersuchung beim Zahnarzt.',
      yes: 'Ja, jedes Jahr',
      no: 'Eher selten',
    },
    {
      title: ['Gehst du einer ', 'sportlichen Aktivität', ' nach?'] as const,
      sub: 'Zum Beispiel Fitnessstudio, Verein oder Laufen.',
      yes: 'Ja',
      no: 'Noch nicht',
    },
  ],
  result: {
    title: ['Die ', 'Krankenkasse', ' legt dir was drauf'] as const,
    lead: 'Jedes Jahr',
    unit: 'von der Krankenkasse',
    needTitle: 'Dafür brauchst du nur zwei Nachweise',
    got: (n: number) => (n === 2 ? 'Beide bringst du schon mit.' : n === 1 ? 'Einen davon bringst du schon mit.' : 'Beide sind schnell erledigt.'),
    yearly: 'Den Bonus gibt es jedes Jahr, mit denselben wenigen Nachweisen.',
    tease: 'Wie du ihn dir holst, erfährst du zum Schluss.',
  },
  question: 'Wie hole ich mir jedes Jahr meinen Krankenkassen-Bonus?',
};

export const advisor = {
  title: 'Auf einen Kaffee oder Tee im neuen Jahr?',
  sub: 'Melde dich bei deinem Berater. Zwischen den Feiertagen oder im neuen Jahr setzt ihr euch zusammen und besprecht die Details bei einem gemütlichen Kaffee oder Tee.',
  questionsTitle: 'Das könnt ihr besprechen',
  questionsEmpty: 'Pack erst ein Geschenk aus, dann findest du hier deine Fragen für das Gespräch.',
  how: 'Ruf ihn an, schreib ihm oder sprich ihn beim nächsten Treffen an. Ein Termin, ein Kaffee oder ein Tee kostet nichts und verpflichtet zu nichts.',
  tip: 'Tipp: Mach einen Screenshot von diesen Fragen.',
  /** Öffnet WhatsApp ohne feste Nummer: Der Kunde wählt seinen Berater selbst aus seinen Kontakten. */
  whatsapp: 'Berater per WhatsApp anschreiben',
  whatsappHint: 'Du wählst in WhatsApp selbst aus, wen du anschreibst. Die Nachricht ist schon vorbereitet.',
  contactText: 'Hallo, ich habe das Weihnachtsgeschenk ausgepackt. Lass uns zwischen den Feiertagen oder im neuen Jahr bei einem Kaffee oder Tee die Details besprechen.',
  contactQuestions: 'Mich interessiert:',
};

/** Empfehlung: Prämie 50 €, Weitersagen per WhatsApp oder Link (der Kunde sendet selbst, wir fragen nie nach Kontakten). */
export const referral = {
  title: 'Empfehlen lohnt sich',
  body: 'Empfehlungen sind für uns das größte Lob. Für jede erfolgreiche Empfehlung gibt es 50 € Prämie.',
  prize: '50 €',
  whatsapp: 'Per WhatsApp weitersagen',
  copy: 'Link kopieren',
};

export const finale = {
  title: ['Das war erst ', 'der Anfang', ''] as const,
  sub: 'Wie das alles für dich zusammenpasst, besprecht ihr am besten bei einem Kaffee oder Tee zwischen den Feiertagen oder im neuen Jahr.',
};

export const share = {
  text: 'Ich habe gerade ein Weihnachtsgeschenk ausgepackt. Schau mal, was für dich drin ist:',
  shareTitle: 'Ein Geschenk für dich',
};
