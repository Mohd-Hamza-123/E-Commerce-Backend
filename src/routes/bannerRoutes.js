"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middlewares/auth-middleware");
const bannerController_1 = require("../controllers/bannerController");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/temp');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 } });
const router = (0, express_1.Router)();
router.post('/upload-crousal-images', upload.single("crousal_Images"), auth_middleware_1.checkUserAuthorized, auth_middleware_1.userIsSuperUser, bannerController_1.upload_Crousal_Images);
router.delete('/delete-crousal-images/:bannerID', auth_middleware_1.checkUserAuthorized, auth_middleware_1.userIsSuperUser, bannerController_1.delete_Crousal_Images);
exports.default = router;
