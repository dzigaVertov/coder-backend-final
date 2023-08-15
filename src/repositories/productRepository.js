import { managerProductosMongo } from '../DAO/ProductManagerMongo.js';
import { BusquedaProducto } from '../models/BusquedaProducto.js';
import { ModificacionProductoModel } from '../models/ModificacionProductoModel.js';

class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProductsQuery(parametrosBusqueda) {

        let resultadoBusqueda = await this.dao.getProductsQuery(parametrosBusqueda);
        return resultadoBusqueda;
    }

    async getProduct(query) {
        const queryValidado = new BusquedaProducto(query);
        const producto = await this.dao.readOne(queryValidado);
        return producto;
    }

    async getProductById(id) {
        let producto = await this.dao.getProductById(id);
        return producto;
    }

    async getProducts() {
        const productos = await this.dao.getProducts();
        return productos;
    }

    async addProduct(prodParams) {
        // TODO: Agregar validación de producto
        const producto = await this.dao.addProduct(prodParams);
        return producto;
    }

    async updateProduct(pid, camposACambiar) {
        const camposValidados = new ModificacionProductoModel(camposACambiar);

        const producto = await this.dao.updateProduct({ id: pid }, camposValidados);
        return producto;
    }

    async deleteProduct(query) {
        const product = await this.dao.deleteOne(query);
        return product;
    }
    async deleteProductById(pid) {
        const product = await this.dao.deleteProductById(pid);
        return product;
    }
}

export const prodRepository = new ProductRepository(managerProductosMongo);
