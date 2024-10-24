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
exports.removeProductInCart = exports.addProductInCart = exports.addWishlistProduct = exports.deleteWishlistProduct = exports.updateUser = exports.resetPassword = exports.sendResetPasswordEmail = exports.userLogin = exports.userRegistration = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const user_model_1 = require("../models/user.model");
const mail_send_1 = require("../config/mail-send");
const authHelper_1 = require("../helpers/authHelper");
const validationHelper_1 = require("../helpers/validationHelper");
const filter_truthy_values_1 = require("../helpers/filter-truthy-values");
const mongoose_1 = __importDefault(require("mongoose"));
const userRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = (0, validationHelper_1.validateRegistration)(req);
        if (error) {
            return res.status(400).json({ message: "Check Your username , email , password again", error: error.details, success: false });
        }
        const { username, email, password, confirm_password } = req.body;
        if (password !== confirm_password) {
            return res.status(400).json({ message: "Confirm your password again", error: "", success: false });
        }
        // Checking if a user with the same username or email already exists
        const userAlreadyExist = yield user_model_1.UserModel.findOne({
            $or: [{ username }, { email }]
        });
        if (userAlreadyExist) {
            return res.status(400).json({ message: "username or email already exists", success: false });
        }
        // Hash the password
        const hashedPassword = yield (0, authHelper_1.hashPassword)(password);
        if (!authHelper_1.hashPassword)
            throw new Error;
        // Creating a new user
        const createUser = new user_model_1.UserModel({
            username,
            email,
            password: hashedPassword
        });
        let createdUser = yield createUser.save();
        const doc = createUser.toObject();
        const token = yield (0, authHelper_1.generateToken)(createdUser._id.toString());
        if (!token)
            throw new Error;
        return res.status(201).json({
            message: "Registration complete", success: true, payload: Object.assign(Object.assign({ token }, doc), { password: '' })
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err, success: false });
    }
});
exports.userRegistration = userRegistration;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = (0, validationHelper_1.validateLogin)(req);
        if (error) {
            return res.status(400).json({ message: "email or password is invalid", error, success: false });
        }
        const { email, password } = req.body;
        const emailExists = yield user_model_1.UserModel.findOne({ email }).lean();
        if (emailExists) {
            const isPasswordMatched = yield bcrypt_1.default.compare(password, emailExists.password);
            if (isPasswordMatched) {
                const token = yield (0, authHelper_1.generateToken)(emailExists._id.toHexString());
                return res.status(200).json({
                    message: "Succesfully login huwa",
                    success: true,
                    payload: Object.assign(Object.assign({}, emailExists), { password: "", token })
                });
            }
            else
                return res.status(400).json({
                    message: "email or password is invalid",
                    success: false
                });
        }
        else {
            return res.status(400).json({ message: "email or password is invalid", error: "error", success: false });
        }
    }
    catch (error) {
        return res.status(400).json({ message: "Internal Server Error", error, success: false });
    }
});
exports.userLogin = userLogin;
const sendResetPasswordEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // throw new Error
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: "email validation failed", error });
        }
        const user = yield user_model_1.UserModel.findOne({ email });
        if (user && server_1.jwt_secret_key) {
            const userID = user._id.toString();
            if (!userID)
                throw new Error;
            const token = yield (0, authHelper_1.generateToken)(userID, "5m");
            const link = `http://localhost:3000/ChangePassword/${user._id}/${token}`;
            console.log(email);
            const send_E_mail = yield (0, mail_send_1.send_Email)(link, email);
            console.log(send_E_mail);
            if (send_E_mail)
                return res.status(201).json({ success: true, message: "Link has been sent to your gmail" });
            else
                return res.status(400).json({ success: false, message: "Link not sent. Try after some time" });
        }
        else {
            return res.status(400).json({ success: false, message: "Verification problem occured", error });
        }
    }
    catch (error) {
        return res.status(400).json({ message: "Internal Server Error", error, success: false });
    }
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, confirm_password } = req.body;
    const { userID: ID, token } = req.params;
    console.log(ID, token, email, password, confirm_password);
    if (password !== confirm_password) {
        return res.status(400).json({ success: false, message: "confirm you password" });
    }
    const newSecret = ID + server_1.jwt_secret_key;
    try {
        jsonwebtoken_1.default.verify(token, newSecret);
        const user = yield user_model_1.UserModel.findOne({ email });
        const hashedPassword = yield (0, authHelper_1.hashPassword)(password);
        if (user && hashedPassword) {
            const upadatePassword = yield user_model_1.UserModel.findByIdAndUpdate(user._id, {
                $set: {
                    password: hashedPassword
                }
            });
            if (!upadatePassword)
                throw new Error;
            return res.status(201).json({ success: true, message: "Password Changed" });
        }
        else {
            return res.status(400).json({ success: false, message: "No user found" });
        }
    }
    catch (err) {
        return res.status(400).json({ success: false, message: "Token Verification failed" });
    }
});
exports.resetPassword = resetPassword;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.user;
        const truthyData = (0, filter_truthy_values_1.filterTruthyValues)(req.body);
        console.log(req.body);
        if (truthyData.userID !== userID)
            throw new Error;
        const userExist = yield user_model_1.UserModel.findById(userID).lean();
        if (!userExist)
            throw new Error("User not exist");
        let productID = truthyData === null || truthyData === void 0 ? void 0 : truthyData.productID;
        let wishlist = [];
        if (typeof (productID) === 'string' && Array.isArray(userExist === null || userExist === void 0 ? void 0 : userExist.wishlist)) {
            productID = new mongoose_1.default.Types.ObjectId(productID);
            wishlist = [productID, ...userExist.wishlist];
            truthyData.wishlist = wishlist;
        }
        const token = yield (0, authHelper_1.generateToken)(String(userID), "1d");
        truthyData === null || truthyData === void 0 ? true : delete truthyData.userID;
        truthyData === null || truthyData === void 0 ? true : delete truthyData.password;
        const user = yield user_model_1.UserModel.findByIdAndUpdate(userID, {
            $set: Object.assign({}, truthyData)
        }, { new: true }).lean().select("-password");
        console.log(user);
        if (!user)
            throw new Error;
        return res.status(200).json({
            message: "Profile Updated Successfully",
            payload: Object.assign(Object.assign({}, user), { token }),
            success: true
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error
        });
    }
});
exports.updateUser = updateUser;
const deleteWishlistProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.user;
        const { productID } = req.body;
        if (!userID || typeof productID !== 'string')
            throw new Error("product not available");
        const product_Object_ID = new mongoose_1.default.Types.ObjectId(productID);
        const user = yield user_model_1.UserModel.findByIdAndUpdate(userID, { $pull: { wishlist: product_Object_ID } }, { new: true }).select('-password').lean();
        const token = yield (0, authHelper_1.generateToken)(userID, '1d');
        if (user && token) {
            return res.status(200).json({
                success: true,
                message: 'Product removed from wishlist',
                payload: Object.assign(Object.assign({}, user), { token })
            });
        }
        else {
            throw new Error("Product Not Removed from wishlist");
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
});
exports.deleteWishlistProduct = deleteWishlistProduct;
const addWishlistProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.user;
        const { productID } = req.body;
        if (!userID || typeof productID !== 'string')
            throw new Error("product not available");
        const product_Object_ID = new mongoose_1.default.Types.ObjectId(productID);
        const wishlist = yield user_model_1.UserModel.findById(userID).select('wishlist -_id').lean();
        const wishlist_array = wishlist === null || wishlist === void 0 ? void 0 : wishlist.wishlist;
        if (!Array.isArray(wishlist_array))
            throw new Error;
        if (wishlist_array.includes(product_Object_ID)) {
            return res.status(200).json({
                success: true,
                message: 'Product already in wishlist',
            });
        }
        else {
            const user = yield user_model_1.UserModel.findByIdAndUpdate(userID, { $push: { wishlist: product_Object_ID } }, { new: true }).select("-password").lean();
            let token;
            if (user)
                token = yield (0, authHelper_1.generateToken)(userID, '1d');
            return res.status(200).json({
                success: true,
                message: 'Product added in wishlist',
                payload: Object.assign(Object.assign({}, user), { token })
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
});
exports.addWishlistProduct = addWishlistProduct;
const addProductInCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body)
            throw new Error("Data not recieved at server");
        const userID = req.user;
        const { productID } = req.body;
        if (!userID || !productID || typeof productID !== 'string')
            throw new Error("user or product not exist");
        const product_Object_ID = new mongoose_1.default.Types.ObjectId(productID);
        const cart = {
            productID: product_Object_ID,
        };
        console.log(product_Object_ID);
        const user = yield user_model_1.UserModel.findByIdAndUpdate(userID, { $push: { cart } }, { new: true }).select("-password").lean();
        const token = yield (0, authHelper_1.generateToken)(userID, '2d');
        console.log(user);
        return res.status(200).json({ success: true, message: "Product add in cart", payload: Object.assign(Object.assign({}, user), { token }) });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
});
exports.addProductInCart = addProductInCart;
const removeProductInCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body)
            throw new Error("Data not recieved at server");
        const userID = req.user;
        const { productID } = req.body;
        if (!userID || !productID || typeof productID !== 'string')
            throw new Error("user or product not exist");
        const product_Object_ID = new mongoose_1.default.Types.ObjectId(productID);
        const user = yield user_model_1.UserModel.findByIdAndUpdate(userID, { $pull: { cart: { productID: product_Object_ID } } }, { new: true }).select("-password").lean();
        console.log(user);
        const token = yield (0, authHelper_1.generateToken)(userID, '2d');
        return res.status(200).json({ success: true, message: "Product add in cart", payload: Object.assign(Object.assign({}, user), { token }) });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
});
exports.removeProductInCart = removeProductInCart;
