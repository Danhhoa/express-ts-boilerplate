import { Request, Response } from 'express';

import logger from '@/shared/configs/logger.config';
import { HTTPError } from '@/shared/errors/http.error';
import { IBaseError } from '@/shared/interfaces/error.interface';
import { StatusCodes } from 'http-status-codes';
import * as _ from 'lodash';
import { IPaginationReq } from '../interfaces/common.interface';

export class BaseRouter {
    onError(res: Response, error: any) {
        console.error(error);
        logger.error(error?.message);

        if (error instanceof HTTPError) {
            return res.status(error.tupleErrorParams.code).json({
                success: false,
                error: error.tupleErrorParams,
            });
        }

        if (error.isJoi) {
            const errorRes = {
                code: StatusCodes.BAD_REQUEST,
                message: error.details && error.details[0].message,
            };
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: errorRes });
        }

        return res.status(500).json({
            success: false,
            error: {
                message: 'An unexpected error occured',
            },
        });
    }

    onSuccess = (res: Response, data: any, status: number = 200) => {
        return res.status(status).json({ success: true, code: status, data });
    };

    onSuccessAsList(res: Response, data: any = [], pagination?: IPaginationReq) {
        if (!pagination) {
            return res.json({
                success: true,
                code: StatusCodes.OK,
                data,
            });
        }

        const total = data.count > 0 ? data.count : 0;
        const page = _.floor(pagination.offset / pagination.limit) + 1;

        return res.json({
            success: true,
            code: StatusCodes.OK,
            data,
            pagination: {
                total: total,
                currentPage: page,
                nextPage: page + 1,
                prevPage: page - 1,
                limit: Number(pagination.limit),
            },
        });
    }

    route<T>(func: (req: Request, rep: Response) => Promise<T>) {
        return (req: Request, res: Response) =>
            func
                .bind(this)(req, res)
                .catch((error: IBaseError) => {
                    return this.onError(res, error);
                });
    }
}
