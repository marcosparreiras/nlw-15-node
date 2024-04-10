import fastify from "fastify";

const app = fastify();

app.post("/events", (request, reply) => {
  console.log(request.body);

  reply.status(201).send({ success: true });
});

app.listen({ port: 3000 }).then(() => {
  console.log(`HTTP server is running on port ${3000}`);
});
