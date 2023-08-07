import mongoose from 'mongoose';

const schemaUsuario = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true }, // hasheado
    cart: { type: String },
    role: { type: String, enum: ['user', 'admin'], required: true, default: 'user' },
    id: { type: String, required: true }

}, { versionKey: false });

export const usuarioSchemaModel = mongoose.model('usuarios', schemaUsuario);


