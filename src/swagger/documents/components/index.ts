export const components = {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT Authorization header',
        },
    },
    schemas: {
        GeneralError: {
            type: 'object',
            properties: {
                code: {
                    type: 'integer',
                    format: 'int32',
                },
                message: {
                    type: 'string',
                },
            },
        },
    },
};
