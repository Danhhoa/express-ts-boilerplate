import { IBaseError } from '@/shared/interfaces/error.interface';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

interface IJoiErrorDetail {
    message?: string;
    path?: string;
}

interface IJoiError extends IBaseError {
    isJoi?: boolean;
    // tslint:disable-next-line: prefer-array-literal
    details?: Array<IJoiErrorDetail>;
}

export default (
    err: IJoiError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err.isJoi) {
        const error = {
            code: HttpStatus.BAD_REQUEST,
            message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
            details:
                err.details &&
                err.details.map((err) => ({
                    message: err.message,
                    param: err.path,
                })),
        };
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }

    return next(err);
};
