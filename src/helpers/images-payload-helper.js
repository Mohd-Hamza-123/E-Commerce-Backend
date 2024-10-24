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
exports.uploadImages = void 0;
const connectCloudinary_1 = require("../config/connectCloudinary");
const uploadImages = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const upload = Array.isArray(files) ? files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield (0, connectCloudinary_1.uploadImageOnCloudinary)(file.path);
            return res;
        }
        catch (err) {
        }
    })) : [];
    const results = yield Promise.all(upload);
    if (!results)
        null;
    const imagesArr = results.filter((file) => file !== null);
    if (!imagesArr)
        null;
    return imagesArr.filter((imageObj) => imageObj !== null)
        .map((imageObj) => ({
        public_id: imageObj === null || imageObj === void 0 ? void 0 : imageObj.public_id,
        secure_url: imageObj === null || imageObj === void 0 ? void 0 : imageObj.secure_url
    }));
});
exports.uploadImages = uploadImages;
