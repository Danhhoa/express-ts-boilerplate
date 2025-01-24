import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import * as swaggerUi from 'swagger-ui-express';

import router from '../routes';
import { swaggerDocument } from './swagger.config';
import { HTTPError } from '@/shared/errors/http.error';
import globalErrorHandler from '@/shared/middlewares/global-error-handler.middleware';

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

app.use(cors(corsOption));

app.use(express.json());

app.use(morgan('dev'));

// SWAGGER
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: { displayRequestDuration: true },
    }),
);

// Router
app.use(router);

// Joi Error Handler
// app.use(joiErrorHandler);

// Global exception handler
app.use(globalErrorHandler);

export default app;
