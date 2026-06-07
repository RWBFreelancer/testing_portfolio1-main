import { useState, useRef, useCallback, useEffect } from "react";
import type { FlipState } from "@/types";

const DRAG_THRESHOLD_PX = 50;
const DRAG_LOCK_THRESHOLD_PX = 8;

interface UseFlipCardOptions {
  isFlipped: boolean;
  onFlip: () => void;
}

export function useFlipCard({ isFlipped, onFlip }: UseFlipCardOptions) {
  const [flipState, setFlipState] = useState<FlipState>(isFlipped ? "flipped" : "idle");
  const [dragRotation, setDragRotation] = useState(isFlipped ? 180 : 0);

  const dragStartX = useRef<number | null>(null);
  const isDragIntent = useRef(false);
  const interactionLock = useRef(false);

  // Sync to external isFlipped changes (e.g., another card opened)
  useEffect(() => {
    setDragRotation(isFlipped ? 180 : 0);
    setFlipState(isFlipped ? "flipped" : "idle");
  }, [isFlipped]);

  const handleClick = useCallback(() => {
    if (interactionLock.current) {
      interactionLock.current = false;
      return;
    }
    onFlip();
  }, [onFlip]);

  const handleDragStart = useCallback((clientX: number) => {
    dragStartX.current = clientX;
    isDragIntent.current = false;
    interactionLock.current = false;
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (dragStartX.current === null) return;
      const delta = clientX - dragStartX.current;
      if (!isDragIntent.current && Math.abs(delta) > DRAG_LOCK_THRESHOLD_PX) {
        isDragIntent.current = true;
        setFlipState("dragging");
      }
      if (!isDragIntent.current) return;
      const baseRotation = isFlipped ? 180 : 0;
      const liveDeg = Math.max(-180, Math.min(180, baseRotation + delta * 0.8));
      setDragRotation(liveDeg);
    },
    [isFlipped],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragIntent.current || dragStartX.current === null) {
      dragStartX.current = null;
      return;
    }
    const base = isFlipped ? 180 : 0;
    const finalDelta = dragRotation - base;
    if (Math.abs(finalDelta) > DRAG_THRESHOLD_PX) {
      onFlip();
      setDragRotation(isFlipped ? 0 : 180);
      setFlipState(isFlipped ? "idle" : "flipped");
      interactionLock.current = true;
    } else {
      setDragRotation(base);
      setFlipState(isFlipped ? "flipped" : "idle");
    }
    dragStartX.current = null;
    isDragIntent.current = false;
  }, [isFlipped, dragRotation, onFlip]);

  return {
    flipState,
    dragRotation,
    handleClick,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
