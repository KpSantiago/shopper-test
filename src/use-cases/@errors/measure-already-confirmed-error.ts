export class MeasureAlreadyConfirmedError extends Error {
    static errorCode = 409;
    static type = "CONFIRMATION_DUPLICATE";

    constructor(message: string) {
        super(message);
    }
}