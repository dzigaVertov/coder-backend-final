import { randomUUID } from 'crypto';
import * as valid from '../utils/validacion.js';
import { InvalidArgumentError } from './errors/InvalidArgument.error.js';

export class ModificacionProductoModel {

    constructor(camposAcambiar) {

        const camposValidos = ['title',
            'description',
            'price',
            'thumbnail',
            'stock',
            'category',
            'status'];

        const campos = Object.keys(camposAcambiar);
        campos.forEach(campo => {
            if (!camposValidos.includes(campo)) throw new InvalidArgumentError('Campo no válido');
        });

        if (campos.includes('title')) {
            this.title = valid.soloAlfabeticoYpuntuacion(camposAcambiar.title);
        }

        if (campos.includes('description')) {
            this.description = valid.soloAlfabeticoYpuntuacion(camposAcambiar.description);
        }

        if (campos.includes('price')) {
            this.price = valid.positivo(camposAcambiar.price);
        }

        if (campos.includes('thumbnail')) {
            this.thumbnail = camposAcambiar.thumbnail;
        }

        if (campos.includes('stock')) {
            this.stock = valid.positivo(camposAcambiar.stock);
        }

        if (campos.includes('category')) {
            this.category = valid.validarCategory(camposAcambiar.category);
        }

        if (campos.includes('status')) {
            this.status = valid.validarStatus(camposAcambiar.status);
        }
    }
}
