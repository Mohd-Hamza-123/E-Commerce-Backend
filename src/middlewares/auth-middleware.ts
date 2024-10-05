import jwt, { JwtPayload } from "jsonwebtoken"
import { UserModel } from "../models/user.model"
import { RequestHandler } from "express"
import { jwt_secret_key } from "../server"


declare module 'express-serve-static-core' {
    export interface Request {
        user?: string;
        role?: string;
    }
}

interface CustomJwtPayload extends JwtPayload {
    userID: string
}

const checkUserAuthorized: RequestHandler = (req, res, next) => {
    try {

        const { authorization } = req.headers as { authorization?: string | undefined }

        const { userID: ID } = req.body;
      
        if (authorization && jwt_secret_key) {

            let token;
            if (authorization.startsWith("Bearer")) {
                token = authorization.split(" ")[1];
                console.log(token)
            } else {
                token = authorization
            }

            const { userID } = jwt.verify(token, ID + jwt_secret_key) as CustomJwtPayload
            req.user = userID
            next()
        }
    } catch (error) {
        res.status(401).json({ success: false, message: "Authorization token needed0" })
    }
}

const userIsAdmin: RequestHandler = async (req, res, next) => {
    try {

        const userID = req.user

        const user = await UserModel.findById(userID);

        if (user?.role === "user") {
            res.status(400).json({ success: false, message: "user is not admin", role: user.role })
        } else if (user?.role === 'admin') {
            req.role = user?.role
            next();
        } else {
            res.status(400).json({ success: false, message: "user role is incorrect" })
        }

    } catch (error) {
        res.status(400).json({ success: false, message: "Internal Server Error" })
    }

}

const userIsSuperUser: RequestHandler = async (req, res, next) => {
    try {
        const userID = req.user

        const user = await UserModel.findById(userID);

        if (!user)
            return res.status(400).json({ success: false, message: "user not exist" })


        if (user?.role === "superUser") {
            req.role = user?.role
            next();
        }
        else
            res.status(400).json({ success: false, message: "You are not authorized", role: user?.role })


    } catch (error) {
        res.status(400).json({ success: false, message: "Internal Server Error" })
    }

}

const userIsAdminOrSuperUser: RequestHandler = async (req, res, next) => {
    try {

        const userID = req.user

        const user = await UserModel.findById(userID);

        if (user?.role === "user") {
            res.status(400).json({ success: false, message: "user is not admin", role: user.role })
        } else if (user?.role === 'admin') {
            req.role = user?.role
            next();
        } else if (user?.role === 'superUser') {
            req.role = user?.role
            next()
        }
        else {
            res.status(400).json({ success: false, message: "user role is incorrect" })
        }

    } catch (error) {
        res.status(400).json({ success: false, message: "Internal Server Error" })
    }

}

export {
    checkUserAuthorized,
    userIsAdmin,
    userIsSuperUser,
    userIsAdminOrSuperUser
}

