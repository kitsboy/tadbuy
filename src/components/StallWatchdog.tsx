/**
 * StallWatchdog — recovery path for the production-only Suspense stall.
 *
 * What is known (docs/KIMI-HANDOFF.md, sessions of 2026-09-28): on production
 * cold loads a route can stay on <PageLoader /> indefinitely — React has
 * scheduled a Suspense retry (retry lanes pending, callbackNode set) but the
 * callback never executes; host timers (MessageChannel/setTimeout) are healthy.
 * Every observed recovery was triggered by a state update. Local repro failed,
 * so the mechanism cannot be verified here — this is a recovery path, not a
 * root-cause fix, shipped as an explicit Cam decision (2026-10-01).
 *
 * Behaviour:
 *  - 2s: force one benign state update (this nudge) while the loader is up.
 *    If a retry callback was merely starved, any flush can commit it. Re-nudges
 *    at 4s and 8s. Cheap (a setState), inert on a healthy page (loader gone).
 *  - 6s: show a visible "Still loading?" hint with a Reload action, so a user
 *    is never left silently spinning (the 12s boot-guard overlay stays the
 *    last-resort tier for a genuinely dead app).
 *  - Recovers: log once (console.info, source-tagged for Umami/sweep greps).
 *
 * Politeness rules: it only ever nudges while [data-page-loader] is present,
 * never mutates DOM (state-driven only), and never schedules anything after
 * content commits. StrictMode-safe: double effects just schedule twice and
 * clear on unmount.
 */
import { useEffect, useState } from 'react';

const NUDGE_DELAYS_MS = [2000, 4000, 8000];
const HINT_AFTER_MS = 6000;

export function StallWatchdog() {
  const [nudge, setNudge] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let nudged = 0;

    for (const delay of NUDGE_DELAYS_MS) {
      timers.push(
        setTimeout(() => {
          // Only nudge while the Suspense fallback is actually on screen; on a
          // healthy page this is a no-op that costs one DOM query per timer.
          if (!document.querySelector('[data-page-loader]')) return;
          nudged += 1;
          setNudge(nudged);
          if (nudged === 1) {
            console.info('[stall-watchdog] Suspense loader present at 2s — forced benign state update');
          }
        }, delay),
      );
    }

    timers.push(
      setTimeout(() => {
        if (!document.querySelector('[data-page-loader]')) return;
        setShowHint(true);
        console.info('[stall-watchdog] still on loader at 6s — showing recovery hint');
      }, HINT_AFTER_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Recovery logging: the watchdog stops nudging once content commits. Reading
  // [data-page-loader] in render of a mounted (non-loader) tree means the
  // boundary resolved — say so once, for correlation with handoff evidence.
  useEffect(() => {
    if (nudge > 0 && !document.querySelector('[data-page-loader]')) {
      console.info('[stall-watchdog] loader cleared after forced update — stall recovered');
    }
  }, [nudge]);

  // The nudges re-render this component; the hint element below is what a
  // stalled user actually sees. Fixed, small, and dismissible.
  if (!showHint) return null;
  return (
    <div
      className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-white/10 bg-zinc-900/95 px-4 py-2 text-xs font-semibold text-zinc-100 shadow-lg backdrop-blur"
      role="status"
    >
      Still loading?{' '}
      <button
        type="button"
        className="ml-1 rounded-full bg-accent px-2.5 py-0.5 font-bold text-black"
        onClick={() => window.location.reload()}
      >
        Reload
      </button>
    </div>
  );
}
