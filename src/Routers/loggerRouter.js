import { Router } from 'express';
import { getHandler } from '../controllers/loggerRouterController.js';
export const loggerRouter = Router();

loggerRouter.get('/', getHandler);
loggerRouter.get('/:tipoLog', getHandler);
