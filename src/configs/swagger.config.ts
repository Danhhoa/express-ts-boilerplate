import { components } from '@/swagger/documents/components';
import { paths, tags_name } from '@/swagger/documents/paths';
import * as _ from 'lodash';
import envConfig from './env.config';

const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        title: `REST API ${envConfig.app.name.toUpperCase()}`,
        version: '1.0.0',
        termsOfService: 'http://swagger.io/terms/',
        contact: {
            email: 'apiteam@swagger.io',
        },
        license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    servers: [
        {
            url: 'http://localhost:5555/api/v1',
            description: `${envConfig.app.name}`,
            basePath: { default: 'v1' },
        },
    ],
    tags: _.sortBy(tags_name, (t) => t.name),
    components: components,
    security: [
        {
            bearerAuth: [] as any[],
        },
    ],
    paths: paths,
};
export { swaggerDocument };
