import winston from 'winston';
import { NODE_ENV } from '../config/servidor.config.js';

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
};

const winstonLoggerDev = winston.createLogger({
    levels,
    transports: [
        new winston.transports.Console({
            level: 'debug'
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'errors.log'
        })
    ]
});

const winstonLoggerTest = winston.createLogger({
    levels,
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: 'testDebug.log'
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'errors.log'
        })
    ]
});

const winstonLoggerProd = winston.createLogger({
    levels,
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'infoProductionServer.log'
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'errors.log'
        })
    ]
});

export let logger;
if (NODE_ENV === 'production') {
    logger = winstonLoggerProd;
    logger.info(`NODE_ENV: ${NODE_ENV}`);
} else if (NODE_ENV === 'dev') {
    logger = winstonLoggerDev;
    logger.info(`NODE_ENV: ${NODE_ENV}`);
} else {
    logger = winstonLoggerTest;
    logger.info(`NODE_ENV: ${NODE_ENV}`);
}




