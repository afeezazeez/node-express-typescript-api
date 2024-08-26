import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/http-response/response-handlers';
import {ClientErrorException} from '../exceptions/client.error.exception';
import {ValidationException} from '../exceptions/validation.exception';
import {AuthenticationException} from '../exceptions/authentication.exception';
import Logger from '../utils/logger/wintson.logger';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ClientErrorException) {
        return sendErrorResponse(res, null, err.message, err.statusCode);
    }

    if (err instanceof ValidationException) {
        return sendErrorResponse(res, err.errors, err.message, err.statusCode);
    }

    if (err instanceof AuthenticationException) {
        return sendErrorResponse(res, null, err.message, err.statusCode);
    }

    Logger.error(err);

    return sendErrorResponse(res, null, 'Internal Server Error', 500);
}

export default errorHandler;
