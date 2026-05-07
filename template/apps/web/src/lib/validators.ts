import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email("Invalid email"), password: z.string().min(8,"Min 8 chars") });
export const registerSchema = loginSchema.extend({ name: z.string().min(1).optional(), confirmPassword: z.string() }).refine(d=>d.password===d.confirmPassword,{ message:"Passwords don't match", path:["confirmPassword"] });
export const forgotPasswordSchema = z.object({ email: z.string().email("Invalid email") });
export const resetPasswordSchema = z.object({ password: z.string().min(8), confirmPassword: z.string() }).refine(d=>d.password===d.confirmPassword,{ message:"Passwords don't match", path:["confirmPassword"] });
export const profileSchema = z.object({ name: z.string().min(1).optional(), avatar_url: z.string().url().optional().or(z.literal("")) });
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
