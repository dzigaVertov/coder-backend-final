import { prodRepository } from '../repositories/productRepository.js';
import { productService } from '../services/ProductsService.js';


export async function getHandler(req, res, next) {
    try {
        const opcionesBusqueda = req.query;
        const queryReturn = await productService.obtenerListaProductos(opcionesBusqueda);
        res.json(queryReturn);
    } catch (error) {
        next(error);
    }
}

export async function getPidHandler(req, res, next) {
    const pid = req.params.pid;
    try {
        const producto = await productService.buscarProducto({ id: pid });
        res.json(producto);
    }
    catch (error) {
        next(error);
    }
}

export async function getRealTimeProducts(req, res, next) {
    try {
        const productos = prodRepository.getProducts();
        res.render('realTimeProducts',
            { pageTitle: 'realtime', productos: productos });
    } catch (error) {
        next(error);
    }
}

export async function postHandler(req, res, next) {

    try {
        const paramsProducto = req.body;
        const producto = await productService.agregarProducto(paramsProducto);
        const productos = await productService.obtenerListaProductos({});
        req.io.sockets.emit('actualizacion', productos);
        res.status(201).json(producto);
    } catch (error) {
        next(error);
    }
}


export async function putHandler(req, res, next) {
    const pid = req.params.pid;
    const camposAcambiar = req.body;
    try {
        const producto = await productService.modificarProducto(pid, camposAcambiar);
        res.status(200).json(producto);
    } catch (error) {
        return next(error);
    }
}

export async function delHandler(req, res, next) {
    const pid = req.params.pid;
    try {
        const producto = await productService.borrarProducto(pid);
        let productos = await prodRepository.getProducts();
        req.io.sockets.emit('actualizacion', productos);
        res.json(producto);
    } catch (error) {
        next(error);
    }
}

// TODO: Arreglar esto
export async function postRealTimeProducts(req, res, next) {
    try {

        let producto = await prodRepository.addProduct(req.body);
        let productos = await prodRepository.getProducts();
        req.io.sockets.emit('actualizacion', productos);
        res.json(producto);

    } catch (error) {
        next(error);
    }

}
