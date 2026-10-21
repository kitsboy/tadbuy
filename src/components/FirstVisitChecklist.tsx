import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardTitle } from './ui';
import { cn } from '@/lib/utils';

type Persona = 'advertiser' | 'publisher' | 'browse';

const PERSONA_STEPS: Record<Persona, readonly { id: string; label: string; path: string }[]> = {
  advertiser: [
    { id: 'create', label: 'Build a local campaign preview', path: '/#campaign-builder' },
    { id: 'distribution', label: 'Review what can publish vs. what is sample', path: '/beta' },
    { id: 'metrics', label: 'See which reporting is sample-only', path: '/metrics' },
  ],
  publisher: [
    { id: 'slots', label: 'Draft a profile for channels you control', path: '/publisher' },
    { id: 'inventory', label: 'Create a private sample listing', path: '/publisher' },
    { id: 'readiness', label: 'Review payment and pilot readiness', path: '/beta' },
  ],
  browse: [
    { id: 'watch', label: 'Explore sample placement concepts', path: '/marketplace' },
    { id: 'save', label: 'Save example concepts to your watchlist', path: '/marketplace' },
    { id: 'campaigns', label: 'Build a local campaign preview', path: '/#campaign-builder' },
  ],
};

const GENERIC_STEPS = [
  { id: 'create', label: 'Build a local campaign preview', path: '/#campaign-builder' },
  { id: 'wallet', label: 'Check Bitcoin rail readiness', path: '/wallet' },
  { id: 'metrics', label: 'Review sample reporting', path: '/metrics' },
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