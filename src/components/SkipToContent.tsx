import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Keyboard, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAIN_ID = 'main-content';

export function SkipToContent() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  // Show the floating skip button only after scrolling past 200px (helpful
  // for keyboard / screen-reader users who want a permanent jump option).
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onFocusIn = () => {
      if (document.activeElement === linkRef.current) {
        linkRef.current?.scrollIntoView({ block: 'nearest' });
      }
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById(MAIN_ID);
    if (!main) return;
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: false });
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <a
      ref={linkRef}
      href={`#${MAIN_ID}`}
      onClick={handleClick}
      aria-label="Skip to main content"
      className={cn(
        'group fixed top-2 left-2 z-[100] flex items-center gap-2 px-4 py-2',
        'rounded-lg font-bold shadow-lg outline-none',
        'bg-accent text-black ring-2 ring-accent/50 ring-offset-2 ring-offset-bg',
        'transition-all duration-200',
        'opacity-0 pointer-events-none -translate-y-2',
        'focus:opacity-100 focus:pointer-events-auto focus:translate-y-0',
        visible && 'opacity-90 translate-y-0 pointer-events-auto'
      )}
    >
      <Keyboard className="w-4 h-4" />
      <span>Skip to content</span>
    </a>
  );
}