export class ErrorResponseDto<T = any> {
    success: boolean;
    message?: string;
    errors?: T;

    constructor(message: string | null = null, errors?: T) {
        this.success = false;
        if (message) this.message = message;
        if (errors) this.errors = errors;
    }
}
