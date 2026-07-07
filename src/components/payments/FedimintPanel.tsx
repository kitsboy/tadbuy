import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Loader2, CheckCircle2, ExternalLink, Wallet } from 'lucide-react';
import { Button, Input, Label, FormGroup } from '@/components/ui';
import { Badge, Progress, Alert } from '@/components/ui/index';
import { getFedimintStatus, joinFederation, payWithFedimint, formatEcashBalance, getDefaultFedimintInvite } from '@/services/fedimintService';
import { GIVEABIT_ECOSYSTEM } from '@/data/ecosystemConfig';
import { useToast } from '@/components/Toast';

export function FedimintPanel({
  amountSats,
  memo,
  onSuccess,
  checkoutMode = false,
}: {
  amountSats: number;
  memo: string;
  onSuccess?: () => void;
  /** At checkout: join happens in Wallet, not here */
  checkoutMode?: boolean;
}) {
  const [status, setStatus] = useState<Awaited<ReturnType<typeof getFedimintStatus>> | null>(null);
  const [invite, setInvite] = useState(getDefaultFedimintInvite());
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

  const balanceSats = status?.balanceMsats ? Math.floor(status.balanceMsats / 1000) : 0;
  const balancePct = balanceSats > 0 ? Math.min(100, Math.round((balanceSats / (balanceSats + amountSats)) * 100)) : 0;

  return (
    <div className="space-y-4 p-4 rounded-xl border border-green/30 bg-green/5">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-green" />
        <div>
          <div className="text-sm font-bold text-text">Fedimint Ecash</div>
          <div className="text-[10px] text-muted">Privacy-preserving federation payments</div>
        </div>
        <Badge variant={status?.connected ? 'success' : 'warning'} dot className="ml-auto">
          {status?.connected ? 'Connected' : 'Not Joined'}
        </Badge>
        <a href="https://fedimint.org" target="_blank" rel="noreferrer" className="text-muted hover:text-green">
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

          <Progress value={balancePct} showLabel variant="green" />

          {balanceSats < amountSats && (
            <Alert variant="warning" title="Insufficient Balance">
              Your ecash balance is below the campaign cost. Redeem more notes or fund via Lightning.
            </Alert>
          )}

          <Button onClick={handlePay} disabled={paying || balanceSats < amountSats} className="w-full gap-2">
            {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Pay with Ecash
          </Button>
        </div>
      ) : checkoutMode ? (
        <Alert variant="info" title="Connect Fedimint in Wallet">
          Join the <strong>{GIVEABIT_ECOSYSTEM.federation.name}</strong> once in your Wallet — then pay here with ecash.
          <Link to="/wallet" className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-green hover:underline">
            <Wallet className="w-4 h-4" />
            Open Wallet to join federation
          </Link>
        </Alert>
      ) : (
        <div className="space-y-3">
          <Alert variant="info" title="Join the Federation">
            Connect to the <strong>{GIVEABIT_ECOSYSTEM.federation.name}</strong> ({GIVEABIT_ECOSYSTEM.federation.status}) —
            shared across all Give A Bit apps. Mint runs on M4 HERMES.
          </Alert>
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