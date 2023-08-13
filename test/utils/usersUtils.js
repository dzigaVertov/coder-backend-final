import assert from 'node:assert';
import supertest from 'supertest';
import { usersDaoMongoose } from '../../src/DAO/usersDaoMongoose.js';
import { cartManagerMongo } from '../../src/DAO/CartManagerMongo.js';
import { USUARIO_TEST, USUARIO_TEST_2 } from '../../src/models/userModel.js';
import { fetchFromMongoDb, insertIntoMongoDb } from '../../src/utils/mongooseUtils.js';
import { hashear } from '../../src/utils/criptografia.js';


const httpClient = supertest('http://localhost:8080');


export async function loguearUsuarios(cookieAdmin, cookieUser) {
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
    cookieAdmin.name = cookieResult.split('=')[0];
    cookieAdmin.value = cookieResult.split('=')[1];

    // Loguear role: user
    const datosLoginUser = {
        email: USUARIO_TEST_2.inputCorrecto.email,
        password: USUARIO_TEST_2.inputCorrecto.password
    };
    const resultUser = await httpClient.post('/api/sessions/login').send(datosLoginUser);
    const cookieResultUser = resultUser.headers['set-cookie'][0];
    cookieUser.name = cookieResultUser.split('=')[0];
    cookieUser.value = cookieResultUser.split('=')[1];
}
