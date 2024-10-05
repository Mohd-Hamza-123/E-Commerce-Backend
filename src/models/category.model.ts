import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        unique: false,
        required: true,
        lowercase: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "None"]
    },
    image: {
        type: {
            public_id: String,
            secure_url: String
        },
        required: false,
        _id: false
    }
})

export const CategoryModel = mongoose.model("CategoryModel", categorySchema)