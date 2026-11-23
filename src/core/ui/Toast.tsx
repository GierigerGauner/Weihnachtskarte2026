import { AnimatePresence, motion } from 'motion/react';
import { useToast } from './toastStore';

export function ToastHost() {
  const t = useToast();
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[65] flex justify-center px-5" role="status" aria-live="polite">
      <AnimatePresence>
        {t && (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="rounded-full bg-navy px-5 py-3 label text-white shadow-dark ring-1 ring-white/20"
          >
            {t.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
