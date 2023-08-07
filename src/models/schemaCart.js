import mongoose, { Schema, model } from 'mongoose';
const cartsCollection = 'carts';

const schemaCart = new mongoose.Schema(
    {
        productos: [
            {
                _id: {
                    type: Schema.Types.ObjectId,
                    ref: 'productos'
                },
                quantity: { type: Number, required: true }
            }
        ],
        cartOwner: {
            type: String,
            ref: 'usuarios'
        },
        id: { type: String, required: true }
    },
    { versionKey: false }
);

schemaCart.pre(/^find/, function (next) {
    this.populate('productos._id');
    next();
});

const cartModel = model(cartsCollection, schemaCart);
export default cartModel;
