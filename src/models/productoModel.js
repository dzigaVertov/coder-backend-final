import { randomUUID } from 'crypto';
import * as valid from '../utils/validacion.js';
import { InvalidArgumentError } from './errors/InvalidArgument.error.js';

export class Producto {
    #title
    #description
    #price
    #thumbnail
    #stock
    #category
    #status
    #id

    constructor(title,
        description,
        price,
        thumbnail,
        stock,
        category,
        status) {


        this.#title = valid.soloAlfabeticoYpuntuacion(valid.noVacio(title));
        this.#description = valid.soloAlfabeticoYpuntuacion(valid.noVacio(description));
        this.#price = valid.positivo(valid.noVacio(price));
        this.#thumbnail = thumbnail;
        this.#stock = valid.positivo(stock);
        this.#category = valid.validarCategory(category);
        this.#status = valid.validarStatus(status);
        this.#id = randomUUID();
    }

    datos() {
        return {
            title: this.#title,
            description: this.#description,
            price: this.#price,
            thumbnail: this.#thumbnail,
            stock: this.#stock,
            category: this.#category,
            status: this.#status,
            id: this.#id
        };
    }
}



export const PRODUCTO_TEST = {
    inputCorrecto: {
        title: 'Tomate',
        description: 'Un Tomate',
        price: 37.45,
        thumbnail: 'www.foto.com/unafoto',
        stock: 20,
        category: 'Frutas',
        status: 'available',
        id: 'afñvs-fsji2ñlkjdfs'
    },
    titleincorrecto: {
        title: 35,
        description: 'Un Tomate',
        price: 37.45,
        thumbnail: 'www.foto.com/unafoto',
        stock: 20,
        category: 'Frutas',
        status: 'available',
        id: 'afñvs-fsji2ñlkjdfs'
    },
    priceincorrecto: {
        title: 'Tomate',
        description: 'Un Tomate',
        price: 'caro',
        thumbnail: 'www.foto.com/unafoto',
        stock: 20,
        category: 'Frutas',
        status: 'available',
        id: 'afñvs-fsji2ñlkjdfs'
    },
    idFaltante: {
        title: 'Tomate',
        description: 'Un Tomate',
        price: 37.45,
        thumbnail: 'www.foto.com/unafoto',
        stock: 20,
        category: 'Frutas',
        status: 'available'
    }

}

export const PRODUCTO_TEST_2 = {
    inputCorrecto: {
        title: 'Computadora',
        description: 'Una computadora',
        price: 1237.45,
        thumbnail: 'www.foto.com/unafoto',
        stock: 20,
        category: 'Informatica',
        status: 'available',
        id: 'afñvs-fsji2ñlkjss20202dfs'
    },
    titleincorrecto: {
        title: 35,
        description: 'Una computadora',
        price: 1237.45,
        thumbnail: 'www.foto.com/unafoto',
        stock: 20,
        category: 'Informatica',
        status: 'available',
        id: 'afñvs-fsji2ñlkjss20202dfs'
    },
    priceincorrecto: {
        title: 'Computadora',
        description: 'Una computadora',
        price: 'otracosa',
        thumbnail: 'www.foto.com/unafoto',
        stock: 20,
        category: 'Informatica',
        status: 'available',
        id: 'afñvs-fsji2ñlkjss20202dfs'
    },
    idFaltante: {
        title: 'Computadora',
        description: 'Una computadora',
        price: 1237.45,
        thumbnail: 'www.foto.com/unafoto',
        stock: 20,
        category: 'Informatica',
        status: 'available',
    }
}
