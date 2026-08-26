import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils';

export function OnlineIndicator({ className }: { className?: string }) {
  const online = useOnlineStatus();
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors',
        online
          ? 'text-green border-green/30 bg-green/10'
          : 'text-red border-red/30 bg-red/10',
        className
      )}
      role="status"
      aria-live="polite"
      title={online ? 'Connected to network' : 'You are offline'}
    >
      {online ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          <Wifi className="w-3 h-3" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}