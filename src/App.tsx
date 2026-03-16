import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Megaphone, Layers, BarChart2, LayoutDashboard, Network, Zap, Globe } from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './pages/Dashboard';
import BuyAds from './pages/BuyAds';
import Campaigns from './pages/Campaigns';
import Metrics from './pages/Metrics';
import Hubhash from './pages/Hubhash';
import MetricsEmbed from './pages/embed/MetricsEmbed';
import AdEmbed from './pages/embed/AdEmbed';
import Pulse from './pages/Pulse';
import PublisherPortal from './pages/PublisherPortal';
import DebugLightning from './pages/DebugLightning';
import CampaignAnalytics from './pages/CampaignAnalytics';
import Profile from './pages/Profile';
import Settlements from './pages/Settlements';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', CAD: 'C$', EUR: '€', GBP: '£' };

function Header({ currency, setCurrency, rate }: { currency: string, setCurrency: (c: string) => void, rate: number }) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');
  if (isEmbed) return null;

  return (
    <header className="sticky top-0 z-50 glass-header px-8 h-16 flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 text-[22px] font-extrabold tracking-tight">
        <img src="https://camtaylor.ca/wp-content/uploads/2019/02/Bitcoin.svg.png" alt="Bitcoin" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
        <div>
          <div className="leading-none tracking-tight text-text">Tadbuy</div>
          <div className="text-[11px] text-muted font-normal font-mono -mt-0.5">by giveabit.io</div>
        </div>
      </div>
      
      <nav className="flex gap-2">
        {[
          { name: 'Buy Ads', path: '/', icon: Megaphone },
          { name: 'Campaigns', path: '/campaigns', icon: Layers },
          { name: 'Metrics', path: '/metrics', icon: BarChart2 },
          { name: 'Pulse', path: '/pulse', icon: Zap },
          { name: 'Publisher', path: '/publisher', icon: Globe },
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Hubhash', path: '/hubhash', icon: Network },
        ].map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) => cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border border-transparent text-[13px] font-semibold transition-all",
              isActive 
                ? "bg-surface border-border text-text shadow-sm" 
                : "text-muted hover:text-text hover:bg-surface/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-mono text-xs text-accent border border-accent/20 bg-accent/5 px-3 py-1.5 rounded-full">
          <span>₿</span>
          <div className="w-px h-3 bg-accent/30" />
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
          <span>{CURRENCY_SYMBOLS[currency]}{Math.round(rate).toLocaleString()}</span>
        </div>

        <div className="w-px h-6 bg-border" />

        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f7931a" alt="User Avatar" className="w-8 h-8 rounded-full border border-border bg-surface" referrerPolicy="no-referrer" />
        </Link>
      </div>
    </header>
  );
}

function MainContent({ currency, rates }: { currency: string, rates: any }) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');

  return (
    <div className="min-h-screen flex flex-col">
      <Header currency={currency} setCurrency={() => {}} rate={rates[currency]} />
      <main className={cn(
        "flex-1 relative z-10 w-full mx-auto",
        isEmbed ? "p-0 max-w-none" : "p-8 max-w-[1440px]"
      )}>
        <Routes>
          <Route path="/" element={<BuyAds currency={currency} rate={rates[currency]} symbol={CURRENCY_SYMBOLS[currency]} />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/pulse" element={<Pulse />} />
          <Route path="/publisher" element={<PublisherPortal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<CampaignAnalytics />} />
          <Route path="/debug-lightning" element={<DebugLightning />} />
          <Route path="/settlements" element={<Settlements />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hubhash" element={<Hubhash />} />
          <Route path="/embed/metrics/:id" element={<MetricsEmbed />} />
          <Route path="/embed/ad/:id" element={<AdEmbed />} />
        </Routes>
      </main>
      {!isEmbed && <Footer />}
    </div>
  );
}

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({ USD: 96420, CAD: 130500, EUR: 88200, GBP: 75600 });

  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => ({
        USD: prev.USD + (Math.random() - 0.5) * 200,
        CAD: prev.CAD + (Math.random() - 0.5) * 270,
        EUR: prev.EUR + (Math.random() - 0.5) * 180,
        GBP: prev.GBP + (Math.random() - 0.5) * 150,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <ToastProvider>
        <MainContent currency={currency} rates={rates} />
      </ToastProvider>
    </Router>
  );
}
