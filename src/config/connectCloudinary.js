"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadImageOnCloudinary = exports.connectCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const server_1 = require("../server");
const fs_1 = __importDefault(require("fs"));
// Configuration
function connectCloudinary() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            cloudinary_1.v2.config({
                cloud_name: server_1.CLOUDINARY_CLOUD_NAME,
                api_key: server_1.CLOUDINARY_API_KEY,
                api_secret: server_1.CLOUDINARY_API_SECRET
            });
            console.log('Cloudinary successfully configured.');
        }
        catch (error) {
            console.error('Error configuring Cloudinary:', error);
            throw new Error('Failed to configure Cloudinary. Please check your API credentials.');
        }
    });
}
exports.connectCloudinary = connectCloudinary;
// Upload an image
const uploadImageOnCloudinary = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadResult = yield cloudinary_1.v2.uploader.upload(filePath);
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
        return uploadResult;
    }
    catch (error) {
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
        return null;
    }
});
exports.uploadImageOnCloudinary = uploadImageOnCloudinary;
const deleteFile = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(publicId)
        const result = yield cloudinary_1.v2.uploader.destroy(publicId);
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.deleteFile = deleteFile;
