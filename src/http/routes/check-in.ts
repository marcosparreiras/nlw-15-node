import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UseCaseFacotry } from "../../factories/use-case-factory";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/checkIn",
    {
      schema: {
        summary: "Check in an attendee",
        tags: ["check-ins"],
        params: z.object({
          attendeeId: z.string().uuid(),
        }),
        response: {
          201: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const checkInUseCase = UseCaseFacotry.makeCheckInUseCase();
      await checkInUseCase.execute({ attendeeId });

      return reply.status(201).send({});
    }
  );
}
