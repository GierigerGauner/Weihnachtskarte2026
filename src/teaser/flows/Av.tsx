import { AnimatePresence, motion } from 'motion/react';
import { ArrowRightLeft, Briefcase, Check, FileText, GraduationCap, Hammer, House, KeyRound, Landmark, PiggyBank, Store } from 'lucide-react';
import { useState } from 'react';
import { av as copy, common, legal, tageLabel } from '../../core/copy.de';
import { tageBisStart } from '../../core/format';
import { Pill, SegmentProgress } from '../../core/ui/Atoms';
import { Button } from '../../core/ui/Button';
import { Stepper } from '../../core/ui/Controls';
import { CountUp } from '../../core/ui/CountUp';
import { Headline } from '../../core/ui/Headline';
import { MiniGift } from '../../core/ui/Ornaments';
import { cn } from '../../core/ui/cn';
import { eur } from '../../core/format';
import { BONUS_EINSTEIGER, KINDERZULAGE_MAX_PRO_KIND, GRUNDZULAGE_MAX, maxZulage, type Profil } from '../../core/zulagen';
import { Page } from '../Page';
import { Question, YesNo } from '../Question';
import { ResultShell, RevealGate } from '../Reveal';

export type Home = 'traum' | 'finanzierung' | 'sanierung' | 'altersvorsorge';
export type AvStep = 'typ' | 'kinder' | 'riester' | 'home1' | 'home2' | 'home3' | 'reveal';
export interface AvState { step: AvStep; profil?: Profil; kinder: number; riester?: boolean; home?: Home }
export const AV_START: AvState = { step: 'typ', kinder: 0 };

const PROFILES: Profil[] = ['angestellt', 'beamter', 'selbststaendig', 'unter25'];
const ICON = { angestellt: Briefcase, beamter: Landmark, selbststaendig: Store, unter25: GraduationCap } as const;
const HOME_ICON = { traum: House, finanzierung: KeyRound, sanierung: Hammer, altersvorsorge: PiggyBank } as const;

const num = (s: AvStep) => (s === 'typ' ? 1 : s === 'kinder' ? 2 : s === 'riester' ? 3 : s === 'reveal' ? 5 : 4);

/**
 * Geschenk 1: Typ (auch Beamte) → Kinder (auch geplante) → bestehender Riester-Vertrag → Eigenheim-Fragen als Kaskade → Enthüllung.
 * Die Monatsrate wird bewusst nicht abgefragt. Gezeigt wird erst am Ende, was der Staat bis zu dazulegt.
 */
