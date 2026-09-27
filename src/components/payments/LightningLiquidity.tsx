import { Zap } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Alert } from '@/components/ui/Alert';

export function LightningLiquidity() {
  return (
    <Card className="glass-panel">
      <CardTitle className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-lightning" />
        Lightning liquidity
        <span className="text-muted font-normal">· not connected</span>
      </CardTitle>
      <Alert variant="info" title="No live channel data">
        This preview does not connect to a Lightning node. Channel capacity, inbound/outbound liquidity, and routing availability are not available; no sample balances are shown as operational funds.
      </Alert>
    </Card>
  );
}