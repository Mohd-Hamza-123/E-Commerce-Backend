import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { jwt_secret_key } from "../server";

const hashPassword: (password: string) => Promise<string | null> = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword
    } catch (error) {
        return null
    }
}

const generateToken = async (userID: string, expire: string = "5d"): Promise<string | null> => {
    try {
        if (!jwt_secret_key) throw new Error
        const secret = userID + jwt_secret_key
        const token = jwt.sign({ userID: userID }, secret, { expiresIn: expire })

        return token
    } catch (error) {
        return null
    }

}

export { hashPassword, generateToken }