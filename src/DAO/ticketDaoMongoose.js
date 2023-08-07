import { ticketMongooseModel } from '../models/schemaTicket.js';
import { toPojo } from '../utils/topojo.js';

class TicketDaoMongoose {
    #db;
    constructor(db) {
        this.#db = db;
    }

    async create(newTicket){
        return toPojo(await this.#db.create(newTicket));
    }
}

export const ticketDaoMongoose = new TicketDaoMongoose(ticketMongooseModel);
