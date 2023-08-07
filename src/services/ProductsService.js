import { prodRepository } from '../repositories/productRepository.js';
import { BusquedaListaProductos } from '../models/BusquedaListaProductos.js';


class ProductsService {
    constructor(prodRepository) {
        this.prodRepository = prodRepository;
    }

    async obtenerListaProductos(opcionesBusqueda) {
        const parametrosBusqueda = new BusquedaListaProductos(opcionesBusqueda);
        const resultadoBusqueda = await prodRepository.getProductsQuery(parametrosBusqueda);
        return resultadoBusqueda;
    }

    async buscarProducto(query) {
        const producto = await prodRepository.getProduct(query);
        return producto;
    }

    async modificarProducto(id, camposAcambiar) {
        const productoModificado = await prodRepository.updateProduct(id, camposAcambiar);
        return productoModificado;
    }

    async agregarProducto(paramsProducto) {
        const producto = await prodRepository.addProduct(paramsProducto);
        return producto;
    }

    async borrarProducto(id) {
        let producto = await prodRepository.deleteProduct({ id: id });
        return producto;
    }
}

export const productService = new ProductsService(prodRepository);
