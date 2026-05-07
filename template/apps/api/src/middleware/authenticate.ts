import type { FastifyRequest, FastifyReply } from "fastify";
import crypto from "crypto";
import { verifyAccessToken } from "../utils/token.js";
import { AppError } from "../utils/errors/AppError.js";
import { db } from "../lib/supabase.js";
export async function authenticate(req: FastifyRequest, _reply: FastifyReply) {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    const p = verifyAccessToken(auth.slice(7));
    if (!p) throw AppError.unauthorized("Invalid token");
    req.user = p;
    return;
  }
  const raw = req.headers["x-api-key"] as string | undefined;
  if (raw) {
    const hash = crypto.createHash("sha256").update(raw).digest("hex");
    const k = await db.findOne<{ user_id: string; is_active: boolean; expires_at: string | null }>(
      "api_keys",
      { key_hash: hash, is_active: true }
    );
    if (!k) throw AppError.unauthorized("Invalid API key");
    if (k.expires_at && new Date(k.expires_at) < new Date())
      throw AppError.unauthorized("API key expired");
    db.update("api_keys", { key_hash: hash }, { last_used_at: new Date().toISOString() }).catch(
      () => {}
    );
    const u = await db.findOne<{ id: string; email: string; role: string }>("users", {
      id: k.user_id,
    });
    if (!u) throw AppError.unauthorized("User not found");
    req.user = { userId: u.id, email: u.email, role: u.role, type: "access" };
    return;
  }
  throw AppError.unauthorized("No credentials");
}
