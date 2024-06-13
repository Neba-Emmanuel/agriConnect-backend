"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// @route   POST /auth/register
// @desc    Register user
// @access  Public
router.post("/register", authController_1.register);
// @route   POST /auth/login
// @desc    Login user & get token
// @access  Public
router.post("/login", authController_1.login);
// @route   GET /user
// @desc    Get user info
// @access  Private
router.get("/user", authMiddleware_1.authMiddleware, authController_1.getUser);
router.get("/user/logout", authController_1.logout);
exports.default = router;
