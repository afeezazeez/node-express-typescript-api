export class ErrorResponseDto<T = any> {
    success: boolean;
    message?: string;
    error?: T;

    constructor(message: string | null = null, error?: T) {
        this.success = false;
        if (message) this.message = message;
        if (error) this.error = error;
    }
}
