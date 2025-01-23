export const getItemParams: any[] = [
    {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
            type: 'string',
            format: 'uuid',
        },
    },
];

export const updateItemSchema = {
    require: true,
    content: {
        'application/json': {
            schema: {
                type: 'object',
            },
        },
    },
};

export const deleteItemParams: any[] = [
    {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
            type: 'string',
            format: 'uuid',
        },
    },
];

export const delete_item_params_v2: any[] = [
    {
        name: 'items',
        in: 'query',
        required: true,
        schema: {
            type: 'string',
            default: `[]`,
        },
    },
];

export const responseSchema = {
    content: {
        'application/json': {
            schema: {
                type: 'object',
            },
        },
    },
};
