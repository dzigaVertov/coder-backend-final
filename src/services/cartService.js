import { cartRepository } from '../repositories/cartRepository.js';

class CartService {
    async agregarProducto(cartId, prodId) {
        await cartRepository.addProducto(cartId, prodId);
    }
}

export const cartService = new CartService();
