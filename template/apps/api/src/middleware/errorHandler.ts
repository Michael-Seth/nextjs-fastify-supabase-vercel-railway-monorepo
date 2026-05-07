import type { FastifyRequest, FastifyReply, FastifyError } from "fastify";
import { AppError } from "../utils/errors/AppError.js";
import { DatabaseError } from "../lib/supabase.js";
import { logger } from "../utils/logger.js";
export function errorHandler(
  error: FastifyError | AppError | DatabaseError | Error,
  req: FastifyRequest,
  reply: FastifyReply
) {
  if ("validation" in error && error.validation)
    return reply
      .status(422)
      .send({
        statusCode: 422,
        error: "Validation Error",
        message: "Validation failed",
        details: error.validation,
      });
  if (error instanceof AppError)
    return reply
      .status(error.statusCode)
      .send({ statusCode: error.statusCode, error: error.code ?? "Error", message: error.message });
  if (error instanceof DatabaseError && error.code === "23505")
    return reply
      .status(409)
      .send({ statusCode: 409, error: "Conflict", message: "Already exists" });
  logger.error({ err: error, url: req.url }, "Unhandled error");
  return reply
    .status(500)
    .send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
}
