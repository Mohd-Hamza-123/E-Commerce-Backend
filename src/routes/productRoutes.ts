import { Router } from "express";
import { createDummyProduct, createProduct, deleteProduct, getSingleProduct, updateProduct } from "../controllers/productController";
import { checkUserAuthorized, userIsAdmin, userIsAdminOrSuperUser } from "../middlewares/auth-middleware";
import multer from "multer";
// import { uploadFile } from "../middlewares/file-middleware";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/temp')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 } })

const router = Router();


// public routes
router.get('/get-single-product/:id', getSingleProduct);

router.post('/create-dummy', createDummyProduct);

// protected routes

router.post('/create-product', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), checkUserAuthorized, userIsAdminOrSuperUser, createProduct)

router.put('/update-product/:id', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), checkUserAuthorized, userIsAdminOrSuperUser, updateProduct);

router.delete('/delete-product/:id', deleteProduct);

export default router

export { upload }