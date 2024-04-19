import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UseCaseFacotry } from "../../factories/use-case-factory";

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
            attendeeId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

      const registerForEventUseCase =
        UseCaseFacotry.makeRegisterForEventUseCase();
      const { attendee } = await registerForEventUseCase.execute({
        name,
        email,
        eventId,
      });

      return reply.status(201).send({ attendeeId: attendee.id.toString() });
    }
  );
}
