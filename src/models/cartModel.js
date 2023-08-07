import { randomUUID } from 'crypto';
import * as valid from '../utils/validacion.js';

export class Cart {
    #cartOwner;
    #id;
    #productos;

    constructor(owner) {
        this.#cartOwner = valid.noVacio(owner);
        this.#productos = [];
        this.#id = randomUUID();
    }

    datos() {
        return {
            cartOwner: this.#cartOwner,
            productos: this.#productos,
            id: this.#id
        };
    }

    dto() {
        return {
            cartOwner: this.#cartOwner,
            productos: this.#productos,
            id: this.#id
        };
    }
}
