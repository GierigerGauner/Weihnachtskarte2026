import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { intro, type GiftId } from '../core/copy.de';
import { usePersisted } from '../core/session';
import { setTrackingVariant, track } from '../core/tracking';
import { PhoneFrame } from '../core/ui/PhoneFrame';
import { toast } from '../core/ui/toastStore';
import { DatenschutzSheet } from '../core/legal/DatenschutzSheet';
import { AdvisorSheet } from './AdvisorSheet';
import { Finale } from './Finale';
import { AV_START, AvFlow, type AvState } from './flows/Av';
import { KK_START, KkFlow, type KkState } from './flows/Kk';
import { Intro } from './Intro';

type View = 'intro' | GiftId | 'finale';
interface State { view: View; opened: GiftId[]; av: AvState; kk: KkState }
const START: State = { view: 'intro', opened: [], av: AV_START, kk: KK_START };
const GIFTS: readonly GiftId[] = ['av', 'kk'];
const VIEWS: readonly string[] = ['intro', 'av', 'kk', 'finale'];
const T0 = Date.now();

/** Ansicht mit Überblendung. forwardRef, weil AnimatePresence (popLayout) die Größe des Kindes misst. */
const View = forwardRef<HTMLDivElement, { id: string; children: ReactNode }>(function View({ children }, ref) {
  return (
    <motion.div
      ref={ref} data-app-main className="absolute inset-0"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
});

/**
 * Teaser-App: Startseite (Baum mit zwei Geschenken) → je Geschenk Fragen und Enthüllung → Abschluss.
 * Überall führt der Weg zu einem Termin, Kaffee oder Tee mit dem Berater, nirgends zu Namen, Nummern oder Formularen.
 */
export default function App() {
  setTrackingVariant('app');
  const [s, setS, resetState] = usePersisted<State>('app', START);
  const [advisorOpen, setAdvisorOpen] = useState(false);

  // Ein früher gespeicherter Stand kann entfernte Ansichten (Zwischenseite, Krebs-Geschenk) enthalten.
  const view: View = VIEWS.includes(s.view) ? s.view : 'intro';
  const opened = s.opened.filter((g) => GIFTS.includes(g));

  useEffect(() => { track('view_landing'); }, []);
  useEffect(() => { track('step_view', { step: view }); }, [view]);

  const setView = (v: View) => setS((p) => ({ ...p, view: v }));
  const openGift = (g: GiftId) =>
    setS((p) => {
      const done = p.opened.includes(g);
      return {
        ...p,
        view: g,
        av: g === 'av' && done ? { ...p.av, step: 'reveal' } : p.av,
        // Wer bei „gesetzlich versichert?“ auf Nein gestanden hat, startet wieder bei der Frage.
        kk: g === 'kk' ? { ...p.kk, step: done ? 'reveal' : p.kk.step === 'no' ? 'gkv' : p.kk.step } : p.kk,
      };
    });
  const markOpened = (g: GiftId) => {
    setS((p) => (p.opened.includes(g) ? p : { ...p, opened: [...p.opened, g] }));
    track('gift_open', { gift: g });
    track('result_view', { gift: g });
  };
  const goFinale = () => {
    setView('finale');
    track('complete', { duration_s: Math.round((Date.now() - T0) / 1000) });
  };
  const reset = () => {
    track('reset');
    setAdvisorOpen(false);
    resetState();
    toast(intro.resetDone);
  };
  const flow = { alreadyOpen: false, onExit: () => setView('intro') };

  return (
    <PhoneFrame>
      <AnimatePresence initial={false} mode="popLayout">
        {view === 'intro' && <View key="intro" id="intro"><Intro opened={opened} onOpen={openGift} onNext={goFinale} onReset={reset} /></View>}
        {view === 'av' && (
          <View key="av" id="av">
            <AvFlow
              {...flow} alreadyOpen={opened.includes('av')} s={s.av}
              setS={(f) => setS((p) => ({ ...p, av: f(p.av) }))} onOpened={() => markOpened('av')}
            />
          </View>
        )}
        {view === 'kk' && (
          <View key="kk" id="kk">
            <KkFlow
              {...flow} alreadyOpen={opened.includes('kk')} s={s.kk}
              setS={(f) => setS((p) => ({ ...p, kk: f(p.kk) }))} onOpened={() => markOpened('kk')}
            />
          </View>
        )}
        {view === 'finale' && (
          <View key="finale" id="finale">
            <Finale
              onBack={() => setView('intro')}
              onAdvisor={() => { track('cta_open', { context: 'finale' }); setAdvisorOpen(true); }}
            />
          </View>
        )}
      </AnimatePresence>

      <AdvisorSheet open={advisorOpen} onClose={() => setAdvisorOpen(false)} opened={opened} home={s.av.home} riester={s.av.riester} />
      <DatenschutzSheet />
    </PhoneFrame>
  );
}
