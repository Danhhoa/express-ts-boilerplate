import { DEFAULT_PAGE_SIZE } from '@/constants';
import { NextFunction, Response } from 'express';
import { BaseMiddleware } from './base';

export class QueryMiddleware extends BaseMiddleware {
    async use(req: any, res: Response, next: NextFunction) {
        const page = parseInt(req.query['page'] || 1);
        const limit = parseInt(req.query['limit'] || DEFAULT_PAGE_SIZE);
        const offset = (page - 1) * limit;

        const pagination = {
            page: page,
            limit: limit,
            offset: offset,
        };

        req.pagination = pagination;

        req.query = {
            ...req.query,
            ...pagination,
        };

        next();
    }
}
