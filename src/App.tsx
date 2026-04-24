import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Megaphone, Layers, BarChart2, LayoutDashboard, Network, Zap, Globe, Search, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './pages/Dashboard';
import BuyAds from './pages/BuyAds';
import Campaigns from './pages/Campaigns';
import Metrics from './pages/Metrics';
import Hubhash from './pages/Hubhash';
import MetricsEmbed from './pages/embed/MetricsEmbed';
import AdEmbed from './pages/embed/AdEmbed';
import PublisherPortal from './pages/PublisherPortal';
import DebugLightning from './pages/DebugLightning';
import CampaignAnalytics from './pages/CampaignAnalytics';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Settlements from './pages/Settlements';
import Marketplace from './pages/Marketplace';
import Documentation from './pages/Documentation';
import ApiReference from './pages/ApiReference';
import PpqGuide from './pages/PpqGuide';
import Bolt12Info from './pages/Bolt12Info';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import CommandMenu from './components/CommandMenu';
import LiveActivityWidget from './components/LiveActivityWidget';
import { AuthProvider } from './components/AuthProvider';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LocalAvatar } from './components/LocalAvatar';

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', CAD: 'C$', EUR: '€', GBP: '£' };

function Header({ currency, setCurrency, rate }: { currency: string, setCurrency: (c: string) => void, rate: number }) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (isEmbed) return null;

  const navLinks = [
    { name: 'Buy Ads', path: '/', icon: Megaphone },
    { name: 'Marketplace', path: '/marketplace', icon: Globe },
    { name: 'Campaigns', path: '/campaigns', icon: Layers },
    { name: 'Metrics', path: '/metrics', icon: BarChart2 },
    { name: 'Publisher', path: '/publisher', icon: Globe },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Hubhash', path: '/hubhash', icon: Network },
  ];

  return (
    <header className="sticky top-0 z-50 glass-header px-3 md:px-6 h-12 flex items-center justify-between gap-3 md:gap-4">
      <div className="flex items-center gap-2 text-[18px] font-extrabold tracking-tight">
        <button className="lg:hidden p-1.5 text-muted hover:text-text rounded-lg hover:bg-surface transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
        <img src="https://camtaylor.ca/wp-content/uploads/2019/02/Bitcoin.svg.png" alt="Bitcoin" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
        <div className="hidden sm:block">
          <div className="leading-none tracking-tight text-text">Tadbuy</div>
          <div className="text-[9px] text-muted font-normal font-mono -mt-0.5">by giveabit.io</div>
        </div>
      </div>
      
      <nav className="hidden lg:flex gap-1">
        {navLinks.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) => cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-transparent text-[11px] font-semibold transition-all",
              isActive 
                ? "bg-surface border-border text-text shadow-sm" 
                : "text-muted hover:text-text hover:bg-surface/50"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="flex items-center gap-2 md:gap-3">
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

        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-muted bg-surface px-2 py-1 rounded-full border border-border cursor-pointer hover:bg-white/5 transition-colors" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
          <Search className="w-3 h-3" />
          <span>Search</span>
          <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-[9px]">⌘K</kbd>
        </div>

        <div className="hidden md:block w-px h-4 bg-border" />

        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <LocalAvatar seed="Felix Bitcoin" size={24} className="rounded-full border border-border" />
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-12 left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border shadow-2xl p-3 flex flex-col gap-1 lg:hidden z-50">
          {navLinks.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent text-xs font-semibold transition-all",
                isActive 
                  ? "bg-surface border-border text-text shadow-sm" 
                  : "text-muted hover:text-text hover:bg-surface/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </NavLink>
          ))}
          <div className="mt-2 pt-2 border-t border-border flex items-center gap-2 text-xs text-muted bg-surface px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-white/5 transition-colors" onClick={() => { setIsMobileMenuOpen(false); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true })); }}>
            <Search className="w-3.5 h-3.5" />
            <span>Search (Cmd+K)</span>
          </div>
        </div>
      )}
    </header>
  );
}

function MainContent({ currency, setCurrency, rates }: { currency: string, setCurrency: (c: string) => void, rates: any }) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');

  return (
    <div className="min-h-screen flex flex-col">
      <Header currency={currency} setCurrency={setCurrency} rate={rates[currency]} />
      <main className={cn(
        "flex-1 relative z-10 w-full mx-auto",
        isEmbed ? "p-0 max-w-none" : "p-4 md:p-8 max-w-[1440px]"
      )}>
        <Routes>
          <Route path="/" element={<BuyAds currency={currency} rate={rates[currency]} symbol={CURRENCY_SYMBOLS[currency]} />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/publisher" element={<PublisherPortal />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<CampaignAnalytics />} />
          <Route path="/debug-lightning" element={<DebugLightning />} />
          <Route path="/settlements" element={<Settlements />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hubhash" element={<Hubhash />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/api-docs" element={<ApiReference />} />
          <Route path="/ppq" element={<PpqGuide />} />
          <Route path="/bolt12" element={<Bolt12Info />} />
          <Route path="/embed/metrics/:id" element={<MetricsEmbed />} />
          <Route path="/embed/ad/:id" element={<AdEmbed />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isEmbed && <Footer />}
    </div>
  );
}

export default function App() {
  const [currency, setCurrency] = useLocalStorage<string>('tadbuy_currency', 'USD');
  const [rates, setRates] = useState({ USD: 96420, CAD: 130500, EUR: 88200, GBP: 75600 });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const fetchRates = async () => {
      // Pause polling when tab is hidden — saves network & CPU
      if (document.hidden) return;
      try {
        const res = await fetch('https://blockchain.info/ticker');
        const data = await res.json();
        if (data && data.USD && data.CAD && data.EUR && data.GBP) {
          setRates({
            USD: data.USD.last,
            CAD: data.CAD.last,
            EUR: data.EUR.last,
            GBP: data.GBP.last,
          });
        }
      } catch (e) {
        console.error('Failed to fetch real-time BTC rates', e);
      }
    };

    fetchRates();
    interval = setInterval(fetchRates, 30000);

    // Re-fetch immediately when tab becomes visible again
    const handleVisibility = () => { if (!document.hidden) fetchRates(); };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <CommandMenu />
            <LiveActivityWidget />
            <MainContent currency={currency} setCurrency={setCurrency} rates={rates} />
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
