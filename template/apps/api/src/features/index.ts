import type { FastifyInstance } from "fastify";
import { authRoutes }   from "./auth/auth.route.js";
import { userRoutes }   from "./users/user.route.js";
import { todoRoutes }   from "./todos/todo.route.js";
import { apiKeyRoutes } from "./api-keys/apiKey.route.js";
import { healthRoutes } from "./health/health.route.js";
import { storageRoutes } from './storage/storage.route.js';
import { webhookRoutes } from './webhooks/webhook.route.js';
export async function registerRoutes(app:FastifyInstance){
  await app.register(authRoutes,{prefix:"/auth"});
  await app.register(userRoutes,{prefix:"/users"});
  await app.register(todoRoutes,{prefix:"/todos"});
  await app.register(apiKeyRoutes,{prefix:"/api-keys"});
  await app.register(healthRoutes,{prefix:"/health"});
  await app.register(storageRoutes,{prefix:'/storage'});
  await app.register(webhookRoutes,{prefix:'/webhooks'});
}
