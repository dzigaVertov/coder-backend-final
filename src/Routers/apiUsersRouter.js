import { Router } from 'express';
import * as usersController from '../controllers/userController.js';
import { autenticarJwtApi, autenticarReset } from '../middlewares/passport.js';
import passport from 'passport';
import { soloLogueado, soloRol } from '../middlewares/autorizacion.js';
const apiUsersRouter = Router();
export default apiUsersRouter;

function middlePrueba(req, res, next) {
    console.log('llega la peticion');
    console.log(req.query);
    console.log(req.baseUrl);
    next();
}

apiUsersRouter.get('/', autenticarJwtApi, soloRol('admin'), usersController.getAllUsers);

apiUsersRouter.post('/', usersController.postUserController);

apiUsersRouter.post('/sendLink', usersController.postUserSendLinkController);

apiUsersRouter.post('/addtocart/:pid', autenticarJwtApi, soloLogueado, usersController.postAddToCartController);

apiUsersRouter.post('/newpassword', passport.authenticate('jwt', { session: false }), usersController.postUserNewPassController);

apiUsersRouter.get('/:uid', usersController.getUserController);


apiUsersRouter.put('/', autenticarJwtApi, usersController.putUserController);


