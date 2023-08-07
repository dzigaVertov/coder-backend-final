import { ExpiredTokenError } from '../models/errors/ExpiredToken.error.js';

export async function webErrorHandler(error, req, res, next) {
    switch (true) {
        case error instanceof ExpiredTokenError:
            res.render('sendPasswordEmail');
            return;
        default:
            res.json({ estado: 'error', tipo: error.tipo, descripcion: error.description });
    }
}
