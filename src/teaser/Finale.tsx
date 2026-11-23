import { motion } from 'motion/react';
import { common, finale } from '../core/copy.de';
import { Footer } from '../core/legal/Footer';
import { Button } from '../core/ui/Button';
import { Headline } from '../core/ui/Headline';
import { Snow } from '../core/ui/Ornaments';
import { ScreenHeader } from '../core/ui/ScreenHeader';
import { GiftArt } from './GiftArt';
import { Referral } from './Referral';
import { Tree } from './Tree';

/** Abschluss: Das war erst der Anfang. Weiter geht es mit einem Kaffee oder Tee beim Berater, dazu die Empfehlung. */
export function Finale({ onAdvisor, onBack }: { onAdvisor: () => void; onBack: () => void }) {
  return (
    <div className="relative flex h-full flex-col overflow-clip bg-night">
      <Snow count={20} />
      <Tree className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[70%] w-full max-w-[360px] opacity-60" />
      <ScreenHeader onBack={onBack} tone="dark" />
      <div className="no-scrollbar relative z-10 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-3">
        <div className="flex items-end justify-center gap-2 pt-2" aria-hidden="true">
          {([['red', 92], ['white', 92]] as const).map(([tone, size], i) => (
            <motion.div key={tone} initial={{ opacity: 0.3, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.2, duration: 0.4 }}>
              <GiftArt tone={tone} size={size} state="opened" />
            </motion.div>
          ))}
        </div>
        <Headline parts={finale.title} tone="dark" />
        <p className="m-0 text-white/85">{finale.sub}</p>
        <div className="mt-auto flex flex-col gap-3">
          <Button tone="dark" onClick={onAdvisor}>{common.advisorCta}</Button>
          <Referral target="finale" tone="dark" />
          <Button variant="link" tone="dark" small className="mx-auto" onClick={onBack}>{common.backToGifts}</Button>
        </div>
        <Footer tone="dark" />
      </div>
    </div>
  );
}
