import { db } from "../../lib/supabase.js"; import type { Database } from "../../types/database.js"; import { parsePagination,buildPaginatedResult } from "../../utils/pagination.js";
type U=Database["public"]["Tables"]["users"]["Row"];
export const userRepo={
  async list(q:{page?:number;limit?:number;role?:string}){ const{page,limit,offset}=parsePagination(q); const f:Record<string,unknown>={}; if(q.role) f.role=q.role; const[users,total]=await Promise.all([db.findMany<U>("users",{filters:f,limit,offset,orderBy:{column:"created_at",ascending:false}}),db.count("users",Object.keys(f).length?f:undefined)]); return buildPaginatedResult(users,total,page,limit); },
  findById:(id:string)=>db.findOne<U>("users",{id}),
  update:(id:string,p:Partial<U>)=>db.update<U>("users",{id},p as Record<string,unknown>),
  async delete(id:string){ await db.delete("users",{id}); await db.auth.deleteUser(id); },
};
