import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { env } from "./config/env.js";
import { swaggerConfig, swaggerUiConfig } from "./config/swagger.js";
import { registerRoutes } from "./features/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { startCronJobs } from "./jobs/index.js";

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === "development"
      ? { transport: { target:"pino-pretty", options:{ colorize:true } } }
      : env.NODE_ENV !== "test",
    trustProxy: true,
  });
  await app.register(helmet, { global: true });
  await app.register(cors, {
    origin: env.NODE_ENV === "production"
      ? env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) ?? false : true,
    credentials: true,
  });
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX, timeWindow: env.RATE_LIMIT_WINDOW_MS,
    errorResponseBuilder: () => ({ statusCode:429, error:"Too Many Requests", message:"Slow down." }),
  });
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
  await app.register(sensible);
  await app.register(swagger, swaggerConfig);
  await app.register(swaggerUi, swaggerUiConfig);
  await app.register(requestLogger);
  await app.register(registerRoutes, { prefix: `/api/${env.API_VERSION}` });
  app.get("/health", async () => ({ status:"ok", timestamp: new Date().toISOString() }));
  app.setErrorHandler(errorHandler);
  if (env.NODE_ENV !== 'test') startCronJobs();
  return app;
}
