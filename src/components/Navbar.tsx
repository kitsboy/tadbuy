import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Layers, BarChart2, LayoutDashboard, Network, Globe, MapPin, Search, Menu, X, ChevronDown, Store, TrendingUp, Wallet, User, ChevronRight, Activity, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { NotificationCenter } from './NotificationCenter';
import { LocalAvatar } from './LocalAvatar';
import { BtcPriceChart } from './widgets/BtcPriceChart';
import { Button } from './ui';
import { openCommandMenu } from '@/lib/commandMenu';

const NAV_ITEMS = [
  { name: 'Buy Ads', path: '/', icon: Megaphone, description: 'Create and manage Bitcoin-native ad campaigns' },
  { name: 'Marketplace', path: '/marketplace', icon: Globe, description: 'Browse and purchase advertising inventory' },
  { name: 'Campaigns', path: '/campaigns', icon: Layers, description: 'View and optimize your active campaigns' },
  { name: 'Metrics', path: '/metrics', icon: BarChart2, description: 'Performance analytics and insights' },
  { name: 'Wallet', path: '/wallet', icon: Wallet, description: 'Manage Lightning and Bitcoin balances' },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, description: 'Real-time ad performance dashboard' },
];

const MORE_NAV_ITEMS = [
  { name: 'Platforms', path: '/platforms', icon: TrendingUp, description: 'Platform performance comparison' },
  { name: 'Publisher', path: '/publisher', icon: Store, description: 'Publisher portal and analytics' },
  { name: 'Hubhash', path: '/hubhash', icon: Network, description: 'Social media integration' },
  { name: 'Geo Reach', path: '/geo', icon: MapPin, description: 'Geographic targeting tools' },
  { name: 'Analytics', path: '/analytics', icon: BarChart, description: 'Advanced campaign analytics' },
  { name: 'Settlements', path: '/settlements', icon: Activity, description: 'View settlement history' },
];

function NavDropdown({ items, title, icon: Icon, isOpen, onToggle }: {
  items: typeof NAV_ITEMS;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      onToggle();
    }, 200);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg border border-transparent text-sm font-semibold transition-all whitespace-nowrap',
          isOpen
            ? 'bg-surface border-border text-text shadow-sm'
            : 'text-muted hover:text-text hover:bg-surface/50'
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Icon className="w-4 h-4" />
        {title}
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {(isOpen || isHovered) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 mt-2 w-72 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2">
              {items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all min-h-[44px]',
                      isActive
                        ? 'bg-accent/10 text-accent border border-accent/30'
                        : 'text-muted hover:text-text hover:bg-surface'
                    )}
                  >
                    <ItemIcon className="w-4 h-4" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-muted font-normal">{item.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const closeAll = () => {
      setIsMobileMenuOpen(false);
      setIsMoreDropdownOpen(false);
    };
    window.addEventListener('resize', closeAll);
    return () => window.removeEventListener('resize', closeAll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const isEmbed = location.pathname.startsWith('/embed');
  if (isEmbed) return null;

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
    setIsMoreDropdownOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled ? 'shadow-lg shadow-black/20' : '',
        'px-3 md:px-6 py-2 md:py-3 border-b border-border/50'
      )}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Brand Section */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src="/favicon.png" alt="Tadbuy" className="w-8 h-8 object-contain" />
                <span className="absolute -inset-1 rounded-full bg-accent/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight leading-none">Tadbuy</div>
                <div className="text-[10px] text-muted font-mono tracking-wider -mt-0.5">by giveabit.io</div>
              </div>
            </Link>
          </div>

          {/* Primary Navigation */}
          <nav className="flex items-center gap-1 relative z-20 flex-1 justify-center min-w-0 pointer-events-auto" aria-label="Main navigation">
            <NavDropdown
              items={NAV_ITEMS}
              title="Buy Ads"
              icon={Megaphone}
              isOpen={isMoreDropdownOpen}
              onToggle={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
            />
            {NAV_ITEMS.slice(1).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => cn(
                    'flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg border border-transparent text-sm font-semibold transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-surface border-border text-text shadow-sm'
                      : 'text-muted hover:text-text hover:bg-surface/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Utility Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Currency selector */}
            <div className="flex items-center gap-1 font-mono text-xs text-accent border border-accent/20 bg-accent/5 px-2.5 py-1 rounded-full">
              <span>₿</span>
              <div className="w-px h-2.5 bg-accent/30" />
              <select
                aria-label="Display currency"
                className="bg-transparent border-none outline-none text-accent cursor-pointer appearance-none font-bold text-xs pr-1"
              >
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted hover:text-text"
              onClick={openCommandMenu}
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-medium">Search</span>
              <kbd className="hidden lg:inline font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
            </Button>

            {/* BTC Chart */}
            <div className="hidden xl:block">
              <BtcPriceChart className="h-10" />
            </div>

            {/* Settings */}
            <ThemeToggle className="p-2" />
            <LanguageSwitcher />
            <NotificationCenter />

            {/* Profile */}
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 rounded-lg border border-transparent hover:border-border transition-colors"
              aria-label="My profile"
            >
              <LocalAvatar seed="Felix Bitcoin" size={32} className="rounded-full border border-border" />
            </Link>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-2">
          <button
            className="p-2 -ml-2 text-muted hover:text-text rounded-lg hover:bg-surface transition-colors touch-target"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/favicon.png" alt="Tadbuy" className="w-7 h-7 object-contain" />
            <div className="text-base font-bold tracking-tight">Tadbuy</div>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle className="p-2" />
            <Link to="/profile" aria-label="My profile" className="p-1">
              <LocalAvatar seed="Felix Bitcoin" size={28} className="rounded-full" />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-xl md:hidden z-50 overflow-hidden"
            >
              <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto">
                {/* Primary nav */}
                <div className="p-4 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 px-2">Main</div>
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={handleMobileNavClick}
                        className={({ isActive }) => cn(
                          'flex items-center gap-3 px-3 py-3 rounded-lg border border-transparent text-sm font-semibold transition-all touch-target',
                          isActive
                            ? 'bg-surface border-border text-text shadow-sm'
                            : 'text-muted hover:text-text hover:bg-surface/50'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-muted font-normal mt-0.5">{item.description}</div>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>

                {/* More tools */}
                <div className="px-4 pb-4 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 px-2">More Tools</div>
                  {MORE_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleMobileNavClick}
                        className={({ isActive }) => cn(
                          'flex items-center gap-3 px-3 py-3 rounded-lg border border-transparent text-sm font-semibold transition-all touch-target',
                          isActive
                            ? 'bg-surface border-border text-text shadow-sm'
                            : 'text-muted hover:text-text hover:bg-surface/50'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </NavLink>
                    );
                  })}
                </div>

                {/* Bottom actions */}
                <div className="px-4 pb-4 pt-2 border-t border-border space-y-3 sticky bottom-0 bg-card">
                  {/* BTC rate pill */}
                  <div className="font-mono text-xs text-accent text-center py-2 border border-accent/20 bg-accent/5 rounded-full">
                    ₿ BTC/USD {Math.round(96420).toLocaleString()}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center gap-2"
                    onClick={() => { setIsMobileMenuOpen(false); openCommandMenu(); }}
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                    <kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px] ml-auto">⌘K</kbd>
                  </Button>

                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-text bg-surface rounded-lg border border-border hover:bg-white/5 transition-colors touch-target"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
