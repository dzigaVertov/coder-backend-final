import { Ticket } from '../models/ticket.js';
import { prodRepository } from '../repositories/productRepository.js';
import { usersRepository } from '../repositories/userRepository.js';
import { ticketRepository } from '../repositories/ticketRepository.js';
import { cartRepository } from '../repositories/cartRepository.js';

class PurchaseService {
    async createPurchase(cartId) {
        const cart = await cartRepository.readOne({ id: cartId });

        const { prodsConStock, prodsSinStock } = await separarProdsStock(cart.productos);
        await actualizarStocks(prodsConStock);
        const total = await calcularTotalTicket(prodsConStock);
        const user = await usersRepository.readOne({ id: cart.cartOwner });
        const email = user.email;
        const ticket = await ticketRepository.create({ total, email });

        actualizarCart(prodsSinStock, cart.id);

        return ticket;
    }
}

export const purchaseService = new PurchaseService();

async function separarProdsStock(prodsEnCart) {
    let prodsConStock = [];
    let prodsSinStock = [];

    for (const prEnCart of prodsEnCart) {

        if (prEnCart.quantity <= prEnCart.producto.stock) {
            prodsConStock.push(prEnCart);
        } else {
            prodsSinStock.push(prEnCart);
        }
    }

    return { prodsConStock, prodsSinStock };
}

async function actualizarStocks(prodsConsStock) {
    for (const prEnCart of prodsConsStock) {
        const nuevoStock = prEnCart.producto.stock - prEnCart.quantity;
        await prodRepository.updateProduct(prEnCart.id,
            { stock: nuevoStock });
    }
}

async function calcularTotalTicket(prodsConStock) {
    let precioTotal = 0;
    for (const prEnCart of prodsConStock) {
        precioTotal += prEnCart.producto.price * prEnCart.quantity;
    }

    return precioTotal.toFixed(2);
}

async function actualizarCart(prodsRemanentes, cartId) {
    console.log('prodsRemanentes: ', prodsRemanentes);
    const actualizacart = await cartRepository.updateProductos(cartId, prodsRemanentes);
    console.log('actualizaCart: ', actualizacart);
}
