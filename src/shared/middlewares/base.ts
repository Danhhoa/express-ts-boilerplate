import { HTTPError } from '@/shared/errors/http.error';
import { NextFunction, Request, Response } from 'express';

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
        return (req: Request, res: Response, next: NextFunction) =>
            this.use
                .bind(this)(req, res, next, option)
                .catch((error: any) => {
                    this.onError(res, error);
                });
    }
    async use(
        req: Request,
        res: Response,
        next: NextFunction,
        option?: any,
    ) {
        next();
    }
}
