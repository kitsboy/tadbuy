import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Freeze observation after first intersection (lazy-load pattern). */
  once?: boolean;
}

/** Observe an element's visibility — ideal for lazy loading and scroll animations. */
export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const { once = false, ...observerOptions } = options;
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const { root, rootMargin, threshold } = observerOptions;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      setIsIntersecting(visible);
      if (visible && once) observer.disconnect();
    }, { root, rootMargin, threshold });

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, root, rootMargin, threshold]);

  return [ref, isIntersecting];
}