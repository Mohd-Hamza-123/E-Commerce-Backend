import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '../server';


// Configuration
export async function connectCloudinary() {
    try {
        cloudinary.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET
        });
        console.log('Cloudinary successfully configured.');
    } catch (error) {
        console.error('Error configuring Cloudinary:', error);
        throw new Error('Failed to configure Cloudinary. Please check your API credentials.');
    }
}



// Upload an image
export const uploadImageOnCloudinary = async (filePath: string) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath)
        // console.log(uploadResult)
        return uploadResult
    } catch (error) {
        return null
    }
}


export const deleteFile = async (publicId: string) => {
    try {
        // console.log(publicId)
        const result = await cloudinary.uploader.destroy(publicId);
        return true
    } catch (error) {
        return false
    }
}


