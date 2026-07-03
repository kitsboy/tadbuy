import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'live' | 'beta' | 'staged';
}

const STEPS: WorkflowStep[] = [
  { id: 'browse', title: 'Browse & Plan', description: 'Hero, stats, campaign builder, geo targeting', status: 'live' },
  { id: 'create', title: 'Create Campaign', description: '4-step wizard: budget, targeting, creative, payment', status: 'live' },
  { id: 'pay-lightning', title: 'Pay via Lightning', description: 'Real when Umbrel LND env vars set on M4', status: 'beta' },
  { id: 'pay-fedimint', title: 'Pay via Fedimint', description: 'Demo now — real when Give A Bit Mint live on M4', status: 'staged' },
  { id: 'pay-btc', title: 'Pay On-chain', description: 'Manual confirm — needs node broadcast on M4', status: 'beta' },
  { id: 'live', title: 'Campaign Goes Live', description: 'Supabase + Lightning webhook via api.giveabit.io', status: 'beta' },
  { id: 'analytics', title: 'Track Results', description: 'Metrics, funnel, PPQ Intelligence', status: 'live' },
];

const STATUS_ICON = {
  live: CheckCircle2,
  beta: AlertCircle,
  staged: Circle,
};

const STATUS_COLOR = {
  live: 'text-green',
  beta: 'text-accent',
  staged: 'text-muted',
};

export function ConsumerWorkflow({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {STEPS.map((step, i) => {
        const Icon = STATUS_ICON[step.status];
        return (
          <div key={step.id} className="flex gap-3 items-start">
            <div className="flex flex-col items-center">
              <Icon className={cn('w-5 h-5', STATUS_COLOR[step.status])} />
              {i < STEPS.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{step.title}</span>
                <span className={cn('text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border', {
                  'border-green/40 text-green bg-green/10': step.status === 'live',
                  'border-accent/40 text-accent bg-accent/10': step.status === 'beta',
                  'border-border text-muted': step.status === 'staged',
                })}>{step.status}</span>
              </div>
              <p className="text-xs text-muted mt-0.5">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}