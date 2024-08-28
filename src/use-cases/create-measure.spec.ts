import { describe, it, beforeEach, expect, afterAll } from "vitest";
import { InMemoryTestMeasureRepository } from "../repositories/in-memory/measure-repository";
import { CreateMeasureUseCase } from "./create-measure";

describe("Create Measure Use Case", () => {
    let measureRepository: InMemoryTestMeasureRepository;
    let sut: CreateMeasureUseCase;

    beforeEach(() => {
        measureRepository = new InMemoryTestMeasureRepository();
        sut = new CreateMeasureUseCase(measureRepository);
    });

    afterAll(async () => {
        // const files = await fs.readdirSync(path.dirname("") + "/src/images");
        // const deleteFilePromises = files.map(file => fs.unlinkSync(path.join(path.dirname("") + "/src/images", file)));
        // await Promise.all(deleteFilePromises);
    })

    it("should be able to create a measure", async () => {
        const { measure } = await sut.execute({
            image_url: "",
            measure_value: 0,
            measure_type: 'WATER',
        });

        expect(measureRepository.items).toHaveLength(1);
        expect(measure).toEqual(
            expect.objectContaining({
                measure_type: 'WATER'
            })
        );
    });

    it("should not be able to create a repeated measure", async () => {
        await sut.execute({
            image_url: '',
            measure_value: 0,
            measure_type: 'WATER',
        });

        await expect(() => sut.execute({
            image_url: '',
            measure_value: 0,
            measure_type: 'WATER',
        })).rejects.toBeInstanceOf(Error);
        expect(measureRepository.items).toHaveLength(1);
    })
});             
