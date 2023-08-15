import assert from 'node:assert';
import supertest from 'supertest';
import { usersDaoMongoose } from '../../src/DAO/usersDaoMongoose.js';
import { cartManagerMongo } from '../../src/DAO/CartManagerMongo.js';
import { USUARIO_TEST, USUARIO_TEST_2 } from '../../src/models/userModel.js';
import { loguearUsuarios } from '../utils/usersUtils.js';
import { crearMockProducto } from '../../src/mocks/productMock.js';
import { fetchFromMongoDb, insertIntoMongoDb } from '../../src/utils/mongooseUtils.js';
import { managerProductosMongo } from '../../src/DAO/ProductManagerMongo.js';

const httpClient = supertest('http://localhost:8080');

describe('api rest', () => {
    describe('/api/carts', () => {
        let cookieAdmin = {};         // el GET de lista de carts requiere un usuario administrador
        let cookieUser = {};


        describe('GET lista de carts', () => {
            before(async () => {
                await loguearUsuarios(cookieAdmin, cookieUser);
            });

            after(async () => {
                await usersDaoMongoose.deleteMany({});
            });

            it('Devuelve la  lista de carts, statusCode:200', async () => {
                const { _body, statusCode } = await httpClient.get('/api/carts/allcarts').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]);
                assert.equal(statusCode, 200);
            });

            it('Devuelve status 401 si el usuario no es admin', async () => {
                const { _body, statusCode } = await httpClient.get('/api/carts/allcarts').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                assert.equal(statusCode, 401);
            });


            it('Devuelve status 401 si no hay usuario logueado', async () => {
                const { statusCode } = await httpClient.get('/api/carts/allcarts');
                assert.equal(statusCode, 401);
            });
        });


        describe('POST', () => {
            before(async () => {
                await loguearUsuarios(cookieAdmin, cookieUser);
            });

            after(async () => {
                await usersDaoMongoose.deleteMany({});
            });

            beforeEach(async () => {
                // Agregar un cart directamente a la base de datos con el owner del USUARIO_TEST_2
                await cartManagerMongo.create({
                    productos: [],
                    cartOwner: USUARIO_TEST_2.inputCorrecto.id,
                    id: 'sd342lskdf23jsdf3j'
                });
            });

            afterEach(async () => {
                // Vaciar la colección de carts
                cartManagerMongo.deleteMany({});
            });


            it('Crea un cart nuevo - Devuelve el cart creado y status 201 - agrega el cartId a datos de usuario', async () => {

                let { _body, statusCode } = await httpClient.post('/api/carts').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]).send({ owner: USUARIO_TEST.inputCorrecto.id });

                const { cartOwner, productos, id } = _body;
                const user = await usersDaoMongoose.readOne({ id: USUARIO_TEST.inputCorrecto.id });
                assert.ok(productos instanceof Array && productos.length == 0);
                assert.equal(cartOwner, USUARIO_TEST.inputCorrecto.id);
                assert.equal(statusCode, 201);
                assert.equal(user.cart, id);

            });

            it('Devuelve status 400 si se intenta crear cart de un usuario que ya lo tiene', async () => {
                let { statusCode } = await httpClient.post('/api/carts').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send({ owner: USUARIO_TEST_2.inputCorrecto.id });
                assert.equal(statusCode, 400);
            });

            it('Devuelve status 401 si no hay usuario logueado', async () => {
                let { statusCode } = await httpClient.post('/api/carts').send({ owner: USUARIO_TEST_2.inputCorrecto.id });
                assert.equal(statusCode, 401);
            });

            it('Devuelve status 401 si el usuario logueado no es admin o dueño del cart', async () => {
                let { statusCode } = await httpClient.post('/api/carts').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send({ owner: USUARIO_TEST.inputCorrecto.id });
                assert.equal(statusCode, 401);
            });
        });

        describe('GET userCart', () => {
            before(async () => {
                await loguearUsuarios(cookieAdmin, cookieUser);
            });
            after(async () => {
                await usersDaoMongoose.deleteMany({});
            });

            beforeEach(async () => {
                // Agregar un cart directamente a la base de datos con el owner del USUARIO_TEST_2
                await cartManagerMongo.create({
                    productos: [],
                    cartOwner: USUARIO_TEST_2.inputCorrecto.id,
                    id: 'sd342lskdf23jsdf3j'
                });
            });

            afterEach(async () => {
                // Vaciar la colección de carts
                cartManagerMongo.deleteMany({});
            });

            it('Devuelve el cart del usuario logueado, status 200', async () => {
                let { _body, statusCode } = await httpClient.get('/api/carts').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                assert.equal(statusCode, 200);

                assert.deepEqual(_body, {
                    productos: [],
                    cartOwner: USUARIO_TEST_2.inputCorrecto.id,
                    id: 'sd342lskdf23jsdf3j'
                });
            });

            it('Devuelve status 401 si no hay usuario logueado', async () => {
                let { statusCode } = await httpClient.post('/api/carts');
                assert.equal(statusCode, 401);
            });

        });

        describe('PUT :cid', () => {
            let productosEnDb;
            let cartEnDb;
            before(async () => {
                await loguearUsuarios(cookieAdmin, cookieUser);
                const prods = crearMockProducto(10);
                prods.forEach(async elem => await insertIntoMongoDb(elem, 'productos'));
                productosEnDb = prods.map(x => x.id);
            });
            after(async () => {
                await usersDaoMongoose.deleteMany({});
                await managerProductosMongo.deleteMany({});
            });

            beforeEach(async () => {
                // Agregar un cart directamente a la base de datos con el owner del USUARIO_TEST_2
                const prodsenCart = productosEnDb.map((prod, index) => {
                    return { id: prod, quantity: index + 1 };
                });
                cartEnDb = {
                    productos: prodsenCart,
                    cartOwner: USUARIO_TEST_2.inputCorrecto.id,
                    id: 'sd342lskdf23jsdf3j'
                };
                await cartManagerMongo.create(cartEnDb);
            });

            it('Actualiza los productos del cart correspondiente al usuario logueado, devuelve el cart actualizado, status 201', async () => {
                const cartId = cartEnDb.id;
                const nuevosProductos = productosEnDb.map(x => { return { id: x, quantity: 1 } });

                const { _body, statusCode } = await httpClient.put('/api/carts/' + cartId).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send(nuevosProductos);
                assert.equal(statusCode, 201);
                _body.productos.forEach(x => assert.equal(x.quantity, 1));
            });

            it('Devuelve status 404 si alguno de los productos no está en el cart o si las cantidades no son válidas', async () => {
                const cartId = cartEnDb.id;
                const nuevosProductos = productosEnDb.map(x => { return { id: x, quantity: 1 } });
                nuevosProductos[2].id = 'unaidnovalida'; // producto no incluido en la base
                const { _body, statusCode } = await httpClient.put('/api/carts/' + cartId).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send(nuevosProductos);
                assert.equal(statusCode, 404);
            });

            it('Devuelve 401 si no hay usuario logueado', async () => {
                const cartId = cartEnDb.id;
                const nuevosProductos = productosEnDb.map(x => { return { id: x, quantity: 1 } });
                const { statusCode } = await httpClient.put('/api/carts/' + cartId).send(nuevosProductos);
                assert.equal(statusCode, 401);

            });

        });

        describe('POST pid', () => {
            let productosEnDb;
            let cartEnDb;
            before(async () => {
                await loguearUsuarios(cookieAdmin, cookieUser);
                const prods = crearMockProducto(10);
                prods.forEach(async elem => await insertIntoMongoDb(elem, 'productos'));
                productosEnDb = prods.map(x => x.id);
            });
            after(async () => {
                await usersDaoMongoose.deleteMany({});
                await managerProductosMongo.deleteMany({});
            });

            beforeEach(async () => {
                // Agregar un cart directamente a la base de datos con el owner del USUARIO_TEST_2
                const prodsenCart = productosEnDb.slice(0, 3).map((prod, index) => {
                    return { id: prod, quantity: index + 1 };
                });
                cartEnDb = {
                    productos: prodsenCart,
                    cartOwner: USUARIO_TEST_2.inputCorrecto.id,
                    id: 'sd342lskdf23jsdf3j'
                };
                await cartManagerMongo.create(cartEnDb);
            });

            afterEach(async () => {
                await cartManagerMongo.deleteMany({});
            });

            it('Agrega un producto al Cart, devuelve status 201', async () => {
                const cartId = cartEnDb.id;
                const pid = productosEnDb[3];
                const url = `/api/carts/${cartId}/product/${pid}`;

                const { _body, statusCode } = await httpClient.post(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                const cartActualizado = await cartManagerMongo.readOne({ id: cartId });
                const prodAgregado = cartActualizado.productos.find(x => x.id === pid);
                assert.equal(statusCode, 201);
                assert.ok(prodAgregado);
                assert.equal(prodAgregado.quantity, 1);

            });

            it('Si el producto ya está en el Cart, aumenta la cantidad por 1, devuelve status 201', async () => {
                const cartId = cartEnDb.id;
                const pid = productosEnDb[0];
                const url = `/api/carts/${cartId}/product/${pid}`;

                const { statusCode } = await httpClient.post(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                const cartActualizado = await cartManagerMongo.readOne({ id: cartId });

                const prodAgregado = cartActualizado.productos.find(x => x.id === pid);
                assert.equal(statusCode, 201);
                assert.ok(prodAgregado);
                assert.equal(prodAgregado.quantity, 2);

            });

            it('Devuelve 404 si el id no corresponde a un producto en la base', async () => {
                const cartId = cartEnDb.id;
                const pid = 'idInvalido01232342';
                const url = `/api/carts/${cartId}/product/${pid}`;

                const { statusCode } = await httpClient.post(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                const cartActualizado = await cartManagerMongo.readOne({ id: cartId });
                const prodAgregado = cartActualizado.productos.find(x => x.id === pid);
                assert.equal(statusCode, 404);
                assert.ok(!prodAgregado);
            });

        })

        describe('PUT pid', () => {
            let productosEnDb;
            let cartEnDb;

            before(async () => {
                await loguearUsuarios(cookieAdmin, cookieUser);
                const prods = crearMockProducto(10);
                prods.forEach(async elem => await insertIntoMongoDb(elem, 'productos'));
                productosEnDb = prods.map(x => x.id);
            });

            after(async () => {
                await usersDaoMongoose.deleteMany({});
                await managerProductosMongo.deleteMany({});
            });

            beforeEach(async () => {
                // Agregar un cart directamente a la base de datos con el owner del USUARIO_TEST_2
                const prodsenCart = productosEnDb.slice(0, 3).map((prod, index) => {
                    return { id: prod, quantity: index + 1 };
                });
                cartEnDb = {
                    productos: prodsenCart,
                    cartOwner: USUARIO_TEST_2.inputCorrecto.id,
                    id: 'sd342lskdf23jsdf3j'
                };
                await cartManagerMongo.create(cartEnDb);
            });

            afterEach(async () => {
                await cartManagerMongo.deleteMany({});
            });

            it('Aumenta la cantidad de un producto en el cart, devuelve status 201', async () => {
                const cartId = cartEnDb.id;
                const pid = productosEnDb[0];
                const url = `/api/carts/${cartId}/product/${pid}`;

                const { _body, statusCode } = await httpClient.put(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send({ quantity: 3 });

                const cartActualizado = await cartManagerMongo.readOne({ id: cartId });

                const prodAgregado = cartActualizado.productos.find(x => x.id === pid);

                assert.equal(statusCode, 201);
                assert.ok(prodAgregado);
                assert.equal(prodAgregado.quantity, 4);

            });

            it('Devuelve 404 si el producto no está en el Cart', async () => {
                const cartId = cartEnDb.id;
                const pid = 'idnovalido';
                const url = `/api/carts/${cartId}/product/${pid}`;

                const { statusCode } = await httpClient.put(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send({ quantity: 3 });
                assert.equal(statusCode, 404);
            });

            it('Devuelve 404 si el id no corresponde a un producto en la base', async () => {
                const cartId = cartEnDb.id;
                const pid = 'idInvalido01232342';
                const url = `/api/carts/${cartId}/product/${pid}`;
                const { statusCode } = await httpClient.put(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send({ quantity: 3 });
                assert.equal(statusCode, 404);
            });

            it('Devuelve 400 si la cantidad resultante de items es menor o igual a 0', async () => {
                const cartId = cartEnDb.id;
                const pid = productosEnDb[0];
                const url = `/api/carts/${cartId}/product/${pid}`;
                const { _body, statusCode } = await httpClient.put(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send({ quantity: -2 });

                const cartActualizado = await cartManagerMongo.readOne({ id: cartId });
                const quantityActualizada = cartActualizado.productos.find(x => x.id === pid).quantity;

                assert.equal(statusCode, 400);
                assert.equal(quantityActualizada, 1);
            })

        })

        describe('DELETE pid', () => {
            let productosEnDb;
            let cartEnDb;

            before(async () => {
                await loguearUsuarios(cookieAdmin, cookieUser);
                const prods = crearMockProducto(10);
                prods.forEach(async elem => await insertIntoMongoDb(elem, 'productos'));
                productosEnDb = prods.map(x => x.id);
            });

            after(async () => {
                await usersDaoMongoose.deleteMany({});
                await managerProductosMongo.deleteMany({});
            });

            beforeEach(async () => {
                // Agregar un cart directamente a la base de datos con el owner del USUARIO_TEST_2
                const prodsenCart = productosEnDb.slice(0, 3).map((prod, index) => {
                    return { id: prod, quantity: index + 1 };
                });
                cartEnDb = {
                    productos: prodsenCart,
                    cartOwner: USUARIO_TEST_2.inputCorrecto.id,
                    id: 'sd342lskdf23jsdf3j'
                };
                await cartManagerMongo.create(cartEnDb);
            });

            afterEach(async () => {
                await cartManagerMongo.deleteMany({});
            });

            it('Elimina el producto del cart, devuelve 200', async () => {
                const cid = cartEnDb.id;
                const pid = productosEnDb[0];

                const url = `/api/carts/${cid}/product/${pid}`;

                const { _body, statusCode } = await httpClient.delete(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);
                const existe = await cartManagerMongo.readOne({ 'productos.id': pid });

                assert.equal(statusCode, 200);
                assert.ok(!existe);
            });

            it('Devuelve 404 si el producto no existe en el cart', async () => {
                const cid = cartEnDb.id;
                const pid = 'idInvalido-sfei';

                const url = `/api/carts/${cid}/product/${pid}`;

                const { _body, statusCode } = await httpClient.delete(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                assert.equal(statusCode, 404);

            });

            it('Vacía el carrito si no se pasa id de producto, devuelve status 200', async () => {
                const cid = cartEnDb.id;
                const url = `/api/carts/${cid}/product`;

                const { _body, statusCode } = await httpClient.delete(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                const cart = await cartManagerMongo.readOne({ id: cid });
                assert.equal(statusCode, 200);
                assert.equal(cart.productos.length, 0);
            });

        });

        describe.only('GET /api/carts/:cid/purchase', () => {
            let productosEnDb;
            let cartEnDb;

            before(async () => {
                await loguearUsuarios(cookieAdmin, cookieUser);

            });

            after(async () => {
                await usersDaoMongoose.deleteMany({});

            });

            beforeEach(async () => {
                const prods = crearMockProducto(10);
                // Generar producto sin stock para que falle la compra
                prods[0].stock = 10;
                prods[1].stock = 0;
                prods[2].stock = 10;
                prods.forEach(async elem => await insertIntoMongoDb(elem, 'productos'));
                productosEnDb = prods.map(x => x.id);
                // Agregar un cart directamente a la base de datos con el owner del USUARIO_TEST_2
                const prodsenCart = productosEnDb.slice(0, 3).map((prod, index) => {
                    return { id: prod, quantity: index + 1 };
                });
                cartEnDb = {
                    productos: prodsenCart,
                    cartOwner: USUARIO_TEST_2.inputCorrecto.id,
                    id: 'sd342lskdf23jsdf3j'
                };
                await cartManagerMongo.create(cartEnDb);
            });

            afterEach(async () => {
                await cartManagerMongo.deleteMany({});
                await managerProductosMongo.deleteMany({});
            });


            it('Genera una compra a partir de un cart con productos, devuelve el ticket de la compra y status 200', async () => {
                const cid = cartEnDb.id;
                const url = `/api/carts/${cid}/purchase`;

                const { _body, statusCode } = await httpClient.get(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                assert.equal(statusCode, 200);
                assert.equal(_body.purchaser, USUARIO_TEST_2.inputCorrecto.email);

            });

            it('Disminuye los stocks en la base de datos de productos', async () => {
                const cid = cartEnDb.id;
                const url = `/api/carts/${cid}/purchase`;

                const { _body, statusCode } = await httpClient.get(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                const prod1 = await managerProductosMongo.readOne({ id: productosEnDb[0] });
                const prod2 = await managerProductosMongo.readOne({ id: productosEnDb[1] });
                const prod3 = await managerProductosMongo.readOne({ id: productosEnDb[2] });

                assert.equal(prod1.stock, 9);
                assert.equal(prod2.stock, 0);
                assert.equal(prod3.stock, 7);
            });


            it('Mantiene en el cart sólo los productos que no tienen stock suficiente para completar la compra', async () => {
                const cid = cartEnDb.id;
                const url = `/api/carts/${cid}/purchase`;

                await httpClient.get(url).set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                const cartActualizado = await cartManagerMongo.readOne({ id: cid });
                const prodsActualizados = cartActualizado.productos;

                assert.equal(prodsActualizados.length, 1);
                assert.equal(prodsActualizados[0].id, productosEnDb[1]);

            });
        });


    });


});


