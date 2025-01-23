import dataSource from '../typeorm-connection/data-source';
import envConfig from './env.config';
import logger from './logger.config';

export const initDB = () => {
    dataSource
        .initialize()
        .then(() => {
            logger.info('Data Source has been initialized!');
        })
        .catch((err: any) => {
            logger.error('Error during Data Source initialization!');
            console.error(
                'Error during Data Source initialization:',
                err,
            );
        });
};
