# {{app-name}}

## Monorepo structure

```
{{app-name}}/
├── apps/
│   ├── api/          Fastify 4 + Supabase — REST API
│   └── web/          Next.js 14 App Router — frontend
├── packages/
│   └── shared/       Shared TypeScript types + Zod schemas
├── turbo.json
└── package.json
```

## Quick start

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Fill in your Supabase + JWT secrets

npm install

# Run 001_initial.sql in Supabase SQL editor
npm run db:seed

npm run dev   # starts API on :3001 and Web on :3000
```

## Apps

| App | URL | Description |
|-----|-----|-------------|
| API | http://localhost:3001 | Fastify REST API |
| Web | http://localhost:3000 | Next.js frontend |
| Docs | http://localhost:3001/documentation | Swagger UI |

## Commands

```bash
npm run dev          # dev mode (all apps)
npm run build        # production build
npm run test         # run all tests
npm run lint         # lint all packages
npm run type-check   # TypeScript check
npm run db:seed      # seed database
```

## Scaffold more

```bash
cfs make <feature>           # new API feature
cfs make:page <name>         # new Next.js page
cfs make:component <name>    # new UI component
```
