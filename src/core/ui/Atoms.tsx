import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from './cn';

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('inline-flex h-7 items-center rounded-full bg-lime-grad px-3 label font-bold text-navy', className)}
    >
      {children}
    </motion.span>
  );
}

export function Chip({
  children, selected, onClick, tone = 'light', className, ...aria
}: { children: ReactNode; selected?: boolean; onClick?: () => void; tone?: 'light' | 'dark'; className?: string } & Record<string, unknown>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'inline-flex min-h-12 items-center justify-center rounded-full px-5 label transition-colors',
        tone === 'light'
          ? selected ? 'bg-navy text-white' : 'border border-navy/30 bg-white text-navy'
          : selected ? 'bg-white text-navy' : 'border border-white/40 text-white',
        className,
      )}
      {...aria}
    >
      {children}
    </button>
  );
}

/** Info-Chip ohne Interaktion (Aufschlüsselung im Ergebnis). */
export function Pill({ children, tone = 'dark', className }: { children: ReactNode; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span className={cn('inline-flex min-h-9 items-center rounded-full px-4 label', tone === 'dark' ? 'bg-white/12 text-white ring-1 ring-white/25' : 'bg-white text-navy ring-1 ring-navy/15', className)}>
      {children}
    </span>
  );
}

/** Fortschritt A: 4 Segmente, Füllung in 280 ms. */
export function SegmentProgress({ total, current, tone = 'light', label }: { total: number; current: number; tone?: 'light' | 'dark'; label: string }) {
  return (
    <div className="flex flex-1 gap-1.5" role="progressbar" aria-label={label} aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn('h-1.5 flex-1 overflow-hidden rounded-full', tone === 'light' ? 'bg-navy/15' : 'bg-white/25')}>
          <motion.span
            className={cn('block h-full origin-left rounded-full', tone === 'light' ? 'bg-red' : 'bg-lime')}
            initial={false}
            animate={{ scaleX: i < current ? 1 : 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </span>
      ))}
    </div>
  );
}

/** Fortschritt B und C: Kugel-Punkte (offen: Kontur, gefüllt: Lime). `wrong` bekommt zusätzlich ein Icon-Zeichen. */
export function BallDots({ states, label }: { states: Array<'open' | 'done' | 'wrong'>; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2" role="img" aria-label={label}>
      {states.map((s, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{ scale: s === 'open' ? 1 : [1, 1.35, 1] }}
          transition={{ duration: 0.3 }}
          className={cn(
            'grid h-3.5 w-3.5 place-items-center rounded-full border-2 text-[8px] font-extrabold leading-none',
            s === 'open' && 'border-white/60',
            s === 'done' && 'border-lime bg-lime text-navy',
            s === 'wrong' && 'border-white bg-transparent text-white',
          )}
        >
          {s === 'wrong' ? '×' : ''}
        </motion.span>
      ))}
    </div>
  );
}

export function Card({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={cn('rounded-card p-5', dark ? 'bg-white/8 text-white ring-1 ring-white/18' : 'bg-white shadow-light', className)}>
      {children}
    </div>
  );
}
