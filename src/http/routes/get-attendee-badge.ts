import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../repositories/prisma";
import { AttendeeNotFoundError } from "../../domain/erros/attendee-not-found-error";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get an attendee",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.coerce.number(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string(),
              eventTitle: z.string(),
              checkInUrl: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const attendee = await prisma.attendee.findUnique({
        where: { id: attendeeId },
        select: {
          id: true,
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

      const baseUrl = `${request.protocol}://${request.hostname}`;
      const checkInUrl = new URL(`/attendees/${attendee.id}/checkIn`, baseUrl);
      return reply.status(200).send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInUrl: checkInUrl.toString(),
        },
      });
    }
  );
}
