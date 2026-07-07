import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/components/AuthProvider';

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

  if (!user || !isNewAccount) return null;

  return (
    <Alert variant="warning" title="New account spend cap">
      Accounts under {NEW_ACCOUNT_DAYS} days old are limited to{' '}
      <strong>{SPEND_CAP_SATS.toLocaleString()} sats</strong> per campaign until identity
      verification completes.{' '}
      <Link to="/settings" className="text-accent font-semibold hover:underline">
        Verify account →
      </Link>
    </Alert>
  );
}