import { Measure, MeasureType, Prisma } from "@prisma/client";

export interface MeasureRepository {
    create(measure: Prisma.MeasureCreateInput): Promise<Measure>;
    findMeasureByTypeAndDate(measureType: MeasureType, date: Date): Promise<Measure | null>
}