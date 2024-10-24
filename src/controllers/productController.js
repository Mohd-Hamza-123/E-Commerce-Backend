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
exports.createDummyProduct = exports.getSingleProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const validationHelper_1 = require("../helpers/validationHelper");
const product_model_1 = require("../models/product.model");
const images_payload_helper_1 = require("../helpers/images-payload-helper");
const category_model_1 = require("../models/category.model");
const user_model_1 = require("../models/user.model");
const filter_truthy_values_1 = require("../helpers/filter-truthy-values");
const connectCloudinary_1 = require("../config/connectCloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
const createDummyProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        function createProductInDatabase() {
            return __awaiter(this, void 0, void 0, function* () {
                const pic = yield fetch(`https://picsum.photos/300/300`);
                if (!pic.ok)
                    throw new Error(`Failed to fetch image: ${pic.status}`);
                const picURL = pic.url;
                const catArray = ['66e053d2d025034927bb7ff1', '66e053e5d025034927bb7ff5', '66f8cf96e9a55bcfceb0840b', '66f8dace8413c0d30fe0fbc5', '66f8e43a275caee1c6245ffb'];
                const RESPONSE = yield fetch('https://random-data-api.com/api/commerce/random_commerce');
                if (!RESPONSE.ok)
                    throw new Error("Jsonplaceholder error");
                const data = yield RESPONSE.json();
                const name = data === null || data === void 0 ? void 0 : data.product_name;
                const price = Math.floor((data === null || data === void 0 ? void 0 : data.price) + 100);
                const inStock = true;
                const isPublished = true;
                const brand = data === null || data === void 0 ? void 0 : data.department;
                const quantity = Math.floor(Number(data === null || data === void 0 ? void 0 : data.price_string));
                const colors = [data === null || data === void 0 ? void 0 : data.color];
                const discountPrice = Math.floor((data === null || data === void 0 ? void 0 : data.price) + 100 - 33);
                const productOwner = new mongoose_1.default.Types.ObjectId('66ea5e8fe77b498f96d17ea4');
                const category = new mongoose_1.default.Types.ObjectId(catArray[Math.floor(Math.random() * catArray.length)]);
                const description = `Random Number = ${Math.floor(Math.random() * 1001)}.This is a Random Description`;
                const thumbnail = [{
                        public_id: String(data === null || data === void 0 ? void 0 : data.id),
                        secure_url: picURL
                    }];
                const creatingProduct = new product_model_1.ProductModel({
                    name,
                    description,
                    price,
                    inStock,
                    isPublished,
                    brand,
                    quantity,
                    category,
                    thumbnail,
                    colors,
                    discountPrice,
                    productOwner,
                });
                const product_created = yield creatingProduct.save();
                return product_created;
            });
        }
        for (let i = 0; i < 50; i++) {
            const product = yield createProductInDatabase();
            if (product) {
                // console.log(product)
                console.log(`Product Created. No = ${i + 1}`);
            }
            else {
                console.log("Product not created");
            }
        }
        return res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        console.error("Error details:", error); // Log the error to console
        return res.status(500).json({
            message: "Error in creating product",
            error: error.message || "Unknown error", // Provide a fallback message
        });
    }
});
exports.createDummyProduct = createDummyProduct;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files)
            throw new Error;
        const f = req.files;
        const { productOwnerID, category, discount } = req.body;
        const error = (0, validationHelper_1.validateProductsCreation)(req.body);
        if (error)
            return res.status(400).json({
                success: false,
                message: "Product Validation Failed",
                error
            });
        const productOwner = yield user_model_1.UserModel.findById(productOwnerID);
        const categoryExist = yield category_model_1.CategoryModel.findOne({ name: category });
        const categoryID = categoryExist === null || categoryExist === void 0 ? void 0 : categoryExist._id;
        if (!categoryID || !productOwner)
            throw new Error("Check the fields again");
        let images = f['images'];
        let thumbnail = f['thumbnail'];
        if (thumbnail)
            thumbnail = yield (0, images_payload_helper_1.uploadImages)(thumbnail);
        if (images)
            images = yield (0, images_payload_helper_1.uploadImages)(images);
        const creatingProduct = new product_model_1.ProductModel(Object.assign(Object.assign({}, req.body), { category: categoryID, images,
            thumbnail, productOwner: productOwner === null || productOwner === void 0 ? void 0 : productOwner._id, discount: JSON.parse(discount) || {} }));
        const product_created = yield creatingProduct.save();
        if (!product_created)
            throw new Error("Product not created");
        return res.status(200).json({
            success: true,
            message: "Product Created",
            product: product_created
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Product not Created",
            error
        });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const files = req.files;
        const product = yield product_model_1.ProductModel.findById(id);
        if (!product)
            throw new Error("Product not exist");
        let prevThumbnail = (product === null || product === void 0 ? void 0 : product.thumbnail) || [];
        let prevImages = (product === null || product === void 0 ? void 0 : product.images) || [];
        const updatedObject = {};
        const truthyObject = (0, filter_truthy_values_1.filterTruthyValues)(Object.assign({}, req.body));
        // DELETING THUMBNAIL
        if (truthyObject === null || truthyObject === void 0 ? void 0 : truthyObject.deleteThumbnail) {
            const thumbnail_ID = truthyObject === null || truthyObject === void 0 ? void 0 : truthyObject.deleteThumbnail;
            if (yield (0, connectCloudinary_1.deleteFile)(thumbnail_ID)) {
                prevThumbnail = prevThumbnail.filter((thumbnailObj) => thumbnailObj.public_id !== thumbnail_ID);
            }
            updatedObject.thumbnail = [...prevThumbnail];
        }
        // DELETING IMAGES
        if (truthyObject === null || truthyObject === void 0 ? void 0 : truthyObject.deleteImages) {
            let images_ID_Array = truthyObject.deleteImages;
            if (!Array.isArray(images_ID_Array))
                images_ID_Array = [images_ID_Array];
            for (const public_id of images_ID_Array) {
                if (yield (0, connectCloudinary_1.deleteFile)(public_id)) {
                    prevImages = prevImages.filter((img) => img.public_id !== public_id);
                }
            }
            updatedObject.images = [...prevImages];
        }
        if (files) {
            for (const [key, value] of Object.entries(files)) {
                if (key === "thumbnail") {
                    if (value && Array.isArray(value)) {
                        const thumbnail = yield (0, images_payload_helper_1.uploadImages)(value);
                        console.log(thumbnail);
                        if (!thumbnail)
                            return res.status(400).send({ success: false, message: 'Error in uploading images' });
                        updatedObject.thumbnail = thumbnail;
                    }
                }
                if (key === "images") {
                    if (value && Array.isArray(value)) {
                        const images = yield (0, images_payload_helper_1.uploadImages)(value);
                        if (!images)
                            return res.status(400).send({ success: false, message: 'Error in uploading images' });
                        updatedObject.images = [...prevImages, ...images];
                    }
                    else {
                        updatedObject.images = [...prevImages];
                    }
                }
            }
        }
        // UPDATING CATEGORY
        if (truthyObject === null || truthyObject === void 0 ? void 0 : truthyObject.category) {
            const category = yield category_model_1.CategoryModel.findOne({ name: truthyObject.category });
            if (category)
                updatedObject.category = category === null || category === void 0 ? void 0 : category._id;
        }
        updatedObject === null || updatedObject === void 0 ? true : delete updatedObject.deleteImages;
        let payload = Object.assign(truthyObject, updatedObject);
        if (payload === null || payload === void 0 ? void 0 : payload.discount)
            payload.discount = JSON.parse(payload.discount);
        if (payload === null || payload === void 0 ? void 0 : payload.isPublished)
            payload.isPublished = Boolean(payload.isPublished);
        if (payload === null || payload === void 0 ? void 0 : payload.discountPrice)
            payload.discountPrice = Number(payload.discountPrice);
        if (payload === null || payload === void 0 ? void 0 : payload.quantity)
            payload.quantity = Number(payload.quantity);
        if (payload === null || payload === void 0 ? void 0 : payload.price)
            payload.price = Number(payload.price);
        if (payload === null || payload === void 0 ? void 0 : payload.inStock)
            payload.inStock = Boolean(payload.inStock);
        const products_updated = yield product_model_1.ProductModel.findByIdAndUpdate(product._id, {
            $set: Object.assign({}, payload)
        }, { new: true }).lean();
        // console.log(products_updated)
        if (!products_updated)
            throw new Error("Product not updated");
        return res.status(200).json({
            success: true,
            message: "Products updated successfully",
            products_updated
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product not updated"
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            throw new Error("Product not found");
        const product = yield product_model_1.ProductModel.findByIdAndDelete(id);
        if (!product)
            throw new Error("Product not deleted");
        const imagesArray = product.images;
        const imageDeletion = imagesArray.map((object) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, connectCloudinary_1.deleteFile)(object.public_id); }));
        const results = yield Promise.all(imageDeletion);
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product not deleted",
            error: error
        });
    }
});
exports.deleteProduct = deleteProduct;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        if (!id)
            throw new Error("Product not found");
        const product = yield product_model_1.ProductModel.findById(id);
        if (!product) {
            return res.status(400).json({
                success: true,
                message: "Product not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    }
    catch (error) {
        return res.status(400).json({
            success: true,
            message: "Product not found",
            error
        });
    }
});
exports.getSingleProduct = getSingleProduct;
