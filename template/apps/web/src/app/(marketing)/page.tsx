"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen, Rocket, FolderTree, Shield, Chrome,
  LayoutDashboard, Code2, Globe, Flag, Zap, Mail,
  Webhook, Clock, WifiOff, Timer, Cloud, ChevronDown,
  Menu, X, Copy, Check, Terminal, Database, Key,
  Upload, Users, Layers, ExternalLink, ArrowRight,
  RefreshCw, Lock, Wifi, Puzzle,
} from "lucide-react";

// ─── types ───────────────────────────────────────────────────────────────────

interface NavChild { id: string; label: string }
interface NavSection { id: string; label: string; icon: React.ReactNode; children: NavChild[] }

// ─── navigation tree ─────────────────────────────────────────────────────────

const NAV: NavSection[] = [
  { id: "introduction",    label: "Introduction",   icon: <BookOpen size={14} />,       children: [] },
  { id: "getting-started", label: "Getting Started",icon: <Rocket size={14} />,         children: [
    { id: "installation",      label: "Installation" },
    { id: "project-structure", label: "Project Structure" },
    { id: "env-setup",         label: "Environment Setup" },
  ]},
  { id: "authentication",  label: "Authentication", icon: <Shield size={14} />,         children: [
    { id: "email-auth",  label: "Email / Password" },
    { id: "google-auth", label: "Google Sign-In" },
    { id: "tokens",      label: "JWT & Tokens" },
    { id: "rbac",        label: "Roles & Permissions" },
  ]},
  { id: "web-app",         label: "Web App",        icon: <LayoutDashboard size={14} />,children: [
    { id: "dashboard",       label: "Dashboard" },
    { id: "admin",           label: "Admin Panel" },
    { id: "i18n",            label: "i18n" },
    { id: "feature-flags",   label: "Feature Flags" },
    { id: "websocket",       label: "WebSocket" },
    { id: "infinite-scroll", label: "Infinite Scroll" },
    { id: "offline",         label: "Offline Detection" },
    { id: "session-timeout", label: "Session Timeout" },
  ]},
  { id: "api-server",      label: "API Server",     icon: <Code2 size={14} />,          children: [
    { id: "api-reference", label: "Endpoints Reference" },
    { id: "swagger",       label: "Swagger / OpenAPI" },
    { id: "rate-limiting", label: "Rate Limiting" },
    { id: "file-uploads",  label: "File Uploads" },
    { id: "email",         label: "Email (Resend)" },
    { id: "webhooks",      label: "Webhooks" },
    { id: "cron-jobs",     label: "Cron Jobs" },
  ]},
  { id: "extending",       label: "Extending the App", icon: <Puzzle size={14} />,       children: [
    { id: "new-api-module",   label: "New API Module" },
    { id: "new-web-page",     label: "New Web Page" },
    { id: "new-shared-type",  label: "New Shared Type" },
    { id: "new-cli-feature",  label: "New CLI Feature" },
  ]},
  { id: "deployment",      label: "Deployment",     icon: <Cloud size={14} />,          children: [
    { id: "supabase-setup", label: "Supabase Setup" },
    { id: "vercel",         label: "Vercel (Web)" },
    { id: "railway",        label: "Railway (API)" },
  ]},
];

