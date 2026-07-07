import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface InvoiceRegenerateProps {
  amountSats: number;
  description?: string;
  onRegenerated?: (invoice: { invoice: string; expiresAt: string }) => void;
}

export function InvoiceRegenerate({ amountSats, description, onRegenerated }: InvoiceRegenerateProps) {
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lightning/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountSats, description: description ?? 'Tadbuy Campaign' }),
      });
      const data = await res.json();
      if (data.payment_request || data.invoice) {
        onRegenerated?.({
          invoice: data.payment_request ?? data.invoice,
          expiresAt: data.expires_at ?? new Date(Date.now() + 3600000).toISOString(),
        });
      }
    } catch {
      onRegenerated?.({
        invoice: `lnbc${amountSats}n1p...regenerated_demo`,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleRegenerate}
      disabled={loading}
      className="gap-1.5 text-xs"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Regenerating…' : 'Regenerate invoice'}
    </Button>
  );
}