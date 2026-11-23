import { motion } from 'motion/react';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../core/ui/cn';

const pageV = {
  enter: (d: number) => ({ opacity: 0, x: d * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -28 }),
};

/** Seite mit Slide-Übergang (280 ms). forwardRef, weil AnimatePresence (popLayout) die Größe des Kindes misst. */
export const Page = forwardRef<HTMLDivElement, { dir: number; tone: 'light' | 'dark'; children: ReactNode }>(function Page({ dir, tone, children }, ref) {
  return (
    <motion.div
      ref={ref}
      data-app-main
      custom={dir}
      variants={pageV}
      initial="enter"
      animate="center"
      exit="exit"
      className={cn('absolute inset-0 flex flex-col', tone === 'dark' ? 'bg-night' : 'bg-paper')}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
});
