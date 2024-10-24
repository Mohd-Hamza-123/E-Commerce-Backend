"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProductsCreation = exports.validateLogin = exports.validateRegistration = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRegistration = (req) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required().min(4).max(30).trim(),
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().min(8).max(100),
        confirm_password: joi_1.default.string().required().min(8).max(100),
    });
    const { error } = schema.validate(req.body);
    return error;
};
exports.validateRegistration = validateRegistration;
const validateLogin = (req) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().min(8).max(100)
    });
    const { error } = schema.validate(req.body);
    return error;
};
exports.validateLogin = validateLogin;
const validateProductsCreation = (req) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().trim(),
        price: joi_1.default.number().min(1),
        description: joi_1.default.string().required().trim(),
        isAvailable: joi_1.default.boolean().required(),
        slug: joi_1.default.string().required().trim(),
        category: joi_1.default.required(),
        brand: joi_1.default.string().required().trim(),
        quantity: joi_1.default.number().min(0),
        colors: joi_1.default.array(),
        discountPrice: joi_1.default.number(),
    });
    const { error } = schema.validate(req.body);
    return error;
};
exports.validateProductsCreation = validateProductsCreation;
