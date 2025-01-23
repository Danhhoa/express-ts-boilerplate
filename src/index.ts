require('dotenv').config();

import logger from './configs/logger.config';
import app from './configs/server.config';
import envConfig from './configs/env.config';

const connect = async () => {
    try {
        app.listen(envConfig.app.port, () => {
            logger.info(
                `Server is running at ${envConfig.app.host}:${envConfig.app.port} with NODE_ENV: ${envConfig.nodeEnv}`,
            );
        });

    } catch (e) {
        logger.info(
            `The connection to database was failed with error: ${e}`,
        );
    }
};

connect();
