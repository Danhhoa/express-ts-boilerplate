import { HTTPError } from '@/shared/errors/http.error';
import { NextFunction, Response } from 'express';
import IRequest from '../interfaces/request.interface';

export class BaseMiddleware {
    onError(res: Response, error?: HTTPError) {
        const err = error.tupleErrorParams;
        const statusCode = err?.status || err?.code || 500;
        return res.status(statusCode).json({
            success: false,
            error: {
                code: statusCode,
                message: err?.message || 'UNKNOWN ERROR',
                messageCode: err?.messageCode || null,
            },
        });
    }
    run(option?: any) {
        return (req: IRequest, res: Response, next: NextFunction) => {
            try {
                return this.use.bind(this)(req, res, next, option);
            } catch (error) {
                return this.onError(res, error);
            }
        };
    }
    use(req: IRequest, res: Response, next: NextFunction, option?: any): any {
        next();
    }
}
