import { Measure, MeasureType } from "@prisma/client";
import { MeasureRepository } from "../repositories/measure-repository";
import { MeasureNotFoundError } from "./@errors/measure-not-found-error";

interface FetchCustomerMeasuresUseCaseRequest {
    customer_code: string;
    query?: MeasureType;
}

interface FetchCustomerMeasuresUseCaseResponse {
    customer_code: string;
    measures: Measure[];
}

export class FetchCustomerMeasuresUseCase {
    constructor(private measureRepository: MeasureRepository) { }

    async execute({ customer_code, query }: FetchCustomerMeasuresUseCaseRequest): Promise<FetchCustomerMeasuresUseCaseResponse> {
        const measures = await this.measureRepository.findManyMeasuresByCustomerCode(customer_code, query);

        if (measures.length < 1) {
            throw new MeasureNotFoundError("Nenhum registro encontrado");
        }

        return {
            customer_code,
            measures
        }
    }
}