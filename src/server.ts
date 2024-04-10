import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = fastify();

const prisma = new PrismaClient({
  log: ["query"],
});

app.post("/events", async (request, reply) => {
  const requestBodySchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  });

  const { title, details, maximumAttendees } = requestBodySchema.parse(
    request.body
  );

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug: new Date().toISOString(), // temporary fix
    },
  });

  reply.status(201).send({ eventId: event.id });
});

app.listen({ port: 3000 }).then(() => {
  console.log(`HTTP server is running on port ${3000}`);
});
