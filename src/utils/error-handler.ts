import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { DomainError } from "../errors/domain-error";
import { ZodError } from "zod";

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Error during validation",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof DomainError) {
    return reply.status(400).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Internal server error" });
}
