import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { EventNotFoundError } from "../../domain/application/erros/event-not-found-error";
import { prisma } from "../../repositories/prisma";

export async function fetchEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Fetch event attendees",
        tags: ["events"],
        params: z.object({
          eventId: z.string(),
        }),
        querystring: z.object({
          query: z.string().nullish(),
          page: z.coerce.number().int().default(1),
        }),
        response: {
          200: z.object({
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
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { page, query } = request.query;

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) {
        throw new EventNotFoundError(eventId);
      }

      const attendees = await prisma.attendee.findMany({
        where: query
          ? {
              eventId,
              name: {
                contains: query,
              },
            }
          : { eventId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
        take: 10,
        skip: (page - 1) * 10,
        orderBy: {
          createdAt: "desc",
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

      return reply.status(200).send({ attendees: eventAttendees });
    }
  );
}
