import express, { Router } from 'express';
import { getCartHandler, getCidHandler } from '../controllers/cartsController.js';
import { soloCartDeUsuarioOadmin } from '../middlewares/autorizacion.js';
import { autenticarJwtView } from '../middlewares/passport.js';


const cartsRouter = Router();
export default cartsRouter;

cartsRouter.get('/', autenticarJwtView, getCartHandler);
cartsRouter.get('/:cid', autenticarJwtView, soloCartDeUsuarioOadmin(), getCidHandler);
