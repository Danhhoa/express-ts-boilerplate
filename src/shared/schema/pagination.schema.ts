import Joi from 'joi/lib';

export const paginationSchema = {
    page: Joi.number().min(0).optional(),
    limit: Joi.number().min(0).optional(),
    offset: Joi.number().min(0).optional(),
};
