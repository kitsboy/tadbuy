import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Wallet } from 'lucide-react';
import { Input, Label, FormGroup } from '@/components/ui';
import { Badge, Alert } from '@/components/ui/index';
import { getDefaultFedimintInvite } from '@/services/fedimintService';
import { GIVEABIT_ECOSYSTEM } from '@/data/ecosystemConfig';
import { useToast } from '@/components/Toast';
import { SafeLink } from '@/components/SafeLink';

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
  const [invite, setInvite] = useState(getDefaultFedimintInvite());
  const { addToast } = useToast();

  // Fedimint is not connected in this demo build — the platform has no /api/fedimint
  // backend on the static host, so no status/join/pay request is made. The Mint is
  // staged on M4 per docs/BETA.md; until then this surface is a labelled preview.

  const handleJoin = () => {
    if (!invite.trim()) {
      addToast('Enter a Fedimint invite code', 'error');
      return;
    }
    addToast('Demo — the Fedimint federation is not connected in this build. Nothing was sent.', 'info');
  };

  const handlePay = () => {
    addToast('Demo — Fedimint payments are not connected in this build. Nothing was sent or charged.', 'info');
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border border-green/30 bg-green/5">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-green" />
        <div>
          <div className="text-sm font-bold text-text">Fedimint Ecash</div>
          <div className="text-[10px] text-muted">Privacy-preserving federation payments</div>
        </div>
        <Badge variant="warning" dot className="ml-auto">
          Not connected (demo)
        </Badge>
        <SafeLink href="https://fedimint.org" className="text-muted hover:text-green" showIcon>
          <ExternalLink className="w-4 h-4" />
        </SafeLink>
      </div>

      <Alert variant="info" title="Demo preview">
        Fedimint is staged on M4 and connects once the platform API is online. Until then this panel is a labelled
        preview — no federation is joined and no ecash is moved.
      </Alert>

      {checkoutMode ? (
        <Alert variant="info" title="Pay with Fedimint">
          In this demo build, the campaign builder resolves to a labelled demo outcome instead of a real ecash payment.
          Use the Launch flow to see it.
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
          <button
            type="button"
            onClick={handleJoin}
            className="w-full px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-bold"
          >
            Join Federation (demo)
          </button>
        </div>
      )}
    </div>
  );
}