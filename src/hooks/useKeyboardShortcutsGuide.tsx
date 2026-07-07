import { useCallback, useState } from 'react';
import { useKeyboardShortcut } from './useKeyboardShortcut';

/** Toggle the keyboard shortcuts help modal with `?`. */
export function useKeyboardShortcutsGuide() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  useKeyboardShortcut(toggle, {
    key: '?',
    ignoreInputs: true,
    preventDefault: true,
  });

  return { open, setOpen, toggle, close };
}