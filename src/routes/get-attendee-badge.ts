import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { DomainError } from "../errors/domain-error";
import { prisma } from "../libs/prisma";
import { AttendeeNotFoundError } from "../errors/attendee-not-found-error";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number(),
        }),
        response: {
          200: z.object({
            attendee: z.object({
              name: z.string(),
              email: z.string(),
              event: z.string(),
            }),
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
        const { attendeeId } = request.params;

        const attendee = await prisma.attendee.findUnique({
          where: { id: attendeeId },
          select: {
            name: true,
            email: true,
            event: {
              select: { title: true },
            },
          },
        });

        if (!attendee) {
          throw new AttendeeNotFoundError(attendeeId.toString());
        }

        return reply.status(200).send({
          attendee: {
            name: attendee.name,
            email: attendee.email,
            event: attendee.event.title,
          },
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
