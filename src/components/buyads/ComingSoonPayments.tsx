import { Link } from 'react-router-dom';
import { getComingSoonPaymentMethods } from '@/lib/payments/registry';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui';

export function ComingSoonPayments({ expanded }: { expanded: boolean }) {
  if (!expanded) return null;

  const methods = getComingSoonPaymentMethods();

  return (
    <Card className="mt-4 border-border/60">
      <CardTitle>More payment options — coming soon</CardTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {methods.map(pm => (
          <div key={pm.id} className="p-3 rounded-xl border border-border bg-surface/50 text-center opacity-75">
            <div className="text-lg mb-1">{typeof pm.icon === 'string' ? pm.icon : '◇'}</div>
            <div className="text-[11px] font-bold">{pm.name}</div>
            <Badge variant="outline" className="mt-1 text-[9px]">Soon</Badge>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted mt-3">
        BOLT12, Nostr Zaps, Cashu, and more are in development.{' '}
        <Link to="/beta" className="text-accent hover:underline">See BETA status →</Link>
      </p>
    </Card>
  );
}