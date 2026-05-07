export interface PaginationParams { page?:number; limit?:number; }
export interface PaginatedResult<T> { data:T[]; meta:{ page:number;limit:number;total:number;totalPages:number;hasNextPage:boolean;hasPrevPage:boolean; }; }
export const parsePagination = (q: PaginationParams) => { const page=Math.max(1,q.page??1); const limit=Math.min(100,Math.max(1,q.limit??20)); return { page, limit, offset:(page-1)*limit }; };
export const buildPaginatedResult = <T>(data:T[], total:number, page:number, limit:number): PaginatedResult<T> => {
  const totalPages = Math.ceil(total/limit);
  return { data, meta:{ page, limit, total, totalPages, hasNextPage:page<totalPages, hasPrevPage:page>1 } };
};
