import "dotenv/config";
const req = (k: string) => { const v = process.env[k]; if (!v) throw new Error(`Missing: ${k}`); return v; };
const opt = (k: string, d: string) => process.env[k] ?? d;
export const env = {
  NODE_ENV: opt("NODE_ENV","development") as "development"|"production"|"test",
  PORT: parseInt(opt("PORT","3001"),10), HOST: opt("HOST","0.0.0.0"),
  API_VERSION: opt("API_VERSION","v1"), ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  SUPABASE_URL: req("SUPABASE_URL"), SUPABASE_ANON_KEY: req("SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: req("SUPABASE_SERVICE_ROLE_KEY"),
  JWT_SECRET: req("JWT_SECRET"), JWT_EXPIRES_IN: opt("JWT_EXPIRES_IN","15m"),
  REFRESH_TOKEN_SECRET: req("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRES_IN: opt("REFRESH_TOKEN_EXPIRES_IN","7d"),
  RATE_LIMIT_MAX: parseInt(opt("RATE_LIMIT_MAX","100"),10),
  RATE_LIMIT_WINDOW_MS: parseInt(opt("RATE_LIMIT_WINDOW_MS","60000"),10),
  API_KEY_PREFIX: opt("API_KEY_PREFIX","fsk_"),
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FROM_EMAIL: opt("FROM_EMAIL","noreply@example.com"),
  SUPABASE_STORAGE_BUCKET: opt("SUPABASE_STORAGE_BUCKET","uploads"),
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
} as const;
