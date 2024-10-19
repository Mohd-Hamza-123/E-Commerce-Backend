import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductModel',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    orderItems: {
        type: [orderItemSchema],
    }

})

export const OrderModel = mongoose.model('OrderModel', orderSchema)