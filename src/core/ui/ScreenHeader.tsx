import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { common } from '../copy.de';
import { IconButton } from './Button';

/** Kopfzeile 56 px: Zurück-Pfeil links, Fortschritt in der Mitte. Keine Marke, kein Berater. */
export function ScreenHeader({ onBack, center, tone = 'light' }: { onBack?: () => void; center?: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-2 pr-5">
      {onBack ? (
        <IconButton label={common.back} tone={tone} onClick={onBack}><ArrowLeft aria-hidden size={26} /></IconButton>
      ) : (
        <span className="w-12" />
      )}
      <div className="flex min-w-0 flex-1 items-center px-1"><div className="w-full max-w-[220px]">{center}</div></div>
    </header>
  );
}
