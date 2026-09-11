import { useEffect } from 'react';

const SCRIPT_SRC = 'https://satohash.io/widgets/stamp.js';

declare global {
  interface Window {
    SatohashStamp?: { init: () => void };
  }
}

/**
 * Drop-in Satohash stamp: hash stays on-device, X-Satohash-Client=tadbuy.
 */
export function SatohashStampWidget() {
  useEffect(() => {
    const boot = () => {
      window.SatohashStamp?.init?.();
    };
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      boot();
      return undefined;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = boot;
    document.body.appendChild(s);
    return undefined;
  }, []);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-zinc-400 mb-3 leading-snug">
        Bitcoin proof of existence — file stays on your device
      </p>
      <div data-satohash-stamp="" data-client="tadbuy" data-label="Tadbuy" data-theme="jewel" />
    </div>
  );
}
