FROM node:22-alpine AS base
RUN corepack enable

# ── Install all deps (devDeps needed to compile TS) ──────────────────────────
FROM base AS deps
WORKDIR /monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
FROM deps AS builder
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
# Build shared first so the API can resolve @repo/shared at runtime
RUN pnpm --filter @repo/shared build && pnpm --filter @repo/api build

# ── Production image ──────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /monorepo
ENV NODE_ENV=production

# Reinstall prod deps only
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output (node_modules/@repo/shared symlink → packages/shared/dist)
COPY --from=builder /monorepo/packages/shared/dist ./packages/shared/dist
COPY --from=builder /monorepo/apps/api/dist ./apps/api/dist

WORKDIR /monorepo/apps/api
EXPOSE 3001
CMD ["node", "dist/index.js"]

# Line by line
# FROM node:22-alpine AS base

# Start from the official Node 22 image built on Alpine Linux (a minimal ~5MB Linux distro). Names this stage base so other stages can inherit from it. Alpine is used because the full node:22 image is ~1GB; Alpine brings it down to ~170MB.

# RUN corepack enable

# Corepack is Node's built-in package manager manager. Enabling it activates pnpm without a separate install step — it reads the packageManager field in package.json and uses the right version automatically.

# FROM base AS deps

# Start a new stage called deps, inheriting from base.

# WORKDIR /monorepo

# Set the working directory inside the container. All subsequent paths are relative to this.

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

# Copy only the monorepo root manifest files first — not the source code. This is intentional: Docker caches each line as a layer. If source code changes but these files don't, Docker reuses the cached layer and skips reinstalling node_modules (the slow part).

# COPY apps/api/package.json ./apps/api/

# COPY packages/shared/package.json ./packages/shared/

# Same layer-caching trick for each workspace package's manifest. pnpm needs these to know what to install before it sees any source.

# RUN pnpm install --frozen-lockfile

# Install all dependencies (including devDependencies like typescript and tsx, which are needed to compile). --frozen-lockfile means "fail if pnpm-lock.yaml is out of date" — prevents surprises in CI.

# FROM deps AS builder

# New stage called builder, starting from the deps stage (so node_modules are already there).

# COPY packages/shared ./packages/shared

# COPY apps/api ./apps/api

# Now copy the actual source code. Kept separate from the manifest copy above so that changing source code doesn't invalidate the pnpm install cache layer.

# RUN pnpm --filter @repo/shared build && pnpm --filter @repo/api build

# Compile in the right order. @repo/shared must go first because the API imports from it — if shared isn't compiled to JS yet, node dist/index.js would crash at startup trying to import a .ts file. --filter targets a specific workspace package by name.

# FROM base AS runner

# New stage — the final production image. Crucially, this starts from base (clean Alpine + Node), not from builder. Everything from the builder stage — TypeScript compiler, test libraries, source files — is discarded. Only what we explicitly copy in makes it into the final image.

# WORKDIR /monorepo

# ENV NODE_ENV=production

# Sets the environment variable that tells Express/Fastify/libraries to run in production mode (stricter error handling, no dev middleware, better performance).

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# COPY apps/api/package.json ./apps/api/

# COPY packages/shared/package.json ./packages/shared/

# RUN pnpm install --frozen-lockfile --prod

# Re-install dependencies but --prod this time — skips all devDependencies. This is why the runner stage is much leaner: no TypeScript compiler, no test runners, no tsx.

# COPY --from=builder /monorepo/packages/shared/dist ./packages/shared/dist

# COPY --from=builder /monorepo/apps/api/dist ./apps/api/dist

# Reach back into the builder stage and pull out only the compiled JavaScript. The --from=builder flag is what makes multi-stage builds work.

# The shared dist is needed because at runtime node_modules/@repo/shared is a pnpm symlink pointing to packages/shared/, and the compiled API does import ... from '@repo/shared' — Node follows that symlink and looks for packages/shared/dist/index.js.

# WORKDIR /monorepo/apps/api

# Move the working directory to the API app so relative paths in the start command work correctly.

# EXPOSE 3001

# Documents that the container listens on port 3001. This is metadata — it doesn't actually open the port, but Railway reads it to know which port to route traffic to.

# CMD ["node", "dist/index.js"]

# The command Railway runs when it starts the container. Uses the compiled JS directly — no TypeScript compiler involved at runtime.