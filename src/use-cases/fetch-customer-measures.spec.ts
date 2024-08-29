import { describe, it, beforeEach, expect, afterAll, vi } from "vitest";
import { InMemoryTestMeasureRepository } from "../repositories/in-memory/measure-repository";
import { env } from "../env";
import { FetchCustomerMeasuresUseCase } from "./fetch-customer-measures";
import { MeasureNotFoundError } from "./@errors/measure-not-found-error";

describe("Fetch Customer Measure Use Case", () => {
    let measureRepository: InMemoryTestMeasureRepository;
    let sut: FetchCustomerMeasuresUseCase;

    beforeEach(() => {
        env.NODE_ENV = "test";
        measureRepository = new InMemoryTestMeasureRepository();
        sut = new FetchCustomerMeasuresUseCase(measureRepository);
        vi.useFakeTimers();
    });

    afterAll(async () => {
        vi.useRealTimers();
    })

    it("should be able to fecth measures of a customer by his code", async () => {
        vi.setSystemTime(new Date(2024, 10, 5));

        for (let i = 1; i <= 10; i++) {
            await measureRepository.create({
                customer_code: "my-customer-code",
                has_confirmed: true,
                image_url: "",
                measure_datetime: new Date(),
                measure_type: "GAS",
                measure_value: Number(`${i}00`)
            });

            vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 30); //30 days
        }

        const { customer_code, measures } = await sut.execute({
            customer_code: "my-customer-code",
        });

        expect(customer_code).toEqual("my-customer-code");
        expect(measures).toHaveLength(10);
    });

    it("should not be able to fetch measures of a customer_code", async () => {
        await expect(() => sut.execute({
            customer_code: 'my-customer-code',
        })).rejects.toBeInstanceOf(MeasureNotFoundError);
    })
});             
