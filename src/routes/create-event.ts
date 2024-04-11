import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../libs/prisma";
import z from "zod";
import { EventAlreadyExistsError } from "../errors/event-already-exists-error";

export async function createEvent(app: FastifyInstance): Promise<void> {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
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
      } catch (error: unknown) {
        if (error instanceof EventAlreadyExistsError) {
          return reply.status(400).send({ message: error.message });
        }
        console.log(error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
