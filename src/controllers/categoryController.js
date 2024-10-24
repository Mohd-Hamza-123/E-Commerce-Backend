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
exports.getSingleCategory = exports.getAllCategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = void 0;
const slugify_1 = __importDefault(require("slugify"));
const category_model_1 = require("../models/category.model");
const filter_truthy_values_1 = require("../helpers/filter-truthy-values");
const connectCloudinary_1 = require("../config/connectCloudinary");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { role } = req;
        const { name, gender } = req.body;
        if (!role || role !== 'superUser')
            return res.status(403).json({
                success: false,
                message: "Permission denied.",
            });
        if (!name || !gender)
            return res.status(400).json({
                success: false,
                message: "Name and Gender are required fields.",
            });
        const existingCategory = yield category_model_1.CategoryModel.findOne({ name });
        if (existingCategory)
            return res.status(409).json({
                success: true,
                message: "Category Already Exists",
                payload: null,
            });
        const payloadToCreate = {
            name,
            gender,
            slug: (0, slugify_1.default)(name),
        };
        const imagePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (imagePath) {
            const uploadedImage = yield (0, connectCloudinary_1.uploadImageOnCloudinary)(imagePath);
            payloadToCreate.image = {
                public_id: uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.public_id,
                secure_url: uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url
            };
        }
        const creatingCategory = new category_model_1.CategoryModel(payloadToCreate);
        const createdCategory = yield creatingCategory.save();
        console.log(createdCategory);
        return res.status(201).json({
            success: true,
            message: "Category Created",
            payload: createdCategory
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
            error
        });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { categoryID } = req.params;
        if (req.role !== "superUser" || !categoryID)
            throw new Error("You are not authrorized");
        const { name, gender, imageDelete } = req.body;
        let image = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
        console.log(image);
        const updateFields = (0, filter_truthy_values_1.filterTruthyValues)(Object.assign({}, req.body));
        const deleteFields = {};
        if (updateFields === null || updateFields === void 0 ? void 0 : updateFields.deleteImage) {
            const public_id = updateFields === null || updateFields === void 0 ? void 0 : updateFields.deleteImage;
            console.log(public_id);
            if (yield (0, connectCloudinary_1.deleteFile)(public_id)) {
                console.log("imageDelete");
                deleteFields.image = "";
            }
            delete updateFields.deleteImage;
            delete updateFields.image;
        }
        if (image) {
            image = yield (0, connectCloudinary_1.uploadImageOnCloudinary)(image);
            if (image) {
                updateFields.image = image;
                deleteFields === null || deleteFields === void 0 ? true : delete deleteFields.image;
            }
        }
        const updatingCategory = yield category_model_1.CategoryModel.findByIdAndUpdate(categoryID, {
            $set: Object.assign({}, updateFields),
            $unset: Object.assign({}, deleteFields)
        }, { new: true }).lean();
        return res.status(200).json({
            category: updatingCategory,
            success: true,
            message: "Category Updated Successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "category not updated",
            error
        });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const role = req.role;
        const { categoryID } = req.params;
        if (role !== "superUser" || !categoryID)
            throw new Error;
        const deleteCategory = yield category_model_1.CategoryModel.findByIdAndDelete(categoryID);
        if (deleteCategory === null || deleteCategory === void 0 ? void 0 : deleteCategory.image) {
            const public_id = (_c = deleteCategory === null || deleteCategory === void 0 ? void 0 : deleteCategory.image) === null || _c === void 0 ? void 0 : _c.public_id;
            if (public_id)
                yield (0, connectCloudinary_1.deleteFile)(public_id);
        }
        if (!deleteCategory)
            throw new Error;
        return res.status(200).json({
            success: true,
            message: "Category Deleted Succesfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "category not deleted",
            error
        });
    }
});
exports.deleteCategory = deleteCategory;
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hello");
    try {
        const allCategory = yield category_model_1.CategoryModel.find();
        if (allCategory)
            return res.status(200).json({
                success: true,
                message: "All category is here",
                category: allCategory
            });
        else
            throw new Error;
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "category not found",
            error
        });
    }
});
exports.getAllCategory = getAllCategory;
const getSingleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        console.log(slug);
        const getCategory = yield category_model_1.CategoryModel.find({ slug });
        if (getCategory)
            return res.status(200).json({
                success: true,
                message: "category found",
                category: getCategory
            });
        else
            return res.status(500).json({
                success: false,
                message: "category not found",
            });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "category not found",
            error
        });
    }
});
exports.getSingleCategory = getSingleCategory;
