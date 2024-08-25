class AuthenticationException extends Error {
    public statusCode: number;
    constructor(message:string = 'Authentication failed', statusCode:number = 401) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default AuthenticationException;
