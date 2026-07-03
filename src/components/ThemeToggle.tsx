import { Sun, Moon, Contrast } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, contrast, toggleTheme, setContrast } = useTheme();

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      <button
        onClick={() => setContrast(contrast === 'normal' ? 'high' : 'normal')}
        aria-label="Toggle high contrast"
        className={cn(
          'p-1.5 rounded-lg transition-colors',
          contrast === 'high' ? 'text-accent bg-accent/10' : 'text-muted hover:text-text hover:bg-surface'
        )}
      >
        <Contrast className="w-4 h-4" />
      </button>
    </div>
  );
}