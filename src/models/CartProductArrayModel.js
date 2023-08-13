import * as valid from '../utils/validacion.js';
import { CartProductModel } from './CartProductModel.js';

export class CartProductArrayModel {
    constructor(products) {
        this.products = [];
        const arrayProductsValidado = valid.esArray(products);
        products.forEach(elem => this.products.push(new CartProductModel(elem.id, elem.quantity)));
    }
}
