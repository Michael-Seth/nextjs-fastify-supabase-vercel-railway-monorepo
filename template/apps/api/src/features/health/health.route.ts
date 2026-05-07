import type { FastifyInstance } from "fastify"; import { supabaseAdmin } from "../../config/database.js";
export async function healthRoutes(app:FastifyInstance){
  app.get("/",{schema:{tags:["Health"],summary:"Health check"},async handler(_,reply){ let db="ok"; try{await supabaseAdmin.from("users").select("id").limit(1);}catch{db="error";} const ok=db==="ok"; return reply.status(ok?200:503).send({status:ok?"ok":"degraded",checks:{server:"ok",database:db},uptime:process.uptime(),timestamp:new Date().toISOString()}); }});
}
