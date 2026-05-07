import { useEffect, useRef } from "react";
/**
 * Returns an AbortSignal that automatically aborts when the component unmounts.
 * Pass it to axios/fetch calls to cancel in-flight requests on unmount.
 */
export function useAbortSignal() {
  const controllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    controllerRef.current = new AbortController();
    return () => controllerRef.current?.abort();
  }, []);
  return () => controllerRef.current?.signal;
}
