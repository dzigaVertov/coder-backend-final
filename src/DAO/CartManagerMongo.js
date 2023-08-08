import mongoose from 'mongoose';
import cartModel from '../models/schemaCart.js';
import { logger } from '../utils/logger.js';
import { toPojo } from '../utils/topojo.js';
class CartManagerMongo {
    #db;
    constructor() {
        this.#db = cartModel;
        logger.debug('DAO de Carts creado');
    }

    async create(cartData) {
        const cart = await this.#db.create(cartData);
        logger.info('Cart creado por DAO');
        const pojo = toPojo(cart);
        delete pojo._id;
        return pojo;
    }

    async getCartById(id) {
        const cart = this.#db.findOne({ "id": id }).select({ _id: 0 }).lean();
        logger.info(`Cart id:${id} encontrado en el DAO`);
        return cart;
    }

    async readOne(query) {
        const cart = this.#db.findOne(query).select({ _id: 0 }).lean();
        logger.info(`Cart recuperado en DAO con query:${query}`);
        return cart;
    }

    async getCarts() {
        return this.#db.find();
    }

    async updateProductos(idCart, productos) {
        // TODO: Arreglar esto
        return this.#db.findByIdAndUpdate(idCart, { productos: productos });
    }

    async updateProductQuantity(idCart, id_producto, quantity) {
        let prueba = this.#db.findOneAndUpdate({
            id: idCart,
            productos: { $elemMatch: { id: id_producto } }
        },
            { $inc: { 'productos.$.quantity': quantity } });

        console.log(prueba);
        return prueba;
    }

    async addProductoToCart(idCart, idProducto) {
        // Chequear si ya está ese procucto en el carrito
        const existeProducto = await this.#db.find(
            {
                "id": idCart,
                "productos": {
                    "$eq": { id: idProducto }
                }
            }).select({ _id: 0 }).lean();

        if (existeProducto.length > 0) {
            return this.#db.updateOne(
                {
                    "id": idCart,
                    "productos.id": idProducto
                }
                ,
                { "$inc": { "productos.$.quantity": 1 } }
            );
        } else {
            return this.#db.updateOne(
                { "id": idCart },
                { "$push": { "productos": { "id": idProducto, "quantity": 1 } } });
        }
    }

    async deleteProductFromCart(idCart, idProducto) {
        return this.#db.updateOne({ id: idCart },
            { $pullAll: { "productos": [{ id: idProducto }] } });
    }

    async deleteMany(query) {
        return await this.#db.deleteMany(query);
    }



}

export const cartManagerMongo = new CartManagerMongo();
