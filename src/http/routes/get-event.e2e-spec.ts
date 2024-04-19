import app from "../app";
import request from "supertest";
import { PrismaFakeEntityFactory } from "../../../test/factories/prisma/prisma-fake-entity-factory";

describe("[GET] /events/:eventId", () => {
  let prismaFakeEntityFactory: PrismaFakeEntityFactory;

  beforeAll(async () => {
    await app.ready();
    prismaFakeEntityFactory = new PrismaFakeEntityFactory();
  });

  afterAll(async () => {
    await app.close();
    await prismaFakeEntityFactory.disconnect();
  });

  it("Should be able to get an event by id", async () => {
    const event = await prismaFakeEntityFactory.makeEvent();
    const result = await request(app.server)
      .get(`/events/${event.id.toString()}`)
      .send();

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(
      expect.objectContaining({
        event: expect.any(Object),
      })
    );
  });
});
