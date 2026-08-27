import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/components/AuthProvider';
import { useCallback } from 'react';
import { AD_PLATFORMS } from '@/data/platforms';

const NEW_ACCOUNT_DAYS = 14;
const SPEND_CAP_SATS = 50_000;

export function SpendLimitBanner() {
  const { user } = useAuth();

  const isNewAccount = useMemo(() => {
    if (!user?.metadata?.creationTime) return false;
    const created = new Date(user.metadata.creationTime).getTime();
    const daysSince = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return daysSince <= NEW_ACCOUNT_DAYS;
  }, [user]);

  const platformMinimums = useMemo(() => {
    return AD_PLATFORMS.filter(p => p.minSpendUsd > 10).map(p => ({
      name: p.name,
      minSpendUsd: p.minSpendUsd,
    }));
  }, []);

  if (!user || !isNewAccount) {
    // Show platform minimums alert when user has selected high-minimum platforms
    // (This requires prop or context — shown as info when user is browsing platforms)
    return null;
  }

  return (
    <Alert variant="warning" title="New account spend cap">
      Accounts under {NEW_ACCOUNT_DAYS} days old are limited to{' '}
      <strong>{SPEND_CAP_SATS.toLocaleString()} sats</strong> per campaign until identity
      verification completes.{' '}
      <Link to="/settings" className="text-accent font-semibold hover:underline">
        Verify account →
      </Link>
      {platformMinimums.length > 0 && (
        <span className="block mt-1 text-[10px] text-muted">
          Note: LinkedIn and X require a minimum campaign spend of $10+ USD.
        </span>
      )}
    </Alert>
  );
}

export function PlatformMinSpendHint({ platformIds }: { platformIds?: string[] }) {
  const platforms = platformIds ?? AD_PLATFORMS.filter(p => p.minSpendUsd >= 10);
  if (platforms.length === 0) return null;
  return (
    <Alert variant="info" className="mt-2">
      <span className="text-xs">
        Minimum spend required:{' '}
        {platforms.map(p => (
          <span key={p.id}>
            <strong>{p.name}</strong> ${p.minSpendUsd} USD{' '}
            {platforms.length > 1 && platforms.indexOf(p) < platforms.length - 1 ? '· ' : ''}
          </span>
        ))}
      </span>
    </Alert>
  );
}