import { MeasureRepository } from "../repositories/measure-repository";
import { MeasureAlreadyConfirmedError } from "./@errors/measure-already-confirmed-error";
import { MeasureNotFoundError } from "./@errors/measure-not-found-error";

interface ConfirmMeasureValueUseCaseRequest {
    measure_uuid: string;
    confirmed_value: number;
}

interface ConfirmMeasureValueUseCaseResponse {
    success: boolean
}

export class ConfirmMeasureValueUseCase {
    constructor(private measureRepository: MeasureRepository) { }

    async execute({ measure_uuid, confirmed_value }: ConfirmMeasureValueUseCaseRequest): Promise<ConfirmMeasureValueUseCaseResponse> {
        const measure = await this.measureRepository.findMeasureByUUID(measure_uuid);

        if (!measure) {
            throw new MeasureNotFoundError("Leitura não encontrada");
        }

        if (measure.has_confirmed && measure.measure_value == confirmed_value) {
            throw new MeasureAlreadyConfirmedError("Leitura já confirmada");
        }

        measure.has_confirmed = confirmed_value == measure.measure_value ? true : false;

        this.measureRepository.save(measure_uuid, measure);

        return { success: true };
    }
}