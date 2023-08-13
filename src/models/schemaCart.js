import mongoose, { Schema, model } from 'mongoose';
const cartsCollection = 'carts';

const schemaCartProd = new mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    quantity: { type: Number, required: true }
});

schemaCartProd.virtual('producto', {
    ref: 'productos',
    localField: 'id',
    foreignField: 'id',
    justOne: true
});

const schemaCart = new mongoose.Schema(
    {
        productos: [schemaCartProd],
        cartOwner: String,
        id: { type: String, required: true }
    },
    { versionKey: false }
);

schemaCartProd.set('toObject', { virtuals: true });
schemaCartProd.set('toJSON', { virtuals: true });

schemaCart.pre(/^find/, function (next) {
    this.populate('productos.producto', '-_id');
    next();
});

const cartModel = model(cartsCollection, schemaCart);
export default cartModel;
