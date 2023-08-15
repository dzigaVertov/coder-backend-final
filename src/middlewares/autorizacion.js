import { AuthorizationError } from "../models/errors/Authorization.error.js";
import { NotLoggedInError } from "../models/errors/NotLoggedInError.js";

export function soloRol(role) {
    function middlewareSoloRol(req, res, next) {
        if (req.user?.role === role) return next();
        return next(new AuthorizationError(`No autorizado para rol:${role}`))
    }

    return middlewareSoloRol;
}

export function soloCartDeUsuarioOadmin() {
    function middlewareCartUsuario(req, res, next) {
        const cid = req.params.cid;
        if (req.user?.role === 'admin') return next();
        if (req.user?.cart === cid) {
            return next();
        }
        return next(new AuthorizationError(`No autorizado`))
    }
    return middlewareCartUsuario;
}

export function soloCreaCartPropioUsuarioOadmin() {
    function middlewareCartUsuario(req, res, next) {
        const { owner } = req.body;
        if (req.user.role === 'admin') return next();
        if (req.user.id === owner) return next();

        return next(new AuthorizationError(`No autorizado`))
    }
    return middlewareCartUsuario;
}


export function soloLogueado(req, res, next) {
    try {
        if (!req.isAuthenticated()) {
            next(new NotLoggedInError('No hay usuario logueado'));
        }
        next();

    } catch (error) {
        next(error);
    }

}
