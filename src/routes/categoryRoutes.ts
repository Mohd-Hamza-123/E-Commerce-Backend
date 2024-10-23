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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/temp')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 } })
// public routes

router.get("/get-category", getAllCategory);
router.get("/single-category/:slug", getSingleCategory)

// protected Routes

router.post(
    "/create-category",
    upload.single("image"),
    checkUserAuthorized,
    userIsSuperUser,
    createCategory
);


router.put(
    "/update-category/:categoryID",
    upload.single("image"),
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


export default router