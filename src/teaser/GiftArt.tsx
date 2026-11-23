import { motion, useReducedMotion } from 'motion/react';
import { useId } from 'react';

export type GiftTone = 'red' | 'white' | 'mauve';
export type GiftState = 'idle' | 'opening' | 'opened';

const TONES: Record<GiftTone, { body: string; lid: string; band: string; bow: string; knot: string }> = {
  red: { body: 'var(--red)', lid: 'var(--red-bright)', band: 'var(--white)', bow: 'var(--white)', knot: 'var(--paper)' },
  white: { body: 'var(--white)', lid: 'var(--paper)', band: 'var(--red)', bow: 'var(--red)', knot: 'var(--red-deep-2)' },
  mauve: { body: 'var(--mauve)', lid: 'var(--white)', band: 'var(--white)', bow: 'var(--white)', knot: 'var(--paper)' },
};

const at = (x: number, y: number) => ({ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' as const });
const spring = { type: 'spring', stiffness: 120, damping: 14 } as const;

/**
 * Geschenk als SVG mit getrennten Teilen für die Auspack-Animation:
 * Schleife und Deckel fliegen weg, die beiden Hälften der Box klappen auf, Lichtstrahlen und Kern blitzen auf.
 * `idle` + `wobble`: Wackeln alle paar Sekunden. `opened`: Deckel liegt daneben, Licht aus der Box.
 */
export function GiftArt({ tone = 'red', state = 'idle', size = 240, wobble = false, wobbleDelay = 0, className }: {
  tone?: GiftTone; state?: GiftState; size?: number; wobble?: boolean; wobbleDelay?: number; className?: string;
}) {
  const id = useId().replace(/:/g, '');
  const reduced = useReducedMotion();
  const t = TONES[tone];

  const wrap =
    state === 'opening' && !reduced
      ? { animate: { scale: [1, 0.9, 1.05, 1], rotate: [0, -6, 6, -5, 5, 0] }, transition: { duration: 0.55 } }
      : state === 'idle' && wobble && !reduced
        ? { animate: { rotate: [0, -5, 5, -3, 3, 0], y: [0, -10, 0, -4, 0, 0] }, transition: { duration: 0.7, repeat: Infinity, repeatDelay: 1.6, delay: wobbleDelay } }
        : { animate: {}, transition: {} };

  const off = { x: 64, y: -26, rotate: 24, opacity: 1, transition: spring };
  const lid = {
    idle: { x: 0, y: 0, rotate: 0, opacity: 1 },
    opening: reduced ? { opacity: 0 } : { x: [0, 10, 40], y: [0, -40, -260], rotate: [0, -6, -30], opacity: [1, 1, 0], transition: { duration: 0.9, delay: 0.5, times: [0, 0.25, 1], ease: 'easeOut' as const } },
    opened: off,
  };
  const bow = {
    idle: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
    opening: reduced ? { opacity: 0 } : { x: [0, -10, -50], y: [0, -60, -320], rotate: [0, 40, 260], scale: [1, 1.2, 1.4], opacity: [1, 1, 0], transition: { duration: 1, delay: 0.45, times: [0, 0.25, 1], ease: 'easeOut' as const } },
    opened: { ...off, scale: 1 },
  };
  const half = (dir: -1 | 1) => ({
    idle: { x: 0, rotate: 0, opacity: 1 },
    opening: reduced ? { opacity: 0 } : { x: [0, dir * 6, dir * 60], rotate: [0, dir * 4, dir * 24], opacity: [1, 1, 0], transition: { duration: 0.9, delay: 0.55, times: [0, 0.3, 1], ease: 'easeOut' as const } },
    opened: { x: 0, rotate: 0, opacity: 1 },
  });
  const rays = {
    idle: { opacity: 0, scale: 0.2 },
    opening: reduced ? { opacity: 0 } : { opacity: [0, 1, 0], scale: [0.2, 1.6, 2.6], rotate: [0, 30, 60], transition: { duration: 1.1, delay: 0.5, times: [0, 0.35, 1] } },
    opened: { opacity: 0, scale: 0.2 },
  };
  const core = {
    idle: { opacity: 0, scale: 0 },
    opening: reduced ? { opacity: 0 } : { opacity: [0, 0.95, 0], scale: [0, 2, 4.5], transition: { duration: 1, delay: 0.5, times: [0, 0.3, 1] } },
    opened: { opacity: 0, scale: 0 },
  };

  const Body = () => (
    <>
      <rect x="40" y="108" width="160" height="108" rx="8" fill={t.body} />
      <rect x="108" y="108" width="24" height="108" fill={t.band} />
      <rect x="40" y="108" width="160" height="12" fill="rgb(0 0 0 / .12)" />
    </>
  );

  return (
    <motion.div className={className} style={{ width: size, height: size }} animate={wrap.animate} transition={wrap.transition}>
      <svg width={size} height={size} viewBox="0 0 240 240" overflow="visible" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={`L${id}`}><rect x="0" y="-400" width="120" height="900" /></clipPath>
          <clipPath id={`R${id}`}><rect x="120" y="-400" width="120" height="900" /></clipPath>
          <radialGradient id={`g${id}`}>
            <stop offset="0" stopColor="var(--lime-1)" stopOpacity=".95" />
            <stop offset="1" stopColor="var(--lime-1)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="120" cy="222" rx="86" ry="9" fill="rgb(0 0 0 / .22)" />

        <motion.g variants={rays} initial={false} animate={state} style={at(120, 112)}>
          {Array.from({ length: 12 }, (_, i) => (
            <polygon key={i} points="120,112 111,-150 129,-150" fill="var(--white)" opacity=".85" transform={`rotate(${i * 30} 120 112)`} />
          ))}
        </motion.g>
        <motion.circle cx="120" cy="112" r="40" fill={`url(#g${id})`} variants={core} initial={false} animate={state} style={at(120, 112)} />
        {state === 'opened' && <ellipse cx="120" cy="108" rx="74" ry="22" fill={`url(#g${id})`} />}

        <motion.g clipPath={`url(#L${id})`} variants={half(-1)} initial={false} animate={state} style={at(40, 216)}><Body /></motion.g>
        <motion.g clipPath={`url(#R${id})`} variants={half(1)} initial={false} animate={state} style={at(200, 216)}><Body /></motion.g>

        <motion.g variants={lid} initial={false} animate={state} style={at(120, 98)}>
          <rect x="30" y="80" width="180" height="36" rx="8" fill={t.lid} />
          <rect x="108" y="80" width="24" height="36" fill={t.band} />
        </motion.g>
        <motion.g variants={bow} initial={false} animate={state} style={at(120, 80)}>
          <path d="M120 80C96 40 56 56 74 78c10 8 36 3 46 2z" fill={t.bow} />
          <path d="M120 80c24-40 64-24 46-2-10 8-36 3-46 2z" fill={t.bow} />
          <circle cx="120" cy="80" r="9" fill={t.knot} />
        </motion.g>
      </svg>
    </motion.div>
  );
}
