import { prefersReducedMotion } from './format';

/** canvas-confetti wird lazy geladen und zeichnet in das Canvas des Phone-Frames (nicht auf die ganze Seite). */
let canvas: HTMLCanvasElement | null = null;
type Fire = (opts: Record<string, unknown>) => unknown;
let fire: Fire | null = null;

export function setConfettiCanvas(el: HTMLCanvasElement | null) {
  canvas = el;
  fire = null;
}

function palette(): string[] {
  const cs = getComputedStyle(document.documentElement);
  return ['--red', '--bordeaux', '--white', '--lime-1', '--sky'].map((v) => cs.getPropertyValue(v).trim());
}

export async function confettiBurst(opts: { count?: number; x?: number; y?: number; spread?: number; power?: number } = {}) {
  if (prefersReducedMotion() || !canvas) return;
  if (!fire) {
    const mod = await import('canvas-confetti');
    if (!canvas) return;
    fire = mod.default.create(canvas, { resize: true, useWorker: false }) as unknown as Fire;
  }
  fire({
    particleCount: opts.count ?? 30,
    spread: opts.spread ?? 70,
    startVelocity: opts.power ?? 38,
    origin: { x: opts.x ?? 0.5, y: opts.y ?? 0.6 },
    colors: palette(),
    scalar: 0.9,
    ticks: 70,
    disableForReducedMotion: true,
  });
}
