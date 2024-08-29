import { PrismaMeasureRepository } from "../../repositories/prisma/prisma-measure-repository";
import { ConfirmMeasureValueUseCase } from "../confirm-measure-value";

export function makeConfirmMeasureValueUseCase() {
    const measureRepository = new PrismaMeasureRepository();
    const confirmMeasureValueUseCase = new ConfirmMeasureValueUseCase(measureRepository);

    return confirmMeasureValueUseCase;
}