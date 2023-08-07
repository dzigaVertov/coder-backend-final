import mongoose from '../database/mongoose.js';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ObjectId } from 'mongodb';

const productsCollection = 'productos';
const campoRequerido = [true, "El campo es requerido"];

const schemaProducto = new mongoose.Schema(
    {
        title: {
            type: String,
            required: campoRequerido
        },
        description: {
            type: String,
            required: campoRequerido
        },
        price: {
            type: Number,
            required: campoRequerido
        },
        thumbnail: String,
        stock: {
            type: Number,
            required: campoRequerido
        },
        category: {
            type: String,
            required: campoRequerido
        },
        status: {
            type: String,
            required: campoRequerido
        },
        id: {
            type: String,
            required: campoRequerido
        }
    }, { versionKey: false }
);

schemaProducto.plugin(mongoosePaginate);
export const productModel = mongoose.model(productsCollection, schemaProducto);

