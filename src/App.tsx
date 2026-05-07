import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Link } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense, type ReactNode } from 'react';
import { Megaphone, Layers, BarChart2, LayoutDashboard, Network, Zap, Globe, MapPin, Search, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LocalAvatar } from './components/LocalAvatar';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { NotificationCenter } from './components/NotificationCenter';
import Footer from './components/Footer';
import { PriceTicker } from './components/PriceTicker';

// ── Eagerly loaded: above-the-fold critical path ──────────────────────────────
import BuyAds from './pages/BuyAds';

// ── Lazily loaded: all other routes load on-demand ───────────────────────────
const Dashboard        = lazy(() => import('./pages/Dashboard'));
const Campaigns        = lazy(() => import('./pages/Campaigns'));
const Metrics          = lazy(() => import('./pages/Metrics'));
const Hubhash          = lazy(() => import('./pages/Hubhash'));
const MetricsEmbed     = lazy(() => import('./pages/embed/MetricsEmbed'));
const AdEmbed          = lazy(() => import('./pages/embed/AdEmbed'));
const PublisherPortal  = lazy(() => import('./pages/PublisherPortal'));
const DebugLightning   = lazy(() => import('./pages/DebugLightning'));
const CampaignAnalytics = lazy(() => import('./pages/CampaignAnalytics'));
const Wallet           = lazy(() => import('./pages/Wallet'));
const Profile          = lazy(() => import('./pages/Profile'));
const ProfileSettings  = lazy(() => import('./pages/ProfileSettings'));
const Settlements      = lazy(() => import('./pages/Settlements'));
const Marketplace      = lazy(() => import('./pages/Marketplace'));
const Documentation    = lazy(() => import('./pages/Documentation'));
const ApiReference     = lazy(() => import('./pages/ApiReference'));
const PpqGuide         = lazy(() => import('./pages/PpqGuide'));
const Bolt12Info       = lazy(() => import('./pages/Bolt12Info'));
const GeoTargeting     = lazy(() => import('./pages/GeoTargeting'));
const CommandMenu      = lazy(() => import('./components/CommandMenu'));
const LiveActivityWidget = lazy(() => import('./components/LiveActivityWidget'));
const NotFound         = lazy(() => import('./pages/NotFound'));
const Terms            = lazy(() => import('./pages/legal/Terms'));
const Privacy          = lazy(() => import('./pages/legal/Privacy'));
const Cookies          = lazy(() => import('./pages/legal/Cookies'));

// ── Page loader spinner ───────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );
}

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', CAD: 'C$', EUR: '€', GBP: '£' };

// ── Protected route guard ─────────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-muted">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm space-y-4">
          <div className="text-4xl">🔐</div>
          <h2 className="text-xl font-extrabold">Sign in required</h2>
          <p className="text-sm text-muted">You need to be signed in to access this page.</p>
          <a
            href="/profile"
            className="inline-block mt-2 px-6 py-2 bg-accent text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ── Header ────────────────────────────────────────────────────────────────────
function Header({ currency, setCurrency, rate }: { currency: string; setCurrency: (c: string) => void; rate: number }) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  if (isEmbed) return null;

  const navLinks = [
    { name: 'Buy Ads',     path: '/',           icon: Megaphone },
    { name: 'Marketplace', path: '/marketplace', icon: Globe },
    { name: 'Campaigns',   path: '/campaigns',   icon: Layers },
    { name: 'Metrics',     path: '/metrics',     icon: BarChart2 },
    { name: 'Wallet',      path: '/wallet',      icon: Zap },
    { name: 'Publisher',   path: '/publisher',   icon: Globe },
    { name: 'Dashboard',   path: '/dashboard',   icon: LayoutDashboard },
    { name: 'Hubhash',     path: '/hubhash',     icon: Network },
    { name: 'Geo',         path: '/geo',         icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-50 glass-header px-3 md:px-6 h-12 flex items-center justify-between gap-3 md:gap-4">
      <div className="flex items-center gap-2 text-[18px] font-extrabold tracking-tight">
        <button
          className="md:hidden p-1.5 text-muted hover:text-text rounded-lg hover:bg-surface transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
        <img src="/favicon.png" alt="Tadbuy" className="w-7 h-7 flex-shrink-0 object-contain" />
        <div className="hidden sm:block">
          <div className="leading-none tracking-tight text-text">Tadbuy</div>
          <div className="text-[9px] text-muted font-normal font-mono -mt-0.5">by giveabit.io</div>
        </div>
      </div>

      <nav className="hidden md:flex gap-1">
        {navLinks.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-transparent text-[11px] font-semibold transition-all',
              isActive
                ? 'bg-surface border-border text-text shadow-sm'
                : 'text-muted hover:text-text hover:bg-surface/50'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.name}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2 md:gap-3">
        {/* BTC rate + currency picker */}
        <div className="flex items-center gap-1 md:gap-1.5 font-mono text-[10px] text-accent border border-accent/20 bg-accent/5 px-2 md:px-2.5 py-0.5 rounded-full">
          <span>₿</span>
          <div className="w-px h-2.5 bg-accent/30" />
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="bg-transparent border-none outline-none text-accent cursor-pointer appearance-none pr-1 font-bold"
          >
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          <span className="hidden sm:inline">{CURRENCY_SYMBOLS[currency]}{Math.round(rate).toLocaleString()}</span>
        </div>

        <div className="hidden md:block w-px h-4 bg-border" />

        <div
          className="hidden md:flex items-center gap-1.5 text-[10px] text-muted bg-surface px-2 py-1 rounded-full border border-border cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
        >
          <Search className="w-3 h-3" />
          <span>Search</span>
          <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-[9px]">⌘K</kbd>
        </div>

        <div className="hidden md:block w-px h-4 bg-border" />

        <LanguageSwitcher />

        <NotificationCenter />

        <div className="hidden md:block w-px h-4 bg-border" />

        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <LocalAvatar seed="Felix Bitcoin" size={24} className="rounded-full border border-border" />
        </Link>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-12 left-0 right-0 bg-card border-b border-border shadow-2xl p-3 flex flex-col gap-1 md:hidden z-50">
          {navLinks.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent text-xs font-semibold transition-all',
                isActive
                  ? 'bg-surface border-border text-text shadow-sm'
                  : 'text-muted hover:text-text hover:bg-surface/50'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </NavLink>
          ))}
          <div
            className="mt-2 pt-2 border-t border-border flex items-center gap-2 text-xs text-muted bg-surface px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => { setIsMobileMenuOpen(false); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true })); }}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search (Cmd+K)</span>
          </div>
        </div>
      )}
    </header>
  );
}

