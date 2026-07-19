"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/lib/validators";
import { useRegister } from "@/hooks/useAuthQuery";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function RegisterPage() {
  const { mutate: register_, isPending } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const onSubmit = (d: RegisterValues) => register_(d, { onError: (e: Error) => toast.error(e.message) });
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center"><h1 className="text-2xl font-bold">Create account</h1><p className="text-muted-foreground mt-1">Get started today</p></div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card p-6 rounded-lg border shadow-sm">
          <Input label="Name" placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="Min 8 chars" error={errors.password?.message} {...register("password")} />
          <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          <Button type="submit" loading={isPending} className="w-full">Create account</Button>
          <div className="relative my-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div></div>
          <GoogleSignInButton />
        </form>
        <p className="text-center text-sm text-muted-foreground">Have account? <Link href="/login" className="text-primary hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
