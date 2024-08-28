import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";

const app = fastify();

app.register(fastifyStatic, {
    root: path.join(__dirname, './images/'),
    prefix: '/images/',
});

export { app }