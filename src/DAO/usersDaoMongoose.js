import mongoose from '../database/mongoose.js';
import { NotFoundError } from '../models/errors/NotFound.error.js';
import { InvalidOperationError } from '../models/errors/InvalidOperation.error.js';
import { InvalidArgumentError } from '../models/errors/InvalidArgument.error.js';
import { usuarioSchemaModel } from '../models/schemaUsuario.js';
import { toPojo } from '../utils/topojo.js';
import { logger } from '../utils/logger.js';

class UsersDaoMongoose {
    #db;
    constructor(db) {
        this.#db = db;
        logger.debug('DAO Mongo Users creado');
    }

    async create(newUser) {
        try {
            const userCreado = toPojo(await this.#db.create(newUser));
            logger.debug(`User creado en DAO - ${new Date().toLocaleDateString()}`);
            delete userCreado._id;
            return userCreado;

        } catch (error) {
            // Duplicate key
            if (error.code === 11000) {
                throw new InvalidOperationError('El usuario ya existe');
            }
            if (error.name === 'ValidationError') {
                throw new InvalidArgumentError(error.message);
            }
            throw error;
        }
    }

    async readOne(query) {
        let result = await this.#db.findOne(query).lean();
        if (!result) throw new NotFoundError('Usuario no encontrado');
        logger.debug(`User leído en DAO - ${new Date().toLocaleDateString()}`);
        delete (result._id);
        return result;
    }

    async readMany(query) {
        const queryResult = await this.#db.find(query).select({ _id: 0 }).lean();
        if (!queryResult || queryResult.length === 0) throw new NotFoundError('Usuario no encontrado');
        logger.debug(`readMany en DAO Users - ${new Date().toLocaleDateString()}`);
        return queryResult;
    }

    async updateOne(query, newData) {
        const result = await this.#db.updateOne(query, newData);
        if (result.matchedCount == 0) throw new NotFoundError('Usuario no encontrado');
        logger.debug(`update user en DAO - ${new Date().toLocaleDateString()}`);
        return result;
    }

    async findOneAndUpdate(query, newData) {
        let result = await this.#db.findOneAndUpdate(query, newData, { new: true }).lean();
        if (!result) throw new NotFoundError('Usuario no encontrado');
        logger.debug(`find and update user en DAO - ${new Date().toLocaleDateString()}`);
        delete (result._id);
        return result;
    }

    async updateMany(query, newData) {
        let result = await this.#db.updateMany(query, newData);
        if (result.matchedCount == 0) throw new NotFoundError('Usuario no encontrado');
        logger.debug(`update many users en DAO - ${new Date().toLocaleDateString()}`);
        return result;
    }

    async deleteOne(query) {
        const result = await this.#db.findOneAndDelete(query).lean();
        if (!result) throw new NotFoundError('Usuario no encontrado');
        delete (result._id);
        logger.debug(`borrado user en DAO - ${new Date().toLocaleDateString()}`);
        return result;
    }

    async deleteMany(query) {
        return await this.#db.deleteMany(query);
    }

}

export const usersDaoMongoose = new UsersDaoMongoose(usuarioSchemaModel);
