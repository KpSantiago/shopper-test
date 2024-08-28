import { Measure, MeasureType, Prisma } from "@prisma/client";
import { MeasureRepository } from "../measure-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryTestMeasureRepository implements MeasureRepository {
    public items: Measure[] = [];

    async create(data: Prisma.MeasureCreateInput) {
        const item: Measure = {
            ...data,
            measure_datetime: new Date(data.measure_datetime),
            measure_uuid: randomUUID()
        }

        this.items.push(item);

        return item;
    }

    async save(data: Prisma.MeasureUpdateInput) {
        const itemIndex = this.items.findIndex(m => m.measure_uuid == data.measure_uuid);

        this.items[itemIndex] = data as Measure;
    }

    async findMeasureByTypeAndDate(measureType: MeasureType, date: Date) {
        const item = this.items.find(m => {
            const measureDate = dayjs(date);

            const startDate = dayjs(m.measure_datetime).startOf("M");
            const endDate = dayjs(m.measure_datetime).endOf("M");

            let alreadyHasAMeasure = startDate <= measureDate && endDate >= measureDate;

            return m.measure_type == measureType && alreadyHasAMeasure
        });

        if (!item) {
            return null;
        }

        return item;
    }

    async findMeasureByUUID(uuid: string) {
        const item = this.items.find(m => m.measure_uuid == uuid);

        if (!item) {
            return null;
        }

        return item;
    }
}