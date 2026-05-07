#!/usr/bin/env node

import {
  existsSync, mkdirSync, readFileSync, writeFileSync,
  readdirSync, statSync, rmSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import prompts from 'prompts';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Banner ───────────────────────────────────────────────────────────────────

const BANNER = `
   ██████╗███████╗███████╗    ███╗   ███╗ ██████╗ ███╗   ██╗ ██████╗
  ██╔════╝██╔════╝██╔════╝    ████╗ ████║██╔═══██╗████╗  ██║██╔═══██╗
  ██║     █████╗  ███████╗    ██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║
  ██║     ██╔══╝  ╚════██║    ██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║
  ╚██████╗██║     ███████║    ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║╚██████╔╝
   ╚═════╝╚═╝     ╚══════╝    ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝

  Monorepo scaffold: Next.js + Fastify + Supabase — v1.0.0

  ${'─'.repeat(66)}
`;

// ─── Feature map ──────────────────────────────────────────────────────────────
// filePaths — paths (relative to project root) to delete if feature is NOT chosen
// removals  — { 'file': ['exact string to strip', …] }
// depsApi   — packages to drop from apps/api/package.json > dependencies
// depsWeb   — packages to drop from apps/web/package.json > dependencies

/** @type {Record<string, {filePaths: string[], removals: Record<string, string[]>, depsApi: string[], depsWeb: string[]}>} */
const FEATURE_MAP = {
  // ── API optional features ──────────────────────────────────────────────────
  rateLimit: {
    filePaths: [],
    removals: {
      'apps/api/src/app.ts': [
        'import rateLimit from "@fastify/rate-limit";\n',
        '  await app.register(rateLimit, {\n    max: env.RATE_LIMIT_MAX, timeWindow: env.RATE_LIMIT_WINDOW_MS,\n    errorResponseBuilder: () => ({ statusCode:429, error:"Too Many Requests", message:"Slow down." }),\n  });\n',
      ],
      'apps/api/src/config/env.ts': [
        '  RATE_LIMIT_MAX: parseInt(opt("RATE_LIMIT_MAX","100"),10),\n  RATE_LIMIT_WINDOW_MS: parseInt(opt("RATE_LIMIT_WINDOW_MS","60000"),10),\n',
      ],
      'apps/api/.env.example': [
        'RATE_LIMIT_MAX=100\n',
        'RATE_LIMIT_WINDOW_MS=60000\n',
      ],
    },
    depsApi: ['@fastify/rate-limit'],
    depsWeb: [],
  },

  swagger: {
    filePaths: ['apps/api/src/config/swagger.ts'],
    removals: {
      'apps/api/src/app.ts': [
        'import swagger from "@fastify/swagger";\n',
        'import swaggerUi from "@fastify/swagger-ui";\n',
        'import { swaggerConfig, swaggerUiConfig } from "./config/swagger.js";\n',
        '  await app.register(swagger, swaggerConfig);\n',
        '  await app.register(swaggerUi, swaggerUiConfig);\n',
      ],
    },
    depsApi: ['@fastify/swagger', '@fastify/swagger-ui'],
    depsWeb: [],
  },

  fileUploads: {
    filePaths: ['apps/api/src/features/storage'],
    removals: {
      'apps/api/src/app.ts': [
        'import multipart from "@fastify/multipart";\n',
        '  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });\n',
      ],
      'apps/api/src/features/index.ts': [
        "import { storageRoutes } from './storage/storage.route.js';\n",
        "  await app.register(storageRoutes,{prefix:'/storage'});\n",
      ],
      'apps/api/.env.example': ['SUPABASE_STORAGE_BUCKET=uploads\n'],
    },
    depsApi: ['@fastify/multipart'],
    depsWeb: [],
  },

  email: {
    filePaths: ['apps/api/src/services/email.service.ts'],
    removals: {
      'apps/api/.env.example': [
        'RESEND_API_KEY=re_xxxx\n',
        'FROM_EMAIL=noreply@yourdomain.com\n',
      ],
    },
    depsApi: ['resend'],
    depsWeb: [],
  },

  webhooks: {
    filePaths: ['apps/api/src/features/webhooks'],
    removals: {
      'apps/api/src/features/index.ts': [
        "import { webhookRoutes } from './webhooks/webhook.route.js';\n",
        "  await app.register(webhookRoutes,{prefix:'/webhooks'});\n",
      ],
      'apps/api/.env.example': ['WEBHOOK_SECRET=your-webhook-secret\n'],
    },
    depsApi: [],
    depsWeb: [],
  },

  cronJobs: {
    filePaths: ['apps/api/src/jobs'],
    removals: {
      'apps/api/src/app.ts': [
        'import { startCronJobs } from "./jobs/index.js";\n',
        "  if (env.NODE_ENV !== 'test') startCronJobs();\n",
      ],
    },
    depsApi: ['node-cron'],
    depsWeb: [],
  },

  // ── Web optional features ──────────────────────────────────────────────────
  authPages: {
    filePaths: ['apps/web/src/app/(auth)'],
    removals: {},
    depsApi: [],
    depsWeb: [],
  },

  adminDashboard: {
    filePaths: ['apps/web/src/app/(dashboard)/admin'],
    removals: {},
    depsApi: [],
    depsWeb: [],
  },

  landingPage: {
    filePaths: ['apps/web/src/app/(marketing)'],
    removals: {},
    depsApi: [],
    depsWeb: [],
  },

  i18n: {
    filePaths: ['apps/web/src/i18n'],
    removals: {},
    depsApi: [],
    depsWeb: ['next-intl'],
  },

  featureFlags: {
    filePaths: [
      'apps/web/src/stores/featureFlagStore.ts',
      'apps/web/src/hooks/useFeature.ts',
      'apps/web/src/__tests__/useFeature.test.ts',
    ],
    removals: {},
    depsApi: [],
    depsWeb: [],
  },

  webSocket: {
    filePaths: ['apps/web/src/hooks/useWebSocket.ts'],
    removals: {},
    depsApi: [],
    depsWeb: [],
  },

  infiniteScroll: {
    filePaths: [
      'apps/web/src/hooks/useInfiniteScroll.ts',
      'apps/web/src/hooks/usePagination.ts',
      'apps/web/src/__tests__/usePagination.test.ts',
    ],
    removals: {},
    depsApi: [],
    depsWeb: [],
  },

  offlineDetection: {
    filePaths: [
      'apps/web/src/hooks/useOnlineStatus.ts',
      'apps/web/src/hooks/useRetryQueue.ts',
      'apps/web/src/components/OfflineBanner.tsx',
    ],
    removals: {
      'apps/web/src/app/layout.tsx': [
        '\nimport { OfflineBanner } from "@/components/OfflineBanner";\n',
        '          <OfflineBanner />\n',
      ],
    },
    depsApi: [],
    depsWeb: [],
  },

  sessionTimeout: {
    // Lightweight — built into authStore; no files to delete
    filePaths: [],
    removals: {},
    depsApi: [],
    depsWeb: [],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** @param {Buffer} buf */
function isBinary(buf) {
  for (let i = 0; i < Math.min(8000, buf.length); i++) {
    if (buf[i] === 0) return true;
  }
  return false;
}

/**
 * @param {string} src
 * @param {string} dest
 * @param {Record<string, string>} replacements
 */
function copyDir(src, dest, replacements) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const stat = statSync(srcPath);
    const destName = entry.startsWith('_') ? '.' + entry.slice(1) : entry;
    const destPath = join(dest, destName);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath, replacements);
    } else {
      const buf = readFileSync(srcPath);
      if (isBinary(buf)) {
        writeFileSync(destPath, buf);
      } else {
        let content = buf.toString('utf-8');
        for (const [from, to] of Object.entries(replacements)) {
          content = content.split(from).join(to);
        }
        writeFileSync(destPath, content, 'utf-8');
      }
    }
  }
}

