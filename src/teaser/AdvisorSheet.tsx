import { MessageCircle } from 'lucide-react';
import { advisor as copy, common, av, kk, type GiftId } from '../core/copy.de';
import { contactAdvisor } from '../core/contact';
import { Button } from '../core/ui/Button';
import { Sheet } from '../core/ui/Sheet';
import type { Home } from './flows/Av';

/**
 * „Auf einen Kaffee oder Tee im neuen Jahr“: erst nach „Zum Schluss“ erreichbar, bewusst ohne Namen und Nummer.
 * Die Seite liefert Fragen für das Gespräch und öffnet WhatsApp mit vorbereiteter Nachricht, die der Kunde an seinen
 * Berater schickt. Die Empfehlung steht nicht hier, sondern im Abschluss.
 */
export function AdvisorSheet({ open, onClose, opened, home, riester }: {
  open: boolean; onClose: () => void; opened: GiftId[]; home?: Home; riester?: boolean;
}) {
  const questions: Array<{ id: string; gift: GiftId; text: string }> = [
    { id: 'av', gift: 'av', text: av.question[home ?? 'altersvorsorge'] },
    ...(riester ? [{ id: 'riester', gift: 'av' as const, text: av.question.riester }] : []),
    { id: 'kk', gift: 'kk', text: kk.question },
  ];
  const mine = questions.filter((q) => opened.includes(q.gift));
  return (
    <Sheet open={open} onClose={onClose} title={copy.title}>
      <div className="flex flex-col gap-3">
        <p className="m-0 text-ink-muted">{copy.sub}</p>
        <div className="rounded-card bg-white p-4 shadow-light">
          <h3 className="m-0 label">{copy.questionsTitle}</h3>
          {mine.length === 0 ? (
            <p className="m-0 mt-2 body-s text-ink-muted">{copy.questionsEmpty}</p>
          ) : (
            <ul className="m-0 mt-2 flex list-none flex-col gap-3 p-0">
              {mine.map((q) => (
                <li key={q.id} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red" />
                  <span>{q.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="m-0 body-s text-ink-muted">{copy.how}</p>
        <p className="m-0 caption text-ink-muted">{copy.tip}</p>
        <div className="flex flex-col gap-2">
          <Button icon={<MessageCircle aria-hidden size={22} />} onClick={() => contactAdvisor(mine.map((q) => q.text))}>
            {copy.whatsapp}
          </Button>
          <p className="m-0 text-center caption text-ink-muted">{copy.whatsappHint}</p>
        </div>
        <Button variant="secondary" onClick={onClose}>{common.close}</Button>
      </div>
    </Sheet>
  );
}