export function AvFlow({ s, setS, alreadyOpen, onExit, onOpened }: {
  s: AvState; setS: (f: (p: AvState) => AvState) => void; alreadyOpen: boolean;
  onExit: () => void; onOpened: () => void;
}) {
  const [dir, setDir] = useState(1);
  const go = (step: AvStep, d = 1) => { setDir(d); setS((p) => ({ ...p, step })); };
  const answerHome = (home: Home) => { setS((p) => ({ ...p, home })); go('reveal'); };
  const back = () => {
    if (s.step === 'typ') return onExit();
    if (s.step === 'kinder') return go('typ', -1);
    if (s.step === 'riester') return go('kinder', -1);
    if (s.step === 'home1') return go('riester', -1);
    if (s.step === 'home2') return go('home1', -1);
    if (s.step === 'home3') return go('home2', -1);
    onExit();
  };
  const progress = <SegmentProgress total={copy.steps} current={num(s.step)} label={common.progress(num(s.step), copy.steps)} />;
  const home = s.home ?? 'altersvorsorge';

  return (
    <AnimatePresence initial={false} mode="popLayout" custom={dir}>
      {s.step === 'typ' && (
        <Page key="typ" dir={dir} tone="light">
          <Question parts={copy.profil.title} progress={progress} onBack={back} footer={<p className="m-0 body-s text-ink-muted">{copy.profil.note}</p>}>
            <div role="radiogroup" aria-label="Wer packt hier aus?" className="mt-2 flex flex-col gap-3">
              {PROFILES.map((p) => {
                const t = copy.profil[p];
                const sel = s.profil === p;
                const Icon = ICON[p];
                return (
                  <motion.button
                    key={p} type="button" role="radio" aria-checked={sel}
                    animate={{ scale: sel ? 1.04 : 1, opacity: s.profil && !sel ? 0.55 : 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    onClick={() => { setS((x) => ({ ...x, profil: p })); setTimeout(() => go('kinder'), 200); }}
                    className={cn('relative flex h-[88px] items-center gap-4 rounded-card bg-white px-5 text-left shadow-light', sel && 'ring-[3px] ring-red')}
                  >
                    <Icon aria-hidden size={32} strokeWidth={1.8} className="shrink-0 text-navy" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{t.label}</span>
                      <span className="block body-s text-ink-muted">{t.sub}</span>
                    </span>
                    {sel && <span className="grid h-7 w-7 place-items-center rounded-full bg-red text-white"><Check aria-hidden size={18} strokeWidth={3} /></span>}
                  </motion.button>
                );
              })}
            </div>
          </Question>
        </Page>
      )}

      {s.step === 'kinder' && (
        <Page key="kinder" dir={dir} tone="light">
          <Question parts={copy.kinder.title} progress={progress} onBack={back} footer={
            <>
              <Button onClick={() => go('riester')}>{common.next}</Button>
              <Button variant="link" className="mx-auto mt-1" onClick={() => { setS((x) => ({ ...x, kinder: 0 })); go('riester'); }}>{copy.kinder.none}</Button>
            </>
          }>
            <div className="my-auto flex flex-col items-center gap-6">
              <Stepper value={s.kinder} min={0} max={4} label="Anzahl Kinder" onChange={(v) => setS((x) => ({ ...x, kinder: v }))} />
              <div className="flex h-12 items-end justify-center gap-2" aria-hidden="true">
                <AnimatePresence>
                  {Array.from({ length: s.kinder }, (_, i) => (
                    <motion.span key={i} initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
                      <MiniGift size={44} />
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <p className="m-0 text-center text-ink-muted">{copy.kinder.hint}</p>
            </div>
          </Question>
        </Page>
      )}

      {s.step === 'riester' && (
        <Page key="riester" dir={dir} tone="light">
          <Question parts={copy.riester.title} sub={copy.riester.sub} progress={progress} onBack={back} footer={
            <YesNo
              yes={copy.riester.yes} no={copy.riester.no}
              onYes={() => { setS((x) => ({ ...x, riester: true })); go('home1'); }}
              onNo={() => { setS((x) => ({ ...x, riester: false })); go('home1'); }}
            />
          }>
            <div className="my-auto grid place-items-center">
              <span className="grid h-32 w-32 place-items-center rounded-full bg-white shadow-light"><FileText aria-hidden size={60} strokeWidth={1.6} className="text-navy" /></span>
            </div>
          </Question>
        </Page>
      )}

      {(s.step === 'home1' || s.step === 'home2' || s.step === 'home3') && (() => {
        const key = s.step === 'home1' ? 'q1' : s.step === 'home2' ? 'q2' : 'q3';
        const q = copy.home[key];
        const kind: Home = s.step === 'home1' ? 'traum' : s.step === 'home2' ? 'finanzierung' : 'sanierung';
        const Icon = HOME_ICON[kind];
        return (
          <Page key={s.step} dir={dir} tone="light">
            <Question parts={q.title} sub={q.sub} progress={progress} onBack={back} footer={
              <YesNo
                yes={q.yes} no={q.no}
                onYes={() => answerHome(kind)}
                onNo={() => (s.step === 'home1' ? go('home2') : s.step === 'home2' ? go('home3') : answerHome('altersvorsorge'))}
              />
            }>
              <div className="my-auto grid place-items-center">
                <span className="grid h-32 w-32 place-items-center rounded-full bg-white shadow-light"><Icon aria-hidden size={60} strokeWidth={1.6} className="text-navy" /></span>
              </div>
            </Question>
          </Page>
        );
      })()}

      {s.step === 'reveal' && s.profil && (
        <Page key="reveal" dir={dir} tone="dark">
          <RevealGate gift="av" tone="red" alreadyOpen={alreadyOpen} onBack={back} onOpened={onOpened}>
            <AvResult profil={s.profil} kinder={s.kinder} home={home} riester={s.riester === true} onBack={onExit} />
          </RevealGate>
        </Page>
      )}
    </AnimatePresence>
  );
}

function AvResult({ profil, kinder, home, riester, onBack }: { profil: Profil; kinder: number; home: Home; riester: boolean; onBack: () => void }) {
  const e = maxZulage(profil, kinder);
  const Icon = HOME_ICON[home];
  const r = copy.result;
  return (
    <ResultShell onBack={onBack} onGifts={onBack} note={legal.disclaimerAv}>
      <Headline parts={r.title} tone="dark" />
      <div>
        <div className="text-white/80">{r.upTo}</div>
        <div className="num-xxl text-lime" aria-live="polite"><CountUp value={e.jaehrlicheZulage} format={eur} /></div>
        <div className="text-white/80">{r.perYear}</div>
      </div>
      <p className="m-0 body-s text-white/80">{r.needs}</p>
      <div className="flex flex-wrap gap-2">
        {[
          <Pill key="g">{r.grund(GRUNDZULAGE_MAX)}</Pill>,
          kinder > 0 && <Pill key="k">{r.kinder(kinder, KINDERZULAGE_MAX_PRO_KIND)}</Pill>,
          e.einmaligBonus > 0 && <Pill key="b">{r.bonus(BONUS_EINSTEIGER)}</Pill>,
        ].filter(Boolean).map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.12 }}>{c}</motion.div>
        ))}
      </div>
      <div className="flex items-start gap-3 rounded-card bg-white/8 p-4 ring-1 ring-white/18">
        <Icon aria-hidden size={28} className="mt-0.5 shrink-0 text-lime" />
        <div>
          <p className="m-0 font-semibold">{r.home[home]}</p>
          <p className="m-0 mt-1 body-s text-white/80">{r.tease}</p>
        </div>
      </div>
      {riester && (
        <div className="flex items-start gap-3 rounded-card bg-white/8 p-4 ring-1 ring-white/18">
          <ArrowRightLeft aria-hidden size={28} className="mt-0.5 shrink-0 text-lime" />
          <div>
            <p className="m-0 font-semibold">{r.riester.title}</p>
            <p className="m-0 mt-1 body-s text-white/85">{r.riester.body}</p>
            <p className="m-0 mt-1 body-s text-white/80">{r.riester.tease}</p>
          </div>
        </div>
      )}
      <div><Pill>{tageLabel(tageBisStart())}</Pill></div>
    </ResultShell>
  );
}
