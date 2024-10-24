import express from 'express'
import cors from "cors"

const app = express()
app.use(cors({
    origin: ['http://localhost:3000', `${client_URL}`]
}))

import userRoutes from './routes/userRoutes'
import categoryRoutes from './routes/categoryRoutes'
import productRoutes from './routes/productRoutes'
import bannerRoutes from './routes/bannerRoutes'
import { client_URL } from './server'

app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ limit: "1mb" }));
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/banner", bannerRoutes)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

export { app }