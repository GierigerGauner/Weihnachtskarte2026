import { Star } from '../core/ui/Ornaments';

/**
 * Großer, flacher Weihnachtsbaum als Hintergrund (eigenes SVG, keine Kontur).
 * Lichter und Kugeln glimmern per CSS (`twinkle`), bei reduzierter Bewegung statisch.
 */
const LIGHTS: Array<[number, number, string]> = [
  [150, 60, 'var(--white)'], [128, 104, 'var(--lime-1)'], [176, 112, 'var(--white)'],
  [108, 150, 'var(--white)'], [150, 168, 'var(--lime-1)'], [196, 158, 'var(--sky)'],
  [88, 214, 'var(--lime-1)'], [128, 226, 'var(--white)'], [176, 232, 'var(--lime-1)'], [214, 212, 'var(--white)'],
  [70, 286, 'var(--white)'], [112, 296, 'var(--sky)'], [150, 282, 'var(--lime-1)'], [190, 300, 'var(--white)'], [232, 288, 'var(--lime-1)'],
  [44, 360, 'var(--lime-1)'], [88, 372, 'var(--white)'], [132, 356, 'var(--sky)'], [172, 376, 'var(--lime-1)'], [214, 362, 'var(--white)'], [254, 372, 'var(--lime-1)'],
];
const BAUBLES: Array<[number, number, string]> = [
  [118, 122, 'var(--red-bright)'], [186, 140, 'var(--white)'], [96, 252, 'var(--white)'], [208, 258, 'var(--red-bright)'],
  [138, 322, 'var(--mauve)'], [64, 330, 'var(--red-bright)'], [244, 332, 'var(--white)'], [112, 398, 'var(--white)'], [196, 404, 'var(--red-bright)'],
];

export function Tree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 430" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false" overflow="visible">
      <rect x="128" y="396" width="44" height="30" rx="3" fill="var(--tree-4)" />
      <path d="M150 226 L288 396 Q150 414 12 396 Z" fill="var(--tree-4)" />
      <path d="M150 150 L262 306 Q150 322 38 306 Z" fill="var(--tree-3)" />
      <path d="M150 86 L236 216 Q150 230 64 216 Z" fill="var(--tree-2)" />
      <path d="M150 34 L208 130 Q150 142 92 130 Z" fill="var(--tree-1)" />
      <g fill="none" stroke="var(--white)" strokeOpacity=".32" strokeWidth="2.5" strokeLinecap="round">
        <path d="M104 112 Q150 132 196 112" />
        <path d="M78 196 Q150 220 222 196" />
        <path d="M56 286 Q150 312 244 286" />
        <path d="M32 380 Q150 410 268 380" />
      </g>
      {BAUBLES.map(([x, y, c], i) => (
        <g key={`b${i}`}>
          <circle cx={x} cy={y} r="8.5" fill={c} />
          <circle cx={x - 2.5} cy={y - 3} r="2.2" fill="var(--white)" opacity=".7" />
        </g>
      ))}
      {LIGHTS.map(([x, y, c], i) => (
        <circle key={`l${i}`} cx={x} cy={y} r="3.6" fill={c} style={{ animation: `twinkle ${1.6 + (i % 5) * 0.35}s ${(i % 7) * 0.3}s infinite` }} />
      ))}
      <defs>
        <radialGradient id="starGlow">
          <stop offset="0" stopColor="var(--lime-1)" stopOpacity=".65" />
          <stop offset="1" stopColor="var(--lime-1)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="26" r="44" fill="url(#starGlow)" />
      <g color="var(--lime-1)"><Star size={34} style={{ transform: 'translate(133px, 8px)' }} /></g>
    </svg>
  );
}
