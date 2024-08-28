export interface MeasurementProvider {
    getMeasure(image: string, measureType: string): Promise<number>
}