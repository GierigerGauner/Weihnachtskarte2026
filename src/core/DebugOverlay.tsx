import { useState } from 'react';
import { useParams, clearParams } from './params';
import { clearAllSession } from './session';
import { clearEventLog, useEventLog } from './tracking';

export const DEBUG = typeof location !== 'undefined' && new URLSearchParams(location.search).get('debug') === '1';

/** Review-Modus `?debug=1`: Berater, Parameter, Event-Log und Reset (Spec Abschnitt 2). */
export function DebugOverlay() {
  const [open, setOpen] = useState(false);
  const log = useEventLog();
  const params = useParams();
  if (!DEBUG) return null;
  return (
    <div className="pointer-events-none absolute inset-x-2 top-2 z-[70] font-mono text-[11px] leading-4 text-white">
      <button type="button" onClick={() => setOpen((o) => !o)} className="pointer-events-auto rounded-full bg-black/80 px-3 py-1" aria-expanded={open}>
        debug {open ? '▾' : '▸'} · {log.length} Events
      </button>
      {open && (
        <div className="pointer-events-auto mt-1 max-h-[60dvh] overflow-auto rounded-xl bg-black/85 p-3">
          <p className="m-0">Params: {JSON.stringify(params)}</p>
          <button
            type="button"
            className="my-2 rounded bg-white px-2 py-1 text-navy"
            onClick={() => { clearAllSession(); clearParams(); clearEventLog(); location.reload(); }}
          >
            Reset
          </button>
          <ol className="m-0 list-none p-0">
            {[...log].reverse().slice(0, 25).map((e, i) => (
              <li key={i} className="border-t border-white/15 py-0.5">
                <b>{e.event}</b> {e.variant} {JSON.stringify(e.props)}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
