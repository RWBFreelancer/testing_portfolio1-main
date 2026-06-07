// src/hooks/useIdlePeek.ts
// No longer loops. Fires a single peek when peekTrigger increments.
// Used by FlipCard to react to sibling-flip events from FlipCardGrid.

import { useEffect, useRef, useState } from 'react';

interface UseIdlePeekOptions {
  peekDegrees?: number;
  peekDuration?: number;
  disabled?: boolean;
  peekTrigger?: number;
}

export function useIdlePeek({
  peekDegrees = 20,
  peekDuration = 600,
  disabled = false,
  peekTrigger = 0,
}: UseIdlePeekOptions = {}) {
  const [isPeeking, setIsPeeking] = useState(false);
  const peekTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (disabled || peekTrigger === 0) return;

    setIsPeeking(true);
    clearTimeout(peekTimerRef.current);
    peekTimerRef.current = setTimeout(() => setIsPeeking(false), peekDuration);

    return () => clearTimeout(peekTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peekTrigger]);

  useEffect(() => {
    if (disabled) {
      setIsPeeking(false);
      clearTimeout(peekTimerRef.current);
    }
  }, [disabled]);

  return { isPeeking, peekDegrees };
}
