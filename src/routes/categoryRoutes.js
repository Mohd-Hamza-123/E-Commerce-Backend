"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/temp');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 } });
// public routes
router.get("/get-category", categoryController_1.getAllCategory);
router.get("/single-category/:slug", categoryController_1.getSingleCategory);
// protected Routes
router.post("/create-category", upload.single("image"), auth_middleware_1.checkUserAuthorized, auth_middleware_1.userIsSuperUser, categoryController_1.createCategory);
router.put("/update-category/:categoryID", upload.single("image"), auth_middleware_1.checkUserAuthorized, auth_middleware_1.userIsSuperUser, categoryController_1.updateCategory);
router.delete("/delete-category/:categoryID", auth_middleware_1.checkUserAuthorized, auth_middleware_1.userIsSuperUser, categoryController_1.deleteCategory);
exports.default = router;
