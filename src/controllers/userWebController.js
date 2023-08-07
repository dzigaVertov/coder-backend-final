import { construirJwt } from "../services/sessionServices.js";

export async function handleGetProfile(req, res, next) {
    if (req.user) {
        res.render('perfil', { usuario: req.user });
    } else {
        res.redirect('/login');
    }

}

export async function handleGetResetPassword(req, res, next) {
    try {
        const usuario = req.user;
        const { message } = req.query;
        const jwtoken = await construirJwt(usuario);
        req.logger.info(`Creado jwtoken en userWebController - ${new Date().toLocaleString()}`);
        res.cookie('jwt', jwtoken, { maxAge: 100000, httpOnly: true, signed: true });
        res.render('resetPassword', { message });

    } catch (error) {
        next(error);
    }


}
