import { useRef, useCallback } from "react";
type QueuedFn = () => Promise<void>;
export function useRetryQueue() {
  const queue = useRef<QueuedFn[]>([]);
  const add = useCallback((fn: QueuedFn) => { queue.current.push(fn); }, []);
  const flush = useCallback(async () => {
    const q = [...queue.current]; queue.current = [];
    for (const fn of q) { try { await fn(); } catch { queue.current.push(fn); } }
  }, []);
  return { add, flush, size: () => queue.current.length };
}
