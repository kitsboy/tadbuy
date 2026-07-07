import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="bg-red/15 border-b border-red/30 px-4 py-2 flex items-center justify-center gap-2 text-xs text-red font-semibold">
      <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
      You&apos;re offline — some features are unavailable until you reconnect.
    </div>
  );
}