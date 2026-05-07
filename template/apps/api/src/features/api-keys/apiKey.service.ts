import { generateApiKey,hashApiKey,previewApiKey } from "./apiKey.utils.js"; import { apiKeyRepo } from "./apiKey.repository.js"; import { AppError } from "../../utils/errors/AppError.js";
export const apiKeyService={
  async create(uid:string,b:{name:string;scopes?:string[];expiresAt?:string}){ const raw=generateApiKey(); const row=await apiKeyRepo.create({user_id:uid,name:b.name,key_hash:hashApiKey(raw),key_preview:previewApiKey(raw),scopes:b.scopes??["*"],expires_at:b.expiresAt??null,is_active:true,last_used_at:null}); return{...row,key:raw}; },
  list:(uid:string)=>apiKeyRepo.listByUser(uid),
  async revoke(id:string,uid:string){ if(!await apiKeyRepo.findById(id,uid)) throw AppError.notFound("Key not found"); await apiKeyRepo.revoke(id,uid); },
  async delete(id:string,uid:string){ if(!await apiKeyRepo.findById(id,uid)) throw AppError.notFound("Key not found"); await apiKeyRepo.delete(id,uid); },
};
