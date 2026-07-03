import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingCampaignCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href="#campaign-builder"
      className={cn(
        'fixed bottom-16 left-1/2 -translate-x-1/2 z-40 md:hidden',
        'flex items-center gap-2 px-5 py-3 rounded-full',
        'bg-accent text-black font-bold text-sm shadow-[0_8px_32px_rgba(255,159,28,0.4)]',
        'hover:scale-105 active:scale-95 transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      )}
    >
      <Zap className="w-4 h-4" />
      Start Campaign
    </a>
  );
}