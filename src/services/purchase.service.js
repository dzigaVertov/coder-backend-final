import { Ticket } from '../models/ticket.js';
import { prodRepository } from '../repositories/productRepository.js';
import { usersRepository } from '../repositories/userRepository.js';
import { ticketRepository } from '../repositories/ticketRepository.js';
import { cartRepository } from '../repositories/cartRepository.js';

class PurchaseService {
    async createPurchase(cartId) {
        const cart = cartRepository.readOne({_id:cartId});

        const { prodsConStock, prodsSinStock } = await separarProdsStock(cart.productos);
        await actualizarStocks(prodsConStock);
        const total = calcularTotalTicket(prodsConStock);
        const ticket = new Ticket(total, idUser);
        ticketRepository.create(ticket);

        actualizarCart(prodsSinStock, cart._id);

        return Ticket;
    }
}

export const purchaseService = new PurchaseService();

async function separarProdsStock(prodsEnCart) {
    let prodsConStock = [];
    let prodsSinStock = [];

    for (prEnCart of prodsEnCart) {
        const producto = await prodRepository.getProductById(prodsEnCart._id);
        if (prEncart.quantity <= producto.stock) {
            prodsConStock.push(prodsEnCart);
        } else {
            prodsSinStock.push(prEnCart);
        }
    }

    return { prodsConStock, prodsSinStock };
}

async function actualizarStocks(prodsConsStock) {
    for (prEnCart of prodsConsStock) {
        const producto = await prodRepository.getProductById(prEnCart._id);
        await prodRepository.updateProduct(prEnCart._id, { $substract: { stock: prEnCart.quantity } });
    }
}

async function calcularTotalTicket(prodsConStock) {
    let precioTotal = 0;
    for (prEnCart of prodsConsStock) {
        const producto = await prodRepository.getProductById(prEnCart._id);
        precioTotal += producto.price * prEnCart.quantity;
    }

    return precioTotal;
}

async function actualizarCart(prodsRemanentes, cartId) {
    await cartRepository.updateOne({ _id: cartId }, { productos: prodsRemanentes });
}
