import { Measure, MeasureType, Prisma } from "@prisma/client";

export interface MeasureRepository {
    create(measure: Prisma.MeasureCreateInput): Promise<Measure>;
    save(measure_uuid: string, measure: Prisma.MeasureUncheckedUpdateInput): Promise<void>;
    findMeasureByTypeAndDate(measureType: MeasureType, date: Date): Promise<Measure | null>
    findMeasureByUUID(uuid: string): Promise<Measure | null>
    findManyMeasuresByCustomerCode(code: string, query?: MeasureType): Promise<Measure[]>
}