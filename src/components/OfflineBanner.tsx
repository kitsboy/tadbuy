import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Reset dismissal whenever the user goes offline again.
  useEffect(() => {
    if (!online) {
      setDismissed(false);
      setWasOffline(true);
    }
  }, [online]);

  if (online) {
    if (!wasOffline) return null;
    // Optional: announce reconnection briefly
    return null;
  }

  if (dismissed) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="flex items-center justify-between gap-3 border-b border-red/30 bg-gradient-to-r from-red/20 via-red/15 to-red/20 px-4 py-2 text-xs text-red-300"
    >
      <div className="flex items-center gap-2 font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
        </span>
        <WifiOff className="h-3.5 w-3.5 shrink-0" />
        <span>
          You&apos;re offline — some features (Lightning, sync, live prices) are unavailable.
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1 rounded-md border border-red/30 bg-red/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-200 transition-colors hover:bg-red/20"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="rounded-md border border-transparent px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300/70 transition-colors hover:text-red-200"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}