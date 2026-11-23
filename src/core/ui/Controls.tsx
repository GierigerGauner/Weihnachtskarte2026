import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { vibrate } from '../format';
import { cn } from './cn';

/** Slider auf Basis von <input type="range"> (Tastatur, Screenreader gratis). Styling in index.css (.range). */
export function Slider({
  value, min, max, step, onChange, label, valueText, tone = 'light',
}: { value: number; min: number; max: number; step: number; onChange: (v: number) => void; label: string; valueText?: string; tone?: 'light' | 'dark' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      className={cn('range w-full', tone === 'dark' && 'range-dark')}
      style={{ ['--fill' as string]: `${pct}%` }}
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      aria-valuetext={valueText}
      onChange={(e) => {
        const v = Number(e.target.value);
        if (v !== value) vibrate(8);
        onChange(v);
      }}
    />
  );
}

export function Stepper({
  value, min, max, onChange, label, unit, tone = 'light',
}: { value: number; min: number; max: number; onChange: (v: number) => void; label: string; unit?: (n: number) => string; tone?: 'light' | 'dark' }) {
  const ring = tone === 'light' ? 'border-navy text-navy' : 'border-white text-white';
  const btn = cn('grid h-14 w-14 place-items-center rounded-full border-2 transition-transform active:scale-95 disabled:opacity-30', ring);
  return (
    <div className="flex items-center justify-center gap-6" role="group" aria-label={label}>
      <button type="button" className={btn} aria-label="Eins weniger" disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus aria-hidden size={26} strokeWidth={2.2} />
      </button>
      <div className="relative h-14 min-w-28 overflow-hidden text-center" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={value}
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -22, opacity: 0 }}
            transition={{ duration: 0.16 }}
            className={cn('num-l leading-[56px]', tone === 'dark' && 'text-white')}
          >
            {unit ? unit(value) : value}
          </motion.div>
        </AnimatePresence>
      </div>
      <button type="button" className={btn} aria-label="Eins mehr" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus aria-hidden size={26} strokeWidth={2.2} />
      </button>
    </div>
  );
}
