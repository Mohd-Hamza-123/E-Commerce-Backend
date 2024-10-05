import { Router } from "express";
import { sendResetPasswordEmail, userLogin, userRegistration, resetPassword, updateUser, deleteWishlistProduct, addWishlistProduct } from "../controllers/userController";
import { checkUserAuthorized, userIsAdmin, userIsSuperUser } from "../middlewares/auth-middleware";
import { Request, Response } from "express";

// router object
const router = Router();


// public routes
router.post("/register", userRegistration);
router.post("/login", userLogin)
router.post("/sendResetPasswordEmail", sendResetPasswordEmail);
router.post("/resetPassword/:userID/:token", resetPassword);

// protected routes
router.put('/update-user', checkUserAuthorized, updateUser);
router.delete(
    '/delete-wishlist-product',
    checkUserAuthorized,
    deleteWishlistProduct
)
router.put(
    '/add-wishlist-product',
    checkUserAuthorized,
    addWishlistProduct
)

router.post("/user-auth", checkUserAuthorized, (req: Request, res: Response) => {
    return res.status(200).json({ message: `user is logged in`, success: true })
});
router.post("/admin-auth", checkUserAuthorized, userIsAdmin, (req: Request, res: Response) => {
    const role = req.role;
    res.status(200).json({ message: `You are ${role}`, success: true })
});
router.post("/super-user-auth", checkUserAuthorized, userIsSuperUser, (req: Request, res: Response) => {
    const role = req.role;
    res.status(200).json({ message: `You are ${role}`, success: true })
})

export default router