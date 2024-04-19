import app from "../app";
import request from "supertest";
import { PrismaFakeEntityFactory } from "../../../test/factories/prisma/prisma-fake-entity-factory";

describe("[GET] /attendees/:attendeeId/checkIn", () => {
  let prismaFakeEntityFactory: PrismaFakeEntityFactory;
  beforeAll(async () => {
    await app.ready();
    prismaFakeEntityFactory = new PrismaFakeEntityFactory();
  });

  afterAll(async () => {
    await app.close();
    await prismaFakeEntityFactory.disconnect();
  });

  it("Should be able to check-in an attendee", async () => {
    const event = await prismaFakeEntityFactory.makeEvent();
    const attendee = await prismaFakeEntityFactory.makeAttendee({
      eventId: event.id,
      checkInAt: null,
    });

    const response = await request(app.server).get(
      `/attendees/${attendee.id.toString()}/checkIn`
    );

    expect(response.status).toEqual(201);

    const attendeeOnRepository =
      await prismaFakeEntityFactory.prisma.attendee.findUnique({
        where: { id: attendee.id.toString() },
      });

    expect(attendeeOnRepository?.checkInAt).toBeTruthy();
  });
});
