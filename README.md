# nextjs-fastify-supabase-vercel-railway-monorepo

Scaffold a production-ready **Next.js + Fastify + Supabase** monorepo in one command — pre-wired for deployment on **Vercel** (web) and **Railway** (API).

## Usage

```bash
npx nextjs-fastify-supabase-vercel-railway-monorepo my-app
# or, after global install:
create-nfs-app my-app
```

## What you get

A fully configured **Turborepo + pnpm** monorepo:

| Package | Stack | Port |
|---------|-------|------|
| `apps/api` | Fastify 5 + Supabase | 3001 |
| `apps/web` | Next.js 16 App Router | 3000 |
| `packages/shared` | Shared Zod schemas + TS types | — |

### API (`apps/api`)
- JWT + refresh-token rotation auth
- RBAC (`admin` / `user` / `moderator`)
- API key management (SHA-256 hashed, scoped)
- Row Level Security on all Supabase tables
- File uploads via Supabase Storage
- HMAC-signed webhooks
- Swagger / OpenAPI docs at `/documentation`
- Rate limiting, Helmet, CORS
- Vitest test suite + database seed script
- Multi-stage Dockerfile optimised for Railway

### Web (`apps/web`)
- Auth flows: login, register, forgot-password
- Protected routes with `<ProtectedRoute>`
- TanStack Query data fetching
- Zustand stores (auth, UI, feature flags)
- Tailwind CSS + Radix UI component library
- Dark mode, i18n with next-intl, offline banner
- GitHub Actions CI/CD → Vercel

### Tooling
- TypeScript strict mode across all packages
- ESLint + Prettier
- Turborepo task pipelines (dev / build / test / lint / type-check)
- GitHub Actions for Vercel + Railway deploys

## Quick start

```bash
npx nextjs-fastify-supabase-vercel-railway-monorepo my-app
cd my-app

cp apps/api/.env.example  apps/api/.env
cp apps/web/.env.example  apps/web/.env.local
# → fill in Supabase URL, keys, and JWT secrets

pnpm install

# Run apps/api/supabase/migrations/001_initial.sql in Supabase SQL editor
pnpm db:seed   # creates admin@example.com / Admin1234!
pnpm dev       # API :3001 · Web :3000
```

## Scaffold more features

```bash
cfs make <feature>           # new API feature (schema → repo → service → controller → route → tests)
cfs make:page <path>         # new Next.js page + hook + test
cfs make:component <Name>    # new UI component + test
```

## Project structure

```
my-app/
├── apps/
│   ├── api/          Fastify REST API
│   └── web/          Next.js frontend
├── packages/
│   └── shared/       Shared TypeScript types + Zod schemas
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## License

MIT
