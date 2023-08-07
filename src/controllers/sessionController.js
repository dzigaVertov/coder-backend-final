import { Router } from 'express';
import { autenticarLocal, autenticarJwtApi } from '../middlewares/passport.js';
import { construirJwt } from '../services/sessionServices.js';

export const handleLogin = Router();
handleLogin.use(autenticarLocal, async (req, res, next) => {
    try {
        const datosUsuario = req.user;
        const jwtoken = await construirJwt(datosUsuario);
        res.cookie('jwt', jwtoken, { maxAge: 100000, httpOnly: true, signed: true });
        res.sendStatus(201);
    } catch (error) {
        next(error);
    }
});


export const handleLogout = Router();
handleLogout.use(autenticarJwtApi, (req, res, next) => {
    try {
        res.clearCookie('jwt', { maxAge: 100000, httpOnly: true, signed: true });
        res.sendStatus(200);
    } catch (error) {
        next(error);

    }
});

export const handleGetCurrent = Router();
handleGetCurrent.use(autenticarJwtApi, (req, res, next) => {
    try {
        const currentUser = req.user;
        delete currentUser.password;
        res.json(currentUser);

    } catch (error) {
        next(error);
    }
});

// function mostrarCookies(req, res, next){
//     console.log('signed: ', req.signedCookies['jwt']);
//     console.log('cookies', req.cookies);
//     next();
// }
