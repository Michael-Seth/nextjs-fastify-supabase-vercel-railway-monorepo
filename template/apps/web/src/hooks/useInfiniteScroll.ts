import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { api } from "@/lib/api";
import type { PaginatedResult } from "@/types/api";

export function useInfiniteList<T>(queryKey: string[], endpoint: string, limit = 20) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => api.get<PaginatedResult<T>>(`${endpoint}?page=${pageParam}&limit=${limit}`).then(r => r.data),
    getNextPageParam: (last) => last.meta.hasNextPage ? last.meta.page + 1 : undefined,
    initialPageParam: 1,
  });

  useEffect(() => { if (inView && query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage(); }, [inView, query]);

  const items = query.data?.pages.flatMap(p => p.data) ?? [];
  return { ...query, items, loaderRef: ref };
}
