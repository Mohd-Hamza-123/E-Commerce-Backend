import Joi from "joi";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { jwt_secret_key } from "../server";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { send_Email } from "../config/mail-send";
import { generateToken, hashPassword } from "../helpers/authHelper";
import { validateLogin, validateRegistration } from "../helpers/validationHelper";
import { filterTruthyValues } from "../helpers/filter-truthy-values";
import mongoose, { isValidObjectId, ObjectId } from "mongoose";


const userRegistration = async (req: Request, res: Response): Promise<Response> => {

    try {
        const error: Joi.ValidationError | undefined = validateRegistration(req)

        if (error) {
            return res.status(400).json({ message: "Check Your username , email , password again", error: error.details, success: false });
        }

        const { username, email, password, confirm_password } = req.body;
        if (password !== confirm_password) {
            return res.status(400).json({ message: "Confirm your password again", error: "", success: false });
        }

        // Checking if a user with the same username or email already exists
        const userAlreadyExist = await UserModel.findOne({
            $or: [{ username }, { email }]
        });

        if (userAlreadyExist) {
            return res.status(400).json({ message: "username or email already exists", success: false });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password)
        if (!hashPassword) throw new Error

        // Creating a new user
        const createUser = new UserModel({
            username,
            email,
            password: hashedPassword
        });

        let createdUser = await createUser.save()
        const doc = createUser.toObject()


        const token = await generateToken(createdUser._id.toString());
        if (!token) throw new Error

        return res.status(201).json({
            message: "Registration complete", success: true, payload: {
                token,
                ...doc,
                password: '',
            }
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err, success: false });
    }
};

const userLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const error: Joi.ValidationError | undefined = validateLogin(req);

        if (error) {
            return res.status(400).json({ message: "email or password is invalid", error, success: false })
        }

        const { email, password } = req.body

        const emailExists = await UserModel.findOne({ email }).lean()

        if (emailExists) {

            const isPasswordMatched = await bcrypt.compare(password, emailExists.password)

            if (isPasswordMatched) {
                const token = await generateToken(emailExists._id.toHexString());

                return res.status(200).json({
                    message: "Succesfully login huwa",
                    success: true,
                    payload: { ...emailExists, password: "", token }
                })
            }
            else return res.status(400).json({
                message: "email or password is invalid",
                success: false
            })

        } else {
            return res.status(400).json({ message: "email or password is invalid", error: "error", success: false });
        }

    } catch (error) {
        return res.status(400).json({ message: "Internal Server Error", error, success: false })
    }
}

const sendResetPasswordEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.body
        // throw new Error

        const schema = Joi.object({
            email: Joi.string().email().required()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: "email validation failed", error })
        }


        const user = await UserModel.findOne({ email });
        if (user && jwt_secret_key) {
            const userID = user._id.toString()
            if (!userID) throw new Error
            const token = await generateToken(userID, "5m");
            const link = `http://localhost:3000/ChangePassword/${user._id}/${token}`

            console.log(email)
            const send_E_mail = await send_Email(link, email);
            console.log(send_E_mail)

            if (send_E_mail) return res.status(201).json({ success: true, message: "Link has been sent to your gmail" })
            else return res.status(400).json({ success: false, message: "Link not sent. Try after some time" })

        } else {
            return res.status(400).json({ success: false, message: "Verification problem occured", error })
        }
    } catch (error) {
        return res.status(400).json({ message: "Internal Server Error", error, success: false })
    }


}

const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, confirm_password } = req.body
    const { userID: ID, token } = req.params
    console.log(ID, token, email, password, confirm_password)
    if (password !== confirm_password) {
        return res.status(400).json({ success: false, message: "confirm you password" });
    }
    const newSecret = ID + jwt_secret_key

    try {
        jwt.verify(token, newSecret);
        const user = await UserModel.findOne({ email });
        const hashedPassword = await hashPassword(password)
        if (user && hashedPassword) {
            const upadatePassword = await UserModel.findByIdAndUpdate(user._id, {
                $set: {
                    password: hashedPassword
                }
            })
            if (!upadatePassword) throw new Error
            return res.status(201).json({ success: true, message: "Password Changed" });
        } else {
            return res.status(400).json({ success: false, message: "No user found" });
        }

    } catch (err: any) {
        return res.status(400).json({ success: false, message: "Token Verification failed" });
    }
}

