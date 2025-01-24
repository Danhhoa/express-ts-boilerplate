import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http.error';

function globalErrorHandler(error: HTTPError | Error, request: Request, response: Response, next: NextFunction) {
    if (error instanceof HTTPError) {
        const errorDetails = error.tupleErrorParams;

        return response.status(errorDetails.code).send({
            success: false,
            error: errorDetails,
        });
    }

    return response.status(500).send({
        success: false,
        error: {
            message: error?.message || 'UNEXPECTED',
        },
    });
}

export default globalErrorHandler;
