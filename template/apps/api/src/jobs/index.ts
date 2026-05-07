import cron from "node-cron"; import { logger } from "../utils/logger.js"; import { db } from "../lib/supabase.js";
export function startCronJobs(){
  cron.schedule("0 0 * * *",async()=>{ logger.info("cron: purge tokens"); try{ const rows=await db.findMany<{id:string;expires_at:string}>("refresh_tokens",{filters:{is_revoked:false}}); const exp=rows.filter(r=>new Date(r.expires_at)<new Date()); for(const r of exp) await db.update("refresh_tokens",{id:r.id},{is_revoked:true}); if(exp.length) logger.info({count:exp.length},"Purged"); }catch(e){logger.error(e,"Purge failed");} });
  logger.info("⏰ Cron jobs started");
}
