import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryTestMeasureRepository } from "../repositories/in-memory/measure-repository";
import { CreateMeasureUseCase } from "./create-measure";
import { GeminiMeasurementProvider } from "../providers/gemini/measurement-provider";
import { env } from "../env";
import { MeasureAlreadyExistsError } from "./@errors/measure-already-exists-error";

describe("Create Measure Use Case", { timeout: 10000 }, () => {
    let measureRepository: InMemoryTestMeasureRepository;
    let measureProvider: GeminiMeasurementProvider;
    let sut: CreateMeasureUseCase;

    beforeEach(() => {
        env.NODE_ENV = "test";
        measureRepository = new InMemoryTestMeasureRepository();
        measureProvider = new GeminiMeasurementProvider();
        sut = new CreateMeasureUseCase(measureRepository, measureProvider);
    });

    it("should be able to create a measure", async () => {
        const { measure } = await sut.execute({
            image_base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASYAAADcCAYAAADdugwRAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALuSURBVHhe7dbBCQAxCABBk/57zgVyRexjBkQrWFzXGYCQ/W+ADGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIEeYgBxhAnKECcgRJiBHmIAcYQJyhAnIESYgR5iAHGECcoQJyBEmIGfdOe8EaPAxATnCBOQIE5AjTECOMAE5wgTkCBOQI0xAjjABOcIE5AgTkCNMQI4wATnCBOQIE5AjTECOMAE5wgTkCBOQI0xAjjABOcIE5AgTkCNMQI4wATnCBOQIE5AjTECOMAE5wgTkCBOQI0xAjjABOcIExMx8rmwDuKybrtgAAAAASUVORK5CYII=",
            measure_type: 'WATER',
            customer_code: "customer-1"
        });

        expect(measureRepository.items).toHaveLength(1);
        expect(measure).toEqual(
            expect.objectContaining({
                measure_type: 'WATER',
                image_url: expect.stringContaining("http://localhost:3333/images/")
            })
        );
    });

    it("should not be able to create a repeated measure", async () => {
        await sut.execute({
            image_base64: '',
            measure_type: 'WATER',
            customer_code: "customer-1"
        });

        await expect(() => sut.execute({
            image_base64: '',
            measure_type: 'WATER',
            customer_code: "customer-1"
        })).rejects.toBeInstanceOf(MeasureAlreadyExistsError);
        expect(measureRepository.items).toHaveLength(1);
    })
});             
