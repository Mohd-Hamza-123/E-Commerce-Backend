import slugify from "slugify";
import { Request, Response } from "express";
import { CategoryModel } from "../models/category.model";
import { filterTruthyValues } from "../helpers/filter-truthy-values";
import { deleteFile, uploadImageOnCloudinary } from "../config/connectCloudinary"

const createCategory = async (req: Request, res: Response): Promise<Response> => {

    try {
        const { name, gender } = req.body
        const role = req.role
        if (role !== "superUser" || !name || !gender) throw new Error

        let image: any = req.file?.path

        if (image) image = await uploadImageOnCloudinary(image)

        if (image)
            image = {
                public_id: image.public_id,
                secure_url: image.secure_url
            }
        else image = ""


        const existingCategory = await CategoryModel.findOne({ name })

        if (existingCategory) return res.status(201).json({
            success: true,
            message: "Category Already Exists",
        })

        const creatingCategory = new CategoryModel({
            name,
            slug: slugify(name),
            image,
            gender
        })

        const createdCategory = await creatingCategory.save()

        return res.status(201).json({
            success: true,
            message: "Category Created",
            createdCategory
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "category not created",
            error
        })
    }


}
const updateCategory = async (req: Request, res: Response): Promise<Response> => {

    try {
        const { categoryID } = req.params
        if (req.role !== "superUser" || !categoryID) throw new Error("You are not authrorized")

        const { name, gender, imageDelete } = req.body
        let image: any = req.file?.path
        console.log(image)
        const updateFields: any = filterTruthyValues({ ...req.body })
        const deleteFields = {} as { image?: string, gender: string }

        if (updateFields?.deleteImage) {
            const public_id = updateFields?.deleteImage
            console.log(public_id)
            if (await deleteFile(public_id)) {
                console.log("imageDelete")
                deleteFields.image = ""
            }
            delete updateFields.deleteImage
            delete updateFields.image
        }

        if (image) {
            image = await uploadImageOnCloudinary(image);

            if (image) {
                updateFields.image = image
                delete deleteFields?.image
            }
        }

        const updatingCategory = await CategoryModel.findByIdAndUpdate(categoryID, {
            $set: {
                ...updateFields
            },
            $unset: {
                ...deleteFields
            }
        }, { new: true }).lean()

        return res.status(200).json({
            category: updatingCategory,
            success: true,
            message: "Category Updated Successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "category not updated",
            error
        })
    }


}
const deleteCategory = async (req: Request, res: Response): Promise<Response> => {

    try {
        const role = req.role;
        const { categoryID } = req.params;
        if (role !== "superUser" || !categoryID) throw new Error

        const deleteCategory = await CategoryModel.findByIdAndDelete(categoryID);

        if (deleteCategory?.image) {
            const public_id = deleteCategory?.image?.public_id
            if (public_id) await deleteFile(public_id)
        }

        if (!deleteCategory) throw new Error
        return res.status(200).json({
            success: true,
            message: "Category Deleted Succesfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "category not deleted",
            error
        })
    }
}
const getAllCategory = async (req: Request, res: Response): Promise<Response> => {
    console.log("hello")
    try {
        const allCategory = await CategoryModel.find();
       
        if (allCategory) return res.status(200).json({
            success: true,
            message: "All category is here",
            category: allCategory
        })
        else throw new Error
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "category not found",
            error
        })
    }
}
const getSingleCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { slug } = req.params;
        console.log(slug)
        const getCategory = await CategoryModel.find({ slug });
        if (getCategory) return res.status(200).json({
            success: true,
            message: "category found",
            category: getCategory
        })
        else return res.status(500).json({
            success: false,
            message: "category not found",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "category not found",
            error
        })
    }
}

export {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    getSingleCategory
}