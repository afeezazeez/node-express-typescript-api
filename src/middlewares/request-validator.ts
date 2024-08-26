import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import {ValidationException} from "../exceptions/validation.exception";

export function validateBody<T>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObject = plainToInstance(dtoClass, req.body) as object;

        const errors: ValidationError[] = await validate(dtoObject);

        if (errors.length > 0) {

            const errorMessages: { [key: string]: string[] } = {};

            errors.forEach((error) => {
                if (error.constraints) {
                    errorMessages[error.property] = Object.values(error.constraints);
                }
            });

             const firstField = Object.keys(errorMessages)[0];
            const firstErrorMessage = errorMessages[firstField][0];

            next(new ValidationException(errorMessages, firstErrorMessage));
            return;
        }

        req.body = dtoObject;
        next();
    };
}
