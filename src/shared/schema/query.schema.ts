import Joi from 'joi';

export const querySchema = <T>(validFields: Array<keyof T>) => {
    return {
        fields: Joi.array()
            .items(
                Joi.string()
                    .valid('*', ...validFields)
                    .error((err) => {
                        err[0].message = `"${err[0].value}" is not allowed`;
                        return err;
                    }),
            )
            .optional(),
        withDeleted: Joi.boolean().optional(),
    };
};
