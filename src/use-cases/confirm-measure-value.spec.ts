import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryTestMeasureRepository } from "../repositories/in-memory/measure-repository";
import { ConfirmMeasureValueUseCase } from "./confirm-measure-value";
import { env } from "../env";
import { MeasureAlreadyConfirmedError } from "./@errors/measure-already-confirmed-error";
import { MeasureNotFoundError } from "./@errors/measure-not-found-error";

describe("Create Measure Use Case", { timeout: 10000 }, () => {
    let measureRepository: InMemoryTestMeasureRepository;
    let sut: ConfirmMeasureValueUseCase;

    beforeEach(() => {
        env.NODE_ENV = "test";
        measureRepository = new InMemoryTestMeasureRepository();
        sut = new ConfirmMeasureValueUseCase(measureRepository);
    });

    it("should be able to create a measure", async () => {
        const { measure_uuid } = await measureRepository.create({
            measure_value: 100,
            customer_code: "101010",
            has_confirmed: false,
            image_url: "",
            measure_datetime: new Date(),
            measure_type: "GAS"
        });

        const { success } = await sut.execute({
            measure_uuid,
            confirmed_value: 100,
        });


        expect(success).toBe(true);
        expect(await measureRepository.findMeasureByUUID(measure_uuid)).toEqual(
            expect.objectContaining({
                has_confirmed: true
            })
        );
    });

    it("should not be able to confirme a confimerd measure", async () => {
        const { measure_uuid } = await measureRepository.create({
            measure_value: 100,
            customer_code: "101010",
            has_confirmed: true,
            image_url: "",
            measure_datetime: new Date(),
            measure_type: "GAS"
        })

        await expect(() => sut.execute({
            measure_uuid: measure_uuid,
            confirmed_value: 100
        })).rejects.toBeInstanceOf(MeasureAlreadyConfirmedError);
    });

    it("should not be able to confirme a undefined measure", async () => {
        await expect(() => sut.execute({
            measure_uuid: 'undefined-uuid',
            confirmed_value: 0
        })).rejects.toBeInstanceOf(MeasureNotFoundError);
    });
});             
