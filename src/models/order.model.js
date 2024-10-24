"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'ProductModel',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});
const orderSchema = new mongoose_1.default.Schema({
    orderPrice: {
        type: Number,
        required: true,
    },
    customer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    orderItems: {
        type: [orderItemSchema],
    }
});
exports.OrderModel = mongoose_1.default.model('OrderModel', orderSchema);
