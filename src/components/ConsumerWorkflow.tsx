import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'live' | 'beta' | 'staged';
}

const STEPS: WorkflowStep[] = [
  { id: 'browse', title: 'Explore', description: 'Browse guides and illustrative placement concepts.', status: 'live' },
  { id: 'create', title: 'Plan', description: 'Build a campaign preview saved only in this browser.', status: 'live' },
  { id: 'publish', title: 'Publish a Nostr note', description: 'Optional external action: your browser signer sends the signed note to relays; this does not buy placement or prove reach.', status: 'beta' },
  { id: 'vendor', title: 'Coordinate a publisher placement', description: 'Sample flow only; no vendors or inventory are currently connected.', status: 'staged' },
  { id: 'settle', title: 'Pay or settle', description: 'Not available: no Tadbuy payment service, ledger, or campaign account is connected.', status: 'staged' },
  { id: 'report', title: 'Measure delivery', description: 'Not available: campaign impression, click, and conversion data are not connected.', status: 'staged' },
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
    <div className={cn('space-y-3', className)} aria-label="What works in this preview" role="list">
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