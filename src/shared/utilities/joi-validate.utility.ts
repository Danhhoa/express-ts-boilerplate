import Joi from 'joi';
import IRequest from '../interfaces/request.interface';
import { Response, NextFunction } from 'express';

export const validateSchema = async (schema: Joi.Schema, data: Object) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    const validateResults = schema.validate(data);
    if (validateResults.error) {
      throw next(validateResults.error);
    }

    next();
  };
};
