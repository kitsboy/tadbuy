import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={cn(
        'fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40',
        'w-10 h-10 rounded-full bg-accent text-black shadow-lg',
        'flex items-center justify-center',
        'hover:scale-110 active:scale-95 transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-accent/50',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}