import { randomUUID } from 'crypto';
import * as valid from '../utils/validacion.js';


export class Ticket {
    #code;
    #purchase_datetime;
    #amount;
    #purchaser;

    constructor(amount, purchaser) {
        this.#code = randomUUID();
        this.#purchase_datetime = new Date();
        this.#amount = valid.entero(valid.noVacio(amount));
        this.#purchaser = valid.esMail(valid.noVacio(purchaser));
    }

}
