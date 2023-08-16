import { cartRepository } from '../repositories/cartRepository.js';

export async function getCartHandler(req, res, next) {
    try {
        const cid = req.user.cart;
        const cart = await cartRepository.readOne({ id: cid });
        const productos = cart.productos;
        const hayDocs = productos.length > 0;
        res.render('cart', { productos, hayDocs });

    } catch (error) {
        next(error);
    }
}

export async function getCidHandler(req, res, next) {
    try {
        // TODO: Quizás poner en un servicio?
        const cid = req.params.cid;
        const cart = await cartRepository.readOne({ id: cid });
        const productos = cart.productos;
        const hayDocs = productos.length > 0;
        res.render('cart', { productos, hayDocs });

    } catch (error) {
        next(error)
    }
}
