import { after, before, beforeEach, describe, it } from "mocha";
import { managerProductosMongo } from '../../src/DAO/ProductManagerMongo.js';
import mongoose from "mongoose";
import assert from 'node:assert';
import { fetchFromMongoDb, insertIntoMongoDb } from '../../src/utils/mongooseUtils.js';
import { USUARIO_TEST, USUARIO_TEST_2 } from '../../src/models/userModel.js'
import { InvalidOperationError } from "../../src/models/errors/InvalidOperation.error.js";
import { InvalidArgumentError } from "../../src/models/errors/InvalidArgument.error.js";
import { NotFoundError } from "../../src/models/errors/NotFound.error.js";
import { PRODUCTO_TEST, PRODUCTO_TEST_2 } from "../../src/models/productoModel.js";


// before(async () => {

//     await mongoose.connect(MONGODB_STRING_CONEXION);
// })

// after(async () => {
//     await mongoose.connection.close();
// })




describe('DAO de Productos Mongoose', () => {
    beforeEach(async () => {
        await mongoose.connection.collection('productos').deleteMany({});
    })
    describe('addProduct', () => {
        describe('Agregado de un producto', () => {
            it('Lo Almacena - Lo Devuelve correctamente como objeto plano', async () => {
                const productoCreado = await managerProductosMongo.addProduct(PRODUCTO_TEST.inputCorrecto);
                assert.deepEqual(PRODUCTO_TEST.inputCorrecto, productoCreado);
                const productoGuardado = await fetchFromMongoDb(PRODUCTO_TEST.inputCorrecto, 'productos');
                assert.deepEqual(productoCreado, productoGuardado);
            })

            it('Lanza error si el input es incorrecto', async () => {
                await assert.rejects(managerProductosMongo.addProduct(PRODUCTO_TEST.priceincorrecto), err => err instanceof InvalidArgumentError);


            })
        })
    })

    describe('readOne', () => {
        it('Recupera un producto almacenado', async () => {
            await managerProductosMongo.addProduct(PRODUCTO_TEST.inputCorrecto);
            const productoRecuperado = await managerProductosMongo.readOne(PRODUCTO_TEST.inputCorrecto);
            assert.deepEqual(PRODUCTO_TEST.inputCorrecto, productoRecuperado);
        });

        it('Lanza un error NotFoundError si no encuentra el usuario', async () => {
            await assert.rejects(managerProductosMongo.readOne({ id: 'xxxxxxxxxxxxxxx' }), err => err instanceof NotFoundError);
        });
    })

    describe('readMany', () => {
        beforeEach(async () => {

            await managerProductosMongo.addProduct(PRODUCTO_TEST.inputCorrecto);
            await managerProductosMongo.addProduct(PRODUCTO_TEST_2.inputCorrecto);
        })
        it('Recupera productos según criterio, devuelve objetos planos sin campos extras', async () => {
            const productosRecuperados = await managerProductosMongo.readMany({ status: 'available' });
            assert.deepEqual([PRODUCTO_TEST.inputCorrecto, PRODUCTO_TEST_2.inputCorrecto], productosRecuperados);
        });

        it('Lanza un error NotFoundError si no encuentra usuarios', async () => {
            await assert.rejects(managerProductosMongo.readMany({ satus: 'excelsior' }), err => err instanceof NotFoundError);

        })
    })

    describe('updateProduct', () => {
        beforeEach(async () => {
            await managerProductosMongo.addProduct(PRODUCTO_TEST.inputCorrecto);
        });

        it('Actualiza los campos de un y solo un producto y lo devuelve actualizado', async () => {
            const title = PRODUCTO_TEST.inputCorrecto.title;
            const resultado = await managerProductosMongo.updateProduct({ title: title }, { price: 3000 });
            let actualizadoEnDb = await managerProductosMongo.readOne({ title: title });
            let actualizadoCorrecto = { ...PRODUCTO_TEST.inputCorrecto, price: 3000 };
            assert.deepEqual(actualizadoEnDb, actualizadoCorrecto);
            assert.deepEqual(resultado, actualizadoCorrecto);
        });

        it('Lanza un error NotFoundError si no encuentra el usuario', async () => {
            await assert.rejects(managerProductosMongo.updateProduct({ title: 'Pendorcho 1XP07' }, { price: 100 }), err => err instanceof NotFoundError);
        });
    })

    describe('updateMany', () => {
        beforeEach(async () => {
            await managerProductosMongo.addProduct(PRODUCTO_TEST.inputCorrecto);
            await managerProductosMongo.addProduct(PRODUCTO_TEST_2.inputCorrecto);
        });

        it('Actualiza los campos de uno o más productos', async () => {
            const resultado = await managerProductosMongo.updateMany({ status: 'available' }, { price: 45000 });
            assert.equal(resultado.matchedCount, 2);
            let actualizadoCorrecto1 = { ...PRODUCTO_TEST.inputCorrecto, price: 45000 };
            let actualizadoCorrecto2 = { ...PRODUCTO_TEST_2.inputCorrecto, price: 45000 };
            const recuperados = await managerProductosMongo.readMany({ status: 'available' });
            assert.deepEqual([actualizadoCorrecto1, actualizadoCorrecto2], recuperados);
        });
        it('Lanza un NotFoundError si ningún producto cumple el criterio', async () => {
            assert.rejects(managerProductosMongo.updateMany({ status: 'dazzling' }, { price: 45000 }), NotFoundError);
        });
    })

    describe('deleteOne', () => {
        beforeEach(async () => {
            await managerProductosMongo.addProduct(PRODUCTO_TEST.inputCorrecto);
        });

        it('Elimina un producto de la base y lo devuelve', async () => {
            const title = PRODUCTO_TEST.inputCorrecto.title;
            const productoDevuelto = await managerProductosMongo.deleteOne({ title: title });
            assert.deepEqual(productoDevuelto, PRODUCTO_TEST.inputCorrecto);
            await assert.rejects(managerProductosMongo.readOne({ title: title }), err => err instanceof NotFoundError);
        })

        it('Lanza un error NotFoundError si no encuentra el usuario', async () => {
            await assert.rejects(managerProductosMongo.deleteOne({ title: 'xxxxxxxx' }), err => err instanceof NotFoundError);
        })

    });

    describe('deleteMany', () => {
        beforeEach(async () => {
            await managerProductosMongo.addProduct(PRODUCTO_TEST.inputCorrecto);
            await managerProductosMongo.addProduct(PRODUCTO_TEST_2.inputCorrecto);
        })
        it('Elimina uno o más productos de la base', async () => {
            const result = await managerProductosMongo.deleteMany({ status: 'available' });
            assert.equal(result.deletedCount, 2);
            await assert.rejects(managerProductosMongo.readMany({}), err => err instanceof NotFoundError);
        })
    });
})
