require('dotenv').config();

import logger from './shared/configs/logger.config';
import app from './shared/configs/server.config';
import envConfig from './shared/configs/env.config';
import socketService from './shared/services/socket/socket.service';

const connect = async () => {
    try {
        app.listen(envConfig.app.port, () => {
            logger.info(
                `Server is running at ${envConfig.app.host}:${envConfig.app.port} with NODE_ENV: ${envConfig.nodeEnv}`,
            );
        });

        await socketService
            .init(app)
            .then(() => {
                logger.info(`Socket Server is running`);
            })
            .catch((err) => {
                logger.error(`Socket Server init error: ${err}`);
            });
    } catch (e) {
        logger.info(`The connection to database was failed with error: ${e}`);
    }
};

connect();
