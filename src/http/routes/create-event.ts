import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../../repositories/prisma";
import { EventAlreadyExistsError } from "../../domain/erros/event-already-exists-error";

export async function createEvent(app: FastifyInstance): Promise<void> {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;
      const slug = generateSlug(title);
      const eventAlreadyExists = await prisma.event.findUnique({
        where: { slug },
      });
      if (eventAlreadyExists) {
        throw new EventAlreadyExistsError(title);
      }
      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      });
      reply.status(201).send({ eventId: event.id });
    }
  );
}
