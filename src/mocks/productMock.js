import { faker } from '@faker-js/faker';
import { Producto } from '../models/productoModel.js';

export function crearMockProducto(cantidad = 1) {
    let productos = [];
    const categoryOptions = ['bebidas', 'computacion', 'frutas', 'muebles'];

    for (let i = 0; i < cantidad; i++) {
        let prod = new Producto(faker.lorem.words(4),
            faker.lorem.paragraph(),
            faker.finance.amount(),
            faker.image.url(),
            faker.number.int(),
            categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
            'available');

        productos.push(prod.datos());
    }

    return productos;
}

