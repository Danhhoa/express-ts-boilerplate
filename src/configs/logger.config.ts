import winston, { addColors } from 'winston';

const alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all: true,
        level: true,
        // colors: { info: 'white', warning: 'yellow', error: 'red' },
    }),
    winston.format.label({
        label: '[LOGGER]',
    }),
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
        (info) =>
            `${info.label}[${info.timestamp}][${info.level}]: ${info.message}`,
    ),
);

addColors({
    info: 'italic blue', // fontStyle color
    warn: 'italic yellow',
    error: 'bold italic red',
    debug: 'italic green',
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { timestamp: new Date() },
    transports: [
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
        }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                alignColorsAndTime,
            ),
        }),
    );
}

export default logger;
