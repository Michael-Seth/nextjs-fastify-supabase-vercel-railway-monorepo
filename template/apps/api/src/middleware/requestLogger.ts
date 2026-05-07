import fp from "fastify-plugin"; import type { FastifyPluginAsync } from "fastify";
const p:FastifyPluginAsync=async(app)=>{
  app.addHook("onRequest",async(req)=>req.log.info({method:req.method,url:req.url},"→"));
  app.addHook("onResponse",async(req,reply)=>req.log.info({method:req.method,url:req.url,status:reply.statusCode,ms:reply.elapsedTime.toFixed(1)},"←"));
};
export const requestLogger=fp(p,{name:"request-logger"});
