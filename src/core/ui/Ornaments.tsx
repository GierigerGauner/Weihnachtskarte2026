import { useId } from 'react';
import type { CSSProperties } from 'react';

/** Flache, eigene SVG-Ornamente im Stil der Karte (nichts aus den PDFs ausgeschnitten). Alle aria-hidden. */
type P = { size?: number; className?: string; style?: CSSProperties };
const svgProps = { 'aria-hidden': true, focusable: false } as const;

export function Heart({ size = 36, className, style }: P) {
  return (
    <svg {...svgProps} width={size} height={size} viewBox="0 0 32 32" className={className} style={style}>
      <path d="M16 28C6 20 3 14 3 10a6.5 6.5 0 0 1 13-2 6.5 6.5 0 0 1 13 2c0 4-3 10-13 18z" fill="currentColor" />
    </svg>
  );
}

export function Star({ size = 36, className, style }: P) {
  return (
    <svg {...svgProps} width={size} height={size} viewBox="0 0 32 32" className={className} style={style}>
      <path d="m16 2 4.2 9.3 10.1 1.1-7.6 6.8 2.2 10L16 24.2 7.1 29.2l2.2-10L1.7 12.4l10.1-1.1z" fill="currentColor" />
    </svg>
  );
}

export function Tree({ size = 36, className, style }: P) {
  return (
    <svg {...svgProps} width={size} height={size} viewBox="0 0 32 32" className={className} style={style}>
      <path d="M16 2 8 12h4L5 21h5l-4 7h20l-4-7h5l-7-9h4z" fill="currentColor" />
      <rect x="14" y="27" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

export function SantaHat({ size = 28, className, style }: P) {
  return (
    <svg {...svgProps} width={size} height={size} viewBox="0 0 32 32" className={className} style={style}>
      <path d="M5 24C6 12 14 5 24 7c-3 2-3 5-2 8l7 9z" fill="var(--red-bright)" />
      <rect x="3" y="22" width="26" height="6" rx="3" fill="var(--white)" />
      <circle cx="26" cy="7" r="3.4" fill="var(--white)" />
    </svg>
  );
}

/** Hängendes Ornament mit Faden. `len` ist die Fadenlänge in px. */
export function Hanging({ len, children, color = 'var(--white)', className, style }: { len: number; children: React.ReactNode; color?: string; className?: string; style?: CSSProperties }) {
  return (
    <div aria-hidden="true" className={className} style={{ ...style, color }}>
      <div style={{ width: 1.5, height: len, background: 'currentColor', margin: '0 auto', opacity: 0.8 }} />
      {children}
    </div>
  );
}

export type BaubleTone = 'lime' | 'red' | 'white' | 'navy';

/** Weihnachtskugel mit Navy-Kappe, Glanz und weichem Schatten. */
export function Bauble({ size = 96, tone = 'lime', label, glow = false, className }: { size?: number; tone?: BaubleTone; label?: string; glow?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '');
  const fills: Record<BaubleTone, [string, string]> = {
    lime: ['var(--lime-1)', 'var(--lime-2)'],
    red: ['var(--red-deep-1)', 'var(--red-deep-2)'],
    white: ['var(--white)', 'var(--paper)'],
    navy: ['var(--navy)', 'var(--navy)'],
  };
  const textColor: Record<BaubleTone, string> = { lime: 'var(--navy)', red: 'var(--white)', white: 'var(--red)', navy: 'var(--white)' };
  const [a, b] = fills[tone];
  return (
    <svg {...svgProps} width={size} height={size * 1.18} viewBox="0 0 100 118" className={className} overflow="visible">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={`s${id}`} cx=".3" cy=".25" r=".5">
          <stop offset="0" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {glow && <circle cx="50" cy="70" r="58" fill="var(--lime-1)" opacity=".28" />}
      {glow && <circle cx="50" cy="70" r="52" fill="none" stroke="var(--lime-1)" strokeWidth="2.5" opacity=".9" />}
      <ellipse cx="50" cy="112" rx="30" ry="4" fill="rgb(0 0 0 / .18)" />
      <circle cx="50" cy="70" r="44" fill={`url(#g${id})`} stroke={tone === 'navy' ? 'var(--sky)' : 'none'} strokeWidth="3" />
      <circle cx="50" cy="70" r="44" fill={`url(#s${id})`} />
      {tone === 'white' && <path d="M8 62c14 8 70 8 84 0M10 80c16 8 64 8 80 0" stroke="var(--red)" strokeWidth="5" fill="none" opacity=".85" />}
      <rect x="39" y="19" width="22" height="12" rx="3" fill="var(--navy)" />
      <path d="M44 19c0-9 12-9 12 0" fill="none" stroke="var(--navy)" strokeWidth="3" />
      {label && (
        <text x="50" y="76" textAnchor="middle" fontSize="15" fontWeight="800" fill={textColor[tone]} fontFamily="var(--font-body)">
          {label}
        </text>
      )}
    </svg>
  );
}

/** Geschenk mit separat animierbarem Deckel (A0). `lid` ist die ref-fähige Gruppe. */
export function GiftBox({ lid }: { lid?: React.ReactNode }) {
  return (
    <svg {...svgProps} width="240" height="240" viewBox="0 0 240 240" overflow="visible">
      <ellipse cx="120" cy="222" rx="86" ry="9" fill="rgb(0 0 0 / .22)" />
      <rect x="40" y="108" width="160" height="108" rx="8" fill="var(--red)" />
      <rect x="108" y="108" width="24" height="108" fill="var(--white)" />
      <rect x="40" y="108" width="160" height="12" fill="rgb(0 0 0 / .12)" />
      {lid}
    </svg>
  );
}

export function GiftLid() {
  return (
    <g>
      <rect x="30" y="80" width="180" height="36" rx="8" fill="var(--red-bright)" />
      <rect x="108" y="80" width="24" height="36" fill="var(--white)" />
      <path d="M120 80C96 40 56 56 74 78c10 8 36 3 46 2z" fill="var(--white)" />
      <path d="M120 80c24-40 64-24 46-2-10 8-36 3-46 2z" fill="var(--white)" />
      <circle cx="120" cy="80" r="9" fill="var(--paper)" />
    </g>
  );
}

export function MiniGift({ size = 32, className, ribbon = 'var(--lime-1)' }: { size?: number; className?: string; ribbon?: string }) {
  return (
    <svg {...svgProps} width={size} height={size} viewBox="0 0 32 32" className={className}>
      <rect x="4" y="14" width="24" height="15" rx="2" fill="var(--red)" />
      <rect x="14" y="14" width="4" height="15" fill={ribbon} />
      <rect x="3" y="10" width="26" height="6" rx="2" fill="var(--red-bright)" />
      <rect x="14" y="10" width="4" height="6" fill={ribbon} />
      <path d="M16 10C13 3 6 4 8 8c1 2 5 2 8 2zM16 10c3-7 10-6 8-2-1 2-5 2-8 2z" fill={ribbon} />
    </svg>
  );
}

/** Schneefall: höchstens 20 Elemente, nur transform, aus bei reduzierter Bewegung (per CSS). */
export function Snow({ count = 20 }: { count?: number }) {
  const flakes = Array.from({ length: Math.min(count, 20) }, (_, i) => {
    const r = (n: number) => ((i * 9301 + n * 49297) % 233280) / 233280; // deterministisch
    return {
      left: `${r(1) * 100}%`,
      size: 2 + Math.round(r(2) * 4),
      op: 0.4 + r(3) * 0.3,
      dur: 8 + r(4) * 6,
      delay: -r(5) * 12,
      drift: `${Math.round((r(6) - 0.5) * 40)}px`,
    };
  });
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-clip motion-reduce:hidden">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full bg-white"
          style={{
            left: f.left, width: f.size, height: f.size, opacity: f.op,
            animation: `fall ${f.dur}s linear ${f.delay}s infinite`,
            ['--drift' as string]: f.drift,
          }}
        />
      ))}
    </div>
  );
}
