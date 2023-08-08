import assert from 'node:assert';
import supertest from 'supertest';
import { usersDaoMongoose } from '../../src/DAO/usersDaoMongoose.js';
import { cartManagerMongo } from '../../src/DAO/CartManagerMongo.js';
import { USUARIO_TEST, USUARIO_TEST_2 } from '../../src/models/userModel.js';
import { fetchFromMongoDb, insertIntoMongoDb } from '../../src/utils/mongooseUtils.js';
import { hashear } from '../../src/utils/criptografia.js';

const httpClient = supertest('http://localhost:8080');

describe('api rest', () => {
    describe('/api/carts', () => {
        let cookieAdmin;         // el GET de lista de carts requiere un usuario administrador
        let cookieUser;
        let productoEnDb;
        async function loguearUsuarios() {
            // Crear un usuario admin para consultar carts
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


        describe('GET lista de carts', () => {
            before(loguearUsuarios);
            after(async () => {
                await usersDaoMongoose.deleteMany({});
            });

            it.only('Devuelve la  lista de carts, statusCode:200', async () => {
                const { _body, statusCode } = await httpClient.get('/api/carts').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]);
            });

            it.only('Devuelve status 401 si el usuario no es admin', async () => {
                const { _body, statusCode } = await httpClient.get('/api/carts').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]);

                assert.equal(statusCode, 401);
            });


            it.only('Devuelve status 401 si no hay usuario logueado', async () => {
                const { statusCode } = await httpClient.get('/api/carts');
                assert.equal(statusCode, 401);
            });
        });

        describe('POST', () => {
            before(loguearUsuarios);
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


            it.only('Crea un cart nuevo - Devuelve el cart creado y status 201', async () => {
                let { _body, statusCode } = await httpClient.post('/api/carts').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]).send({ owner: USUARIO_TEST.inputCorrecto.id });

                const { cartOwner, productos } = _body;
                assert.ok(productos instanceof Array && productos.length == 0);
                assert.equal(cartOwner, USUARIO_TEST.inputCorrecto.id);
                assert.equal(statusCode, 201);

            });

            it.only('Devuelve status 400 si se intenta crear cart de un usuario que ya lo tiene', async () => {
                let { statusCode } = await httpClient.post('/api/carts').set('Cookie', [`${cookieUser.name}=${cookieUser.value}`]).send({ owner: USUARIO_TEST_2.inputCorrecto.id });
                assert.equal(statusCode, 400);
            });

            it.only('Devuelve status 401 si no hay usuario logueado', async () => {
                let { statusCode } = await httpClient.post('/api/carts').send({ owner: USUARIO_TEST_2.inputCorrecto.id });
                assert.equal(statusCode, 401);
            });
        });

    });
});





