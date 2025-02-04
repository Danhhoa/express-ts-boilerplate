require('dotenv').config();

import logger from './shared/configs/logger.config';
import app from './shared/configs/server.config';
import envConfig from './shared/configs/env.config';

const connect = async () => {
    try {
        app.listen(envConfig.app.port, () => {
            logger.info(
                `Server is running at ${envConfig.app.host}:${envConfig.app.port} with NODE_ENV: ${envConfig.nodeEnv}`,
            );
        });
    } catch (e) {
        logger.info(`The connection to database was failed with error: ${e}`);
    }
};

connect();
