import { MessageCircle } from 'lucide-react';
import { referral } from '../core/copy.de';
import { shareCopy, shareWhatsapp, type ShareTarget } from '../core/share/share';
import { Button } from '../core/ui/Button';
import { cn } from '../core/ui/cn';

/**
 * Empfehlung: „Empfehlungen sind für uns das größte Lob“, 50 € Prämie, Weitersagen per WhatsApp oder Link.
 * Der Kunde schickt selbst. Es werden keine Kontakte abgefragt.
 */
export function Referral({ target, tone = 'light' }: { target: ShareTarget; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <section
      aria-label={referral.title}
      className={cn('flex flex-col gap-3 rounded-card p-4', dark ? 'bg-navy/90 text-white ring-1 ring-white/20' : 'bg-white shadow-light')}
    >
      <div className="flex items-center gap-4">
        <span className={cn('num-l shrink-0', dark ? 'text-lime' : 'text-red')} aria-hidden="true">{referral.prize}</span>
        <div>
          <h3 className="m-0 label">{referral.title}</h3>
          <p className={cn('m-0 mt-1 body-s', dark ? 'text-white/85' : 'text-ink-muted')}>{referral.body}</p>
        </div>
      </div>
      <Button
        tone={tone}
        variant={dark ? 'lime' : 'primary'}
        icon={<MessageCircle aria-hidden size={22} />}
        onClick={() => shareWhatsapp(target)}
      >
        {referral.whatsapp}
      </Button>
      <Button variant="link" tone={tone} small className="mx-auto" onClick={() => void shareCopy(target)}>
        {referral.copy}
      </Button>
    </section>
  );
}