/**
 * @param {string} targetDir
 * @param {Record<string, string[]>} removals
 */
function applyRemovals(targetDir, removals) {
  for (const [relPath, strings] of Object.entries(removals)) {
    const filePath = join(targetDir, relPath);
    if (!existsSync(filePath)) continue;
    let content = readFileSync(filePath, 'utf-8').replaceAll('\r\n', '\n');
    for (const s of strings) content = content.split(s).join('');
    writeFileSync(filePath, content, 'utf-8');
  }
}

/**
 * @param {string} pkgPath
 * @param {string[]} names
 */
function removeDeps(pkgPath, names) {
  if (!existsSync(pkgPath) || !names.length) return;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  let changed = false;
  for (const name of names) {
    if (pkg.dependencies?.[name]) { delete pkg.dependencies[name]; changed = true; }
    if (pkg.devDependencies?.[name]) { delete pkg.devDependencies[name]; changed = true; }
  }
  if (changed) writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

/**
 * @param {string} targetDir
 * @param {string[]} filePaths
 */
function deleteFeaturePaths(targetDir, filePaths) {
  for (const rel of filePaths) {
    const full = join(targetDir, rel);
    if (existsSync(full)) rmSync(full, { recursive: true, force: true });
  }
}

/** @param {string} name */
function toDisplayName(name) {
  return name.replaceAll('-', ' ').replaceAll(/\b\w/g, (/** @type {string} */ c) => c.toUpperCase());
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(BANNER);

  let cancelled = false;
  const onCancel = () => { cancelled = true; };

  // ── Step 1: Project name ───────────────────────────────────────────────────
  let projectName = process.argv[2]?.trim();
  if (!projectName) {
    const res = await prompts(
      { type: 'text', name: 'name', message: 'Project name', initial: 'my-saas-app' },
      { onCancel }
    );
    if (cancelled) process.exit(0);
    projectName = res.name?.trim();
  }

  projectName = projectName.toLowerCase().replace(/\s+/g, '-');

  if (!projectName || !/^[a-z][a-z0-9-]*$/.test(projectName)) {
    console.error('\n❌  Name must start with a letter and contain only lowercase letters, numbers, hyphens.\n');
    process.exit(1);
  }

  const targetDir = join(process.cwd(), projectName);
  if (existsSync(targetDir)) {
    console.error(`\n❌  Directory "${projectName}" already exists.\n`);
    process.exit(1);
  }

  // ── Step 2: API features ───────────────────────────────────────────────────
  const { apiFeatures } = await prompts(
    {
      type: 'multiselect',
      name: 'apiFeatures',
      message: 'API features',
      instructions: ' Space to toggle · Enter to confirm',
      choices: [
        { title: 'Rate Limiting',                value: 'rateLimit',   selected: true  },
        { title: 'Swagger / OpenAPI docs',        value: 'swagger',     selected: true  },
        { title: 'File Uploads (Supabase Storage)', value: 'fileUploads', selected: true  },
        { title: 'Email (Resend)',                value: 'email',       selected: false },
        { title: 'Webhooks',                      value: 'webhooks',    selected: false },
        { title: 'Cron Jobs',                     value: 'cronJobs',    selected: false },
      ],
      min: 0,
    },
    { onCancel }
  );
  if (cancelled) process.exit(0);

  // ── Step 3: Web / UI features ──────────────────────────────────────────────
  const { webFeatures } = await prompts(
    {
      type: 'multiselect',
      name: 'webFeatures',
      message: 'UI component library',
      instructions: ' Space to toggle · Enter to confirm',
      choices: [
        { title: 'Auth pages (login, register, forgot password)', value: 'authPages',       selected: true  },
        { title: 'Admin dashboard + role-based UI',               value: 'adminDashboard',  selected: true  },
        { title: 'Landing page',                                  value: 'landingPage',     selected: true  },
        { title: 'i18n / Auto-localization',                      value: 'i18n',            selected: true  },
        { title: 'Feature flags (useFeature hook)',               value: 'featureFlags',    selected: true  },
        { title: 'WebSocket hook',                                value: 'webSocket',       selected: false },
        { title: 'Infinite scroll + pagination',                  value: 'infiniteScroll',  selected: true  },
        { title: 'Offline detection + retry queue',              value: 'offlineDetection', selected: true  },
        { title: 'Session timeout / auto-logout',                value: 'sessionTimeout',  selected: true  },
      ],
      min: 0,
    },
    { onCancel }
  );
  if (cancelled) process.exit(0);

  const selectedFeatures = new Set([...(apiFeatures ?? []), ...(webFeatures ?? [])]);
  const allOptional = Object.keys(FEATURE_MAP);
  const deselected = allOptional.filter(f => !selectedFeatures.has(f));

  const displayName = toDisplayName(projectName);
  console.log(`\nScaffolding ${displayName}…\n`);

  // ── Copy template ──────────────────────────────────────────────────────────
  const templateDir = join(__dirname, '..', 'template');
  copyDir(templateDir, targetDir, {
    '{{app-name}}': projectName,
    '{{APP_NAME}}': displayName,
  });

  // ── Apply feature exclusions ───────────────────────────────────────────────
  for (const feature of deselected) {
    const map = FEATURE_MAP[feature];
    deleteFeaturePaths(targetDir, map.filePaths);
    applyRemovals(targetDir, map.removals);
    removeDeps(join(targetDir, 'apps/api/package.json'), map.depsApi);
    removeDeps(join(targetDir, 'apps/web/package.json'), map.depsWeb);
  }

  // ── Optional: git init ─────────────────────────────────────────────────────
  try {
    execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    execSync('git add -A', { cwd: targetDir, stdio: 'ignore' });
    execSync('git commit -m "chore: initial scaffold"', { cwd: targetDir, stdio: 'ignore' });
  } catch { /* git is optional */ }

  // ── Done ───────────────────────────────────────────────────────────────────
  const line = '─'.repeat(60);
  console.log(`\n✅  ${displayName} created in ./${projectName}/\n`);
  console.log(line);
  console.log('\n📋  Next steps:\n');
  console.log(`  cd ${projectName}`);
  console.log('  cp apps/api/.env.example  apps/api/.env');
  console.log('  cp apps/web/.env.example  apps/web/.env.local');
  console.log('  # → fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,');
  console.log('  #   JWT_SECRET, REFRESH_TOKEN_SECRET\n');
  console.log('  pnpm install\n');
  console.log('  # → run apps/api/supabase/migrations/001_initial.sql in Supabase SQL editor');
  console.log('  pnpm db:seed    # admin@example.com / Admin1234!');
  console.log('  pnpm dev        # API :3001 · Web :3000\n');
  console.log(line);
  console.log('\n📖  Swagger docs:  http://localhost:3001/documentation');
  console.log('🌐  Web app:       http://localhost:3000\n');

  const featureList = [...selectedFeatures].join(', ');
  console.log(`🔧  Included features: ${featureList || '(core only)'}\n`);
}

try {
  await main();
} catch (err) {
  console.error('\n❌ ', /** @type {Error} */ (err).message);
  process.exit(1);
}
