import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../libs/prisma";
import { EventAttendeeAlreadyExistsError } from "../errors/event-attendee-already-exists-error";
import { EventNotFoundError } from "../errors/event-not-found-error";
import { EventSoldOutError } from "../errors/event-sold-out-error";
import { DomainError } from "../errors/domain-error";

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
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
          const eventAttendees = await prisma.attendee.aggregate({
            where: { eventId },
            _count: {
              id: true,
            },
          });
          if (eventAttendees._count.id >= event.maximumAttendees) {
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
