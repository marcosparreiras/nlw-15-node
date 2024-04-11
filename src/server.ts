import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { createEventAttendee } from "./routes/create-event-attendee";

const app = fastify();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(createEvent);
app.register(createEventAttendee);

app.listen({ port: 3000 }).then(() => {
  console.log(`HTTP server is running on port ${3000}`);
});
