import { useMediaQuery } from './useMediaQuery';

/** Respect the user's reduced-motion OS preference. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}