import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UseCaseFacotry } from "../../factories/use-case-factory";
import { AttendeeBadgePresenter } from "../../presenters/attendee-badge-presenter";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get an attendee",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string(),
              checkInUrl: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const getAttendeeBadgeUseCase =
        UseCaseFacotry.makeGetAttendeeBadgeUseCase();

      const { attendee } = await getAttendeeBadgeUseCase.execute({
        attendeeId,
      });

      return reply.status(200).send({
        badge: AttendeeBadgePresenter.toHTTP(attendee, request),
      });
    }
  );
}
