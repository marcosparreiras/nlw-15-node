import app from "../app";
import request from "supertest";
import { PrismaFakeEntityFactory } from "../../../test/factories/prisma/prisma-fake-entity-factory";

describe("[GET] /events/:eventId/attendees", () => {
  let prismaFakeEntityFactory: PrismaFakeEntityFactory;
  beforeAll(async () => {
    await app.ready();
    prismaFakeEntityFactory = new PrismaFakeEntityFactory();
  });

  afterAll(async () => {
    await app.close();
    await prismaFakeEntityFactory.disconnect();
  });

  it("Should be able to fetch an event attendees", async () => {
    const events = await Promise.all([
      await prismaFakeEntityFactory.makeEvent(),
      await prismaFakeEntityFactory.makeEvent(),
    ]);

    await Promise.all([
      prismaFakeEntityFactory.makeAttendee({ eventId: events[0].id }),
      prismaFakeEntityFactory.makeAttendee({ eventId: events[0].id }),
      prismaFakeEntityFactory.makeAttendee({ eventId: events[1].id }),
    ]);

    const response = await request(app.server)
      .get(`/events/${events[0].id.toString()}/attendees`)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.attendees).toHaveLength(2);
  });
});
