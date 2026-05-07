import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

async function start() {
  const app = await buildApp();
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    logger.info(`🚀 API ready at http://${env.HOST}:${env.PORT}`);
    logger.info(`📖 Docs at http://${env.HOST}:${env.PORT}/documentation`);
  } catch (err) { logger.error(err); process.exit(1); }
}
start();