// ── Main content + routes ─────────────────────────────────────────────────────
function MainContent({ currency, setCurrency, rates }: { currency: string; setCurrency: (c: string) => void; rates: Record<string, number> }) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');

  return (
    <div className="min-h-screen flex flex-col">
      <Header currency={currency} setCurrency={setCurrency} rate={rates[currency]} />
      {!isEmbed && <PriceTicker rates={rates} />}
      <main className={cn(
        'flex-1 relative z-10 w-full mx-auto',
        isEmbed ? 'p-0 max-w-none' : 'p-4 md:p-8 max-w-[1440px]'
      )}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/"            element={<BuyAds currency={currency} rate={rates[currency]} symbol={CURRENCY_SYMBOLS[currency]} />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/metrics"     element={<Metrics />} />
            <Route path="/publisher"   element={<PublisherPortal />} />
            <Route path="/profile"     element={<Profile />} />
            <Route path="/hubhash"     element={<Hubhash />} />
            <Route path="/docs"        element={<Documentation />} />
            <Route path="/api-docs"    element={<ApiReference />} />
            <Route path="/ppq"         element={<PpqGuide />} />
            <Route path="/bolt12"      element={<Bolt12Info />} />
            <Route path="/geo"         element={<GeoTargeting />} />
            <Route path="/terms"       element={<Terms />} />
            <Route path="/privacy"     element={<Privacy />} />
            <Route path="/cookies"     element={<Cookies />} />
            <Route path="/debug-lightning" element={<DebugLightning />} />

            {/* Protected */}
            <Route path="/campaigns"  element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
            <Route path="/wallet"     element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/settings"   element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/analytics"  element={<ProtectedRoute><CampaignAnalytics /></ProtectedRoute>} />
            <Route path="/settlements" element={<ProtectedRoute><Settlements /></ProtectedRoute>} />
            <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Embeds */}
            <Route path="/embed/metrics/:id" element={<MetricsEmbed />} />
            <Route path="/embed/ad/:id"      element={<AdEmbed />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isEmbed && <Footer />}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [currency, setCurrency] = useLocalStorage<string>('tadbuy_currency', 'USD');
  const [rates, setRates] = useState<Record<string, number>>({ USD: 96420, CAD: 130500, EUR: 88200, GBP: 75600 });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const fetchRates = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch('https://blockchain.info/ticker');
        const data = await res.json();
        if (data?.USD && data?.CAD && data?.EUR && data?.GBP) {
          setRates({ USD: data.USD.last, CAD: data.CAD.last, EUR: data.EUR.last, GBP: data.GBP.last });
        }
      } catch {
        // Silently fall back to stale rates
      }
    };

    fetchRates();
    interval = setInterval(fetchRates, 30000);
    const onVisibility = () => { if (!document.hidden) fetchRates(); };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <Suspense fallback={null}>
              <CommandMenu />
              <LiveActivityWidget />
            </Suspense>
            <MainContent currency={currency} setCurrency={setCurrency} rates={rates} />
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
