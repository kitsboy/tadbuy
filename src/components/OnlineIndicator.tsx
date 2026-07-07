import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils';

export function OnlineIndicator({ className }: { className?: string }) {
  const online = useOnlineStatus();
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border',
        online
          ? 'text-green border-green/30 bg-green/10'
          : 'text-red border-red/30 bg-red/10',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {online ? 'Online' : 'Offline'}
    </div>
  );
}