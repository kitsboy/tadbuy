import { ExternalLink, Shield } from 'lucide-react';
import { Badge, Alert } from '@/components/ui/index';
import { SafeLink } from '@/components/SafeLink';

export function FedimintPanel() {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface/50 p-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-muted" />
        <div>
          <div className="text-sm font-bold text-text">Give A Bit Fedimint</div>
          <div className="text-[10px] text-muted">A federated ecash rail in the family roadmap</div>
        </div>
        <Badge variant="warning" className="ml-auto">Staged · not connected</Badge>
        <SafeLink href="https://fedimint.org" className="text-muted hover:text-green" showIcon>
          <ExternalLink className="h-4 w-4" />
        </SafeLink>
      </div>

      <Alert variant="warning" title="No federation session or payment is available">
        This preview does not issue an invite, join a federation, create or redeem ecash, verify a payment, or create a campaign order. A real connection needs an operator-approved invite and confirmed mint/client compatibility.
      </Alert>
      <p className="text-[10px] leading-relaxed text-muted">
        Never paste invite codes, seeds, macaroons, or wallet secrets into this preview. Ask the Give A Bit operator for the approved connection path when the rail is ready.
      </p>
    </div>
  );
}
