import { BaseRepository } from './baseRepository.js';
import { cartsDao } from '../DAO/persistenciaFactory.js';
import { Cart } from '../models/cartModel.js';


class CartRepository extends BaseRepository {
    constructor(dao, cartModel) {
        super(dao, cartModel);
    }

    async getCarts() {
        super.dao.getCarts();
    }

    async updateProductos(cartId, productos) {
        let cartActualizado = await super.dao.updateProductos(cartId, productos);
        return cartActualizado;
    }

    async addProducto(cartId, codigoProducto) {
        const cartActualizado = await super.dao.addProductoToCart(cartId, codigoProducto);
        return cartActualizado;
    }

    async updateProdQuantity(cartId, codigoProducto, quantityNueva) {
        let carritoActualizado = await super.dao.updateProductQuantity(idCarrito, codigoProducto, quantityNueva);
        return carritoActualizado;
    }

    async deleteProduct(cartId, codigoProducto) {
        let carritoActualizado = await super.dao.deleteProductFromCart(cartId, codigoProducto);
        return carritoActualizado;
    }

    async vaciarCarrito(cartId){
        let carritoActualizado = await super.dao.updateProductos(cartId, []);
        return carritoActualizado;
    }
}

export const cartRepository = new CartRepository(cartsDao, Cart);

