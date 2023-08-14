import mongoose from 'mongoose';
import { InvalidArgumentError } from '../models/errors/InvalidArgument.error.js';
import { NotFoundError } from '../models/errors/NotFound.error.js';
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
        const cart = this.#db.findOne(query).select({ 'productos._id': 0 }).select({ _id: 0 }).lean();
        logger.info(`Cart recuperado en DAO con query:${query}`);
        return cart;
    }

    async getCarts() {
        return this.#db.find();
    }

    async updateProductos(idCart, productos) {
        console.log('productos: ', productos);
        const actualizado = await this.#db.findOneAndUpdate({ id: idCart }, { productos: productos }, { new: true })
            .select({ _id: 0 })
            .select({ 'productos.producto._id': 0 })
            .select({ 'productos._id': 0 }).lean();

        // Chequear que todos los productos estén incluidos en la base
        if (!actualizado.productos.every(x => x.producto)) {
            throw new NotFoundError('Producto no encontrado en la base de datos');
        }

        return actualizado;
    }

    async updateProductQuantity(idCart, id_producto, quantity) {
        const cart = await this.#db.findOne({ id: idCart }).lean();
        const producto = cart.productos.find(x => x.id === id_producto);

        if (!producto) throw new NotFoundError('No se encuentra el id del producto');

        const oldQuantity = producto.quantity;
        if ((quantity + oldQuantity) <= 0) throw new InvalidArgumentError(`Cantidad de productos inválida: ${quantity}`);

        let updated = await this.#db.findOneAndUpdate({
            id: idCart,
            productos: { $elemMatch: { id: id_producto } }
        },
            { $inc: { 'productos.$.quantity': quantity } }, { new: true }).select({ 'productos._id': 0 }).select({ _id: 0 }).lean();

        return updated;
    }

    async addProductoToCart(idCart, idProducto) {
        // Chequear si ya está ese procucto en el carrito
        const existeProducto = await this.#db.findOne(
            {
                "id": idCart,
                "productos.id": idProducto

            }).select({ _id: 0 }).lean();

        if (existeProducto) {
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
        const existe = await this.#db.findOne({ 'productos.id': idProducto });
        if (!existe) throw new NotFoundError(`El producto no existe en el cart`);

        return this.#db.findOneAndUpdate({
            id: idCart,

        },
            { $pull: { "productos": { id: idProducto } } }, { new: true })
            .select({ 'productos._id': 0 })
            .select({ _id: 0 })
            .lean();
    }

    async deleteMany(query) {
        return await this.#db.deleteMany(query);
    }



}

export const cartManagerMongo = new CartManagerMongo();
