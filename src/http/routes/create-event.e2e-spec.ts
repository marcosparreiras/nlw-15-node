import app from "../app";
import request from "supertest";
import { PrismaFakeEntityFactory } from "../../../test/factories/prisma/prisma-fake-entity-factory";

describe("[POST] /events", () => {
  let prismaFakeEntityFactory: PrismaFakeEntityFactory;
  beforeAll(async () => {
    await app.ready();
    prismaFakeEntityFactory = new PrismaFakeEntityFactory();
  });

  afterAll(async () => {
    await app.close();
    await prismaFakeEntityFactory.disconnect();
  });

  it("Should be able to create an event", async () => {
    const response = await request(app.server).post("/events").send({
      title: "My Event",
      details: "My event details...",
      maximumAttendees: 25,
    });

    expect(response.status).toEqual(201);
    const eventOnRepository =
      await prismaFakeEntityFactory.prisma.event.findUnique({
        where: { slug: "my-event" },
      });

    expect(eventOnRepository).toEqual(
      expect.objectContaining({
        title: "My Event",
        details: "My event details...",
        maximumAttendees: 25,
      })
    );
  });
});
