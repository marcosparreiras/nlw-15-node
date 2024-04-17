import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../repositories/prisma";
import { AttendeeNotFoundError } from "../../domain/application/erros/attendee-not-found-error";
import { CheckInAlreadyExistsError } from "../../domain/application/erros/check-in-already-exists-error";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/checkIn",
    {
      schema: {
        summary: "Check in an attendee",
        tags: ["check-ins"],
        params: z.object({
          attendeeId: z.coerce.number(),
        }),
        response: {
          201: z.object({
            checkInId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const checkInAlreadyExists = await prisma.checkIn.findUnique({
        where: { attendeeId },
      });

      if (checkInAlreadyExists) {
        throw new CheckInAlreadyExistsError(attendeeId.toString());
      }

      const attendee = await prisma.attendee.findUnique({
        where: { id: attendeeId },
      });

      if (!attendee) {
        throw new AttendeeNotFoundError(attendeeId.toString());
      }

      const checkIn = await prisma.checkIn.create({ data: { attendeeId } });

      return reply.status(201).send({ checkInId: checkIn.id });
    }
  );
}
