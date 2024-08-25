export class SuccessResponseDto<T = any> {
    success: boolean;
    message?: string;
    data?: T;

    constructor(message: string | null = null, data?: T) {
        this.success = true;
        if(message) this.message = message;
        if(data)  this.data = data;
    }
}
