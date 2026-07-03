import { useEffect, useState } from 'react';
import { Zap, ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';

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
        <div className="text-center p-3 rounded-lg bg-surface border border-border">
          <ArrowUp className="w-4 h-4 text-green mx-auto mb-1" />
          <div className="text-lg font-bold font-mono">{totalLocal.toLocaleString()}</div>
          <div className="text-[10px] text-muted uppercase">Outbound</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-surface border border-border">
          <ArrowDown className="w-4 h-4 text-blue mx-auto mb-1" />
          <div className="text-lg font-bold font-mono">{totalRemote.toLocaleString()}</div>
          <div className="text-[10px] text-muted uppercase">Inbound</div>
        </div>
      </div>

      <div className="h-2 bg-surface rounded-full overflow-hidden flex">
        <div className="bg-green h-full transition-all" style={{ width: `${100 - inboundPct}%` }} />
        <div className="bg-blue h-full transition-all" style={{ width: `${inboundPct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted mt-1">
        <span>{channels.length} channels</span>
        <span>{inboundPct}% inbound capacity</span>
      </div>
    </Card>
  );
}