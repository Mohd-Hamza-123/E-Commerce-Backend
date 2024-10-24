"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
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
});
exports.CategoryModel = mongoose_1.default.model("CategoryModel", categorySchema);
