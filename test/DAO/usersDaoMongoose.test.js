import { after, before, beforeEach, describe, it } from "mocha";
import { usuarioSchemaModel } from '../../src/models/schemaUsuario.js';
import { usersDaoMongoose } from '../../src/DAO/usersDaoMongoose.js';
import mongoose from "mongoose";
import assert from 'node:assert';
import { fetchFromMongoDb, insertIntoMongoDb } from '../../src/utils/mongooseUtils.js';
import { MONGODB_STRING_CONEXION } from "../../src/config/mongodb.config.js";
import { USUARIO_TEST, USUARIO_TEST_2 } from '../../src/models/userModel.js'
import { InvalidOperationError } from "../../src/models/errors/InvalidOperation.error.js";
import { InvalidArgumentError } from "../../src/models/errors/InvalidArgument.error.js";
import { NotFoundError } from "../../src/models/errors/NotFound.error.js";


// before(async () => {

//     await mongoose.connect(MONGODB_STRING_CONEXION);
// })

// after(async () => {
//     await mongoose.connection.close();
// })




describe('DAO de Users Mongoose', () => {
    beforeEach(async () => {
        await mongoose.connection.collection('usuarios').deleteMany({});
    })
    describe('create', () => {
        describe('Creación de un usuario genérico', () => {
            it('Lo Almacena - Lo Devuelve correctamente como objeto plano', async () => {
                const usuarioCreado = await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);
                assert.deepEqual(USUARIO_TEST.inputCorrecto, usuarioCreado);
                const usuarioGuardado = await fetchFromMongoDb(USUARIO_TEST.inputCorrecto, 'usuarios');
                assert.deepEqual(usuarioCreado, usuarioGuardado);
            })

            it('Lanza error si el usuario ya existe', async () => {
                await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);
                await assert.rejects(usersDaoMongoose.create(USUARIO_TEST.inputCorrecto), err => err instanceof InvalidOperationError);
            })

            it('Lanza error si el input es incorrecto', async () => {
                await assert.rejects(usersDaoMongoose.create(USUARIO_TEST.rolIncorrecto), err => err instanceof InvalidArgumentError);
                await assert.rejects(usersDaoMongoose.create(USUARIO_TEST.ageIncorrecto), err => err instanceof InvalidArgumentError);
            })
        })
    })

    describe('readOne', () => {
        it('Recupera un usuario almacenado', async () => {
            await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);
            const usuarioRecuperado = await usersDaoMongoose.readOne(USUARIO_TEST.inputCorrecto);
            assert.deepEqual(USUARIO_TEST.inputCorrecto, usuarioRecuperado);
        });
        it('Devuelve un objeto plano sin campos extra', async () => {
            await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);
            const usuarioRecuperado = await usersDaoMongoose.readOne(USUARIO_TEST.inputCorrecto);
            assert.deepEqual(USUARIO_TEST.inputCorrecto, usuarioRecuperado);
        });
        it('Lanza un error NotFoundError si no encuentra el usuario', async () => {
            await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);
            await assert.rejects(usersDaoMongoose.readOne({ id: 'xxxxxxxxxxxxxxx' }), err => err instanceof NotFoundError);
        });
    })

    describe('readMany', () => {
        beforeEach(async () => {
            await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);
            await usersDaoMongoose.create(USUARIO_TEST_2.inputCorrecto);
        })
        it('Recupera usuarios según criterio, devuelve objetos planos sin campos extras', async () => {
            const usuariosRecuperados = await usersDaoMongoose.readMany({ role: 'user' });
            assert.deepEqual([USUARIO_TEST.inputCorrecto, USUARIO_TEST_2.inputCorrecto], usuariosRecuperados);
        });

        it('Lanza un error NotFoundError si no encuentra usuarios', async () => {
            await assert.rejects(usersDaoMongoose.readMany({ role: 'barista' }), err => err instanceof NotFoundError);

        })
    })

    describe('updateOne', () => {
        beforeEach(async () => {
            await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);

        });

        it('Actualiza los campos de un y solo un usuario', async () => {
            const name = USUARIO_TEST.inputCorrecto.first_name;
            const resultado = await usersDaoMongoose.updateOne({ first_name: name }, { age: 89 });
            assert.equal(resultado.matchedCount, 1);
            let actualizadoEnDb = await fetchFromMongoDb({ first_name: name }, 'usuarios');
            let actualizadoCorrecto = { ...USUARIO_TEST.inputCorrecto };
            actualizadoCorrecto.age = 89;
            assert.deepEqual(actualizadoEnDb, actualizadoCorrecto);

        });
        it('Lanza un error NotFoundError si no encuentra el usuario', async () => {
            await assert.rejects(usersDaoMongoose.updateOne({ first_name: 'Marilina' }, { age: 27 }), err => err instanceof NotFoundError);
        });
    })

    describe('updateMany', () => {
        beforeEach(async () => {
            await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);
            await usersDaoMongoose.create(USUARIO_TEST_2.inputCorrecto);
        })
        it('Actualiza los campos de uno o más usuarios', async () => {
            const resultado = await usersDaoMongoose.updateMany({ role: "user" }, { first_name: 'Atahualpa' });
            assert.equal(resultado.matchedCount, 2);
            let actualizadoCorrecto1 = { ...USUARIO_TEST.inputCorrecto, first_name: 'Atahualpa' };
            let actualizadoCorrecto2 = { ...USUARIO_TEST_2.inputCorrecto, first_name: 'Atahualpa' };
            const recuperados = await usersDaoMongoose.readMany({ first_name: 'Atahualpa' }, 'usuarios');
            assert.deepEqual([actualizadoCorrecto1, actualizadoCorrecto2], recuperados);
        });
        it('Lanza un NotFoundError si no encuentra ningún usuario', async () => {
            await assert.rejects(usersDaoMongoose.updateMany({ first_name: 'Fernandito' }, { last_name: 'De La Rúa' }), err => err instanceof NotFoundError);
        });
    })

    describe('findOneAndUpdate', () => {
        beforeEach(async () => {
            await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);

        });

        it('Actualiza los campos de un y solo un usuario y lo devuelve actualizado', async () => {
            const name = USUARIO_TEST.inputCorrecto.first_name;
            const usuariodevuelto = await usersDaoMongoose.findOneAndUpdate({ first_name: name }, { age: 89 });
            let actualizadoEnDb = await fetchFromMongoDb({ first_name: name }, 'usuarios');
            let actualizadoCorrecto = { ...USUARIO_TEST.inputCorrecto, age: 89 };

            assert.deepEqual(actualizadoEnDb, actualizadoCorrecto);
            assert.deepEqual(usuariodevuelto, actualizadoCorrecto);

        });
        it('Lanza un error NotFoundError si no encuentra el usuario', async () => {
            await assert.rejects(usersDaoMongoose.findOneAndUpdate({ first_name: 'Marilina' }, { age: 27 }), err => err instanceof NotFoundError);
        });
    });

    describe('deleteOne', () => {
        beforeEach(async () => {
            await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);

        });

        it('Elimina un usuario de la base y lo devuelve', async () => {
            const nombre = USUARIO_TEST.inputCorrecto.first_name;
            const usuarioDevuelto = await usersDaoMongoose.deleteOne({ first_name: nombre });
            assert.deepEqual(usuarioDevuelto, USUARIO_TEST.inputCorrecto);
            await assert.rejects(usersDaoMongoose.readOne({ first_name: nombre }), err => err instanceof NotFoundError);
        })

        it('Lanza un error NotFoundError si no encuentra el usuario', async () => {
            await assert.rejects(usersDaoMongoose.deleteOne({ first_name: 'xxxxxxxx' }), err => err instanceof NotFoundError);
        })

    });

    describe('deleteMany', () => {
        beforeEach(async () => {
            await usersDaoMongoose.create(USUARIO_TEST.inputCorrecto);
            await usersDaoMongoose.create(USUARIO_TEST_2.inputCorrecto);
        })
        it('Elimina uno o más usuarios de la base', async () => {
            const result = await usersDaoMongoose.deleteMany({ role: 'user' });
            assert.equal(result.deletedCount, 2);
            await assert.rejects(usersDaoMongoose.readMany({}), err => err instanceof NotFoundError);
        })
    });
})





