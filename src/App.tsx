import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense, type ReactNode } from 'react';
import { cn } from './lib/utils';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { PriceTicker } from './components/PriceTicker';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollProgress } from './components/ScrollProgress';
import { BackToTop } from './components/BackToTop';
import { SkipToContent } from './components/SkipToContent';
import { ThemeProvider } from './components/ThemeProvider';
import { CurrencyProvider } from './components/widgets/CurrencySwitcher';
import { DemoProvider } from './components/payments/DemoModeBadge';
import { BetaBanner } from './components/BetaBanner';
import { OfflineBanner } from './components/OfflineBanner';
import { Spinner } from './components/ui/Spinner';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { CURRENCY_SYMBOLS } from './constants';

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
const Pitch            = lazy(() => import('./pages/Pitch'));
const Intelligence     = lazy(() => import('./pages/Intelligence'));
const Integrations     = lazy(() => import('./pages/Integrations'));
const Enterprise       = lazy(() => import('./pages/Enterprise'));
const Beta             = lazy(() => import('./pages/Beta'));
const Health           = lazy(() => import('./pages/Health'));
const Changelog        = lazy(() => import('./pages/Changelog'));
const Compare          = lazy(() => import('./pages/Compare'));
const CaseStudies      = lazy(() => import('./pages/CaseStudies'));
const Platforms        = lazy(() => import('./pages/Platforms'));
const PlatformDetail   = lazy(() => import('./pages/PlatformDetail'));
const BuyAds           = lazy(() => import('./pages/BuyAds'));
const GeoTargeting     = lazy(() => import('./pages/GeoTargeting'));
const CommandMenu            = lazy(() => import('./components/CommandMenu'));
const KeyboardShortcutsHelp = lazy(() => import('./components/KeyboardShortcutsHelp'));
const LiveActivityWidget = lazy(() => import('./components/LiveActivityWidget'));
const NotFound         = lazy(() => import('./pages/NotFound'));
const Terms            = lazy(() => import('./pages/legal/Terms'));
const Privacy          = lazy(() => import('./pages/legal/Privacy'));
const Cookies          = lazy(() => import('./pages/legal/Cookies'));

// ── Page loader spinner ───────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3" role="status" aria-live="polite">
      <Spinner size="md" />
      <p className="text-xs text-muted font-semibold">Loading page…</p>
    </div>
  );
}

// ── Protected route guard ─────────────────────────────────────────────────────
function ProtectedRoute({ children, reason }: { children: ReactNode; reason?: string }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-muted" role="status" aria-live="polite">
          <Spinner size="md" />
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
          <p className="text-sm text-muted">
            {reason ?? 'You need to be signed in to access this page.'}
          </p>
          <Link
            to={`/profile?return=${encodeURIComponent(location.pathname + location.search)}`}
            className="inline-block mt-2 px-6 py-2 bg-accent text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ── Main content + routes ─────────────────────────────────────────────────────
function RoutedPages({ currency, rates }: { currency: string; rates: Record<string, number> }) {
  const location = useLocation();

  return (
    <RouteErrorBoundary key={location.pathname} label="This page">
      <Routes location={location}>
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
        <Route path="/pitch"         element={<Pitch />} />
        <Route path="/intelligence"  element={<Intelligence />} />
        <Route path="/integrations"  element={<Integrations />} />
        <Route path="/enterprise"    element={<Enterprise />} />
        <Route path="/beta"          element={<Beta />} />
        <Route path="/health"        element={<Health />} />
        <Route path="/changelog"     element={<Changelog />} />
        <Route path="/compare"       element={<Compare />} />
        <Route path="/case-studies"  element={<CaseStudies />} />
        <Route path="/platforms"     element={<Platforms />} />
        <Route path="/platforms/:slug" element={<PlatformDetail />} />
        <Route path="/start"         element={<Navigate to="/" replace />} />
        <Route path="/buy"           element={<Navigate to="/" replace />} />
        <Route path="/geo"         element={<GeoTargeting />} />
        <Route path="/terms"       element={<Terms />} />
        <Route path="/privacy"     element={<Privacy />} />
        <Route path="/cookies"     element={<Cookies />} />
        <Route path="/debug-lightning" element={<DebugLightning />} />

        {/* Protected */}
        <Route path="/campaigns"  element={<ProtectedRoute reason="Sign in to manage your active Bitcoin-native ad campaigns."><Campaigns /></ProtectedRoute>} />
        <Route path="/wallet"     element={<ProtectedRoute reason="Sign in to access your wallet balance, Lightning address, and Fedimint ecash."><Wallet /></ProtectedRoute>} />
        <Route path="/settings"   element={<ProtectedRoute reason="Sign in to update your profile, language, and currency preferences."><ProfileSettings /></ProtectedRoute>} />
        <Route path="/analytics"  element={<ProtectedRoute reason="Sign in to view your campaign performance metrics."><CampaignAnalytics /></ProtectedRoute>} />
        <Route path="/settlements" element={<ProtectedRoute reason="Sign in to view your ad spending settlements and publisher payouts."><Settlements /></ProtectedRoute>} />
        <Route path="/dashboard"  element={<ProtectedRoute reason="Sign in to see your real-time ad performance dashboard."><Dashboard /></ProtectedRoute>} />

        {/* Embeds */}
        <Route path="/embed/metrics/:id" element={<MetricsEmbed />} />
        <Route path="/embed/ad/:id"      element={<AdEmbed />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouteErrorBoundary>
  );
}

function MainContent({ currency, setCurrency, rates }: { currency: string; setCurrency: (c: string) => void; rates: Record<string, number> }) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currency={currency} setCurrency={setCurrency} rate={rates[currency] ?? 0} />
      {!isEmbed && <OfflineBanner />}
      {!isEmbed && <BetaBanner />}
      {!isEmbed && <PriceTicker rates={rates} />}
      <main
        id="main-content"
        className={cn(
          'flex-1 relative z-10 w-full mx-auto',
          isEmbed ? 'p-0 max-w-none' : 'p-4 md:p-8 max-w-[1440px] pb-24 md:pb-8'
        )}
      >
        <Suspense fallback={<PageLoader />}>
          <RoutedPages currency={currency} rates={rates} />
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
      <Router unstable_useTransitions={false}>
        <ThemeProvider>
        <CurrencyProvider>
        <DemoProvider>
        <SkipToContent />
        <ScrollToTop />
        <ScrollProgress />
        <AuthProvider>
          <ToastProvider>
            <Suspense fallback={null}>
              <CommandMenu />
              <KeyboardShortcutsHelp />
              <LiveActivityWidget />
            </Suspense>
            <MainContent currency={currency} setCurrency={setCurrency} rates={rates} />
            <BackToTop />
          </ToastProvider>
        </AuthProvider>
        </DemoProvider>
        </CurrencyProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}
