import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TermsAcceptanceProps {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
  className?: string;
}

export function TermsAcceptance({ accepted, onChange, className }: TermsAcceptanceProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
        accepted ? 'border-green/30 bg-green/5' : 'border-border bg-surface/50 hover:border-accent/30',
        className
      )}
    >
      <input
        type="checkbox"
        checked={accepted}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-accent rounded border-border flex-shrink-0"
        aria-describedby="terms-desc"
      />
      <span id="terms-desc" className="text-xs text-muted leading-relaxed">
        I agree to the{' '}
        <Link to="/terms" className="text-accent font-semibold hover:underline" target="_blank">
          Terms of Service
        </Link>
        ,{' '}
        <Link to="/privacy" className="text-accent font-semibold hover:underline" target="_blank">
          Privacy Policy
        </Link>
        , and understand that Bitcoin payments are final and non-reversible.
      </span>
    </label>
  );
}