import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { DomainError } from "../errors/domain-error";
import { prisma } from "../libs/prisma";
import { EventNotFoundError } from "../errors/event-not-found-error";

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            title: z.string(),
            details: z.string().nullable(),
            slug: z.string(),
            maximumAttendees: z.number().nullable(),
            atteendessCount: z.number(),
          }),
          400: z.object({
            message: z.string(),
          }),
          500: { message: "Internal server error" },
        },
      },
    },
    async (request, reply) => {
      try {
        const { eventId } = request.params;

        const event = await prisma.event.findUnique({ where: { id: eventId } });

        if (!event) {
          throw new EventNotFoundError(eventId);
        }

        const atteendessCount = await prisma.attendee.count({
          where: { eventId },
        });

        return reply.status(200).send({
          id: event.id,
          title: event.title,
          details: event.details,
          slug: event.slug,
          maximumAttendees: event.maximumAttendees,
          atteendessCount,
        });
      } catch (error: unknown) {
        if (error instanceof DomainError) {
          return reply.status(400).send({ message: error.message });
        }
        console.log(error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
