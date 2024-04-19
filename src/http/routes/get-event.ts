import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UseCaseFacotry } from "../../factories/use-case-factory";
import { EventPresenter } from "../../presenters/event-presenter";

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId",
    {
      schema: {
        summary: "Get an event",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string(),
              title: z.string(),
              details: z.string().nullable(),
              slug: z.string(),
              maximumAttendees: z.number().nullable(),
              atteendessAmount: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      const getEventUseCase = UseCaseFacotry.makeGetEventUseCase();
      const { event, attendeesAmount } = await getEventUseCase.execute({
        eventId,
      });

      return reply.status(200).send({
        event: EventPresenter.toHTTP(event, attendeesAmount),
      });
    }
  );
}
