import { Response, Request } from "express";

const createOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.send("")
    } catch (error) {
        return res.send("")
    }
}

export {
    createOrder
}