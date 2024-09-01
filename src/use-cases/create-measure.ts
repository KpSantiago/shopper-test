import { MeasureRepository } from "../repositories/measure-repository";
import { MeasurementProvider } from "../providers/measurement-provider";
import { MeasureAlreadyExistsError } from "./@errors/measure-already-exists-error";
import { MeasureType } from "../@types/MeasureType";

interface CreateMeasureUseCaseRequest {
    image_name: string;
    measure_datetime?: Date | null;
    measure_type: MeasureType;
    customer_code: string;
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

    async execute({ measure_datetime, measure_type, image_name, customer_code }: CreateMeasureUseCaseRequest): Promise<CreateMeasureUseCaseResponse> {
        if (!measure_datetime) {
            measure_datetime = new Date();
        }

        const alreadyHasAMeasure = await this.measureRepository.findMeasureByTypeAndDate(measure_type, measure_datetime);

        if (alreadyHasAMeasure) {
            throw new MeasureAlreadyExistsError("Já existe uma leitura para este tipo no mês atual");
        }

        const getMeasureValue = await this.measurementProvider.getMeasure(image_name, measure_type);

        const { image_url, measure_uuid, measure_value } = await this.measureRepository.create({
            has_confirmed: false,
            measure_datetime,
            measure_type,
            image_url: `http://localhost:3333/images/${image_name}`,
            measure_value: getMeasureValue,
            customer_code
        });


        return {
            measure: {
                image_url,
                measure_uuid,
                measure_value
            }
        };
    }
}