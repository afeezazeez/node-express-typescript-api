class ValidationException extends Error {
    public statusCode: number;
    public errors: any[];

    constructor(errors:any, message:string = 'Validation failed', statusCode:number = 422) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export default ValidationException;
