"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const multer_1 = __importDefault(require("multer"));
// import { uploadFile } from "../middlewares/file-middleware";
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/temp');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 } });
exports.upload = upload;
const router = (0, express_1.Router)();
// public routes
router.get('/get-single-product/:id', productController_1.getSingleProduct);
router.post('/create-dummy', productController_1.createDummyProduct);
// protected routes
router.post('/create-product', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), auth_middleware_1.checkUserAuthorized, auth_middleware_1.userIsAdminOrSuperUser, productController_1.createProduct);
router.put('/update-product/:id', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), auth_middleware_1.checkUserAuthorized, auth_middleware_1.userIsAdminOrSuperUser, productController_1.updateProduct);
router.delete('/delete-product/:id', productController_1.deleteProduct);
exports.default = router;
