import assert, { equal } from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { usersDaoMongoose } from '../../src/DAO/usersDaoMongoose.js';
import { USUARIO_TEST, USUARIO_TEST_2 } from '../../src/models/userModel.js';
import { crearMockProducto } from '../../src/mocks/productMock.js';
import { managerProductosMongo } from '../../src/DAO/ProductManagerMongo.js';
import { fetchFromMongoDb, insertIntoMongoDb } from '../../src/utils/mongooseUtils.js';
import { PRODUCTO_TEST } from '../../src/models/productoModel.js';
import { hashear } from '../../src/utils/criptografia.js';


const httpClient = supertest('http://localhost:8080');

describe('api rest', () => {
    describe('/api/products', () => {
        let cookieAdmin;         // el POST de productos requiere un usuario administrador
        let cookieUser;
        let productoEnDb;
        async function loguearUsuarios() {
            console.log('en otro loguear');
            // Crear un usuario admin para postear productos
            const passHasheado = hashear(USUARIO_TEST.inputCorrecto.password);
            const userTestAdmin = { ...USUARIO_TEST.inputCorrecto, role: 'admin', password: passHasheado };
            // Crear usuario user para testear autorizacion de POST
            const passHashUser = hashear(USUARIO_TEST_2.inputCorrecto.password);
            const userTestUser = { ...USUARIO_TEST_2.inputCorrecto, password: passHashUser };

            await insertIntoMongoDb(userTestAdmin, 'usuarios');
            await insertIntoMongoDb(userTestUser, 'usuarios');

            // Loguear role: admin
            const datosLogin = {
                email: USUARIO_TEST.inputCorrecto.email,
                password: USUARIO_TEST.inputCorrecto.password
            };
            const resultAdmin = await httpClient.post('/api/sessions/login').send(datosLogin);
            const cookieResult = resultAdmin.headers['set-cookie'][0];
            cookieAdmin = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            };

            // Loguear role: user
            const datosLoginUser = {
                email: USUARIO_TEST_2.inputCorrecto.email,
                password: USUARIO_TEST_2.inputCorrecto.password
            };
            const resultUser = await httpClient.post('/api/sessions/login').send(datosLoginUser);
            const cookieResultUser = resultUser.headers['set-cookie'][0];
            cookieUser = {
                name: cookieResultUser.split('=')[0],
                value: cookieResultUser.split('=')[1]
            };
        };

        before(async () => {
            const productos = crearMockProducto(30);
            productoEnDb = productos[0];
            for (const pr of productos) {
                await managerProductosMongo.addProduct(pr);
            }
        });

        after(async () => {
            await managerProductosMongo.deleteMany({});
        });

        describe('GET', () => {
            it('Devuelve una lista de productos con informacion de paginacion, statusCode:200', async () => {
                const response = await httpClient.get('/api/products');
                assert.equal(response.statusCode, 200);
                assert.equal(response.body.totalDocs, 30);
            });

            it('Devuelve productos de una categoría seleccionada por query params', async () => {
                const response = await httpClient.get('/api/products/?category=muebles');
                assert.equal(response.statusCode, 200);
                response.body.docs.forEach(elem => assert.equal(elem.category, 'muebles'));
            });

            it('Devuelve un producto a partir de la id pasada en req.params, statusCode:200', async () => {
                await managerProductosMongo.addProduct(PRODUCTO_TEST.inputCorrecto);

                const url = '/api/products/' + PRODUCTO_TEST.inputCorrecto.id;
                const response = await httpClient.get(url);
                assert.equal(response.statusCode, 200);
                assert.deepEqual(PRODUCTO_TEST.inputCorrecto, response.body);
            });

            it('Devuelve StatusCode 404 si el producto no existe', async () => {
                const response = await httpClient.get('/api/products/cumbiancha');
                assert.equal(response.statusCode, 404);
            });

        });

        describe('POST', () => {
            before(loguearUsuarios);

            after(async () => {
                await usersDaoMongoose.deleteMany({});
            });

            it('Agrega producto exitosamente, devuelve los datos de producto agregado y statusCode 201', async () => {

                const { _body, statusCode } = await httpClient.post('/api/products').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]).send(PRODUCTO_TEST.inputCorrecto);
                assert.deepEqual(_body, PRODUCTO_TEST.inputCorrecto);
                assert.equal(statusCode, 201);
            });

            it('Devuelve statusCode 400 si los datos son incorrectos', async () => {
                const { _body, statusCode } = await httpClient.post('/api/products').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]).send(PRODUCTO_TEST.priceincorrecto);
                assert.equal(statusCode, 400);
            });

            it('Devuelve statusCode 401 si no hay usuario logueado', async () => {
                const { _body, statusCode } = await httpClient.post('/api/products').send(PRODUCTO_TEST.inputCorrecto);
                assert.equal(statusCode, 401);
            });

            it('Devuelve statusCode 401 si el usuario logueado no es admin', async () => {
                const { _body, statusCode } = await httpClient.post('/api/products').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send(PRODUCTO_TEST.inputCorrecto);
                assert.equal(statusCode, 401);
            });

        });

        describe('PUT', () => {
            before(loguearUsuarios); // La modificación de productos requiere un usuario admin
            after(async () => {
                await usersDaoMongoose.deleteMany({});
            });

            it('Modifica un producto en la base, devuelve el producto modificado y status 200', async () => {
                const camposAcambiar = { price: 123456, title: 'Un nuevo producto', stock: 314 };
                const url = '/api/products/' + productoEnDb.id;
                const { _body, statusCode } = await httpClient.put(url).set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]).send(camposAcambiar);

                const resultadoEsperado = { ...productoEnDb, ...camposAcambiar };
                const productoEnDbActualizado = await fetchFromMongoDb({ id: productoEnDb.id }, 'productos');
                assert.deepEqual(_body, resultadoEsperado);
                assert.deepEqual(productoEnDbActualizado, resultadoEsperado);
                assert.equal(statusCode, 200);
            });

            it('Devuelve status 404 si el producto no existe', async () => {
                const camposAcambiar = { price: 123456, title: 'Un nuevo producto', stock: 314 };
                const url = '/api/products/a2345183hkjh34';
                const { statusCode } = await httpClient.put(url).set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]).send(camposAcambiar);

                assert.equal(statusCode, 404);
            });

            it('Devuelve statusCode 400 si los campos son incorrectos', async () => {
                const camposAcambiar = { calidad: 123456, sarasa: 'alguna cosa' };
                const url = '/api/products/' + productoEnDb.id;
                const { statusCode } = await httpClient.put(url).set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]).send(camposAcambiar);
                assert.equal(statusCode, 400);
            });

            it('Devuelve statusCode 401 si no hay usuario logueado', async () => {
                const camposAcambiar = { price: 123456, title: 'Un nuevo producto', stock: 314 };
                const url = '/api/products/' + productoEnDb.id;
                const { statusCode } = await httpClient.put(url).send(camposAcambiar);
                assert.equal(statusCode, 401);
            });

            it('Devuelve statusCode 401 si el usuario logueado no es admin', async () => {

                const camposAcambiar = { price: 123456, title: 'Un nuevo producto', stock: 314 };
                const url = '/api/products/' + productoEnDb.id;
                const { statusCode } = await httpClient.put(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send(camposAcambiar);
                assert.equal(statusCode, 401);
            });

        });

        describe('DELETE', () => {
            let productoAborrar;
            before(loguearUsuarios); // La eliminación de productos requiere un usuario admin
            after(async () => {
                await usersDaoMongoose.deleteMany({});

            });

            beforeEach(() => {
                // Agregar producto para borrar
                productoAborrar = crearMockProducto(1)[0];
                insertIntoMongoDb(productoAborrar, 'productos');
            });

            it('Borra un producto de la base, devuelve el producto borrado y status 200', async () => {

                const url = '/api/products/' + productoAborrar.id;
                const { _body, statusCode } = await httpClient.delete(url).set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]);

                const productoBorrado = await fetchFromMongoDb({ id: productoAborrar.id }, 'productos');
                assert.equal(productoBorrado, null);
                assert.deepEqual(_body, productoAborrar);
                assert.equal(statusCode, 200);
            });

            it('Devuelve status 404 si el producto no existe', async () => {
                const url = '/api/products/a2345183hkjh34';
                const { statusCode } = await httpClient.delete(url).set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]);
                assert.equal(statusCode, 404);
            });

            it('Devuelve statusCode 401 si no hay usuario logueado', async () => {
                const url = '/api/products/' + productoAborrar.id;
                const { statusCode } = await httpClient.delete(url);
                assert.equal(statusCode, 401);
            });

            it('Devuelve statusCode 401 si el usuario logueado no es admin', async () => {
                const url = '/api/products/' + productoAborrar.id;
                const { statusCode } = await httpClient.delete(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);
                assert.equal(statusCode, 401);
            });


        });
    });

});



