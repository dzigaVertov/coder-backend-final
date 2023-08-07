import { Schema, model } from 'mongoose';

const schemaTicket = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
},
    { versionKey: false }
);

export const ticketMongooseModel = model('tickets', schemaTicket);
