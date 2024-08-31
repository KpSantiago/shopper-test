import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { errorDetector } from "../../utils/errorDetector";
import { makeConfirmMeasureValueUseCase } from "../../use-cases/@factories/make-confirm-measure-value-use-case";

export async function confirmMeasureValue(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        measure_uuid: z.string().uuid({ message: "measure_uuid inválido." }),
        confirmed_value: z.number({ message: "confirmed_value inválido" })
    });

    const { confirmed_value, measure_uuid } = bodySchema.parse(request.body);

    try {
        const confirmMeasureValueUseCase = makeConfirmMeasureValueUseCase();

        const { success } = await confirmMeasureValueUseCase.execute({
            confirmed_value,
            measure_uuid
        });

        return reply.status(200).send({
            success
        });

    } catch (err) {
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