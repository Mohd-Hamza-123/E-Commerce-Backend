import multer from "multer";
import { Router } from "express"
import {
    checkUserAuthorized,
    userIsSuperUser
} from "../middlewares/auth-middleware";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory
} from "../controllers/categoryController";


const router = Router();

const uploader = multer({
    storage: multer.diskStorage({}),
    limits: { fileSize: 1024 * 1024 * 10 }
})

// public routes

router.get("/get-category", getAllCategory);
router.get("/single-category/:slug", getSingleCategory)

// protected Routes

router.put(
    "/update-category/:categoryID",
    uploader.single("image"),
    checkUserAuthorized,
    userIsSuperUser,
    updateCategory
);

router.delete(
    "/delete-category/:categoryID",
    checkUserAuthorized,
    userIsSuperUser,
    deleteCategory
);

router.post(
    "/create-category",
    uploader.single("image"),
    checkUserAuthorized,
    userIsSuperUser,
    createCategory
);

export default router