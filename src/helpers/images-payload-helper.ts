import { uploadImageOnCloudinary } from "../config/connectCloudinary";
import fs from "fs"


export const uploadImages: any = async (files: any) => {

    const upload = Array.isArray(files) ? files.map(async (file: any) => {
        try {
            const res = await uploadImageOnCloudinary(file.path);
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            return res
        } catch (err) {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        }
    }) : []

    const results = await Promise.all(upload)

    if (!results) null
    const imagesArr = results.filter((file) => file !== null);
    if (!imagesArr) null
    return imagesArr.filter((imageObj: any) => imageObj !== null)
        .map((imageObj: any) => ({
            public_id: imageObj?.public_id,
            secure_url: imageObj?.secure_url
        }))
}