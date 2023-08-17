import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';
import { JWT_KEY } from '../config/auth.config.js';
import { chequearPassword, hashear } from '../utils/criptografia.js';
import { logger } from '../utils/logger.js';
import { ExpiredTokenError } from '../models/errors/ExpiredToken.error.js';
import { AuthenticationError } from '../models/errors/Authentication.error.js';
import { userService } from '../services/userService.js';
// import { JsonWebTokenError } from 'jsonwebtoken';

// LOCAL
passport.use('local', new LocalStrategy({ usernameField: 'email' }, checkUsernamePassword));

async function checkUsernamePassword(email, password, done) {
    try {
        const usuario = await userService.loginUser(email, password);

        done(null, usuario);
    } catch (error) {
        return done(error, false);
    }
}

// JWT
const opcionesJwt = {
    secretOrKey: JWT_KEY,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
};

// JWT password reset
const opcionesJwtPasswordReset = {
    secretOrKey: JWT_KEY,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, ExtractJwt.fromUrlQueryParameter("token")])
};

passport.use('jwt', new JwtStrategy(opcionesJwt, jwtVerificado));

passport.use('jwtPasswordReset', new JwtStrategy(opcionesJwtPasswordReset, jwtVerificado));


function cookieExtractor(req) {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies['jwt'];
    }
    return token;
}

async function jwtVerificado(jwt_payload, done) {
    try {
        return done(null, jwt_payload);
    } catch (error) {
        done(error);
    }
}


export function autenticarReset(req, res, next) {
    function passportCB(error, jwt_payload, info) {

        if (error) {
            logger.error(`Error: ${error.message} atrapado en callback de autendicación - ${new Date().toLocaleString()} `);
            return next(new AuthenticationError(`Authentication error: ${error.messsage}`));
        }

        if (!jwt_payload) {
            if (info.name === 'TokenExpiredError') {
                logger.debug(`Token expirado atrapado en callback de autenticación - ${new Date().toLocaleString()} `);
                return next(new ExpiredTokenError('Token de Password reset expirado'));
            }
        }
        req.user = jwt_payload;
        next();
    }

    const auth_middleware_api = passport.authenticate('jwtPasswordReset', { session: false }, passportCB);
    auth_middleware_api(req, res, next);
}

export function autenticarJwtApi(req, res, next) {
    function passportCB(error, jwt_payload, info) {
        if (error || !jwt_payload) {
            console.log('no jwt payload', error, jwt_payload);
            return next(new AuthenticationError('Error de autenticación'));
        }
        req.user = jwt_payload;
        next();
    }

    const auth_middleware_api = passport.authenticate('jwt', { session: false }, passportCB);
    auth_middleware_api(req, res, next);
}

export function autenticarJwtView(req, res, next) {
    function passportCB(error, jwt_payload, info) {
        if (error || !jwt_payload) {
            return res.redirect('/login');
        }
        req.user = jwt_payload;
        next();
    }
    const auth_middleware_view = passport.authenticate('jwt', { session: false }, passportCB);
    auth_middleware_view(req, res, next);
}

export function autenticarLocal(req, res, next) {

    const passMiddleware = passport.authenticate('local', { session: false, failureRedirect: '/register' });

    return passMiddleware(req, res, next);
}

export const passportInitialize = passport.initialize();
