import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardTitle } from './ui';
import { cn } from '@/lib/utils';

type Persona = 'advertiser' | 'publisher' | 'browse';

const PERSONA_STEPS: Record<Persona, readonly { id: string; label: string; path: string }[]> = {
  advertiser: [
    { id: 'create', label: 'Launch your first campaign', path: '/#campaign-builder' },
    { id: 'wallet', label: 'Add a payment method (Lightning / Fedimint)', path: '/wallet' },
    { id: 'metrics', label: 'Track your campaign performance', path: '/analytics' },
  ],
  publisher: [
    { id: 'slots', label: 'List your first ad slot', path: '/publisher' },
    { id: 'payout', label: 'Set up payout wallet (Lightning)', path: '/wallet' },
    { id: 'embed', label: 'Add embed code to your site', path: '/publisher' },
  ],
  browse: [
    { id: 'watch', label: 'Browse marketplace slots', path: '/marketplace' },
    { id: 'save', label: 'Save interesting slots to your watchlist', path: '/marketplace' },
    { id: 'campaigns', label: 'Launch a campaign to support creators', path: '/#campaign-builder' },
  ],
};

const GENERIC_STEPS = [
  { id: 'create', label: 'Create a campaign', path: '/#campaign-builder' },
  { id: 'wallet', label: 'Connect wallet (Fedimint / Lightning)', path: '/wallet' },
  { id: 'metrics', label: 'View metrics & results', path: '/metrics' },
] as const;

export function FirstVisitChecklist() {
  const [completed, setCompleted] = useLocalStorage<Record<string, boolean>>('tadbuy_checklist', {});
  const [hidden, setHidden] = useLocalStorage<boolean>('tadbuy_checklist_hidden', false);
  const [persona] = useLocalStorage<Persona | null>('tadbuy_persona', null);

  if (hidden) return null;

  const steps = (persona && PERSONA_STEPS[persona]) ?? GENERIC_STEPS;
  const doneCount = steps.filter(s => completed[s.id]).length;
  if (doneCount >= steps.length) return null;

  const mark = (id: string) => setCompleted({ ...completed, [id]: true });

  const personaLabel = persona
    ? { advertiser: 'Advertiser', publisher: 'Publisher', browse: 'Explorer' }[persona]
    : null;

  return (
    <Card className="border-blue/20">
      <CardTitle>
        {personaLabel ? `${personaLabel} checklist` : 'Getting started'} — {doneCount}/{steps.length}
      </CardTitle>
      <ul className="space-y-2">
        {steps.map(step => {
          const done = completed[step.id];
          return (
            <li key={step.id}>
              <Link
                to={step.path}
                onClick={() => mark(step.id)}
                className={cn(
                  'flex items-center gap-2 text-sm rounded-lg px-3 py-2 transition-colors',
                  done ? 'text-muted line-through' : 'hover:bg-surface text-text font-semibold'
                )}
              >
                {done ? <CheckCircle2 className="w-4 h-4 text-green" /> : <Circle className="w-4 h-4 text-muted" />}
                {step.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => setHidden(true)}
        className="text-[10px] text-muted hover:text-text mt-3"
      >
        Dismiss checklist
      </button>
    </Card>
  );
}