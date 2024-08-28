import { MeasureType } from "@prisma/client";
import { MeasureRepository } from "../repositories/measure-repository";
import { MeasurementProvider } from "../providers/measurement-provider";
import { convertToImage } from "../utils/convert-to-image";

interface CreateMeasureUseCaseRequest {
    image_base64: string;
    measure_datetime?: Date | null;
    measure_type: MeasureType;
}

interface CreateMeasureUseCaseResponse {
    measure: {
        measure_uuid: string;
        image_url: string;
        measure_value: number;
    }
}

export class CreateMeasureUseCase {
    constructor(private measureRepository: MeasureRepository, private measurementProvider: MeasurementProvider) { }

    async execute({ measure_datetime, measure_type, image_base64 }: CreateMeasureUseCaseRequest): Promise<CreateMeasureUseCaseResponse> {
        if (!measure_datetime) {
            measure_datetime = new Date();
        }

        const alreadyHasAMeasure = await this.measureRepository.findMeasureByTypeAndDate(measure_type, measure_datetime);

        if (alreadyHasAMeasure) {
            throw new Error("Já existe uma leitura para este tipo no mês atual");
        }

        const image = convertToImage(image_base64);

        const getMeasureValue = await this.measurementProvider.getMeasure(image, measure_type);

        const measure = await this.measureRepository.create({
            has_confirmed: false,
            measure_datetime,
            measure_type,
            image_url: `http://localhost:3333/images/${image}`,
            measure_value: getMeasureValue
        });

        return { measure };
    }
}