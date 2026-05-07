"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/validators";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{email:string}>({ resolver: zodResolver(forgotPasswordSchema) });
  const onSubmit = async (d: {email:string}) => { try { await api.post("/auth/forgot-password", d); setSent(true); } catch(e: unknown) { toast.error((e as Error).message); } };
  if (sent) return <div className="min-h-screen flex items-center justify-center p-4"><div className="text-center space-y-2"><h1 className="text-xl font-bold">Check your email</h1><p className="text-muted-foreground">We sent a reset link to your inbox.</p><Link href="/login" className="text-primary hover:underline text-sm">Back to login</Link></div></div>;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center"><h1 className="text-2xl font-bold">Forgot password?</h1><p className="text-muted-foreground mt-1">We&apos;ll send a reset link</p></div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card p-6 rounded-lg border shadow-sm">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Button type="submit" loading={isSubmitting} className="w-full">Send reset link</Button>
        </form>
        <p className="text-center"><Link href="/login" className="text-sm text-primary hover:underline">Back to login</Link></p>
      </div>
    </div>
  );
}
