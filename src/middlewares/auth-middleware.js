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
exports.userIsAdminOrSuperUser = exports.userIsSuperUser = exports.userIsAdmin = exports.checkUserAuthorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const server_1 = require("../server");
const checkUserAuthorized = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        console.log(authorization);
        const { userID: ID } = req.body;
        if (authorization && server_1.jwt_secret_key) {
            let token;
            if (authorization.startsWith("Bearer")) {
                token = authorization.split(" ")[1];
                console.log(token);
            }
            else {
                token = authorization;
            }
            const { userID } = jsonwebtoken_1.default.verify(token, ID + server_1.jwt_secret_key);
            req.user = userID;
            next();
        }
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Authorization token needed0" });
    }
};
exports.checkUserAuthorized = checkUserAuthorized;
const userIsAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.user;
        const user = yield user_model_1.UserModel.findById(userID);
        if ((user === null || user === void 0 ? void 0 : user.role) === "user") {
            res.status(400).json({ success: false, message: "user is not admin", role: user.role });
        }
        else if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
            req.role = user === null || user === void 0 ? void 0 : user.role;
            next();
        }
        else {
            res.status(400).json({ success: false, message: "user role is incorrect" });
        }
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Internal Server Error" });
    }
});
exports.userIsAdmin = userIsAdmin;
const userIsSuperUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.user;
        const user = yield user_model_1.UserModel.findById(userID);
        if (!user)
            return res.status(400).json({ success: false, message: "user not exist" });
        if ((user === null || user === void 0 ? void 0 : user.role) === "superUser") {
            req.role = user === null || user === void 0 ? void 0 : user.role;
            next();
        }
        else
            res.status(400).json({ success: false, message: "You are not authorized", role: user === null || user === void 0 ? void 0 : user.role });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Internal Server Error" });
    }
});
exports.userIsSuperUser = userIsSuperUser;
const userIsAdminOrSuperUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.user;
        const user = yield user_model_1.UserModel.findById(userID);
        if ((user === null || user === void 0 ? void 0 : user.role) === "user") {
            res.status(400).json({ success: false, message: "user is not admin", role: user.role });
        }
        else if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
            req.role = user === null || user === void 0 ? void 0 : user.role;
            next();
        }
        else if ((user === null || user === void 0 ? void 0 : user.role) === 'superUser') {
            req.role = user === null || user === void 0 ? void 0 : user.role;
            next();
        }
        else {
            res.status(400).json({ success: false, message: "user role is incorrect" });
        }
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Internal Server Error" });
    }
});
exports.userIsAdminOrSuperUser = userIsAdminOrSuperUser;
