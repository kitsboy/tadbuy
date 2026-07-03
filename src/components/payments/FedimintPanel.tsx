import { useState, useEffect } from 'react';
import { Shield, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button, Input, Label, FormGroup } from '@/components/ui';
import { getFedimintStatus, joinFederation, payWithFedimint, formatEcashBalance } from '@/services/fedimintService';
import { useToast } from '@/components/Toast';

export function FedimintPanel({
  amountSats,
  memo,
  onSuccess,
}: {
  amountSats: number;
  memo: string;
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<Awaited<ReturnType<typeof getFedimintStatus>> | null>(null);
  const [invite, setInvite] = useState(import.meta.env.VITE_FEDIMINT_INVITE ?? '');
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    getFedimintStatus().then(setStatus).catch(() => {});
  }, []);

  const handleJoin = async () => {
    if (!invite.trim()) {
      addToast('Enter a Fedimint invite code', 'error');
      return;
    }
    setLoading(true);
    try {
      const s = await joinFederation(invite.trim());
      setStatus(s);
      addToast('Joined Fedimint federation', 'success');
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Join failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      const result = await payWithFedimint(amountSats, memo);
      if (result.success) {
        addToast('Fedimint ecash payment confirmed', 'success');
        onSuccess?.();
      }
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Payment failed', 'error');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border border-green/30 bg-green/5">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-green" />
        <div>
          <div className="text-sm font-bold text-text">Fedimint Ecash</div>
          <div className="text-[10px] text-muted">Privacy-preserving federation payments</div>
        </div>
        <a href="https://fedimint.org" target="_blank" rel="noreferrer" className="ml-auto text-muted hover:text-green">
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {status?.connected ? (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Federation</span>
            <span className="font-bold">{status.federationName ?? status.federationId ?? 'Connected'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Balance</span>
            <span className="font-mono font-bold text-green">{formatEcashBalance(status.balanceMsats)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Campaign cost</span>
            <span className="font-mono font-bold text-accent">{amountSats.toLocaleString()} sats</span>
          </div>
          <Button onClick={handlePay} disabled={paying} className="w-full gap-2">
            {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Pay with Ecash
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted leading-relaxed">
            Join a Fedimint federation to pay with private ecash. Your invite code connects you to a community mint backed by Bitcoin.
          </p>
          <FormGroup>
            <Label>Federation Invite</Label>
            <Input
              value={invite}
              onChange={e => setInvite(e.target.value)}
              placeholder="fm-invite://..."
              className="font-mono text-xs"
            />
          </FormGroup>
          <Button onClick={handleJoin} disabled={loading} variant="secondary" className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join Federation'}
          </Button>
        </div>
      )}
    </div>
  );
}