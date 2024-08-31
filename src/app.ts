import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { measuresRoutes } from "./http/controllers/routes";
import { ZodError } from "zod";
import { verifyImageURL } from "./http/middlewares/verify-image-url";
import { env } from "./env";

const app = fastify();

app.register(measuresRoutes);

app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            issues: error.issues.map(i => {
                if (i.code == "invalid_enum_value") {
                    return {
                        error_code: "INVALID_TYPE",
                        error_description: {
                            message: i.message,
                            received: i.received,
                            path: i.path,
                            options: i.options,
                        }
                    };
                }

                return {
                    error_code: "INVALID_DATA",
                    error_description: {
                        message: i.message,
                        path: i.path,
                    }
                };
            })
        });
    }

    if (env.NODE_ENV != "production") {
        console.error(error);
    }

    return reply.status(500).send({ message: "Internal server Error" })
})

app.register(fastifyStatic, {
    root: path.join(__dirname, './images/'),
    prefix: '/images/',
});

// Verify the image URL each 10 days
const TEN_DAYS = 1000 * 60 * 60 * 24 * 10;

setInterval(async () => {
    await verifyImageURL();
}, TEN_DAYS);

export { app }