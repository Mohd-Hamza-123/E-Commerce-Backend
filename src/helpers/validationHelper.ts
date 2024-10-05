import Joi from "joi"
import { Request } from "express";

const validateRegistration = (req: Request) => {
    const schema = Joi.object({
        username: Joi.string().required().min(4).max(30).trim(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8).max(100),
        confirm_password: Joi.string().required().min(8).max(100),
    });

    const { error } = schema.validate(req.body);
    return error
}

const validateLogin = (req: Request) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8).max(100)
    })

    const { error } = schema.validate(req.body);
    return error
}

const validateProductsCreation = (req: Request) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        price: Joi.number().min(1),
        description: Joi.string().required().trim(),
        isAvailable: Joi.boolean().required(),
        slug: Joi.string().required().trim(),
        category: Joi.required(),
        brand: Joi.string().required().trim(),
        quantity: Joi.number().min(0),
        colors: Joi.array(),
        
        discountPrice:Joi.number(),
    })
    const { error } = schema.validate(req.body);
    return error
}

export {
    validateRegistration,
    validateLogin,
    validateProductsCreation
}