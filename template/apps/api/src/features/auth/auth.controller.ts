import type { FastifyRequest,FastifyReply } from "fastify"; import { authService } from "./auth.service.js"; import type { TRegister,TLogin,TRefresh } from "./auth.schema.js";
export const authController={
  register:async(req:FastifyRequest<{Body:TRegister}>,reply:FastifyReply)=>reply.status(201).send(await authService.register(req.body)),
  login:async(req:FastifyRequest<{Body:TLogin}>,reply:FastifyReply)=>reply.send(await authService.login(req.body)),
  refresh:async(req:FastifyRequest<{Body:TRefresh}>,reply:FastifyReply)=>reply.send(await authService.refresh(req.body.refreshToken)),
  logout:async(req:FastifyRequest<{Body:TRefresh}>,reply:FastifyReply)=>{await authService.logout(req.body.refreshToken);return reply.status(204).send();},
  logoutAll:async(req:FastifyRequest,reply:FastifyReply)=>{await authService.logoutAll(req.user!.userId);return reply.status(204).send();},
  me:async(req:FastifyRequest,reply:FastifyReply)=>reply.send({user:await authService.me(req.user!.userId)}),
};
