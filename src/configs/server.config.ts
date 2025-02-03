import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import globalErrorHandler from '@/shared/middlewares/global-error-handler.middleware';
import helmet from 'helmet';
import router from '../routes';

const app = express();

app.use((req, res, next) => {
    const origin = req.get('origin');

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, Access-Control-Request-Method, Access-Control-Allow-Headers, Access-Control-Request-Headers',
    );

    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
});

const corsOption = {
    origin: ['*'],
    methods: 'GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE',
    credentials: true,
};

app.use(cors(corsOption))
    .use(morgan('dev'))
    .use(express.urlencoded({ limit: '500mb', extended: false }))
    .use(express.json({ limit: '500mb' }));

app.use(helmet())
    .use(express.static('public'))
    .use(helmet.xssFilter())
    .use(helmet.frameguard({ action: 'deny' }))
    // maxAge: 7776000000
    .use(helmet.hsts({ maxAge: 24 * 7 * 60 * 60 * 1000, includeSubDomains: true }))
    .use(
        helmet.contentSecurityPolicy({
            useDefaults: false,
            directives: {
                'default-src': ["'self'"],
                'style-src': ["'self'", "'unsafe-inline'"],
                'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                'img-src': ['*', "'self'", 'data: https:'],
                'connect-src': ["'self'"],
            },
        }),
    )
    .use(helmet.crossOriginEmbedderPolicy())
    .use(helmet.crossOriginOpenerPolicy({ policy: process.env.IS_SSL ? 'same-origin' : 'unsafe-none' }))
    .use(helmet.dnsPrefetchControl())
    .use(helmet.hidePoweredBy())
    .use(helmet.ieNoOpen())
    .use(helmet.noSniff())
    .use(helmet.originAgentCluster())
    .use(helmet.permittedCrossDomainPolicies())
    .use(helmet.referrerPolicy())
    .use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// SWAGGER
// app.use(
//     '/api-docs',
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerDocument, {
//         swaggerOptions: { displayRequestDuration: true },
//     }),
// );

// Router
app.use(router);

// Global exception handler
app.use(globalErrorHandler);

export default app;
