import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { common, wrapped, type GiftId } from '../core/copy.de';
import { confettiBurst } from '../core/confetti';
import { Footer } from '../core/legal/Footer';
import { Button } from '../core/ui/Button';
import { Headline } from '../core/ui/Headline';
import { ScreenHeader } from '../core/ui/ScreenHeader';
import { triggerFlash } from '../core/ui/flashStore';
import { GiftArt, type GiftTone } from './GiftArt';

/**
 * Enthüllung: Erst liegt das verpackte Geschenk bereit (wackelt, leuchtet). Tippen packt es aus
 * (Schütteln, Schleife und Deckel fliegen weg, Lichtblitz), dann erscheint das Ergebnis.
 * Ein schon ausgepacktes Geschenk zeigt direkt das Ergebnis.
 */
export function RevealGate({ gift, tone, alreadyOpen, onBack, onOpened, children }: {
  gift: GiftId; tone: GiftTone; alreadyOpen: boolean; onBack: () => void; onOpened: () => void; children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'wrapped' | 'opening' | 'open'>(alreadyOpen ? 'open' : 'wrapped');

  const open = () => {
    if (phase !== 'wrapped') return;
    setPhase('opening');
    if (reduced) { setPhase('open'); onOpened(); return; }
    setTimeout(() => void confettiBurst({ count: 60, y: 0.5, spread: 90, power: 42 }), 700);
    setTimeout(triggerFlash, 850);
    setTimeout(() => { setPhase('open'); onOpened(); }, 1300);
  };

  if (phase === 'open') {
    return (
      <motion.div className="flex min-h-0 flex-1 flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <>
      <ScreenHeader onBack={onBack} tone="dark" />
      <div className="relative flex min-h-0 flex-1 flex-col px-5 pb-3">
        <Headline parts={wrapped[gift].title} tone="dark" />
        <p className="m-0 mt-2 text-white/80">{wrapped.sub}</p>
        <div className="relative my-auto grid place-items-center">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute h-[420px] w-[420px]"
            style={{ background: 'var(--glow)' }}
            animate={reduced ? { opacity: 0.8 } : phase === 'opening' ? { opacity: 1, scale: 1.5 } : { opacity: [0.55, 1, 0.55], scale: [1, 1.12, 1] }}
            transition={phase === 'opening' ? { duration: 0.6 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <button type="button" onClick={open} aria-label={wrapped.hint} className="relative grid h-[240px] w-[240px] place-items-center rounded-full">
            <GiftArt tone={tone} state={phase === 'opening' ? 'opening' : 'idle'} size={240} wobble />
          </button>
        </div>
        <motion.p aria-hidden="true" className="m-0 mb-2 text-center body-s text-white/80" animate={{ opacity: phase === 'opening' ? 0 : [0.55, 1, 0.55] }} transition={{ duration: 2.4, repeat: phase === 'opening' ? 0 : Infinity }}>
          {wrapped.hint}
        </motion.p>
        <Footer tone="dark" />
      </div>
    </>
  );
}

/**
 * Ergebnis-Screen (dunkel): Kopfzeile, Inhalt, feste Fußzone. Hier steht bewusst noch kein Call to Action:
 * Der Kaffee-oder-Tee-Hinweis kommt erst im Abschluss nach „Zum Schluss“.
 */
export function ResultShell({ onBack, onGifts, note, children }: {
  onBack: () => void; onGifts: () => void; note: string; children: ReactNode;
}) {
  return (
    <>
      <ScreenHeader onBack={onBack} tone="dark" />
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-4 pt-1">
        {children}
        <Footer tone="dark" note={note} className="mt-auto" />
      </div>
      <div className="shrink-0 border-t border-white/10 px-5 pb-3 pt-3">
        <Button tone="dark" onClick={onGifts}>{common.backToGifts}</Button>
      </div>
    </>
  );
}
