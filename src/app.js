"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: ['https://vnsluxe.vercel.app', 'http://localhost:3000'], // This allows all origins
    credentials: true,
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'PATCH']
    // This is optional, use it if you need to allow credentials
}));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ limit: "1mb" }));
app.use("/api/v1/auth", userRoutes_1.default);
app.use("/api/v1/category", categoryRoutes_1.default);
app.use("/api/v1/product", productRoutes_1.default);
app.use("/api/v1/banner", bannerRoutes_1.default);
