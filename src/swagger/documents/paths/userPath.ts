import {
    deleteItemParams,
    getItemParams,
    responseSchema,
} from '@/swagger/common';

const tagName = 'user';
export const qnaPath = {
    tag_name: tagName,
    paths: {
        '/user': {
            get: {
                summary: '[USER_001][Get list user]',
                tags: [tagName],
                parameters: [
                    {
                        name: 'name',
                        in: 'query',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                ],
                responses: responseSchema,
            },
            post: {
                summary: '[USER_003][Create user]',
                tags: ['user'],
                description: 'create user',
                security: [
                    {
                        bearerAuth: [] as any[],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                // '$ref': '#/components/schemas/qna'
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: responseSchema,
            },
        },
        '/user/{id}': {
            //get one item
            get: {
                summary: '[USER_002][Get item user]',
                tags: ['user'],
                security: [
                    {
                        bearerAuth: [] as any[],
                    },
                ],
                parameters: [...getItemParams],
                responses: responseSchema,
            },
            put: {
                summary: '[USER_004][Update user] ',
                tags: ['user'],
                description: 'update one item',
                security: [
                    {
                        bearerAuth: [] as any[],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ClassTicket',
                            },
                        },
                    },
                },
                parameters: [...getItemParams],
                responses: responseSchema,
            },
            delete: {
                summary: '[USER_005][Delete user]',
                tags: ['user'],
                description: 'delete one item',
                security: [
                    {
                        bearerAuth: [] as any[],
                    },
                ],
                parameters: [...deleteItemParams],
                responses: responseSchema,
            },
        },
    },
};
