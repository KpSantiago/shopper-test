import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { errorDetector } from "../../utils/errorDetector";
import { makeFetchCustomerMeasuresUseCase } from "../../use-cases/@factories/make-fetch-customer-measures-use-case";

export async function fetchCustomerMeasures(request: FastifyRequest, reply: FastifyReply) {
    const routeParamsSchema = z.object({
        customer_code: z.string({ message: "customer_code é obrigatório" })
    });

    const queryParamsSchema = z.object({
        measure_type: z.enum(["WATER", "GAS", "gas", "water"], { message: "Tipo de medição não permitida" }).optional()
    });

    const { customer_code } = routeParamsSchema.parse(request.params);
    const { measure_type } = queryParamsSchema.parse(request.query);

    try {
        const fetchCustomerMeasuresUseCase = makeFetchCustomerMeasuresUseCase();

        const response = await fetchCustomerMeasuresUseCase.execute({
            customer_code,
            query: measure_type?.toUpperCase() as "WATER" | "GAS"
        });

        return reply.status(200).send({
            customer_code: response.customer_code,
            measures: response.measures
        });

    } catch (err) {
        const error = errorDetector(err);
        const { message } = err as Error;
        return reply.status(error!.code).send({
            error_code: error!.type,
            error_description: message
        })
    }
}   