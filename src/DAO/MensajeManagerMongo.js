import mongoose from 'mongoose';
import schemaMensaje from '../models/schemaMensaje.js';

class MensajeManagerMongo {
    #db;
    constructor() {
        this.#db = mongoose.model('mensajes', schemaMensaje);
    }

    async addMensaje(mensaje){
        this.#db.create(mensaje);
    }

    async getMensajes() {
        return this.#db.find();
    }

    async getMensajeById(id) {
        return this.#db.find({ id: id });
    }

    async deleteMensajeById(id) {
        this.#db.deleteOne({ id: id });
    }
}

export const mensajeManager = new MensajeManagerMongo();
