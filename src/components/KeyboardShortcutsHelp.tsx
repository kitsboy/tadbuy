import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

const KeyboardShortcutsDialog = lazy(() => import('./KeyboardShortcutsDialog'));

export default function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => {
    setHasOpened(true);
    setOpen(current => !current);
  }, []);

  useKeyboardShortcut(toggle, {
    key: '?',
    ignoreInputs: true,
    preventDefault: true,
  });

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [close]);

  return hasOpened ? (
    <Suspense fallback={null}>
      <KeyboardShortcutsDialog open={open} onClose={close} />
    </Suspense>
  ) : null;
}
