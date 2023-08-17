import { AuthenticationError } from '../models/errors/Authentication.error.js';
import { AuthorizationError } from '../models/errors/Authorization.error.js';
import { InvalidArgumentError } from '../models/errors/InvalidArgument.error.js';
import { NotFoundError } from '../models/errors/NotFound.error.js';
import { NotLoggedInError } from '../models/errors/NotLoggedInError.js';
import { RepeatedPasswordError } from '../models/errors/RepeatedPassword.error.js';

export async function apiErrorHandler(error, req, res, next) {

    switch (true) {
        case error instanceof InvalidArgumentError:

            res.sendStatus(400);
            return;
        case error instanceof NotFoundError:
            res.sendStatus(404);
            return;
        case error instanceof RepeatedPasswordError:
            req.logger.debug('Redirecting in apiErrorHandler');
            res.status(400).send({ message: 'password repetido' });
            return;
        case error instanceof NotLoggedInError:

            req.logger.debug('Not logged in Error');
            res.status(401).json({ message: 'Not logged in' });
            return;
        case error instanceof AuthorizationError:

            req.logger.debug('Authorization Error');
            res.status(401).json({ message: `Authorization Error: ${error.description}` });
            return;
        case error instanceof AuthenticationError:
            req.logger.debug('Authorization Error');
            res.status(401).json({ message: `Authentication Error: ${error.description}` });
            return;
        default:
            console.log('este es el error en uno: ', error);
            res.status(401).json({ estado: 'error', tipo: error.tipo, descripcion: error.description });


    }
}
