import Joi from 'joi';
import { User } from '../user.model';
import { paginationSchema } from '@/shared/schema/pagination.schema';
import { querySchema } from '@/shared/schema/query.schema';

const validUserFields = Object.keys(User.sampleUser()).filter((field) => field !== 'password');

export const getListUserSchema = Joi.object().append(paginationSchema).append(querySchema(validUserFields));
