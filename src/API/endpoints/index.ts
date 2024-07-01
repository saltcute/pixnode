import { Requestor } from "../requestor";
import { IError } from "./type";

export abstract class Base {
    protected readonly requestor: Requestor;
    constructor(requestor: Requestor) {
        this.requestor = requestor;
    }
}
