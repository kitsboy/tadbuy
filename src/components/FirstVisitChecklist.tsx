import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardTitle } from './ui';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'create', label: 'Create a campaign', path: '/#campaign-builder' },
  { id: 'wallet', label: 'Connect wallet (Fedimint / Lightning)', path: '/wallet' },
  { id: 'metrics', label: 'View metrics & results', path: '/metrics' },
] as const;

export function FirstVisitChecklist() {
  const [completed, setCompleted] = useLocalStorage<Record<string, boolean>>('tadbuy_checklist', {});
  const [hidden, setHidden] = useLocalStorage<boolean>('tadbuy_checklist_hidden', false);

  if (hidden) return null;

  const doneCount = STEPS.filter(s => completed[s.id]).length;
  if (doneCount >= STEPS.length) return null;

  const mark = (id: string) => setCompleted({ ...completed, [id]: true });

  return (
    <Card className="border-blue/20">
      <CardTitle>Getting started — {doneCount}/{STEPS.length}</CardTitle>
      <ul className="space-y-2">
        {STEPS.map(step => {
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