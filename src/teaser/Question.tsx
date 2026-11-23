import type { ReactNode } from 'react';
import { common } from '../core/copy.de';
import { Button } from '../core/ui/Button';
import { Headline } from '../core/ui/Headline';
import { ScreenHeader } from '../core/ui/ScreenHeader';

/** Gemeinsames Gerüst der Fragen-Screens auf Papier: Kopfzeile mit Fortschritt, Headline, Inhalt, Fußzone. */
export function Question({ parts, sub, progress, onBack, children, footer }: {
  parts: readonly [string, string, string];
  sub?: string;
  progress: ReactNode;
  onBack: () => void;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      <ScreenHeader onBack={onBack} center={progress} />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-4">
        <Headline parts={parts} />
        {sub && <p className="m-0 mt-2 text-ink-muted">{sub}</p>}
        <div className="no-scrollbar -mx-5 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">{children}</div>
        {footer}
      </div>
    </>
  );
}

export function YesNo({ yes, no, onYes, onNo }: { yes: string; no: string; onYes: () => void; onNo: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <Button onClick={onYes}>{yes}</Button>
      <Button variant="secondary" onClick={onNo}>{no}</Button>
    </div>
  );
}

export { common };
