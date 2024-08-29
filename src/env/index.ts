import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
    PORT: z.coerce.number().default(3333),
    GEMINI_API_KEY: z.string().optional()
});

const _env = envSchema.safeParse(process.env);

if (_env.success == false) {
    console.error("Unexpected error with environment variables at env file", _env.error.format());
    throw new Error();
}

export const env = _env.data;