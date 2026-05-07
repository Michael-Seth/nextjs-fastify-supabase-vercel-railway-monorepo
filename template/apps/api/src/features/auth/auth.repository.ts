import crypto from "crypto"; import { db } from "../../lib/supabase.js"; import type { Database } from "../../types/database.js";
type U=Database["public"]["Tables"]["users"]["Row"];
const ht=(t:string)=>crypto.createHash("sha256").update(t).digest("hex");
export const authRepo={
  findByEmail:(e:string)=>db.findOne<U>("users",{email:e}),
  findById:(id:string)=>db.findOne<U>("users",{id}),
  create:(p:Database["public"]["Tables"]["users"]["Insert"])=>db.create<U>("users",p as Record<string,unknown>),
  update:(id:string,p:Partial<U>)=>db.update<U>("users",{id},p as Record<string,unknown>),
  touchLogin:(id:string)=>db.update("users",{id},{last_login_at:new Date().toISOString()}),
  saveToken:(userId:string,hash:string,exp:Date)=>db.create("refresh_tokens",{user_id:userId,token_hash:hash,expires_at:exp.toISOString(),is_revoked:false}),
  findToken:(hash:string)=>db.findOne<Database["public"]["Tables"]["refresh_tokens"]["Row"]>("refresh_tokens",{token_hash:hash,is_revoked:false}),
  revokeToken:(hash:string)=>db.update("refresh_tokens",{token_hash:hash},{is_revoked:true}),
  revokeAll:(userId:string)=>db.update("refresh_tokens",{user_id:userId},{is_revoked:true}),
  hashToken:ht,
};
