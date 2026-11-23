import { legal } from '../copy.de';
import { cn } from '../ui/cn';
import { openDatenschutz } from './legalStore';

/** Footer: Datenschutz-Link, optional Hinweistext. */
export function Footer({ tone = 'light', note, className }: { tone?: 'light' | 'dark'; note?: string; className?: string }) {
  const c = tone === 'dark' ? 'text-white/80' : 'text-navy/70';
  return (
    <footer className={cn('font-serif caption', c, className)}>
      {note && <p className="m-0 mb-2">{note}</p>}
      <div className="flex flex-wrap items-center gap-x-4">
        <a
          href="#"
          className="inline-flex min-h-12 items-center underline underline-offset-2"
          onClick={(e) => { e.preventDefault(); openDatenschutz(); }}
        >
          {legal.datenschutz}
        </a>
      </div>
    </footer>
  );
}
