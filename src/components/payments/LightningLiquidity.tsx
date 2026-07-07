import { useEffect, useState } from 'react';
import { Zap, ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { StatCard, Progress } from '@/components/ui/index';

interface ChannelInfo {
  localBalance: number;
  remoteBalance: number;
  capacity: number;
  active: boolean;
}

export function LightningLiquidity() {
  const [channels, setChannels] = useState<ChannelInfo[]>([]);
  const [alias, setAlias] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/lightning/channels')
      .then(r => r.json())
      .then(d => {
        setChannels(d.channels ?? []);
        setAlias(d.alias ?? null);
      })
      .catch(() => {});
  }, []);

  const totalLocal = channels.reduce((s, c) => s + c.localBalance, 0);
  const totalRemote = channels.reduce((s, c) => s + c.remoteBalance, 0);
  const inboundPct = totalLocal + totalRemote > 0
    ? Math.round((totalRemote / (totalLocal + totalRemote)) * 100)
    : 50;

  return (
    <Card className="glass-panel">
      <CardTitle className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-lightning" />
        Channel Liquidity {alias && <span className="text-muted font-normal">— {alias}</span>}
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