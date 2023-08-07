import mongoose from 'mongoose';
import { MONGODB_STRING_CONEXION } from '../src/config/mongodb.config.js';

export const mochaHooks = {
    async beforeAll() {
        await mongoose.connect(MONGODB_STRING_CONEXION);

    },

    async afterAll() {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
}
