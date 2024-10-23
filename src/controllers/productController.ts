import { Request, Response } from "express";
import { validateProductsCreation } from "../helpers/validationHelper";
import { ProductModel } from "../models/product.model";
import { uploadImages } from "../helpers/images-payload-helper";
import { CategoryModel } from "../models/category.model";
import { UserModel } from "../models/user.model";
import { filterTruthyValues } from "../helpers/filter-truthy-values";
import { deleteFile } from "../config/connectCloudinary";
import mongoose from "mongoose";


const createDummyProduct = async (req: Request, res: Response): Promise<Response> => {
    try {


        async function createProductInDatabase() {

            const pic = await fetch(`https://picsum.photos/300/300`)
            if (!pic.ok) throw new Error(`Failed to fetch image: ${pic.status}`)
            const picURL = pic.url

            const catArray = ['66e053d2d025034927bb7ff1', '66e053e5d025034927bb7ff5', '66f8cf96e9a55bcfceb0840b', '66f8dace8413c0d30fe0fbc5', '66f8e43a275caee1c6245ffb']

            const RESPONSE = await fetch('https://random-data-api.com/api/commerce/random_commerce')
            if (!RESPONSE.ok) throw new Error("Jsonplaceholder error")
            const data = await RESPONSE.json()

            const name = data?.product_name
            const price = Math.floor(data?.price + 100)
            const inStock = true
            const isPublished = true
            const brand = data?.department
            const quantity = Math.floor(Number(data?.price_string))
            const colors = [data?.color]
            const discountPrice = Math.floor(data?.price + 100 - 33)
            const productOwner = new mongoose.Types.ObjectId('66ea5e8fe77b498f96d17ea4')
            const category = new mongoose.Types.ObjectId(catArray[Math.floor(Math.random() * catArray.length)])
            const description = `Random Number = ${Math.floor(Math.random() * 1001)}.This is a Random Description`
            const thumbnail = [{
                public_id: String(data?.id),
                secure_url: picURL
            }]
            const creatingProduct = new ProductModel({
                name,
                description,
                price,
                inStock,
                isPublished,
                brand,
                quantity,
                category,
                thumbnail,
                colors,
                discountPrice,
                productOwner,
            });
            const product_created = await creatingProduct.save()
            return product_created
        }
        for (let i = 0; i < 50; i++) {
            const product = await createProductInDatabase()
            if (product) {
                // console.log(product)
                console.log(`Product Created. No = ${i + 1}`)
            } else {
                console.log("Product not created")
            }

        }
        return res.status(200).json({
            success: true,
        })
    } catch (error: any) {
        console.error("Error details:", error); // Log the error to console
        return res.status(500).json({
            message: "Error in creating product",
            error: error.message || "Unknown error", // Provide a fallback message
        });
    }

}

const createProduct = async (req: Request, res: Response): Promise<Response> => {
    try {

        if (!req.files) throw new Error
        const f = req.files as { [fieldname: string]: Express.Multer.File[] };

        const {
            productOwnerID,
            category,
            discount
        } = req.body

        const error = validateProductsCreation(req.body);

        if (error)
            return res.status(400).json({
                success: false,
                message: "Product Validation Failed",
                error
            })


        const productOwner = await UserModel.findById(productOwnerID)
        const categoryExist = await CategoryModel.findOne({ name: category })

        const categoryID = categoryExist?._id;

        if (!categoryID || !productOwner) throw new Error("Check the fields again")

        let images = f['images'];
        let thumbnail = f['thumbnail'];

        if (thumbnail) thumbnail = await uploadImages(thumbnail);

        if (images) images = await uploadImages(images);


        const creatingProduct = new ProductModel({
            ...req.body,
            category: categoryID,
            images,
            thumbnail,
            productOwner: productOwner?._id,
            discount: JSON.parse(discount) || {},
        });

        const product_created = await creatingProduct.save()

        if (!product_created) throw new Error("Product not created")

        return res.status(200).json({
            success: true,
            message: "Product Created",
            product: product_created
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Product not Created",
            error
        })
    }
}

