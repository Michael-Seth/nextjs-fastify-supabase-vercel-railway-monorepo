import type { FastifyRequest, FastifyReply } from "fastify"; import { AppError } from "../utils/errors/AppError.js";
export const requireRole=(...roles:string[])=>async(req:FastifyRequest,_:FastifyReply)=>{ if(!req.user) throw AppError.unauthorized(); if(!roles.includes(req.user.role)) throw AppError.forbidden(`Needs: ${roles.join("/")} `); };
export const requireAdmin=requireRole("admin");
