import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import fs from "fs";
import { makeCreateMeasureUseCase } from "../../use-cases/@factories/make-create-measure-use-case";
import { errorDetector } from "../../utils/errorDetector";
import { convertToImage } from "../../utils/convert-to-image";
import path from "path";

export async function createMeasure(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        customer_code: z.string({ message: "customer_code é obrigatório" }).min(1, { message: "O campo deve possuir no mínimo 1 caractere." }),
        image: z.string().refine((data) => {
            return /^data:image\/(png|jpg|jpeg);base64,[A-Za-z0-9\+/=]/.test(data);
        }, {
            message: "A string não é uma imagem Base64 válida."
        }),
        measure_datetime: z.string().optional().nullable(),
        measure_type: z.enum(["WATER", "GAS"], { message: "Tipo de medição não permitida." })
    });

    const { customer_code, image, measure_datetime, measure_type } = bodySchema.parse(request.body);

    const imageName = convertToImage(image);

    try {
        const createMeasureUseCase = makeCreateMeasureUseCase();

        const { measure } = await createMeasureUseCase.execute({
            measure_type,
            customer_code,
            image_name: imageName,
            measure_datetime: measure_datetime ? new Date(measure_datetime) : null,
        });

        return reply.status(201).send({
            measure
        });

    } catch (err) {
        fs.unlinkSync(path.join(__dirname, `./images/${imageName}`))
        const error = errorDetector(err);
        if (error) {
            const { message } = err as Error;
            return reply.status(error!.code).send({
                error_code: error!.type,
                error_description: message
            })
        }
    }
}