import { DEFAULT_PAGE_SIZE } from '@/shared/constants';
import { NextFunction, Response } from 'express';
import { BaseMiddleware } from './base';

class QueryMiddleware extends BaseMiddleware {
    async use(req: any, res: Response, next: NextFunction) {
        // add prop pagination for req.query
        // can access pagination via req.pagination
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

        if (req.query?.fields) {
            let fields = req.query.fields;

            // if include * => remove all others
            if (fields.includes('*')) {
                fields = ['*'];
            }

            req.query = {
                ...req.query,
                fields,
            };
        }
        next();
    }
}

export const queryMiddleware = new QueryMiddleware();
