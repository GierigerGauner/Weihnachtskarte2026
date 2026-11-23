import { motion, useReducedMotion } from 'motion/react';
import { Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { intro, type GiftId } from '../core/copy.de';
import { Footer } from '../core/legal/Footer';
import { isReceiver, useParams } from '../core/params';
import { BallDots } from '../core/ui/Atoms';
import { Button } from '../core/ui/Button';
import { Headline } from '../core/ui/Headline';
import { Snow } from '../core/ui/Ornaments';
import { GiftArt, type GiftTone } from './GiftArt';
import { Tree } from './Tree';

interface Spot { id: GiftId; tone: GiftTone; delay: number }
/** Zwei gleich große Geschenke unter dem Baum, das Staats-Geschenk links, das der Krankenkasse rechts. */
const SPOTS: Spot[] = [
  { id: 'av', tone: 'red', delay: 0 },
  { id: 'kk', tone: 'white', delay: 0.6 },
];
const GIFT_SIZE = 144;
const GIFTS: GiftId[] = ['av', 'kk'];

/**
 * Startseite: Weihnachtsbaum, darunter zwei gleichwertige Geschenke. Solange sie zu sind, wackeln und leuchten sie.
 * Tippen auf ein Geschenk führt direkt in dessen Fragen, das Auspacken kommt am Ende der Fragen.
 * Es steht noch nichts darüber, worum es inhaltlich geht. Oben rechts liegt klein „Zurücksetzen“.
 */
export function Intro({ opened, onOpen, onNext, onReset }: {
  opened: GiftId[]; onOpen: (g: GiftId) => void; onNext: () => void; onReset: () => void;
}) {
  const receiver = isReceiver(useParams());
  const reduced = useReducedMotion();
  const [picked, setPicked] = useState<GiftId | null>(null);
  const all = opened.length === GIFTS.length;
  const dots = GIFTS.map((g): 'open' | 'done' => (opened.includes(g) ? 'done' : 'open'));

  const pick = (g: GiftId) => {
    if (picked) return;
    if (reduced) return onOpen(g);
    setPicked(g); // kurzes Schütteln, dann weiter
    setTimeout(() => onOpen(g), 420);
  };

  return (
    <div className="relative flex h-full flex-col overflow-clip bg-night">
      <Snow />
      <div className="relative z-20 flex h-12 shrink-0 items-center justify-end px-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-12 items-center gap-1.5 rounded-full px-3 caption text-white/75 transition-colors hover:text-white"
        >
          <RotateCcw aria-hidden size={14} />
          {intro.reset}
        </button>
      </div>
      <div className="relative z-10 px-5">
        <Headline parts={intro.headline} size="display-xl" tone="dark" />
        <p className="m-0 mt-2 text-white/80">{receiver ? intro.subReceiver : intro.sub}</p>
        <div className="mt-2 flex items-center gap-3">
          <BallDots states={dots} label={intro.opened(opened.length)} />
          <span className="body-s text-white/80">{intro.opened(opened.length)}</span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <Tree className="absolute inset-x-0 bottom-2 top-0 mx-auto h-[calc(100%-8px)] w-full max-w-[330px]" />

        {/* Strahlen hinter den Geschenken */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-150px] left-1/2 -ml-[220px] h-[440px] w-[440px] rounded-full"
          style={{ background: 'var(--rays)', maskImage: 'radial-gradient(circle, black 0%, transparent 66%)', WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 66%)' }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
        />

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-center gap-2 px-2">
          {SPOTS.map((s, i) => {
            const done = opened.includes(s.id);
            const t = intro.gifts[s.id];
            const boxW = GIFT_SIZE * 0.78;
            const boxH = GIFT_SIZE * 0.8;
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => pick(s.id)}
                aria-label={`${t.sub}: ${t.label}${done ? ', ausgepackt' : ''}`}
                className="flex min-w-0 flex-col items-center rounded-card"
                style={{ width: GIFT_SIZE }}
                initial={reduced ? false : { opacity: 0, y: -280, scale: 0.8 }}
                animate={picked === s.id ? { opacity: 1, y: 0, scale: [1, 0.9, 1.12], rotate: [0, -6, 6, -4, 0] } : { opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={picked === s.id ? { duration: 0.42 } : { type: 'spring', stiffness: 150, damping: 15, delay: 0.25 + i * 0.18 }}
              >
                <span className="relative block" style={{ width: boxW, height: boxH }}>
                  {!done && (
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-14"
                      style={{ background: 'var(--glow)' }}
                      animate={reduced ? undefined : { opacity: [0.45, 0.95, 0.45], scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
                    />
                  )}
                  <span className="absolute" style={{ left: `calc(50% - ${GIFT_SIZE / 2}px)`, top: -GIFT_SIZE * 0.167 }}>
                    <GiftArt tone={s.tone} size={GIFT_SIZE} state={done ? 'opened' : 'idle'} wobble={!done} wobbleDelay={s.delay} />
                  </span>
                  {done && (
                    <span className="absolute -right-1 -top-2 grid h-7 w-7 place-items-center rounded-full bg-lime-grad text-navy shadow-dark" aria-hidden="true">
                      <Check size={16} strokeWidth={3.5} />
                    </span>
                  )}
                </span>
                {/* Der Schatten hält die Schrift lesbar, wenn sie vor Kugeln am Baum steht. */}
                <span className="mt-1.5 block text-center [text-shadow:0_1px_8px_var(--navy),0_0_3px_var(--navy)]">
                  <span className="block label leading-[18px] text-white">{t.label}</span>
                  <span className="block caption text-white/85">{done ? 'Ausgepackt' : t.sub}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 px-5 pb-1 pt-2">
        <div className="flex min-h-12 items-center justify-center">
          {all ? (
            <Button tone="dark" onClick={onNext}>{intro.next}</Button>
          ) : opened.length > 0 ? (
            <Button variant="link" tone="dark" full={false} onClick={onNext}>{intro.next}</Button>
          ) : (
            <motion.p aria-hidden="true" className="m-0 body-s text-white/80" animate={reduced ? undefined : { opacity: [0.55, 1, 0.55] }} transition={{ duration: 2.4, repeat: Infinity }}>
              {intro.hint}
            </motion.p>
          )}
        </div>
        <Footer tone="dark" />
      </div>
    </div>
  );
}
