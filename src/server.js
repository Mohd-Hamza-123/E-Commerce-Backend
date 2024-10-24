"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.EMAIL_FROM = exports.EMAIL_PASSWORD = exports.EMAIL_USER = exports.EMAIL_PORT = exports.EMAIL_HOST = exports.jwt_secret_key = exports.mongoDBURI = exports.port = exports.client_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = __importDefault(require("./config/connectDB"));
const mail_send_1 = require("./config/mail-send");
const app_1 = require("./app");
const connectCloudinary_1 = require("./config/connectCloudinary");
// configuring env
dotenv_1.default.config({ path: './.env' });
// Env Variables
exports.client_URL = process.env.CLIENT_URL;
exports.port = process.env.PORT || 4000;
exports.mongoDBURI = process.env.MONGO_URI;
exports.jwt_secret_key = process.env.JWT_SECRET_KEY;
exports.EMAIL_HOST = process.env.EMAIL_HOST;
exports.EMAIL_PORT = process.env.EMAIL_PORT;
exports.EMAIL_USER = process.env.EMAIL_USER;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
exports.EMAIL_FROM = process.env.EMAIL_FROM;
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
// console.log(EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME)
(0, connectDB_1.default)()
    .then(() => {
    app_1.app.listen(exports.port, () => {
        console.log(`Server is running at port : ${exports.port}`);
    });
})
    .then(() => {
    (0, mail_send_1.connect_nodemailer)();
})
    .then(() => {
    (0, connectCloudinary_1.connectCloudinary)();
})
    .catch((err) => {
    console.log(err);
});
