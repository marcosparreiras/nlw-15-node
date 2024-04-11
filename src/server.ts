import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { env } from "./env";

const app = fastify();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(createEvent);
app.register(registerForEvent);

app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server is running on port ${env.PORT}`);
});
