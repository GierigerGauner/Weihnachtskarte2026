import { AnimatePresence, motion, useDragControls } from 'motion/react';
import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from './cn';

/**
 * Bottom-Sheet im Phone-Frame: Ziehen und Tippen außerhalb schließen, Esc, Fokusfalle,
 * Hintergrund (`[data-app-main]`) wird `inert`. Immer nur ein Sheet gleichzeitig (Aufrufer-Verantwortung).
 */
export function Sheet({
  open, onClose, title, children, tall = false, tone = 'paper', hideClose = false,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode; tall?: boolean; tone?: 'paper'; hideClose?: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const controls = useDragControls();
  void tone;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const mains = document.querySelectorAll('[data-app-main]');
    mains.forEach((m) => m.setAttribute('inert', ''));
    const t = setTimeout(() => panel.current?.focus({ preventScroll: true }), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select,textarea,[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus({ preventScroll: true }); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus({ preventScroll: true }); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      mains.forEach((m) => m.removeAttribute('inert'));
      prev?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-40">
          <motion.div
            className="absolute inset-0 bg-navy/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panel}
            role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
            className={cn('absolute inset-x-0 bottom-0 flex flex-col rounded-t-sheet bg-paper text-navy shadow-dark outline-none', tall ? 'h-[88%]' : 'max-h-[88%]')}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => { if (i.offset.y > 100 || i.velocity.y > 500) onClose(); }}
            dragListener={false} dragControls={controls}
          >
            <DragHandle onStart={(e) => controls.start(e)} />
            <div className="flex items-start justify-between px-5 pt-1" onPointerDown={(e) => { if (!(e.target as HTMLElement).closest('button')) controls.start(e); }}>
              <h2 id={titleId} className="h2 m-0 pt-1 font-normal text-navy">{title}</h2>
              {!hideClose && (
                <button type="button" aria-label="Schließen" onClick={onClose} className="-mr-2 -mt-1 grid h-12 w-12 place-items-center rounded-full text-navy">
                  <X aria-hidden size={24} />
                </button>
              )}
            </div>
            <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-6 pt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Der Griff (und die Kopfzeile) starten das Ziehen, damit Scrollen im Inhalt nicht kollidiert. */
function DragHandle({ onStart }: { onStart: (e: React.PointerEvent) => void }) {
  return (
    <div className="flex h-7 cursor-grab touch-none justify-center pt-3" onPointerDown={onStart} aria-hidden="true">
      <span className="h-1 w-10 rounded-full bg-navy/25" />
    </div>
  );
}
