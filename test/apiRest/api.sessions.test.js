import assert from 'node:assert';
import supertest from 'supertest';
import { usersDaoMongoose } from '../../src/DAO/usersDaoMongoose.js';
import { USUARIO_TEST } from '../../src/models/userModel.js';
import { fetchFromMongoDb, insertIntoMongoDb } from '../../src/utils/mongooseUtils.js';
import { hashear } from '../../src/utils/criptografia.js';


const httpClient = supertest('http://localhost:8080');

describe('api rest', () => {
    describe('/api/sessions', () => {
        let cookie;
        beforeEach(async () => {
            await usersDaoMongoose.deleteMany({});
            await httpClient.post('/api/users').send(USUARIO_TEST.inputCorrecto);
        });

        afterEach(async () => {
            await usersDaoMongoose.deleteMany({});
        });

        describe('login', () => {
            it('Debe loguear correctamente al usuario y Devolver una cookie', async () => {
                const datosLogin = {
                    email: USUARIO_TEST.inputCorrecto.email,
                    password: USUARIO_TEST.inputCorrecto.password
                };
                const result = await httpClient.post('/api/sessions/login').send(datosLogin);
                const cookieResult = result.headers['set-cookie'][0];
                assert.ok(cookieResult);
                cookie = {
                    name: cookieResult.split('=')[0],
                    value: cookieResult.split('=')[1]
                };

                assert.ok(cookie.name);
                assert.equal(cookie.name, 'jwt');
                assert.ok(cookie.value);
            });

        });

        describe('current', () => {
            it('Envía la cookie que contiene el jwt y desestructura el usuario correctamente', async () => {
                const { _body } = await httpClient.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
                assert.equal(_body.email, USUARIO_TEST.inputCorrecto.email);
            });

            it('Devuelve status:401 Unauthorized si el jwt está adulterado, un estado de error', async () => {
                const response = await httpClient.get('/api/sessions/current').set('Cookie', [`${cookie.name}=ñdlk3jfs309fsñdj33o4ijdsñkj33ñsdkjfijsñjef`]);
                assert.equal(response.statusCode, 401);
                assert.ok(!response.body.email);
            });


        });

        describe('logout', () => {
            it('Elimina la cookie que contiene el jwt, status: 200', async () => {
                const response = await httpClient.get('/api/sessions/logout').set('Cookie', [`${cookie.name}=${cookie.value}`]);

                assert.equal(response.statusCode, 200);

                const cookieResult = response.headers['set-cookie'][0];
                cookie = {
                    name: cookieResult.split('=')[0],
                    value: cookieResult.split('=')[1]
                };

                const { _body } = await httpClient.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
                assert.ok(!_body.email);
            });
        });

    });
});



