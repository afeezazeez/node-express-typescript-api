export class ClientErrorException extends Error {
    public statusCode: number;
    constructor(message:string = 'Client Error', statusCode:number = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
