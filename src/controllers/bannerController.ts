import { Request, Response } from "express";


const upload_Crousal_Images = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.files) throw new Error("No Images Received at Server")
            
        const files = req?.files as { [fieldname: string]: Express.Multer.File[] }
        console.log(files);
        return res.json({ success: true })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Images not uploaded",
            error
        })
    }
}

export {
    upload_Crousal_Images
}