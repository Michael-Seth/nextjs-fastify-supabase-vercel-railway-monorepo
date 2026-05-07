import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Zap, Shield, Globe, ArrowRight, GitCommit } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Blazing Fast",
    desc: "Built on Fastify — one of the fastest Node.js frameworks. Sub-millisecond response times out of the box.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "JWT + refresh token rotation, RBAC, rate limiting, HMAC webhooks, and SHA-256 hashed API keys.",
  },
  {
    icon: Globe,
    title: "Globally Scalable",
    desc: "Supabase backend with Row Level Security, real-time subscriptions, and managed file storage.",
  },
  {
    icon: CheckCircle,
    title: "Production Ready",
    desc: "Migrations, seeding, Swagger docs, Vitest test suite, and full CI/CD pipeline included.",
  },
];

const stats = [
  { value: "< 15 min", label: "to first deploy" },
  { value: "50+", label: "API endpoints" },
  { value: "100%", label: "TypeScript" },
  { value: "0", label: "config headaches" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      {{APP_NAME}}
    </div>
  );
}
