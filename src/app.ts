import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { measuresRoutes } from "./http/controllers/routes";
import { ZodError } from "zod";

const app = fastify();

app.register(measuresRoutes);

app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            issues: error.issues.map(i => {
                if (i.code == "invalid_enum_value") {
                    return {
                        error_code: "INVALID_TYPE",
                        message: i.message,
                        received: i.received,
                        path: i.path,
                        options: i.options,
                    };
                }

                return {
                    error_code: "INVALID_DATA",
                    message: i.message,
                    path: i.path,
                };
            })
        });
    }
})

app.register(fastifyStatic, {
    root: path.join(__dirname, './images/'),
    prefix: '/images/',
});

export { app }