import { HTTPError } from '@/shared/errors/http.error';
import { NextFunction, Response } from 'express';
import IRequest from '../interfaces/request.interface';

export class BaseMiddleware {
    onError(res: Response, error?: HTTPError) {
        const err = error.tupleErrorParams;
        res.status(err.status || err.code).json({
            code: err.code,
            message: err.message,
            messageCode: err?.messageCode || null,
        });
    }
    run(option?: any) {
        return (req: IRequest, res: Response, next: NextFunction) =>
            this.use
                .bind(this)(req, res, next, option)
                .catch((error: any) => {
                    this.onError(res, error);
                });
    }
    use(req: IRequest, res: Response, next: NextFunction, option?: any) {
        next();
    }
}
