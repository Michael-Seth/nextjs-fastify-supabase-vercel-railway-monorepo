"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/lib/validators";
import { useLogin } from "@/hooks/useAuthQuery";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const onSubmit = (data: LoginValues) => login(data, { onError: (e: Error) => toast.error(e.message) });
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center"><h1 className="text-2xl font-bold">Welcome back</h1><p className="text-muted-foreground mt-1">Sign in to your account</p></div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card p-6 rounded-lg border shadow-sm">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
          <div className="flex justify-end"><Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link></div>
          <Button type="submit" loading={isPending} className="w-full">Sign in</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">No account? <Link href="/register" className="text-primary hover:underline">Sign up</Link></p>
      </div>
    </div>
  );
}
