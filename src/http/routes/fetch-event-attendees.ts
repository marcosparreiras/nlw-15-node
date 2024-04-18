import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UseCaseFacotry } from "../../factories/use-case-factory";
import { AttendeePresenter } from "../../presenters/attendee-presenter";

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
                id: z.string().uuid(),
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

      const fetchEventAttendeesUseCase =
        UseCaseFacotry.makeFetchEventAttendeesUseCase();
      const { attendees } = await fetchEventAttendeesUseCase.execute({
        eventId,
        page,
        query,
      });

      return reply
        .status(200)
        .send({ attendees: attendees.map(AttendeePresenter.toHTTP) });
    }
  );
}
