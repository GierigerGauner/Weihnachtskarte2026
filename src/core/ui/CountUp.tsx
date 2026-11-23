import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../format';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Zählt von der letzten Anzeige zum Ziel, endet exakt auf dem Zielwert. */
export function useCountUp(target: number, durationMs = 1200, start = true): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() || !start ? target : 0));
  const from = useRef(value);
  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setValue(target);
      from.current = target;
      return;
    }
    const t0 = performance.now();
    const f = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      const v = p >= 1 ? target : Math.round(f + (target - f) * easeOutCubic(p));
      setValue(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return value;
}

export function CountUp({ value, duration = 1200, format, start = true, className }: { value: number; duration?: number; format: (n: number) => string; start?: boolean; className?: string }) {
  const v = useCountUp(value, duration, start);
  return <span className={`tabular ${className ?? ''}`}>{format(v)}</span>;
}
