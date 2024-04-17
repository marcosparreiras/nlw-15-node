import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../repositories/prisma";
import { EventAttendeeAlreadyExistsError } from "../../domain/application/erros/event-attendee-already-exists-error";
import { EventSoldOutError } from "../../domain/application/erros/event-sold-out-error";
import { EventNotFoundError } from "../../domain/application/erros/event-not-found-error";

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Register an attendee for an event",
        tags: ["attendees"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

      const event = await prisma.event.findUnique({ where: { id: eventId } });

      if (!event) {
        throw new EventNotFoundError(eventId);
      }

      const attendeeAlreadyExists = await prisma.attendee.findUnique({
        where: { email_eventId: { email, eventId } },
      });

      if (attendeeAlreadyExists) {
        throw new EventAttendeeAlreadyExistsError(email);
      }

      if (event.maximumAttendees) {
        const eventAttendeesCount = await prisma.attendee.count({
          where: { eventId },
        });
        if (eventAttendeesCount >= event.maximumAttendees) {
          throw new EventSoldOutError(eventId);
        }
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      return reply.status(201).send({ attendeeId: attendee.id });
    }
  );
}
