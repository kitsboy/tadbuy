import { useEffect } from 'react';

type Modifier = 'meta' | 'ctrl' | 'alt' | 'shift';

interface ShortcutOptions {
  key: string;
  modifiers?: Modifier[];
  /** Run in capture phase (default true). */
  capture?: boolean;
  /** Prevent default browser action. */
  preventDefault?: boolean;
  /** Only fire when target is not an input/textarea/select. */
  ignoreInputs?: boolean;
  enabled?: boolean;
}

/** Register a global keyboard shortcut. */
export function useKeyboardShortcut(
  callback: () => void,
  {
    key,
    modifiers = [],
    capture = true,
    preventDefault = true,
    ignoreInputs = true,
    enabled = true,
  }: ShortcutOptions
) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (ignoreInputs) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      }

      const keyMatch = e.key.toLowerCase() === key.toLowerCase();
      const metaMatch = !modifiers.includes('meta') || e.metaKey;
      const ctrlMatch = !modifiers.includes('ctrl') || e.ctrlKey;
      const altMatch = !modifiers.includes('alt') || e.altKey;
      const shiftMatch = !modifiers.includes('shift') || e.shiftKey;

      if (keyMatch && metaMatch && ctrlMatch && altMatch && shiftMatch) {
        if (preventDefault) e.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', onKeyDown, capture);
    return () => document.removeEventListener('keydown', onKeyDown, capture);
  }, [callback, key, modifiers, capture, preventDefault, ignoreInputs, enabled]);
}