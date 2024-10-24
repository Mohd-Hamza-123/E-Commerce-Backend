"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const router = (0, express_1.Router)();
router.post(`place-order`, auth_middleware_1.checkUserAuthorized);
exports.default = router;
