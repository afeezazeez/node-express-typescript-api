import { Response } from 'express';
import {SuccessResponseDto} from '../../dtos/http-response/success-response.dto';
import {ErrorResponseDto} from '../../dtos/http-response/error-response.dto';
import {ResponseStatus} from "../../enums/http-status-codes";

export function sendSuccessResponse<T>(res: Response, data?: T, message: string | null = null, statusCode: number = ResponseStatus.OK): Response {
    const response = new SuccessResponseDto(message, data);
    return res.status(statusCode).json(response);
}

export function sendErrorResponse<T>(res: Response, error?: T, message: string | null = null, statusCode: number = ResponseStatus.INTERNAL_SERVER): Response {
    const response = new ErrorResponseDto(message, error);
    return res.status(statusCode).json(response);
}
