import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  name:            z.string().min(1, "Name is required").optional(),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match", path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token:           z.string().min(1),
  password:        z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match", path: ["confirmPassword"],
});

// ── User ──────────────────────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  name:       z.string().min(1).optional(),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const updateRoleSchema = z.object({
  role: z.enum(["admin", "user", "moderator"]),
});

// ── Todo ──────────────────────────────────────────────────────────────────────
export const createTodoSchema = z.object({
  title:       z.string().min(1, "Title is required").max(255),
  description: z.string().max(1000).optional(),
});

export const updateTodoSchema = createTodoSchema.partial().extend({
  completed: z.boolean().optional(),
});

// ── API Key ───────────────────────────────────────────────────────────────────
export const createApiKeySchema = z.object({
  name:      z.string().min(1, "Name is required").max(100),
  scopes:    z.array(z.string()).optional().default(["*"]),
  expiresAt: z.string().datetime().optional(),
});

// ── Pagination ────────────────────────────────────────────────────────────────
export const paginationSchema = z.object({
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── Inferred types ────────────────────────────────────────────────────────────
export type LoginInput          = z.infer<typeof loginSchema>;
export type RegisterInput       = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput  = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput  = z.infer<typeof updateProfileSchema>;
export type CreateTodoInput     = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput     = z.infer<typeof updateTodoSchema>;
export type CreateApiKeyInput   = z.infer<typeof createApiKeySchema>;
export type PaginationInput     = z.infer<typeof paginationSchema>;
