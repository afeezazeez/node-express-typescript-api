import {ResponseStatus} from "../enums/http-status-codes";
export class AuthenticationException extends Error {
    public statusCode: number;
    constructor(message:string = 'Authentication failed', statusCode:number = ResponseStatus.UNAUTHORISED) {
        super(message);
        this.statusCode = statusCode;
    }
}

