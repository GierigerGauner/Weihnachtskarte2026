import { common, share as copy } from '../copy.de';
import { track } from '../tracking';
import { toast } from '../ui/toastStore';

/**
 * Weitersagen: Der Kunde teilt immer selbst von seinem Gerät, per WhatsApp oder als kopierter Link.
 * Wir fragen nie nach Kontaktdaten Dritter und versenden nichts (BGH I ZR 208/12).
 * WhatsApp wird erst beim Tippen geöffnet, die Seite lädt nichts von dort.
 */
export type ShareTarget = 'finale' | 'advisor';

export function shareLink(extra: Record<string, string> = {}): string {
  return `${location.origin}/?${new URLSearchParams({ ref: 'share', ...extra }).toString()}`;
}

const message = () => `${copy.text} ${shareLink()}`;

export function whatsappUrl(): string {
  return `https://wa.me/?text=${encodeURIComponent(message())}`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand?.('copy') ?? false;
    ta.remove();
    return ok;
  }
}

export function shareWhatsapp(target: ShareTarget) {
  track('share_click', { target, method: 'whatsapp' });
  window.open(whatsappUrl(), '_blank', 'noopener,noreferrer');
  track('share_complete', { target, method: 'whatsapp' });
}

export async function shareCopy(target: ShareTarget) {
  track('share_click', { target, method: 'copy' });
  if (await copyText(message())) {
    toast(common.copied);
    track('share_complete', { target, method: 'copy' });
  }
}
