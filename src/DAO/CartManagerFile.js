import { randomUUID } from 'crypto';
import fs from 'fs/promises';

class CartManagerFile {
    constructor(path) {
        this.carts = [];

        this.path = path;
        this.archivoCargado = false;
    }


    async cargarArchivo() {
        try {
            const json = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(json);
            this.archivoCargado = true;
        } catch (err) {
            if (err.code === 'ENOENT') {
                // No existe el archivo, crearlo
                this.guardarArchivo();
                this.archivoCargado = true;
            } else {
                throw new Error(err);
            }
        }
    }


    async guardarArchivo() {
        if (!this.archivoCargado) {
            await this.cargarArchivo();
        }
        let data = JSON.stringify(this.carts);
        fs.writeFile(this.path, data);
    }

    async create() {
        if (!this.archivoCargado) {
            await this.cargarArchivo();
        }

        let nuevoCart = new Cart();
        this.carts.push(nuevoCart);
        this.guardarArchivo();
        return nuevoCart.id;
    }

    async getCartbyId(id) {
        if (!this.archivoCargado) {
            await this.cargarArchivo();

        }

        let cartIdx = this.carts.findIndex(x => x.id === id);

        if (cartIdx === -1) throw new Error('Carrito Not Found');

        let carrito = new Cart();
        carrito.id = this.carts[cartIdx].id;
        carrito.products = this.carts[cartIdx].products;
        return carrito;
    }


}

class Cart {
    constructor() {
        this.products = [];
        this.id = randomUUID();
    };

    async addProduct(id) {
        let producto;
        if (this.esProductoRepetido(id)) {

            producto = await this.getProductById(id);
            producto.quantity += 1;
        } else {
            producto = new CartProduct(id);
            this.products.push(producto);
        }
        return producto;
    }

    esProductoRepetido(id) {
        if (this.products.some(prod => prod.id === id)) {
            return true;
        }
        return false;
    }

    getProducts() {
        return this.products;
    }

    async getProductById(id) {
        let prodIdx = this.products.findIndex(x => x.id === id);

        if (prodIdx === -1) throw new Error('Product Not Found');

        return this.products[prodIdx];
    }

}




class CartProduct {
    constructor(id) {
        this.id = id;
        this.quantity = 1;
    }

}

export default CartManagerFile;

// Código de prueba
// const manager = new ProductManagerFile('./archivoProductos.txt');
// // // console.log(await manager.getProducts());
// for (let i = 0;i<30; i++){
//     let codigoRandom = Math.round(1000*Math.random());
//     console.log(codigoRandom);
//     await manager.addProduct("producto prueba-"+codigoRandom, "Este es un producto prueba", "300", "Sin imagen", "codigoprueba-"+codigoRandom, 25);
// }
// console.log(await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "codigoPrueba", 25));
// console.log(await manager.getProducts());
// // // console.log(await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "co", 25));
// // // console.log(await manager.getProductById(789));
// // console.log(await manager.getProductById(1));
// console.log(await manager.updateProduct(1, 'title', 'nuevoValor'));
// console.log(await manager.deleteProduct(1));
// console.log(await manager.getProducts());
