import { MeasureRepository } from "../repositories/measure-repository";

interface CofirmMeasureValueUseCaseRequest {
    measure_uuid: string;
    confirmed_value: number;
}

interface CofirmMeasureValueUseCaseResponse {
    success: boolean
}

export class CofirmMeasureValueUseCase {
    constructor(private measureRepository: MeasureRepository) { }

    async execute({ measure_uuid, confirmed_value }: CofirmMeasureValueUseCaseRequest): Promise<CofirmMeasureValueUseCaseResponse> {
        const measure = await this.measureRepository.findMeasureByUUID(measure_uuid);

        if (!measure) {
            throw new Error("Leitura não encontrada");
        }

        if (measure.has_confirmed && measure.measure_value == confirmed_value) {
            throw new Error("Leitura já confirmada");
        }

        measure.has_confirmed = confirmed_value == measure.measure_value ? true : false;

        this.measureRepository.save(measure);

        return { success: true };
    }
}