const updateProduct = async (req: Request, res: Response): Promise<Response> => {

    try {
        const { id } = req.params
        const files = req.files
        const product = await ProductModel.findById(id);
        if (!product) throw new Error("Product not exist")

        let prevThumbnail = product?.thumbnail || []
        let prevImages: any = product?.images || []
        const updatedObject: { [key: string]: any } = {}
        const truthyObject: any = filterTruthyValues({ ...req.body })

        // DELETING THUMBNAIL
        if (truthyObject?.deleteThumbnail) {
            const thumbnail_ID = truthyObject?.deleteThumbnail
            if (await deleteFile(thumbnail_ID)) {
                prevThumbnail = prevThumbnail.filter((thumbnailObj: any) => thumbnailObj.public_id !== thumbnail_ID)
            }
            updatedObject.thumbnail = [...prevThumbnail]
        }

        // DELETING IMAGES
        if (truthyObject?.deleteImages) {
            let images_ID_Array = truthyObject.deleteImages

            if (!Array.isArray(images_ID_Array)) images_ID_Array = [images_ID_Array]

            for (const public_id of images_ID_Array) {
                if (await deleteFile(public_id)) {
                    prevImages = prevImages.filter((img: any) => img.public_id !== public_id);
                }
            }
            updatedObject.images = [...prevImages]
        }

        if (files) {
            for (const [key, value] of Object.entries(files)) {
                if (key === "thumbnail") {
                    if (value && Array.isArray(value)) {
                        const thumbnail = await uploadImages(value);
                        console.log(thumbnail)
                        if (!thumbnail) return res.status(400).send({ success: false, message: 'Error in uploading images' })
                        updatedObject.thumbnail = thumbnail
                    }
                }

                if (key === "images") {
                    if (value && Array.isArray(value)) {
                        const images = await uploadImages(value);
                        if (!images) return res.status(400).send({ success: false, message: 'Error in uploading images' })
                        updatedObject.images = [...prevImages, ...images]
                    } else {
                        updatedObject.images = [...prevImages]
                    }
                }
            }
        }


        // UPDATING CATEGORY
        if (truthyObject?.category) {
            const category = await CategoryModel.findOne({ name: truthyObject.category })
            if (category) updatedObject.category = category?._id
        }


        delete updatedObject?.deleteImages;
        let payload = Object.assign(truthyObject, updatedObject);
        if (payload?.discount) payload.discount = JSON.parse(payload.discount)
        if (payload?.isPublished) payload.isPublished = Boolean(payload.isPublished)
        if (payload?.discountPrice) payload.discountPrice = Number(payload.discountPrice)
        if (payload?.quantity) payload.quantity = Number(payload.quantity)
        if (payload?.price) payload.price = Number(payload.price)
        if (payload?.inStock) payload.inStock = Boolean(payload.inStock)


        const products_updated = await ProductModel.findByIdAndUpdate(
            product._id,
            {
                $set: {
                    ...payload
                }
            },
            { new: true }).lean()
        // console.log(products_updated)
        if (!products_updated) throw new Error("Product not updated")
        return res.status(200).json({
            success: true,
            message: "Products updated successfully",
            products_updated
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product not updated"
        })
    }
}

const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params
        if (!id) throw new Error("Product not found")
        const product = await ProductModel.findByIdAndDelete(id)
        if (!product) throw new Error("Product not deleted")
        const imagesArray = product.images

        const imageDeletion = imagesArray.map(async (object) => await deleteFile(object.public_id))
        const results = await Promise.all(imageDeletion)
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product not deleted",
            error: error
        })
    }

}

const getSingleProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params
        console.log(id)
        if (!id) throw new Error("Product not found");
        const product = await ProductModel.findById(id)

        if (!product) {
            return res.status(400).json({
                success: true,
                message: "Product not found",

            })
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })

    } catch (error) {
        return res.status(400).json({
            success: true,
            message: "Product not found",
            error
        })
    }
}

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct,
    createDummyProduct
}