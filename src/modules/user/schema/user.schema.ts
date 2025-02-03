import Joi from 'joi/lib';
import { User } from '../user.model';
import { paginationSchema } from '@/shared/schema/pagination.schema';

const validUserFields = Object.keys(User.sampleUser()).filter((field) => field !== 'password');

export const getListUserSchema = Joi.object()
    .keys({
        fields: Joi.array()
            .items(
                Joi.string()
                    .valid(...validUserFields)
                    .error((err) => {
                        err[0].message = `"${err[0].value}" is not allowed`;
                        return err;
                    }),
            )
            .optional(),
    })
    .append(paginationSchema);
