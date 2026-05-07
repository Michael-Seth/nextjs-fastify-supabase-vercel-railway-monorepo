import type { FastifyInstance } from "fastify"; import { apiKeyService } from "./apiKey.service.js"; import { authenticate } from "../../middleware/authenticate.js"; import { Type } from "@sinclair/typebox";
export async function apiKeyRoutes(app:FastifyInstance){
  app.post("/",{schema:{tags:["API Keys"],summary:"Create",security:[{BearerAuth:[]}],body:Type.Object({name:Type.String({minLength:1}),scopes:Type.Optional(Type.Array(Type.String())),expiresAt:Type.Optional(Type.String())})},preHandler:[authenticate],handler:async(req,reply)=>reply.status(201).send(await apiKeyService.create(req.user!.userId,req.body as{name:string;scopes?:string[];expiresAt?:string}))});
  app.get("/",{schema:{tags:["API Keys"],summary:"List",security:[{BearerAuth:[]}]},preHandler:[authenticate],handler:async(req,reply)=>reply.send({keys:await apiKeyService.list(req.user!.userId)})});
  app.delete("/:id",{schema:{tags:["API Keys"],summary:"Revoke",security:[{BearerAuth:[]}],params:Type.Object({id:Type.String()})},preHandler:[authenticate],handler:async(req,reply)=>{await apiKeyService.revoke((req.params as{id:string}).id,req.user!.userId);return reply.status(204).send();}});
}
