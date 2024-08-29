import { MeasureAlreadyConfirmedError } from "../use-cases/@errors/measure-already-confirmed-error";
import { MeasureAlreadyExistsError } from "../use-cases/@errors/measure-already-exists-error";
import { MeasureNotFoundError } from "../use-cases/@errors/measure-not-found-error";

export function errorDetector(error: any) {
    const errorArray = [
        {
            exception: MeasureAlreadyConfirmedError,
            code: MeasureAlreadyConfirmedError.errorCode,
            type: MeasureAlreadyConfirmedError.type
        },
        {
            exception: MeasureAlreadyExistsError,
            code: MeasureAlreadyExistsError.errorCode,
            type: MeasureAlreadyExistsError.type
        },
        {
            exception: MeasureNotFoundError,
            code: MeasureNotFoundError.errorCode,
            type: MeasureNotFoundError.type
        }]

    const err = errorArray.find(e => error instanceof e.exception);

    return err;
}