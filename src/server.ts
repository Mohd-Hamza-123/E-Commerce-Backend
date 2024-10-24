
import dotenv from "dotenv"
import connectDB from './config/connectDB'
import { connect_nodemailer } from './config/mail-send'
import { app } from "./app";
import { connectCloudinary } from "./config/connectCloudinary";

// configuring env
dotenv.config({ path: './.env' });

// Env Variables
export const client_URL = process.env.CLIENT_URL
export const port = process.env.PORT || 8080
export const mongoDBURI = process.env.MONGO_URI
export const jwt_secret_key = process.env.JWT_SECRET_KEY
export const EMAIL_HOST = process.env.EMAIL_HOST
export const EMAIL_PORT = process.env.EMAIL_PORT
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
export const EMAIL_FROM = process.env.EMAIL_FROM
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

// console.log(EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME)

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at port : ${port}`)
    })
  })
  .then(() => {
    connect_nodemailer()
  })
  .then(() => {
    connectCloudinary()
  })
  .catch((err) => {
    console.log(err)
  })







