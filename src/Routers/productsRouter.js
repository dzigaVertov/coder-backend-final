import express, { Router } from 'express';
import { getRealTimeProducts } from '../controllers/productsController.js';
import { getHandler, getPidHandler } from '../controllers/productsWebController.js';

let productsRouter = Router();
export default productsRouter;



productsRouter.get('/', getHandler);

productsRouter.get('/realTimeProducts', getRealTimeProducts);

productsRouter.get('/:pid', getPidHandler);


