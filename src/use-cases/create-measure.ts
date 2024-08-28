import { MeasureRepository } from "../repositories/measure-repository";

interface CreateMeasureUseCaseRequest {
    image_url: string;
    measure_datetime?: Date | null;
    measure_type: "WATER" | "GAS";
    measure_value: number
}

interface CreateMeasureUseCaseResponse {
    measure: {
        measure_uuid: string;
        image_url: string;
        measure_value: number;
    }
}

export class CreateMeasureUseCase {
    constructor(private measureRepository: MeasureRepository) { }

    async execute({ measure_datetime, measure_type, image_url, measure_value }: CreateMeasureUseCaseRequest): Promise<CreateMeasureUseCaseResponse> {
        if (!measure_datetime) {
            measure_datetime = new Date();
        }

        const alreadyHasAMeasure = await this.measureRepository.findMeasureByTypeAndDate(measure_type, measure_datetime);

        if (alreadyHasAMeasure) {
            throw new Error("Já existe uma leitura para este tipo no mês atual");
        }

        const measure = await this.measureRepository.create({
            has_confirmed: false,
            measure_datetime,
            measure_type,
            image_url,
            measure_value
        });

        return { measure };
    }
}