import app from "../app";
import request from "supertest";
import { PrismaFakeEntityFactory } from "../../../test/factories/prisma/prisma-fake-entity-factory";

describe("[GET] /attendees/:attendeeId/badge", () => {
  let prismaFakeEntityFactory: PrismaFakeEntityFactory;

  beforeAll(async () => {
    await app.ready();
    prismaFakeEntityFactory = new PrismaFakeEntityFactory();
  });

  afterAll(async () => {
    await app.close();
    await prismaFakeEntityFactory.disconnect();
  });

  it("Should be able to attendee badge", async () => {
    const event = await prismaFakeEntityFactory.makeEvent();
    const attendee = await prismaFakeEntityFactory.makeAttendee({
      eventId: event.id,
    });

    const response = await request(app.server).get(
      `/attendees/${attendee.id.toString()}/badge`
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        badge: expect.any(Object),
      })
    );
  });
});
