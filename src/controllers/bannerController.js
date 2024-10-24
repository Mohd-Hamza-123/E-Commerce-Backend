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
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_Crousal_Images = exports.upload_Crousal_Images = void 0;
const banner_model_1 = require("../models/banner.model");
const connectCloudinary_1 = require("../config/connectCloudinary");
const upload_Crousal_Images = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = req.user;
        const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!filePath || !userID)
            throw new Error;
        const userAlreayInBannerModel = yield banner_model_1.BannerModel.findOne({ userID }).lean();
        console.log(userAlreayInBannerModel);
        let payload;
        if (userAlreayInBannerModel) {
            const documentID = userAlreayInBannerModel === null || userAlreayInBannerModel === void 0 ? void 0 : userAlreayInBannerModel._id;
            let crousal_Images;
            if (filePath)
                crousal_Images = yield (0, connectCloudinary_1.uploadImageOnCloudinary)(filePath);
            payload = yield banner_model_1.BannerModel.findByIdAndUpdate(documentID, { $push: { crousal_Images } }, { new: true }).lean();
        }
        else {
            // create
            const crousal_Images = yield (0, connectCloudinary_1.uploadImageOnCloudinary)(filePath);
            const document = new banner_model_1.BannerModel({
                crousal_Images,
                userID
            });
            payload = yield document.save();
        }
        return res.json({
            success: true,
            message: 'Images Uploaded',
            payload
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Images not uploaded",
            error
        });
    }
});
exports.upload_Crousal_Images = upload_Crousal_Images;
const delete_Crousal_Images = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { crousal_Images } = req.body;
        const { bannerID } = req.params;
        if (!crousal_Images || !bannerID)
            throw new Error;
        console.log(crousal_Images);
        const doc = yield banner_model_1.BannerModel.findByIdAndUpdate(bannerID, { $pull: { crousal_Images: { public_id: crousal_Images === null || crousal_Images === void 0 ? void 0 : crousal_Images.public_id } } }, { new: true }).lean();
        console.log(doc);
        if (doc && (crousal_Images === null || crousal_Images === void 0 ? void 0 : crousal_Images.public_id)) {
            yield (0, connectCloudinary_1.deleteFile)(crousal_Images === null || crousal_Images === void 0 ? void 0 : crousal_Images.public_id);
            return res.status(200).json({
                success: true, message: "Image delete", payload: doc
            });
        }
        throw new Error;
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Images not deleted",
            error
        });
    }
});
exports.delete_Crousal_Images = delete_Crousal_Images;
