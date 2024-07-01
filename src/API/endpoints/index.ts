import { Requestor } from "../requestor";
import { IError } from "./type";

export abstract class Base {
    protected readonly requestor: Requestor;
    constructor(requestor: Requestor) {
        this.requestor = requestor;
    }

    protected isSuccessData<T extends {} | IError>(
        payload: T
    ): payload is Exclude<T, IError> {
        return !("error" in payload);
    }
}
