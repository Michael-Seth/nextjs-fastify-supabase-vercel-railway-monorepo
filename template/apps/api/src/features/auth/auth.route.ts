import type { FastifyInstance } from "fastify"; import { authController } from "./auth.controller.js"; import { authenticate } from "../../middleware/authenticate.js"; import { RegisterBody,LoginBody,RefreshBody } from "./auth.schema.js";
export async function authRoutes(app:FastifyInstance){
  app.post("/register",{schema:{body:RegisterBody,tags:["Auth"],summary:"Register"},handler:authController.register});
  app.post("/login",{schema:{body:LoginBody,tags:["Auth"],summary:"Login"},handler:authController.login});
  app.post("/refresh",{schema:{body:RefreshBody,tags:["Auth"],summary:"Refresh"},handler:authController.refresh});
  app.post("/logout",{schema:{body:RefreshBody,tags:["Auth"],summary:"Logout"},preHandler:[authenticate],handler:authController.logout});
  app.post("/logout-all",{schema:{tags:["Auth"],summary:"Logout all",security:[{BearerAuth:[]}]},preHandler:[authenticate],handler:authController.logoutAll});
  app.get("/me",{schema:{tags:["Auth"],summary:"Current user",security:[{BearerAuth:[]}]},preHandler:[authenticate],handler:authController.me});
}
