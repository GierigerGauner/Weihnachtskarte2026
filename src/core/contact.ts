import { advisor } from './copy.de';
import { track } from './tracking';

/**
 * Berater kontaktieren per WhatsApp: öffnet WhatsApp mit vorbereiteter Nachricht, aber ohne feste Nummer.
 * Der Kunde sucht seinen Berater selbst aus seinen Kontakten aus, die App kennt keine Namen und keine Nummern.
 * Die Seite lädt nichts von WhatsApp, `wa.me` wird erst beim Tippen geöffnet.
 */
export function contactWhatsappUrl(questions: string[] = []): string {
  const lines = [advisor.contactText];
  if (questions.length > 0) lines.push('', advisor.contactQuestions, ...questions.map((q) => `– ${q}`));
  return `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function contactAdvisor(questions: string[] = []) {
  track('cta_click', { channel: 'whatsapp' });
  window.open(contactWhatsappUrl(questions), '_blank', 'noopener,noreferrer');
}
