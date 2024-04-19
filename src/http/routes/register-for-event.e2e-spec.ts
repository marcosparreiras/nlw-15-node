import app from "../app";
import request from "supertest";
import { PrismaFakeEntityFactory } from "../../../test/factories/prisma/prisma-fake-entity-factory";

describe("[POST] /events/:eventId/attendees", () => {
  let prismaFakeEntityFactory: PrismaFakeEntityFactory;

  beforeAll(async () => {
    prismaFakeEntityFactory = new PrismaFakeEntityFactory();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prismaFakeEntityFactory.disconnect();
  });

  it("Should be able to register a new event attendee", async () => {
    const event = await prismaFakeEntityFactory.makeEvent();

    const response = await request(app.server)
      .post(`/events/${event.id.toString()}/attendees`)
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        attendeeId: expect.any(String),
      })
    );

    const attendeeOnRepository =
      await prismaFakeEntityFactory.prisma.attendee.findUnique({
        where: { id: response.body.attendeeId },
      });
    expect(attendeeOnRepository).toBeTruthy();
  });
});
