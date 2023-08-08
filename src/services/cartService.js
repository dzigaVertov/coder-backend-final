import { InvalidArgumentError } from '../models/errors/InvalidArgument.error.js';
import { cartRepository } from '../repositories/cartRepository.js';

class CartService {
    async agregarProducto(cartId, prodId) {
        await cartRepository.addProducto(cartId, prodId);
    }

    async obtenerListaCarts() {
        const carts = await cartRepository.getCarts();
        return carts;
    }

    async crearCart(ownerId) {
        // Chequear que el user no tenga ya un cart
        const cart = await cartRepository.readOne({ cartOwner: ownerId });
        if (cart) throw new InvalidArgumentError('El usuario ya tiene un cart creado');
        const nuevoCart = await cartRepository.create(ownerId);
        return nuevoCart;
    }
}

export const cartService = new CartService();
