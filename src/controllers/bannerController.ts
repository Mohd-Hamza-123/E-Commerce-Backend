import { Request, Response } from "express";
import { BannerModel } from "../models/banner.model";
import { uploadImages } from "../helpers/images-payload-helper";
import { deleteFile, uploadImageOnCloudinary } from "../config/connectCloudinary"

const upload_Crousal_Images = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID = req.user
        const filePath = req.file?.path

        if (!filePath || !userID) throw new Error

        const userAlreayInBannerModel = await BannerModel.findOne({ userID }).lean()
        console.log(userAlreayInBannerModel)
        let payload;
        if (userAlreayInBannerModel) {

            const documentID = userAlreayInBannerModel?._id
            let crousal_Images;
            if (filePath) crousal_Images = await uploadImageOnCloudinary(filePath)

            payload = await BannerModel.findByIdAndUpdate(documentID,
                { $push: { crousal_Images } },
                { new: true }
            ).lean()

        } else {
            // create

            const crousal_Images = await uploadImageOnCloudinary(filePath)

            const document = new BannerModel({
                crousal_Images,
                userID
            })
            payload = await document.save()
        }

        return res.json({
            success: true,
            message: 'Images Uploaded',
            payload
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Images not uploaded",
            error
        })
    }
}

const delete_Crousal_Images = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { crousal_Images } = req.body
        const { bannerID } = req.params
        if (!crousal_Images || !bannerID) throw new Error
        console.log(crousal_Images)
        const doc = await BannerModel.findByIdAndUpdate(bannerID,
            { $pull: { crousal_Images: { public_id: crousal_Images?.public_id } } },
            { new: true },
        ).lean()
        console.log(doc);
        if (doc && crousal_Images?.public_id) {
            await deleteFile(crousal_Images?.public_id)
            return res.status(200).json({
                success: true, message: "Image delete", payload: doc
            })
        }
        throw new Error
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Images not deleted",
            error
        })
    }
}

export {
    upload_Crousal_Images,
    delete_Crousal_Images
}