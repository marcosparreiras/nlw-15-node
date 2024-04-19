import app from "../app";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

describe("[POST] /events", () => {
  let prisma: PrismaClient<never, DefaultArgs>;
  beforeAll(async () => {
    await app.ready();
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it("Should be able to create an event", async () => {
    const response = await request(app.server).post("/events").send({
      title: "My Event",
      details: "My event details...",
      maximumAttendees: 25,
    });

    expect(response.status).toEqual(201);
    const eventOnRepository = await prisma.event.findUnique({
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
