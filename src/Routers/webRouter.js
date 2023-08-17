import { Router } from 'express';
import userRouter from './userRouter.js';
import productsRouter from './productsRouter.js';
import cartsRouter from './cartsRouter.js';
import ticketRouter from './ticketRouter.js';
import { webErrorHandler } from '../middlewares/webErrorHandler.js';
const webRouter = Router();

webRouter.use('/', userRouter);
webRouter.use('/products', productsRouter);
webRouter.use('/carts', cartsRouter);
webRouter.use('/ticket', ticketRouter);
webRouter.use(webErrorHandler);

export default webRouter;
