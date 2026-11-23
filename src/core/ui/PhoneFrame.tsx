import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { setConfettiCanvas } from '../confetti';
import { DebugOverlay } from '../DebugOverlay';
import { cn } from './cn';
import { Flash } from './Flash';
import { ToastHost } from './Toast';

export const EMBED = typeof location !== 'undefined' && new URLSearchParams(location.search).has('embed');

/**
 * Auf dem Handy: Vollbild (100dvh). Auf dem Desktop: zentrierter Phone-Frame, damit man am Laptop durchklicken kann.
 * Sheets, Toasts, Konfetti und Debug-Overlay leben im Frame (absolute), nicht im Fenster.
 */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    setConfettiCanvas(canvas.current);
    return () => setConfettiCanvas(null);
  }, []);
  return (
    <div className={cn(EMBED ? 'h-dvh' : 'min-h-dvh sm:flex sm:items-center sm:justify-center sm:p-4')}>
      <div
        className={cn(
          'relative isolate h-dvh w-full overflow-clip bg-paper',
          !EMBED && 'sm:h-[min(864px,calc(100dvh-32px))] sm:w-[410px] sm:rounded-[44px] sm:border-[10px] sm:border-navy sm:shadow-dark',
          className,
        )}
      >
        {children}
        <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-[60] h-full w-full" aria-hidden="true" />
        <Flash />
        <ToastHost />
        <DebugOverlay />
      </div>
    </div>
  );
}
