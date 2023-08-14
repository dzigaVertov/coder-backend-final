import express, { Router } from 'express';
import { purchaseController } from '../controllers/purchaseController.js';
import * as apiCartsController from '../controllers/apiCartsController.js';
import { soloRol, soloCartDeUsuarioOadmin, soloCreaCartPropioUsuarioOadmin } from '../middlewares/autorizacion.js';
import { autenticarJwtApi } from '../middlewares/passport.js';

let apiCartsRouter = Router();
export default apiCartsRouter;


apiCartsRouter.get('/allcarts',
    autenticarJwtApi,
    soloRol('admin'),
    apiCartsController.getHandler);

apiCartsRouter.post('/',
    autenticarJwtApi,
    soloCreaCartPropioUsuarioOadmin(),
    apiCartsController.postHandler);

apiCartsRouter.get('/',
    autenticarJwtApi,
    apiCartsController.getCartDeUsuarioHandler);

apiCartsRouter.put('/:cid',
    autenticarJwtApi,
    soloCartDeUsuarioOadmin(),
    apiCartsController.putCidHandler);

apiCartsRouter.post('/:cid/product/:pid',
    autenticarJwtApi,
    soloCartDeUsuarioOadmin(),
    apiCartsController.postProductHandler);

apiCartsRouter.put('/:cid/product/:pid',
    autenticarJwtApi,
    soloCartDeUsuarioOadmin(),
    apiCartsController.putProductQuantityHandler);

apiCartsRouter.delete('/:cid/product/',
    autenticarJwtApi,
    soloCartDeUsuarioOadmin(),
    apiCartsController.vaciarCarritoHandler);


apiCartsRouter.delete('/:cid/product/:pid',
    autenticarJwtApi,
    soloCartDeUsuarioOadmin(),
    apiCartsController.deleteProductHandler);

apiCartsRouter.get('/:cid/purchase',
    autenticarJwtApi,
    soloCartDeUsuarioOadmin(),
    apiCartsController.purchaseHandler);




