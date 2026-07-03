import { Link } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function BetaBanner() {
  const [dismissed, setDismissed] = useLocalStorage<boolean>('tadbuy_beta_banner', false);
  if (dismissed) return null;

  return (
    <div className="bg-accent/10 border-b border-accent/30 px-4 py-2 flex items-center justify-center gap-3 text-xs">
      <AlertTriangle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
      <span className="text-muted">
        <strong className="text-accent">BETA</strong> — Payments use demo mode until M4 Fedimint mint + Umbrel are connected.{' '}
        <Link to="/beta" className="text-accent font-bold hover:underline">See what works →</Link>
      </span>
      <button onClick={() => setDismissed(true)} className="text-muted hover:text-text p-1" aria-label="Dismiss">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}