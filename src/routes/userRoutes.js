"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const userController_1 = require("../controllers/userController");
// router object
const router = (0, express_1.Router)();
// public routes
router.post("/register", userController_1.userRegistration);
router.post("/login", userController_1.userLogin);
router.post("/sendResetPasswordEmail", userController_1.sendResetPasswordEmail);
router.post("/resetPassword/:userID/:token", userController_1.resetPassword);
// protected routes
router.put('/update-user', auth_middleware_1.checkUserAuthorized, userController_1.updateUser);
router.put('/add-wishlist-product', auth_middleware_1.checkUserAuthorized, userController_1.addWishlistProduct);
router.put('/add-product-in-cart', auth_middleware_1.checkUserAuthorized, userController_1.addProductInCart);
router.delete('/delete-wishlist-product', auth_middleware_1.checkUserAuthorized, userController_1.deleteWishlistProduct);
router.delete('/remove-product-in-cart', auth_middleware_1.checkUserAuthorized, userController_1.removeProductInCart);
router.post("/user-auth", auth_middleware_1.checkUserAuthorized, (req, res) => {
    return res.status(200).json({ message: `user is logged in`, success: true });
});
router.post("/admin-auth", auth_middleware_1.checkUserAuthorized, auth_middleware_1.userIsAdmin, (req, res) => {
    const role = req.role;
    res.status(200).json({ message: `You are ${role}`, success: true });
});
router.post("/super-user-auth", auth_middleware_1.checkUserAuthorized, auth_middleware_1.userIsSuperUser, (req, res) => {
    const role = req.role;
    res.status(200).json({ message: `You are ${role}`, success: true });
});
exports.default = router;
