import { Response } from 'express';
import {SuccessResponseDto} from '../../dtos/http-response/success-response.dto';
import {ErrorResponseDto} from '../../dtos/http-response/error-response.dto';

export function sendSuccessResponse<T>(res: Response, data?: T, message: string | null = null, statusCode: number = 200): Response {
    const response = new SuccessResponseDto(message, data);
    return res.status(statusCode).json(response);
}

export function sendErrorResponse<T>(res: Response, error?: T, message: string | null = null, statusCode: number = 500): Response {
    const response = new ErrorResponseDto(message, error);
    return res.status(statusCode).json(response);
}
