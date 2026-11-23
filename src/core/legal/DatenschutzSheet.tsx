import { common, legal } from '../copy.de';
import { Button } from '../ui/Button';
import { Sheet } from '../ui/Sheet';
import { closeDatenschutz, useDatenschutzOpen } from './legalStore';

/** Datenschutzerklärung als Fenster. Texte stehen in copy.de.ts (`legal`). */
export function DatenschutzSheet() {
  const open = useDatenschutzOpen();
  return (
    <Sheet open={open} onClose={closeDatenschutz} title={legal.datenschutz} tall>
      <div className="flex flex-col gap-3">
        <p className="m-0 font-semibold">{legal.datenschutzIntro}</p>
        {legal.datenschutzSections.map((s) => (
          <section key={s.title} className="rounded-card bg-white p-4 shadow-light">
            <h3 className="m-0 label">{s.title}</h3>
            <p className="m-0 mt-1 body-s">{s.body}</p>
          </section>
        ))}
        <Button onClick={closeDatenschutz}>{common.close}</Button>
      </div>
    </Sheet>
  );
}
