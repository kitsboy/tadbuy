import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandMark } from './navbar/BrandMark';
import { NavLinkItem } from './navbar/NavLinkItem';
import { MoreMenu } from './navbar/MoreMenu';
import { UtilityCluster } from './navbar/UtilityCluster';
import { MobileDrawer } from './navbar/MobileDrawer';
import { PRIMARY_NAV } from './navbar/data';
import { LocalAvatar } from './LocalAvatar';
import { openCommandMenu } from '@/lib/commandMenu';

export function Navbar({
  currency,
  setCurrency,
  rate,
}: {
  currency: string;
  setCurrency: (c: string) => void;
  rate: number;
}) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (location.pathname.startsWith('/embed')) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 glass-header isolate pt-safe px-safe transition-shadow duration-300',
        scrolled && 'shadow-lg shadow-black/25'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 xl:px-5 2xl:px-8">
        {/* Desktop — xl and up so labels never compress on laptops/tablets */}
        <div className="hidden xl:flex items-center gap-8 h-[4.5rem]">
          <BrandMark />

          <nav
            className="flex items-center gap-1.5"
            aria-label="Main navigation"
          >
            {PRIMARY_NAV.map((item) => (
              <NavLinkItem key={item.path} item={item} />
            ))}
            <MoreMenu />
          </nav>

          <div className="flex-1" />

          <UtilityCluster currency={currency} setCurrency={setCurrency} rate={rate} />
        </div>

        {/* Mobile / tablet chrome */}
        <div className="flex xl:hidden items-center justify-between gap-3 h-14">
          <button
            type="button"
            className="flex items-center justify-center min-h-11 min-w-11 -ml-1 rounded-xl text-muted hover:text-text hover:bg-surface touch-target"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <BrandMark compact />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={openCommandMenu}
              aria-label="Open search"
              className="flex items-center justify-center min-h-11 min-w-11 rounded-xl text-muted hover:text-text hover:bg-surface touch-target"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/profile"
              aria-label="My profile"
              className="flex items-center justify-center min-h-11 min-w-11 rounded-xl hover:bg-surface"
            >
              <LocalAvatar seed="Felix Bitcoin" size={30} className="rounded-full" />
            </Link>
          </div>
        </div>
      </div>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currency={currency}
        setCurrency={setCurrency}
        rate={rate}
      />
    </header>
  );
}
