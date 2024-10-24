"use strict";
// import { RequestHandler } from "express";
// // import { uploadImage } from "../config/connectCloudinary";
// import fs from 'fs'
// import { UploadApiResponse } from "cloudinary";
// declare module 'express-serve-static-core' {
//     export interface Request {
//         imagesArr: (UploadApiResponse | null)[]
//     }
// }
// export const uploadFile: RequestHandler = async (req, res, next) => {
//     try {
//         const files = req.files;
//         if (!files || files.length === 0) {
//             return res.status(400).send({ success: false, message: 'No Images uploaded' })
//         }
//         const uploadImages = Array.isArray(files) ? files.map(async (file: any) => {
//             try {
//                 // const res = await uploadImage(file.path);
//                 fs.unlinkSync(file.path);
//                 return res
//             } catch (err) {
//                 fs.unlinkSync(file.path);
//                 return null
//             }
//         }) : []
//         const results = await Promise.all(uploadImages)
//         if (!results) throw new Error
//         const imagesArr = results.filter((file) => file !== null);
//         req.imagesArr = imagesArr
//         next()
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Images Not Uploading",
//             error
//         })
//     }
// }
