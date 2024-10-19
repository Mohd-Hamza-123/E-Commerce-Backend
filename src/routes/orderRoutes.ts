import { Router } from "express";
import { checkUserAuthorized } from "../middlewares/auth-middleware";

const router = Router()

router.post(
    `place-order`,
    checkUserAuthorized,
    // createOrder,
)


export default router