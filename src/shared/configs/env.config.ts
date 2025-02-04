require('dotenv').config();

const envConfig = {
    app: {
        host: process.env.HOST,
        port: process.env.PORT,
        name: process.env.PROJECT_NAME || 'UNKNOWN',
        tokenSecret: process.env.TOKEN_SECRET || '123456',
    },
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        dbName: process.env.DB_NAME,
        url: process.env.DB_URL,
    },
    nodeEnv: process.env.NODE_ENV || 'development',
    minio: {
        accessKey: process.env.MINIO_ACCESS_KEY || '',
        secretKey: process.env.MINIO_SECRET_KEY || '',
        bucketName: process.env.MINIO_BUCKET_NAME || '',
        region: process.env.MINIO_REGION || '',
        endpoint: process.env.MINIO_ENDPOINT,
    },
    socket: {
        port: process.env.SOCKET_PORT,
    },
    // rabbitmq: {
    //     host: process.env.RABBITMQ_HOST,
    //     port: process.env.RABBITMQ_PORT,
    //     user: process.env.RABBITMQ_USER,
    //     password: process.env.RABBITMQ_PASSWORD,
    // },
};

export default envConfig;