const updateUser = async (req: Request, res: Response): Promise<Response> => {

    try {
        const userID = req.user
        const truthyData = filterTruthyValues(req.body)
        console.log(req.body)
        if (truthyData.userID !== userID) throw new Error

        const userExist = await UserModel.findById(userID).lean()

        if (!userExist) throw new Error("User not exist")

        let productID = truthyData?.productID
        let wishlist: any = []
        if (typeof (productID) === 'string' && Array.isArray(userExist?.wishlist)) {
            productID = new mongoose.Types.ObjectId(productID)
            wishlist = [productID, ...userExist.wishlist]
            truthyData.wishlist = wishlist
        }

        const token = await generateToken(String(userID), "1d")

        delete truthyData?.userID
        delete truthyData?.password


        const user = await UserModel.findByIdAndUpdate(userID, {
            $set: {
                ...truthyData,
            }

        }, { new: true }).lean().select("-password")

        console.log(user)
        if (!user) throw new Error
        return res.status(200).json({
            message: "Profile Updated Successfully",
            payload: { ...user, token },
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error
        })
    }

}

const deleteWishlistProduct = async (req: Request, res: Response): Promise<Response> => {
    try {

        const userID = req.user
        const { productID } = req.body

        if (!userID || typeof productID !== 'string') throw new Error("product not available")
        const product_Object_ID = new mongoose.Types.ObjectId(productID)


        const user = await UserModel.findByIdAndUpdate(
            userID,
            { $pull: { wishlist: product_Object_ID } },
            { new: true }
        ).select('-password').lean()
        const token = await generateToken(userID, '1d')
        if (user && token) {
            return res.status(200).json({
                success: true,
                message: 'Product removed from wishlist',
                payload: { ...user, token }
            })
        } else {
            throw new Error("Product Not Removed from wishlist")
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
}

const addWishlistProduct = async (req: Request, res: Response): Promise<Response> => {
    try {

        const userID = req.user
        const { productID } = req.body
        if (!userID || typeof productID !== 'string') throw new Error("product not available")
        const product_Object_ID = new mongoose.Types.ObjectId(productID)
        const wishlist = await UserModel.findById(userID).select('wishlist -_id').lean();
        const wishlist_array = wishlist?.wishlist;
        if (!Array.isArray(wishlist_array)) throw new Error
        if (wishlist_array.includes(product_Object_ID)) {

            return res.status(200).json({
                success: true,
                message: 'Product already in wishlist',
            })
        } else {
            const user = await UserModel.findByIdAndUpdate(userID,
                { $push: { wishlist: product_Object_ID } },
                { new: true }
            ).select("-password").lean()
            let token;

            if (user) token = await generateToken(userID, '1d');
            return res.status(200).json({
                success: true,
                message: 'Product added in wishlist',
                payload: { ...user, token }
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
}

const addProductInCart = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.body) throw new Error("Data not recieved at server")
        const userID = req.user
        const { productID } = req.body;
        if (!userID || !productID || typeof productID !== 'string') throw new Error("user or product not exist")

        const product_Object_ID = new mongoose.Types.ObjectId(productID)
        const cart = {
            productID: product_Object_ID,
        }
        console.log(product_Object_ID)
        const user = await UserModel.findByIdAndUpdate(userID,
            { $push: { cart } },
            { new: true }
        ).select("-password").lean()

        const token = await generateToken(userID, '2d')
        console.log(user)
        return res.status(200).json({ success: true, message: "Product add in cart", payload: { ...user, token } })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error })
    }
}

const removeProductInCart = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.body) throw new Error("Data not recieved at server")
        const userID = req.user
        const { productID } = req.body
        if (!userID || !productID || typeof productID !== 'string') throw new Error("user or product not exist")

        const product_Object_ID = new mongoose.Types.ObjectId(productID)

        const user = await UserModel.findByIdAndUpdate(userID,
            { $pull: { cart: { productID: product_Object_ID } } },
            { new: true }
        ).select("-password").lean()

        console.log(user)
        const token = await generateToken(userID, '2d');
        return res.status(200).json({ success: true, message: "Product add in cart", payload: { ...user, token } })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error })
    }
}


export {
    userRegistration,
    userLogin,
    sendResetPasswordEmail,
    resetPassword,
    updateUser,
    deleteWishlistProduct,
    addWishlistProduct,
    addProductInCart,
    removeProductInCart
}