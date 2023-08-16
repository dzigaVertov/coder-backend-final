import { logger } from '../utils/logger.js';

export class BaseRepository {
    #dao;
    #domainModel;
    constructor(dao, domainModel) {
        this.#dao = dao;
        this.#domainModel = domainModel;
        logger.debug(`BaseRepository creado - ${new Date().toLocaleDateString()}`);
    }

    get dao() { return this.#dao; }

    async create(data, options) {
        const domainObject = new this.#domainModel(data);
        const dbObject = await this.#dao.create(domainObject.datos());
        logger.debug(`Objecto creado en BaseRepository - ${new Date().toLocaleDateString()}`);
        return domainObject.dto();
    }

    async readOne(query, options) {
        logger.debug(`Objecto leído en BaseRepository - ${new Date().toLocaleDateString()}`);
        const queryResult = await this.#dao.readOne(query);
        return queryResult;
    }

    async readMany(query, options) {
        const queryResult = await this.#dao.readMany(query);
        logger.debug(`readMany en BaseRepository - ${new Date().toLocaleDateString()}`);
        return queryResult;
    }

    async updateOne(query, newData, options) {
        const daoUpdated = await this.#dao.updateOne(query, newData);
        logger.debug(`readMany en BaseRepository - ${new Date().toLocaleDateString()}`);
        return daoUpdated;
    }

    async findOneAndUpdate(query, newData, options) {
        const daoUpdated = await this.#dao.findOneAndUpdate(query, newData);

        const domainUpdated = new this.#domainModel(daoUpdated).datos();
        return domainUpdated;
    }

    async updateMany(query, newData, options) {
        return await this.#dao.updateMany(query, newData);
    }

    async deleteOne(query, options) {
        return await this.#dao.deleteOne(query);
    }

    async deleteMany(query, options) {
        return await this.#dao.deleteMany(query);
    }
}
