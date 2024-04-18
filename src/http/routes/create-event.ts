import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../../repositories/prisma";
import { EventAlreadyExistsError } from "../../domain/application/erros/event-already-exists-error";
import { UseCaseFacotry } from "../../factories/use-case-factory";

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

      const createEventUseCase = UseCaseFacotry.makeCreateEventUseCase();
      const { event } = await createEventUseCase.execute({
        title,
        details,
        maximumAttendees,
      });
      reply.status(201).send({ eventId: event.id.toString() });
    }
  );
}
