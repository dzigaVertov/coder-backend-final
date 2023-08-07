import mongoose from 'mongoose';
import { MONGODB_STRING_CONEXION, MONGODB_STRING_CONEXION_ALT } from '../config/mongodb.config.js';

async function conectar() {
    try {
        await mongoose.connect(MONGODB_STRING_CONEXION);
        console.log(`Base de datos conectada a ${MONGODB_STRING_CONEXION}`);
    } catch (error) {
        await mongoose.connect(MONGODB_STRING_CONEXION_ALT);
        console.log(`Base de datos conectada a ${MONGODB_STRING_CONEXION_ALT}`);
    };

}

await conectar();
export default mongoose;