// ─── utilities ───────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-lg overflow-hidden border border-zinc-800 text-sm my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs text-zinc-500 font-mono">{lang}</span>
        <button onClick={copy} className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded" aria-label="Copy">
          {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
        </button>
      </div>
      <pre className="bg-zinc-950 p-4 text-zinc-200 overflow-x-auto font-mono leading-relaxed whitespace-pre"><code>{code}</code></pre>
    </div>
  );
}

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return <h2 id={id} className="text-xl font-bold mt-10 mb-3 text-foreground scroll-mt-20">{children}</h2>;
}
function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return <h3 id={id} className="text-base font-semibold mt-6 mb-2 text-foreground scroll-mt-20">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground leading-7 mb-3">{children}</p>;
}
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 my-4">
      <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
      <p className="text-sm text-amber-200/80 leading-relaxed">{children}</p>
    </div>
  );
}
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 my-4">
      <span className="text-blue-400 mt-0.5 shrink-0">ℹ</span>
      <p className="text-sm text-blue-200/80 leading-relaxed">{children}</p>
    </div>
  );
}
function Badge({ children, color = "default" }: { children: React.ReactNode; color?: "default"|"green"|"blue"|"amber"|"red" }) {
  const cls = {
    default: "bg-secondary text-secondary-foreground",
    green:   "bg-green-500/15 text-green-400",
    blue:    "bg-blue-500/15 text-blue-400",
    amber:   "bg-amber-500/15 text-amber-400",
    red:     "bg-red-500/15 text-red-400",
  }[color];
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}
function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto my-4 rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>{headers.map(h => <th key={h} className="text-left px-4 py-2.5 font-semibold text-foreground">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-muted/30 transition-colors">
              {row.map((cell, j) => <td key={j} className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── section content map ─────────────────────────────────────────────────────

function SectionContent({ id }: { id: string }) {
  switch (id) {

    // ── Introduction ──────────────────────────────────────────────────────────
    case "introduction": return (
      <div>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Layers size={11} /> Full-Stack Monorepo Template
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
            Welcome to <span className="text-primary">{process.env.NEXT_PUBLIC_APP_NAME ?? "Your SaaS"}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A production-ready monorepo scaffold combining <strong className="text-foreground">Next.js 16</strong>, <strong className="text-foreground">Fastify</strong>, and <strong className="text-foreground">Supabase</strong> — deployable to Vercel + Railway in under 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { icon: <Zap size={16} className="text-amber-400" />,       title: "Blazing Fast",        desc: "Fastify handles thousands of req/s with sub-millisecond overhead.", color: "border-amber-500/20 bg-amber-500/5" },
            { icon: <Shield size={16} className="text-blue-400" />,     title: "Secure by Default",   desc: "JWT rotation, RBAC, rate limiting, HMAC webhooks, hashed API keys.", color: "border-blue-500/20 bg-blue-500/5" },
            { icon: <Globe size={16} className="text-green-400" />,     title: "Globally Scalable",   desc: "Supabase with Row Level Security, real-time, and managed storage.", color: "border-green-500/20 bg-green-500/5" },
            { icon: <Database size={16} className="text-purple-400" />, title: "Production Ready",    desc: "Migrations, seed scripts, Swagger docs, Vitest, and CI/CD included.", color: "border-purple-500/20 bg-purple-500/5" },
          ].map(f => (
            <div key={f.title} className={`rounded-xl border p-4 ${f.color}`}>
              <div className="flex items-center gap-2 mb-2">{f.icon}<span className="font-semibold text-sm text-foreground">{f.title}</span></div>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { v: "< 15 min", l: "to first deploy" },
            { v: "50+",      l: "API endpoints" },
            { v: "100%",     l: "TypeScript" },
            { v: "0",        l: "config headaches" },
          ].map(s => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <H3>What's included</H3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          {[
            "Next.js 16 App Router", "Fastify REST API", "Supabase Auth + DB",
            "JWT + Refresh Tokens", "RBAC (admin / user / moderator)", "Google OAuth",
            "Admin Dashboard", "Swagger / OpenAPI", "Rate Limiting",
            "File Uploads", "Email via Resend", "Webhooks",
            "Cron Jobs", "i18n (next-intl)", "Feature Flags",
            "WebSocket Hook", "Infinite Scroll", "Offline Detection",
            "Session Timeout", "Vitest Suite", "Turborepo + pnpm",
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-muted-foreground">
              <Check size={13} className="text-green-400 shrink-0" />{item}
            </div>
          ))}
        </div>
      </div>
    );

    // ── Installation ──────────────────────────────────────────────────────────
    case "installation": return (
      <div>
        <H2 id="installation">Installation</H2>
        <P>Scaffold a new project with a single command. The interactive CLI lets you pick exactly the features you need.</P>
        <CodeBlock lang="bash" code={`npx create-nfs-app my-saas-app\n# or\nnpx create-nfs-app  # prompts for project name`} />

        <H3>CLI feature selection</H3>
        <P>After entering a project name you'll see two multi-select prompts: one for API features, one for UI features. Use <code className="text-xs bg-muted px-1 py-0.5 rounded">Space</code> to toggle and <code className="text-xs bg-muted px-1 py-0.5 rounded">Enter</code> to confirm.</P>
        <Table
          headers={["Feature", "Layer", "Default"]}
          rows={[
            ["Rate Limiting",                    "API", <Badge color="green">on</Badge>],
            ["Swagger / OpenAPI docs",            "API", <Badge color="green">on</Badge>],
            ["File Uploads (Supabase Storage)",   "API", <Badge color="green">on</Badge>],
            ["Email (Resend)",                    "API", <Badge color="amber">off</Badge>],
            ["Webhooks",                          "API", <Badge color="amber">off</Badge>],
            ["Cron Jobs",                         "API", <Badge color="amber">off</Badge>],
            ["Auth pages",                        "Web", <Badge color="green">on</Badge>],
            ["Admin dashboard + RBAC UI",         "Web", <Badge color="green">on</Badge>],
            ["Landing page",                      "Web", <Badge color="green">on</Badge>],
            ["i18n / Auto-localization",          "Web", <Badge color="green">on</Badge>],
            ["Feature flags (useFeature)",        "Web", <Badge color="green">on</Badge>],
            ["Infinite scroll + pagination",      "Web", <Badge color="green">on</Badge>],
            ["Offline detection + retry queue",   "Web", <Badge color="green">on</Badge>],
            ["Session timeout / auto-logout",     "Web", <Badge color="green">on</Badge>],
            ["Google Sign-In (OAuth)",            "Web", <Badge color="amber">off</Badge>],
            ["WebSocket hook",                    "Web", <Badge color="amber">off</Badge>],
          ]}
        />

        <H3>After scaffolding</H3>
        <CodeBlock lang="bash" code={`cd my-saas-app\n\n# Copy env templates\ncp apps/api/.env.example  apps/api/.env\ncp apps/web/.env.example  apps/web/.env.local\n\n# Fill in your Supabase + JWT secrets, then:\npnpm install\npnpm db:seed   # seeds admin@example.com / Admin1234!\npnpm dev       # API :3001  ·  Web :3000`} />
        <Tip>pnpm is required. Install it with <code className="text-xs bg-blue-900/30 px-1 rounded">npm i -g pnpm</code> if needed.</Tip>
      </div>
    );

    // ── Project Structure ─────────────────────────────────────────────────────
    case "project-structure": return (
      <div>
        <H2 id="project-structure">Project Structure</H2>
        <P>The monorepo is managed by <strong className="text-foreground">Turborepo</strong> and <strong className="text-foreground">pnpm workspaces</strong>. All apps share the same <code className="text-xs bg-muted px-1 py-0.5 rounded">packages/shared</code> types.</P>
        <CodeBlock lang="text" code={`my-saas-app/
├── apps/
│   ├── api/                    # Fastify REST API  (port 3001)
│   │   ├── src/
│   │   │   ├── features/       # auth · storage · todos · webhooks · jobs
│   │   │   ├── middleware/     # authenticate.ts
│   │   │   ├── utils/          # token.ts · errors/
│   │   │   ├── config/         # env.ts · database.ts · swagger.ts
│   │   │   └── app.ts          # Fastify app factory
│   │   └── supabase/
│   │       └── migrations/     # 001_initial.sql
│   │
│   └── web/                    # Next.js 16 App Router  (port 3000)
│       └── src/
│           ├── app/
│           │   ├── (auth)/     # login · register · forgot-password · callback
│           │   ├── (dashboard)/# dashboard · admin · admin/users
│           │   └── (marketing)/# landing / docs page  ← you are here
│           ├── components/     # UI primitives + layout
│           ├── hooks/          # useAuthQuery · useFeature · usePagination …
│           ├── stores/         # authStore · featureFlagStore · uiStore
│           ├── lib/            # api.ts · validators.ts · supabase.ts
│           └── types/          # api.ts (User · AuthResponse · …)
│
└── packages/
    └── shared/                 # Shared TS types consumed by both apps`} />
      </div>
    );

    // ── Environment Setup ─────────────────────────────────────────────────────
    case "env-setup": return (
      <div>
        <H2 id="env-setup">Environment Setup</H2>

        <H3>API — <code className="text-sm font-mono">apps/api/.env</code></H3>
        <Table
          headers={["Variable", "Description", "Required"]}
          rows={[
            ["SUPABASE_URL",              "Your Supabase project URL",                  <Badge color="red">yes</Badge>],
            ["SUPABASE_ANON_KEY",         "Supabase anon/public key",                   <Badge color="red">yes</Badge>],
            ["SUPABASE_SERVICE_ROLE_KEY", "Supabase service role key (server only)",    <Badge color="red">yes</Badge>],
            ["JWT_SECRET",               "Min 32-char random string for access tokens",<Badge color="red">yes</Badge>],
            ["REFRESH_TOKEN_SECRET",     "Separate secret for refresh tokens",          <Badge color="red">yes</Badge>],
            ["JWT_EXPIRES_IN",           "Access token lifetime (default: 15m)",        <Badge color="green">no</Badge>],
            ["REFRESH_TOKEN_EXPIRES_IN", "Refresh token lifetime (default: 7d)",        <Badge color="green">no</Badge>],
            ["RATE_LIMIT_MAX",           "Max requests per window (default: 100)",      <Badge color="green">no</Badge>],
            ["RATE_LIMIT_WINDOW_MS",     "Rate-limit window in ms (default: 60000)",   <Badge color="green">no</Badge>],
            ["RESEND_API_KEY",           "Resend API key for email",                    <Badge color="amber">optional</Badge>],
            ["FROM_EMAIL",               "From address for outbound email",             <Badge color="amber">optional</Badge>],
            ["SUPABASE_STORAGE_BUCKET",  "Bucket name for file uploads",               <Badge color="amber">optional</Badge>],
            ["WEBHOOK_SECRET",           "HMAC secret for webhook verification",        <Badge color="amber">optional</Badge>],
          ]}
        />

        <H3>Web — <code className="text-sm font-mono">apps/web/.env.local</code></H3>
        <Table
          headers={["Variable", "Description", "Required"]}
          rows={[
            ["NEXT_PUBLIC_API_URL",          "Fastify API base URL",                    <Badge color="red">yes</Badge>],
            ["NEXT_PUBLIC_SUPABASE_URL",     "Supabase project URL",                    <Badge color="red">yes</Badge>],
            ["NEXT_PUBLIC_SUPABASE_ANON_KEY","Supabase anon key",                       <Badge color="red">yes</Badge>],
            ["NEXT_PUBLIC_APP_NAME",         "Displayed app name",                      <Badge color="green">no</Badge>],
            ["NEXT_PUBLIC_SESSION_TIMEOUT_MS","Auto-logout timeout ms (default: 30 min)",<Badge color="green">no</Badge>],
          ]}
        />

        <Tip>Never commit <code className="text-xs bg-blue-900/30 px-1 rounded">.env</code> or <code className="text-xs bg-blue-900/30 px-1 rounded">.env.local</code> — both are in <code className="text-xs bg-blue-900/30 px-1 rounded">.gitignore</code> by default.</Tip>
      </div>
    );

    // ── Email / Password Auth ─────────────────────────────────────────────────
    case "email-auth": return (
      <div>
        <H2 id="email-auth">Email / Password Authentication</H2>
        <P>Authentication is handled by the Fastify API. The web app communicates exclusively with the API — it never touches Supabase Auth directly for email/password flows.</P>

        <H3>Auth flow</H3>
        <div className="rounded-xl border border-border bg-card p-5 my-4 text-sm">
          {[
            ["1", "User submits form on /login or /register"],
            ["2", "Zod validates the input client-side"],
            ["3", "POST /api/v1/auth/login (or /register) is called"],
            ["4", "API verifies credentials via Supabase Auth"],
            ["5", "API issues an access token (15 min JWT) + refresh token (7 d JWT)"],
            ["6", "Tokens stored in Zustand store + localStorage"],
            ["7", "User redirected to /dashboard (or /admin for admins)"],
          ].map(([n, t]) => (
            <div key={n} className="flex gap-3 items-start py-2 border-b border-border last:border-0">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-bold">{n}</span>
              <span className="text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>

        <H3>Frontend hooks</H3>
        <CodeBlock lang="tsx" code={`import { useLogin, useRegister, useLogout, useMe } from "@/hooks/useAuthQuery";

// Login
const { mutate: login, isPending } = useLogin();
login({ email: "user@example.com", password: "Password1!" });

// Register
const { mutate: register } = useRegister();
register({ email, password, name });

// Current user (auto-fetches if a token exists)
const { data: user } = useMe();

// Logout — revokes refresh token + clears store
const { mutate: logout } = useLogout();`} />

        <H3>Auth store</H3>
        <CodeBlock lang="tsx" code={`import { useAuthStore } from "@/stores/authStore";

const { user, accessToken, isAuthenticated, isAdmin } = useAuthStore();`} />
      </div>
    );

    // ── Google Sign-In ────────────────────────────────────────────────────────
    case "google-auth": return (
      <div>
        <H2 id="google-auth">Google Sign-In</H2>
        <P>Google OAuth is powered by Supabase's built-in OAuth support. After the Google redirect, the app exchanges the Supabase session for the same custom JWTs used by email auth — so the rest of the app works identically.</P>

        <Note>This feature is opt-in via the CLI (<code className="text-xs">Google Sign-In (OAuth via Supabase)</code>). When selected, Supabase handles the OAuth redirect and the callback page exchanges the session for custom JWTs.</Note>

        <H3>1 — Enable Google in Supabase</H3>
        <div className="rounded-xl border border-border bg-card p-4 my-4 text-sm space-y-2">
          {[
            "Go to your Supabase project → Authentication → Providers",
            "Enable the Google provider",
            "Paste your Google OAuth Client ID and Client Secret",
            "Go to Authentication → URL Configuration",
            "Add http://localhost:3000/auth/callback to Redirect URLs",
            "Add your production URL too: https://yourdomain.com/auth/callback",
          ].map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/15 text-blue-400 text-xs flex items-center justify-center font-bold">{i + 1}</span>
              <span className="text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>

        <H3>2 — Get Google credentials</H3>
        <P>Create OAuth credentials at <strong className="text-foreground">console.cloud.google.com</strong> → APIs & Services → Credentials → Create OAuth 2.0 Client ID. Set the Authorized redirect URI to your Supabase callback URL (shown in the Supabase dashboard).</P>

        <H3>3 — How the flow works</H3>
        <CodeBlock lang="tsx" code={`// GoogleSignInButton.tsx — already wired into /login and /register
// Calls supabase.auth.signInWithOAuth({ provider: "google" })
// ↓
// Google authenticates → redirects to /auth/callback
// ↓
// callback/page.tsx reads the Supabase session
// ↓
// POST /api/v1/auth/google/callback with the Supabase access token
// ↓
// API verifies token, creates user if first login, issues custom JWTs
// ↓
// User redirected to /dashboard or /admin`} />

        <H3>Using the hook directly</H3>
        <CodeBlock lang="tsx" code={`import { useGoogleSignIn } from "@/hooks/useAuthQuery";

const { mutate: signIn, isPending } = useGoogleSignIn();
// Triggers the OAuth redirect
signIn();`} />

        <H3>API endpoint</H3>
        <CodeBlock lang="bash" code={`POST /api/v1/auth/google/callback\nBody: { "accessToken": "<supabase-access-token>" }\nReturns: { user, tokens: { accessToken, refreshToken, expiresIn } }`} />
      </div>
    );

    // ── JWT & Tokens ──────────────────────────────────────────────────────────
    case "tokens": return (
      <div>
        <H2 id="tokens">JWT & Tokens</H2>
        <P>The API issues a short-lived <strong className="text-foreground">access token</strong> and a long-lived <strong className="text-foreground">refresh token</strong> on every successful login or register.</P>

        <Table
          headers={["Token", "Lifetime", "Storage", "Purpose"]}
          rows={[
            ["Access Token",  "15 min", "Zustand + localStorage", "Authorise every API request via Bearer header"],
            ["Refresh Token", "7 days", "Zustand + localStorage", "Obtain a new access token; stored as a hash in DB"],
          ]}
        />

        <H3>Automatic token refresh</H3>
        <P>The Axios client in <code className="text-xs bg-muted px-1 py-0.5 rounded">lib/api.ts</code> intercepts every 401 response, pauses all in-flight requests, silently refreshes the access token, then retries queued requests. If the refresh itself fails, the user is logged out.</P>

        <H3>Using the access token</H3>
        <CodeBlock lang="tsx" code={`// Every api.* call automatically includes:
// Authorization: Bearer <accessToken>

import { api } from "@/lib/api";
const { data } = await api.get("/todos");  // token injected automatically`} />

        <H3>Refresh token rotation</H3>
        <P>Each refresh call revokes the old refresh token and issues a new pair. This prevents replay attacks — a stolen refresh token can only be used once.</P>
      </div>
    );

    // ── RBAC ─────────────────────────────────────────────────────────────────
    case "rbac": return (
      <div>
        <H2 id="rbac">Roles & Permissions</H2>
        <P>Three built-in roles control what users can see and do. Roles are stored in the <code className="text-xs bg-muted px-1 py-0.5 rounded">users</code> table and embedded in every JWT payload.</P>

        <Table
          headers={["Role", "Access"]}
          rows={[
            [<Badge color="red">admin</Badge>,      "Full access — all API routes, /admin UI, user management"],
            [<Badge color="blue">moderator</Badge>, "Elevated read + moderation actions (customise as needed)"],
            [<Badge color="green">user</Badge>,     "Standard access — own data only, /dashboard UI"],
          ]}
        />

        <H3>Protecting routes (frontend)</H3>
        <CodeBlock lang="tsx" code={`import { ProtectedRoute } from "@/components/ProtectedRoute";

// Only admins can view this page
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>`} />

        <H3>Protecting routes (API)</H3>
        <CodeBlock lang="ts" code={`import { authenticate } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/requireRole.js";

app.delete("/users/:id", {
  preHandler: [authenticate, requireRole("admin")],
  handler: userController.delete,
});`} />

        <H3>Auth context helpers</H3>
        <CodeBlock lang="tsx" code={`import { useAuthStore } from "@/stores/authStore";

const { isAdmin, user } = useAuthStore();
// user.role === "admin" | "moderator" | "user"`} />
      </div>
    );

    // ── Dashboard ─────────────────────────────────────────────────────────────
    case "dashboard": return (
      <div>
        <H2 id="dashboard">Dashboard</H2>
        <P>The <code className="text-xs bg-muted px-1 py-0.5 rounded">/dashboard</code> route is the default landing spot after login for all non-admin users. It uses the <strong className="text-foreground">DashboardLayout</strong> with a collapsible sidebar and sticky topbar.</P>

        <H3>Layout components</H3>
        <Table
          headers={["Component", "Location", "Purpose"]}
          rows={[
            ["DashboardLayout", "components/layout/DashboardLayout.tsx", "Flex wrapper: sidebar + main area"],
            ["Sidebar",         "components/layout/Sidebar.tsx",         "Collapsible nav with role-based items"],
            ["Topbar",          "components/layout/Topbar.tsx",          "Theme toggle · notifications · user menu"],
          ]}
        />

        <H3>Adding a new dashboard page</H3>
        <CodeBlock lang="tsx" code={`// apps/web/src/app/(dashboard)/my-page/page.tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function MyPage() {
  return (
    <DashboardLayout>
      <h1>My Page</h1>
    </DashboardLayout>
  );
}`} />
      </div>
    );

    // ── Admin Panel ───────────────────────────────────────────────────────────
    case "admin": return (
      <div>
        <H2 id="admin">Admin Panel</H2>
        <P>Admins are automatically redirected to <code className="text-xs bg-muted px-1 py-0.5 rounded">/admin</code> after login. The panel includes a user management table at <code className="text-xs bg-muted px-1 py-0.5 rounded">/admin/users</code>.</P>

        <H3>Admin routes</H3>
        <Table
          headers={["Route", "Description"]}
          rows={[
            ["/admin",        "Admin overview dashboard"],
            ["/admin/users",  "User list — view, activate/deactivate, change roles"],
          ]}
        />

        <H3>Access guard</H3>
        <CodeBlock lang="tsx" code={`// All admin pages are wrapped automatically
// Non-admin users are redirected to /dashboard by AuthContext`} />

        <H3>User management API calls</H3>
        <CodeBlock lang="tsx" code={`import { api } from "@/lib/api";

// List all users (admin only)
const users = await api.get("/users");

// Update a user's role
await api.patch(\`/users/\${id}\`, { role: "moderator" });

// Deactivate a user
await api.patch(\`/users/\${id}\`, { is_active: false });`} />
      </div>
    );

    // ── i18n ─────────────────────────────────────────────────────────────────
    case "i18n": return (
      <div>
        <H2 id="i18n">Internationalisation (i18n)</H2>
        <P>Powered by <strong className="text-foreground">next-intl</strong>. Translation files live in <code className="text-xs bg-muted px-1 py-0.5 rounded">src/i18n/</code> and are loaded at build time.</P>

        <H3>Adding a locale</H3>
        <CodeBlock lang="bash" code={`# Create a new messages file
touch apps/web/src/i18n/messages/fr.json`} />
        <CodeBlock lang="json" code={`// src/i18n/messages/fr.json
{
  "auth": {
    "login": "Se connecter",
    "register": "S'inscrire"
  }
}`} />

        <H3>Using translations</H3>
        <CodeBlock lang="tsx" code={`import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("auth");
  return <button>{t("login")}</button>;
}`} />
      </div>
    );

    // ── Feature Flags ─────────────────────────────────────────────────────────
    case "feature-flags": return (
      <div>
        <H2 id="feature-flags">Feature Flags</H2>
        <P>A lightweight client-side feature flag system backed by Zustand. Flags are set at runtime — no external service required.</P>

        <H3>Enabling / disabling a flag</H3>
        <CodeBlock lang="tsx" code={`import { useFeatureFlagStore } from "@/stores/featureFlagStore";

const { setFlag } = useFeatureFlagStore();

// Enable a flag
setFlag("new_checkout_flow", true);`} />

        <H3>Checking a flag in components</H3>
        <CodeBlock lang="tsx" code={`import { useFeature } from "@/hooks/useFeature";

function CheckoutButton() {
  const newFlow = useFeature("new_checkout_flow");
  return newFlow ? <NewCheckout /> : <OldCheckout />;
}`} />
      </div>
    );

    // ── WebSocket ─────────────────────────────────────────────────────────────
    case "websocket": return (
      <div>
        <H2 id="websocket">WebSocket</H2>
        <P>The <code className="text-xs bg-muted px-1 py-0.5 rounded">useWebSocket</code> hook manages a persistent WebSocket connection with auto-reconnect logic.</P>

        <CodeBlock lang="tsx" code={`import { useWebSocket } from "@/hooks/useWebSocket";

const { send, lastMessage, readyState } = useWebSocket(
  "wss://your-ws-server.com/ws"
);

useEffect(() => {
  if (lastMessage) console.log("Received:", lastMessage.data);
}, [lastMessage]);

// Send a message
send(JSON.stringify({ type: "ping" }));`} />

        <Tip>For a Supabase-backed real-time stream, use the Supabase client's <code className="text-xs bg-blue-900/30 px-1 rounded">channel()</code> API instead — it handles reconnection and auth automatically.</Tip>
      </div>
    );

    // ── Infinite Scroll ───────────────────────────────────────────────────────
    case "infinite-scroll": return (
      <div>
        <H2 id="infinite-scroll">Infinite Scroll & Pagination</H2>
        <P>Two hooks cover both patterns: <code className="text-xs bg-muted px-1 py-0.5 rounded">useInfiniteScroll</code> for "load more on scroll" UIs, and <code className="text-xs bg-muted px-1 py-0.5 rounded">usePagination</code> for page-based navigation.</P>

        <H3>Infinite scroll</H3>
        <CodeBlock lang="tsx" code={`import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const { ref, page } = useInfiniteScroll();

// Attach ref to a sentinel element at the bottom of your list
<div ref={ref} />`} />

        <H3>Pagination</H3>
        <CodeBlock lang="tsx" code={`import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/ui/Pagination";

const { page, setPage, totalPages } = usePagination({ total: 120, pageSize: 20 });

<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />`} />
      </div>
    );

    // ── Offline Detection ─────────────────────────────────────────────────────
    case "offline": return (
      <div>
        <H2 id="offline">Offline Detection</H2>
        <P>When the user loses internet connectivity, an <code className="text-xs bg-muted px-1 py-0.5 rounded">OfflineBanner</code> appears at the top of the page. Failed API calls are queued and replayed once the connection is restored.</P>

        <H3>Hooks</H3>
        <CodeBlock lang="tsx" code={`import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useRetryQueue } from "@/hooks/useRetryQueue";

// Boolean — true when online
const isOnline = useOnlineStatus();

// Queue a callback to retry when back online
const { enqueue } = useRetryQueue();
enqueue(() => api.post("/analytics", payload));`} />

        <H3>OfflineBanner</H3>
        <P>The banner is registered in <code className="text-xs bg-muted px-1 py-0.5 rounded">app/layout.tsx</code> — it renders globally without any additional setup.</P>
      </div>
    );

    // ── Session Timeout ───────────────────────────────────────────────────────
    case "session-timeout": return (
      <div>
        <H2 id="session-timeout">Session Timeout</H2>
        <P>Inactivity auto-logout is built into the auth store. Any user interaction resets the timer. When the timeout is reached the user is silently logged out and redirected to <code className="text-xs bg-muted px-1 py-0.5 rounded">/login</code>.</P>

        <H3>Configuration</H3>
        <CodeBlock lang="bash" code={`# apps/web/.env.local
NEXT_PUBLIC_SESSION_TIMEOUT_MS=1800000   # 30 minutes (default)`} />

        <H3>How it works</H3>
        <CodeBlock lang="ts" code={`// authStore.ts — updateActivity() is called on user events
// A setInterval checks lastActivity against the timeout threshold
// When expired → logout() is called automatically`} />
      </div>
    );

    // ── API Reference ─────────────────────────────────────────────────────────
    case "api-reference": return (
      <div>
        <H2 id="api-reference">Endpoints Reference</H2>
        <P>All endpoints are prefixed with <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/v1</code>. Protected routes require <code className="text-xs bg-muted px-1 py-0.5 rounded">Authorization: Bearer {"<token>"}</code>.</P>

        <H3>Auth</H3>
        <Table
          headers={["Method", "Path", "Auth", "Description"]}
          rows={[
            [<Badge color="green">POST</Badge>,  "/auth/register",         "—",  "Create account, returns token pair"],
            [<Badge color="green">POST</Badge>,  "/auth/login",            "—",  "Login, returns token pair"],
            [<Badge color="green">POST</Badge>,  "/auth/google/callback",  "—",  "Exchange Supabase OAuth token for JWTs"],
            [<Badge color="green">POST</Badge>,  "/auth/refresh",          "—",  "Rotate token pair"],
            [<Badge color="green">POST</Badge>,  "/auth/logout",           "✓",  "Revoke current refresh token"],
            [<Badge color="green">POST</Badge>,  "/auth/logout-all",       "✓",  "Revoke all user refresh tokens"],
            [<Badge color="blue">GET</Badge>,    "/auth/me",               "✓",  "Get current user"],
          ]}
        />

        <H3>Users (admin)</H3>
        <Table
          headers={["Method", "Path", "Auth", "Description"]}
          rows={[
            [<Badge color="blue">GET</Badge>,    "/users",      "admin", "List all users"],
            [<Badge color="blue">GET</Badge>,    "/users/:id",  "admin", "Get user by ID"],
            [<Badge color="amber">PATCH</Badge>, "/users/:id",  "admin", "Update role / active status"],
            [<Badge color="red">DELETE</Badge>,  "/users/:id",  "admin", "Delete user"],
          ]}
        />

        <H3>Todos (example resource)</H3>
        <Table
          headers={["Method", "Path", "Auth", "Description"]}
          rows={[
            [<Badge color="blue">GET</Badge>,    "/todos",      "✓", "List user's todos"],
            [<Badge color="green">POST</Badge>,  "/todos",      "✓", "Create todo"],
            [<Badge color="amber">PATCH</Badge>, "/todos/:id",  "✓", "Update todo"],
            [<Badge color="red">DELETE</Badge>,  "/todos/:id",  "✓", "Delete todo"],
          ]}
        />

        <H3>API Keys</H3>
        <Table
          headers={["Method", "Path", "Auth", "Description"]}
          rows={[
            [<Badge color="blue">GET</Badge>,   "/api-keys",      "✓", "List user's API keys"],
            [<Badge color="green">POST</Badge>, "/api-keys",      "✓", "Create API key"],
            [<Badge color="red">DELETE</Badge>, "/api-keys/:id",  "✓", "Revoke API key"],
          ]}
        />
      </div>
    );

    // ── Swagger ───────────────────────────────────────────────────────────────
    case "swagger": return (
      <div>
        <H2 id="swagger">Swagger / OpenAPI</H2>
        <P>Interactive API documentation is served automatically at <code className="text-xs bg-muted px-1 py-0.5 rounded">http://localhost:3001/documentation</code> when the Swagger feature is enabled.</P>

        <H3>Annotating a route</H3>
        <CodeBlock lang="ts" code={`app.post("/todos", {
  schema: {
    tags: ["Todos"],
    summary: "Create a todo",
    body: CreateTodoBody,          // TypeBox schema
    response: { 201: TodoSchema },
  },
  handler: todoController.create,
});`} />

        <H3>Adding a security definition</H3>
        <CodeBlock lang="ts" code={`app.get("/todos", {
  schema: {
    tags: ["Todos"],
    security: [{ BearerAuth: [] }],  // shows padlock in Swagger UI
  },
  preHandler: [authenticate],
  handler: todoController.list,
});`} />
      </div>
    );

    // ── Rate Limiting ─────────────────────────────────────────────────────────
    case "rate-limiting": return (
      <div>
        <H2 id="rate-limiting">Rate Limiting</H2>
        <P>Powered by <code className="text-xs bg-muted px-1 py-0.5 rounded">@fastify/rate-limit</code>. Applies globally to all routes.</P>

        <H3>Configuration</H3>
        <CodeBlock lang="bash" code={`# apps/api/.env
RATE_LIMIT_MAX=100         # requests per window
RATE_LIMIT_WINDOW_MS=60000 # window size in ms (default: 1 minute)`} />

        <H3>Error response</H3>
        <CodeBlock lang="json" code={`// HTTP 429 Too Many Requests
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Slow down."
}`} />

        <Tip>To set a custom limit for a specific route, pass <code className="text-xs bg-blue-900/30 px-1 rounded">config: {"{ rateLimit: { max: 5, timeWindow: 60000 } }"}</code> in the route options.</Tip>
      </div>
    );

    // ── File Uploads ──────────────────────────────────────────────────────────
    case "file-uploads": return (
      <div>
        <H2 id="file-uploads">File Uploads</H2>
        <P>Files are uploaded via the API to <strong className="text-foreground">Supabase Storage</strong>. The frontend uses the drag-and-drop <code className="text-xs bg-muted px-1 py-0.5 rounded">FileUpload</code> component.</P>

        <H3>Setup</H3>
        <CodeBlock lang="bash" code={`# 1. Create a bucket in your Supabase project → Storage
# 2. Set the bucket name in your API env
SUPABASE_STORAGE_BUCKET=uploads`} />

        <H3>Frontend component</H3>
        <CodeBlock lang="tsx" code={`import { FileUpload } from "@/components/ui/FileUpload";

<FileUpload
  accept={{ "image/*": [".png", ".jpg", ".webp"] }}
  maxSize={5 * 1024 * 1024}   // 5 MB
  onUploaded={(url) => console.log("Public URL:", url)}
/>`} />

        <H3>API endpoint</H3>
        <CodeBlock lang="bash" code={`POST /api/v1/storage/upload
Content-Type: multipart/form-data
Body: file (binary)
Returns: { url: "https://..." }`} />
      </div>
    );

    // ── Email ─────────────────────────────────────────────────────────────────
    case "email": return (
      <div>
        <H2 id="email">Email (Resend)</H2>
        <P>Transactional emails are sent via <a href="https://resend.com" target="_blank" className="text-primary underline-offset-4 hover:underline">Resend</a>. The <code className="text-xs bg-muted px-1 py-0.5 rounded">EmailService</code> wraps the Resend SDK.</P>

        <H3>Setup</H3>
        <CodeBlock lang="bash" code={`# apps/api/.env
RESEND_API_KEY=re_xxxx
FROM_EMAIL=noreply@yourdomain.com`} />

        <H3>Sending an email</H3>
        <CodeBlock lang="ts" code={`import { emailService } from "../services/email.service.js";

await emailService.send({
  to: user.email,
  subject: "Welcome!",
  html: "<h1>Hello, world</h1>",
});`} />
      </div>
    );

    // ── Webhooks ──────────────────────────────────────────────────────────────
    case "webhooks": return (
      <div>
        <H2 id="webhooks">Webhooks</H2>
        <P>Incoming webhooks are verified with HMAC-SHA256 using <code className="text-xs bg-muted px-1 py-0.5 rounded">WEBHOOK_SECRET</code>. Unverified requests are rejected with <code className="text-xs bg-muted px-1 py-0.5 rounded">401</code>.</P>

        <H3>Setup</H3>
        <CodeBlock lang="bash" code={`# apps/api/.env
WEBHOOK_SECRET=your-webhook-secret`} />

        <H3>Receiving a webhook</H3>
        <CodeBlock lang="bash" code={`POST /api/v1/webhooks/receive
Headers:
  x-webhook-signature: <hmac-hex>
  x-webhook-timestamp: <unix-ms>`} />

        <H3>Extending webhook handlers</H3>
        <CodeBlock lang="ts" code={`// apps/api/src/features/webhooks/webhook.controller.ts
export const webhookController = {
  async receive(req, reply) {
    const { event, data } = req.body;
    if (event === "payment.succeeded") {
      // handle payment
    }
    return reply.status(200).send({ ok: true });
  },
};`} />
      </div>
    );

    // ── Cron Jobs ─────────────────────────────────────────────────────────────
    case "cron-jobs": return (
      <div>
        <H2 id="cron-jobs">Cron Jobs</H2>
        <P>Recurring background tasks use <code className="text-xs bg-muted px-1 py-0.5 rounded">node-cron</code>. All jobs are registered in <code className="text-xs bg-muted px-1 py-0.5 rounded">apps/api/src/jobs/index.ts</code> and started automatically on server boot (except in test mode).</P>

        <H3>Adding a job</H3>
        <CodeBlock lang="ts" code={`// apps/api/src/jobs/myJob.ts
import cron from "node-cron";

export function startMyJob() {
  // runs every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily cleanup...");
    // your logic here
  });
}

// Then register it in apps/api/src/jobs/index.ts
import { startMyJob } from "./myJob.js";
export function startCronJobs() {
  startMyJob();
}`} />
      </div>
    );

    // ── Supabase Setup ────────────────────────────────────────────────────────
    case "supabase-setup": return (
      <div>
        <H2 id="supabase-setup">Supabase Setup</H2>

        <H3>1 — Create a Supabase project</H3>
        <P>Go to <a href="https://supabase.com" target="_blank" className="text-primary underline-offset-4 hover:underline">supabase.com</a> → New project. Copy the <strong className="text-foreground">Project URL</strong>, <strong className="text-foreground">Anon Key</strong>, and <strong className="text-foreground">Service Role Key</strong> from Settings → API.</P>

        <H3>2 — Run the migration</H3>
        <P>Open the <strong className="text-foreground">SQL Editor</strong> in your Supabase dashboard and run the contents of:</P>
        <CodeBlock lang="bash" code={`apps/api/supabase/migrations/001_initial.sql`} />
        <P>This creates the <code className="text-xs bg-muted px-1 py-0.5 rounded">users</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">refresh_tokens</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">api_keys</code>, and <code className="text-xs bg-muted px-1 py-0.5 rounded">todos</code> tables with RLS policies.</P>

        <H3>3 — Seed the database</H3>
        <CodeBlock lang="bash" code={`pnpm db:seed\n# Creates: admin@example.com / Admin1234!`} />

        <H3>4 — (Optional) Enable Google OAuth</H3>
        <P>Authentication → Providers → Google → enable and paste your Google credentials. See the <strong className="text-foreground">Google Sign-In</strong> section for full steps.</P>
      </div>
    );

    // ── Vercel ────────────────────────────────────────────────────────────────
    case "vercel": return (
      <div>
        <H2 id="vercel">Deploy Web to Vercel</H2>

        <div className="rounded-xl border border-border bg-card p-4 my-4 text-sm space-y-3">
          {[
            ["1", "Push your repo to GitHub / GitLab / Bitbucket"],
            ["2", "Go to vercel.com → Add New Project → import your repo"],
            ["3", "Set Root Directory to apps/web"],
            ["4", "Add all NEXT_PUBLIC_* env vars in the Vercel dashboard"],
            ["5", "Deploy — Vercel auto-detects Next.js and builds it"],
          ].map(([n, t]) => (
            <div key={n} className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-bold">{n}</span>
              <span className="text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>

        <Note>Set <code className="text-xs">NEXT_PUBLIC_API_URL</code> to your Railway API URL once it's deployed.</Note>
      </div>
    );

    // ── Railway ───────────────────────────────────────────────────────────────
    case "railway": return (
      <div>
        <H2 id="railway">Deploy API to Railway</H2>

        <div className="rounded-xl border border-border bg-card p-4 my-4 text-sm space-y-3">
          {[
            ["1", "Go to railway.app → New Project → Deploy from GitHub"],
            ["2", "Select your monorepo"],
            ["3", "Set Root Directory to apps/api"],
            ["4", "Add all API env vars in the Railway Variables tab"],
            ["5", "Railway builds and deploys automatically on every push"],
          ].map(([n, t]) => (
            <div key={n} className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-bold">{n}</span>
              <span className="text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>

        <H3>Recommended Railway settings</H3>
        <Table
          headers={["Setting", "Value"]}
          rows={[
            ["Start Command",   "node dist/server.js"],
            ["Build Command",   "pnpm build"],
            ["Health Check",    "/api/v1/health"],
            ["PORT",            "3001 (set automatically by Railway)"],
          ]}
        />
      </div>
    );

    // ── New API Module ────────────────────────────────────────────────────────
    case "new-api-module": return (
      <div>
        <H2 id="new-api-module">Adding a New API Module</H2>
        <P>Every API feature lives in <code className="text-xs bg-muted px-1 py-0.5 rounded">apps/api/src/features/</code> as a self-contained folder with four files: <strong className="text-foreground">schema → service → controller → route</strong>. Follow the pattern below to add your own.</P>

        <H3>1 — Create the folder structure</H3>
        <CodeBlock lang="bash" code={`mkdir apps/api/src/features/products
touch apps/api/src/features/products/products.schema.ts
touch apps/api/src/features/products/products.service.ts
touch apps/api/src/features/products/products.controller.ts
touch apps/api/src/features/products/products.route.ts`} />

        <H3>2 — Define the schema (TypeBox)</H3>
        <CodeBlock lang="ts" code={`// products.schema.ts
import { Type, type Static } from "@sinclair/typebox";

export const CreateProductBody = Type.Object({
  name:  Type.String({ minLength: 1 }),
  price: Type.Number({ minimum: 0 }),
});

export const ProductSchema = Type.Object({
  id:         Type.String(),
  name:       Type.String(),
  price:      Type.Number(),
  created_at: Type.String(),
});

export type TCreateProduct = Static<typeof CreateProductBody>;`} />

        <H3>3 — Write the service (business logic)</H3>
        <CodeBlock lang="ts" code={`// products.service.ts
import { supabaseAdmin } from "../../config/database.js";
import { AppError } from "../../utils/errors/AppError.js";
import type { TCreateProduct } from "./products.schema.js";

export const productsService = {
  async list(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("user_id", userId);
    if (error) throw AppError.internal(error.message);
    return data;
  },

  async create(userId: string, body: TCreateProduct) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({ ...body, user_id: userId })
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data;
  },
};`} />

        <H3>4 — Write the controller (request handlers)</H3>
        <CodeBlock lang="ts" code={`// products.controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { productsService } from "./products.service.js";
import type { TCreateProduct } from "./products.schema.js";

export const productsController = {
  list: async (req: FastifyRequest, reply: FastifyReply) =>
    reply.send(await productsService.list(req.user!.userId)),

  create: async (req: FastifyRequest<{ Body: TCreateProduct }>, reply: FastifyReply) =>
    reply.status(201).send(await productsService.create(req.user!.userId, req.body)),
};`} />

        <H3>5 — Register the routes</H3>
        <CodeBlock lang="ts" code={`// products.route.ts
import type { FastifyInstance } from "fastify";
import { productsController } from "./products.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { CreateProductBody } from "./products.schema.js";

export async function productsRoutes(app: FastifyInstance) {
  app.get("/", {
    schema: { tags: ["Products"], summary: "List products", security: [{ BearerAuth: [] }] },
    preHandler: [authenticate],
    handler: productsController.list,
  });

  app.post("/", {
    schema: { body: CreateProductBody, tags: ["Products"], summary: "Create product", security: [{ BearerAuth: [] }] },
    preHandler: [authenticate],
    handler: productsController.create,
  });
}`} />

        <H3>6 — Mount the router in the feature index</H3>
        <CodeBlock lang="ts" code={`// apps/api/src/features/index.ts  — add these two lines:
import { productsRoutes } from "./products/products.route.js";

// inside the exported async function:
await app.register(productsRoutes, { prefix: "/products" });`} />

        <Tip>Your new endpoints will appear immediately in Swagger UI at <code className="text-xs bg-blue-900/30 px-1 rounded">http://localhost:3001/documentation</code> — no extra registration needed.</Tip>

        <H3>7 — Add a database table</H3>
        <P>Create a new migration file and run it in the Supabase SQL editor:</P>
        <CodeBlock lang="sql" code={`-- apps/api/supabase/migrations/002_products.sql
create table if not exists products (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade not null,
  name       text not null,
  price      numeric(10,2) not null default 0,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "users manage own products"
  on products for all
  using (auth.uid() = user_id);`} />
      </div>
    );

    // ── New Web Page ──────────────────────────────────────────────────────────
    case "new-web-page": return (
      <div>
        <H2 id="new-web-page">Adding a New Web Page</H2>
        <P>Next.js 16 App Router uses the filesystem as the router. Every folder inside <code className="text-xs bg-muted px-1 py-0.5 rounded">app/</code> with a <code className="text-xs bg-muted px-1 py-0.5 rounded">page.tsx</code> becomes a route. The monorepo uses three route groups to apply shared layouts.</P>

        <Table
          headers={["Route group", "Layout applied", "Use for"]}
          rows={[
            ["(auth)",      "Centred card, no sidebar", "Login, register, password reset"],
            ["(dashboard)", "Sidebar + topbar",         "Authenticated user pages"],
            ["(marketing)", "None (full-page)",         "Public pages, docs, landing"],
          ]}
        />

        <H3>Add a protected dashboard page</H3>
        <CodeBlock lang="bash" code={`# 1. Create the file
touch apps/web/src/app/(dashboard)/settings/page.tsx`} />
        <CodeBlock lang="tsx" code={`// apps/web/src/app/(dashboard)/settings/page.tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      {/* your content */}
    </DashboardLayout>
  );
}`} />

        <H3>Add a link to the sidebar</H3>
        <CodeBlock lang="tsx" code={`// apps/web/src/components/layout/Sidebar.tsx
// Add an entry to the navItems array:
{ href: "/settings", label: "Settings", icon: Settings2 },`} />

        <H3>Fetching data on a page</H3>
        <CodeBlock lang="tsx" code={`// Use TanStack Query for all API calls
"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings").then(r => r.data),
  });

  if (isLoading) return <p>Loading…</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`} />

        <H3>Admin-only page</H3>
        <CodeBlock lang="tsx" code={`import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminSecretsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <h1>Admin Secrets</h1>
      </DashboardLayout>
    </ProtectedRoute>
  );
}`} />

        <H3>Add a public marketing page</H3>
        <CodeBlock lang="bash" code={`touch apps/web/src/app/(marketing)/pricing/page.tsx`} />
        <CodeBlock lang="tsx" code={`// No auth required — accessible to everyone
export default function PricingPage() {
  return <main className="min-h-screen p-12">Pricing</main>;
}`} />
      </div>
    );

    // ── New Shared Type ───────────────────────────────────────────────────────
    case "new-shared-type": return (
      <div>
        <H2 id="new-shared-type">Adding a Shared Type</H2>
        <P>The <code className="text-xs bg-muted px-1 py-0.5 rounded">packages/shared</code> workspace package is consumed by both <code className="text-xs bg-muted px-1 py-0.5 rounded">apps/api</code> and <code className="text-xs bg-muted px-1 py-0.5 rounded">apps/web</code>. Add any type here that both sides need — e.g. a response shape, an enum, or a domain model.</P>

        <H3>1 — Define the type</H3>
        <CodeBlock lang="ts" code={`// packages/shared/src/types/product.ts
export interface Product {
  id:         string;
  name:       string;
  price:      number;
  created_at: string;
}

export type ProductRole = "digital" | "physical" | "service";`} />

        <H3>2 — Re-export from the package index</H3>
        <CodeBlock lang="ts" code={`// packages/shared/src/index.ts
export * from "./types/product.js";
// (add alongside existing exports)`} />

        <H3>3 — Use it in the API</H3>
        <CodeBlock lang="ts" code={`// apps/api/src/features/products/products.service.ts
import type { Product } from "@repo/shared";`} />

        <H3>4 — Use it in the web app</H3>
        <CodeBlock lang="tsx" code={`// apps/web/src/types/api.ts  (or any file)
import type { Product } from "@repo/shared";

const product: Product = { id: "1", name: "Widget", price: 9.99, created_at: "..." };`} />

        <Tip>Run <code className="text-xs bg-blue-900/30 px-1 rounded">pnpm build --filter @repo/shared</code> after adding new exports so both apps pick up the updated types.</Tip>
      </div>
    );

    // ── New CLI Feature ───────────────────────────────────────────────────────
    case "new-cli-feature": return (
      <div>
        <H2 id="new-cli-feature">Adding a New CLI Feature Option</H2>
        <P>When you add a new optional capability to the template, you register it in <code className="text-xs bg-muted px-1 py-0.5 rounded">bin/create.js</code> so installers can opt in or out during scaffolding. The CLI automatically deletes files and strips code snippets for deselected features.</P>

        <H3>How the feature map works</H3>
        <CodeBlock lang="js" code={`// bin/create.js — each entry in FEATURE_MAP describes what to REMOVE
// when the user does NOT select that feature.
const FEATURE_MAP = {
  myFeature: {
    // Files/folders to delete if deselected
    filePaths: [
      "apps/web/src/components/MyWidget.tsx",
      "apps/api/src/features/my-feature",
    ],
    // Exact strings to strip from files if deselected
    removals: {
      "apps/web/src/app/layout.tsx": [
        '\\nimport { MyWidget } from "@/components/MyWidget";\\n',
        '          <MyWidget />\\n',
      ],
      "apps/api/src/features/index.ts": [
        "import { myFeatureRoutes } from './my-feature/my-feature.route.js';\\n",
        "  await app.register(myFeatureRoutes, { prefix: '/my-feature' });\\n",
      ],
    },
    // npm packages to remove from apps/api/package.json if deselected
    depsApi: ["some-api-package"],
    // npm packages to remove from apps/web/package.json if deselected
    depsWeb: ["some-web-package"],
  },
};`} />

        <H3>Step-by-step walkthrough</H3>
        <div className="rounded-xl border border-border bg-card p-4 my-4 text-sm space-y-3">
          {[
            ["1", "Build your feature files inside the template/ directory as if it were always enabled"],
            ["2", "Identify every file that should be deleted when it's off — list them in filePaths"],
            ["3", "Identify every import/registration line added to shared files — list them in removals"],
            ["4", "List any extra npm packages the feature needs in depsApi or depsWeb"],
            ["5", "Add a choice entry to the API or Web prompts array in main()"],
            ["6", "Test by running the CLI twice: once with the feature on, once with it off"],
          ].map(([n, t]) => (
            <div key={n} className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-bold">{n}</span>
              <span className="text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>

        <H3>Adding the prompt choice</H3>
        <CodeBlock lang="js" code={`// bin/create.js — inside the webFeatures or apiFeatures prompts:
choices: [
  // ... existing choices ...
  {
    title: "My New Feature",   // shown in the CLI list
    value: "myFeature",        // must match the FEATURE_MAP key
    selected: false,           // default: off
  },
],`} />

        <H3>Removals tips</H3>
        <Table
          headers={["Scenario", "What to put in removals"]}
          rows={[
            ["Import added to layout.tsx",       "The exact import line including the leading newline"],
            ["JSX added inside layout.tsx",      "The exact JSX tag line including indentation and trailing newline"],
            ["Route registered in index.ts",     "Both the import line and the app.register() call"],
            ["Env var added to .env.example",    "The exact KEY=value\\n line"],
            ["Middleware registered in app.ts",  "The import + registration lines as separate array entries"],
          ]}
        />

        <Tip>The removal strings are matched literally — copy them character-for-character from the template files, including whitespace and newlines.</Tip>

        <H3>Testing your new CLI feature</H3>
        <CodeBlock lang="bash" code={`# Test with feature ON (selected)
node bin/create.js test-with-feature
# → verify your files exist and registrations are present

# Test with feature OFF (deselected)
node bin/create.js test-without-feature
# → verify files are gone and imports/registrations are stripped`} />
      </div>
    );

    default: return <div className="text-muted-foreground py-8 text-center">Section not found.</div>;
  }
}

// ─── sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({
  activeId,
  onSelect,
  open,
  onClose,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    NAV.forEach(s => { if (s.children.length) defaults[s.id] = true; });
    return defaults;
  });

  const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const handleSelect = useCallback((id: string) => {
    onSelect(id);
    onClose();
  }, [onSelect, onClose]);

  const sidebar = (
    <nav className="h-full overflow-y-auto py-6 px-3 space-y-0.5">
      {NAV.map(section => (
        <div key={section.id}>
          {section.children.length === 0 ? (
            <button
              onClick={() => handleSelect(section.id)}
              className={`w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                activeId === section.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="shrink-0">{section.icon}</span>
              {section.label}
            </button>
          ) : (
            <>
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center justify-between gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <span className="flex items-center gap-2.5"><span className="shrink-0">{section.icon}</span>{section.label}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${expanded[section.id] ? "" : "-rotate-90"}`} />
              </button>
              {expanded[section.id] && (
                <div className="ml-4 pl-3 border-l border-border space-y-0.5 mb-1">
                  {section.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => handleSelect(child.id)}
                      className={`w-full text-left rounded-md px-3 py-1.5 text-sm transition-colors ${
                        activeId === child.id
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 fixed top-14 bottom-0 left-0 border-r border-border bg-background z-20">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative w-72 h-full bg-background border-r border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-semibold text-sm">Navigation</span>
              <button onClick={onClose} className="rounded-md p-1 hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}
    </>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const allIds = NAV.flatMap(s => s.children.length ? s.children.map(c => c.id) : [s.id]);
  const [activeId, setActiveId] = useState(allIds[0]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id === allIds[0] ? "introduction" : id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => { if (globalThis.innerWidth >= 1024) setMobileOpen(false); };
    globalThis.addEventListener("resize", onResize);
    return () => globalThis.removeEventListener("resize", onResize);
  }, []);

  // Determine which single section to show
  const activeSection = activeId;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top navbar ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 h-14 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center gap-4 px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden rounded-md p-1.5 hover:bg-muted text-muted-foreground"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5 font-semibold text-foreground">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <Layers size={14} className="text-primary-foreground" />
            </div>
            <span>{process.env.NEXT_PUBLIC_APP_NAME ?? "NFS Mono"}</span>
            <span className="hidden sm:block text-xs font-normal text-muted-foreground border border-border rounded-full px-2 py-0.5">docs</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Sign in <ArrowRight size={13} />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Layout ──────────────────────────────────────────────────────── */}
      <Sidebar activeId={activeSection} onSelect={scrollTo} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="lg:pl-64 pt-14">
        <div className="max-w-3xl mx-auto px-6 py-10">

          {/* Render introduction + current section */}
          {activeSection === "introduction"
            ? <SectionContent id="introduction" />
            : <SectionContent id={activeSection} />
          }

          {/* Bottom navigation */}
          <div className="mt-16 pt-6 border-t border-border flex items-center justify-between">
            {(() => {
              const idx = allIds.indexOf(activeSection);
              const prev = idx > 0 ? allIds[idx - 1] : null;
              const next = idx < allIds.length - 1 ? allIds[idx + 1] : null;
              const labelOf = (id: string) => {
                for (const s of NAV) {
                  if (s.id === id) return s.label;
                  for (const c of s.children) if (c.id === id) return c.label;
                }
                return id;
              };
              return (
                <>
                  {prev ? (
                    <button onClick={() => scrollTo(prev)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                      <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                      <span><span className="block text-xs text-muted-foreground/60 mb-0.5">Previous</span>{labelOf(prev)}</span>
                    </button>
                  ) : <div />}
                  {next ? (
                    <button onClick={() => scrollTo(next)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right group">
                      <span><span className="block text-xs text-muted-foreground/60 mb-0.5">Next</span>{labelOf(next)}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : <div />}
                </>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
