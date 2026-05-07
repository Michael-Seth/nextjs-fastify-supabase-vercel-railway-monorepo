import jwt from "jsonwebtoken"; import { env } from "../config/env.js"; import type { JwtPayload } from "../types/auth.js";
export const signAccessToken  = (p: Omit<JwtPayload,"type">) => jwt.sign({...p,type:"access"}, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
export const signRefreshToken = (userId: string) => jwt.sign({ userId, type:"refresh" }, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
export const verifyAccessToken  = (t: string): JwtPayload|null => { try { return jwt.verify(t, env.JWT_SECRET) as JwtPayload; } catch { return null; } };
export const verifyRefreshToken = (t: string): { userId:string }|null => { try { return jwt.verify(t, env.REFRESH_TOKEN_SECRET) as { userId:string }; } catch { return null; } };
