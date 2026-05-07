import { useState, useCallback } from "react";
export function usePagination(initial = 1, pageSize = 20) {
  const [page, setPage]   = useState(initial);
  const [limit, setLimit] = useState(pageSize);
  const goTo     = useCallback((p: number) => setPage(p), []);
  const next     = useCallback(() => setPage(p => p + 1), []);
  const prev     = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const reset    = useCallback(() => setPage(1), []);
  return { page, limit, setPage: goTo, setLimit, next, prev, reset, offset: (page - 1) * limit };
}
