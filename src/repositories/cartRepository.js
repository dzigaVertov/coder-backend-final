import { BaseRepository } from './baseRepository.js';
import { cartsDao } from '../DAO/persistenciaFactory.js';
import { Cart } from '../models/cartModel.js';
import { CartProductArrayModel } from '../models/CartProductArrayModel.js';
import { prodRepository } from '../repositories/productRepository.js'

class CartRepository extends BaseRepository {
    constructor(dao, cartModel) {
        super(dao, cartModel);
    }

    async getCarts() {
        this.dao.getCarts();
    }

    async updateProductos(cartId, productos) {
        const productosValidados = new CartProductArrayModel(productos);

        let cartActualizado = await this.dao.updateProductos(cartId, productosValidados.products);
        return cartActualizado;
    }

    async addProducto(cartId, codigoProducto) {
        // Chequear que el producto exista en la base:
        await prodRepository.getProduct({ id: codigoProducto });

        const cartActualizado = await this.dao.addProductoToCart(cartId, codigoProducto);
        return cartActualizado;
    }

    async updateProdQuantity(cartId, codigoProducto, quantityNueva) {
        let carritoActualizado = await this.dao.updateProductQuantity(cartId, codigoProducto, quantityNueva);
        return carritoActualizado;
    }

    async deleteProduct(cartId, codigoProducto) {
        let carritoActualizado = await this.dao.deleteProductFromCart(cartId, codigoProducto);
        return carritoActualizado;
    }

    async vaciarCarrito(cartId) {
        let carritoActualizado = await this.dao.updateProductos(cartId, []);
        return carritoActualizado;
    }
}

export const cartRepository = new CartRepository(cartsDao, Cart);

