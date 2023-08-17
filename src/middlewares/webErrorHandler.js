import { ExpiredTokenError } from '../models/errors/ExpiredToken.error.js';
import { InvalidOperationError } from '../models/errors/InvalidOperation.error.js';

export async function webErrorHandler(error, req, res, next) {
    switch (true) {
        case error instanceof ExpiredTokenError:
            res.render('sendPasswordEmail');
            return;
        case error instanceof InvalidOperationError:
            res.sendStatus(400);
            return;
        default:
            console.log('error: ', error);
            res.json({ estado: 'error', tipo: error.tipo, descripcion: error.description });
    }
}
