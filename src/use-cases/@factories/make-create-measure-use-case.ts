import { GeminiMeasurementProvider } from "../../providers/gemini/measurement-provider";
import { PrismaMeasureRepository } from "../../repositories/prisma/prisma-measure-repository";
import { CreateMeasureUseCase } from "../create-measure";

export function makeCreateMeasureUseCase() {
    const measureRepository = new PrismaMeasureRepository();
    const measureProvider = new GeminiMeasurementProvider();
    const createMeasureUseCase = new CreateMeasureUseCase(measureRepository, measureProvider);

    return createMeasureUseCase;
}