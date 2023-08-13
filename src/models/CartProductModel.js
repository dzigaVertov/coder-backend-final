import * as valid from '../utils/validacion.js';
export class CartProductModel {
    constructor(id, quantity) {
        this.id = valid.esString(valid.noVacio(id));
        this.quantity = valid.positivo(valid.entero(valid.noVacio(quantity)));
    }
}
