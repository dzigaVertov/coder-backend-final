import { logger } from '../utils/logger.js';

export async function loggerMiddleware(req, res, next) {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}
