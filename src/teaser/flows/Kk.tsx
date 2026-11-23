import { AnimatePresence, motion } from 'motion/react';
import { RefreshCw, ShieldCheck, Smile, Stethoscope, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import { common, kk as copy, legal } from '../../core/copy.de';
import { eur } from '../../core/format';
import { Pill, SegmentProgress } from '../../core/ui/Atoms';
import { Button } from '../../core/ui/Button';
import { CountUp } from '../../core/ui/CountUp';
import { Headline } from '../../core/ui/Headline';
import { cn } from '../../core/ui/cn';
import { Page } from '../Page';
import { Question, YesNo } from '../Question';
import { ResultShell, RevealGate } from '../Reveal';

/** q1 = beim Arzt nur zur Vorsorge (Aufwärmfrage), q2 = Zahnvorsorge, q3 = Sport. */
export type KkStep = 'gkv' | 'no' | 'q1' | 'q2' | 'q3' | 'reveal';
export interface KkState { step: KkStep; answers: boolean[] }
export const KK_START: KkState = { step: 'gkv', answers: [] };

/** Die beiden Nachweise für den Bonus. Index = Position in `answers` (0 ist die Aufwärmfrage und zählt nicht). */
const NACHWEISE = [
  { answer: 1, Icon: Smile },
  { answer: 2, Icon: Dumbbell },
] as const;
const num = (s: KkStep) => ({ gkv: 1, no: 1, q1: 2, q2: 3, q3: 4, reveal: 5 })[s];

/** Die zwei Nachweise als Sammelleiste: Ja → gefüllt, sonst „noch offen“. Der Betrag bleibt bis zum Schluss verdeckt. */
function Nachweise({ answers, tone = 'light' }: { answers: boolean[]; tone?: 'light' | 'dark' }) {
  return (
    <ul className="m-0 flex list-none justify-center gap-8 p-0" aria-label="Deine Nachweise">
      {NACHWEISE.map(({ answer, Icon }, i) => {
        const yes = answers[answer] === true;
        const label = copy.nachweise[i];
        return (
          <li key={label} className="flex w-24 flex-col items-center gap-1 text-center">
            <motion.span
              initial={false}
              animate={{ scale: yes ? [1, 1.25, 1] : 1 }}
              className={cn(
                'grid h-16 w-16 place-items-center rounded-full border-2',
                tone === 'light'
                  ? yes ? 'border-navy bg-navy text-lime' : 'border-navy/30 text-navy/50'
                  : yes ? 'border-lime bg-lime text-navy' : 'border-white/50 text-white/80',
              )}
            >
              <Icon aria-hidden size={28} strokeWidth={1.9} />
            </motion.span>
            <span className={cn('caption', tone === 'light' ? 'text-ink-muted' : 'text-white/80')}>{label}{yes ? ' ✓' : ''}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Geschenk 2: gesetzlich versichert? → Aufwärmfrage → Zahnvorsorge → Sport → der Bonus wird enthüllt. */
export function KkFlow({ s, setS, alreadyOpen, onExit, onOpened }: {
  s: KkState; setS: (f: (p: KkState) => KkState) => void; alreadyOpen: boolean;
  onExit: () => void; onOpened: () => void;
}) {
  const [dir, setDir] = useState(1);
  const go = (step: KkStep, d = 1) => { setDir(d); setS((p) => ({ ...p, step })); };
  const answer = (i: number, v: boolean, next: KkStep) => {
    setS((p) => { const a = [...p.answers]; a[i] = v; return { ...p, answers: a }; });
    go(next);
  };
  const back = () => {
    if (s.step === 'no') return go('gkv', -1);
    if (s.step === 'gkv') return onExit();
    if (s.step === 'q1') return go('gkv', -1);
    if (s.step === 'q2') return go('q1', -1);
    if (s.step === 'q3') return go('q2', -1);
    onExit();
  };
  const progress = <SegmentProgress total={copy.steps} current={num(s.step)} label={common.progress(num(s.step), copy.steps)} />;
  const got = NACHWEISE.filter((n) => s.answers[n.answer] === true).length;
  const r = copy.result;

  return (
    <AnimatePresence initial={false} mode="popLayout" custom={dir}>
      {s.step === 'gkv' && (
        <Page key="gkv" dir={dir} tone="light">
          <Question parts={copy.gkv.title} sub={copy.gkv.sub} progress={progress} onBack={back} footer={
            <YesNo yes={copy.gkv.yes} no={copy.gkv.no} onYes={() => go('q1')} onNo={() => go('no')} />
          }>
            <div className="my-auto grid place-items-center">
              <span className="grid h-32 w-32 place-items-center rounded-full bg-white shadow-light"><ShieldCheck aria-hidden size={60} strokeWidth={1.6} className="text-navy" /></span>
            </div>
          </Question>
        </Page>
      )}

      {s.step === 'no' && (
        <Page key="no" dir={dir} tone="light">
          <Question parts={['', copy.gkv.noTitle, '']} progress={progress} onBack={back} footer={
            <div className="flex flex-col gap-3">
              <Button onClick={() => go('q1')}>{copy.gkv.changeMind}</Button>
              <Button variant="secondary" onClick={onExit}>{common.backToGifts}</Button>
            </div>
          }>
            <p className="m-0 text-ink-muted">{copy.gkv.noBody}</p>
          </Question>
        </Page>
      )}

      {(s.step === 'q1' || s.step === 'q2' || s.step === 'q3') && (() => {
        const i = s.step === 'q1' ? 0 : s.step === 'q2' ? 1 : 2;
        const q = copy.q[i];
        const next: KkStep = i === 0 ? 'q2' : i === 1 ? 'q3' : 'reveal';
        return (
          <Page key={s.step} dir={dir} tone="light">
            <Question parts={q.title} sub={q.sub} progress={progress} onBack={back} footer={
              <YesNo yes={q.yes} no={q.no} onYes={() => answer(i, true, next)} onNo={() => answer(i, false, next)} />
            }>
              <div className="my-auto">
                {i === 0 ? (
                  <div className="grid place-items-center">
                    <span className="grid h-32 w-32 place-items-center rounded-full bg-white shadow-light"><Stethoscope aria-hidden size={60} strokeWidth={1.6} className="text-navy" /></span>
                  </div>
                ) : (
                  <Nachweise answers={s.answers} />
                )}
              </div>
            </Question>
          </Page>
        );
      })()}

      {s.step === 'reveal' && (
        <Page key="reveal" dir={dir} tone="dark">
          <RevealGate gift="kk" tone="white" alreadyOpen={alreadyOpen} onBack={back} onOpened={onOpened}>
            <ResultShell onBack={onExit} onGifts={onExit} note={legal.disclaimerKk}>
              <Headline parts={r.title} tone="dark" />
              <div>
                <div className="text-white/80">{r.lead}</div>
                <div className="num-xxl text-lime" aria-live="polite"><CountUp value={copy.perYear} format={eur} /></div>
                <div className="text-white/80">{r.unit}</div>
              </div>
              <div className="flex flex-col gap-3 rounded-card bg-white/8 p-4 ring-1 ring-white/18">
                <p className="m-0 text-center font-semibold">{r.needTitle}</p>
                <Nachweise answers={s.answers} tone="dark" />
                <div className="text-center"><Pill>{r.got(got)}</Pill></div>
              </div>
              <div className="flex items-start gap-3 rounded-card bg-white/8 p-4 ring-1 ring-white/18">
                <RefreshCw aria-hidden size={28} className="mt-0.5 shrink-0 text-lime" />
                <div>
                  <p className="m-0 font-semibold">{r.yearly}</p>
                  <p className="m-0 mt-1 body-s text-white/80">{r.tease}</p>
                </div>
              </div>
            </ResultShell>
          </RevealGate>
        </Page>
      )}
    </AnimatePresence>
  );
}
