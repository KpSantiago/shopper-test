import { PrismaMeasureRepository } from "../../repositories/prisma/prisma-measure-repository";
import { FetchCustomerMeasuresUseCase } from "../fetch-customer-measures";

export function makeFetchCustomerMeasuresUseCase() {
    const measureRepository = new PrismaMeasureRepository();
    const fetchCustomerMeasuresUseCase = new FetchCustomerMeasuresUseCase(measureRepository);

    return fetchCustomerMeasuresUseCase;
}