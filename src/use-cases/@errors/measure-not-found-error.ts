export class MeasureNotFoundError extends Error {
    static errorCode = 404;
    static type = "MEASURE_NOT_FOUND";
    
    constructor(message: string){
        super(message);
    }
}
