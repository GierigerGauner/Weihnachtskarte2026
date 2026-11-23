import { AnimatePresence, motion } from 'motion/react';
import { useFlash } from './flashStore';

export function Flash() {
  const key = useFlash();
  return (
    <AnimatePresence>
      {key > 0 && (
        <motion.div
          key={key}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[55]"
          style={{ background: 'var(--flash)' }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.2, 1.6, 2, 2.2] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, times: [0, 0.3, 0.55, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
