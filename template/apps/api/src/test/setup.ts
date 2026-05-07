import { beforeAll,afterAll } from "vitest"; import { buildApp } from "../app.js";
let app: Awaited<ReturnType<typeof buildApp>>;
beforeAll(async()=>{ process.env.NODE_ENV="test"; app=await buildApp(); await app.ready(); (globalThis as Record<string,unknown>).app=app; });
afterAll(async()=>{ await app?.close(); });
