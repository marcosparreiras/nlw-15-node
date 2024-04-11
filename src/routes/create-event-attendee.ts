import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../libs/prisma";

export async function createEventAttendee(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendee",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { eventId } = request.params;
        const { name, email } = request.body;

        const attendeeAlreadyExists = await prisma.attendee.findUnique({
          where: { email_eventId: { email, eventId } },
        });

        if (attendeeAlreadyExists) {
          throw new Error(`Attendee ${email} alrady exists on this event`);
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
        if (error instanceof Error) {
          return reply.status(400).send({ message: error.message });
        }
      }
    }
  );
}
