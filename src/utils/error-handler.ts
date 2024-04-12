import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { DomainError } from "../errors/domain-error";

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof DomainError) {
    return reply.status(400).send({ message: error.message });
  }
  console.log(error);
  return reply.status(500).send({ message: "Internal server error" });
}
