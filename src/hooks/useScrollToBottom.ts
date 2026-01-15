// src/hooks/useScrollToBottom.ts
// Auto-scroll behavior hook

import { useEffect, useRef, RefObject } from 'react';

interface UseScrollToBottomOptions {
  /** Dependencies that trigger scroll */
  deps?: unknown[];
  /** Whether to enable auto-scroll */
  enabled?: boolean;
  /** Scroll behavior */
  behavior?: ScrollBehavior;
}

/**
 * Hook for auto-scrolling to bottom of a container
 */
export function useScrollToBottom<T extends HTMLElement>(
  options: UseScrollToBottomOptions = {}
): RefObject<T> {
  const { deps = [], enabled = true, behavior = 'smooth' } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    if (enabled && ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior
      });
    }
  }, [enabled, behavior, ...deps]);

  return ref;
}
