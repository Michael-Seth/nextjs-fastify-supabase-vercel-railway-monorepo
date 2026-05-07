import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
export const swaggerConfig: FastifyDynamicSwaggerOptions = {
  openapi: { openapi:"3.0.0", info:{ title:"API", description:"Auto-generated", version:"1.0.0" },
    components: { securitySchemes: {
      BearerAuth:{ type:"http", scheme:"bearer", bearerFormat:"JWT" },
      ApiKeyAuth: { type:"apiKey", in:"header", name:"x-api-key" },
    }},
    tags:[{name:"Auth"},{name:"Users"},{name:"API Keys"},{name:"Health"}],
  },
};
export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix:"/documentation", uiConfig:{ docExpansion:"list" }, staticCSP:true,
};
