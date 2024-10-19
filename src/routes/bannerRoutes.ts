import { Router } from "express";
import multer from "multer";
import { checkUserAuthorized, userIsSuperUser } from "../middlewares/auth-middleware";
import { delete_Crousal_Images, upload_Crousal_Images } from "../controllers/bannerController";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/temp')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 } })

const router = Router();

router.post(
    '/upload-crousal-images',
    upload.single("crousal_Images"),
    checkUserAuthorized,
    userIsSuperUser,
    upload_Crousal_Images,
);

router.delete(
    '/delete-crousal-images/:bannerID',
    checkUserAuthorized,
    userIsSuperUser,
    delete_Crousal_Images
)


export default router