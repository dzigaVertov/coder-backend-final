import mongoose from '../../src/database/mongoose.js';
import { managerProductosMongo } from "../../src/DAO/ProductManagerMongo.js";
import { crearMockProducto } from "../../src/mocks/productMock.js";

export async function cargarProductosEnLaBase(cantidad = 1) {
    const productos = crearMockProducto(cantidad);

    for (const pr of productos) {
        await managerProductosMongo.addProduct(pr);
    };
    console.log('terminado');
    return;
}
const numDocs = parseInt(process.argv[2]);
await cargarProductosEnLaBase(numDocs);
process.exit();
