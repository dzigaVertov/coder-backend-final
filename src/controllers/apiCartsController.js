import { cartRepository } from '../repositories/cartRepository.js';
import { cartService } from '../services/cartService.js';
import { purchaseService } from '../services/purchase.service.js';



export async function getHandler(req, res, next) {
    try {
        const carts = await cartService.obtenerListaCarts();
        res.json(carts);
    } catch (error) {
        next(error);
    }
}

export async function postHandler(req, res, next) {
    const { owner } = req.body;
    try {
        const nuevoCart = await cartService.crearCart(owner);
        res.status(201).json(nuevoCart);
    } catch (error) {
        next(error);
    }
}

export async function getCartDeUsuarioHandler(req, res, next) {
    try {
        const userId = req.user.id;
        const cart = await cartService.obtenerCartDeUsuario(userId);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
}

export async function putCidHandler(req, res, next) {
    try {
        let cartId = req.params.cid;
        let productos = req.body;
        let cartActualizado = await cartService.actualizarProductos(cartId, productos);
        res.status(201).json(cartActualizado);

    } catch (error) {
        next(error);
    }
}


export async function postProductHandler(req, res, next) {
    let idCarrito = req.params.cid;
    let codigoProducto = req.params.pid;
    try {
        const carritoActualizado = await cartService.agregarProductoAlCart(idCarrito, codigoProducto);
        res.status(201).json(carritoActualizado);

    } catch (error) {
        next(error);
    }


}

export async function putProductQuantityHandler(req, res, next) {
    try {
        let idCarrito = req.params.cid;
        let idProducto = req.params.pid;
        let { quantity } = req.body;
        let carritoActualizado = await cartRepository.updateProdQuantity(idCarrito, idProducto, quantity);
        res.status(201).json(carritoActualizado);
    } catch (error) {
        next(error);
    }

}

export async function deleteProductHandler(req, res, next) {
    try {
        let idCarrito = req.params.cid;
        let codigoProducto = req.params.pid;
        let carritoActualizado = await cartRepository.deleteProduct(idCarrito, codigoProducto);
        res.json(carritoActualizado);

    } catch (error) {
        next(error);
    }
}

export async function vaciarCarritoHandler(req, res, next) {
    try {
        let idCarrito = req.params.cid || req.user.cart;
        let carritoActualizado = await cartRepository.vaciarCarrito(idCarrito);
        res.status(200).json(carritoActualizado);
    } catch (error) {
        next(error);
    }
}


export async function purchaseHandler(req, res, next) {
    let cartId = req.params.cid || req.user.cart;
    try {
        const purchaseTicket = await purchaseService.createPurchase(cartId);
        console.log('ticket: ', purchaseTicket);
        res.status(200).json(purchaseTicket);
    } catch (error) {
        next(error);
    }
}
