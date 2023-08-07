import mongoose from 'mongoose';

const schemaMensaje = new mongoose.Schema(
    {
        email : String,
        mensaje : String,
    },
    { versionKey: false }
);

export default schemaMensaje;
