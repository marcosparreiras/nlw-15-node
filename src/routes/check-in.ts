import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { DomainError } from "../errors/domain-error";
import { prisma } from "../libs/prisma";
import { AttendeeNotFoundError } from "../errors/attendee-not-found-error";
import { CheckInAlreadyExistsError } from "../errors/check-in-already-exists-error";

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
          400: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
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
