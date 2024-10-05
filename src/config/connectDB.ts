import mongoose from "mongoose";
import { mongoDBURI } from "../server";



const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${mongoDBURI}`)
        console.log("connection Instance : ", connectionInstance.connection.host)
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }

}

export default connectDB