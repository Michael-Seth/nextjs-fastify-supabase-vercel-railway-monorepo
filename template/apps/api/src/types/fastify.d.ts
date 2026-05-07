import "fastify"; import type { JwtPayload } from "./auth.js";
declare module "fastify" { interface FastifyRequest { user?: JwtPayload; } }
