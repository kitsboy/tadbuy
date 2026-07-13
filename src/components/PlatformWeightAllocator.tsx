import { Input, Label } from '@/components/ui';
import { cn, formatSats } from '@/lib/utils';
import type { AdPlatform } from '@/data/platforms';
import { allocateBudget } from '@/data/platforms';

type AllocatorMode = 'even' | 'weighted' | 'ppq';

type PlatformWeightAllocatorProps = {
  platforms: AdPlatform[];
  selectedIds: string[];
  weights: Record<string, number>;
  mode: AllocatorMode;
  onModeChange: (mode: AllocatorMode) => void;
  onWeightChange: (platformId: string, pct: number) => void;
  budgetUsd: number;
  budgetSats: number;
};

export function PlatformWeightAllocator({
  platforms,
  selectedIds,
  weights,
  mode,
  onModeChange,
  onWeightChange,
  budgetUsd,
  budgetSats,
}: PlatformWeightAllocatorProps) {
  const selected = platforms.filter(p => selectedIds.includes(p.id));
  const weightArg = mode === 'even' ? 'even' as const : mode === 'ppq' ? 'ppq' as const : weights;
  const allocations = allocateBudget(selectedIds, budgetUsd, weightArg);
  const totalWeight = selectedIds.reduce((s, id) => s + (weights[id] ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['even', 'weighted', 'ppq'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all',
              mode === m ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:border-muted',
            )}
          >
            {m === 'even' ? 'Even split' : m === 'weighted' ? 'Custom %' : 'PPQ optimized'}
          </button>
        ))}
      </div>

      {mode === 'weighted' && (
        <div className="space-y-2">
          {selected.map(p => (
            <div key={p.id} className="flex items-center gap-3">
              <Label className="w-24 shrink-0 text-[11px] mb-0">{p.name}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={weights[p.id] ?? 0}
                onChange={e => onWeightChange(p.id, parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <span className="text-[10px] text-muted w-8">%</span>
            </div>
          ))}
          {Math.abs(totalWeight - 100) > 0.5 && (
            <p className="text-[10px] text-lightning">Weights sum to {totalWeight.toFixed(0)}% — will normalize to 100%</p>
          )}
        </div>
      )}

      {mode === 'ppq' && (
        <p className="text-[10px] text-muted">
          PPQ shifts more budget to lower-CPM / higher-efficiency platforms automatically.
        </p>
      )}

      {allocations.length > 0 && (
        <div className="rounded-xl border border-border bg-surface/50 p-3 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Allocation preview</div>
          {allocations.map(a => {
            const p = platforms.find(x => x.id === a.platformId);
            const sats = Math.round((a.budgetUsd / budgetUsd) * budgetSats) || 0;
            return (
              <div key={a.platformId} className="flex justify-between text-[11px]">
                <span className="text-text font-semibold">{p?.name ?? a.platformId}</span>
                <span className="text-muted font-mono">
                  {a.weightPct.toFixed(0)}% · {formatSats(sats)} · ~{a.impressions.toLocaleString()} imp
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}