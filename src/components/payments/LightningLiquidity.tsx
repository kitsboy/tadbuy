import { Zap, ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { StatCard, Progress } from '@/components/ui/index';

interface ChannelInfo {
  localBalance: number;
  remoteBalance: number;
  capacity: number;
  active: boolean;
}

// Labelled demo sample — the platform has no /api/lightning/channels backend on the
// static host, so this widget renders representative liquidity and makes no request.
const SAMPLE_CHANNELS: ChannelInfo[] = [
  { localBalance: 3_200_000, remoteBalance: 4_800_000, capacity: 8_000_000, active: true },
  { localBalance: 1_500_000, remoteBalance: 2_500_000, capacity: 4_000_000, active: true },
];

export function LightningLiquidity() {
  const channels = SAMPLE_CHANNELS;

  const totalLocal = channels.reduce((s, c) => s + c.localBalance, 0);
  const totalRemote = channels.reduce((s, c) => s + c.remoteBalance, 0);
  const inboundPct = totalLocal + totalRemote > 0
    ? Math.round((totalRemote / (totalLocal + totalRemote)) * 100)
    : 50;

  return (
    <Card className="glass-panel">
      <CardTitle className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-lightning" />
        Channel Liquidity
        <span className="text-muted font-normal">— demo</span>
      </CardTitle>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatCard icon={ArrowUp} label="Outbound" value={totalLocal.toLocaleString()} sub="sats local" color="text-green" />
        <StatCard icon={ArrowDown} label="Inbound" value={totalRemote.toLocaleString()} sub="sats remote" color="text-blue" />
      </div>

      <Progress value={inboundPct} showLabel variant="lightning" />

      <div className="flex justify-between text-[10px] text-muted mt-2">
        <span>{channels.length} channels</span>
        <span>{inboundPct}% inbound capacity</span>
      </div>
    </Card>
  );
}