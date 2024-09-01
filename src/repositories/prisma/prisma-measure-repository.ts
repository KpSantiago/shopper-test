import { Prisma, Measure } from "@prisma/client";
import { MeasureRepository } from "../measure-repository";
import { prisma } from "../../lib/prisma";
import dayjs from "dayjs";
import { MeasureType } from "../../@types/MeasureType";

export class PrismaMeasureRepository implements MeasureRepository {
    async create(measure: Prisma.MeasureCreateInput): Promise<Measure> {
        const data = await prisma.measure.create({
            data: measure,
        });

        return data;
    }

    async save(measure_uuid: string, measure: Prisma.MeasureUncheckedUpdateInput): Promise<void> {
        await prisma.measure.update({
            data: measure,
            where: {
                measure_uuid
            }
        })
    }

    async findMeasureByTypeAndDate(measureType: MeasureType, date: Date): Promise<Measure | null> {
        const measureDate = dayjs(date);
        const startDate = measureDate.startOf("M").toISOString();
        const endDate = measureDate.endOf("M").toISOString();

        const data = await prisma.measure.findFirst({
            where: {
                measure_type: measureType,
                measure_datetime: {
                    gte: startDate,
                    lte: endDate
                }
            }

        });

        return data;
    }

    async findMeasureByUUID(uuid: string): Promise<Measure | null> {
        const data = await prisma.measure.findUnique({
            where: {
                measure_uuid: uuid
            }
        });

        return data;
    }

    async findManyMeasuresByCustomerCode(code: string, query?: MeasureType): Promise<Measure[]> {
        const data = await prisma.measure.findMany({
            where: {
                customer_code: code,
                measure_type: query
            }
        });

        return data;
    }


}