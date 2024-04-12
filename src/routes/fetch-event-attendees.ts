import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { DomainError } from "../errors/domain-error";
import { prisma } from "../libs/prisma";
import { EventNotFoundError } from "../errors/event-not-found-error";

export async function fetchEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        params: z.object({
          eventId: z.string(),
        }),
        response: {
          200: z.object({
            total: z.number(),
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkInAt: z.date().nullable(),
              })
            ),
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

        const attendees = await prisma.attendee.findMany({
          where: { eventId },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        });

        const eventAttendees = await Promise.all(
          attendees.map(async (attendee) => {
            const checkIn = await prisma.checkIn.findUnique({
              where: { attendeeId: attendee.id },
            });
            const checkInAt = checkIn ? checkIn.createdAt : null;
            return { ...attendee, checkInAt };
          })
        );

        return reply
          .status(200)
          .send({ total: attendees.length, attendees: eventAttendees });
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
