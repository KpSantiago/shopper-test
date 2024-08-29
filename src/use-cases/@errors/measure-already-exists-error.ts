export class MeasureAlreadyExistsError extends Error {
    static errorCode = 409;
    static type = "DOUBLE_REPORT";

    constructor(message: string) {
        super(message);
    }
}