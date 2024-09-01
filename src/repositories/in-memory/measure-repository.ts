import { Measure, Prisma } from "@prisma/client";
import { MeasureRepository } from "../measure-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { MeasureType } from "../../@types/MeasureType";

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

    async save(measure_uuid: string, data: Prisma.MeasureUpdateInput) {
        const itemIndex = this.items.findIndex(m => m.measure_uuid == measure_uuid);

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

    async findManyMeasuresByCustomerCode(code: string, query?: MeasureType) {
        let items = this.items.filter(m => m.customer_code == code);

        if (query) {
            items = items.filter(m => m.measure_type == query);
        }

        return items;
    }
}