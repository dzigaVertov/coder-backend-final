import express, { Router } from 'express';
import { purchaseController } from '../controllers/purchaseController.js';
import * as apiCartsController from '../controllers/apiCartsController.js';
import { soloRol, soloCartDeUsuarioOadmin } from '../middlewares/autorizacion.js';
import { autenticarJwtApi } from '../middlewares/passport.js';

let apiCartsRouter = Router();
export default apiCartsRouter;


apiCartsRouter.get('/', autenticarJwtApi, soloRol('admin'), apiCartsController.getHandler);

apiCartsRouter.post('/', apiCartsController.postHandler);

apiCartsRouter.get('/:cid', soloCartDeUsuarioOadmin(), apiCartsController.getCidHandler);

apiCartsRouter.get('/:cid/purchase', soloCartDeUsuarioOadmin(), purchaseController);

apiCartsRouter.put('/:cid', soloCartDeUsuarioOadmin(), apiCartsController.putCidHandler);

apiCartsRouter.post('/:cid/product/:pid',soloCartDeUsuarioOadmin(), apiCartsController.postProductHandler);

apiCartsRouter.put('/:cid/product/:pid',soloCartDeUsuarioOadmin(),apiCartsController.putProductQuantityHandler);

apiCartsRouter.delete('/:cid/product/:pid',soloCartDeUsuarioOadmin(), apiCartsController.deleteProductHandler);

apiCartsRouter.delete('/:cid', soloCartDeUsuarioOadmin(), apiCartsController.vaciarCarritoHandler);
