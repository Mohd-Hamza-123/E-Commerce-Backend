import { Router } from "express";
import multer from "multer";
import { checkUserAuthorized, userIsSuperUser } from "../middlewares/auth-middleware";
import { upload_Crousal_Images } from "../controllers/bannerController";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.filename)
    }
})

const uploader = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

router.post(
    '/upload-crousal-images',
    uploader.fields([
        { name: 'crousal_Images', maxCount: 10 }
    ]),
    checkUserAuthorized,
    userIsSuperUser,
    upload_Crousal_Images,
);


export default router