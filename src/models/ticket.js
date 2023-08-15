import { randomUUID } from 'crypto';
import * as valid from '../utils/validacion.js';


export class Ticket {

    constructor({ total, email }) {
        this.id = randomUUID();
        this.purchase_datetime = new Date();
        this.amount = valid.positivo(valid.noVacio(total));
        this.purchaser = valid.esMail(valid.noVacio(email));
    }

    datos() {
        return {
            id: this.id,
            purchase_datetime: this.purchase_datetime,
            amount: this.amount,
            purchaser: this.purchaser
        }
    }

    dto() {
        return {
            id: this.id,
            purchase_datetime: this.purchase_datetime,
            amount: this.amount,
            purchaser: this.purchaser
        }
    }

}
