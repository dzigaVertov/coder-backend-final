import { cartRepository } from '../repositories/cartRepository.js';
import { cartService } from '../services/cartService.js';

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

export async function getCidHandler(req, res, next) {
    try {
        const cid = req.params.cid;
        const cart = await cartRepository.readOne({ _id: cid });
        res.json(cart);
    } catch (error) {
        next(error);
    }
}

export async function putCidHandler(req, res, next) {
    try {
        let cartId = req.params.cid;
        let productos = req.body;
        let cart = await cartRepository.updateProductos(cartId, productos);
        res.json(cart);

    } catch (error) {
        next(error);
    }
}


export async function postProductHandler(req, res, next) {
    let idCarrito = req.params.cid;
    let codigoProducto = req.params.pid;
    try {
        let carritoActualizado = await cartRepository.addProducto(idCarrito, codigoProducto);
        res.json(carritoActualizado);

    } catch (error) {
        next(error);
    }


}

export async function putProductQuantityHandler(req, res, next) {
    try {
        let idCarrito = req.params.cid;
        let idProducto = req.params.pid;
        let { quantityNueva } = req.body;
        let carritoActualizado = await cartRepository.updateProdQuantity(idCarrito, idProducto, quantityNueva);
        res.json(carritoActualizado);
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
        let idCarrito = req.params.cid;
        let carritoActualizado = await cartRepository.vaciarCarrito(idCarrito);
        res.json(carritoActualizado);
    } catch (error) {
        next(error);
    }
}
