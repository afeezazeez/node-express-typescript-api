import {ResponseStatus} from "../enums/http-status-codes";

export class RateLimitException extends Error {
    public statusCode: number;
    constructor(message: string, statusCode:number = ResponseStatus.TOO_MANY_REQUESTS) {
        super(message);
        this.statusCode = statusCode;
    }
}
