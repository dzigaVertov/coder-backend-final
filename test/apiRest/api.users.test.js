import assert, { equal } from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { usersDaoMongoose } from '../../src/DAO/usersDaoMongoose.js';
import { USUARIO_TEST, USUARIO_TEST_2 } from '../../src/models/userModel.js';
import { loguearUsuarios } from '../utils/usersUtils.js';



const httpClient = supertest('http://localhost:8080');

describe('api rest', () => {

    describe('/api/users', () => {

        describe('GET /', () => {
            let cookieAdmin = {};
            let cookieUser = {};

            before(async () => {
                await loguearUsuarios(cookieAdmin, cookieUser);
            });

            after(async () => {
                await usersDaoMongoose.deleteMany({});
            });

            it('Devuelve una lista de los usuarios registrados, no incluye datos confidenciales status 200', async () => {
                const { _body, statusCode } = await httpClient.get('/api/users').set('Cookie', [`${cookieAdmin.name}=${cookieAdmin.value}`]);

                assert.equal(statusCode, 200);
                assert.equal(_body.length, 2);

                _body.forEach(x => {
                    assert.ok(x.first_name);
                    assert.ok(x.last_name);
                    assert.ok(x.email);
                    assert.ok(x.age);
                    assert.ok(x.role);
                    assert.ok(!x.password);
                });
            });

        });

        describe('POST', () => {
            describe('Envío de petición con input correcto', () => {
                it('Creación de usuario, status: 201, body:dto', async () => {

                    const response = await httpClient.post('/api/users').send(USUARIO_TEST.inputCorrecto);
                    assert.equal(response.statusCode, 201);
                    assert.deepEqual(USUARIO_TEST.dto, response.body);

                });
            });

            describe('Envío de petición con input incorrecto', () => {
                it('devuelve error - statusCode: 400', async () => {
                    const response = await httpClient.post('/api/users').send(USUARIO_TEST.mailIncorrecto);
                    assert.equal(response.statusCode, 400);
                });
            });
        });

        describe('GET userId', () => {
            beforeEach(async () => {
                const datosUsuario = USUARIO_TEST.inputCorrecto;
                await usersDaoMongoose.create(datosUsuario);
            });

            afterEach(async () => {
                await usersDaoMongoose.deleteMany({});
            });
            describe('Envío de petición con id en req params:', () => {
                it('Devuelve dto de usuario y statusCode 200', async () => {
                    const urlstring = '/api/users/' + USUARIO_TEST.inputCorrecto.id;
                    const response = await httpClient.get(urlstring);
                    assert.equal(response.statusCode, 200);
                    assert.deepEqual(response.body, USUARIO_TEST.datos);
                });
            });

        });

        describe('PUT', () => {
            beforeEach(async () => {
                const datosUsuario = USUARIO_TEST.inputCorrecto;
                await usersDaoMongoose.create(datosUsuario);
            });

            afterEach(async () => {
                await usersDaoMongoose.deleteMany({});
            });

            it('Actualiza campos del usuario logueado, devuelve datos actualizados, status 200', async () => {

            });

        });
    });
});



