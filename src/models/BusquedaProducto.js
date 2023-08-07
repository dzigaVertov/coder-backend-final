import { InvalidArgumentError } from './errors/InvalidArgument.error.js';

export class BusquedaProducto {
    constructor(parametro) {
        const { id, title, description } = parametro;
        const cantParametros = !!id + !!title + !!description;
        if (cantParametros != 1) {
            throw new InvalidArgumentError('Búsqueda de producto con número incorrecto de parámetros');
        }

        Object.assign(this, parametro);
    }
}
