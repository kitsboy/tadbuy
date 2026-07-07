import { useEffect, useRef, type MouseEvent } from 'react';

const MAIN_ID = 'main-content';

export function SkipToContent() {
  const linkRef = useRef<HTMLAnchorElement>(null);

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
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg"
    >
      Skip to main content
    </a>
  );
}